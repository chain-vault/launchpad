import { useCallback, useEffect, useMemo, useState } from 'react';

import { slippageValueAtom, transactionSettings } from '@atoms/index';
import { useDisclosure } from '@chakra-ui/react';
import { BN, type Idl } from '@coral-xyz/anchor';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';
import { ComputeBudgetProgram, PublicKey } from '@solana/web3.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import Decimal from 'decimal.js';
import { useAtomValue } from 'jotai';

import { LBPPoolStatus, TradeTypes } from '@app-types/index';

import { NATIVE_TOKEN_ADDRESS, NATIVE_TOKEN_DECIMAL } from '@constants/config';
import { InputCardContext, ToastType } from '@constants/index';
import { TRANSACTION_MESSAGES } from '@constants/messages';
import {
  SOMETHING_WENT_WRONG,
  UNAUTHORIZED_SIGNER_OR_FUND_CLAIMED,
} from '@constants/programErrors';
import { useGetPoolById } from '@hooks/lbp/useGetPool';
import useLBPSettings from '@hooks/lbp/useLBPSettings';
import { useGetProgramInstance } from '@hooks/useGetProgramInstance';
import { useTokenBalance } from '@hooks/useGetTokenBalance';
import { useTokenInstance } from '@hooks/useGetTokenInstance';
import { createActions, useProgressiveToast } from '@hooks/useProgressiveToast';
import { useTokenMetadata } from '@hooks/useToken';
import useTransaction from '@hooks/useTransaction';
import { getConnection, useWeb3React } from '@hooks/useWeb3React';
import { ApeonLbp, LBPIdl } from '@idl/lbp';
import { usePoolId } from '@routes/~lbp/~swap/hooks/usePoolId';
import { useTokenAddress } from '@routes/~lbp/~swap/hooks/useTokenAddress';
import { formatNumber, NumberFormatType } from '@utils/formatNumbers';
import { formatTemplate } from '@utils/formatTemplate';
import { calculateAmountWithSlippage } from '@utils/formatValues';
import { PoolWeightedMath } from '@utils/poolWeightedMath';
import { Token } from '@utils/token';

type SwapInputInfo = {
  amountCalculatedTime: number;
  currentInputCardContext: InputCardContext | undefined;
  expectedUserOutput: string;
  userInput: string;
};

