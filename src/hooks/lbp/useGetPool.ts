import { useMemo } from 'react';

import { PublicKey } from '@solana/web3.js';
import { queryOptions, skipToken, useQuery } from '@tanstack/react-query';
import bs58 from 'bs58';

import { AllPoolAccounts, LBPPoolData, PoolAccountData } from '@app-types/lbp';

import { LBPEnv } from '@constants/config';
import { getProgramInstance, useGetProgramInstance } from '@hooks/useGetProgramInstance';
import { ApeonLbp, LBPIdl } from '@idl/lbp';
import { convertBNToDecimal, ZERO } from '@utils/decimalHelper';

const getFormattedPoolData = (pool: PoolAccountData, poolId: PublicKey) => {
  const fundRaised = pool.solBalance.minus(pool.startSolAmount);
  const formattedPoolData: LBPPoolData = {
    collateralBalance: pool.solBalance,
    collateralEndWeight: pool.endSolWeight,
    collateralStartWeight: pool.startSolWeight,
    creator: pool.creator,
    endAt: pool.endAt,
    fundRaised: fundRaised.greaterThan(0) ? fundRaised : ZERO,
    isSolClaimed: pool.fundClaimed,
    name: pool.name,
    poolAddress: poolId,
    projectTokenBalance: pool.tokenBalance,
    projectTokenEndWeight: pool.endTokenWeight,
    projectTokenStartWeight: pool.startTokenWeight,
    startAt: pool.startAt,
    startCollaterolAmount: pool.startSolAmount,
    startProjectAmount: pool.startTokenAmount,
    swapFeeDenominator: pool.swapFeeDenominator,
    swapFeeNumerator: pool.swapFeeNumerator,
    token: pool.token,
  };

  return formattedPoolData;
};

export const useGetAllPools = () => {
  const poolProgram = useGetProgramInstance<ApeonLbp>(LBPIdl as ApeonLbp, false);

  const lbpEnv = bs58.encode(Uint8Array.from([LBPEnv]));

  const { data, isLoading } = useQuery<AllPoolAccounts | undefined>({
    queryFn:
      poolProgram ?
        async () => {
          const response = await poolProgram.account.poolData.all([
            {
              memcmp: {
                bytes: lbpEnv,
                offset: 188,
              },
            },
          ]);
          return convertBNToDecimal(response);
        }
      : skipToken,
    queryKey: ['lbp-pools', lbpEnv],
    refetchOnWindowFocus: false,
  });

  const formattedPoolData = useMemo(() => {
    if (!data) return [];
    return data.map((pool) => getFormattedPoolData(pool.account, pool.publicKey));
  }, [data]);

  return {
    data: formattedPoolData,
    isLoading,
  };
};

export const useGetPoolById = (poolId?: string) => {
  const poolProgram = useGetProgramInstance<ApeonLbp>(LBPIdl as ApeonLbp, false);

  const { data, isLoading, refetch } = useQuery<PoolAccountData | undefined>({
    queryFn:
      poolId && poolProgram ?
        async () => {
          const response = await poolProgram.account.poolData.fetch(new PublicKey(poolId));
          return convertBNToDecimal(response);
        }
      : skipToken,
    queryKey: ['lbpPool', poolId],
  });

  const formattedPoolData = useMemo(() => {
    if (!data || !poolId || data.selectedEnv !== LBPEnv) return undefined;
    return getFormattedPoolData(data, new PublicKey(poolId));
  }, [data, poolId]);

  return {
    data: formattedPoolData,
    isLoading,
    refetch,
  };
};

export const useGetPoolsByUser = (userId?: string) => {
  const poolProgram = useGetProgramInstance<ApeonLbp>(LBPIdl as ApeonLbp, false);

  const lbpEnv = bs58.encode(Uint8Array.from([LBPEnv]));

  const { data, isLoading } = useQuery<AllPoolAccounts | undefined>({
    queryFn:
      poolProgram && userId ?
        async () => {
          const response = await poolProgram.account.poolData.all([
            {
              memcmp: {
                bytes: userId,
                offset: 104,
              },
            },
            {
              memcmp: {
                bytes: lbpEnv,
                offset: 188,
              },
            },
          ]);
          return convertBNToDecimal(response);
        }
      : skipToken,
    queryKey: ['userLBPPools', userId, lbpEnv],
    refetchOnWindowFocus: false,
  });

  const formattedPoolData = useMemo(() => {
    if (!data) return [];
    return data.map((pool) => getFormattedPoolData(pool.account, pool.publicKey));
  }, [data]);

  return {
    data: formattedPoolData,
    isLoading,
  };
};

export const getLBPPoolAccountQueryOptions = (poolId: string) => {
  const poolProgram = getProgramInstance<ApeonLbp>(LBPIdl as ApeonLbp);
  const poolAccountQueryOptions = queryOptions({
    queryFn:
      poolId && poolProgram ?
        async () => {
          const response = await poolProgram.account.poolData.fetch(new PublicKey(poolId));
          return convertBNToDecimal(response);
        }
      : skipToken,
    queryKey: ['lbpPool', poolId],
    refetchOnWindowFocus: false,
  });
  return poolAccountQueryOptions;
};
