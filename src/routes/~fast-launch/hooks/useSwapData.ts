import { useCallback, useEffect, useMemo, useRef } from 'react';

import { slippageValueAtom, transactionSettings } from '@atoms/index';
import { useDisclosure } from '@chakra-ui/react';
import { PublicKey } from '@solana/web3.js';
import { useAtom, useAtomValue } from 'jotai';

import { TradeTypes } from '@app-types/index';

import {
  LOCK_FEE,
  NATIVE_TOKEN,
  NATIVE_TOKEN_ADDRESS,
  NATIVE_TOKEN_DECIMAL,
} from '@constants/config';
import { isApeInTradeEnabled } from '@constants/config/features';
import { TRANSACTION_MESSAGES } from '@constants/messages';
import useGetCurveSettings from '@hooks/apein/useGetCurveSettings';
import { useGetPoolById } from '@hooks/apein/useGetPool';
import { useApeInSettings } from '@hooks/apein/usePoolSettings';
import { useTokenBalance } from '@hooks/useGetTokenBalance';
import { useTokenInstance } from '@hooks/useGetTokenInstance';
import useMaxBalance from '@hooks/useMaxBalance';
import { useWeb3React } from '@hooks/useWeb3React';
import { PoolMath } from '@utils/apeInPoolMath';
import BaseDecimal, { ZERO } from '@utils/decimalHelper';
import { formatNumber, NumberFormatType } from '@utils/formatNumbers';
import { formatTemplate } from '@utils/formatTemplate';
import { Token } from '@utils/token';

import { swapInput, SwapInputKeys, tradeType } from '../state/atom';
import { useFastLaunchParams } from './useFastLaunchParams';
import { useFastLaunchSearchParams } from './useFastLaunchSearchParams';
import { useTokenLock } from './useLockCountdown';
import { useTradeParams } from './useTradeParams';

