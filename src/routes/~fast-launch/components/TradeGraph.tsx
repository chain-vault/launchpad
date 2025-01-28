import React, { useMemo } from 'react';

import { IChartingLibraryWidget, SeriesType } from '@adapters/charting_library';
import { Box, chakra, Fade, Text, useBreakpointValue, useDisclosure } from '@chakra-ui/react';
import { PublicKey } from '@solana/web3.js';

import { SortOptions } from '@app-types/index';

import { Graph } from '@components/Graph/Tradingv2';
import { useGetPoolById } from '@hooks/apein/useGetPool';
import { useTokenMetadata } from '@hooks/useToken';
import { formatGraphData } from '@utils/groupFeedData';

import { useFastLaunchParams } from '../hooks/useFastLaunchParams';
import { useFastLaunchSearchParams } from '../hooks/useFastLaunchSearchParams';
import { useTransactionsData } from '../hooks/useTransactionsData';

export const TradeGraph: React.FC = () => {
  const graphHeight = useBreakpointValue({ base: 320, md: 435 });
  const { data, loading: isTransactionsLoading } = useTransactionsData(SortOptions.asc);
  const { isOpen: showMessage, onClose, onOpen } = useDisclosure();
  const { isMetaDataLoading, poolTokenMetadata } = useTokenMetadata(
    useFastLaunchParams().tokenAddress,
    true
  );

  const { data: poolData, isLoading: poolDataLoading } = useGetPoolById(
    useFastLaunchSearchParams().pool
  );

  const isMigratedPool =
    poolData && poolData?.liquidityLP.toString() !== PublicKey.default.toString();

  const onChartReadyHandler = async (widget: IChartingLibraryWidget) => {
    if (widget && isMigratedPool) {
      await widget.headerReady();
      const button = widget.createButton();
      button.innerHTML = `
            The token is successfully launched.
            <a
              style="color: blue; cursor: pointer; text-decoration: underline;"
              href="https://birdeye.so/token/${poolData?.token.toString()}?chain=solana"
              target="_blank"
            >
              Check live price updates on Birdeye
            </a>
          `;
    }
    if (isMigratedPool) {
      onOpen();
    } else {
      onClose();
    }
  };

  const formattedData = useMemo(() => formatGraphData(data, 'tokenPrice', 'timestamp'), [data]);

  return (
    <Box position="relative" width="100%">
      <Graph
        data={formattedData}
        height={graphHeight}
        isLoading={isMetaDataLoading || isTransactionsLoading || poolDataLoading}
        onChartReady={onChartReadyHandler}
        symbol={poolTokenMetadata?.symbol ?? ''}
        type={SeriesType.Candles}
      />

      <Fade in={showMessage}>
        <Box position="relative">
          <Box
            bg="surface.base.500"
            borderRadius="md"
            bottom="90px"
            boxShadow="md"
            left="50%"
            pointerEvents="auto"
            position="absolute"
            px="4"
            py="2"
            transform="translateX(-50%)"
            width={{ base: 'auto', lg: 'max-content' }}
          >
            <Text textColor="surface.brand.secondary.900" textStyle="body-sm-bold">
              Bonding Curve Completed. Now you can trade this Ape in{' '}
              <chakra.span textTransform="capitalize">{poolData?.selectedDex}</chakra.span>
            </Text>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
};
