import { useMemo, useState } from 'react';

import { slippageValueAtom, tradeReferalCode, transactionSettings } from '@atoms/index';
import { BN, type Idl } from '@coral-xyz/anchor';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useAtom, useAtomValue } from 'jotai';

import {
  CurveIndex,
  EVENT_AUTHORITY,
  LOCK_PROGRAM_ID,
  NATIVE_TOKEN,
  NATIVE_TOKEN_ADDRESS,
} from '@constants/config';
import { isApeInTradeEnabled } from '@constants/config/features';
import { ToastType } from '@constants/index';
import { SOMETHING_WENT_WRONG } from '@constants/programErrors';
import useGetCurveSettings from '@hooks/apein/useGetCurveSettings';
import { useGetPoolById } from '@hooks/apein/useGetPool';
import { useApeInSettings } from '@hooks/apein/usePoolSettings';
import { useGetProgramInstance } from '@hooks/useGetProgramInstance';
import { useTokenInstance } from '@hooks/useGetTokenInstance';
import { createActions, useProgressiveToast } from '@hooks/useProgressiveToast';
import useReferal from '@hooks/useReferal';
import useTransaction from '@hooks/useTransaction';
import { getConnection, useWeb3React } from '@hooks/useWeb3React';
import { FastLauchIdl } from '@idl/fastlaunch';
import { formatNumber, NumberFormatType } from '@utils/formatNumbers';
import { calculateAmountWithSlippage } from '@utils/formatValues';
import { Token } from '@utils/token';

import { swapInput } from '../state/atom';
import { deriveEscrow, deriveEscrowMetadata } from '../utils';
import { useFastLaunchSearchParams } from './useFastLaunchSearchParams';
import { useTradeParams } from './useTradeParams';

