import { useState } from 'react';

import {
  Box,
  Card,
  Flex,
  Grid,
  GridItem,
  Icon,
  Link,
  Progress,
  Skeleton,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { useLocation, useNavigate, useSearch } from '@tanstack/react-router';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { RxExternalLink } from 'react-icons/rx';

import { PoolWithTokenData } from '@app-types/apiIn';
import { FilterOption, RadioButtonOption, SortOptions } from '@app-types/index';

import { Table, Td, Th, Tr } from '@components/DataTable';
import FastLaunch from '@components/FastLaunchCard/FastLaunch';
import { TokenCard } from '@components/TokenCard';
import Toolbar from '@components/Toolbar/ToolbarV2';
import { getTokenLockLink } from '@constants/config';
import { ProfileView } from '@constants/index';
import { useApeinEventsHandler } from '@hooks/apein/useTradeListener';
import useResponsiveValue from '@hooks/useResponsiveValue';
import { useWeb3React } from '@hooks/useWeb3React';
import { getTimeDifference } from '@utils/duration';
import { formatNumber, formatPercent, NumberFormatType } from '@utils/formatNumbers';

import useFastLaunchPortfolio from '../hooks/useApeInPortfolio';
import useUserProfileData, { DropDownFilterOptions } from '../hooks/useGetApeInUserData';

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

const PortfolioCard = ({
  pool,
  userId,
}: {
  pool: {
    tokenBalance: string;
  } & PoolWithTokenData;
  userId?: string;
}) => {
  const navigate = useNavigate({ from: '/launches/pump' });
  const isSmallDevice = useResponsiveValue({ base: true, lg: false, md: false });

  return (
    <>
      <Tr
        onClick={() => {
          navigate({
            params: {
              poolAddress: pool.poolId.toString(),
            },
            to: '/fast-launch/swap/$poolAddress',
          });
        }}
        border="none"
        pb={2}
        px={0}
        py={2}
      >
        <Flex justifyContent="space-between" w="100%">
          <Td flex={0.5}>
            <TokenCard
              token={{
                logoUrl: pool?.logoUrl ?? '',
                name: pool.tokenName,
                symbol: pool?.symbol ?? '',
              }}
              isFastLaunch
            />
          </Td>
          <Flex flex={1} justifyContent="space-between" w="100%">
            <Td flex={[0.5, 1]} my="auto" textStyle="body-sm">
              <Box>
                <Flex justifyContent="space-between" mb={1} textStyle="body-sm" w="90%">
                  <Text color="brand.accent.600">{formatPercent(pool.bondingCurveProgress)}</Text>
                  <Text display={['none', 'flex']}>{getTimeDifference(pool.createdAt)}</Text>
                </Flex>
                <Progress
                  sx={{
                    '& > div': {
                      backgroundColor: 'brand.accent.600',
                    },
                  }}
                  bg="surface.base.950"
                  borderRadius="full"
                  display={['none', 'flex']}
                  height="6px"
                  value={pool.bondingCurveProgress}
                  w="90%"
                />
              </Box>
            </Td>
            <Td my="auto" px={[2, 0]} textStyle="body-sm">
              <Flex gap={[0, 1]}>
                <Text textStyle="body-sm" w="fit-content">
                  {formatNumber({
                    input: pool.tokenBalance,
                    suffix: pool.symbol,
                    type: NumberFormatType.TokenBalanceFormatter,
                  })}
                </Text>

                {pool.isTokenLockActive && (
                  <Tooltip label="Developer Tokens Locked">
                    <Text>🔒</Text>
                  </Tooltip>
                )}
                {pool.hasTokenLockBeenApplied && pool.poolCreator.toString() === userId ?
                  <Tooltip label="Token lock contract">
                    <Link
                      href={getTokenLockLink(pool?.token?.toString() ?? '')}
                      onClick={(event) => event.stopPropagation()}
                      target="_blank"
                    >
                      <RxExternalLink fontSize={isSmallDevice ? '12px' : '14px'} />
                    </Link>
                  </Tooltip>
                : null}
              </Flex>
            </Td>
            <Td flex={0.2} my="auto">
              <Box _hover={{ cursor: 'pointer', opacity: 0.8 }}>
                <Icon as={FaExternalLinkAlt} color="surface.base.800" opacity={0.5} />
              </Box>
            </Td>
          </Flex>
        </Flex>
      </Tr>
      {/* {isSmallDevice && (
        <>
          <Box mx="auto" w="95%">
            <Flex justifyContent="space-between" mb={1} textStyle="body-md">
              <Text color="brand.accent.600">{formatPercent(pool.bondingCurveProgress)}</Text>
              <Text>{getTimeDifference(pool.createdAt)}</Text>
            </Flex>
            <Progress
              sx={{
                '& > div': {
                  backgroundColor: 'brand.accent.600',
                },
              }}
              bg="surface.base.950"
              borderRadius="full"
              height="6px"
              value={parseFloat(pool.bondingCurveProgress)}
            />
          </Box>
          <Box
            borderBottom={{ base: 'dashed 2px', md: 'none' }}
            borderColor={{ base: 'surface.base.950', md: 'none' }}
            mt={6}
            mx="auto"
            w="95%"
          />
        </>
      )} */}
    </>
  );
};

const ApeInPanel: React.FC = () => {
  const { publicKey } = useWeb3React();
  const location = useLocation();
  const isExternalUser = location.search.user !== publicKey?.toBase58();
  const { user } = useSearch({ from: '/profile/' });

  const RadioFilterOptionsByViewer =
    isExternalUser ? RadioFilterOptions.slice(0, 1) : RadioFilterOptions;

  const [selectedView, setSelectedView] = useState(ProfileView.LAUNCHES);

  const { filters, isPoolDataLoading, onChangeFilter, poolData } = useUserProfileData();

  const {
    filters: portfolioFilters,
    isLoading: isPortfolioLoading,
    onChangeFilter: onChangePortfolioFilters,
    portfolioData,
  } = useFastLaunchPortfolio();
  useApeinEventsHandler(user || publicKey?.toString());

  const onUpdateFilter = (filter: Record<string, string>) => {
    if ('view' in filter) {
      setSelectedView(filter.view as ProfileView);
      onChangeFilter({}, true);
      onChangePortfolioFilters({}, true);
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
          type="apeIn"
        />
      : <Toolbar
          dropDownFilterKey="sort"
          dropDownFilterOptions={DropDownFilterOptions}
          onApplyFilter={onUpdateFilter}
          radioButtonInitialValue={RadioFilterOptionsByViewer[0]}
          radioFilterKey="view"
          radioFilterOptions={RadioFilterOptionsByViewer}
          searchQuery={filters.searchQuery}
          selectedDropDownFilter={filters.sort}
          type="apeIn"
        />
      }

      {selectedView === ProfileView.LAUNCHES ?
        isPoolDataLoading ?
          <Grid
            templateColumns={{
              base: 'repeat(1, 4fr)',
              lg: 'repeat(2, 1fr)',
              sm: 'repeat(2, 4fr)',
            }}
            gap={6}
            mt={6}
          >
            {[1, 2, 3, 4].map((idx) => (
              <GridItem key={idx}>
                <Card
                  bg="surface.base.200"
                  borderColor="base.300"
                  borderRadius="32px !important"
                  borderWidth={1}
                  boxShadow="none"
                  h="100%"
                  px={4}
                  py={3}
                  w="100%"
                >
                  <Flex gap={4} w="100%">
                    <Skeleton borderRadius="24px !important" height="92px" w="100px" />
                    <Box w="100%">
                      <Skeleton h="20px" w="150px" />
                      <Skeleton h="30px" mt={2} w={['', '', '', '350px']} />
                      <Skeleton h="30px" mt={2} w="50px" />
                    </Box>
                  </Flex>
                  <Skeleton h="30px" mt={2} w="100%" />
                </Card>
              </GridItem>
            ))}
          </Grid>
        : poolData && poolData.length ?
          <Grid
            templateColumns={{
              base: 'repeat(1, 4fr)',
              lg: 'repeat(2, 1fr)',
              sm: 'repeat(2, 4fr)',
            }}
            gap={6}
            mt={6}
          >
            {poolData?.map((pool) => (
              <GridItem key={pool.poolId.toString()}>
                <FastLaunch isTokensLoading={isPoolDataLoading} pool={pool} />
              </GridItem>
            ))}
          </Grid>
        : <Box mt="35px" textAlign="center" w="100%">
            <Text fontSize="20px">No data available</Text>
          </Box>

      : <Box mt={6}>
          <Table
            renderRow={(pool) => (
              <PortfolioCard
                key={pool?.poolId.toString()}
                pool={pool}
                userId={user || publicKey?.toString()}
              />
            )}
            columns={4}
            data={portfolioData}
            isLoading={isPortfolioLoading}
          >
            <Th>
              <Flex justifyContent="space-between" w="100%">
                <Td flex={0.5}>Project Name</Td>
                <Flex flex={1} justifyContent="space-between" w="100%">
                  <Td flex={[0.5, 1]}>Bonding Curve</Td>
                  <Td px={[2, 0]}>Balance</Td>
                  <Td flex={0.2}>Trade</Td>
                </Flex>
              </Flex>
            </Th>
          </Table>
        </Box>
      }
    </Box>
  );
};

export default ApeInPanel;
