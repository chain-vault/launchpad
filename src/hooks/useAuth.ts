import { useLazyQuery, useMutation } from '@apollo/client';
import { updateAuthStatusAtom, userAuthTokenWriteAtom, walletConnectModalAtom } from '@atoms/index';
import { GET_AUTH_TOKEN, GET_NONCE_QUERY } from '@integrations/graphql/queries/auth';
import { encode } from 'bs58';
import dayjs from 'dayjs';
import { useAtom } from 'jotai';

import {
  AuthErrorMessages,
  generateSignInMessage,
  UserAuthenticationStatus,
} from '@constants/index';
import useToast from '@hooks/useToast';
import useWalletConnection from '@hooks/useWalletConnection';
import { useWeb3React } from '@hooks/useWeb3React';

export const useAuth = () => {
  const { publicKey, signMessage } = useWeb3React();
  const { disconnect } = useWalletConnection();
  const [, setAuthStatus] = useAtom(updateAuthStatusAtom);
  const { errorToast } = useToast();
  const [, setUserAuthToken] = useAtom(userAuthTokenWriteAtom);
  const [, setIsOpen] = useAtom(walletConnectModalAtom);

  const handleAuthorizationError = (error?: string) => {
    disconnect();

    // Show toast with the error message
    if (error) errorToast(error);
  };

  const [getNonce] = useLazyQuery(GET_NONCE_QUERY, {
    context: { apiName: 'apein' },
    fetchPolicy: 'network-only',
    onError: () => handleAuthorizationError(),
  });

  const [getAuthToken] = useMutation(GET_AUTH_TOKEN, {
    context: { apiName: 'apein' },
    onError: () => handleAuthorizationError(),
  });

  const getSignature = async (message: string) => {
    if (!signMessage) {
      handleAuthorizationError(AuthErrorMessages.AUTHORIZATION_FAILED);
      return;
    }
    const messageBytes = new TextEncoder().encode(message);
    const signature = await signMessage(messageBytes);
    return encode(signature);
  };

  const authenticateUser = async () => {
    if (!publicKey) return handleAuthorizationError(AuthErrorMessages.AUTHORIZATION_FAILED);

    setAuthStatus({ authenticationStatus: UserAuthenticationStatus.SIGNING_USER });
    try {
      const { data } = await getNonce({
        variables: {
          publicKey: publicKey.toString(),
        },
      });
      const authNonce = data?.walletAuthNonce;
      if (!authNonce) return handleAuthorizationError(AuthErrorMessages.AUTHORIZATION_FAILED);

      // sign message
      const nonceIssuedTime = dayjs().toISOString();
      const message = generateSignInMessage(publicKey.toString(), authNonce, nonceIssuedTime);
      const signature = await getSignature(message);
      if (!signature) return handleAuthorizationError(AuthErrorMessages.AUTHORIZATION_FAILED);

      // fetch jwt token
      const authTokenData = await getAuthToken({
        variables: {
          nonce: authNonce,
          publicKey: publicKey.toString(),
          signature,
          timestamp: nonceIssuedTime,
        },
      });
      if (!authTokenData.data?.walletAuth.token)
        return handleAuthorizationError(AuthErrorMessages.AUTHORIZATION_FAILED);

      setUserAuthToken(authTokenData.data?.walletAuth.token);
      setAuthStatus({
        authenticationStatus: UserAuthenticationStatus.USER_AUTHENTICATED,
        publickKey: publicKey.toString(),
      });
      return setIsOpen(false);
    } catch (err) {
      if (err instanceof Error) handleAuthorizationError(err.message);
      else handleAuthorizationError(AuthErrorMessages.GENERAL_ERROR);
    }
  };

  return {
    authenticateUser,
    handleAuthorizationError,
  };
};
