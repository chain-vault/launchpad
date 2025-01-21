import { useMemo, useState } from 'react';

import { LBPPoolStatus, SortOptions } from '@app-types/index';
import { LBPPoolWithTokenData } from '@app-types/lbp';

import useGetAllTokensWithMetadata from '@hooks/useGetAllTokensWithMetadata';
import { usePairData } from '@hooks/usePairData';
import { useMultiTokensMetadata } from '@hooks/useToken';
import { getPoolStatus } from '@utils/poolStatus';

import { useGetAllPools } from './useGetPool';

type PoolListingOptions = {
  hasPagination: boolean;
  resultsPerPage: number;
  searchQuery: string;
  sortBy: SortOptions;
  status: 'All' | LBPPoolStatus;
};

const DEFAULT_OPTIONS: PoolListingOptions = {
  hasPagination: false,
  resultsPerPage: 10,
  searchQuery: '',
  sortBy: SortOptions.asc,
  status: 'All',
};

type Exclude = ('All' | LBPPoolStatus)[];

export const usePoolData = (options: Partial<PoolListingOptions> = {}, exclude: Exclude = []) => {
  const [filter, updateFilter] = useState({
    ...DEFAULT_OPTIONS,
    ...options,
  });

  const { data: pools, isLoading: isPoolDataLoading } = useGetAllPools();
  const { isLoading: isPairDataLoading, pairData } = usePairData();
  const { isLoading: isFetchTokensLoading, tokens: allLBPTokens } = useGetAllTokensWithMetadata();

  const excludedTokenList = useMemo(
    () =>
      pools?.length && !isFetchTokensLoading ?
        pools
          .map((pool) => pool.token)
          .filter(
            (token) =>
              !allLBPTokens.some((allToken) => allToken.mint.toString() === token.toString())
          )
      : [],
    [allLBPTokens, isFetchTokensLoading, pools]
  );

  const { isMetaDataLoading, poolTokensMetadata: excludedPoolTokensMetadata } =
    useMultiTokensMetadata(excludedTokenList);

  const combinedTokensData = useMemo(
    () => [...allLBPTokens, ...excludedPoolTokensMetadata],
    [allLBPTokens, excludedPoolTokensMetadata]
  );

  const applyFilter = (filterOptions: Omit<Partial<PoolListingOptions>, 'resultsPerPage'>) => {
    updateFilter({
      ...filter,
      ...filterOptions,
    });
  };

  const filteredData: LBPPoolWithTokenData[] = useMemo(() => {
    if (!pools?.length || !combinedTokensData?.length) return [];
    // combine metadata into pool
    const combinedData = pools.map((pool) => {
      const matchingMetadata = combinedTokensData.find(
        (metadata) => metadata?.mint?.toString() === pool.token.toString()
      );

      return {
        ...pool,
        ...matchingMetadata,
        participantsCount: pairData?.[pool.poolAddress.toString()]?.participantCount,
      };
    });

    return combinedData
      .filter((pool) => {
        if (filter.status !== 'All' || exclude.length) {
          const { status } = getPoolStatus(pool.startAt, pool.endAt);
          if (exclude && exclude.length > 0 && exclude.indexOf(status) > -1) {
            return !1;
          }
          if (filter.status !== 'All' && status !== filter.status) {
            return !1;
          }
        }

        if (filter.searchQuery && filter.searchQuery.trim()) {
          return (
            `${pool.name} ${pool.symbol}`
              .toLocaleLowerCase()
              .indexOf(filter.searchQuery.toLocaleLowerCase()) > -1
          );
        }
        return !0;
      })
      .sort((currentPool, previousPool) =>
        filter.sortBy === SortOptions.asc ?
          currentPool.startAt < previousPool.startAt ?
            0
          : -1
        : currentPool.startAt > previousPool.startAt ? 0
        : -1
      );
  }, [
    combinedTokensData,
    exclude,
    filter.searchQuery,
    filter.sortBy,
    filter.status,
    pairData,
    pools,
  ]);

  return {
    applyFilter,
    data: filteredData,
    isLoading: isPoolDataLoading || isPairDataLoading || isFetchTokensLoading || isMetaDataLoading,
  };
};
