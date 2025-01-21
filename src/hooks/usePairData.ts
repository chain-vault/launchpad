import { useMemo } from 'react';

import { useQuery } from '@apollo/client';
import ALL_PAIR_DATA_QUERY from '@integrations/graphql/queries/allPair';

import { BASE_CONFIG } from '@constants/config';

export type PairData = Record<
  string,
  {
    participantCount: number;
    symbol: string;
    volume: string;
  }
>;

export const usePairData = (isFastLaunch?: boolean) => {
  const { data: pairData, loading } = useQuery(ALL_PAIR_DATA_QUERY, {
    context: { apiName: isFastLaunch ? 'apein' : 'lbp' },
    fetchPolicy: 'network-only',
    skip: false,
    variables: { env: BASE_CONFIG.envMode },
  });

  const response = useMemo(() => {
    const formatedData: Record<
      string,
      {
        curveThresholdTime: null | number;
        lastTransactionTime: null | number;
        participantCount: number;
        symbol: string;
        volume: string;
      }
    > = {};
    (pairData?.pairs || []).forEach(
      (data) => {
        formatedData[data.poolId] = {
          curveThresholdTime: data.curveThresholdTime,
          lastTransactionTime: data?.lastTransactionTime ?? null,
          participantCount: data.participantCount,
          symbol: data.token0.symbol,
          volume: data.totalVolumeSOL,
        };
      },
      [pairData]
    );
    return formatedData;
  }, [pairData]);
  return { isLoading: loading, pairData: response };
};
