import React from 'react';

import { Box, Grid, GridItem, Skeleton } from '@chakra-ui/react';

type PoolCardSkeletonProps = {};

export const PoolCardSkeleton: React.FC<PoolCardSkeletonProps> = () => (
  <Box bg="surface.base.600" borderRadius="32px" mt="60px" width="100%">
    <Box
      bg="surface.base.200"
      borderColor="surface.base.600"
      borderRadius="32px"
      borderWidth={2}
      position="relative"
      pt="50px"
      px="22px"
    >
      <Box
        bg="surface.base.500"
        borderRadius="50% !important"
        height="72px"
        left="18px"
        opacity="1 !important"
        position="absolute"
        top="-20px"
        width="72px"
      />

      <Box position="absolute" right="22px" top="22px">
        <Skeleton
          border="solid 1px"
          borderColor="surface.base.500"
          borderRadius={20}
          display="flex"
          pl="30px"
          pr="15px"
          py={1}
          role="status"
        />
      </Box>
      <Box>
        <Box pb={4} pt={4}>
          <Box py={1}>
            <Skeleton height="10px" width="100%" />
          </Box>
        </Box>
        <Box py={1}>
          <Skeleton height="50px" mb={2} mt={2} />
        </Box>
        <Box pb={5} pt={3}>
          <Skeleton height="30px" width="60%" />
        </Box>
      </Box>
    </Box>
    <Box pb={2} pt={5}>
      <Grid gap={2} px="22px" templateColumns="repeat(2, 1fr)" width="100%">
        <GridItem>
          <Box py={1}>
            <Skeleton height="20px" />
          </Box>

          <Box>
            <Skeleton height="10px" />
          </Box>
        </GridItem>
        <GridItem>
          <Box textAlign="right">
            <Box py={1}>
              <Skeleton height="20px" />
            </Box>
            <Box>
              <Skeleton height="10px" />
            </Box>
          </Box>
        </GridItem>
      </Grid>
      <Box px={5} py={4}>
        <Skeleton borderRadius="25px !important" height="50px" width="100%" />
      </Box>
    </Box>
  </Box>
);

export default PoolCardSkeleton;
