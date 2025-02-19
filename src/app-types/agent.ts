import { PoolData } from './apiIn';
import { PoolAndTokenMetaData } from './poolAndToken';

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

export type PoolAgentMetadata = { agent: Agent } & { pool: PoolAndTokenMetaData & PoolData };

export type AgentAnalyticsMetrics = {
  agentId: string;
  msgCount: string;
  userCount: string;
};
