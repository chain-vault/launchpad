import { gql } from '../__generated__/gql';

export const TRANSACTIONS_TABLE = gql(/* GraphQL */ `
  fragment SwapTransactions on Swap {
    pair {
      ...PairHeader
    }
    tokenPrice
    amountIn
    amountOut
    amountSOL
    amountUSD
    solBal
    tokenBal
    tokenInAddr
    tokenOutAddr
    caller
    timestamp
    eventType
    signature
  }
`);
