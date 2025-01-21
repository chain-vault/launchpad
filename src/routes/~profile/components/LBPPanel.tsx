import { useEffect, useState } from 'react';

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Link, useSearch } from '@tanstack/react-router';

import {
  FilterOption,
  LBPPoolStatus,
  PoolStatusUpdatedEvent,
  RadioButtonOption,
  SortOptions,
} from '@app-types/index';
import { LBPPoolWithTokenData } from '@app-types/lbp';

import { Table, Td, Th, Tr } from '@components/DataTable';
import { Countdown } from '@components/PoolCard/Countdown';
import StatusIndicator from '@components/Status/StatusIndicator';
import TokenAvatar from '@components/TokenAvatar';
import { TokenCard } from '@components/TokenCard';
import Toolbar from '@components/Toolbar/ToolbarV2';
import { DEFAULT_TOKEN_DECIMAL } from '@constants/config';
import { ProfileView } from '@constants/index';
import useLBPSettings from '@hooks/lbp/useLBPSettings';
import { useCountDown } from '@hooks/useCountdown';
import useResponsiveValue from '@hooks/useResponsiveValue';
import { useWeb3React } from '@hooks/useWeb3React';
import { useTransaction } from '@routes/~lbp/~swap/hooks';
import { EventManager } from '@utils/eventBus';
import { formatNumber, formatPercent, NumberFormatType } from '@utils/formatNumbers';
import { Token } from '@utils/token';

import useClaim from '../hooks/useClaim';
import useLBPLaunches from '../hooks/useLBPLaunches';
import useLBPPortfolio from '../hooks/useLBPPortfolio';

const LaunchesDropDownFilterOptions: RadioButtonOption[] = [
  {
    id: 'All',
    displayValue: 'All',
    value: 'All',
  },

  {
    id: LBPPoolStatus.COMING_SOON,
    displayValue: LBPPoolStatus.COMING_SOON,
    value: LBPPoolStatus.COMING_SOON,
  },
  {
    id: LBPPoolStatus.LIVE_NOW,
    displayValue: LBPPoolStatus.LIVE_NOW,
    value: LBPPoolStatus.LIVE_NOW,
  },
  {
    id: LBPPoolStatus.COMPLETED,
    displayValue: LBPPoolStatus.COMPLETED,
    value: LBPPoolStatus.COMPLETED,
  },
];

const PortfolioDropDownFilterOptions: RadioButtonOption[] = [
  {
    id: SortOptions.asc,
    displayValue: 'Lowest Balance',
    value: SortOptions.asc,
  },

  {
    id: SortOptions.dsc,
    displayValue: 'Highest Balance',
    value: SortOptions.dsc,
  },
];

const RadioFilterOptions: FilterOption[] = [
  {
    id: ProfileView.LAUNCHES,
    label: ProfileView.LAUNCHES,
    value: ProfileView.LAUNCHES,
  },
  {
    id: ProfileView.PORTFOLIO,
    label: ProfileView.PORTFOLIO,
    value: ProfileView.PORTFOLIO,
  },
];

const Metrics = ({
  featureUpcoming,
  isLoading,
  label,
  value,
}: {
  featureUpcoming?: boolean;
  isLoading?: boolean;
  label: string;
  value: string;
}) => (
  <SkeletonText isLoaded={!isLoading} noOfLines={2} skeletonHeight="16px" textAlign="start">
    <VStack alignItems="flex-start" gap={1}>
      <Text
        opacity={featureUpcoming ? 0.4 : 1}
        textStyle={featureUpcoming ? 'body-xs' : { base: 'body-sm-bold', md: 'subtitle' }}
      >
        {featureUpcoming ? 'Coming soon' : value}
      </Text>
      <Text opacity={0.5} textStyle="body-sm">
        {label}
      </Text>
    </VStack>
  </SkeletonText>
);

const Timer = ({
  endAt,
  poolId,
  position,
  startAt,
}: {
  endAt: number;
  poolId: string;
  position: 'absolute' | 'relative';
  startAt: number;
}) => {
  const poolStatus = useCountDown(startAt, endAt, poolId);
  return (
    <Countdown
      countdown={poolStatus?.countdown || '0D 0H 0M 0S'}
      position={position}
      status={poolStatus?.status ?? LBPPoolStatus.COMING_SOON}
    />
  );
};

