import { PoolData } from './apiIn';

export type Agent = {
  bio: string;
  content: string;
  description: string;
  greeting: string;
  id: string;
  imageUrl?: string;
  name: string;
  poolAddress: string;
  publicKey?: string;
};

export type PoolWithAgent = { agent: Agent } & { pool: PoolData };
