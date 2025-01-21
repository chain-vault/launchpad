import { useMemo, useState } from 'react';

import dayjs from 'dayjs';

import { PoolWithTokenData } from '@app-types/apiIn';
import { PoolListSortOptions } from '@app-types/index';

import { getPooApedlCount } from '@constants/pools';
import useGetAllTokensWithMetadata from '@hooks/useGetAllTokensWithMetadata';
import { useMultiTokensMetadata } from '@hooks/useToken';

import { usePairData } from '../usePairData';
import { useGetAllPools } from './useGetPool';

type FilterOptions = {
  searchQuery: string;
  sort: PoolListSortOptions;
};

const usePoolData = (
  intialFilter: FilterOptions = { searchQuery: '', sort: PoolListSortOptions.ASC }
) => {
  // const { data, isLoading } = useFastLaunches();
  const { data, isLoading } = useGetAllPools();

  const { isLoading: isPairDataLoading, pairData } = usePairData(true);

  const { isLoading: isFetchTokensLoading, tokens: allFastlaunchTokens } =
    useGetAllTokensWithMetadata(true);

  const excludedTokenList = useMemo(
    () =>
      data?.length && !isFetchTokensLoading ?
        data
          .map((pool) => pool.token)
          .filter(
            (token) =>
              !allFastlaunchTokens.some((allToken) => allToken.mint.toString() === token.toString())
          )
      : [],
    [allFastlaunchTokens, data, isFetchTokensLoading]
  );

  const { isMetaDataLoading, poolTokensMetadata: excludedPoolTokensMetadata } =
    useMultiTokensMetadata(excludedTokenList, true);

  const combinedTokensData = useMemo(
    () => [...allFastlaunchTokens, ...excludedPoolTokensMetadata],
    [allFastlaunchTokens, excludedPoolTokensMetadata]
  );

  const [filters, setFilters] = useState<FilterOptions>(intialFilter);

  const onChangeFilters = (newFilter: Partial<FilterOptions>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilter,
    }));
  };

  const filteredData: PoolWithTokenData[] = useMemo(() => {
    if (!data?.length || !combinedTokensData?.length) return [];

    // combine metadata into pool
    const combinedData = data.map((pool) => {
      const matchingMetadata = combinedTokensData.find(
        (metadata) => metadata?.mint?.toString() === pool.token.toString()
      );

      return {
        ...pool,
        ...matchingMetadata,
        curveThresholdTime: pairData?.[pool.poolId.toString()]?.curveThresholdTime,
        participantsCount:
          pairData?.[pool.poolId.toString()]?.participantCount ??
          getPooApedlCount(pool.token.toString()),
      };
    });

    return combinedData
      .filter((pool) => {
        const matchesSearchQuery =
          pool.tokenName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          pool.symbol?.toLowerCase().includes(filters.searchQuery.toLowerCase());

        const lockPeriodEnd = dayjs.unix(pool.createdAt).add(pool.tokenLockPeriod, 'day');

        const isLockPeriodOver = dayjs().isAfter(lockPeriodEnd);

        const developerLockedCondition =
          filters.sort === PoolListSortOptions.DEVELOPER_LOCKED ?
            pool.hasTokenLockBeenApplied && !isLockPeriodOver
          : true;

        return matchesSearchQuery && developerLockedCondition;
      })
      .sort((a, b) => {
        if (filters.sort === PoolListSortOptions.ASC) {
          return b.createdAt - a.createdAt;
        }
        if (filters.sort === PoolListSortOptions.DESC) {
          return a.createdAt - b.createdAt;
        }
        if (filters.sort === PoolListSortOptions.MARKET_CAP) {
          return b.marketCap.toNumber() - a.marketCap.toNumber();
        }
        return 0;
      });
  }, [data, combinedTokensData, pairData, filters.searchQuery, filters.sort]);

  return {
    data: filteredData,
    filters,
    isLoading,
    isTokensLoading: isMetaDataLoading || isFetchTokensLoading || isPairDataLoading,
    onChangeFilters,
  };
};

export default usePoolData;