const DetailsPanel = ({
  isExternalUser,
  isLBPPaused,
  pool,
}: {
  isExternalUser?: boolean;
  isLBPPaused?: boolean;
  pool: LBPPoolWithTokenData;
}) => {
  const isMobile = useResponsiveValue({ base: true, md: false });
  const [currentPoolStatus, setCurrentPoolStatus] = useState<LBPPoolStatus>();
  const poolId = pool.poolAddress.toString();

  const {
    claimFundButtonStatus,

    isClaimFundPending,

    onClaimFund,
  } = useClaim(pool, currentPoolStatus);

  useEffect(() => {
    const poolStatusEvent = EventManager.getInstance('poolEvents');

    const handlePoolStatusUpdated = (event: CustomEvent<PoolStatusUpdatedEvent>) => {
      setCurrentPoolStatus(event.detail.status);
    };

    poolStatusEvent.addCustomEventListener(poolId, handlePoolStatusUpdated);

    return () => {
      poolStatusEvent.removeCustomEventListener(poolId, handlePoolStatusUpdated);
    };
  }, [poolId]);

  const poolStartWeights = `${pool.symbol}: ${formatPercent(pool.projectTokenStartWeight)} SOL ${formatPercent(pool.collateralStartWeight)}`;

  const poolStartAmounts = `${formatNumber({ input: Token.fromRawAmount(pool.startProjectAmount, DEFAULT_TOKEN_DECIMAL), suffix: `${pool.symbol}`, type: NumberFormatType.TableDataFormatter })} + ${formatNumber({ input: Token.fromRawAmount(pool.startCollaterolAmount), suffix: 'SOL', type: NumberFormatType.TableDataFormatter })}`;

  return (
    <Link params={{ poolAddress: pool.poolAddress.toString() }} to="/lbp/swap/$poolAddress">
      <Flex flexDirection="column" gap={6}>
        <Flex justifyContent="space-between" w="100%">
          {/* mobile */}
          {isMobile ?
            <>
              <Timer
                endAt={pool.endAt}
                poolId={pool.poolAddress.toString()}
                position="absolute"
                startAt={pool.startAt}
              />
              <Box bg="surface.base.200" borderRadius="32px" position="relative" w="100%">
                <Box height="72px" left="6px" position="absolute" top="-50px" width="72px">
                  <TokenAvatar boxSize="16" src={pool?.logoUrl} />
                </Box>
                <Flex flexDirection="row" justifyContent="space-between" w="100%">
                  <VStack alignItems="flex-start" gap={0} mt={6}>
                    <Text _hover={{ opacity: 1, textColor: 'brand.secondary.600' }} textStyle="h3">
                      {pool.name}
                    </Text>
                    <Text opacity={0.5} textStyle="body-sm">
                      {pool.symbol}
                    </Text>
                  </VStack>
                  {currentPoolStatus && <StatusIndicator size="lg" status={currentPoolStatus} />}
                </Flex>
              </Box>
            </>
          : <>
              <HStack gap={3}>
                <TokenAvatar boxSize="12" src={pool?.logoUrl} />
                <Flex direction="column" gap={1}>
                  <Text _hover={{ opacity: 1, textColor: 'brand.secondary.600' }} textStyle="h3">
                    {pool.name}
                  </Text>
                  <Text opacity={0.5} textAlign="start">
                    {pool.symbol}
                  </Text>
                </Flex>
              </HStack>
              <Flex alignItems="center" gap={2} justifyContent="space-between">
                <Timer
                  endAt={pool.endAt}
                  poolId={pool.poolAddress.toString()}
                  position="relative"
                  startAt={pool.startAt}
                />
                {currentPoolStatus && <StatusIndicator size="md" status={currentPoolStatus} />}
              </Flex>
            </>
          }
        </Flex>
        <Divider bg="surface.base.100" opacity={1} variant="dashed" />
        <Grid
          gap={6}
          justifyContent="flex-start"
          templateColumns={{ base: 'repeat(2, 1fr)', md: `repeat(${isExternalUser ? 4 : 5}, 1fr)` }}
        >
          <GridItem>
            <Metrics
              value={formatNumber({
                input: pool.participantsCount,
                placeholder: '0',
                type: NumberFormatType.TableDataFormatter,
              })}
              label="Aped"
            />
          </GridItem>
          <GridItem>
            <Metrics
              value={formatNumber({
                input: pool.totalSupply,
                type: NumberFormatType.TableDataFormatter,
              })}
              label="Total Supply"
            />
          </GridItem>
          <GridItem>
            <Metrics
              value={formatNumber({
                input: Token.fromRawAmount(pool.fundRaised),
                suffix: 'SOL',
                type: NumberFormatType.TableDataFormatter,
              })}
              label="Fund Raised"
            />
          </GridItem>
          <GridItem>
            <Metrics
              value={formatNumber({
                input:
                  claimFundButtonStatus.isClaimed ? 0 : (
                    Token.fromRawAmount(pool.projectTokenBalance, DEFAULT_TOKEN_DECIMAL)
                  ),
                type: NumberFormatType.TableDataFormatter,
              })}
              label={`Remaining ${pool.symbol} in LBP`}
            />
          </GridItem>
          {!isExternalUser && (
            <GridItem colSpan={{ base: 2, md: 1 }}>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onClaimFund();
                }}
                alignSelf="flex-end"
                isDisabled={(isLBPPaused || claimFundButtonStatus?.disabled) ?? true}
                isLoading={isClaimFundPending}
                m="auto"
                variant="solid"
                w={{ base: '100%', md: '70%' }}
              >
                {isLBPPaused ? 'LBP is Paused' : (claimFundButtonStatus?.label ?? '')}
              </Button>
            </GridItem>
          )}
        </Grid>
      </Flex>

      <AccordionPanel mt={12} pl={0}>
        <Flex gap={6}>
          <Metrics label="Start Weight" value={poolStartWeights} />
          <Metrics label="Start Pool Amount" value={poolStartAmounts} />
        </Flex>
      </AccordionPanel>
    </Link>
  );
};