export const useSwap = () => {
  const { customRPCUrl, selectedRPC } = useAtomValue(transactionSettings);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const connection = useMemo(() => getConnection(), [selectedRPC, customRPCUrl]);
  const { publicKey } = useWeb3React();
  const apeInProgram = useGetProgramInstance(FastLauchIdl as Idl);

  const queryClient = useQueryClient();
  const [txHash, setTxHash] = useState<string>('');
  const { data: poolSettings } = useApeInSettings();
  const { onCreateTradeWithReferal } = useReferal();
  const [{ in: swapAmountIn, out: swapAmountOut }, updateSwapData] = useAtom(swapInput);
  const slippage = useAtomValue(slippageValueAtom);
  const { showToast } = useProgressiveToast();

  const { data: poolData } = useGetPoolById(useFastLaunchSearchParams().pool);

  const { curveSettings } = useGetCurveSettings(poolData?.curveAccount);

  const { sendAndConfirmTransaction } = useTransaction((txId) => setTxHash(txId), false);

  const { pool: poolId } = useFastLaunchSearchParams();
  const [tradeReferalCodeValue] = useAtom(tradeReferalCode);
  const tradeReferralId = publicKey && tradeReferalCodeValue?.[publicKey?.toString()]?.[poolId];
  const { in: tokenInAdd, out: tokenOutAdd } = useTradeParams();
  const tokenIn = useTokenInstance(tokenInAdd, tokenInAdd === NATIVE_TOKEN_ADDRESS, true);

  const tokenOut = useTokenInstance(
    tokenOutAdd,
    tokenOutAdd.toLowerCase() === NATIVE_TOKEN_ADDRESS,
    true
  );
  const swapTitle = `${formatNumber({ input: swapAmountIn, type: NumberFormatType.TxValuesFormatter })} ${tokenIn?.symbol} to ${formatNumber({ input: swapAmountOut, type: NumberFormatType.TxValuesFormatter })} ${tokenOut?.symbol}`;
  const swap = async () => {
    if (!isApeInTradeEnabled) return null;
    try {
      setTxHash('');
      showToast({
        title: `Swapping ${swapTitle}`,
        type: ToastType.LOADING,
      });
      if (!tokenIn || !poolData || !tokenOut || !swapAmountIn || !apeInProgram || !publicKey)
        throw new Error(SOMETHING_WENT_WRONG);
      if (!poolSettings) throw new Error('Invalid pool settings');

      const isBuy = tokenIn.address === NATIVE_TOKEN.address;

      const amountIn = new BN(Token.toRawAmount(swapAmountIn, tokenIn.decimal).valueOf());
      const mintAccount = poolData.token;

      const [traderTokenAccount] = PublicKey.findProgramAddressSync(
        [publicKey.toBytes(), TOKEN_PROGRAM_ID.toBytes(), mintAccount.toBytes()],
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
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        );
        instructions.push(createTraderTokenAccountInstruction);
      }
      const pool = PublicKey.findProgramAddressSync(
        [mintAccount.toBuffer(), Buffer.from('fast_launch')],
        apeInProgram.programId
      )[0];

      const [poolTokenAccount] = PublicKey.findProgramAddressSync(
        [pool.toBytes(), TOKEN_PROGRAM_ID.toBytes(), mintAccount.toBytes()],
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      // isBuy flag is true when we are swapping for collaterol token (sol) to get project token
      // const minAmount = new Decimal(swapAmountOut).minus(
      //   new Decimal(swapAmountOut).div(100).mul(formattedSlipage)
      // );

      const amountOutMin = calculateAmountWithSlippage(
        swapAmountOut,
        slippage,
        tokenOut.decimal
      ).valueOf();

      const baseKP = Keypair.generate();
      const [escrow] = deriveEscrow(baseKP.publicKey, LOCK_PROGRAM_ID);
      const [escrowMetadata] = deriveEscrowMetadata(escrow, LOCK_PROGRAM_ID);
      const escrowToken = getAssociatedTokenAddressSync(
        mintAccount,
        escrow,
        true,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const isLockPeriodOver = dayjs().isAfter(poolData.lockEndTime);

      if (isBuy && poolData.poolCreator.toString() === publicKey.toString() && !isLockPeriodOver) {
        const escrowTokenAccountInfo = await connection.getAccountInfo(escrowToken);

        if (!escrowTokenAccountInfo) {
          const createEscrowTokenAccountInstruction = createAssociatedTokenAccountInstruction(
            publicKey,
            escrowToken,
            escrow,
            mintAccount,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
          );
          instructions.push(createEscrowTokenAccountInstruction);
        }
      }

      let swapInstruction;
      if (isBuy)
        swapInstruction = await apeInProgram.methods
          .buy(curveSettings?.curveIndex as CurveIndex, amountIn, new BN(amountOutMin))
          .accounts({
            base: baseKP.publicKey,
            escrow,
            escrowMetadata,
            escrowToken,
            lockEventAuthority: EVENT_AUTHORITY,
            mint: mintAccount,
            poolTokenAccount,
            // program: apeInProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            tradeFeeWallet: poolSettings.tradeFeeWallet,
            trader: publicKey,
            traderTokenAccount,
          })
          .instruction();
      else
        swapInstruction = await apeInProgram.methods
          .sell(curveSettings?.curveIndex as CurveIndex, amountIn, new BN(amountOutMin))
          .accounts({
            base: baseKP.publicKey,
            escrow,
            escrowMetadata,
            escrowToken,
            lockEventAuthority: EVENT_AUTHORITY,
            mint: mintAccount,
            poolTokenAccount,
            // program: apeInProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            tradeFeeWallet: poolSettings.tradeFeeWallet,
            trader: publicKey,
            traderTokenAccount,
          })
          .instruction();

      instructions.push(swapInstruction);

      const txId = await sendAndConfirmTransaction(instructions, [baseKP]);

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
        actions: createActions({ onRetry: onSwap, transaction: txHash }),
        message: e.message ?? '',
        title: 'Failed to swap tokens',
        type: ToastType.FAILED,
      });
    },
    onSuccess: () => {
      // invalidate token balances
      showToast({
        actions: createActions({
          transaction: txHash,
        }),
        title: `Swap ${swapTitle}`,
        type: ToastType.SUCCESS,
      });
      updateSwapData({
        in: '',
        out: '',
      });
      queryClient.invalidateQueries({ queryKey: ['token-balance'] });
      if (tradeReferralId && txHash) onCreateTradeWithReferal(txHash, poolId, tradeReferralId);
    },
  });

  return {
    isError,
    isPending,
    isSuccess,
    onSwap,
    swapError,
    txHash,
  };
};
