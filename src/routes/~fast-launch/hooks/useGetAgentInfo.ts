import { isToken } from "@metaplex-foundation/js";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";

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

export const useFilterAgents = (name?: string, public_key?: string, is_token?: boolean) =>
    useQuery({
        queryFn: () =>
            axios.get<any, AxiosResponse<GenericLambdaResponse<Agent[]>>>(
                `${import.meta.env.VITE_EXTERNAL_SERVICE_BASE}/filter`,
                {
                    params: { 
                        is_token: false,
                        ...(name && name.length>0 && { name }),
                        ...(public_key && public_key.length>0 && { public_key }),
                        ...(is_token !== undefined && { is_token }),
                    },
                }
            ),
        queryKey: [name, public_key, is_token],
        select: (response: AxiosResponse<GenericLambdaResponse<Agent[]>>) => response.data.body.response,
        staleTime: 60 * 60 * 1000,
    });