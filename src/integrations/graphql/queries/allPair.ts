import { gql } from '../__generated__/gql';

const ALL_PAIR_DATA_QUERY = gql(/* GraphQL */ `
  query AllPairs($env: String) {
    pairs(env: $env) {
      ...PairHeader
      curveThresholdTime
      lastTransactionTime
      __typename
    }
  }
`);

export const ALL_APEIN_PAIR_DATA = gql(/* GraphQL */ `
  query ApeInPairs($env: String) {
    pairs(env: $env) {
      ...PairHeader
      curveThresholdTime
      lastTransactionTime
      curveThresholdReached
      coefficient1
      coefficient2
      curve
      tokenPrice
      bondingCurveProgress
      initialBuyLockDays
      liquidityPool
      curveIndex
      # selectedDex
      __typename
    }
  }
`);

export default ALL_PAIR_DATA_QUERY;
