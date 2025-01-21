import { gql } from '../__generated__/gql';

export const GET_REFERAL_CODE = gql(/* GraphQL */ `
  mutation getReferalCode($publicKey: String!) {
    generateReferralCode(publicKey: $publicKey) {
      referralCode
    }
  }
`);

export const CREATE_TRADE_WITH_REFERAL = gql(/* GraphQL */ `
  mutation createTradeWithReferal(
    $publicKey: String!
    $poolId: String!
    $signature: String!
    $referredUserCode: String!
  ) {
    createTrade(
      publicKey: $publicKey
      poolId: $poolId
      signature: $signature
      referredUserCode: $referredUserCode
    ) {
      message
    }
  }
`);

export const VALIDATE_REFERRAL = gql(/* GraphQL */ `
  query ValidateReferral($referralCode: String!) {
    validateReferral(referralCode: $referralCode)
  }
`);
