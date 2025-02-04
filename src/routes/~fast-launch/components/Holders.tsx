import { Box, Flex, Link, Text, Tooltip } from '@chakra-ui/react';

import { Tr } from '@components/DataTable';
import { Table } from '@components/DataTable/Table';
import { Td } from '@components/DataTable/td';
import { Th } from '@components/DataTable/th';
import NumberWithTooltip from '@components/ui/Tooltip/NumberWithTooltip';
import { DEFAULT_TOKEN_DECIMAL } from '@constants/config';
import { useGetPoolById } from '@hooks/apein/useGetPool';
import { useApeinEventsHandler } from '@hooks/apein/useTradeListener';
import useGetAllTokenHolders from '@hooks/useGetTokenHolders';
import { formatNumber, formatPercent, NumberFormatType } from '@utils/formatNumbers';
import { shrinkText } from '@utils/shrinkText';
import { Token } from '@utils/token';

import { useFastLaunchSearchParams } from '../hooks/useFastLaunchSearchParams';
import { useTokenLock } from '../hooks/useLockCountdown';

const TokenLockStatus: React.FC = () => {
  const { data: poolData, isLoading: isPoolDataLoading } = useGetPoolById(
    useFastLaunchSearchParams().pool
  );
  const { isLockActive } = useTokenLock(poolData?.lockEndTime);
  return !isPoolDataLoading && isLockActive ?
      <Tooltip label="Developer Tokens Locked">
        <Text>🔒</Text>
      </Tooltip>
    : null;
};
export const HoldersList = () => {
  const {
    data: holders,
    isLoading,
    refetch,
  } = useGetAllTokenHolders(useFastLaunchSearchParams().pool);
  useApeinEventsHandler(undefined, () => {
    setTimeout(() => {
      refetch();
    }, 1000);
  });

  return (
    <Box>
      <Table
        renderRow={(item) => (
          <Tr key={item.address} pb={2} px={0} py={2}>
            <Flex alignItems="center" justify="space-between" width="100%">
              <Td textStyle={['body-sm']}>#{item.rank}</Td>
              <Td textStyle={['body-sm-bold']}>
                <Flex alignItems="center" gap={1}>
                  <NumberWithTooltip
                    color="blue.500"
                    textDecoration="none"
                    tooltip={item?.owner}
                    w="fit-content"
                  >
                    <Text
                      // _hover={{ color: 'blue.500', textDecoration: 'underline' }}
                      // color="blue.500"
                      // href={`/profile?user=${item?.owner}&view=pump`}
                    >
                      {shrinkText({
                        maxLength: 4,
                        string: item?.owner ?? '',
                      })}
                    </Text>
                  </NumberWithTooltip>
                  {item?.isBondingCurve && (
                    <Tooltip label="Bonding Curve">
                      <Text>🏦</Text>
                    </Tooltip>
                  )}
                  {item?.isDeveloper && (
                    <Tooltip label="Token Creator">
                      <Text>🧑‍💻</Text>
                    </Tooltip>
                  )}

                  {item?.isDeveloper && <TokenLockStatus />}
                </Flex>
              </Td>
              <Td textStyle={['body-sm']}>
                <NumberWithTooltip
                  tooltip={item.percentage <= '0.001' ? `${item.percentage}%` : ''}
                >
                  {formatPercent(item.percentage)}
                </NumberWithTooltip>
              </Td>
              <Td textStyle={['body-sm']}>
                <NumberWithTooltip
                  tooltip={Token.fromRawAmount(item.amount, DEFAULT_TOKEN_DECIMAL).toString()}
                >
                  {formatNumber({
                    input: Token.fromRawAmount(item.amount, DEFAULT_TOKEN_DECIMAL),
                    type: NumberFormatType.TxDisplayValuesFormatterWithSubscript,
                  })}
                </NumberWithTooltip>
              </Td>
            </Flex>

            {/* <Td display={{ base: 'none', md: 'flex' }}> </Td>
          <Td>
            <Box cursor="pointer">
              <RxExternalLink />
            </Box>
          </Td> */}
          </Tr>
        )}
        columns={4}
        data={holders}
        isLoading={isLoading}
        resultsPerPage={10}
      >
        <Th>
          <Flex justifyContent="space-between" w="100%">
            <Td>Rank</Td>
            <Td>Address</Td>
            <Td>%</Td>
            <Td>Amount</Td>
          </Flex>

          {/* <Td display={{ base: 'none', md: 'flex' }}>Value</Td> */}
          {/* <Td>Txn</Td> */}
        </Th>
      </Table>
    </Box>
  );
};