export const useSwapData = () => {
  const slippage = useAtomValue(slippageValueAtom);
  const { showConfirmationPopUp } = useAtomValue(transactionSettings);

  const { tokenAddress } = useFastLaunchParams();
  const { in: tokenIn, out } = useTradeParams();
  const { pool } = useFastLaunchSearchParams();
  const { data: poolData, isLoading: isPoolDataLoading } = useGetPoolById(pool);
  const { getLockdata } = useTokenLock(poolData?.lockEndTime, true);
  const [type, setType] = useAtom(tradeType);
  const isBuy = useMemo(() => type === TradeTypes.BUY, [type]);
  const { isConnected, publicKey } = useWeb3React();
  const { data: poolSettings } = useApeInSettings();
  const { curveSettings } = useGetCurveSettings(poolData?.curveAccount);
  const outToken = useTokenInstance(
    out,
    out.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase(),
    true
  );

  const inToken = useTokenInstance(tokenIn, tokenIn.toLowerCase() === NATIVE_TOKEN_ADDRESS, true);

  const getLockFee = () => {
    if (
      tokenIn.toString() === NATIVE_TOKEN_ADDRESS &&
      publicKey?.toString() === poolData?.poolCreator?.toString() &&
      poolData?.hasTokenLockBeenApplied &&
      getLockdata().isLockActive
    ) {
      return LOCK_FEE;
    }
    return ZERO;
  };
  const {
    balance: solBalance,
    isLoading: isSolBalanceLoading,
    refetch: refetchSolBalance,
  } = useTokenBalance(new PublicKey(NATIVE_TOKEN_ADDRESS), true);

  const {
    balance: tokenBalance,
    isLoading: isTokenBalanceLoading,
    refetch: refetchTokenBalance,
  } = useTokenBalance(tokenAddress ? new PublicKey(tokenAddress) : undefined, false);

  const [balance, isLoading, refetch] = useMemo(() => {
    if (!inToken?.isNative) return [tokenBalance, isTokenBalanceLoading, refetchTokenBalance];
    return [solBalance, isSolBalanceLoading, refetchSolBalance];
  }, [
    inToken?.isNative,
    isSolBalanceLoading,
    isTokenBalanceLoading,
    refetchSolBalance,
    refetchTokenBalance,
    solBalance,
    tokenBalance,
  ]);

  const [values, setSwapValue] = useAtom(swapInput);

  const lastTarget = useRef<{ isBuy: boolean; target: null | SwapInputKeys; value: string }>({
    isBuy,
    target: null,
    value: '',
  });
  const confirmation = useDisclosure({ defaultIsOpen: false });

  const formatedBalence = formatNumber({
    input: Token.fromRawAmount(balance ?? 0, inToken?.decimal),
    suffix: inToken?.symbol,
    type: NumberFormatType.TokenBalanceFormatter,
  });

  const maxAllowedSolInput = useMemo(() => {
    if (!curveSettings || !poolData || !poolSettings) return ZERO;
    const { solBalance: poolSolBalance } = poolData;
    const { tradeFeeDenominator, tradeFeeNumerator } = poolSettings;
    const allowedSolIntoPool = curveSettings.maxRaiseAmount.minus(poolSolBalance);
    const portionAfterFees = BaseDecimal.toDecimal(1).minus(
      tradeFeeNumerator.div(tradeFeeDenominator)
    );

    const maxInputNeeded = allowedSolIntoPool.div(portionAfterFees);

    return maxInputNeeded.floor();
  }, [curveSettings, poolData, poolSettings]);

  const formattedMinimumSol = useMemo(() => {
    if (!poolSettings) return ZERO.valueOf();
    const allowedMinAmount =
      maxAllowedSolInput.greaterThan(poolSettings.tradeMinimumSolAmount) || !isBuy ?
        poolSettings.tradeMinimumSolAmount
      : maxAllowedSolInput;
    return formatNumber({
      input: Token.fromRawAmount(allowedMinAmount),
      type: NumberFormatType.SwapTradeAmountFormatter,
    });
  }, [isBuy, maxAllowedSolInput, poolSettings]);

  const insufficentFund = Token.fromRawAmount(balance ?? 0, inToken?.decimal).lessThan(
    BaseDecimal.toDecimal(values.in || 0).add(Token.fromRawAmount(getLockFee()))
  );

  const getMaximumAllowedSol = useCallback(
    (input: string) => {
      const sol = Token.toRawAmount(input);

      if (sol.greaterThanOrEqualTo(maxAllowedSolInput)) {
        return maxAllowedSolInput;
      }
      return sol;
    },
    [maxAllowedSolInput]
  );

  const [buttonEnabled, buttonLabel, description] = useMemo(() => {
    if (!isApeInTradeEnabled)
      return [
        false,
        TRANSACTION_MESSAGES.TRADE_DISABLED,
        TRANSACTION_MESSAGES.TRADE_FEATURE_DISABLED,
      ];

    // wallet not connected
    if (!isConnected) return [false];
    // no data
    if (!poolData || !poolSettings || !curveSettings)
      return [false, TRANSACTION_MESSAGES.FETCHING_POOL_DATA];

    if (!parseFloat(values.in) && !parseFloat(values.out))
      return [false, TRANSACTION_MESSAGES.EMPTY_INPUT_VALUE];
    if (poolData.curveThresholdReached)
      // bonding curve completed
      return [false, TRANSACTION_MESSAGES.BONDING_CURVE_COMPLETED];

    // if minimum required input is not reached for SOL (including fee) and if max allowed sol to pool is less than minAmountRequired
    const solInput = Token.toRawAmount(isBuy ? values.in : values.out);
    if (
      !PoolMath.isValidSolInput({
        maxAllowedSolInput,
        solInput,
        tradeMinimumSolAmount: poolSettings.tradeMinimumSolAmount,
      })
    )
      return [
        false,
        TRANSACTION_MESSAGES.EMPTY_INPUT_VALUE,
        formatTemplate(TRANSACTION_MESSAGES.SHOULD_HAVE_MINIMUM_AMOUNT, [formattedMinimumSol]),
      ];
    if (!parseFloat(values.in) || !parseFloat(values.out))
      return [false, TRANSACTION_MESSAGES.EMPTY_INPUT_VALUE];

    if (insufficentFund) {
      const insufficentFee = Token.fromRawAmount(balance ?? 0, inToken?.decimal).lessThan(
        BaseDecimal.toDecimal(values.in || 0)
      );
      return [
        false,
        formatTemplate(TRANSACTION_MESSAGES.NO_BALANCE, [inToken?.symbol ?? '']),
        isBuy ?
          formatTemplate(TRANSACTION_MESSAGES.NO_MINIMUM_BALANCE, [
            `${!insufficentFee ? '0.02' : '0.01'} ${inToken?.symbol ?? ''}`,
          ])
        : undefined,
      ];
    }
    const info =
      isBuy ?
        Token.toRawAmount(values.in).greaterThan(maxAllowedSolInput) ?
          formatTemplate(TRANSACTION_MESSAGES.MAX_INPUT_REACHED, [
            `${formatNumber({ input: Token.fromRawAmount(maxAllowedSolInput.toString(), NATIVE_TOKEN_DECIMAL), type: NumberFormatType.TableDataFormatter })}${NATIVE_TOKEN.symbol}`,
          ])
        : ''
      : '';
    if (showConfirmationPopUp) return [true, `Confirm & ${isBuy ? 'buy' : 'sell'} token`, info];
    return [true, `${isBuy ? 'Buy' : 'Sell'} token`, info];
  }, [
    isConnected,
    poolData,
    poolSettings,
    curveSettings,
    values.in,
    values.out,
    isBuy,
    maxAllowedSolInput,
    formattedMinimumSol,
    insufficentFund,
    showConfirmationPopUp,
    balance,
    inToken?.decimal,
    inToken?.symbol,
  ]);

  const maxAvilableBalance = useMaxBalance(balance, isBuy);

  const setUserInputs = useCallback(
    (value: string, userInput: SwapInputKeys) => {
      lastTarget.current = {
        isBuy,
        target: userInput as SwapInputKeys,
        value,
      };
      if (!poolData || !inToken || !outToken || !curveSettings) return;
      const target = userInput === 'out' ? 'in' : 'out';

      const expectedOutPut =
        userInput === 'in' ?
          PoolMath.exactOutputForSwapInput({
            amountIn:
              isBuy ? getMaximumAllowedSol(value) : Token.toRawAmount(value, inToken.decimal),
            coefficient1: poolData.coefficient1,
            coefficient2: poolData.coefficient2,
            maxSolInput: maxAllowedSolInput,
            productConstant: curveSettings.productConstant,
            tradeType: isBuy ? TradeTypes.BUY : TradeTypes.SELL,
          })
        : PoolMath.exactInputForSwapOutput({
            amountOut: Token.toRawAmount(value, outToken.decimal),
            coefficient1: poolData.coefficient1,
            coefficient2: poolData.coefficient2,
            maxSol: maxAllowedSolInput,
            productConstant: curveSettings.productConstant,
            tradeType: isBuy ? TradeTypes.BUY : TradeTypes.SELL,
          });
      setSwapValue(() => ({
        in: '',
        out: '',
        [target as SwapInputKeys]:
          expectedOutPut && expectedOutPut.toString() !== '0' ?
            formatNumber({
              input: Token.fromRawAmount(
                expectedOutPut,
                userInput === 'out' ? inToken?.decimal : outToken?.decimal
              ),
              type: NumberFormatType.SwapTradeAmountFormatter,
            })
          : '',
        [userInput as SwapInputKeys]: value,
      }));
    },
    [
      curveSettings,
      getMaximumAllowedSol,
      inToken,
      isBuy,
      maxAllowedSolInput,
      outToken,
      poolData,
      setSwapValue,
    ]
  );

  // ref to keep the context of setUserInputs latest
  const setUserInputsRef = useRef(setUserInputs);

  // update the context of setUserInputs
  useEffect(() => {
    setUserInputsRef.current = setUserInputs;
  }, [setUserInputs]);

  useEffect(() => {
    // Clear any existing interval
    let intervalId: NodeJS.Timeout | null = null;
    const { target, value } = lastTarget.current;

    if (
      !poolData?.coefficient1 ||
      !poolData?.coefficient2 ||
      !curveSettings?.productConstant ||
      !target ||
      !value ||
      confirmation.isOpen ||
      !values.in
    )
      return;
    // Set up a new interval
    intervalId = setInterval(() => {
      setUserInputsRef.current(value, target);
    }, 5000);

    // Clean up the interval on component unmount or when userInput changes
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmation.isOpen, values.in]);

  const { isOpen: showWaring, onClose, onOpen } = useDisclosure();

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'out' && !showWaring) {
      onOpen();
    } else if ((name === 'in' && showWaring) || !value || !value.trim()) {
      onClose();
    }

    setUserInputs(value, name as SwapInputKeys);
  };

  const onSetMaxAmount = () => {
    onClose();
    if (!maxAvilableBalance) return;
    if (inToken?.address?.toString() !== NATIVE_TOKEN.address.toString()) {
      setUserInputs(Token.fromRawAmount(maxAvilableBalance, inToken?.decimal).toString(), 'in');
      return;
    }

    const maxUsableBalance = maxAvilableBalance.minus(getLockFee());
    if (maxUsableBalance.lessThanOrEqualTo(0)) return setUserInputs('0', 'in');

    if (maxUsableBalance.greaterThanOrEqualTo(maxAllowedSolInput)) {
      setUserInputs(
        formatNumber({
          input: Token.fromRawAmount(maxAllowedSolInput),
          placeholder: '0',
          type: NumberFormatType.UserInputFormatter,
        }),
        'in'
      );
      return;
    }

    return setUserInputs(
      formatNumber({
        input: Token.fromRawAmount(maxUsableBalance),
        placeholder: '0',
        type: NumberFormatType.UserInputFormatter,
      }),
      'in'
    );
  };

  const onToggle = () => {
    setType(isBuy ? TradeTypes.SELL : TradeTypes.BUY);
  };
  const reset = () => {
    lastTarget.current = { isBuy, target: null, value: '' };
  };

  useEffect(() => {
    if (lastTarget.current.isBuy !== isBuy) {
      const { target, value } = lastTarget.current;
      const currentTarget = target === 'in' ? 'out' : 'in';
      setUserInputs(value, currentTarget);
      lastTarget.current = {
        isBuy,
        target: currentTarget,
        value,
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBuy]);
  const fee = useMemo(() => {
    const value = isBuy ? values.in : values.out;
    if (isPoolDataLoading || !poolData || !poolSettings || !value) {
      return '0';
    }
    return PoolMath.getSwapFee({
      solAmount: BaseDecimal.toDecimal(value),
      tradeFeeDenominator: poolSettings.tradeFeeDenominator,
      tradeFeeNumerator: poolSettings.tradeFeeNumerator,
    }).toString();
  }, [isBuy, values.in, values.out, isPoolDataLoading, poolData, poolSettings]);

  return {
    balance,
    bondingCurveCompleted: !!poolData?.curveThresholdReached,
    buttonEnabled,
    buttonLabel,
    confirmation,
    currentMarketPrice: poolData?.tokenPrice,
    description,
    fee,
    formatedBalence,
    isBuy,
    isTokenBalenceLoading: isLoading,
    maxAllowedSolInput,
    onChangeHandler,
    onSetMaxAmount,
    onToggle,
    refetchTokenBalence: refetch,
    reset,

    showWaring,
    slippage,
    targetToken: tokenAddress,
    tokenIn: inToken,
    tokenOut: outToken,
    transactionLockFee: Token.fromRawAmount(getLockFee()).toString(),
    values,
  };
};
