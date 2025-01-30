import type { Idl } from '@coral-xyz/anchor';

import { useMemo } from 'react';

import AmmImpl from '@mercurial-finance/dynamic-amm-sdk';
import { Raydium } from '@raydium-io/raydium-sdk-v2';
import { PublicKey } from '@solana/web3.js';
import { queryOptions, skipToken, useQueries, useQuery } from '@tanstack/react-query';
import bs58 from 'bs58';
import dayjs from 'dayjs';
import { find } from 'lodash';

import { AllPoolAccounts, CurveSettings, PoolAccountData, PoolData } from '@app-types/apiIn';
import { DexType } from '@app-types/index';

import { ApeInCurveMode, CurveIndex, DEFAULT_TOKEN_DECIMAL } from '@constants/config';
import {
  getLegacyPoolById,
  getLegacyPoolsByUser,
  isLegacyPool,
  LEGACY_POOLS,
} from '@constants/pools';
import { useGetAllTokensSupply, useGetTokenSupply } from '@hooks/useGetAllTokensWithMetadata';
import { getProgramInstance, useGetProgramInstance } from '@hooks/useGetProgramInstance';
import { getConnection } from '@hooks/useWeb3React';
import { ApeonFastlaunch, FastLauchIdl } from '@idl/fastlaunch';
import { PoolMath } from '@utils/apeInPoolMath';
import BaseDecimal, {
  convertBNToDecimal,
  DecimalType,
  ONE,
  ONE_TOKEN,
  ZERO,
} from '@utils/decimalHelper';
import { Token } from '@utils/token';

import useGetApeInPairData from './useGetApeInPairData';
import useGetCurveSettings, { useGetAllCurveSettings } from './useGetCurveSettings';

const getLivePrice = async (poolAddress: PublicKey, selectedDex: DexType) => {
  try {
    const connection = getConnection();
    if (poolAddress.toString() === PublicKey.default.toString()) return null;
    if (selectedDex === DexType.METEORA) {
      /** @ts-ignore */
      const pool = await AmmImpl.create(connection, poolAddress);
      const poolInfo = convertBNToDecimal(pool.poolInfo);
      const price = poolInfo.tokenAAmount.mul(ONE_TOKEN).div(poolInfo.tokenBAmount);
      return {
        price,
        solAmount: Token.fromRawAmount(poolInfo.tokenAAmount),
        tokenAmount: Token.fromRawAmount(poolInfo.tokenBAmount, DEFAULT_TOKEN_DECIMAL),
      };
    }
    const raydium = await Raydium.load({
      connection,
    });
    const data = await raydium.api.fetchPoolById({
      ids: poolAddress.toString(),
    });
    if (data.length) {
      const [poolInfo] = data;
      const { mintAmountA, mintAmountB, price } = poolInfo;
      const priceInSol = BaseDecimal.toDecimal(1).div(price);
      return {
        price: Token.toRawAmount(priceInSol),
        solAmount: BaseDecimal.toDecimal(mintAmountA),
        tokenAmount: BaseDecimal.toDecimal(mintAmountB),
      };
    }
    return null;
  } catch {
    return null;
  }
};

export const useGetLiveTokenPrice = (poolData?: {
  id: PublicKey;
  lp: PublicKey;
  selectedDex: DexType;
}) => {
  const { data, isPending } = useQuery({
    queryFn: poolData ? () => getLivePrice(poolData.lp, poolData.selectedDex) : skipToken,
    queryKey: ['live-token-price', poolData?.id, poolData?.lp, poolData?.selectedDex],
    refetchInterval: 5000,
    retry: false,
  });

  return {
    isLoading: isPending,
    ...data,
  };
};

export const useGetLiveTokensPrice = (
  poolData?: { id: PublicKey; lp: PublicKey; selectedDex: DexType }[]
) => {
  const {
    data: tokensLivePriceFeed,
    isPending,
    isRefetching,
  } = useQueries({
    combine: (results) => ({
      data: results.map((data) => data),
      isError: results.some((result) => result.isError),
      isLoading: results.some((result) => result.isLoading),
      isPending: results.some((result) => result.isPending),
      isRefetching: results.some((result) => result.isRefetching),
      isSuccess: results.every((result) => result.isSuccess),
    }),
    queries:
      poolData ?
        poolData.map(({ id, lp, selectedDex }) => ({
          queryFn: () => getLivePrice(lp, selectedDex),
          queryKey: ['live-token-price', id, lp],
          retry: false,
        }))
      : [],
  });

  return { isPending, isRefetching, tokensLivePriceFeed };
};

