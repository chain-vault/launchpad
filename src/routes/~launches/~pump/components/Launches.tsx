import { Box, Card, Flex, Grid, GridItem, Skeleton, Text } from '@chakra-ui/react';

import { PoolWithTokenData } from '@app-types/apiIn';

import FastLaunch from '@components/FastLaunchCard/FastLaunch';
import { skeletonItems } from '@constants/index';

const Launches = ({
  isLoading,
  isTokensLoading,
  pools,
}: {
  isLoading: boolean;
  isTokensLoading: boolean;
  pools: PoolWithTokenData[];
}) => (
  <Box>
    {isLoading ?
      <Grid
        templateColumns={{
          base: 'repeat(1, 4fr)',
          lg: 'repeat(2, 1fr)',
          sm: 'repeat(2, 4fr)',
        }}
        columnGap={4}
        mt={6}
        rowGap={4}
      >
        {skeletonItems(6).map((key) => (
          <GridItem key={key}>
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
                  <Skeleton h="30px" mt={2} w={['100%', '350px']} />
                  <Skeleton h="30px" mt={2} w="50px" />
                </Box>
              </Flex>
              <Skeleton h="30px" mt={2} w="100%" />
            </Card>
          </GridItem>
        ))}
      </Grid>
    : pools && pools.length ?
      <Grid
        templateColumns={{
          base: 'repeat(1, 4fr)',
          lg: 'repeat(2, 1fr)',
          sm: 'repeat(2, 4fr)',
        }}
        columnGap={4}
        mt={6}
        rowGap={4}
      >
        {pools.map((pool) => (
          <GridItem key={pool.poolId.toString()} mt="10px">
            <FastLaunch isTokensLoading={isTokensLoading} pool={pool} />
          </GridItem>
        ))}
      </Grid>
    : <Flex alignItems="center" height="100px" justify="center" mt="35px" w="100%">
        <Text fontSize="20px" textAlign="center">
          No data available
        </Text>
      </Flex>
    }
  </Box>
);

export default Launches;
