// import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  HStack,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';

import { SAMPLE_TOKEN } from '@constants/index';

const formatNumber = (num: number): string =>
  new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    style: 'currency',
  }).format(num);

const PopularTokens = () => (
  <Box bg="#1a1b23" p={4}>
    <HStack mb={4} spacing={2}>
      <Button _hover={{ bg: 'blue.500' }} bg="blue.400" borderRadius="full" color="white" size="sm">
        Total Value Locked
      </Button>
      <Button
        _hover={{ bg: 'whiteAlpha.100' }}
        borderRadius="full"
        color="gray.400"
        size="sm"
        variant="ghost"
      >
        Market Cap
      </Button>
    </HStack>

    <TableContainer w="full">
      <Table color="white" variant="unstyled" w="full">
        <Thead>
          <Tr>
            <Th color="gray.400">AI Agent Token</Th>
            <Th color="gray.400">
              <HStack spacing={1}>
                <Text>Price</Text>
                {/* <ChevronDownIcon /> */}
                <Text>ICO</Text>
              </HStack>
            </Th>
            <Th color="gray.400">4h</Th>
            <Th color="gray.400">24h</Th>
            <Th color="gray.400">24h Volume</Th>
            <Th color="gray.400">Market Cap</Th>
            <Th color="gray.400">Intractions</Th>
            <Th color="gray.400">AI Agent</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Array<typeof SAMPLE_TOKEN>(10)
            .fill(SAMPLE_TOKEN)
            .map((token, index) => (
              <Tr _hover={{ bg: 'whiteAlpha.50' }} key={index}>
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
                      {token.symbol}
                    </Text>
                  </HStack>
                </Td>
                <Td>{formatNumber(token.price)}</Td>
                <Td color={token.fourHourChange < 0 ? 'red.400' : 'green.400'}>
                  {token.fourHourChange}%
                </Td>
                <Td color="green.400">{token.dayChange}%</Td>
                <Td>{formatNumber(token.volume)}</Td>
                <Td>{formatNumber(token.marketCap)}</Td>
                <Td>{token.interactions}</Td>
                <Td>
                  <Button
                    _hover={{ bg: 'green.500', color: 'white' }}
                    borderColor="green.500"
                    borderRadius="full"
                    color="green.500"
                    h="24px"
                    px={3}
                    size="sm"
                    variant="outline"
                  >
                    chat
                  </Button>
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  </Box>
);
export default PopularTokens;