export const getFormattedPoolData = (
  pool: PoolAccountData,
  poolId: PublicKey,
  curveSettings: CurveSettings,
  tokenSupply: DecimalType = ONE
) => {
  // coefficient1 = token reserve and coefficient2 = sol reserve/ collateral reserve
  // only take the integer part of it as its in lamports

  const marketCap = pool.tokenPrice.mul(tokenSupply);

  const developerAllocation = pool.poolCreatorTokenBalance.div(pool.initialTokenSupply).mul(100);

  const bondingCurveProgress = PoolMath.getBondingCurveProgress({
    currentCurveThreshold: pool.curveThresholdProgress,
    curveSettings,
  });

  const lockEndTime = dayjs
    .unix(pool.createdAt.toNumber())
    .add(pool.initialBuyLockDays.toNumber(), 'day');

  const isTokenLockActive = !dayjs().isAfter(lockEndTime);

  const formattedPoolData: PoolData = {
    bondingCurveProgress,
    coefficient1: pool.coefficient1,
    coefficient2: pool.coefficient2,
    createdAt: pool.createdAt.toNumber(),
    curveAccount: pool.curve,
    curveIndex: curveSettings ? (curveSettings.curveIndex as CurveIndex) : CurveIndex.PRIME_LAUNCH, // CurveIndex not available for hard coded pools
    curveThresholdReached: pool.curveThresholdReached,
    developerAllocation,
    hasTokenLockBeenApplied: pool.initialBuyLockDays.greaterThan(ZERO),
    isTokenLockActive,
    liquidityLP: pool.liquidityPool,
    lockEndTime,
    marketCap,
    poolCreator: pool.poolCreator,
    poolId,
    poolTokenBalance: pool.tokenBalance,
    selectedDex: pool.selectedDex === 0 ? DexType.METEORA : DexType.RAYDIUM,
    solBalance: pool.solBalance,
    token: pool.token,
    tokenLockPeriod: pool.initialBuyLockDays.toNumber(),
    tokenName: pool.name,
    tokenPrice: pool.tokenPrice,
  };

  return formattedPoolData;
};

export const useGetPoolById = (poolId?: string) => {
  const poolProgram = useGetProgramInstance<ApeonFastlaunch>(FastLauchIdl as Idl, false);
  const { data, isLoading, refetch } = useQuery<PoolAccountData | undefined>({
    queryFn:
    poolId && !isLegacyPool(poolId) && poolProgram ?
    async () => {
      const response = await poolProgram.account.poolData.fetch(new PublicKey(poolId));
      
      console.log(response);
      return convertBNToDecimal(response);
    }
    : skipToken,
    queryKey: ['apeInPool', poolId],
  });
  
  const { curveSettings, isLoading: curveSettingsLoading } = useGetCurveSettings(data?.curve);

  const { price, solAmount, tokenAmount } = useGetLiveTokenPrice(
    data && poolId ?
      {
        id: new PublicKey(poolId),
        lp: data.liquidityPool,
        selectedDex: data.selectedDex === 0 ? DexType.METEORA : DexType.RAYDIUM,
      }
    : undefined
  );

  const { isLoading: isSupplyLoading, supply } = useGetTokenSupply(data?.token);
  
  const formattedPoolData = useMemo(() => {
    if (poolId && isLegacyPool(poolId)) {
      return getLegacyPoolById(poolId);
    }
    if (
      !poolId ||
      !data ||
      data.selectedEnv !== ApeInCurveMode ||
      !curveSettings ||
      isSupplyLoading
    )
    return undefined;
    return getFormattedPoolData(data, new PublicKey(poolId), curveSettings, supply);
  }, [poolId, data, curveSettings, isSupplyLoading, supply]);
  
  const poolDataWithLivePrice = useMemo(
    () =>
      price && formattedPoolData ?
        {
          ...formattedPoolData,
          marketCap: supply.mul(price),
          pooledSol: solAmount,
          pooledToken: tokenAmount,
          tokenPrice: price,
        }
      : formattedPoolData,
    [formattedPoolData, price, solAmount, supply, tokenAmount]
  );
  return {
    data: poolDataWithLivePrice,
    isLoading: curveSettingsLoading || isLoading,
    refetch,
  };
};

