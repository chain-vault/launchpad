// import { ChevronDownIcon } from '@chakra-ui/icons';
import { useEffect, useRef, useState } from 'react';

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
import { useNavigate } from '@tanstack/react-router';
import { IoMdCopy, IoMdSearch } from 'react-icons/io';
import { LuArrowDownUp, LuExternalLink } from 'react-icons/lu';

import { PoolWithAgent, useFilterAgents } from '@routes/~fast-launch/hooks/useGetAgentInfo';
import { formatNumber, formatPercent, NumberFormatType } from '@utils/formatNumbers';
import { Token } from '@utils/token';

const ResultRowData = ({ poolInfo: { agent, pool } }: { poolInfo: PoolWithAgent }) => {
  const navigate = useNavigate();

  return (
    <Tr _hover={{ bg: 'whiteAlpha.50' }}>
      <Td>
        <HStack spacing={2}>
          <Image
            src={
              agent.image_url ||
              'https://s3-alpha-sig.figma.com/img/d2da/29ed/db62a0bcddc7a8b6e80e049081ae833c?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=as74f6SFcoYblzly-yWLxk3EZSnUucTEFNtL034ZXJUqm0NHiRB2YSGcbsjxmaYhsOnQV5KpPuF5TP47FwJDoyNkbjFrXn45N22nbnRMNQvTZuOlhQMRngnev9Y54Aezx6eVEorLphlZ8KrwNicJ5vXIIiz4-1Au1fbfl-CVZWT5o~23rgLuYQhKy-uBeOvfN6u3FxRf1UlEvOWnUTtJ7UidNJ1EBcEeS9hA9xXBk~bAiICZ5E70xwGhqfCUWz2jQTWcGOqwSzbmyeimjnbVddFL2uClL5NCI3BKPqFRRaJag7KKFIkWSDfRyyCylYVlLCmmdC4zm5uLz4rsaH-bng__'
            }
            alt="Token icon"
            borderRadius="full"
            boxSize="24px"
          />
          <Text fontWeight="medium">{pool.tokenName}</Text>
          <Text color="gray.400" fontSize="sm">
            {/* {token.image_url} */}
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
      <Td>
        {formatNumber({
          input: Token.fromRawAmount(pool.tokenPrice).toString(),
          placeholder: '0',
          suffix: 'SOL',
          type: NumberFormatType.TxDisplayValuesFormatterWithSubscript,
        })}
      </Td>
      {/* <Td color="green.400">{formatPercent(0)}</Td>
      <Td>volume</Td> */}
      <Td>
        {formatNumber({
          input: Token.fromRawAmount(pool.marketCap.toString()),
          suffix: 'SOL',
          type: NumberFormatType.TableDataFormatter,
        })}
      </Td>
      {/* <Td>{10}</Td>
      <Td>{10}</Td> */}
      <Td>
        <Button
          onClick={() => {
            navigate({
              params: { poolAddress: pool.poolId.toString() },
              search: { agentId: agent.id },
              to: '/fast-launch/swap/$poolAddress',
            });
          }}
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
  );
};

const PopularTokens = () => {
  const searchBarRef = useRef<HTMLInputElement>(null);
  const searchNameRef = useRef<string>('');
  const searchPublicIdRef = useRef<string>('');
  const searchIsTokenIdRef = useRef<boolean>(true);
  const { data: popularAgents, isLoading: isPopularAgentsLoading } = useFilterAgents(
    searchNameRef.current,
    searchPublicIdRef.current,
    searchIsTokenIdRef.current
  );

  // const [suggestionResults, setSuggestionResults] = useState<PoolWithAgent[]>([]);

  // // TODO: FIXME  Donot use useEffect. Causing infinte renders.
  // useEffect(() => {
  //   if (popularAgents !== undefined) {
  //     setSuggestionResults(popularAgents);
  //   }
  // }, [popularAgents.length]); // To avoid infinite render

  // // TODO: FIXME Instead of this function, better handle search results from the hook so that we can avoid unnecessary useEffect
  // function searchAgents(popularWizards: PoolWithAgent[], searchQuery: string) {
  //   if (popularWizards === undefined) return undefined;
  //   if (searchQuery === '') {
  //     setSuggestionResults([]);
  //     return undefined;
  //   }

  //   const results = popularWizards.filter((pool) =>
  //     pool.agent.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  //   );

  //   setSuggestionResults(results);
  // }

  function checkIsPublicId(id: string) {
    if (searchBarRef.current === null) return;
    const regex = /^[A-Za-z0-9]{44}$/;
    if (regex.test(id)) {
      searchPublicIdRef.current = searchBarRef.current.value;
    } else searchNameRef.current = searchBarRef.current.value;
  }

  function clearInputRefs() {
    searchNameRef.current = '';
    searchPublicIdRef.current = '';
    searchIsTokenIdRef.current = true;
  }

  return (
    <>
      {/* Search Bar */}
      <Flex alignItems="center" justifyContent="center" mt={4}>
        <Box maxW="18.75rem" w="full">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              {/* <SearchIcon color="gray.400" /> */}
              <Flex bgColor="#1e263a" borderRadius="4px" padding="4px">
                <IoMdSearch height="1.75rem" width="1.75rem" />
              </Flex>
            </InputLeftElement>
            <Input
              _focus={{
                border: '1px solid',
                borderColor: 'blue.400',
                boxShadow: 'none',
              }}
              onChange={(e) => {
                if (searchBarRef.current) {
                  searchBarRef.current.value = e.target.value;
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  clearInputRefs();
                  if (searchBarRef.current && popularAgents) {
                    if (searchBarRef.current.value === '') clearInputRefs();
                    // searchAgents(popularAgents, searchBarRef.current.value);
                    checkIsPublicId(searchBarRef.current.value);
                  }
                }
              }}
              _placeholder={{ color: 'gray.400' }}
              bg="#2C3655"
              border="none"
              color="white"
              placeholder="Search Token Name or CA"
              ref={searchBarRef}
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
                  {/* <Th color="gray.400">
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
                  </Th> */}
                  <Th color="gray.400">
                    <HStack spacing={1}>
                      <Text>Market Cap</Text>
                      <LuArrowDownUp />
                    </HStack>
                  </Th>
                  {/* <Th color="gray.400">
                    <HStack spacing={1}>
                      <Text>Interactions</Text>
                      <LuArrowDownUp />
                    </HStack>
                  </Th>
                  <Th color="gray.400">Holderlist</Th> */}
                  <Th color="gray.400">AI Agent</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isPopularAgentsLoading || popularAgents === undefined ?
                  <div>Loading...</div>
                : popularAgents.map((data) => (
                    <ResultRowData key={data.pool.poolId.toString()} poolInfo={data} />
                  ))
                }
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
};
export default PopularTokens;
