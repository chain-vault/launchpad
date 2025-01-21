import React, { type ReactElement } from 'react';

import {
  Box,
  Card,
  Flex,
  Grid,
  GridItem,
  Link,
  SimpleGrid,
  Skeleton,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useAtomValue } from 'jotai';

import { SocialIconsMapList } from '@app-types/index';

import { ClipboardText } from '@components/ClipboardText';
import SocialsListing from '@components/SocialsListing';
import TokenAvatar from '@components/TokenAvatar';
import NumberWithTooltip from '@components/ui/Tooltip/NumberWithTooltip';
import { DEFAULT_TOKEN_DECIMAL, NATIVE_TOKEN } from '@constants/config';
import { useGetPoolById } from '@hooks/lbp/useGetPool';
import useResponsiveValue from '@hooks/useResponsiveValue';
import { useTokenMetadata } from '@hooks/useToken';
import { getDuration } from '@utils/duration';
import { formatDate } from '@utils/formatDate';
import { formatNumber, formatPercent, NumberFormatType } from '@utils/formatNumbers';
import { decompressString } from '@utils/textCompression';
import { Token } from '@utils/token';

import '@assets/css/editor.css';

import { price } from '../atom';
import { usePoolId } from '../hooks/usePoolId';
import { useTokenAddress } from '../hooks/useTokenAddress';
import { TradeDetailsPanel } from './TradeDetailsPanel';

const InformationTabPanel = () => {
  const { isMetaDataLoading, poolTokenMetadata } = useTokenMetadata(useTokenAddress());
  const {
    discord = '',
    github = '',
    telegram = '',
    twitter = '',
    website = '',
  } = poolTokenMetadata ?? {};

  const socialLink: SocialIconsMapList = [
    { id: 'twitter', url: twitter },
    { id: 'discord', url: discord },
    { id: 'telegram', url: telegram },
    { id: 'website', url: website },
    { id: 'github', url: github },
  ];

  return (
    <Box>
      <Flex alignItems="center" justifyContent="space-between" mb={2} w="100%">
        <Text textStyle="body-regular-semibold">About Us</Text>
      </Flex>

      <Box
        dangerouslySetInnerHTML={{
          __html: decompressString(poolTokenMetadata?.poolDescription || ''),
        }}
        className="editor-preview"
        textAlign="initial"
      />
      <Box mt={4} textAlign="initial">
        {poolTokenMetadata?.roadmap && (
          <Box>
            <Text as="span" fontWeight="bold" mr={2}>
              Roadmap :
            </Text>
            <Link
              href={
                poolTokenMetadata.roadmap.startsWith('http') ?
                  poolTokenMetadata.roadmap
                : `https://${poolTokenMetadata.roadmap}`
              }
              rel="noopener noreferrer"
              target="_blank"
            >
              {poolTokenMetadata.roadmap}
            </Link>
          </Box>
        )}
        {poolTokenMetadata?.whitepaper && (
          <Box mt={2}>
            <Text as="span" fontWeight="bold" mr={2}>
              Whitepaper :
            </Text>
            <Link
              href={
                poolTokenMetadata.whitepaper.startsWith('http') ?
                  poolTokenMetadata.whitepaper
                : `https://${poolTokenMetadata.whitepaper}`
              }
              rel="noopener noreferrer"
              target="_blank"
            >
              {poolTokenMetadata?.whitepaper}
            </Link>
          </Box>
        )}

        <Box display={['block', 'none']} mt={5}>
          <SocialsListing
            align="left"
            bg="surface.base.500"
            isLoading={isMetaDataLoading}
            socialsList={socialLink}
            width={['48px', '54px']}
          />
        </Box>
      </Box>
    </Box>
  );
};

