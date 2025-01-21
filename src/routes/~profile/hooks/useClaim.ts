import type { Idl } from '@coral-xyz/anchor';

import { useMemo, useState } from 'react';

import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';

import { LBPPoolStatus } from '@app-types/index';
import { LBPPoolWithTokenData } from '@app-types/lbp';

import { ToastType } from '@constants/index';
import {
  SOMETHING_WENT_WRONG,
  UNAUTHORIZED_SIGNER_OR_FUND_CLAIMED,
} from '@constants/programErrors';
import useLBPSettings from '@hooks/lbp/useLBPSettings';
import { useGetProgramInstance } from '@hooks/useGetProgramInstance';
import { createActions, useProgressiveToast } from '@hooks/useProgressiveToast';
import useTransaction from '@hooks/useTransaction';
import { useWeb3React } from '@hooks/useWeb3React';
import { ApeonLbp, LBPIdl } from '@idl/lbp';

const useClaim = (poolData: LBPPoolWithTokenData, currentPoolStatus?: LBPPoolStatus) => {
  const queryClient = useQueryClient();
  const { user } = useSearch({
    from: '/profile/',
  });

  const [txHash, setTxHash] = useState<string>('');
  const lbpProgram = useGetProgramInstance<ApeonLbp>(LBPIdl as Idl);
  const { publicKey } = useWeb3React();
  const isCreatorView = poolData?.creator.toString() === publicKey?.toString();
  const { sendAndConfirmTransaction } = useTransaction((txId) => setTxHash(txId));
  const { showToast } = useProgressiveToast({}, { variant: 'secondary' });
  const userAccount = user || publicKey?.toString();
  const { data: lbpSettings } = useLBPSettings();

  const claimFund = async () => {
    setTxHash('');

    try {
      if (!poolData || !lbpProgram || !publicKey || !lbpSettings)
        throw new Error(SOMETHING_WENT_WRONG);
      if (
        (currentPoolStatus === LBPPoolStatus.COMPLETED &&
          isCreatorView &&
          poolData?.isSolClaimed) ||
        userAccount !== publicKey.toString()
      )
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
      showToast({
        actions: createActions({
          transaction: txHash,
        }),
        title: 'You have successfully claimed your tokens',
        type: ToastType.SUCCESS,
      });

      // invalidate token balances
      queryClient.invalidateQueries({ queryKey: ['token-balance'] });
      queryClient.invalidateQueries({ queryKey: ['userPool', publicKey?.toString()] });
    },
  });

  const claimFundButtonStatus = useMemo(() => {
    if (publicKey?.toString() !== userAccount)
      return { disabled: true, isClaimed: false, label: '' };
    if (isClaimFundSuccess) return { disabled: true, isClaimed: true, label: 'Funds claimed' };
    if (poolData?.isSolClaimed) return { disabled: true, isClaimed: true, label: 'Funds claimed' };

    if (currentPoolStatus === LBPPoolStatus.COMPLETED)
      return { disabled: false, isClaimed: false, label: 'Claim fund' };
    return { disabled: true, isClaimed: false, label: 'Claim fund' };
  }, [publicKey, userAccount, isClaimFundSuccess, poolData?.isSolClaimed, currentPoolStatus]);

  return {
    claimError,
    claimFundButtonStatus,
    isClaimFundError,
    isClaimFundPending,
    isClaimFundSuccess,
    onClaimFund,
    txHash,
  };
};

export default useClaim;
