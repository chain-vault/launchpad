import { useCallback, useEffect, useMemo, useRef } from 'react';

import { lastSelectedWallet } from '@atoms/index';
import { useColorMode } from '@chakra-ui/react/color-mode';
import { createPhantom } from '@phantom/wallet-sdk';
import { WalletName, WalletReadyState } from '@solana/wallet-adapter-base';
import { useWallet, Wallet } from '@solana/wallet-adapter-react';
import { PhantomWalletName } from '@solana/wallet-adapter-wallets';
import { useAtom } from 'jotai';
import isFunction from 'lodash/isFunction';

import { PHANTOM_DOWNLOAD_URL } from '@constants/config';
import { isApeInEmbeddedWalletEnabled } from '@constants/config/features';

import PhantomGoogle from '@assets/imges/google-phantom.svg';

interface Connector extends Wallet {
  meta?: {
    displayName: string;
    downloadURI?: string;
    id: string;
    logoUrl?: string;
  };
}

type ConnectorsOptions = {
  onEmbeddedWalletReady?: () => void;
};
export const hasPhantomExtension = window.phantom && window.phantom.solana;
export const useConnectors = (
  options?: ConnectorsOptions
): {
  connectors: Connector[];
  getDownloadUrl: (connector: Connector) => null | string;
  isSelectedWallet: (connector: Connector) => boolean;
} => {
  const [{ isEmbededPhantom, name: lastConnectedWalletName }, setLastSelectedWallet] =
    useAtom(lastSelectedWallet);
  const { disconnect, wallet, wallets } = useWallet();
  const loadedEmbeddedWallet = useRef(false);
  const { colorMode } = useColorMode();
  const connectors = useMemo(() => {
    if (!isApeInEmbeddedWalletEnabled) {
      return wallets;
    }
    const adaptors = [...wallets];

    const phantom = adaptors.find((adaptor) => adaptor.adapter.name === PhantomWalletName);
    if (!hasPhantomExtension && phantom) {
      const adapter = {
        ...phantom,
        meta: {
          id: phantom.adapter.name,
          displayName: 'Google',
          logoUrl: PhantomGoogle,
        },
      };
      adaptors.unshift(adapter);
    }
    return adaptors;
  }, [wallets]);

  const loadPhantomSDK = useCallback(
    (walletName: undefined | WalletName) => {
      if (
        isApeInEmbeddedWalletEnabled &&
        walletName &&
        walletName === PhantomWalletName &&
        isEmbededPhantom &&
        !hasPhantomExtension &&
        !loadedEmbeddedWallet.current
      ) {
        loadedEmbeddedWallet.current = !0;
        createPhantom({
          colorScheme: colorMode,
          zIndex: 9999,
        });
        return !0;
      }
    },
    [colorMode, isEmbededPhantom]
  );

  const onWalletInitialize = useCallback(() => {
    if (isFunction(options?.onEmbeddedWalletReady)) {
      options.onEmbeddedWalletReady();
    }
  }, [options]);

  const isSelectedWallet = (connector: Connector) => {
    const isPhantomSelected = wallet?.adapter?.name === PhantomWalletName;

    if (isPhantomSelected) {
      if (isEmbededPhantom) {
        return connector.meta?.id === wallet.adapter.name;
      }
      return !connector.meta?.id && connector.adapter.name === wallet.adapter.name;
    }
    return wallet?.adapter.name === connector.adapter.name;
  };

  const getDownloadUrl = (connector: Connector): null | string => {
    const isPhantomWallet = connector.adapter.name === PhantomWalletName;
    const shouldDownload =
      (connector.readyState === WalletReadyState.NotDetected && !isPhantomWallet) ||
      (connector.adapter.name === PhantomWalletName && !hasPhantomExtension && !connector.meta?.id);

    if (shouldDownload) {
      return isPhantomWallet ? PHANTOM_DOWNLOAD_URL : connector.adapter.url;
    }
    return null;
  };
  useEffect(() => {
    loadPhantomSDK(wallet?.adapter?.name);
    window.addEventListener('phantom#embedded#initialized', onWalletInitialize);
    return () => {
      window.removeEventListener('phantom#embedded#initialized', onWalletInitialize);
    };
  }, [
    disconnect,
    isEmbededPhantom,
    lastConnectedWalletName,
    loadPhantomSDK,
    onWalletInitialize,
    setLastSelectedWallet,
    wallet,
  ]);
  return {
    connectors,
    getDownloadUrl,
    isSelectedWallet,
  };
};