type StackViewItemProps = {
  children?: ReactElement;
  isLoading?: boolean;
  label: string;
  toolTipValue?: string;
  value?: number | string;
};
const StackViewItem: React.FC<StackViewItemProps> = ({
  children,
  isLoading = false,
  label,
  toolTipValue,
  value,
}) => (
  <VStack alignItems="flex-start" gap={1} w="max-content">
    <Text opacity={0.5} textStyle="body-sm-bold">
      {label}
    </Text>
    <Skeleton isLoaded={!isLoading}>
      {value && (
        <NumberWithTooltip tooltip={toolTipValue ?? ''}>
          <Text textStyle="body-md">{value}</Text>
        </NumberWithTooltip>
      )}
      {!children && !value && <Text textStyle="body-regular-bold">-</Text>}
      {children}
    </Skeleton>
  </VStack>
);
const DetailsTabPanel = () => {
  const poolID = usePoolId();
  const { data: poolData, isLoading: isPoolDataLoading } = useGetPoolById(poolID);
  const { isMetaDataLoading, poolTokenMetadata } = useTokenMetadata(useTokenAddress());
  const isMobile = useResponsiveValue({ base: true, lg: false, md: false, xl: false });

  const poolPrice = useAtomValue(price);
  const isLoading = isPoolDataLoading || isMetaDataLoading;
  return (
    <Box width="100%">
      <Box mb={[2, 4]} mt={[2, 3]}>
        <Box
          alignItems="center"
          display="flex"
          height="40px"
          pl="50px"
          position="relative"
          textAlign="left"
        >
          <Box boxSize="30px" left={0} position="absolute">
            <TokenAvatar boxSize="30px" isLoading={isLoading} src={poolTokenMetadata?.logoUrl} />
          </Box>
          <Box
            as="span"
            fontSize={['18px', '']}
            left={10}
            position="absolute"
            textStyle="h3"
            textTransform="uppercase"
            top={3}
          >
            {poolTokenMetadata?.name && (
              <NumberWithTooltip
                showtooltip={poolTokenMetadata.name.length > 22}
                textStyle="h3"
                textTransform="uppercase"
                tooltip={poolTokenMetadata.name}
              >
                {isMobile && poolTokenMetadata?.name.length > 15 ?
                  `${poolTokenMetadata?.name.slice(0, 15)}...`
                : poolTokenMetadata.name.length > 22 ?
                  `${poolTokenMetadata.name.slice(0, 22)}...`
                : (poolTokenMetadata?.name ?? '')}
              </NumberWithTooltip>
            )}
            <Box as="span" fontSize="15px" fontWeight="normal" ml={2}>
              {poolTokenMetadata?.symbol && (
                <NumberWithTooltip
                  as="span"
                  fontSize="15px"
                  fontWeight="normal"
                  showtooltip={poolTokenMetadata?.symbol.length > 22}
                  textStyle="h3"
                  textTransform="uppercase"
                  tooltip={poolTokenMetadata?.symbol}
                >
                  {isMobile && poolTokenMetadata?.symbol.length > 15 ?
                    `${poolTokenMetadata?.symbol.slice(0, 15)}...`
                  : poolTokenMetadata?.symbol.length > 22 ?
                    `${poolTokenMetadata?.symbol.slice(0, 22)}...`
                  : (poolTokenMetadata?.symbol ?? '')}
                </NumberWithTooltip>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box borderBottom="dashed 1px" borderColor="surface.base.600" mb={5} pb={3}>
        <StackViewItem label="Contract Address">
          <Box>
            <ClipboardText maxLength={35} trim={!!isMobile}>
              {poolData?.token.toString() ?? ''}
            </ClipboardText>
          </Box>
        </StackViewItem>
        <Box mt={4} />
        <StackViewItem label="Creator">
          <Box>
            <ClipboardText maxLength={35} trim={!!isMobile}>
              {poolData?.creator.toString() ?? ''}
            </ClipboardText>
          </Box>
        </StackViewItem>
      </Box>
      <Box width="100%">
        <SimpleGrid columnGap={[4, 6]} columns={{ base: 2, md: 2 }} rowGap={[3, 4]}>
          {poolTokenMetadata?.totalSupply && (
            <StackViewItem
              value={formatNumber({
                input: poolTokenMetadata?.totalSupply,
                suffix: poolTokenMetadata?.symbol ? poolTokenMetadata?.symbol : '',
                type: NumberFormatType.TxValuesFormatter,
              })}
              isLoading={isLoading}
              label="Total Token Supply"
              toolTipValue={poolTokenMetadata?.totalSupply}
            />
          )}
          <StackViewItem isLoading={isLoading} label="Start Amount">
            <Box as="span" textStyle="body-md">
              <NumberWithTooltip
                tooltip={Token.fromRawAmount(
                  poolData?.startProjectAmount ?? 0,
                  DEFAULT_TOKEN_DECIMAL
                ).toString()}
              >
                <Box as="span">
                  {formatNumber({
                    input: Token.fromRawAmount(
                      poolData?.startProjectAmount ?? 0,
                      DEFAULT_TOKEN_DECIMAL
                    ),
                    suffix: poolTokenMetadata?.symbol,
                    type: NumberFormatType.TxValuesFormatter,
                  })}{' '}
                </Box>
              </NumberWithTooltip>
              {' + '}
              {NATIVE_TOKEN && (
                <NumberWithTooltip
                  tooltip={Token.fromRawAmount(poolData?.startCollaterolAmount ?? 0).toString()}
                >
                  <Box display={{ base: 'block', md: 'inline' }} textAlign="left">
                    {formatNumber({
                      input: Token.fromRawAmount(poolData?.startCollaterolAmount ?? 0),
                      suffix: NATIVE_TOKEN.symbol,
                      type: NumberFormatType.TxValuesFormatter,
                    })}
                  </Box>
                </NumberWithTooltip>
              )}
            </Box>
          </StackViewItem>
          <StackViewItem isLoading={isLoading} label="Start Weight">
            <Box textAlign="left" textStyle="body-md">
              <Box display={{ base: 'block', md: 'inline' }} mr={2} textTransform="uppercase">
                {poolTokenMetadata?.symbol}: {formatPercent(poolData?.projectTokenStartWeight)}
              </Box>
              {NATIVE_TOKEN && (
                <Box display={{ base: 'block', md: 'inline' }}>
                  {NATIVE_TOKEN.symbol}: {formatPercent(poolData?.collateralStartWeight)}
                </Box>
              )}
            </Box>
          </StackViewItem>
          <StackViewItem isLoading={isLoading} label="End Weight">
            <Box textAlign="left" textStyle="body-md">
              <Box display={{ base: 'block', md: 'inline' }} mr={2} textTransform="uppercase">
                {poolTokenMetadata?.symbol}: {formatPercent(poolData?.projectTokenEndWeight)}
              </Box>
              {NATIVE_TOKEN && (
                <Box display={{ base: 'block', md: 'inline' }}>
                  {NATIVE_TOKEN.symbol}: {formatPercent(poolData?.collateralEndWeight)}
                </Box>
              )}
            </Box>
          </StackViewItem>
          <StackViewItem
            value={formatNumber({
              input: poolPrice.startPrice,
              suffix: NATIVE_TOKEN.symbol,
              type: NumberFormatType.TxValuesFormatter,
            })}
            isLoading={isLoading}
            label="Start Price"
            toolTipValue={poolPrice.startPrice}
          />
          <StackViewItem
            value={formatNumber({
              input: poolPrice.currentPrice,
              suffix: NATIVE_TOKEN.symbol,
              type: NumberFormatType.TxValuesFormatter,
            })}
            isLoading={isLoading}
            label="End Price / Current Price"
            toolTipValue={poolPrice.currentPrice}
          />
          <StackViewItem
            isLoading={isLoading}
            label="Start Time"
            value={poolData?.startAt ? formatDate(poolData?.startAt) : '-'}
          />
          <StackViewItem
            isLoading={isLoading}
            label="End Time"
            value={poolData?.endAt ? formatDate(poolData?.endAt) : '-'}
          />
          <StackViewItem
            value={
              poolData?.startAt && poolData?.endAt ?
                getDuration(poolData?.startAt, poolData?.endAt)
              : '-'
            }
            isLoading={isLoading}
            label="Duration"
          />
          <StackViewItem isLoading={isLoading} label="Swap Fee" value="1.5%" />
        </SimpleGrid>
      </Box>
    </Box>
  );
};

const PoolDetailsPanel = () => (
  <Grid columnGap={5} mt={[1, 4]} templateColumns={{ base: '1fr', lg: '1.8fr 1fr' }}>
    <GridItem>
      <Card borderRadius="32px" px={[4, 8, 8]} py={[4, 5, 5]}>
        <Tabs size={{ base: 'base', md: 'md' }} variant="classic">
          <TabList>
            <Tab>
              <Text textStyle="body-sm-bold">Information</Text>
            </Tab>
            <Tab>
              <Text textStyle="body-sm-bold">Details</Text>
            </Tab>
            <Tab>
              <Text textStyle="body-sm-bold">Transactions</Text>
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <InformationTabPanel />
            </TabPanel>
            <TabPanel>
              <DetailsTabPanel />
            </TabPanel>
            <TabPanel>
              <TradeDetailsPanel />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Card>
    </GridItem>
    <GridItem display={{ base: 'none', lg: 'grid' }}>
      <Spacer />
    </GridItem>
  </Grid>
);

export default PoolDetailsPanel;
