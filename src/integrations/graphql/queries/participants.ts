import { gql } from '../__generated__/gql';

const PARTICIPANTS_DATA_QUERY = gql(/* GraphQL */ `
  query PoolParticipants($id: ID!) {
    poolUsers(poolId: $id) {
      userId
      poolId
    }
  }
`);

export const USER_PORTFOLIO = gql(/* GraphQL */ `
  query UserPortfolio($userId: ID) {
    poolUsers(userId: $userId) {
      userId
      poolId
      poolToken
      totalVolumeSOL
      totalVolumeUSD
      poolTokenName
      poolTokenSymbol
    }
  }
`);

export default PARTICIPANTS_DATA_QUERY;
