import { gql } from '../__generated__/gql';

export const GET_NONCE_QUERY = gql(/* GraphQL */ `
  query getNonce($publicKey: String!) {
    walletAuthNonce(publicKey: $publicKey)
  }
`);

export const GET_AUTH_TOKEN = gql(/* GraphQL */ `
  mutation authenticate(
    $publicKey: String!
    $signature: String!
    $nonce: String!
    $timestamp: String!
  ) {
    walletAuth(publicKey: $publicKey, signature: $signature, nonce: $nonce, timestamp: $timestamp) {
      token
    }
  }
`);

export const GET_REFRESH_TOKEN = gql(/* GraphQL */ `
  mutation RefreshToken {
    refreshToken {
      token
    }
  }
`);
