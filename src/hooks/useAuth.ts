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
import { useCreateJwt, useGetWalletAuth } from '@routes/~fast-launch/hooks/useGetAgentInfo';

export const PRIVATE_MESSAGE = `Sign in with BlockBeast.\n\nNo password is required.\n
  Click "Sign" or "Approve" only means you have confirmed you own this wallet.\n
  This request will not initiate any blockchain transaction or cost any gas fee. nonce:`;


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

  const [getNonce] = useLazyQuery(GET_NONCE_QUERY, {
    context: { apiName: 'apein' },
    fetchPolicy: 'network-only',
    onError: () => handleAuthorizationError(),
  });

  // const [getAuthToken] = useMutation(GET_AUTH_TOKEN, {
  //   context: { apiName: 'apein' },
  //   onError: () => handleAuthorizationError(),
  // });

  // const getSignature = async (message: string) => {
  //   if (!signMessage) {
  //     handleAuthorizationError(AuthErrorMessages.AUTHORIZATION_FAILED);
  //     return;
  //   }
  //   const messageBytes = new TextEncoder().encode(message);
  //   const signature = await signMessage(messageBytes);
  //   return encode(signature);
  // };

  const authenticateUser = async () => {
    if (!publicKey) return handleAuthorizationError(AuthErrorMessages.AUTHORIZATION_FAILED);

    getWalletAuthToken(undefined, {
      onSuccess: async (data) => {
        const message = new TextEncoder().encode(
          `${PRIVATE_MESSAGE} ${data.data.auth_nonce}`
        );
        setAuthStatus({ authenticationStatus: UserAuthenticationStatus.SIGNING_USER });
        try {
          const signedMessage = await signMessage?.(message);
          if(signedMessage === undefined) return;
          createJwt({
            message: PRIVATE_MESSAGE,
            public_key: publicKey.toString(),
            signature: Array.from(signedMessage),
          });
          
          setAuthStatus({
            authenticationStatus: UserAuthenticationStatus.USER_AUTHENTICATED,
            publickKey: publicKey.toString(),
          });
        } catch (e) {
          console.error(e);
          await disconnect();
        }
      },
    });

    // try {
    //   const { data } = await getNonce({
    //     variables: {
    //       publicKey: publicKey.toString(),
    //     },
    //   });
    //   const authNonce = data?.walletAuthNonce;
    //   if (!authNonce) return handleAuthorizationError(AuthErrorMessages.AUTHORIZATION_FAILED);

    //   // sign message
    //   const nonceIssuedTime = dayjs().toISOString();
    //   const message = generateSignInMessage(publicKey.toString(), authNonce, nonceIssuedTime);
    //   const signature = await getSignature(message);
    //   if (!signature) return handleAuthorizationError(AuthErrorMessages.AUTHORIZATION_FAILED);

    //   // fetch jwt token
    //   const authTokenData = await getAuthToken({
    //     variables: {
    //       nonce: authNonce,
    //       publicKey: publicKey.toString(),
    //       signature,
    //       timestamp: nonceIssuedTime,
    //     },
    //   });
    //   if (!authTokenData.data?.walletAuth.token)
    //     return handleAuthorizationError(AuthErrorMessages.AUTHORIZATION_FAILED);

      // setUserAuthToken(authTokenData.data?.walletAuth.token);
      // setAuthStatus({
      //   authenticationStatus: UserAuthenticationStatus.USER_AUTHENTICATED,
      //   publickKey: publicKey.toString(),
      // });
    //   return setIsOpen(false);
    // } catch (err) {
    //   if (err instanceof Error) handleAuthorizationError(err.message);
    //   else handleAuthorizationError(AuthErrorMessages.GENERAL_ERROR);
    // }
  };

  return {
    authenticateUser,
    handleAuthorizationError,
  };
};
