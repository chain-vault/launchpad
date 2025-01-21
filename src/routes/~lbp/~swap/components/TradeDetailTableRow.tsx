import React from 'react';

import { Flex, Link, Text } from '@chakra-ui/react';
import { Link as TanstackLink } from '@tanstack/react-router';
import { RxExternalLink } from 'react-icons/rx';

import { Td, Tr } from '@components/DataTable';
import NumberWithTooltip from '@components/ui/Tooltip/NumberWithTooltip';
import WithSolPriceUSD from '@components/WithSolPriceUSD';
import { getExplorerUrl } from '@constants/config';
import useResponsiveValue from '@hooks/useResponsiveValue';
import { getTimeDifferenceFromNow } from '@utils/duration';
import { formatNumber, NumberFormatType } from '@utils/formatNumbers';
import { shrinkText } from '@utils/shrinkText';

import { EventData } from '../types';

type TradeDetailTableRowProps = EventData;
export const TradeDetailTableRow: React.FC<TradeDetailTableRowProps> = ({
  amountIn,
  amountOut,
  date,
  eventName,
  signature,

  trader,
}) => {
  const isMobile = useResponsiveValue({ base: true, lg: false, md: false, xl: false });
  const isBuy = eventName === 'poolBuyEvent';
  const tradeType = (
    <Text as="span" color={isBuy ? '#5FD875' : '#FC1369'}>
      {isBuy ?
        isMobile ?
          'B'
        : 'Buy'
      : isMobile ?
        'S'
      : 'Sell'}
    </Text>
  );

  return !isMobile ?
      <Tr pb={2} px={0} py={2}>
        <Flex alignItems="center" justify="space-between" width="100%">
          <Td flex={0.2} textStyle={['body-sm']}>
            {getTimeDifferenceFromNow(date)}
          </Td>

          <Flex alignItems="center" flex={1} justify="space-between">
            <Td textStyle={['body-sm']}>{tradeType}</Td>
            <Td textAlign="left" textStyle={['body-sm']}>
              <WithSolPriceUSD
                formatOptions={{
                  formattingType: NumberFormatType.TxValuesFormatter,
                  placeholder: '-',
                  prefix: '$',
                }}
                solInput={isBuy ? amountIn : amountOut}
              />
            </Td>
            <Td textAlign="left" textStyle={['body-sm']}>
              <NumberWithTooltip tooltip={isBuy ? amountOut : amountIn}>
                {formatNumber({
                  input: isBuy ? amountOut : amountIn,
                  type: NumberFormatType.TableDataFormatter,
                })}
              </NumberWithTooltip>
            </Td>
            <Td textStyle={['body-sm']}>
              <NumberWithTooltip tooltip={isBuy ? amountIn : amountOut}>
                {formatNumber({
                  input: isBuy ? amountIn : amountOut,
                  type: NumberFormatType.TxDisplayValuesFormatterWithSubscript,
                })}
              </NumberWithTooltip>
            </Td>

            <Td textStyle={['body-sm-bold']}>
              <NumberWithTooltip tooltip={trader}>
                <Link
                  _hover={{ color: 'blue.500', textDecoration: 'underline' }}
                  as={TanstackLink}
                  color="blue.500"
                  href={`/profile?user=${trader}&view=lbp`}
                  textDecoration="none"
                >
                  <Text color="blue.500" w="fit-content">
                    {shrinkText({
                      maxLength: 4,
                      string: trader ?? '',
                    })}
                  </Text>
                </Link>
              </NumberWithTooltip>
            </Td>
            <Td textStyle={['body-sm']}>
              <Link href={getExplorerUrl(signature?.toString())} target="_blank">
                <RxExternalLink />
              </Link>
            </Td>
          </Flex>
        </Flex>
      </Tr>
    : <Tr pb={2} px={0} py={2}>
        <Flex alignItems="center" justify="space-between" width="100%">
          <Td maxW="50px" textStyle={['body-sm']}>
            <Text>
              {getTimeDifferenceFromNow(date).split(' ')[0]} {tradeType}
            </Text>
          </Td>

          <Td textAlign="left" textStyle={['body-sm']}>
            {formatNumber({
              input: isBuy ? amountOut : amountIn,
              type: NumberFormatType.TableDataFormatter,
            })}
          </Td>
          <Td textStyle={['body-sm']}>
            {formatNumber({
              input: isBuy ? amountIn : amountOut,
              type: NumberFormatType.TableDataFormatter,
            })}
          </Td>
          <Td textStyle={['body-sm-bold']}>
            <Link
              _hover={{ color: 'blue.500', textDecoration: 'underline' }}
              color="blue.500"
              href={`/profile?user=${trader}&view=lbp`}
              textDecoration="none"
            >
              <Text color="blue.500" w="fit-content">
                {shrinkText({
                  maxLength: 4,
                  string: trader ?? '',
                })}
              </Text>
            </Link>
          </Td>
          <Td maxW="35px" textStyle={['body-sm']}>
            <Link href={getExplorerUrl(signature?.toString())} target="_blank">
              <RxExternalLink />
            </Link>
          </Td>
        </Flex>
      </Tr>;
};
