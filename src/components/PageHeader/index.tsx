import type { ReactNode } from 'react';

import { Box, Flex, Grid, GridItem } from '@chakra-ui/react';
// import { Link } from '@tanstack/react-router';

// import { ActionButton } from '@components/ui/Button';

type PageHeaderProps = {
  includePoolNav?: boolean;
  title: ReactNode;
};

// const ChakraLink = chakra(Link);

export const PageHeader = ({ includePoolNav, title }: PageHeaderProps) => (
  <Box mb={{ base: 0, md: 6 }} width="100%">
    <Grid
      templateColumns={{ base: '1fr', md: '2fr 1fr' }}
      templateRows={{ base: `${includePoolNav ? '1fr 1fr' : '1fr'}`, md: '1fr' }}
    >
      <GridItem alignContent="flex-start" textAlign="left" textStyle="h2">
        {title}
      </GridItem>
      {includePoolNav && (
        <GridItem>
          <Flex gap={2} justifyContent={{ base: 'space-between', md: 'flex-end' }}>
            {/* <ChakraLink
              // search={{ draft: 'new' }}
              // to="/launches/lbp"
              // to="/lbp/create"
              w={{ base: '100%', md: '140px' }}
            >
              <ActionButton action="LBP Launch" px={4} variant="solid" isDisabled />
            </ChakraLink> */}
            {/* <ChakraLink to="/fast-launch/create" w={{ base: '100%', md: '140px' }}>
              <ActionButton action="Ape In" px={4} variant="accent" w="100%" />
            </ChakraLink> */}
          </Flex>
        </GridItem>
      )}
    </Grid>
  </Box>
);
