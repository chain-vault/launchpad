import { isToken } from "@metaplex-foundation/js";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";

export type GenericLambdaResponse<T> = {
    body: {
        response: T;
    };
    statusCode: number;
};

type Agent = {
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

export const useFilterAgents = (name?: string, public_key?: string) =>
    useQuery({
        queryFn: () =>
            axios.get<any, AxiosResponse<GenericLambdaResponse<Agent[]>>>(
                `${import.meta.env.VITE_EXTERNAL_SERVICE_BASE}/filter`,
                {
                    params: { 
                        is_token: false,
                        // name,
                        // public_key,
                    },
                }
            ),
        queryKey: [name, public_key],
        select: (response: AxiosResponse<GenericLambdaResponse<Agent[]>>) => response.data.body.response,
        staleTime: 60 * 60 * 1000,
    });