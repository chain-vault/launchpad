import React from 'react';

import { Box, Button, Center, Container, Flex, Grid, Skeleton, Text } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';
import { FiArrowUpRight } from 'react-icons/fi';

import { PoolWithTokenData } from '@app-types/apiIn';
import { PoolListSortOptions } from '@app-types/index';

import FastLaunch from '@components/FastLaunchCard/FastLaunch';

type PoolCategoriesProps = {
  isLoading: boolean;
  isTokensLoading: boolean;
  pools: PoolWithTokenData[];
  rows?: number;
  sort?: PoolListSortOptions;
  title: string;
};
const COLS = 3;
export const PoolCategories: React.FC<PoolCategoriesProps> = ({
  isLoading,
  isTokensLoading,
  pools,
  rows = 2,
  sort,
  title,
}) => {
  const totalCells = rows * COLS;
  const sliceAt = Math.min(pools.length, totalCells - (totalCells % COLS));
  return (
    <Center mt={14}>
      <Container maxWidth={1080} p={0} textAlign="left">
        <Flex direction="column">
          <Flex>
            <Flex alignItems="center" flex="auto">
              <Text textStyle="h2">{title}</Text>
            </Flex>
            <Flex alignItems="center" flex="auto" justifyContent="flex-end" maxWidth="100px">
              <Box>
                <Button
                  as={Link}
                  display="inline-flex"
                  textStyle="body-regular-semibold"
                  to={`/launches/pump${sort ? `?sort=${sort}` : ''}`}
                  variant="unstyled"
                >
                  View All <FiArrowUpRight style={{ marginLeft: 8 }} />
                </Button>
              </Box>
            </Flex>
          </Flex>

          <Grid
            templateColumns={{
              base: 'repeat(1, 1fr)', // 1 column on mobile (base)
              md: 'repeat(3, 1fr)', // 3 columns on tablet (md) and larger
            }}
            columnGap={3}
            mt={8}
            rowGap={3}
            w="100%"
          >
            {isLoading ?
              [1, 2, 3].map((key) => (
                <Skeleton borderRadius="32px !important" h="200px" key={key} w="100%" />
              ))
            : pools
                .slice(0, sliceAt)
                .map((pool) => (
                  <FastLaunch
                    isTokensLoading={isTokensLoading}
                    key={pool.poolId.toString()}
                    pool={pool}
                  />
                ))
            }
          </Grid>
        </Flex>
      </Container>
    </Center>
  );
};
