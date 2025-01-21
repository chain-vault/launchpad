import { gql } from '../__generated__/gql';

export const PAIRS_HEADER = gql(/* GraphQL */ `
  fragment PairHeader on Pair {
    poolId
    totalVolumeSOL
    totalVolumeUSD
    participantCount
    createdAt
    solBalance
    tokenBalance
    poolCreator
    token
    token0 {
      id
      name
      symbol
      totalSupply
    }
    token1 {
      id
      name
      symbol
      totalSupply
    }
  }
`);
