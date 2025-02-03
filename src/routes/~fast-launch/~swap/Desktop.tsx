import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  SimpleGrid,
  SkeletonText,
  Text,
} from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';

import AgentAnalytics from '@components/Analytics';
import { useGetPoolById } from '@hooks/apein/useGetPool';
import { shrinkText } from '@utils/shrinkText';

import { BondingCurve } from '../components/BondingCurve';
import { DeveloperInfo } from '../components/DeveloperInfo';
import { Header } from '../components/Header';
import { HeaderMetrics } from '../components/HeaderMetrics';
import { Socials } from '../components/Socials';
import { SwapSection } from '../components/Swap';
import { TokenDetails } from '../components/TokenDetails';
import { TokenLockStatus } from '../components/TokenLockStatus';
import { TradeGraph } from '../components/TradeGraph';
import { useFastLaunchSearchParams } from '../hooks/useFastLaunchSearchParams';
import { useGetAgent } from '../hooks/useGetAgentInfo';
import { DetailsPanelDesktop } from './desktop/DetailsPanel';

const SwapDesktopView: React.FC = () => {
  const { data: poolData, isLoading: isPoolDataLoading } = useGetPoolById(
    useFastLaunchSearchParams().pool
  );
  const { data: agent, isLoading: isAgentLoading } = useGetAgent(
    useFastLaunchSearchParams().agentId
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
                to="/"
              >
                All Pools
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <SkeletonText isLoaded={!isAgentLoading} noOfLines={1}>
                <BreadcrumbLink cursor="initial !important" opacity={0.5} textDecoration="none">
                  {agent?.name}
                </BreadcrumbLink>
              </SkeletonText>
            </BreadcrumbItem>
          </Breadcrumb>
          <Grid columnGap={6} mt={0} rowGap={6} templateColumns={{ base: '1fr', lg: '1.8fr 1fr' }}>
            <GridItem bgColor="base.500" borderRadius={8} padding={4} rowStart={{ base: 1, lg: 1 }}>
              <Box mb={3}>
                <Header />
              </Box>
              <Box width="100%">
                <TradeGraph />
              </Box>
              <Flex direction="column" my={4}>
                <Box>
                  <Heading size="md">Agent Metrics</Heading>
                </Box>
                <Box my={1}>
                  <AgentAnalytics />

                  {/* <Text opacity={0.5} textStyle="body-sm">
                    Last Updated : 1Min Ago
                  </Text> */}
                </Box>
                <Box pt={3}>
                  <Flex alignSelf="flex-start" py={3}>
                    <Socials />
                  </Flex>
                  <Flex
                    alignContent="center"
                    borderColor="#2C3655 !important"
                    borderTop="1px"
                    direction="row"
                    justifyContent="space-between"
                    py={3}
                  >
                    <Flex direction="column" ml={-3}>
                      <Text opacity={0.5} px={3} textStyle="body-sm">
                        Created by
                      </Text>
                      <HeaderMetrics
                        value={shrinkText({
                          maxLength: 6,
                          string: poolData?.poolCreator?.toString() ?? '-',
                        })}
                        label=""
                      />
                    </Flex>
                    <Button
                      onClick={() => {
                        window.open(`https://dev.blockbeast.ai/chat/${agent?.id}`, '_blank');
                      }}
                      _hover={{ bg: 'green.200' }}
                      bg="green.100"
                      color="gray.800"
                      px={6}
                      size="md"
                    >
                      Reach Agent
                    </Button>
                  </Flex>
                </Box>
              </Flex>
              <Box my={1}>
                <DetailsPanelDesktop />
              </Box>
            </GridItem>
            <GridItem>
              <Box mb={3}>
                <SwapSection />
              </Box>
              {/* {!isPoolDataLoading &&
                poolData &&
                poolData.selectedDex === DexType.METEORA &&
                !poolData.curveThresholdReached && (
                  <Box mb={3}>
                    <ReferralSection />
                  </Box>
                )} */}
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
