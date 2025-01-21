import { useMemo } from 'react';

import { useQuery } from '@apollo/client';
import { Box, Flex, Tooltip } from '@chakra-ui/react';
import TOKENS_DATA_QUERY from '@integrations/graphql/queries/tokens';
import { useAtomValue } from 'jotai';
import { v4 as uuid } from 'uuid';

import { Table, Td, Th } from '@components/DataTable';
import { NATIVE_TOKEN_ADDRESS } from '@constants/config';
import { useGetPoolById } from '@hooks/lbp/useGetPool';
import { useTokenMetadata } from '@hooks/useToken';
import { useTokenAddress } from '@routes/~lbp/~swap/hooks/useTokenAddress';
import { formatDate } from '@utils/formatDate';
import { shrinkText } from '@utils/shrinkText';

import { eventsAtom } from '../atom';
import { usePoolId } from '../hooks/usePoolId';
import { EventData } from '../types';
import { TradeDetailTableRow } from './TradeDetailTableRow';

export const TradeDetailsPanel = () => {
  const { data: poolData, isLoading: isPoolDataLoading } = useGetPoolById(usePoolId());
  const { data: swapTransactionData, loading: isSwapTransactionDataLoading } = useQuery(
    TOKENS_DATA_QUERY,
    {
      skip: isPoolDataLoading || !poolData?.token || !poolData?.token.toString(),
      variables: {
        id: poolData?.token.toString() as string,
      },
    }
  );

  const { poolTokenMetadata } = useTokenMetadata(useTokenAddress());
  const eventDatas = useAtomValue(eventsAtom);

  const formattedSwapData: EventData[] = useMemo(() => {
    if (!swapTransactionData) return [];
    return swapTransactionData.token.swaps.map((eachSwap) => ({
      id: uuid(), // assign uuid till we have a defined id for each transaction
      amountIn: eachSwap.amountIn,
      amountOut: eachSwap.amountOut,
      collateralTokenBalance: eachSwap.amountSOL,
      date: eachSwap.timestamp,
      eventName:
        eachSwap.tokenInAddr.toLowerCase() === NATIVE_TOKEN_ADDRESS ?
          'poolBuyEvent'
        : 'poolSellEvent',
      formatedDate: formatDate(eachSwap.timestamp),
      projectTokenBalance: eachSwap.amountIn,
      signature: eachSwap.signature,
      tokenInAddress: eachSwap.tokenInAddr,
      tokenOutAddress: eachSwap.tokenOutAddr,
      trader: eachSwap.caller,
    }));
  }, [swapTransactionData]);

  const tableData = useMemo(
    () => [...eventDatas, ...formattedSwapData].sort((a, b) => b.date - a.date) || [],
    [formattedSwapData, eventDatas]
  );

  return (
    <Box>
      <Table
        columns={5}
        data={tableData}
        isLoading={isSwapTransactionDataLoading}
        paginationVariant="lbpPagination"
        renderRow={(eventData) => <TradeDetailTableRow {...eventData} />}
      >
        <Th display={{ base: 'none', md: 'flex' }} mb={2}>
          <Flex justify="space-between" width="100%">
            <Td flex={0.2}>Time</Td>
            <Flex flex={1} justify="space-between">
              <Td>Type</Td>
              <Td>USD</Td>
              <Td>
                <Tooltip label={poolTokenMetadata?.symbol}>
                  {shrinkText({ maxLength: 4, string: poolTokenMetadata?.symbol ?? '' })}
                </Tooltip>
              </Td>
              <Td>SOL</Td>
              <Td>Address</Td>
              <Td>Txn</Td>
            </Flex>
          </Flex>
        </Th>
        <Th display={{ base: 'flex', md: 'none' }} mb={2}>
          {/* for mobile */}
          <Flex justify="space-between" width="100%">
            <Td maxW="50px">Time</Td>
            <Td>
              <Tooltip label={poolTokenMetadata?.symbol}>
                {shrinkText({ maxLength: 4, string: poolTokenMetadata?.symbol ?? '' })}
              </Tooltip>
            </Td>
            <Td>SOL</Td>
            <Td>Address</Td>
            <Td maxW="35px">Txn</Td>
          </Flex>
        </Th>
      </Table>
    </Box>
  );
};
