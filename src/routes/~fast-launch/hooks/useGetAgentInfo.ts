import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

import { PoolData } from '@app-types/apiIn';

import { useGetAllPools } from '@hooks/apein/useGetPool';

export type GenericLambdaResponse<T> = {
  body: {
    response: T;
  };
  statusCode: number;
};

export type Agent = {
  bio: string;
  content: string;
  description: string;
  greeting: string;
  id: string;
  image_url?: string;
  name: string;
  public_key?: string;
};

export const useGetAgent = (id?: string) =>
  useQuery({
    enabled: !!id,
    queryFn: () =>
      axios.get<any, AxiosResponse<GenericLambdaResponse<Agent>>>(
        `${import.meta.env.VITE_EXTERNAL_SERVICE_BASE}/get-info`,
        {
          params: { agent_id: id },
        }
      ),
    queryKey: ['agents', id],
    select: (response) => response.data.body.response,
    staleTime: 60 * 60 * 1000,
  });

export const useGetAgentAnalytics = (agent_id?: string) =>
  useQuery({
    enabled: !!agent_id,
    queryFn: () =>
      axios.get<any>(`${import.meta.env.VITE_EXTERNAL_SERVICE_BASE}/get-analytics`, {
        params: { agent_id },
      }),
    queryKey: [agent_id, 'get-analytics'],
    select: (response) => response.data.body.response,
    staleTime: 60 * 60 * 1000,
  });

export type PoolWithAgent = { agent: Agent } & { pool: PoolData };
export type PoolWithAgentFilterType = 'bonded' | 'marketCap' | 'recentlyLaunched';

export const useFilterAgents = (
  name?: string,
  public_key?: string,
  is_token?: boolean,
  filter: PoolWithAgentFilterType = 'recentlyLaunched'
) => {
  const { data: allPoolsData, isLoading: isPoolsDataLoading } = useGetAllPools();
  const {
    data: agentData,
    isLoading: isAgentDataLoading,
    refetch: refetchAgents,
  } = useQuery({
    queryFn: () =>
      axios.get<any, AxiosResponse<GenericLambdaResponse<Agent[]>>>(
        `${import.meta.env.VITE_EXTERNAL_SERVICE_BASE}/filter`,
        {
          params: {
            is_token: true,
            ...(name && name.length > 0 && { name }),
            ...(public_key && public_key.length > 0 && { public_key }),
            ...(is_token !== undefined && { is_token }),
          },
        }
      ),
    queryKey: [name, public_key, is_token],
    select: (response: AxiosResponse<GenericLambdaResponse<Agent[]>>) =>
      response.data.body.response,
    staleTime: 60 * 60 * 1000,
  });

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
        if (filter === 'marketCap') {
          return Number(b.pool.marketCap) - Number(a.pool.marketCap);
        }
        if (filter === 'bonded') {
          return b.pool.bondingCurveProgress - a.pool.bondingCurveProgress;
        }
        return 0;
      });
  }, [allPoolsData, agentData, filter]);

  return {
    data: combinedPools,
    isLoading: isAgentDataLoading || isPoolsDataLoading,
    refetch: refetchAgents,
  };
};
