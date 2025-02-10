import { Box, Container, Flex, Highlight, Text } from '@chakra-ui/react';
import { createFileRoute } from '@tanstack/react-router';

import PopularTokens from '@components/PopularTokens';

export const Route = createFileRoute('/')({
  component: function Render() {
    return (
      <Box bg="base.900" maxW="100vw" mt={4} py={2}>
        <Container maxW="container.xl">
          <Flex direction="column">
            <Text textStyle="h2">
              <Highlight query="Launchpad" styles={{ color: 'teal.600' }}>
                AI Token Launchpad
              </Highlight>
            </Text>
            <Text color="fg.muted" textStyle="body-md">
              The safest and fastest way to launch and trade AI tokens on Solana
            </Text>

            <Flex gap="1rem" mt={4} />
            <PopularTokens />
          </Flex>
        </Container>
      </Box>
    );
  },
});
