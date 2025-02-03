import { useMemo, useState } from 'react';

import apiConfig from '@adapters/api/apiConfig';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { Agent, AgentAnalyticsMetrics, PoolWithAgent } from '@app-types/agent';
import { GenericLambdaResponse } from '@app-types/index';

import { useGetAllPools } from '@hooks/apein/useGetPool';

export enum PoolSortOptions {
  CURVE_PROGRESS = 'Bonding Curve Progress',
  MARKET_CAP = 'Market Cap',
  RECENTLY_LAUNCHED = 'Recently Launched',
}
export type AgentFileters = {
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
  const [agentFilters, setAgentFilters] = useState<AgentFileters>({
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

  // TODO: Optimize the filter loop
  const combinedPools: PoolWithAgent[] = useMemo(() => {
    if (!allPoolsData || !agentData) return [];

    const agentPoolIds = new Set(agentData.map((agent) => agent.poolAddress));
    const agentMap = new Map(agentData.map((agent) => [agent.poolAddress, agent]));

    return allPoolsData
      .filter((pool) => agentPoolIds.has(pool.poolId.toString()))
      .map((pool) => ({
        agent: agentMap.get(pool.poolId.toString()),
        pool,
      }))
      .filter((pool): pool is PoolWithAgent => !!pool.agent)
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
  }, [allPoolsData, agentData, agentFilters]);

  const onChangeFilters = (newFilter: Partial<AgentFileters>) => {
    setAgentFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilter,
    }));
  };

  return {
    data: combinedPools,
    filter: agentFilters,
    isLoading: isAgentDataLoading || isPoolsDataLoading,
    onChangeFilters,
    refetch: refetchAgents,
  };
};
