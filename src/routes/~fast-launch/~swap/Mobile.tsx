import { Box } from '@chakra-ui/react';

import { DexType } from '@app-types/index';

import { useGetPoolById } from '@hooks/apein/useGetPool';

import { Layout } from '../components/Layout.mobile';
import ReferralSection from '../components/Referral';
import { SwapSection } from '../components/Swap';
import { TokenLockStatus } from '../components/TokenLockStatus';
import { useFastLaunchSearchParams } from '../hooks/useFastLaunchSearchParams';
import { TABS } from '../types';
import { Holders } from './mobile/Holders';
import { InfoPanel } from './mobile/InfoPanel';
import { Trade } from './mobile/Trade';
import { Transactions } from './mobile/Transactions';

const SwapMobileView: React.FC = () => {
  const { data: poolData, isLoading: isPoolDataLoading } = useGetPoolById(
    useFastLaunchSearchParams().pool
  );

  const tokenId = poolData?.token.toString();

  return (
    <Layout>
      {(tabName) => (
        <>
          {tabName === TABS.Info && <InfoPanel />}
          {tabName === TABS.Chart && <Trade />}
          {tabName === TABS.Holders && (
            <Holders loading={isPoolDataLoading} token={tokenId || ''} />
          )}
          {tabName === TABS.Txs && <Transactions />}
          {tabName === TABS.Trade && (
            <Box>
              <Box mb={2}>
                <SwapSection />
              </Box>
              {!isPoolDataLoading &&
                poolData &&
                poolData.selectedDex === DexType.METEORA &&
                !poolData.curveThresholdReached && (
                  <Box mb={3}>
                    <ReferralSection />
                  </Box>
                )}
              {!isPoolDataLoading && poolData?.hasTokenLockBeenApplied && (
                <Box>
                  <TokenLockStatus />
                </Box>
              )}
            </Box>
          )}
        </>
      )}
    </Layout>
  );
};

export default SwapMobileView;
