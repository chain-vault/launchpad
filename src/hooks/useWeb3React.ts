import { useMemo } from 'react';

import {
  jotaiStore,
  transactionSettings,
  transactionSettingsReadOnly,
  userAuthAtom,
} from '@atoms/index';
import { AnchorProvider } from '@coral-xyz/anchor';
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { Connection, Keypair } from '@solana/web3.js';
import { useAtomValue } from 'jotai';

import { RPCOptions } from '@constants/config/transactions';
import { BASE_CONFIG, UserAuthenticationStatus } from '@constants/index';
import ProxyWallet from '@utils/proxyWallet';

// export const connection = new Connection(BASE_CONFIG.rpcUrl, 'confirmed');

export const getConnection = () => {
  const { customRPCUrl, selectedRPC } = jotaiStore.get(transactionSettings);
  if (selectedRPC !== RPCOptions.HELIUS && customRPCUrl)
    return new Connection(customRPCUrl, 'confirmed');

  return new Connection(BASE_CONFIG.rpcUrl, 'confirmed');
};

export const getNonSignerProvider = () => {
  const rpcConnection = getConnection();
  return new AnchorProvider(rpcConnection, new ProxyWallet(Keypair.generate()), {
    preflightCommitment: 'confirmed',
  });
};
/**
 * Custom hook to get a web3 provider.
 *
 * @param [withSignerIfPossible=true] - Flag indicating whether to use a signer if available.
 * @returns {AnchorProvider | null} - The Anchor provider instance.
 *
 * @example
 * const provider = useWeb3Provider(true);
 */
export const useWeb3Provider = (withSignerIfPossible = true): AnchorProvider | undefined => {
  const anchorWallet = useAnchorWallet();
  const { customRPCUrl, selectedRPC } = useAtomValue(transactionSettingsReadOnly);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const connection = useMemo(() => getConnection(), [selectedRPC, customRPCUrl]);
  const provider =
    withSignerIfPossible ?
      anchorWallet &&
      new AnchorProvider(connection, anchorWallet, {
        preflightCommitment: 'confirmed',
      })
    : new AnchorProvider(connection, new ProxyWallet(Keypair.generate()), {
        preflightCommitment: 'confirmed',
      });

  return provider;
};

/**
 * Custom hook to interact with the web3 wallet and connection.
 *
 * @returns An object containing connection state and wallet methods.
 * @returns connecting - Indicates if the wallet is currently connecting.
 * @returns connection - The current web3 connection.
 * @returns isConnected - Indicates if the wallet is connected.
 * @returns publicKey - The public key of the connected wallet.
 * @returns sendTransaction - Function to send transactions.
 * @returns wallet - The connected wallet instance.
 *
 * @example
 * const { connecting, connection, isConnected, publicKey, sendTransaction, wallet } = useWeb3React();
 */
export const useWeb3React = () => {
  const { connected, connecting, publicKey, sendTransaction, signMessage, wallet } = useWallet();
  const userAuthState = useAtomValue(userAuthAtom);
  const { customRPCUrl, selectedRPC } = useAtomValue(transactionSettings);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rpcConnection = useMemo(() => getConnection(), [selectedRPC, customRPCUrl]);

  return useMemo(
    () => ({
      connecting:
        userAuthState.authenticationStatus === UserAuthenticationStatus.CONNECTING_WALLET ||
        userAuthState.authenticationStatus === UserAuthenticationStatus.SIGNING_USER ||
        connecting,
      connection: rpcConnection,
      isConnected:
        userAuthState.authenticationStatus === UserAuthenticationStatus.USER_AUTHENTICATED &&
        connected,
      isWalletConnecting: connecting,
      publicKey,
      sendTransaction,
      signMessage,
      wallet,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [connected, publicKey, userAuthState.authenticationStatus]
  );
};
