import { useEffect, useMemo } from 'react';

import { Alert, Box, chakra } from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useFormContext } from 'react-hook-form';

import { TradeTypes } from '@app-types/index';

import {
  CurveIndex,
  LOCK_FEE,
  NATIVE_TOKEN_ADDRESS,
  NATIVE_TOKEN_DECIMAL,
} from '@constants/config';
import { TRANSACTION_MESSAGES } from '@constants/messages';
import useGetCurveSettings from '@hooks/apein/useGetCurveSettings';
import { useApeInSettings } from '@hooks/apein/usePoolSettings';
import { useTokenBalance } from '@hooks/useGetTokenBalance';
import useMaxBalance from '@hooks/useMaxBalance';
import { PoolMath } from '@utils/apeInPoolMath';
import BaseDecimal from '@utils/decimalHelper';
import { formatNumber, NumberFormatType } from '@utils/formatNumbers';
import { formatTemplate } from '@utils/formatTemplate';
import { Token } from '@utils/token';

export const InitialBuyCount: React.FC = () => {
  const { clearErrors, getValues, setError, setValue, watch } = useFormContext();
  const { initialBuy, lockToken, tokenTicker } = getValues();
  const { curveSettings, isLoading } = useGetCurveSettings(
    undefined,
    getValues().type || CurveIndex.NANO_LAUNCH
  );
  const { data } = useApeInSettings();
  const { connected } = useWallet();
  const { balance } = useTokenBalance(new PublicKey(NATIVE_TOKEN_ADDRESS), true);
  const maxAvailablebalence = useMaxBalance(balance, true);
  const tokensReceived =
    !isLoading && curveSettings ?
      PoolMath.exactOutputForSwapInput({
        amountIn: Token.toRawAmount(initialBuy),
        coefficient1: curveSettings.coefficient1,
        coefficient2: curveSettings.coefficient2,
        maxSolInput: curveSettings.maxRaiseAmount,
        productConstant: curveSettings.productConstant,
        tradeType: TradeTypes.BUY,
      })
    : BaseDecimal.toDecimal(0);

  const formattedMinimumSol = useMemo(
    () =>
      formatNumber({
        input: Token.fromRawAmount(data?.tradeMinimumSolAmount ?? 0, NATIVE_TOKEN_DECIMAL),
        type: NumberFormatType.SwapTradeAmountFormatter,
      }),
    [data]
  );
  useEffect(() => {
    if (
      connected &&
      initialBuy &&
      Token.toRawAmount(initialBuy, NATIVE_TOKEN_DECIMAL)
        .add(BaseDecimal.toDecimal(lockToken.locked ? LOCK_FEE : 0))
        .greaterThan(BaseDecimal.toDecimal(maxAvailablebalence ?? 0))
    ) {
      setError('initialBuy', {
        message: TRANSACTION_MESSAGES.INSUFFICENT_BALANCE,
      });
    } else {
      clearErrors('initialBuy');
    }
    if (initialBuy) {
      setValue('outToken', tokensReceived.greaterThan(0) ? tokensReceived.toString() : '');
    } else {
      setValue('outToken', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearErrors, initialBuy, lockToken.locked, maxAvailablebalence, setError]);

  watch(['initialBuy', 'tokenTicker']);
  if (!initialBuy || parseFloat(initialBuy) <= 0) {
    return null;
  }
  if (parseFloat(initialBuy) > 0 && parseFloat(tokensReceived.toString()) <= 0) {
    return (
      <Alert borderRadius={5} status="warning" textStyle="body-sm">
        {formatTemplate(TRANSACTION_MESSAGES.SHOULD_HAVE_MINIMUM_AMOUNT, [formattedMinimumSol])}
      </Alert>
    );
  }
  return (
    <Box fontSize={13} textAlign="left">
      You receive
      <chakra.span fontWeight="bold" ml={1}>
        {formatNumber({
          input: Token.fromRawAmount(tokensReceived, 6),
          suffix: (tokenTicker || '').toUpperCase(),
          type: NumberFormatType.TxValuesFormatter,
        })}
      </chakra.span>
    </Box>
  );
};
