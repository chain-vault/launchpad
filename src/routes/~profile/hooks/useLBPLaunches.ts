import { useMemo, useState } from 'react';

import { useSearch } from '@tanstack/react-router';

import { LBPPoolStatus } from '@app-types/index';
import { LBPPoolWithTokenData } from '@app-types/lbp';

import { useGetPoolsByUser } from '@hooks/lbp/useGetPool';
import useGetAllTokensWithMetadata from '@hooks/useGetAllTokensWithMetadata';
import { usePairData } from '@hooks/usePairData';
import { useMultiTokensMetadata } from '@hooks/useToken';
import { useWeb3React } from '@hooks/useWeb3React';
import { getPoolStatus } from '@utils/poolStatus';

type FilterTypes = {
  searchQuery: string;
  status: 'All' | LBPPoolStatus;
};

const DEFAULT_FILTERS: FilterTypes = {
  searchQuery: '',
  status: 'All',
};

const useLBPLaunches = () => {
  const { publicKey } = useWeb3React();
  const { user } = useSearch({ from: '/profile/' });
  const { data: pools, isLoading } = useGetPoolsByUser(user || publicKey?.toBase58());
  const { pairData } = usePairData();

  const [filters, setLaunchesFilter] = useState<FilterTypes>(DEFAULT_FILTERS);
  const onChangeFilter = (filter: Partial<FilterTypes>, resetFilters = false) =>
    setLaunchesFilter((currentFilter) => ({
      ...(!resetFilters ? currentFilter : DEFAULT_FILTERS),
      ...filter,
    }));

  // here get the tokens created by user
  const { isLoading: isFetchTokensLoading, tokens: allLBPTokens } = useGetAllTokensWithMetadata(
    false,
    user || publicKey?.toString()
  );

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
    [allLBPTokens, pools, isFetchTokensLoading]
  );

  const { isMetaDataLoading, poolTokensMetadata: excludedPoolTokensMetadata } =
    useMultiTokensMetadata(excludedTokenList);

  const combinedTokensData = useMemo(
    () => [...allLBPTokens, ...excludedPoolTokensMetadata],
    [allLBPTokens, excludedPoolTokensMetadata]
  );

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

    return combinedData.filter((pool) => {
      const { status } = getPoolStatus(pool.startAt, pool.endAt);
      if (filters.status !== 'All' && status !== filters.status) {
        return false;
      }

      if (filters.searchQuery && filters.searchQuery.trim()) {
        return (
          `${pool.name} ${pool.symbol}`
            .toLocaleLowerCase()
            .indexOf(filters.searchQuery.toLocaleLowerCase()) > -1
        );
      }
      return true;
    });
  }, [combinedTokensData, filters.searchQuery, filters.status, pairData, pools]);

  return {
    filters,
    isPoolDataLoading: isLoading || isMetaDataLoading,
    onChangeFilter,
    poolData: filteredData,
  };
};

export default useLBPLaunches;
