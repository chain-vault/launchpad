import { useCallback, useEffect } from 'react';

import { queryClient } from '@adapters/tanstack';
import { tradeReferalCode } from '@atoms/index';
import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router';
import { useAtom } from 'jotai';

import PendingComponent from '@components/PendingComponent';
import { isLegacyPool } from '@constants/pools';
import { getPoolAccountQueryOptions } from '@hooks/apein/useGetPool';
import { getPoolSettingsQueryOptions } from '@hooks/apein/usePoolSettings';
import { useApeinEventsHandler } from '@hooks/apein/useTradeListener';
import useReferal from '@hooks/useReferal';
import { useWeb3React } from '@hooks/useWeb3React';

import { useFastLaunchSearchParams } from '../hooks/useFastLaunchSearchParams';
import { Swap } from './Swap';

type SwapSearchParams = {
  referal?: string;
};
export const Route = createFileRoute('/fast-launch/swap/$poolAddress')({
  component: function Render() {
    useApeinEventsHandler();
    const navigate = useNavigate();

    const [tradeReferalCodeValue, updateTradeReferalCode] = useAtom(tradeReferalCode);
    const { pool, referal } = useFastLaunchSearchParams();
    const { isConnected, publicKey } = useWeb3React();

    const { onValidateReferralCode } = useReferal();

    // validate referal code.
    // if referalcode is valid => add to the store
    // if referalcode already exist or user already used a referral code and coming with new => set that first one as the referral code (FCFS)
    // if invalid referral code and no previous referral, do nothing
    const validateTradeReferalCode = useCallback(async () => {
      if (publicKey && isConnected) {
        const tradeReferral = tradeReferalCodeValue?.[publicKey.toString()]?.[pool];
        if (!tradeReferral && referal) {
          const isValid = await onValidateReferralCode();
          if (!isValid) return;
          updateTradeReferalCode((prev) => ({
            ...prev,
            [publicKey.toString()]: {
              [pool]: referal,
            },
          }));

          return;
        }
        if (tradeReferral && tradeReferral !== referal) {
          navigate({
            from: '/fast-launch/swap/$poolAddress',
            search: () => ({
              referal: tradeReferral,
            }),
          });
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected, pool, publicKey, referal]);

    useEffect(() => {
      validateTradeReferalCode();
    }, [validateTradeReferalCode]);

    return <Swap />;
  },
  loader: async ({ params: { poolAddress } }) => {
    if (isLegacyPool(poolAddress)) return;
    const poolQuery = getPoolAccountQueryOptions(poolAddress);
    try {
      await Promise.all([
        queryClient.ensureQueryData(poolQuery),
        queryClient.ensureQueryData(getPoolSettingsQueryOptions()),
      ]);
    } catch {
      notFound({
        throw: true,
      });
    }
  },
  pendingComponent: () => <PendingComponent />,
  validateSearch: (search: Record<string, unknown>): SwapSearchParams => ({
    referal: search.referal as string,
  }),
});
