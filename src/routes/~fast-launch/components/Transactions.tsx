import React from 'react';

import { Box, Flex, HStack, Link, Text, Tooltip } from '@chakra-ui/react';
import { RxExternalLink } from 'react-icons/rx';

import { SortOptions } from '@app-types/index';

import { Tr } from '@components/DataTable';
import { Table } from '@components/DataTable/Table';
import { Td } from '@components/DataTable/td';
import { Th } from '@components/DataTable/th';
import NumberWithTooltip from '@components/ui/Tooltip/NumberWithTooltip';
import WithSolPriceUSD from '@components/WithSolPriceUSD';
import { getExplorerUrl } from '@constants/config';
import useResponsiveValue from '@hooks/useResponsiveValue';
import { getTimeDifferenceFromNow } from '@utils/duration';
import { formatNumber, NumberFormatType } from '@utils/formatNumbers';
import { shrinkText } from '@utils/shrinkText';

import { useTransactionsData } from '../hooks/useTransactionsData';

export const TransactionsList: React.FC = () => {
  const { data, loading, symbol } = useTransactionsData(SortOptions.dsc);
  const isMobile = useResponsiveValue({ base: true, lg: false, md: false, xl: false });
  return (
    <Box>
      <Table
        renderRow={(item) => {
          const isBuy = item.eventType === 'poolBuyEvent';
          const hasUsdData = item.amountUSD && !Number.isNaN(parseFloat(item.amountUSD));
          return !isMobile ?
              <Tr pb={2} px={0} py={2}>
                <Flex justifyContent="space-between" w="100%">
                  <Td textStyle={['body-sm']}>{getTimeDifferenceFromNow(item.timestamp)}</Td>
                  <Td color={isBuy ? '#5FD875' : '#FC1369'} textStyle="body-sm">
                    {isBuy ? 'Buy' : 'Sell'}
                  </Td>
                  <Td textStyle={['body-sm']}>
                    {hasUsdData ? '$' : null}
                    {
                      hasUsdData ?
                        <NumberWithTooltip tooltip={item.amountUSD}>
                          {formatNumber({
                            input: item.amountUSD,
                            placeholder: '-',
                            type: NumberFormatType.TxValuesFormatter,
                          })}
                        </NumberWithTooltip>
                      : <WithSolPriceUSD
                          formatOptions={{
                            formattingType: NumberFormatType.TxValuesFormatter,
                            placeholder: '-',
                            prefix: '$',
                          }}
                          solInput={item.amountSOL}
                        />


                      // <NumberWithTooltip
                      //     tooltip={convertSol(
                      //       new Decimal(isBuy ? item.amountIn : item.amountOut).toString()
                      //     )}
                      //   >
                      //     {convertSol(item.amountSOL, {
                      //       formattingType: NumberFormatType.TxValuesFormatter,
                      //     })}
                      //   </NumberWithTooltip>
                    }
                  </Td>
                  <Td textStyle={['body-sm']}>
                    <NumberWithTooltip tooltip={isBuy ? item.amountOut : item.amountIn}>
                      {formatNumber({
                        input: isBuy ? item.amountOut : item.amountIn,
                        type: NumberFormatType.TxValuesFormatter,
                      })}
                    </NumberWithTooltip>
                  </Td>
                  <Td textStyle={['body-sm']}>
                    <NumberWithTooltip tooltip={item.amountSOL}>
                      {formatNumber({
                        input: item.amountSOL,
                        suffix: '',
                        type: NumberFormatType.TxDisplayValuesFormatterWithSubscript,
                      })}
                    </NumberWithTooltip>
                  </Td>
                  <Td textStyle={['body-sm-bold']}>
                    <NumberWithTooltip tooltip={item.caller.toString()} w="fit-content">
                      <Link
                        _hover={{ color: 'blue.500', textDecoration: 'underline' }}
                        color="blue.500"
                        href={`/profile?user=${item.caller.toString()}&view=pump`}
                        textDecoration="none"
                      >
                        {shrinkText({
                          maxLength: 4,
                          string: item.caller.toString() ?? '',
                        })}
                      </Link>
                    </NumberWithTooltip>
                  </Td>

                  <Td textStyle={['body-sm']}>
                    <Link href={getExplorerUrl(item?.signature?.toString())} target="_blank">
                      <RxExternalLink />
                    </Link>
                  </Td>
                </Flex>
              </Tr>
            : <Tr pb={2} px={0} py={2}>
                <Flex alignItems="center" justify="space-between" width="100%">
                  <Td maxW="50px" textStyle={['body-sm']}>
                    <HStack gap={1}>
                      <Text>{getTimeDifferenceFromNow(item?.timestamp).split(' ')[0]}</Text>
                      <Text color={isBuy ? '#5FD875' : '#FC1369'} textStyle={['body-sm']}>
                        {isBuy ? 'B' : 'S'}
                      </Text>
                    </HStack>
                  </Td>
                  <Td textStyle={['body-sm']}>
                    {formatNumber({
                      input: isBuy ? item.amountOut : item.amountIn,
                      type: NumberFormatType.TxValuesFormatter,
                    })}
                  </Td>
                  <Td textStyle={['body-sm']}>
                    {formatNumber({
                      input: item.amountSOL,
                      suffix: '',
                      type: NumberFormatType.TxDisplayValuesFormatterWithSubscript,
                    })}
                  </Td>
                  <Td textStyle={['body-sm-bold']}>
                    <Link
                      _hover={{ color: 'blue.500', textDecoration: 'underline' }}
                      color="blue.500"
                      href={`/profile?user=${item.caller.toString()}&view=pump`}
                      textDecoration="none"
                    >
                      <Text w="fit-content">
                        {shrinkText({
                          maxLength: 4,
                          string: item.caller.toString() ?? '',
                        })}
                      </Text>
                    </Link>
                  </Td>

                  <Td textStyle={['body-sm']}>
                    <Link href={getExplorerUrl(item?.signature?.toString())} target="_blank">
                      <RxExternalLink />
                    </Link>
                  </Td>
                </Flex>
              </Tr>;
        }}
        columns={4}
        data={data}
        isLoading={loading}
        resultsPerPage={10}
      >
        <Th>
          <Flex justifyContent="space-between" w="100%">
            <Td maxW={isMobile ? '50px' : ''}>Time</Td>
            <Td display={['none', 'none', 'flex']}>Type</Td>
            <Td display={{ base: 'none', md: 'flex' }}>USD</Td>
            <Td>
              <Tooltip label={symbol}>{shrinkText({ maxLength: 4, string: symbol ?? '' })}</Tooltip>
            </Td>
            <Td>SOL</Td>
            <Td>Address</Td>
            <Td>Txn</Td>
          </Flex>
        </Th>
      </Table>
    </Box>
  );
};