export const useSwap = (currentPoolStatus?: LBPPoolStatus) => {
  const { customRPCUrl, selectedRPC } = useAtomValue(transactionSettings);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const connection = useMemo(() => getConnection(), [selectedRPC, customRPCUrl]);

  const { publicKey } = useWeb3React();
  const lbpProgram = useGetProgramInstance<ApeonLbp>(LBPIdl as Idl);
  const slippage = useAtomValue(slippageValueAtom);
  const queryClient = useQueryClient();
  const [txHash, setTxHash] = useState<string>('');
  const [tradeType, setTradeType] = useState<TradeTypes>(TradeTypes.BUY);
  const IS_BUY = tradeType === TradeTypes.BUY;
  const { data: lbpSettings } = useLBPSettings();
  const { showToast } = useProgressiveToast(
    {},
    {
      variant: 'secondary',
    }
  );

  const {
    isOpen: isSwapConfirmModalOpen,
    onClose: onCloseSwapConfirmModal,
    onOpen: onOpenSwapConfirmModal,
  } = useDisclosure();

  const { sendAndConfirmTransaction } = useTransaction((txId) => setTxHash(txId));
  const poolTokenAddress = useTokenAddress();

  const { poolTokenMetadata } = useTokenMetadata(poolTokenAddress);

  const tokenInAdd = IS_BUY ? NATIVE_TOKEN_ADDRESS : poolTokenAddress;
  const tokenOutAdd = IS_BUY ? poolTokenAddress : NATIVE_TOKEN_ADDRESS;

  const poolId = usePoolId();

  const { data: poolData, isLoading: isPoolDataLoading } = useGetPoolById(poolId);

  const [swapInputInfo, setSwapInputInfo] = useState<SwapInputInfo>({
    amountCalculatedTime: dayjs().unix(),
    currentInputCardContext: undefined,
    expectedUserOutput: '',
    userInput: '',
  });

  const tokenIn = useTokenInstance(tokenInAdd, tokenInAdd?.toLowerCase() === NATIVE_TOKEN_ADDRESS);

  const tokenOut = useTokenInstance(
    tokenOutAdd,
    tokenOutAdd?.toLowerCase() === NATIVE_TOKEN_ADDRESS
  );

  const {
    balance: solBalance,
    isLoading: isSolBalanceLoading,
    refetch: refetchSolBalance,
  } = useTokenBalance(new PublicKey(NATIVE_TOKEN_ADDRESS), true);

  const {
    balance: tokenBalance,
    isLoading: isTokenBalanceLoading,
    refetch: refetchTokenBalance,
  } = useTokenBalance(poolTokenAddress ? new PublicKey(poolTokenAddress) : undefined, false);

  const [tokenInBalance, tokenInBalanceLoading, refetchTokenInBalance] = useMemo(() => {
    if (!tokenIn?.isNative) return [tokenBalance, isTokenBalanceLoading, refetchTokenBalance];
    return [solBalance, isSolBalanceLoading, refetchSolBalance];
  }, [
    isSolBalanceLoading,
    isTokenBalanceLoading,
    refetchSolBalance,
    refetchTokenBalance,
    solBalance,
    tokenBalance,
    tokenIn?.isNative,
  ]);

  const onCalculateSwapAmounts = useCallback(
    (amountIn?: string, context?: InputCardContext) => {
      const cardContext = context || swapInputInfo.currentInputCardContext;
      const inputAmount = amountIn || swapInputInfo.userInput;
      if (
        !poolData ||
        !tokenIn ||
        !tokenOut ||
        (!swapInputInfo.userInput && !amountIn) ||
        amountIn === ''
      ) {
        setSwapInputInfo({
          amountCalculatedTime: dayjs().unix(),
          currentInputCardContext: cardContext,
          expectedUserOutput: '',
          userInput: '',
        });
        return;
      }
      const amount =
        cardContext === InputCardContext.TOKENIN ?
          PoolWeightedMath.exactOutputForSwapInput({
            amountIn: inputAmount,
            pool: poolData,
            shouldIncludeSwapFee: true,
            tokenIn,
            tokenOut,
          })
        : PoolWeightedMath.exactInputForSwapOut({
            amountOut: inputAmount,
            pool: poolData,
            shouldIncludeSwapFee: true,
            tokenIn,
            tokenOut,
          });
      setSwapInputInfo((currentInfo) => ({
        amountCalculatedTime: dayjs().unix(),
        currentInputCardContext: cardContext,
        expectedUserOutput: amount,
        userInput: amountIn ?? currentInfo.userInput,
      }));
    },
    [poolData, swapInputInfo, tokenIn, tokenOut]
  );

  const onChangeSwapAmount = (amountIn: string, context?: InputCardContext) => {
    if (!context) {
      // it means to reset the data
      setSwapInputInfo({
        amountCalculatedTime: dayjs().unix(),
        currentInputCardContext: undefined,
        expectedUserOutput: '',
        userInput: '',
      });
      return;
    }
    setSwapInputInfo((currentSwapInfo) => ({
      ...currentSwapInfo,
      currentInputCardContext: context,
      userInput: amountIn,
    }));
    onCalculateSwapAmounts(amountIn, context);
  };

  const onSwitchTokens = () => {
    setTradeType((prev) => (prev === TradeTypes.BUY ? TradeTypes.SELL : TradeTypes.BUY));
  };

  const [swapAmountIn, swapAmountInDisplayValue] = useMemo(
    () =>
      (
        swapInputInfo.currentInputCardContext === InputCardContext.TOKENIN ||
        !swapInputInfo.currentInputCardContext
      ) ?
        [swapInputInfo.userInput, swapInputInfo.userInput]
      : [
          swapInputInfo.expectedUserOutput,
          swapInputInfo.userInput &&
            formatNumber({
              input: swapInputInfo.expectedUserOutput,
              type: NumberFormatType.SwapTradeAmountFormatter,
            }),
        ],
    [
      swapInputInfo.currentInputCardContext,
      swapInputInfo.expectedUserOutput,
      swapInputInfo.userInput,
    ]
  );

  const [swapAmountOut, swapAmountOutDisplayValue] = useMemo(
    () =>
      (
        swapInputInfo.currentInputCardContext === InputCardContext.TOKENOUT ||
        !swapInputInfo.currentInputCardContext
      ) ?
        [swapInputInfo.userInput, swapInputInfo.userInput]
      : [
          swapInputInfo.expectedUserOutput,
          swapInputInfo.userInput &&
            formatNumber({
              input: swapInputInfo.expectedUserOutput,
              type: NumberFormatType.SwapTradeAmountFormatter,
            }),
        ],
    [
      swapInputInfo.currentInputCardContext,
      swapInputInfo.expectedUserOutput,
      swapInputInfo.userInput,
    ]
  );

  const swapFee = useMemo(() => {
    if (!poolData) return '';
    if (tokenIn?.isCollateral && swapAmountIn) {
      return PoolWeightedMath.getSwapFee({
        solAmount: swapAmountIn,
        tradeFeeDenominator: poolData.swapFeeDenominator,
        tradeFeeNumerator: poolData.swapFeeNumerator,
      }).valueOf();
    }
    if (tokenOut?.isCollateral && swapAmountOut) {
      return PoolWeightedMath.getSwapFee({
        solAmount: swapAmountOut,
        tradeFeeDenominator: poolData.swapFeeDenominator,
        tradeFeeNumerator: poolData.swapFeeNumerator,
      }).valueOf();
    }
    return '';
  }, [poolData, swapAmountIn, swapAmountOut, tokenIn?.isCollateral, tokenOut?.isCollateral]);

  useEffect(() => {
    if (swapInputInfo.userInput) {
      onChangeSwapAmount(
        swapInputInfo.userInput,
        swapInputInfo.currentInputCardContext === InputCardContext.TOKENIN ?
          InputCardContext.TOKENOUT
        : InputCardContext.TOKENIN
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenInAdd, tokenOutAdd]);

  useEffect(() => {
    // Clear any existing interval
    let intervalId: NodeJS.Timeout | null = null;

    if (swapInputInfo.userInput !== '' && !isSwapConfirmModalOpen) {
      // Set up a new interval
      intervalId = setInterval(onCalculateSwapAmounts, 5000);
    }

    // Clean up the interval on component unmount or when userInput changes
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isSwapConfirmModalOpen, onCalculateSwapAmounts, swapInputInfo.userInput]);

  const isCreatorView = poolData?.creator.toString() === publicKey?.toString();
  const swapTitle = useMemo(
    () =>
      `${formatNumber({ input: swapAmountIn, type: NumberFormatType.TokenBalanceFormatter })} ${tokenIn?.symbol} to ${formatNumber({ input: swapAmountOut, type: NumberFormatType.TokenBalanceFormatter })} ${tokenOut?.symbol}`,
    [swapAmountIn, swapAmountOut, tokenIn?.symbol, tokenOut?.symbol]
  );
  /**
   * Disabled on conditions :
   * 1. Claimed fund
   * 2. No input
   * 3. Insufficiet balance
   * 4. Recalculating amounts or fetching pool datas
   */
  const [buttonDisabled, disabledMessage, description] = useMemo(() => {
    if (!poolData || !lbpSettings) return [true, 'Fetching pool info'];
    if (lbpSettings?.isPaused) return [true, 'LBP is paused'];

    if (currentPoolStatus === LBPPoolStatus.COMPLETED)
      if (isCreatorView && poolData.isSolClaimed) return [true, 'Funds claimed'];
      else return [false, ''];

    // Enter an amount state
    if (!swapAmountIn || !parseFloat(swapAmountIn) || !parseFloat(swapAmountOut))
      return [true, 'Enter an amount'];

    // Insufficient Balance
    if (
      tokenIn &&
      tokenInBalance &&
      swapAmountIn &&
      new Decimal(swapAmountIn).greaterThan(Token.fromRawAmount(tokenInBalance, tokenIn.decimal))
    )
      return [true, `Insufficient ${tokenIn.symbol} balance`];

    if (
      tokenIn?.isCollateral &&
      swapAmountIn &&
      tokenInBalance &&
      new Decimal(swapAmountIn)
        .add(0.01)
        .greaterThan(Token.fromRawAmount(tokenInBalance, tokenIn.decimal))
    )
      return [true, `Insufficient ${tokenIn.symbol} balance`];

    const solAmount = tokenIn?.isCollateral ? swapAmountIn : swapAmountOut;

    if (
      solAmount &&
      new Decimal(Token.toRawAmount(solAmount, NATIVE_TOKEN_DECIMAL)).lessThan(
        new Decimal(lbpSettings?.tradeMinimumSolAmount ?? '')
      )
    ) {
      return [
        true,
        'Enter an amount',
        formatTemplate(TRANSACTION_MESSAGES.SHOULD_HAVE_MINIMUM_AMOUNT, [
          formatNumber({
            input: Token.fromRawAmount(lbpSettings?.tradeMinimumSolAmount ?? '').toString(),
            type: NumberFormatType.SwapTradeAmountFormatter,
          }),
        ]),
      ];
    }

    if (isPoolDataLoading) return [true, 'Recalculating'];
    return [false, ''];
  }, [
    currentPoolStatus,
    isCreatorView,
    isPoolDataLoading,
    lbpSettings,
    poolData,
    swapAmountIn,
    swapAmountOut,
    tokenIn,
    tokenInBalance,
  ]);

  const swap = async () => {
    try {
      setTxHash('');
      onCloseSwapConfirmModal();
      if (
        !poolData ||
        !tokenIn ||
        !tokenOut ||
        !swapAmountIn ||
        !lbpProgram ||
        !publicKey ||
        !lbpSettings?.tradeFeeWallet
      )
        throw new Error(SOMETHING_WENT_WRONG);

      showToast({
        title: `Swapping ${swapTitle}`,
        type: ToastType.LOADING,
      });
      const amountIn = new BN(Token.toRawAmount(swapAmountIn, tokenIn.decimal).valueOf());

      const mintAccount = poolData.token;

      const [pool] = PublicKey.findProgramAddressSync(
        [mintAccount.toBuffer(), Buffer.from('lbp_launch')],
        lbpProgram.programId
      );

      const [traderTokenAccount] = PublicKey.findProgramAddressSync(
        [publicKey.toBytes(), TOKEN_2022_PROGRAM_ID.toBytes(), mintAccount.toBytes()],
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const traderAccountInfo = await connection.getAccountInfo(traderTokenAccount);

      const instructions = [];

      if (!traderAccountInfo) {
        const createTraderTokenAccountInstruction = createAssociatedTokenAccountInstruction(
          publicKey,
          traderTokenAccount,
          publicKey,
          mintAccount,
          TOKEN_2022_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        );
        instructions.push(createTraderTokenAccountInstruction);
      }

      const [poolTokenAccount] = PublicKey.findProgramAddressSync(
        [pool.toBytes(), TOKEN_2022_PROGRAM_ID.toBytes(), mintAccount.toBytes()],
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      // isBuy flag is true when we are swapping for collaterol token (sol) to get project token
      const isBuy = tokenIn.isCollateral;
      const amountOutMin = calculateAmountWithSlippage(
        swapAmountOut,
        slippage,
        tokenOut.decimal
      ).valueOf();

      const swapInstruction = await lbpProgram.methods
        .swap(isBuy, amountIn, new BN(amountOutMin))
        .accounts({
          mint: mintAccount,
          poolTokenAccount,
          program: lbpProgram.programId,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          tradeFeeWallet: new PublicKey(lbpSettings?.tradeFeeWallet),
          traderTokenAccount,
        })
        .instruction();

      instructions.push(swapInstruction);

      const computeBudgettx = ComputeBudgetProgram.setComputeUnitLimit({
        units: 300_000,
      });

      instructions.push(computeBudgettx);

      const txId = await sendAndConfirmTransaction(instructions, []);
      setTxHash(txId);
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error(SOMETHING_WENT_WRONG);
    }
  };

  const claimFund = async () => {
    setTxHash('');

    try {
      if (!poolData || !lbpProgram || !publicKey || !lbpSettings)
        throw new Error(SOMETHING_WENT_WRONG);
      if (currentPoolStatus === LBPPoolStatus.COMPLETED && isCreatorView && poolData?.isSolClaimed)
        throw new Error(UNAUTHORIZED_SIGNER_OR_FUND_CLAIMED);
      const mintAccount = poolData.token;

      showToast({
        title: 'Claiming your token',
        type: ToastType.LOADING,
      });

      const [pool] = PublicKey.findProgramAddressSync(
        [mintAccount.toBuffer(), Buffer.from('lbp_launch')],
        lbpProgram.programId
      );

      const [poolTokenAccount] = PublicKey.findProgramAddressSync(
        [pool.toBytes(), TOKEN_2022_PROGRAM_ID.toBytes(), mintAccount.toBytes()],
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const [traderTokenAccount] = PublicKey.findProgramAddressSync(
        [publicKey.toBytes(), TOKEN_2022_PROGRAM_ID.toBytes(), mintAccount.toBytes()],
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const instruction = await lbpProgram.methods
        .claimFund()
        .accounts({
          mint: mintAccount,
          platformAuthority: lbpSettings.platformAuthority,
          poolCreatorTokenAccount: traderTokenAccount,
          poolTokenAccount,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .instruction();

      const txId = await sendAndConfirmTransaction([instruction], []);
      setTxHash(txId);
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error(SOMETHING_WENT_WRONG);
    }
  };

  const {
    error: swapError,
    isError,
    isPending,
    isSuccess,
    mutate: onSwap,
  } = useMutation({
    mutationFn: swap,
    onError: (e) => {
      showToast({
        actions: createActions({
          onRetry: onSwap,
          transaction: txHash,
        }),
        message: e.message ?? '',
        title: `Failed to swap tokens`,
        type: ToastType.FAILED,
      });
    },
    onSuccess: () => {
      // invalidate token balances

      showToast({
        actions: createActions({ transaction: txHash }),
        title: `Swap ${swapTitle}`,
        type: ToastType.SUCCESS,
      });
      onChangeSwapAmount('');
      queryClient.invalidateQueries({ queryKey: ['token-balance'] });
    },
  });

  const {
    error: claimError,
    isError: isClaimFundError,
    isPending: isClaimFundPending,
    isSuccess: isClaimFundSuccess,
    mutate: onClaimFund,
  } = useMutation({
    mutationFn: claimFund,
    onError: (e) => {
      showToast({
        actions: createActions({
          onRetry: onClaimFund,
          transaction: txHash,
        }),
        message: e.message ?? '',
        title: 'Failed to claim your token',
        type: ToastType.FAILED,
      });
    },
    onSuccess: () => {
      // invalidate token balances
      showToast({
        actions: createActions({
          transaction: txHash,
        }),
        title: 'You have successfully claimed your tokens',
        type: ToastType.SUCCESS,
      });
      queryClient.invalidateQueries({ queryKey: ['token-balance'] });
      queryClient.invalidateQueries({ queryKey: ['lbpPool', poolId] });
    },
  });

  return {
    buttonDisabled,

    canClaimFund: isCreatorView,
    claimErrorMessage: claimError?.message ?? '',
    description,
    disabledMessage,
    isClaimFundError,
    isClaimFundPending,
    isClaimFundSuccess,
    isError,
    isPending,
    isSuccess,
    isSwapConfirmModalOpen,
    onChangeSwapAmount,
    onClaimFund,
    onCloseSwapConfirmModal,
    onOpenSwapConfirmModal,
    onSwap,
    onSwitchTokens,

    poolTokenMetadata,
    refetchTokenBalance: refetchTokenInBalance,
    slippage,
    swapAmountIn: swapAmountInDisplayValue,
    swapAmountOut: swapAmountOutDisplayValue,
    swapErrorMessage: swapError?.message ?? '',
    swapFee,
    tokenIn,
    tokenInBalance,
    tokenInBalanceLoading,
    tokenOut,
    txHash,
  };
};
