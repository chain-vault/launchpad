import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  Grid,
  GridItem,
  SimpleGrid,
  SkeletonText,
} from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';

import { DexType } from '@app-types/index';

import { useGetPoolById } from '@hooks/apein/useGetPool';

import { BondingCurve } from '../components/BondingCurve';
import { DeveloperInfo } from '../components/DeveloperInfo';
import { Header } from '../components/Header';
import ReferralSection from '../components/Referral';
import { Socials } from '../components/Socials';
import { SwapSection } from '../components/Swap';
import { TokenDetails } from '../components/TokenDetails';
import { TokenLockStatus } from '../components/TokenLockStatus';
import { TradeGraph } from '../components/TradeGraph';
import { useFastLaunchSearchParams } from '../hooks/useFastLaunchSearchParams';
import { DetailsPanelDesktop } from './desktop/DetailsPanel';

const SwapDesktopView: React.FC = () => {
  const { data: poolData, isLoading: isPoolDataLoading } = useGetPoolById(
    useFastLaunchSearchParams().pool
  );

  return (
    <Box width="100%">
      <Container maxW="container.xl">
        <SimpleGrid gap={6} width="100%">
          <Breadcrumb textStyle="body-sm">
            <BreadcrumbItem>
              <BreadcrumbLink
                _hover={{ opacity: 1, textColor: 'brand.accent.600' }}
                as={Link}
                textDecoration="none"
                to="/launches/pump/"
              >
                All Pools
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <SkeletonText isLoaded={!isPoolDataLoading} noOfLines={1}>
                <BreadcrumbLink cursor="initial !important" opacity={0.5} textDecoration="none">
                  {poolData?.tokenName}
                </BreadcrumbLink>
              </SkeletonText>
            </BreadcrumbItem>
          </Breadcrumb>
          <Grid columnGap={6} mt={0} rowGap={6} templateColumns={{ base: '1fr', lg: '1.8fr 1fr' }}>
            <GridItem rowStart={{ base: 1, lg: 1 }}>
              <Box mb={3}>
                <Header />
              </Box>
              <Box width="100%">
                <TradeGraph />
              </Box>
              <Box my={1}>
                <DetailsPanelDesktop />
              </Box>
            </GridItem>
            <GridItem>
              <Box py={3}>
                <Socials />
              </Box>
              <Box mb={3}>
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
                <Box mb={3}>
                  <TokenLockStatus />
                </Box>
              )}
              <Box mb={3}>
                <BondingCurve />
              </Box>
              {!isPoolDataLoading && poolData?.isTokenLockActive && (
                <Box mb={3}>
                  <DeveloperInfo />
                </Box>
              )}
              <Box mb={3}>
                <TokenDetails />
              </Box>
            </GridItem>
          </Grid>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default SwapDesktopView;
