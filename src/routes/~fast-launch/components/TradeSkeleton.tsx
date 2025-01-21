import React from 'react';

import {
  Box,
  Container,
  Grid,
  GridItem,
  SimpleGrid,
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react';

export const TradePageSkeleton: React.FC = () => (
  <Container maxW="container.xl">
    <SimpleGrid gap={6} width="100%">
      <Grid columnGap={6} mt={0} rowGap={6} templateColumns={{ base: '1fr', lg: '1.8fr 1fr' }}>
        <GridItem rowStart={{ base: 1, lg: 1 }}>
          <Box mb={3}>
            <SkeletonText isLoaded={false} minH={10} noOfLines={2} />
          </Box>
          <Box>
            <Skeleton minH={400} />
          </Box>
        </GridItem>
        <GridItem>
          <Skeleton minH={400} mt={{ base: 1, md: '50px' }} />
        </GridItem>
      </Grid>
    </SimpleGrid>
  </Container>
);
