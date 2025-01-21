import { useMemo, useState } from 'react';

import { useSearch } from '@tanstack/react-router';
import dayjs from 'dayjs';

import { RadioButtonOption } from '@app-types/index';
import { PoolAndTokenMetaData } from '@app-types/poolAndToken';

import { useGetPoolsByUser } from '@hooks/apein/useGetPool';
import useGetAllTokensWithMetadata from '@hooks/useGetAllTokensWithMetadata';
import { usePairData } from '@hooks/usePairData';
import { useMultiTokensMetadata } from '@hooks/useToken';
import { useWeb3React } from '@hooks/useWeb3React';

export enum View {
  LAUNCHES = 'launches',
  PORTFOLIO = 'portfolio',
}

type FilterTypes = {
  searchQuery: string;
  sort: SortOptions;
};

export type PortfolioTokensData = {
  userBalance: string;
} & PoolAndTokenMetaData;

enum SortOptions {
  ASC = 'asc',
  DESC = 'desc',
  DEVELOPER_LOCKED = 'developerLocked',
  MARKET_CAP = 'marketCap',
}

export const DropDownFilterOptions: RadioButtonOption[] = [
  {
    id: SortOptions.ASC,
    displayValue: 'New',
    value: SortOptions.ASC,
  },
  {
    id: SortOptions.DESC,
    displayValue: 'Old',
    value: SortOptions.DESC,
  },
  {
    id: SortOptions.MARKET_CAP,
    displayValue: 'Market Cap',
    value: SortOptions.MARKET_CAP,
  },
  {
    id: SortOptions.DEVELOPER_LOCKED,
    displayValue: 'Developer Locked Tokens',
    value: SortOptions.DEVELOPER_LOCKED,
  },
];

const DEFAULT_FILTERS: FilterTypes = {
  searchQuery: '',
  sort: SortOptions.ASC,
};

const useUserProfileData = () => {
  const { publicKey } = useWeb3React();
  const { user } = useSearch({ from: '/profile/' });
  const { data, isLoading } = useGetPoolsByUser(user || publicKey?.toBase58());

  const { pairData } = usePairData(true);

  // here get the tokens created by user
  const { isLoading: isFetchTokensLoading, tokens: allFastlaunchTokens } =
    useGetAllTokensWithMetadata(true, user || publicKey?.toString());

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

  const [filters, setLaunchesFilter] = useState<FilterTypes>(DEFAULT_FILTERS);

  const onChangeFilter = (filter: Partial<FilterTypes>, resetFilters = false) =>
    setLaunchesFilter((currentFilter) => ({
      ...(!resetFilters ? currentFilter : DEFAULT_FILTERS),
      ...filter,
    }));

  const filteredData = useMemo(() => {
    if (!data.length || !combinedTokensData?.length) return [];

    // combine metadata into pool
    const combinedData = data.map((pool) => {
      const matchingMetadata = combinedTokensData.find(
        (metadata) => metadata?.mint?.toString() === pool.token.toString()
      );

      return {
        ...pool,
        ...matchingMetadata,
        curveThresholdTime: pairData?.[pool.poolId.toString()]?.curveThresholdTime,
        participantsCount: pairData?.[pool.poolId.toString()]?.participantCount ?? 0,
      };
    });

    return combinedData
      .filter((pool) => {
        const matchesSearchQuery =
          pool.tokenName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          pool.symbol?.toLowerCase().includes(filters.searchQuery.toLowerCase());

        const isLockPeriodOver = dayjs().isAfter(pool.lockEndTime);

        const developerLockedCondition =
          filters.sort === SortOptions.DEVELOPER_LOCKED ?
            pool.hasTokenLockBeenApplied && !isLockPeriodOver
          : true;

        return matchesSearchQuery && developerLockedCondition;
      })
      .sort((a, b) => {
        if (filters.sort === SortOptions.ASC) {
          return b.createdAt - a.createdAt;
        }
        if (filters.sort === SortOptions.DESC) {
          return a.createdAt - b.createdAt;
        }
        if (filters.sort === SortOptions.MARKET_CAP) {
          return b.marketCap.toNumber() - a.marketCap.toNumber();
        }
        return 0;
      });
  }, [combinedTokensData, data, filters, pairData]);

  return {
    filters,
    isPoolDataLoading: isLoading || isMetaDataLoading,
    onChangeFilter,
    poolData: filteredData,
  };
};

export default useUserProfileData;
