import { useMutation } from '@apollo/client';
import { userAuthTokenAtom, userAuthTokenWriteAtom } from '@atoms/index';
import { GET_REFRESH_TOKEN } from '@integrations/graphql/queries/auth';
import { useAtom, useAtomValue } from 'jotai';

import { AuthErrorMessages } from '@constants/index';

import useToast from './useToast';
import useWalletConnection from './useWalletConnection';

const useUserAuthentication = () => {
  const authToken = useAtomValue(userAuthTokenAtom);
  const [, setUserAuthToken] = useAtom(userAuthTokenWriteAtom);
  const { disconnect } = useWalletConnection();
  const { errorToast } = useToast();

  const [getRefreshToken, { loading }] = useMutation(GET_REFRESH_TOKEN, {
    context: { apiName: 'apein' },
    onError: () => {
      disconnect();
    },
  });

  const refreshAuthToken = async (shouldShowToast: boolean = true) => {
    const { data, errors } = await getRefreshToken({});

    if (!data?.refreshToken.token || errors) {
      disconnect();
      if (shouldShowToast) {
        errorToast(AuthErrorMessages.AUTHORIZATION_FAILED);
      }

      throw new Error(AuthErrorMessages.AUTHORIZATION_FAILED);
    }
    setUserAuthToken(data.refreshToken.token);
  };

  const isTokenExpired = () => {
    if (authToken && authToken.split('.').length === 3) {
      const tokenPayload = JSON.parse(atob(authToken.split('.')[1]));
      return tokenPayload.exp * 1000 < Date.now();
    }
    return true;
  };

  return {
    isRefreshTokenLoading: loading,
    isTokenExpired,
    refreshAuthToken,
  };
};

export default useUserAuthentication;
