import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Progress,
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
import { IoMdSearch } from 'react-icons/io';
import { LuExternalLink } from 'react-icons/lu';

import { PoolWithAgent } from '@app-types/agent';

import { getExplorerUrlAddressUrl } from '@constants/config';
import { PoolSortOptions, useFilterAgents } from '@routes/~fast-launch/hooks/useGetAgentInfo';
import { getTimeDifference } from '@utils/duration';
import { formatNumber, formatPercent, NumberFormatType } from '@utils/formatNumbers';
import { Token } from '@utils/token';

import { ClipboardText } from './ClipboardText';

const ResultRowData = ({ poolInfo: { agent, pool } }: { poolInfo: PoolWithAgent }) => {
  const navigate = useNavigate();

  return (
    <Tr _hover={{ bg: 'whiteAlpha.50' }}>
      <Td>
        <Button
          onClick={() =>
            navigate({
              params: { poolAddress: pool.poolId.toString() },
              search: { agentId: agent.id },
              to: '/fast-launch/swap/$poolAddress',
            })
          }
          gap={2}
          size="sm"
          variant="unstyled"
        >
          <Image
            src={
              agent.imageUrl ||
              'https://s3-alpha-sig.figma.com/img/d2da/29ed/db62a0bcddc7a8b6e80e049081ae833c?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=as74f6SFcoYblzly-yWLxk3EZSnUucTEFNtL034ZXJUqm0NHiRB2YSGcbsjxmaYhsOnQV5KpPuF5TP47FwJDoyNkbjFrXn45N22nbnRMNQvTZuOlhQMRngnev9Y54Aezx6eVEorLphlZ8KrwNicJ5vXIIiz4-1Au1fbfl-CVZWT5o~23rgLuYQhKy-uBeOvfN6u3FxRf1UlEvOWnUTtJ7UidNJ1EBcEeS9hA9xXBk~bAiICZ5E70xwGhqfCUWz2jQTWcGOqwSzbmyeimjnbVddFL2uClL5NCI3BKPqFRRaJag7KKFIkWSDfRyyCylYVlLCmmdC4zm5uLz4rsaH-bng__'
            }
            alt="Token icon"
            borderRadius="full"
            boxSize="24px"
          />
          <Text fontWeight="medium">{pool.tokenName}</Text>
        </Button>
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
              <Link href={getExplorerUrlAddressUrl(pool?.token.toString() ?? '')} target="_blank">
                <LuExternalLink />
              </Link>
            </Flex>
            <Flex bgColor="rgb(255 255 255 / 5%)" borderRadius="full" px={2} py={2}>
              <ClipboardText theme="filled" trim>
                {pool?.token.toString() ?? ''}
              </ClipboardText>
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
      <Td>
        {formatNumber({
          input: Token.fromRawAmount(pool.marketCap.toString()),
          suffix: 'SOL',
          type: NumberFormatType.TableDataFormatter,
        })}
      </Td>
      <Td>
        <Box minH="28px" mt={2}>
          <Flex justifyContent="space-between" mb={1} textStyle="body-md-bold">
            <Text color="brand.accent.600">{formatPercent(pool.bondingCurveProgress)}</Text>
            <Text>{getTimeDifference(pool.createdAt)}</Text>
          </Flex>
          <Progress
            sx={{
              '& > div': {
                backgroundColor: 'brand.accent.600',
              },
            }}
            bg="surface.base.950"
            borderRadius="full"
            height="6px"
            value={pool.bondingCurveProgress}
          />
        </Box>
      </Td>
      {/* <Td>
        {formatNumber({
          input: Token.fromRawAmount(pool.curveThresholdReached),
          suffix: 'SOL',
          type: NumberFormatType.TableDataFormatter,
        })}
      </Td> */}
      <Td>
        <Button
          onClick={() => {
            window.open(`${import.meta.env.VITE_BLOCKBEAST_URL}/chat/${agent.id}`, '_blank');
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
          Agent
        </Button>
      </Td>
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
  const {
    data: popularAgents,
    filter,
    isLoading: isPopularAgentsLoading,
    onChangeFilters,
  } = useFilterAgents();

  const handleSearch = (search: string) => {
    onChangeFilters({ search });
  };

  return (
    <Box bg="base.800" mt="2.5">
      <Box bg="#1E263A" borderRadius="md" p={4}>
        <Flex
          alignItems="flex-start"
          flexDirection={{ base: 'column', lg: 'row' }} // handled for mobile and large screen
          justifyContent="space-between"
          mb={4}
        >
          <Box bg="#121E30" borderRadius="full" display="flex" padding="2">
            <Box bg="#121E30" borderRadius="full" display="flex" padding="2">
              {Object.entries(PoolSortOptions).map(([key, label]) => (
                <Button
                  onClick={() =>
                    onChangeFilters({
                      sortBy: PoolSortOptions[key as keyof typeof PoolSortOptions],
                    })
                  }
                  _hover={{ bg: 'blue.500' }}
                  bg={`${filter.sortBy === PoolSortOptions[key as keyof typeof PoolSortOptions] ? 'blue.500' : 'transparant'}`}
                  borderRadius="full"
                  color={`${filter.sortBy === PoolSortOptions[key as keyof typeof PoolSortOptions] ? 'white' : 'gray.400'}`}
                  key={key}
                  p={2}
                  size="sm"
                >
                  <Text textStyle="body-md">{label}</Text>
                </Button>
              ))}
            </Box>
          </Box>
          <Box>
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
                    _placeholder={{ color: 'gray.400' }}
                    bg="#2C3655"
                    border="none"
                    color="white"
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search Token Name"
                  />
                </InputGroup>
              </Box>
            </Flex>
          </Box>
        </Flex>

        <TableContainer w="full">
          <Table color="white" variant="unstyled" w="full">
            <Thead>
              <Tr>
                <Th color="gray.400">AI Agent Token</Th>
                <Th color="gray.400">
                  <HStack spacing={1}>
                    <Text>Price</Text>
                  </HStack>
                </Th>
                <Th color="gray.400">
                  <HStack spacing={1}>
                    <Text>Market Cap</Text>
                  </HStack>
                </Th>

                <Th color="gray.400">Bonding Curve Progress</Th>
                <Th color="gray.400">Agent</Th>
              </Tr>
            </Thead>
            <Tbody>
              {isPopularAgentsLoading || popularAgents === undefined ?
                <Flex justifyContent="center" width="100%">
                  Searching...
                </Flex>
              : popularAgents.map((data) => (
                  <ResultRowData key={data.pool.poolId.toString()} poolInfo={data} />
                ))
              }
              {popularAgents.length === 0 && !isPopularAgentsLoading && (
                <Flex justifyContent="center" width="100%">
                  No Tokens found
                </Flex>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
export default PopularTokens;
