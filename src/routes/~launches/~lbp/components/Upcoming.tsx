import React from 'react';

import { Box, Grid, GridItem, Skeleton, Text } from '@chakra-ui/react';

import { LBPPoolStatus, SortOptions, ThemeVariants } from '@app-types/index';

import { Pool } from '@components/PoolCard/Pool';
import { Toolbar } from '@components/Toolbar';
import { usePoolData } from '@hooks/lbp/useGetPoolsWithToken';
import { filterOptions } from '@utils/filterOptions';

export const UpcomingAndLivePools: React.FC = () => {
  const { applyFilter, data, isLoading } = usePoolData({ sortBy: SortOptions.asc }, [
    LBPPoolStatus.COMPLETED,
  ]);

  return (
    <Box width="100%">
      {/* <EmptyPools /> */}

      <Box>
        <Toolbar
          onSearch={(query: string) => {
            applyFilter({ searchQuery: query });
          }}
          applyAction={applyFilter}
          filterOptions={filterOptions}
          searchBoxPlaceholder="Search tokens, pools or pairs..."
          variant={ThemeVariants.LBP}
        />
        <Box>
          {!isLoading && (
            <Grid
              templateColumns={{
                base: 'repeat(1, 4fr)',
                lg: 'repeat(3, 4fr)',
                sm: 'repeat(2, 4fr)',
              }}
              gap={2}
            >
              {data &&
                data.length > 0 &&
                data.map((pool) => (
                  <GridItem key={pool.poolAddress.toString()}>
                    <Pool {...pool} />
                  </GridItem>
                ))}
            </Grid>
          )}
        </Box>
      </Box>

      {!isLoading && (!data || !data.length) && (
        <Box alignItems="center" display="flex" justifyContent="center" minHeight="100px">
          <Text as="span" fontSize="20px">
            No data available
          </Text>
        </Box>
      )}
      {isLoading && <Skeleton height={300} />}
    </Box>
  );
};
