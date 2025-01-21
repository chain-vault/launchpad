import type { PublicKey } from '@solana/web3.js';

import { useCallback, useMemo } from 'react';

import {
  updateAuthStatusAtom,
  userAuthAtom,
  userAuthTokenWriteAtom,
  walletConnectModalAtom,
} from '@atoms/index';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAtom, useAtomValue } from 'jotai';

import { UserAuthenticationStatus } from '@constants/index';

const useWalletConnection = () => {
  const { connected, connecting, disconnect, select, wallets } = useWallet();
  const [, setUserAuthToken] = useAtom(userAuthTokenWriteAtom);
  const [, setAuthStatus] = useAtom(updateAuthStatusAtom);
  const userAuthState = useAtomValue(userAuthAtom);
  const [, setIsOpen] = useAtom(walletConnectModalAtom);

  const onDisconnectWallet = useCallback(() => {
    setUserAuthToken('');
    setAuthStatus({
      authenticationStatus: UserAuthenticationStatus.NOT_AUTHORIZED,
      publickKey: undefined,
    });
    if (connected) disconnect();
  }, [connected, disconnect, setAuthStatus, setUserAuthToken]);

  const onAccountChange = useCallback(
    (publicKey: PublicKey) => {
      setUserAuthToken('');
      setAuthStatus({
        authenticationStatus: UserAuthenticationStatus.ACCOUNT_SWITCHED,
        publickKey: publicKey.toString(),
      });
      setIsOpen(true);
    },
    [setAuthStatus, setIsOpen, setUserAuthToken]
  );

  return useMemo(
    () => ({
      conectWallet: select,
      connecting:
        userAuthState.authenticationStatus === UserAuthenticationStatus.CONNECTING_WALLET ||
        userAuthState.authenticationStatus === UserAuthenticationStatus.SIGNING_USER ||
        connecting,
      connectors: wallets,
      disconnect: onDisconnectWallet,
      isConnected:
        userAuthState.authenticationStatus === UserAuthenticationStatus.USER_AUTHENTICATED &&
        connected,
      isWalletConnected: connected,
      isWalletConnecting: connecting,
      onAccountChange,
    }),
    [
      connected,
      connecting,
      onAccountChange,
      onDisconnectWallet,
      select,
      userAuthState.authenticationStatus,
      wallets,
    ]
  );
};

export const useConnectWallet = () => {
  const { connecting, isConnected } = useWalletConnection();
  const [, setIsOpen] = useAtom(walletConnectModalAtom);

  const onConnectWallet = () => setIsOpen(true);

  return {
    connecting,
    isConnected,
    onConnectWallet,
  };
};

export default useWalletConnection;
