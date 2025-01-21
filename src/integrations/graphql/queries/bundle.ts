import { gql } from '../__generated__/gql';

const BUNDLE_DATA_QUERY = gql(/* GraphQL */ `
  query BundleData {
    bundle {
      solPrice
    }
  }
`);

export default BUNDLE_DATA_QUERY;