const LaunchesPanel = ({
  isExternalUser,
  isLBPPaused,
  poolData,
}: {
  isExternalUser: boolean;
  isLBPPaused?: boolean;
  poolData: LBPPoolWithTokenData[];
}) =>
  poolData.map((pool) => (
    <Accordion key={pool.poolAddress.toString()} mt={{ base: 16, md: 8 }} allowToggle>
      <AccordionItem border="none">
        <Card>
          <CardBody>
            <Flex flexDirection="column">
              <DetailsPanel isExternalUser={isExternalUser} isLBPPaused={isLBPPaused} pool={pool} />
              <AccordionButton
                _hover={{
                  bg: 'surface.base.200',
                }}
                bg="surface.base.200"
                border="2px solid"
                borderColor="surface.base.500"
                borderRadius="full"
                bottom="-18px"
                color="brand.secondary.600"
                justifyContent="center"
                left="50%"
                p={1.5}
                position="absolute"
                transform="translateX(-50%)"
                width="auto"
                zIndex={1}
              >
                <AccordionIcon />
              </AccordionButton>
            </Flex>
          </CardBody>
        </Card>
      </AccordionItem>
    </Accordion>
  ));

const PortfolioCard = ({
  portfolio,
}: {
  portfolio: {
    tokenBalance: string;
  } & LBPPoolWithTokenData;
}) => (
  // const { isMetaDatLoading, poolTokenMetadata } = useTokenMetadata(portfolio.poolToken);
  <Link
    // disabled={!!(portfolio?.pools?.length && portfolio?.pools?.length > 0)}
    params={{ poolAddress: portfolio.poolAddress.toString() }}
    to="/lbp/swap/$poolAddress"
  >
    <Tr justifyContent="space-between" pb={2} px={0} py={2}>
      <Td>
        <TokenCard token={portfolio.token.toString()} />
      </Td>
      <Td textStyle="body-md">
        {formatNumber({
          input: portfolio.tokenBalance,
          suffix: portfolio.symbol,
          type: NumberFormatType.TokenBalanceFormatter,
        })}
      </Td>
    </Tr>
  </Link>
);