export const useGetAllPools = () => {
  const {
    curveSettings,
    getCurveSettingsById,
    isLoading: curveSettingsLoading,
  } = useGetAllCurveSettings();

  const poolProgram = useGetProgramInstance<ApeonFastlaunch>(
    FastLauchIdl as ApeonFastlaunch,
    false
  );
  const curveModeBase58 = bs58.encode(Uint8Array.from([ApeInCurveMode]));

  const { data: pairData, isLoading: isPairDataLoading } = useGetApeInPairData();

  const { data, isLoading } = useQuery<AllPoolAccounts | undefined>({
    queryFn:
      poolProgram ?
        async () => {
          const response = await poolProgram.account.poolData.all([
            {
              memcmp: {
                bytes: curveModeBase58,
                offset: 129,
              },
            },
          ]);
          return convertBNToDecimal(response);
        }
      : skipToken,
    queryKey: ['apein-pools', curveModeBase58],
  });

  const { data: allTokensSupply, isLoading: isSupplyFetching } = useGetAllTokensSupply(
    data ? data.map((pool) => pool.account.token.toString()) : []
  );

  // const { tokensLivePriceFeed } = useGetLiveTokensPrice(
  //   data ? data.map((pool) => ({ id: pool.publicKey, lp: pool.account.liquidityPool })) : []
  // );

  const formattedPools = useMemo(() => {
    if ((!data?.length || isSupplyFetching) && pairData?.length && curveSettings) return pairData;

    if (!data?.length || !curveSettings || isSupplyFetching) return [];
    return data
      .map((pool) => {
        const settings = getCurveSettingsById(pool.account.curve);
        const supply = find(allTokensSupply, { tokenMint: pool.account.token.toString() });
        return settings ?
            getFormattedPoolData(pool.account, pool.publicKey, settings, supply?.totalSupply)
          : null;
      })
      .filter((item) => item !== null)
      .concat(LEGACY_POOLS);
  }, [data, pairData, curveSettings, isSupplyFetching, getCurveSettingsById, allTokensSupply]);

  // const poolDatasWithLivePrice = useMemo(
  //   () =>
  //     formattedPools.map((pool, idx) => {
  //       const supply = find(allTokensSupply, { tokenMint: pool.token.toString() });

  //       return tokensLivePriceFeed[idx] ?
  //           {
  //             ...pool,
  //             marketCap: tokensLivePriceFeed[idx].price.mul(supply?.totalSupply ?? ONE),
  //             price: tokensLivePriceFeed[idx].price,
  //           }
  //         : pool;
  //     }),
  //   [allTokensSupply, formattedPools, tokensLivePriceFeed]
  // );

  const isDataLoading = useMemo(() => {
    if (curveSettingsLoading) return true;
    if (formattedPools.length) return false;
    return isPairDataLoading || isLoading || isSupplyFetching;
  }, [curveSettingsLoading, formattedPools.length, isPairDataLoading, isLoading, isSupplyFetching]);

  return {
    data: formattedPools,
    isLoading: isDataLoading,
  };
};

export const useGetPoolsByUser = (userId?: string) => {
  const {
    curveSettings,
    getCurveSettingsById,
    isLoading: curveSettingsLoading,
  } = useGetAllCurveSettings();

  useGetAllCurveSettings();

  const poolProgram = useGetProgramInstance<ApeonFastlaunch>(
    FastLauchIdl as ApeonFastlaunch,
    false
  );
  const curveModeBase58 = bs58.encode(Uint8Array.from([ApeInCurveMode]));

  const { data, isLoading } = useQuery<AllPoolAccounts | undefined>({
    queryFn:
      poolProgram && userId ?
        async () => {
          const response = await poolProgram.account.poolData.all([
            {
              memcmp: {
                bytes: userId,
                offset: 130,
              },
            },
            {
              memcmp: {
                bytes: curveModeBase58,
                offset: 129,
              },
            },
          ]);

          return convertBNToDecimal(response);
        }
      : skipToken,
    queryKey: ['userApeInPools', userId, curveModeBase58],
  });

  const { data: allTokensSupply, isLoading: isSupplyFetching } = useGetAllTokensSupply(
    data ? data.map((pool) => pool.account.token.toString()) : []
  );

  const formattedPools = useMemo(() => {
    if (!data || !curveSettings || isSupplyFetching) return [];
    return data
      .map((pool) => {
        const settings = getCurveSettingsById(pool.account.curve);
        const supply = find(allTokensSupply, { tokenMint: pool.account.token.toString() });

        return settings ?
            getFormattedPoolData(pool.account, pool.publicKey, settings, supply?.totalSupply)
          : null;
      })
      .filter((item) => item !== null)
      .concat(getLegacyPoolsByUser(userId));
  }, [data, curveSettings, isSupplyFetching, userId, getCurveSettingsById, allTokensSupply]);

  return {
    data: formattedPools,
    isLoading: curveSettingsLoading || isLoading || isSupplyFetching,
  };
};

export const getPoolAccountQueryOptions = (poolId: string) => {
  const poolProgram = getProgramInstance<ApeonFastlaunch>(FastLauchIdl as Idl);
  const poolAccountQueryOptions = queryOptions({
    queryFn:
      poolId && poolProgram ?
        async () => {
          const response = await poolProgram.account.poolData.fetch(new PublicKey(poolId));
          return convertBNToDecimal(response);
        }
      : skipToken,
    queryKey: ['apeInPool', poolId],
    refetchOnWindowFocus: false,
  });
  return poolAccountQueryOptions;
};
