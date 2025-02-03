import { Box, Container, Flex, Heading, Highlight, Text } from '@chakra-ui/react';
import { createFileRoute } from '@tanstack/react-router';

import PopularTokens from '@components/PopularTokens';

export const Route = createFileRoute('/')({
  component: function Render() {
    return (
      <Box bg="base.900" py={2}>
        <Container maxW="container.xl">
          <Flex direction="column">
            <Heading letterSpacing="tight" size="2xl">
              <Highlight query="Launchpad" styles={{ color: 'teal.600' }}>
                AI Token Launchpad
              </Highlight>
            </Heading>
            <Text color="fg.muted" fontSize="md">
              The safest and fastest way to launch and trade AI tokens on Solana
            </Text>

            <Flex gap="1rem" mt={8} />
            <PopularTokens />
          </Flex>
        </Container>
      </Box>
    );
  },
});
