import { useLazyQuery, useMutation } from '@apollo/client';
import { tradeReferalCode, userReferalCode } from '@atoms/index';
import {
  CREATE_TRADE_WITH_REFERAL,
  GET_REFERAL_CODE,
  VALIDATE_REFERRAL,
} from '@integrations/graphql/queries/referal';
import { useAtom } from 'jotai';

import { AuthErrorMessages } from '@constants/index';
import { useFastLaunchSearchParams } from '@routes/~fast-launch/hooks/useFastLaunchSearchParams';

import useCheckTokenExpiryAndExecute from './useCheckTokenExpiryAndExecute';
import useToast from './useToast';
import { useWeb3React } from './useWeb3React';

const useReferal = () => {
  const { isConnected, publicKey } = useWeb3React();
  const [referalCode, updateReferalCode] = useAtom(userReferalCode);
  const [, updateTradeReferalCodes] = useAtom(tradeReferalCode);
  const { pool, referal } = useFastLaunchSearchParams();
  const { errorToast } = useToast();
  const { isRefreshTokenLoading, withAuthToken } = useCheckTokenExpiryAndExecute();

  const [getReferalCode, { loading: generateReferalCodeLoading }] = useMutation(GET_REFERAL_CODE, {
    context: { apiName: 'apein' },
    onError: () => {
      errorToast(AuthErrorMessages.REFERRAL_CODE_ERROR);
    },
  });

  const [createTradeWithReferal] = useMutation(CREATE_TRADE_WITH_REFERAL, {
    context: { apiName: 'apein' },
    onError: (error) => {
      const errorMsg = error?.networkError;
      if (errorMsg && 'statusCode' in errorMsg && errorMsg.statusCode !== 403) {
        const publicKeyString = publicKey?.toString();
        if (publicKeyString) {
          updateTradeReferalCodes((prev) => {
            const updatedReferralCode = { ...prev };
            if (updatedReferralCode[publicKeyString]?.[pool]) {
              delete updatedReferralCode[publicKeyString][pool];

              // Optionally remove the entire publicKey if it has no remaining pools
              if (Object.keys(updatedReferralCode[publicKeyString]).length === 0) {
                delete updatedReferralCode[publicKeyString];
              }
            }
            return updatedReferralCode;
          });
        }
        errorToast(AuthErrorMessages.INVALID_REFERRAL_CODE);
      }
    },
  });

  const [validateReferralCode] = useLazyQuery(VALIDATE_REFERRAL, {
    context: { apiName: 'apein' },
    fetchPolicy: 'network-only',
    onError: () => {
      errorToast(AuthErrorMessages.INVALID_REFERRAL_CODE);
    },
  });

  const onGetReferalCode = async (regenerateRefferal: boolean = false) => {
    if (!publicKey) return;

    // if not regenerating, check existing referral code
    if (!regenerateRefferal && referalCode[publicKey.toString()]) return;
    // handle refresh token
    await withAuthToken(async () => {
      const data = await getReferalCode({
        variables: {
          publicKey: publicKey.toString(),
        },
      });

      if (data.data?.generateReferralCode.referralCode)
        updateReferalCode({ [publicKey.toString()]: data.data.generateReferralCode.referralCode });
    });
  };

  const onCreateTradeWithReferal = async (
    signature: string,
    poolId: string,
    tradeReferalCodeIn: string
  ) => {
    if (!publicKey) return;
    // handle refresh token
    await withAuthToken(async () => {
      await createTradeWithReferal({
        variables: {
          poolId,
          publicKey: publicKey.toString(),
          referredUserCode: tradeReferalCodeIn,
          signature,
        },
      });
    });
  };

  const onValidateReferralCode = async () => {
    if (!publicKey) return false;
    const result = await withAuthToken(async () => {
      const { data } = await validateReferralCode({
        variables: {
          referralCode: referal ?? '',
        },
      });
      if (data?.validateReferral) {
        return true;
      }
      return false;
    });
    return !!result;
  };

  return {
    generateReferalCodeLoading: generateReferalCodeLoading || isRefreshTokenLoading,
    onCreateTradeWithReferal,
    onGetReferalCode,
    onValidateReferralCode,
    referalCode: publicKey && isConnected ? referalCode[publicKey.toString()] : undefined,
  };
};

export default useReferal;
