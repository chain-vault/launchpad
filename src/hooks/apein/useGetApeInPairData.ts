import { useMemo } from 'react';

import { useQuery } from '@apollo/client';
import { ALL_APEIN_PAIR_DATA } from '@integrations/graphql/queries/allPair';
import { PublicKey } from '@solana/web3.js';
import dayjs from 'dayjs';

import { PoolData } from '@app-types/apiIn';
import { DexType } from '@app-types/index';

import { BASE_CONFIG, DEFAULT_TOKEN_DECIMAL } from '@constants/config';
import BaseDecimal from '@utils/decimalHelper';
import { Token } from '@utils/token';

const useGetApeInPairData = () => {
  const { data, loading: isLoading } = useQuery(ALL_APEIN_PAIR_DATA, {
    context: { apiName: 'apein' },
    variables: { env: BASE_CONFIG.envMode },
    // fetchPolicy: 'cache-only',
  });

  const formattedData: PoolData[] = useMemo(() => {
    if (!data) return [];
    return data.pairs.map((eachPair): PoolData => {
      const tokenPrice = Token.toRawAmount(eachPair.tokenPrice);
      const [totalSupply, tokenName] =
        eachPair.token0.id === eachPair.token ?
          [
            Token.fromRawAmount(eachPair.token0.totalSupply, DEFAULT_TOKEN_DECIMAL),
            eachPair.token0.name,
          ]
        : [
            Token.fromRawAmount(eachPair.token1.totalSupply, DEFAULT_TOKEN_DECIMAL),
            eachPair.token0.name,
          ];
      const marketCap = tokenPrice.mul(totalSupply);
      const lockEndTime = dayjs
        .unix(Number(eachPair.createdAt))
        .add(Number(eachPair.initialBuyLockDays), 'day');

      const isTokenLockActive = !dayjs().isAfter(lockEndTime);

      return {
        bondingCurveProgress: eachPair.bondingCurveProgress,
        coefficient1: Token.toRawAmount(eachPair.coefficient1, DEFAULT_TOKEN_DECIMAL),
        coefficient2: Token.toRawAmount(eachPair.coefficient2),
        createdAt: eachPair.createdAt,
        curveAccount: new PublicKey(eachPair.curve),
        curveIndex: eachPair.curveIndex.toString(),
        curveThresholdReached: eachPair.curveThresholdReached,
        developerAllocation: BaseDecimal.toDecimal(0),
        hasTokenLockBeenApplied: Number(eachPair.initialBuyLockDays) > 0,
        isTokenLockActive,
        liquidityLP: new PublicKey(eachPair.liquidityPool),
        lockEndTime,
        marketCap,
        poolCreator: new PublicKey(eachPair.poolCreator),
        poolId: new PublicKey(eachPair.poolId),
        poolTokenBalance: Token.toRawAmount(eachPair.tokenBalance, DEFAULT_TOKEN_DECIMAL),
        selectedDex: DexType.METEORA,
        solBalance: Token.toRawAmount(eachPair.solBalance),
        token: new PublicKey(eachPair.token),
        tokenLockPeriod: Number(eachPair.initialBuyLockDays),
        tokenName,
        tokenPrice,
      };
    });
  }, [data]);

  return {
    data: formattedData,
    isLoading,
  };
};

export default useGetApeInPairData;
