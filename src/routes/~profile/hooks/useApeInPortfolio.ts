import { useMemo, useState } from 'react';

import { useSearch } from '@tanstack/react-router';

import { PoolWithTokenData } from '@app-types/apiIn';
import { SortOptions } from '@app-types/index';

import { DEFAULT_TOKEN_DECIMAL } from '@constants/config';
import usePoolData from '@hooks/apein/useFastLaunchListWithToken';
import useGetTokenAccoutsByWallet from '@hooks/useGetAllTokensByUserWallet';
import { useWeb3React } from '@hooks/useWeb3React';
import { Token } from '@utils/token';

type FilterTypes = {
  searchQuery: string;
  sort: SortOptions;
};

const DEFAULT_FILTERS: FilterTypes = {
  searchQuery: '',
  sort: SortOptions.asc,
};

const useFastLaunchPortfolio = () => {
  const { publicKey } = useWeb3React();
  const { user } = useSearch({ from: '/profile/' });
  const userAccount = user || publicKey?.toString();

  const { data, isLoading } = usePoolData();
  const { isLoading: isAssestsLoading, tokenAccounts } = useGetTokenAccoutsByWallet(
    userAccount,
    true
  );

  const [filters, setFilters] = useState<FilterTypes>(DEFAULT_FILTERS);

  const onChangeFilter = (filter: Partial<FilterTypes>, resetFilters = false) =>
    setFilters((currentFilter) => ({
      ...(!resetFilters ? currentFilter : DEFAULT_FILTERS),
      ...filter,
    }));

  const combinedPoolDataWithTokenBalance: ({
    tokenBalance: string;
  } & PoolWithTokenData)[] = useMemo(() => {
    if (isLoading || isAssestsLoading) return [];
    return data
      .map((pool) => {
        const tokenBalance =
          pool?.mint && tokenAccounts && tokenAccounts[pool.mint.toString()] ?
            Token.fromRawAmount(
              tokenAccounts[pool.mint.toString()],
              DEFAULT_TOKEN_DECIMAL
            ).toString()
          : '';
        return {
          ...pool,
          tokenBalance,
        };
      })
      .filter((pool) => {
        if (pool.tokenBalance === '') return false;
        const matchesSearch =
          pool.tokenName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          pool?.symbol?.toLowerCase().includes(filters.searchQuery.toLowerCase());

        return matchesSearch;
      })
      .sort((a, b) => {
        const balanceA = parseFloat(a.tokenBalance);
        const balanceB = parseFloat(b.tokenBalance);

        if (filters.sort === SortOptions.asc) {
          return balanceA - balanceB;
        }
        return balanceB - balanceA;
      });
  }, [data, filters.searchQuery, filters.sort, isAssestsLoading, isLoading, tokenAccounts]);

  return {
    filters,
    isLoading: isLoading || isAssestsLoading,
    onChangeFilter,
    portfolioData: combinedPoolDataWithTokenBalance,
  };
};

export default useFastLaunchPortfolio;
