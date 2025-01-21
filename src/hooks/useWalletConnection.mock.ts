import { fn } from '@storybook/test';

import useWalletConnectionActual from './useWalletConnection';

export * from './useWalletConnection';

const useWalletConnection = fn(useWalletConnectionActual).mockName(
  'useWalletConnection::useWalletConnection'
);

export default useWalletConnection;