const LBPPanel = () => {
  const { data: lbpSettings } = useLBPSettings();
  const { user } = useSearch({
    from: '/profile/',
  });
  const { publicKey } = useWeb3React();
  const isExternalUser = user !== publicKey?.toString();

  useTransaction(undefined, user ?? publicKey?.toString());

  const RadioFilterOptionsByViewer =
    isExternalUser ? RadioFilterOptions.slice(0, 1) : RadioFilterOptions;

  const [selectedView, setSelectedView] = useState(ProfileView.LAUNCHES);

  const { filters, isPoolDataLoading, onChangeFilter, poolData } = useLBPLaunches();

  const {
    filters: portfolioFilters,
    isLoading: portfolioDataLoading,
    onChangeFilter: onChangePortfolioFilters,
    portfolioData,
  } = useLBPPortfolio();

  const onUpdateFilter = (filter: Record<string, string>) => {
    if ('view' in filter) {
      setSelectedView(filter.view as ProfileView);
      onChangePortfolioFilters({}, true);
      onChangeFilter({}, true);
    } else if (selectedView === ProfileView.LAUNCHES) onChangeFilter(filter);
    else onChangePortfolioFilters(filter);
  };

  return (
    <Box>
      {selectedView === ProfileView.PORTFOLIO ?
        <Toolbar
          dropDownFilterKey="sort"
          dropDownFilterOptions={PortfolioDropDownFilterOptions}
          onApplyFilter={onUpdateFilter}
          radioButtonInitialValue={RadioFilterOptionsByViewer[0]}
          radioFilterKey="view"
          radioFilterOptions={RadioFilterOptionsByViewer}
          searchQuery={portfolioFilters.searchQuery}
          selectedDropDownFilter={portfolioFilters.sort}
          type="lbp"
        />
      : <Toolbar
          dropDownFilterKey="status"
          dropDownFilterOptions={LaunchesDropDownFilterOptions}
          onApplyFilter={onUpdateFilter}
          radioButtonInitialValue={RadioFilterOptionsByViewer[0]}
          radioFilterKey="view"
          radioFilterOptions={RadioFilterOptionsByViewer}
          searchQuery={filters.searchQuery}
          selectedDropDownFilter={filters.status}
          type="lbp"
        />
      }

      {selectedView === ProfileView.LAUNCHES ?
        isPoolDataLoading ?
          <Stack gap={6}>
            <Skeleton height="50px" />
            <Skeleton height="50px" />
            <Skeleton height="50px" />
          </Stack>
        : !poolData?.length && !isPoolDataLoading ?
          <Box alignItems="center" display="flex" justifyContent="center" minHeight="100px">
            <Text as="span" fontSize="20px">
              No data available
            </Text>
          </Box>
        : <LaunchesPanel
            isExternalUser={isExternalUser}
            isLBPPaused={lbpSettings?.isPaused}
            poolData={poolData}
          />

      : portfolioDataLoading ?
        <Stack gap={6}>
          <Skeleton height="50px" />
          <Skeleton height="50px" />
          <Skeleton height="50px" />
        </Stack>
      : !portfolioData?.length && !portfolioDataLoading ?
        <Box alignItems="center" display="flex" justifyContent="center" minHeight="100px">
          <Text as="span" fontSize="20px">
            No data available
          </Text>
        </Box>
      : <Flex flexDirection="column" gap={2}>
          <Table
            renderRow={(tokenData) => (
              <PortfolioCard key={tokenData.poolAddress.toString()} portfolio={tokenData} />
            )}
            columns={5}
            data={portfolioData}
            isLoading={portfolioDataLoading}
          >
            <Th display="flex" justifyContent="space-between">
              <Td>Project Name</Td>
              <Td>Token Balance</Td>
            </Th>
          </Table>
        </Flex>
      }
    </Box>
  );
};

export default LBPPanel;
