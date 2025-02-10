import { Flex, Grid, GridItem, HStack, SkeletonText, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import isFunction from 'lodash/isFunction';

import { LaunchTypeIcon } from '@components/LaunchTypeIcon';
import TokenAvatar from '@components/TokenAvatar';
import NumberWithTooltip from '@components/ui/Tooltip/NumberWithTooltip';
import WithSolPriceUSD from '@components/WithSolPriceUSD';
import { useGetPoolById } from '@hooks/apein/useGetPool';
import useResponsiveValue from '@hooks/useResponsiveValue';
import { useTokenMetadata } from '@hooks/useToken';
import { formatNumber, formatPercent, NumberFormatType } from '@utils/formatNumbers';
import { shrinkText } from '@utils/shrinkText';
import { Token } from '@utils/token';

import { useFastLaunchParams } from '../hooks/useFastLaunchParams';
import { useFastLaunchSearchParams } from '../hooks/useFastLaunchSearchParams';

interface HeaderMetricsProps {
  isPrice?: boolean;
  onClick?: () => void;
  title: string;
  tooltipValue: string;
  value: string;
  withSolPrice?: string;
}

const HeaderMetrics = ({
  isPrice,
  onClick,
  title,
  tooltipValue,
  value,
  withSolPrice,
}: HeaderMetricsProps) => {
  const isPriceField = useResponsiveValue({ base: isPrice, lg: false, md: isPrice, xl: false });
  const onClickHandler = () => {
    if (isFunction(onClick)) {
      onClick();
    }
  };
  return (
    <VStack
      alignItems="start"
      cursor={isFunction(onClick) ? 'pointer' : ''}
      gap={1.5}
      onClick={onClickHandler}
      {...(isPriceField ? { order: -1 } : { order: 'unset' })}
      flex={1}
    >
      <Text opacity={0.5} textStyle="body-sm">
        {title}
      </Text>
      {withSolPrice ?
        <WithSolPriceUSD solInput={withSolPrice} textStyle="body-md" />
      : <NumberWithTooltip
          showtooltip={!!(value && value !== '-')}
          textStyle="body-md"
          tooltip={tooltipValue}
        >
          {value}
        </NumberWithTooltip>
      }
    </VStack>
  );
};

export const Header = () => {
  const { isMetaDataLoading: isLoading, poolTokenMetadata } = useTokenMetadata(
    useFastLaunchParams().tokenAddress,
    true
  );
  const navigate = useNavigate({ from: '/fast-launch/swap/$poolAddress' });

  const { data: poolData } = useGetPoolById(useFastLaunchSearchParams().pool);

  const onProfileClick = () => {
    navigate({
      search: {
        user: poolData?.poolCreator?.toString() ?? '',
        view: 'pump',
      },
      to: '/profile',
    });
  };

  return (
    <Grid
      columnGap={9}
      marginEnd={0}
      marginTop={4}
      rowGap={2}
      templateColumns={{ base: 'repeat(2, 1fr)', lg: '1.2fr 3fr' }}
      templateRows={{ base: '1fr 2fr', lg: '1fr', md: 'repeat(2, 1fr)' }}
    >
      <GridItem colStart={1}>
        <HStack>
          <TokenAvatar boxSize="12" isLoading={isLoading} src={poolTokenMetadata?.logoUrl} />
          <VStack gap={0} maxWidth={{ base: '100%', md: 200 }}>
            <SkeletonText
              isLoaded={!isLoading}
              noOfLines={2}
              skeletonHeight="16px"
              textAlign="start"
              width={100}
            >
              <NumberWithTooltip
                noOfLines={1}
                opacity={0.5}
                showtooltip={!!(poolTokenMetadata && poolTokenMetadata?.name.length > 15)}
                textAlign="left"
                textStyle="body-md"
                tooltip={poolTokenMetadata?.name ?? ''}
              >
                {shrinkText({ maxLength: 10, string: poolTokenMetadata?.name ?? '' })}
              </NumberWithTooltip>

              <NumberWithTooltip
                noOfLines={1}
                showtooltip={!!(poolTokenMetadata && poolTokenMetadata?.symbol.length > 10)}
                textAlign="left"
                textStyle="h3"
                tooltip={poolTokenMetadata?.symbol ?? ''}
              >
                {shrinkText({ maxLength: 10, string: poolTokenMetadata?.symbol ?? '' })}
              </NumberWithTooltip>
            </SkeletonText>
          </VStack>
          {/* {poolData?.curveIndex && (
            <LaunchTypeIcon boxSize="29px" type={poolData.curveIndex} zIndex={10} enableToolTip />
          )} */}
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
          columnGap={{ base: 1, md: 8 }}
          flexWrap={{ base: 'initial', md: 'nowrap' }}
          h="100%"
          justifyContent={{ base: 'space-between', lg: 'space-around' }}
          rowGap={3}
        >
          {/* <HeaderMetrics
            value={shrinkText({
              maxLength: 6,
              string: poolData?.poolCreator?.toString() ?? '-',
            })}
            onClick={()=>{}}
            title="Created By"
            tooltipValue={poolData?.poolCreator?.toString() ?? ''}
          /> */}
          <HeaderMetrics
            title="Price"
            tooltipValue={`${Token.fromRawAmount(poolData?.tokenPrice || 0).valueOf()}`}
            value={`${formatNumber({ input: Token.fromRawAmount(poolData?.tokenPrice || 0), suffix: 'SOL', type: NumberFormatType.TxDisplayValuesFormatterWithSubscript })}`}
            isPrice
          />
          <HeaderMetrics
            title="Marketcap"
            tooltipValue={`${Token.fromRawAmount(poolData?.marketCap || 0).toString()}`}
            value={`${formatNumber({ input: Token.fromRawAmount(poolData?.marketCap || 0), suffix: 'SOL', type: NumberFormatType.TxDisplayValuesFormatterWithSubscript })}`}
            withSolPrice={Token.fromRawAmount(poolData?.marketCap || 0).valueOf()}
          />
          <HeaderMetrics
            value={
              poolData?.bondingCurveProgress ?
                `${formatPercent(poolData?.bondingCurveProgress)}`
              : '-'
            }
            title="Bonding curve"
            tooltipValue={`${poolData?.bondingCurveProgress ?? ''}%`}
          />
        </Flex>
      </GridItem>
    </Grid>
  );
};
export default Header;
