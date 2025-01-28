// import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { IoMdCopy, IoMdSearch } from 'react-icons/io';
import { LuArrowDownUp, LuExternalLink } from 'react-icons/lu';

import { useFilterAgents } from '@routes/~fast-launch/hooks/useGetAgentInfo';

const formatNumber = (num: number): string =>
  new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    style: 'currency',
  }).format(num);

const PopularTokens = () => {
  const { data: popularAgents, isLoading: isPopularAgentsLoading } = useFilterAgents();
  return (
    <>
      {/* Search Bar */}
      <Flex alignItems="center" justifyContent="center" mt={4}>
        <Box maxW="18.75rem" w="full">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              {/* <SearchIcon color="gray.400" /> */}
              <IoMdSearch />
            </InputLeftElement>
            <Input
              _focus={{
                border: '1px solid',
                borderColor: 'blue.400',
                boxShadow: 'none',
              }}
              _placeholder={{ color: 'gray.400' }}
              bg="#2C3655"
              border="none"
              color="white"
              placeholder="Search Token Name or CA"
            />
          </InputGroup>
        </Box>
      </Flex>
      <Box bg="base.800" mt="2.5">

        <Box bg="#1E263A" borderRadius="md" p={4}>
          <HStack mb={4} spacing={2}>
            <Box bg="#121E30" borderRadius="full" display="flex" padding="2">
              <Button
                _hover={{ bg: 'blue.500' }}
                bg="blue.400"
                borderRadius="full"
                color="white"
                size="sm"
              >
                Recently Launched
              </Button>
              <Button
                _hover={{ bg: 'whiteAlpha.100' }}
                bg="transparant"
                borderRadius="full"
                color="gray.400"
                size="sm"
                variant="ghost"
              >
                Market Cap
              </Button>
              <Button
                _hover={{ bg: 'whiteAlpha.100' }}
                bg="transparant"
                borderRadius="full"
                color="gray.400"
                size="sm"
                variant="ghost"
              >
                Bonded
              </Button>
            </Box>
          </HStack>

          <TableContainer w="full">
            <Table color="white" variant="unstyled" w="full">
              <Thead>
                <Tr>
                  <Th color="gray.400">AI Agent Token</Th>
                  <Th color="gray.400">
                    <HStack spacing={1}>
                      <Text>Price</Text>
                      <LuArrowDownUp />
                    </HStack>
                  </Th>
                  <Th color="gray.400">
                    <HStack spacing={1}>
                      <Text>24h</Text>
                      <LuArrowDownUp />
                    </HStack>
                  </Th>
                  <Th color="gray.400">
                    <HStack spacing={1}>
                      <Text>24h Volume</Text>
                      <LuArrowDownUp />
                    </HStack>
                  </Th>
                  <Th color="gray.400">
                    <HStack spacing={1}>
                      <Text>Market Cap</Text>
                      <LuArrowDownUp />
                    </HStack>
                  </Th>
                  <Th color="gray.400">
                    <HStack spacing={1}>
                      <Text>Intractions</Text>
                      <LuArrowDownUp />
                    </HStack>
                  </Th>
                  <Th color="gray.400">Holderlist</Th>
                  <Th color="gray.400">AI Agent</Th>
                </Tr>
              </Thead>
              <Tbody>
                {(isPopularAgentsLoading || popularAgents === undefined) ? <div>Loading...</div>
                  : popularAgents
                    // Array<typeof SAMPLE_TOKEN>(10)
                    //   .fill(SAMPLE_TOKEN)
                    .map((token, index) => (
                      <Tr _hover={{ bg: 'whiteAlpha.50' }} key={token.name}>
                        <Td>
                          <HStack spacing={2}>
                            <Image
                              alt="Token icon"
                              borderRadius="full"
                              boxSize="24px"
                              src="https://s3-alpha-sig.figma.com/img/d2da/29ed/db62a0bcddc7a8b6e80e049081ae833c?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=as74f6SFcoYblzly-yWLxk3EZSnUucTEFNtL034ZXJUqm0NHiRB2YSGcbsjxmaYhsOnQV5KpPuF5TP47FwJDoyNkbjFrXn45N22nbnRMNQvTZuOlhQMRngnev9Y54Aezx6eVEorLphlZ8KrwNicJ5vXIIiz4-1Au1fbfl-CVZWT5o~23rgLuYQhKy-uBeOvfN6u3FxRf1UlEvOWnUTtJ7UidNJ1EBcEeS9hA9xXBk~bAiICZ5E70xwGhqfCUWz2jQTWcGOqwSzbmyeimjnbVddFL2uClL5NCI3BKPqFRRaJag7KKFIkWSDfRyyCylYVlLCmmdC4zm5uLz4rsaH-bng__"
                            />
                            <Text fontWeight="medium">{token.name}</Text>
                            <Text color="gray.400" fontSize="sm">
                              {/* {token.symbol} */}
                            </Text>
                          </HStack>
                          <Tr>
                            <Flex alignItems="center" direction="row" gap="2" marginTop="2">
                              <Flex
                                alignItems="center"
                                bgColor="rgb(255 255 255 / 5%)"
                                borderRadius="full"
                                direction="row"
                                gap="1"
                                px={2}
                                py={1}
                              >
                                <Text fontSize="xs">fa</Text>
                                <LuExternalLink />
                              </Flex>
                              <Flex bgColor="rgb(255 255 255 / 5%)" borderRadius="full" px={2} py={2}>
                                <IoMdCopy />
                              </Flex>
                            </Flex>
                          </Tr>
                        </Td>
                        <Td>{formatNumber(0.02)}</Td>
                        <Td color="green.400">2%</Td>
                        <Td>{formatNumber(100)}</Td>
                        <Td>{formatNumber(1000)}</Td>
                        <Td>2545</Td>
                        <Td>30</Td>
                        <Td>
                          <Button
                            _hover={{ bg: 'green.500', color: 'white' }}
                            bg="transparent"
                            borderColor="green.500"
                            borderRadius="2xl"
                            color="green.500"
                            h="24px"
                            px={3}
                            size="sm"
                            variant="outline"
                          >
                            View
                          </Button>
                        </Td>
                      </Tr>
                    ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
};
export default PopularTokens;
