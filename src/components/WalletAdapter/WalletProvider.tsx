import { FC, ReactNode, useCallback, useEffect, useMemo } from 'react';

import {
  lastSelectedWallet,
  transactionSettings,
  updateAuthStatusAtom,
  updateDisconnectWalletAtom,
  userAuthTokenWriteAtom,
} from '@atoms/index';
import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
  CoinbaseWalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  PhantomWalletName,
  SafePalWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  TrezorWalletAdapter,
  WalletConnectWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { useAtom, useAtomValue } from 'jotai';

import { RPCOptions } from '@constants/config/transactions';
import { BASE_CONFIG, UserAuthenticationStatus } from '@constants/index';
import { hasPhantomExtension } from '@hooks/useConnectors';
import useWalletConnection from '@hooks/useWalletConnection';

const disconnectErrors = [
  'WalletConnectionError',
  'WalletDisconnectedError',
  'WalletNotReadyError',
  'WalletDisconnectionError',
  'WalletAccountError',
  'WalletPublicKeyError',
  'WalletKeypairError',
];

/** A component to run hooks under the SolanaWalletProvider context. */
export const Updater = () => {
  const { disconnect } = useWalletConnection();

  const [, setUserAuth] = useAtom(updateDisconnectWalletAtom);

  // Update the atom's disconnectWallet function when `disconnect` changes
  useEffect(() => {
    setUserAuth(disconnect);
  }, [disconnect, setUserAuth]);

  return null;
};

export const SolanaWalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [, setUserAuthToken] = useAtom(userAuthTokenWriteAtom);
  const [, setAuthStatus] = useAtom(updateAuthStatusAtom);
  const { customRPCUrl, selectedRPC } = useAtomValue(transactionSettings);

  const endpoint = useMemo(() => {
    if (selectedRPC !== RPCOptions.HELIUS && customRPCUrl) return customRPCUrl;

    return BASE_CONFIG.rpcUrl;
  }, [customRPCUrl, selectedRPC]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // const endpoint = BASE_CONFIG.rpcUrl; //  useMemo(() => clusterApiUrl(network), [network]);
  const onError = useCallback(
    (error: WalletError) => {
      console.error(error.name);
      if (disconnectErrors.includes(error.name)) {
        setUserAuthToken('');
        setAuthStatus({
          authenticationStatus: UserAuthenticationStatus.NOT_AUTHORIZED,
          publickKey: undefined,
        });
      }
    },
    [setAuthStatus, setUserAuthToken]
  );

  const wallets = useMemo(
    () => [
      new CoinbaseWalletAdapter(),
      new WalletConnectWalletAdapter({
        network:
          BASE_CONFIG.network === 'devnet' ?
            WalletAdapterNetwork.Devnet
          : WalletAdapterNetwork.Mainnet,
        options: {
          metadata: {
            description: 'Apeon Interface',
            icons: [''],
            name: 'Apeon',
            relayUrl: 'wss://relay.walletconnect.com',
            url: 'https://dapp.apeon.it/',
          },
          projectId: import.meta.env.VITE_WC_PROJECT_ID as string,
        },
      }),
      new PhantomWalletAdapter(),
      new SafePalWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new TrezorWalletAdapter(),
    ],
    []
  );

  const [{ isEmbededPhantom, name }] = useAtom(lastSelectedWallet);
  const hasAutoConnectEnabled = !!(
    name !== PhantomWalletName ||
    (isEmbededPhantom && !hasPhantomExtension) ||
    (!isEmbededPhantom && hasPhantomExtension)
  );
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider autoConnect={hasAutoConnectEnabled} onError={onError} wallets={wallets}>
        <Updater />
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};
