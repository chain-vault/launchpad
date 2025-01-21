import { gql } from '../__generated__/gql';

const TRANSACTIONS_DATA_QUERY = gql(/* GraphQL */ `
  query TransactionsData($limit: Int) {
    swaps(limit: $limit, desc: true) {
      ...SwapTransactions
    }
  }
`);

export default TRANSACTIONS_DATA_QUERY;
