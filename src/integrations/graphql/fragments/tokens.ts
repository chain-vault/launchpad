import { gql } from '../__generated__/gql';

export const TOKENS_HEADER = gql(/* GraphQL */ `
  fragment TokenHeader on Token {
    id
    symbol
    decimals
    metadataUrl
    logo
    name
    totalSupply
  }
`);

export const TOKEN_METADATA = gql(/* GraphQL */ `
  fragment MetaData on Token {
    discord
    github
    poolDescription
    roadmap
    telegram
    twitter
    website
    whitepaper
    metadataUrl
  }
`);
