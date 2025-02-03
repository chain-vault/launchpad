import { useEffect } from 'react';

import {
  updateAuthStatusAtom,
  userAuthAtom,
  userAuthTokenAtom,
  walletConnectModalAtom,
} from '@atoms/index';
import { useAtom, useAtomValue } from 'jotai';

import { UserAuthenticationStatus } from '@constants/index';
import { useAuth } from '@hooks/useAuth';
import useUserAuthentication from '@hooks/useUserAuthentication';
import useWalletConnection from '@hooks/useWalletConnection';
import { useWeb3React } from '@hooks/useWeb3React';

import WalletSelectModal from './WalletSelectModal';

const AuthWrapper = ({ children }: React.PropsWithChildren) => {
  const { publicKey } = useWeb3React();
  const { isWalletConnected, onAccountChange } = useWalletConnection();
  const [, setAuthStatus] = useAtom(updateAuthStatusAtom);
  const { authenticationStatus, publickKey: connectedPublickKey } = useAtomValue(userAuthAtom);
  const { isTokenExpired, refreshAuthToken } = useUserAuthentication();

  const authToken = useAtomValue(userAuthTokenAtom);
  const [, setIsOpen] = useAtom(walletConnectModalAtom);

  const { authenticateUser, handleAuthorizationError } = useAuth();

  // useEffect to handle the user authentication
  useEffect(() => {
    // console.log(isWalletConnected, publicKey?.toString(), connecting);
    if (isWalletConnected && publicKey) {
      if (connectedPublickKey && publicKey.toString() !== connectedPublickKey)
        // show sign prompt again
        return onAccountChange(publicKey);

      if (authenticationStatus === UserAuthenticationStatus.NOT_AUTHORIZED) {
        // case where wallet is already connected but no auth token
        if (!authToken) return handleAuthorizationError();
        // case where user token is expired
        if (isTokenExpired()) {
          refreshAuthToken(false);
        }
      }

      if (!authToken) {
        authenticateUser();
      } else {
        setAuthStatus({
          authenticationStatus: UserAuthenticationStatus.USER_AUTHENTICATED,
          publickKey: publicKey.toString(),
        });
        setIsOpen(false);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWalletConnected, publicKey]);

  return (
    <>
      {children}
      <WalletSelectModal />
    </>
  );
};

export default AuthWrapper;
