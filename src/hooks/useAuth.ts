import apiConfig from '@adapters/api/apiConfig';
import { updateAuthStatusAtom, userAuthTokenWriteAtom, walletConnectModalAtom } from '@atoms/index';
import { useMutation } from '@tanstack/react-query';
import { useAtom } from 'jotai';

import { AuthErrorMessages, UserAuthenticationStatus } from '@constants/index';
import useToast from '@hooks/useToast';
import useWalletConnection from '@hooks/useWalletConnection';
import { useWeb3React } from '@hooks/useWeb3React';

export const PRIVATE_MESSAGE = `Sign in with BlockBeast.\n\nNo password is required.\n
  Click "Sign" or "Approve" only means you have confirmed you own this wallet.\n
  This request will not initiate any blockchain transaction or cost any gas fee. nonce:`;

type CreateJwtProps = {
  nonce: string;
  public_key: string;
  signature: number[];
};
type CreateJwtResponse = {
  accessToken: string;
};

type AuthNonceResponse = {
  authNonce: string;
};

export const useCreateJwt = () =>
  useMutation({
    mutationFn: (payload: CreateJwtProps) =>
      apiConfig<CreateJwtResponse>({
        data: payload,
        method: 'POST',
        url: 'login',
        withCredentials: true,
      }),
  });

export const useGetWalletAuth = () =>
  useMutation({
    mutationFn: () =>
      apiConfig<AuthNonceResponse>({
        method: 'GET',
        url: 'wallet-auth',
        withCredentials: true,
      }),
  });

export const useAuth = () => {
  const { publicKey, signMessage } = useWeb3React();
  const { disconnect } = useWalletConnection();
  const [, setAuthStatus] = useAtom(updateAuthStatusAtom);
  const { errorToast } = useToast();
  const [, setUserAuthToken] = useAtom(userAuthTokenWriteAtom);
  const [, setIsOpen] = useAtom(walletConnectModalAtom);
  const { mutate: getWalletAuthToken } = useGetWalletAuth();
  const { mutate: createJwt } = useCreateJwt();

  const handleAuthorizationError = (error?: string) => {
    disconnect();

    // Show toast with the error message
    if (error) errorToast(error);
  };

  const getSignature = async (message: string) => {
    if (!signMessage) {
      handleAuthorizationError(AuthErrorMessages.AUTHORIZATION_FAILED);
      return;
    }
    const messageBytes = new TextEncoder().encode(message);
    const signature = await signMessage(messageBytes);
    return signature;
  };

  const authenticateUser = async () => {
    if (!publicKey) return handleAuthorizationError(AuthErrorMessages.AUTHORIZATION_FAILED);
    setAuthStatus({ authenticationStatus: UserAuthenticationStatus.SIGNING_USER });

    getWalletAuthToken(undefined, {
      onError: () => handleAuthorizationError(AuthErrorMessages.AUTHORIZATION_FAILED),
      onSuccess: async (data) => {
        try {
          const signature = await getSignature(`${PRIVATE_MESSAGE} ${data.data.authNonce}`);
          if (!signature) return handleAuthorizationError(AuthErrorMessages.AUTHORIZATION_FAILED);

          createJwt(
            {
              nonce: data.data.authNonce,
              public_key: publicKey.toString(),
              signature: Array.from(signature),
            },
            {
              onError: () => handleAuthorizationError(AuthErrorMessages.AUTHORIZATION_FAILED),
              onSuccess: (response) => {
                if (!response.data.accessToken)
                  return handleAuthorizationError(AuthErrorMessages.AUTHORIZATION_FAILED);
                setAuthStatus({
                  authenticationStatus: UserAuthenticationStatus.USER_AUTHENTICATED,
                  publickKey: publicKey.toString(),
                });
                setUserAuthToken(response.data.accessToken);
                return setIsOpen(false);
              },
            }
          );
        } catch (err) {
          if (err instanceof Error) handleAuthorizationError(err.message);
          else handleAuthorizationError(AuthErrorMessages.GENERAL_ERROR);
        }
      },
    });
  };

  return {
    authenticateUser,
    handleAuthorizationError,
  };
};
