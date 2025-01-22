import { Box, Container, Flex, Text } from '@chakra-ui/react';
import { createFileRoute } from '@tanstack/react-router';

import PopularTokens from '@components/PopularTokens';
import { TRENDING_TOKENS } from '@constants/index';
import useResponsiveValue from '@hooks/useResponsiveValue';

export const Route = createFileRoute('/')({
  component: function Render() {
    const isMobile = useResponsiveValue({ base: true, md: false });
    return (
      <Container marginInline="10" maxW="95vw">
        {/* <VStack align="stretch" bg="#1a1b23" p={6} spacing={6} w="full"> */}
        <Text textStyle="h1">AI Token by Market Cap</Text>
        <Text textStyle="body-sm">The AI Token market cap today is $3.78 Trillion in Solana</Text>
        <Flex gap="1rem">
          <Box bg="WindowFrame" borderRadius="md" padding="2">
            <Text textStyle="h5">$3,755,754,662,008</Text>
            <Flex alignItems="center">
              <Text>Market Cap</Text>
              <Text>1.8%</Text>
            </Flex>
          </Box>
          <Box bg="WindowFrame" borderRadius="md" padding="2">
            <Text textStyle="h5">$415,853,021,780</Text>
            <Text>24h Trading Volume</Text>
          </Box>
          <Box bg="WindowFrame" borderRadius="md" maxW="750px" padding="2">
            <Flex justifyContent="space-between">
              <Text textStyle="h5">Trending</Text>
              <Text>view more &gt;</Text>
            </Flex>
            <Flex alignItems="center" gap="1" overflowY="auto">
              {TRENDING_TOKENS.map((token) => (
                <Box bg="brand.accent.900" borderRadius="md" key={token.id} padding="2">
                  <Flex gap="2" wrap="nowrap">
                    <Flex>
                      <Text>ICO</Text>
                      <Text>{token.name}</Text>
                    </Flex>
                    <Flex>
                      <Text>{token.price}</Text>
                      <Text>{token.difference === 'negative' ? 'negICO' : 'posICO'}</Text>
                      <Text>{token.percentage}</Text>
                    </Flex>
                  </Flex>
                </Box>
              ))}
            </Flex>
          </Box>
        </Flex>
        <Box bg="WindowFrame" mt="2.5">
          <PopularTokens />
        </Box>
      </Container>
    );
  },
});
