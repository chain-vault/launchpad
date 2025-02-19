import { useMemo, useState } from 'react';

import apiConfig from '@adapters/api/apiConfig';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { Agent, AgentAnalyticsMetrics, PoolAgentMetadata } from '@app-types/agent';
import { GenericLambdaResponse } from '@app-types/index';

import { useGetAllPools } from '@hooks/apein/useGetPool';
import useGetAllTokensWithMetadata from '@hooks/useGetAllTokensWithMetadata';
import { useMultiTokensMetadata } from '@hooks/useToken';

export enum PoolSortOptions {
  CURVE_PROGRESS = 'Bonding Curve',
  MARKET_CAP = 'Market Cap',
  RECENTLY_LAUNCHED = 'Recent',
}
export type AgentFilters = {
  search: string;
  sortBy: PoolSortOptions;
};

export const useGetAgent = (id?: string) =>
  useQuery({
    enabled: !!id,
    queryFn: () =>
      apiConfig<GenericLambdaResponse<Agent>>({
        method: 'GET',
        params: { agent_id: id },
        url: 'get-info',
      }),
    queryKey: ['agent', id],
    select: (response) => response.data.body.response,
  });

export const useGetAgentAnalytics = (agentId: string) =>
  useQuery({
    enabled: !!agentId,
    queryFn: () =>
      apiConfig<GenericLambdaResponse<AgentAnalyticsMetrics>>({
        method: 'GET',
        params: { agent_id: agentId },
        url: 'get-analytics',
      }),
    queryKey: ['get-analytics', agentId],
    select: (response) => response.data.body.response,
  });

export const useFilterAgents = () => {
  const [agentFilters, setAgentFilters] = useState<AgentFilters>({
    search: '',
    sortBy: PoolSortOptions.RECENTLY_LAUNCHED,
  });

  const { data: allPoolsData, isLoading: isPoolsDataLoading } = useGetAllPools();

  const {
    data: agentData,
    isLoading: isAgentDataLoading,
    refetch: refetchAgents,
  } = useQuery({
    queryFn: () =>
      apiConfig<GenericLambdaResponse<Agent[]>>({
        method: 'GET',
        params: {
          is_token: true,
        },
        url: 'filter',
      }),
    queryKey: ['all-agents'],
    select: (response: AxiosResponse<GenericLambdaResponse<Agent[]>>) =>
      response.data.body.response,
  });

  const { isLoading: isFetchTokensLoading, tokens: allFastlaunchTokens } =
    useGetAllTokensWithMetadata(true);

  const excludedTokenList = useMemo(
    () =>
      allPoolsData?.length && !isFetchTokensLoading ?
        allPoolsData
          .map((pool) => pool.token)
          .filter(
            (token) =>
              !allFastlaunchTokens.some((allToken) => allToken.mint.toString() === token.toString())
          )
      : [],
    [allFastlaunchTokens, allPoolsData, isFetchTokensLoading]
  );

  const { isMetaDataLoading, poolTokensMetadata: excludedPoolTokensMetadata } =
    useMultiTokensMetadata(excludedTokenList, true);

  const combinedTokensData = useMemo(
    () => [...allFastlaunchTokens, ...excludedPoolTokensMetadata],
    [allFastlaunchTokens, excludedPoolTokensMetadata]
  );

  const combinedData = allPoolsData.map((pool) => {
    const matchingMetadata = combinedTokensData.find(
      (metadata) => metadata?.mint?.toString() === pool.token.toString()
    );

    return {
      ...pool,
      ...matchingMetadata,
    };
  });

  // TODO: Optimize the filter loop
  const combinedPools: PoolAgentMetadata[] = useMemo(() => {
    if (!agentData || !combinedData) return [];

    const agentPoolIds = new Set(agentData.map((agent) => agent.poolAddress));
    const agentMap = new Map(agentData.map((agent) => [agent.poolAddress, agent]));

    return combinedData
      .filter((pool) => agentPoolIds.has(pool.poolId.toString()))
      .map((pool) => ({
        agent: agentMap.get(pool.poolId.toString()),
        pool,
      }))
      .filter((pool): pool is PoolAgentMetadata => !!pool.agent)
      .sort((a, b) => {
        if (agentFilters.sortBy === PoolSortOptions.MARKET_CAP) {
          return Number(b.pool.marketCap) - Number(a.pool.marketCap);
        }
        if (agentFilters.sortBy === PoolSortOptions.CURVE_PROGRESS) {
          return b.pool.bondingCurveProgress - a.pool.bondingCurveProgress;
        }
        if (agentFilters.sortBy === PoolSortOptions.RECENTLY_LAUNCHED) {
          return b.pool.createdAt - a.pool.createdAt;
        }
        return 0;
      })
      .filter((data) =>
        data.pool.tokenName.toLowerCase().includes(agentFilters.search.toLowerCase())
      );
  }, [combinedData, agentData, agentFilters]);

  const onChangeFilters = (newFilter: Partial<AgentFilters>) => {
    setAgentFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilter,
    }));
  };

  return {
    data: combinedPools,
    filter: agentFilters,
    isLoading: isAgentDataLoading || isPoolsDataLoading || isMetaDataLoading,
    onChangeFilters,
    refetch: refetchAgents,
  };
};
