import { gql } from '../__generated__/gql';

export const TOKENS_INFO_QUERY = gql(/* GraphQL */ `
  query tokensData($id: ID!) {
    token(id: $id) {
      ...TokenHeader
    }
  }
`);

const TOKENS_DATA_QUERY = gql(/* GraphQL */ `
  query tokensSwapInfo($id: ID!) {
    token(id: $id) {
      ...TokenHeader
      swaps(desc: true) {
        ...SwapTransactions
      }
    }
  }
`);

export const GET_ALL_TOKENS = gql(/* GraphQL */ `
  query tokensList {
    tokens {
      ...TokenHeader
      pools {
        poolId
      }
    }
  }
`);

export const GET_ALL_TOKENS_METADATA = gql(/* GraphQL */ `
  query tokensWithMetadata($owner: ID = null) {
    tokens(owner: $owner) {
      ...TokenHeader
      ...MetaData
      __typename
    }
  }
`);

export const GET_LOCKED_TOKEN_HOLDERS = gql(/* GraphQL */ `
  query lockedTokens($id: ID!) {
    lockedTokens(id: $id) {
      id
      name
      token
      escrow
      escrowMetadata
      escrowToken
      lockStarttime
      lockPeriod
      lockedToken
    }
  }
`);

export default TOKENS_DATA_QUERY;
