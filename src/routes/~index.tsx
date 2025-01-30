import {
  Box,
  Container,
  Flex,
  Heading,
  Highlight,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Text,
} from '@chakra-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import { IoMdSearch } from 'react-icons/io';
import { LuChevronRight } from 'react-icons/lu';

import PopularTokens from '@components/PopularTokens';
import { TRENDING_TOKENS } from '@constants/index';
import useResponsiveValue from '@hooks/useResponsiveValue';

export const Route = createFileRoute('/')({
  component: function Render() {
    const isMobile = useResponsiveValue({ base: true, md: false });
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

            <Flex gap="1rem" mt={8}>
              {/* <Box bg="#1E263A" borderRadius="md" paddingX="4" paddingY="4">
                <Heading letterSpacing="tight" mb="2" size="md">
                  $3,755,754,662,008
                </Heading>
                <Flex alignItems="baseline" justifyContent="space-between">
                  <Text color="fg.muted" fontSize="md">
                    Market Cap
                  </Text>
                  <Text color="green.400">1.8%</Text>
                </Flex>
              </Box>
              <Box bg="#1E263A" borderRadius="md" paddingX="4" paddingY="4">
                <Heading letterSpacing="tight" mb="2" size="md">
                  $415,853,021,780
                </Heading>
                <Flex alignItems="baseline" justifyContent="space-between">
                  <Text color="fg.muted" fontSize="md">
                    24h Trading Volume
                  </Text>
                  <Text color="red.400">1.8%</Text>
                </Flex>
              </Box> */}
              {/* <Box bg="#1E263A" borderRadius="md" paddingX="4" paddingY="4" width="100%">
                <Flex justifyContent="space-between" mb="2">
                  <Text textStyle="h4">🔥Trending</Text>

                  <Link to="/trending">
                  <Flex alignItems="center" direction="row">
                    <Text>view more</Text>
                    <LuChevronRight />
                  </Flex>
                  </Link>
                </Flex>
                <Flex alignItems="center" gap="1" overflowY="auto" width="100%">
                  {TRENDING_TOKENS.map((token) => (
                    <Box bg="brand.accent.900" borderRadius="md" key={token.id} padding="2">
                      <Flex gap="2" wrap="nowrap">
                        <HStack spacing={2}>
                          <Flex minW="150">
                            <Image
                              alt="Token icon"
                              borderRadius="full"
                              boxSize="24px"
                              src="https://s3-alpha-sig.figma.com/img/d2da/29ed/db62a0bcddc7a8b6e80e049081ae833c?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=as74f6SFcoYblzly-yWLxk3EZSnUucTEFNtL034ZXJUqm0NHiRB2YSGcbsjxmaYhsOnQV5KpPuF5TP47FwJDoyNkbjFrXn45N22nbnRMNQvTZuOlhQMRngnev9Y54Aezx6eVEorLphlZ8KrwNicJ5vXIIiz4-1Au1fbfl-CVZWT5o~23rgLuYQhKy-uBeOvfN6u3FxRf1UlEvOWnUTtJ7UidNJ1EBcEeS9hA9xXBk~bAiICZ5E70xwGhqfCUWz2jQTWcGOqwSzbmyeimjnbVddFL2uClL5NCI3BKPqFRRaJag7KKFIkWSDfRyyCylYVlLCmmdC4zm5uLz4rsaH-bng__"
                            />
                            <Text fontWeight="medium">{token.name}</Text>
                            <Text color="gray.400" fontSize="sm">
                              {token.symbol}
                            </Text>
                          </Flex>

                          <Flex>
                            <Text>{token.price}</Text>
                            <Text>
                              <IoCaretDown />
                              {token.difference === 'negative' ? 'negICO' : 'posICO'}
                            </Text>
                            <Text>{token.percentage}</Text>
                          </Flex>
                        </HStack>
                      </Flex>
                    </Box>
                  ))}
                </Flex>
              </Box> */}
            </Flex>
            <PopularTokens />
          </Flex>
        </Container>
      </Box>
    );
  },
});
