/* eslint-disable no-console */
import { ApolloClient, ApolloLink, from, HttpLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { jotaiStore, userAuthAtom } from '@atoms/index';
import { setContext } from 'apollo-link-context';
import isFunction from 'lodash/isFunction';

import { BASE_CONFIG } from '@constants/config';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ locations, message, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);

    // Check if the networkError is a ServerError and has a statusCode
    if ('statusCode' in networkError && networkError.statusCode === 403) {
      console.log('403 Forbidden error handled');
      const { disconnectWallet } = jotaiStore.get(userAuthAtom);
      if (isFunction(disconnectWallet)) disconnectWallet();
    }
  }
});

const lbpEndpoint = new HttpLink({
  uri: BASE_CONFIG.lbpGraphqlApiEndpoint,
});

const fastLaunchEndpoint = new HttpLink({
  credentials: 'include',
  uri: BASE_CONFIG.fastlaunchGraphqlApiEndpoint,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token =
    localStorage.getItem('gmtValue') ? JSON.parse(localStorage.getItem('gmtValue') ?? '') : '';
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const httpLink = ApolloLink.split(
  (operation) => operation.getContext().apiName === 'apein',
  fastLaunchEndpoint,
  lbpEndpoint
);

const link = from([errorLink, authLink as unknown as ApolloLink, httpLink]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  connectToDevTools: true,
  link,
});

export default client;
