import { AuthErrorMessages } from '@constants/index';

import useUserAuthentication from './useUserAuthentication';

type CallbackWithAuth<T> = () => Promise<null | T>;

const useCheckTokenExpiryAndExecute = () => {
  const { isRefreshTokenLoading, isTokenExpired, refreshAuthToken } = useUserAuthentication();

  const withAuthToken = async <T>(callback: CallbackWithAuth<T>) => {
    if (isTokenExpired()) {
      try {
        await refreshAuthToken();
      } catch (err) {
        return null;
      }
    }

    // Execute the passed function
    try {
      return await callback();
    } catch (callbackError) {
      console.error(`${AuthErrorMessages.Error} ${callbackError}`);
      return null;
    }
  };

  return { isRefreshTokenLoading, withAuthToken };
};

export default useCheckTokenExpiryAndExecute;
