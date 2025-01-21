import { queryClient } from '@adapters/tanstack';
import { createFileRoute, notFound } from '@tanstack/react-router';
import { ScopeProvider } from 'jotai-scope';

import PendingComponent from '@components/PendingComponent';
import TermsAndConditions from '@components/TermsAndConditions';
import { LocalStorageKeys } from '@constants/index';
import { getLBPPoolAccountQueryOptions } from '@hooks/lbp/useGetPool';

import { eventsAtom, price } from './atom';
import Trade from './components';

export const Route = createFileRoute('/lbp/swap/$poolAddress')({
  component: () => (
    <ScopeProvider atoms={[eventsAtom, price]}>
      <Trade />
      <TermsAndConditions alertId={LocalStorageKeys.TRADE_T_AND_C} />
    </ScopeProvider>
  ),
  loader: async ({ params: { poolAddress } }) => {
    const poolQuery = getLBPPoolAccountQueryOptions(poolAddress);
    try {
      await Promise.all([queryClient.ensureQueryData(poolQuery)]);
    } catch {
      notFound({
        throw: true,
      });
    }
  },
  pendingComponent: () => <PendingComponent />,
});
