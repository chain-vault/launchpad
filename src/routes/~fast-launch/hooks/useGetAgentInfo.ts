import { useMemo } from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

import { PoolData } from '@app-types/apiIn';

import { useGetAllPools } from '@hooks/apein/useGetPool';

import queryClient from '../utils/queryClient';

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
    queryKey: [id],
    select: (response) => response.data.body.response,
    staleTime: 60 * 60 * 1000,
  });

export const useGetAgentAnalytics = (agent_id?: string) =>
  useQuery({
    enabled: !!agent_id,
    queryFn: () =>
      axios.get<any>(
        `${import.meta.env.VITE_EXTERNAL_SERVICE_BASE}/get-analytics`,
        {
          params: { agent_id },
        }
      ),
    queryKey: [agent_id, 'get-analytics'],
    select: (response) => response.data.body.response,
    staleTime: 60 * 60 * 1000,
  });

  export type PoolWithAgent = { agent: Agent } & { pool: PoolData };

  export const useFilterAgents = (name?: string, public_key?: string, is_token?: boolean) => {
    const { data: allPoolsData, isLoading: isPoolsDataLoading } = useGetAllPools();
    const { data: agentData, isLoading: isAgentDataLoading, refetch: refetchAgents } = useQuery({
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
        .filter((pool): pool is PoolWithAgent => !!pool.agent);
    }, [allPoolsData, agentData]);
  
    return {
      data: combinedPools,
      isLoading: isAgentDataLoading || isPoolsDataLoading,
      refetch: refetchAgents,
    };
  };

type CreateJwtProps = {
  message: string;
  public_key: string;
  signature: number[];
};
type CreateJwtResponse = AxiosResponse<{
  access_token: string;
}>;

export const useCreateJwt = () =>
  useMutation({
    mutationFn: (payload: CreateJwtProps) =>
      axios.post<CreateJwtProps, CreateJwtResponse>(
        `${import.meta.env.VITE_EXTERNAL_SERVICE_BASE}/login`,
        payload
      ),
    onError: (err) => toast.error(err.message),
    onSuccess: (response) => {
      Cookies.set('token', response.data.access_token, { secure: true });
      queryClient.invalidateQueries();
    },
  });

export const useGetWalletAuth = () =>
  useMutation({
    mutationFn: () => axios.get(`${import.meta.env.VITE_EXTERNAL_SERVICE_BASE}/wallet-auth`),
  });
