import { useMemo } from 'react';

import { Box, Center, Container, Flex, Grid, GridItem, Skeleton } from '@chakra-ui/react';

import { PoolWithTokenData } from '@app-types/apiIn';
import { PoolListSortOptions } from '@app-types/index';

import ApeXCard from '@components/FastLaunchCard/ApeXCard';
import FastLaunch from '@components/FastLaunchCard/FastLaunch';
import { LinkButton } from '@components/LinkButton';
import { skeletonItems } from '@constants/index';
import usePoolData from '@hooks/apein/useFastLaunchListWithToken';
import useGetApeX from '@hooks/apein/useGetApeX';
import { useApeinEventsHandler } from '@hooks/apein/useTradeListener';

import { PoolCategories } from './PoolCategories';

const ApeX: React.FC = () => {
  useApeinEventsHandler();

  const { apeXdata, isLoading: isApeXPoolsLoading } = useGetApeX();

  const { data, isLoading, isTokensLoading } = usePoolData();
  const sort = (a: PoolWithTokenData, b: PoolWithTokenData) =>
    (b.curveThresholdTime ?? 0) - (a.curveThresholdTime ?? 0);
  const recentLaunches = useMemo(() => {
    if (!data) return [];
    return [...data].filter((pool) => !pool.curveThresholdReached).sort(sort);
  }, [data]);

  const completedPools = useMemo(
    () => (data && data.length ? data.filter((pool) => pool.curveThresholdReached).sort(sort) : []),
    [data]
  );

  return (
    <Container maxW={1080} py={[10, '70px']} textAlign="center">
      <Center flexDirection="column" gap={8} p={0}>
        {/* <Text mb={8} textStyle="h2">
          Ape X
        </Text> */}
        <Grid
          templateColumns={{
            base: 'repeat(1, 1fr)',
            lg: 'repeat(3, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
          columnGap={3}
          display={['none', 'grid', 'grid']}
          rowGap={3}
          w="100%"
        >
          {isApeXPoolsLoading ?
            skeletonItems(4).map((key) => (
              <GridItem key={key} w="100%">
                <Skeleton borderRadius="32px !important" h="200px" w="100%" />
              </GridItem>
            ))
          : apeXdata.slice(0, 5).map((pool, index) => (
              <GridItem colSpan={index === 0 ? 2 : 1} key={pool.poolId.toString()}>
                {index === 0 ?
                  <ApeXCard isTokensLoading={isTokensLoading} pool={apeXdata[0]} />
                : <FastLaunch isTokensLoading={isTokensLoading} pool={pool} />}
              </GridItem>
            ))
          }
        </Grid>
        {isApeXPoolsLoading ?
          <Flex direction="column" gap={3} w="100%">
            <Skeleton borderRadius="32px !important" h="200px" w="100%" />
          </Flex>
        : <Box display={['flex', 'none', 'none']} flexDirection="column" gap={6} w="100%">
            {apeXdata[0] && <ApeXCard isTokensLoading={isTokensLoading} pool={apeXdata[0]} />}
            {apeXdata[1] && <FastLaunch isTokensLoading={isTokensLoading} pool={apeXdata[1]} />}
            {apeXdata[2] && <FastLaunch isTokensLoading={isTokensLoading} pool={apeXdata[2]} />}
          </Box>
        }

        {apeXdata && apeXdata.length > 0 && (
          <LinkButton
            align="left"
            label="View all launches"
            link="/launches/pump"
            variant="accent"
          />
        )}
      </Center>
      {recentLaunches.length > 0 && (
        <PoolCategories
          isLoading={isLoading}
          isTokensLoading={isTokensLoading}
          pools={recentLaunches}
          title="Recently Launched"
        />
      )}

      {completedPools.length > 0 && (
        <PoolCategories
          isLoading={isLoading}
          isTokensLoading={isTokensLoading}
          pools={completedPools}
          sort={PoolListSortOptions.MARKET_CAP}
          title="Completed Launches"
        />
      )}
    </Container>
  );
};

export default ApeX;
