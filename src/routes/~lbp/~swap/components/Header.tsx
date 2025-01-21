import { Flex, Grid, GridItem, HStack, SkeletonText, Text, VStack } from '@chakra-ui/react';

import { LBPPoolStatus } from '@app-types/index';

import SocialsListing from '@components/SocialsListing';
import TokenAvatar from '@components/TokenAvatar';
import NumberWithTooltip from '@components/ui/Tooltip/NumberWithTooltip';
import { formatNumber, NumberFormatType } from '@utils/formatNumbers';

import { useTradeDetails } from '../hooks';

interface HeaderMetricsProps {
  title: string;
  tooltipValue: string;
  value: string;
}

const HeaderMetrics = ({ title, tooltipValue, value }: HeaderMetricsProps) => (
  <VStack alignItems="start" gap={1.5}>
    <Text opacity={0.5} textStyle="body-sm">
      {title}
    </Text>
    <NumberWithTooltip
      showtooltip={!!(value && value !== '-')}
      textStyle="body-md"
      tooltip={tooltipValue}
    >
      {value}
    </NumberWithTooltip>
  </VStack>
);

const Header = ({ currentPoolStatus }: { currentPoolStatus?: LBPPoolStatus }) => {
  const {
    fdvMarketCap,
    fundsRaised,
    isMetaDataLoading,
    isPoolDataLoading,
    socialLink,
    token,
    tokenPrice,
    tokensAvailable,
    tokensReleased,
    tradeVolume: totalVolume,
  } = useTradeDetails(currentPoolStatus);

  return (
    <Grid
      columnGap={9}
      marginEnd={0}
      rowGap={2}
      templateColumns={{ base: 'repeat(2, 1fr)', lg: '0.4fr 3fr 1fr' }}
      templateRows={{ base: '1fr 2fr', lg: '1fr', md: 'repeat(2, 1fr)' }}
    >
      <GridItem colStart={1}>
        <HStack>
          <TokenAvatar
            boxSize="12"
            isLoading={isMetaDataLoading || isPoolDataLoading}
            src={token?.logoUrl}
          />
          <VStack gap={0} minW={100}>
            <SkeletonText
              isLoaded={!isMetaDataLoading}
              noOfLines={2}
              skeletonHeight="16px"
              textAlign="start"
              width={!isMetaDataLoading && !isPoolDataLoading ? '100%' : '100px'}
            >
              {token?.name && (
                <NumberWithTooltip
                  opacity={0.5}
                  showtooltip={token.name.length > 15}
                  textStyle="body-md"
                  tooltip={token.name}
                >
                  {token?.name ?? ''}
                </NumberWithTooltip>
              )}
              {token?.symbol && (
                <NumberWithTooltip
                  display="block"
                  showtooltip={token.symbol.length > 15}
                  textStyle="h3"
                  tooltip={token.symbol}
                >
                  {token?.symbol ?? ''}
                </NumberWithTooltip>
              )}
            </SkeletonText>
          </VStack>
        </HStack>
      </GridItem>
      <GridItem
        colSpan={{ base: 3, lg: 1 }}
        colStart={{ base: 1, lg: 2 }}
        justifyContent="end"
        rowStart={{ base: 2, lg: 1 }}
      >
        <Flex
          alignItems="center"
          flexWrap={{ base: 'wrap', md: 'nowrap' }}
          gap={3}
          h="100%"
          justifyContent="space-between"
        >
          <HeaderMetrics
            title="Price"
            tooltipValue={tokenPrice ?? ''}
            value={`${formatNumber({ input: tokenPrice, suffix: 'SOL', type: NumberFormatType.TxDisplayValuesFormatterWithSubscript })}`}
          />
          <HeaderMetrics
            title="Volume"
            tooltipValue={totalVolume}
            value={`${formatNumber({ input: totalVolume, suffix: 'SOL', type: NumberFormatType.TxDisplayValuesFormatterWithSubscript })}`}
          />

          <HeaderMetrics
            title="Funds Raised"
            tooltipValue={fundsRaised ?? ''}
            value={`${formatNumber({ input: fundsRaised, suffix: 'SOL', type: NumberFormatType.TxDisplayValuesFormatterWithSubscript })}`}
          />
          <HeaderMetrics
            title="FDV Marketcap"
            tooltipValue={fdvMarketCap ?? ''}
            value={`${formatNumber({ input: fdvMarketCap, suffix: 'SOL', type: NumberFormatType.TxDisplayValuesFormatterWithSubscript })}`}
          />
          <VStack alignItems="start" gap={1.5}>
            <Text opacity={0.5} textStyle="body-sm">
              Tokens Released / Available
            </Text>
            <HStack gap={0.5}>
              <NumberWithTooltip
                // showtooltip={!!(value && value !== '-')}
                textStyle="body-md"
                tooltip={tokensReleased ?? ''}
              >
                {formatNumber({
                  input: tokensReleased,
                  type: NumberFormatType.TxDisplayValuesFormatterWithSubscript,
                })}
              </NumberWithTooltip>
              <Text textStyle="body-sm"> /</Text>
              <NumberWithTooltip
                // showtooltip={!!(value && value !== '-')}
                textStyle="body-md"
                tooltip={tokensAvailable ?? ''}
              >
                {formatNumber({
                  input: tokensAvailable,
                  suffix: token?.symbol,
                  type: NumberFormatType.TxDisplayValuesFormatterWithSubscript,
                })}
              </NumberWithTooltip>
            </HStack>
          </VStack>
        </Flex>
      </GridItem>
      <GridItem colStart={{ base: 2, lg: 3 }} display={{ base: 'none', md: 'grid' }}>
        <SocialsListing
          isLoading={isMetaDataLoading || isPoolDataLoading}
          socialsList={socialLink}
          w={50}
        />
      </GridItem>
    </Grid>
  );
};

export default Header;
