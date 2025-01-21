import React, { lazy, Suspense } from 'react';

import { useBreakpointValue } from '@chakra-ui/react';
import { ScopeProvider } from 'jotai-scope';

import PendingComponent from '@components/PendingComponent';

import { swapInput, tabsAtom, tradeType } from '../state/atom';

const SwapDesktopView = lazy(() => import('./Desktop'));
const SwapMobileView = lazy(() => import('./Mobile'));
const Tab = lazy(() => import('./Tablet'));

export const Swap: React.FC = () => {
  const Component = useBreakpointValue(
    {
      base: SwapMobileView,
      lg: SwapDesktopView,
      sm: Tab,
    },
    { ssr: false }
  );

  return (
    <ScopeProvider atoms={[swapInput, tabsAtom, tradeType]}>
      <Suspense fallback={<PendingComponent />}>
        {Component ?
          <Component />
        : null}
      </Suspense>
    </ScopeProvider>
  );
};
