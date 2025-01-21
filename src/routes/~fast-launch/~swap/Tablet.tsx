import React from 'react';

import { Box, Container } from '@chakra-ui/react';

import { DexType } from '@app-types/index';

import { useGetPoolById } from '@hooks/apein/useGetPool';

import { BondingCurve } from '../components/BondingCurve';
import { Header } from '../components/Header';
import ReferralSection from '../components/Referral';
import { SwapSection } from '../components/Swap';
import { TokenDetails } from '../components/TokenDetails';
import { TokenLockStatus } from '../components/TokenLockStatus';
import { TradeGraph } from '../components/TradeGraph';
import { useFastLaunchSearchParams } from '../hooks/useFastLaunchSearchParams';
import { DetailsPanelDesktop } from './desktop/DetailsPanel';

const Tab: React.FC = () => {
  const { data: poolData, isLoading: isPoolDataLoading } = useGetPoolById(
    useFastLaunchSearchParams().pool
  );
  return (
    <Container maxW="80%">
      <Box>
        <Header />
      </Box>
      <Box py={3}>
        <SwapSection />
      </Box>
      {!isPoolDataLoading &&
        poolData?.selectedDex === DexType.METEORA &&
        !poolData?.curveThresholdReached && (
          <Box>
            <ReferralSection />
          </Box>
        )}
      {!isPoolDataLoading && poolData?.hasTokenLockBeenApplied && (
        <Box py={3}>
          <TokenLockStatus />
        </Box>
      )}
      <Box py={3}>
        <TradeGraph />
      </Box>
      <Box py={3}>
        <DetailsPanelDesktop />
      </Box>
      <Box py={3}>
        <BondingCurve />
      </Box>
      <Box py={3}>
        <TokenDetails />
      </Box>
    </Container>
  );
};

export default Tab;
