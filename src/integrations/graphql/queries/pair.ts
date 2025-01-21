import { gql } from '../__generated__/gql';

const PAIR_DATA_QUERY = gql(/* GraphQL */ `
  query PairData($pairId: ID!) {
    pair(id: $pairId) {
      ...PairHeader
    }
  }
`);

export default PAIR_DATA_QUERY;
