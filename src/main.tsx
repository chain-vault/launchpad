import React from 'react';
import ReactDOM from 'react-dom/client';

import graphQlClient from '@adapters/apollo';
import { queryClient, router } from '@adapters/tanstack';
import { ApolloProvider } from '@apollo/client';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from '@tanstack/react-router';
import { Provider as JotaiProvider } from 'jotai';
import { DevTools } from 'jotai-devtools';

import AuthWrapper from '@components/AuthWrapper';
import { SolanaWalletProvider } from '@components/WalletAdapter';
import theme from '@theme/index';

import { jotaiStore } from './atoms';

import './tracing';
import 'jotai-devtools/styles.css';

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme} resetCSS>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
        <ApolloProvider client={graphQlClient}>
          <JotaiProvider store={jotaiStore}>
            <DevTools position="bottom-right" store={jotaiStore} />
            <SolanaWalletProvider>
              <AuthWrapper>
                <RouterProvider router={router} />
              </AuthWrapper>
            </SolanaWalletProvider>
          </JotaiProvider>
        </ApolloProvider>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
