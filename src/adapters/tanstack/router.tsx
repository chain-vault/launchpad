import { Box, Center, Container, Flex, Image, Text } from '@chakra-ui/react';
import { routeTree } from '@src/routeTree.gen';
import { createRouter } from '@tanstack/react-router';

import PendingComponent from '@components/PendingComponent';

import { MonkeyInRocket } from '@assets/imges';

// Create a new router instance
export const router = createRouter({
  defaultNotFoundComponent: () => (
    /**
     * TODO: Add design for not found component
     */
    <Container py="70px" textAlign="center" variant="container.1080">
      <Flex alignItems="center" justifyContent="center" mb={16} mt={8} position="relative">
        <Box
          _dark={{ bg: 'brand.secondary.600' }}
          bg="brand.accent.600"
          border="solid"
          filter="blur(115px)"
          h="86px"
          mt={8}
          w="86px"
        />
        <Image
          left="50%"
          position="absolute"
          src={MonkeyInRocket}
          top="50%"
          transform="translate(-50%, -50%)"
        />
      </Flex>
      <Center>
        <Text fontSize="18px" fontWeight="500" textAlign="center">
          This page might be empty, but your next big trade is just around the corner!
        </Text>
      </Center>
    </Container>
  ),
  defaultPendingComponent: () => <PendingComponent />,
  defaultPendingMinMs: 0,
  defaultPendingMs: 0,
  defaultPreload: 'intent',
  routeTree,
});
