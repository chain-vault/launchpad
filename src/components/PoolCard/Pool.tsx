import React, { useRef } from 'react';

import { Box, Grid, GridItem, Skeleton, Text, useColorModeValue, useToken } from '@chakra-ui/react';
import { Link, useNavigate } from '@tanstack/react-router';

import { SocialIconsMapList, TrimMode } from '@app-types/index';
import { LBPPoolWithTokenData } from '@app-types/lbp';

import SocialsListing from '@components/SocialsListing';
import { TokenAvatar } from '@components/TokenAvatar';
import { ActionButton } from '@components/ui/Button';
import NumberWithTooltip from '@components/ui/Tooltip/NumberWithTooltip';
import { NATIVE_TOKEN } from '@constants/config';
import { useTokenMetadata } from '@hooks/useToken';
import { formatNumber, NumberFormatType } from '@utils/formatNumbers';
import { shrinkText } from '@utils/shrinkText';
import { Token } from '@utils/token';

import { TokenDesc } from './Description';
import { PoolCoundown } from './PoolCountdown';

const Participants = React.memo(({ count }: { count: number | string }) => (
  <Box textAlign="right">
    <Box py={1}>
      <Text textStyle="h3">
        <Box as="span">{count || 0}</Box>
      </Text>
    </Box>
    <Box>
      <Text color="base.400" textStyle="body-sm">
        Aped
      </Text>
    </Box>
  </Box>
));
Participants.displayName = 'Participants';
type DragTracker = { isDragging: boolean; mouseDown: boolean };
export const Pool = ({ participantsCount, ...pool }: LBPPoolWithTokenData) => {
  const { isMetaDataLoading, poolTokenMetadata } = useTokenMetadata(pool.token.toString());

  const navigate = useNavigate();

  const trackDrag = useRef<DragTracker>({
    isDragging: false,
    mouseDown: false,
  });
  const onClickHandler = () => {
    if (!trackDrag.current.isDragging) {
      navigate({
        params: { poolAddress: pool.poolAddress.toString() },
        to: '/lbp/swap/$poolAddress',
      });
    }
    trackDrag.current = {
      isDragging: !1,
      mouseDown: !1,
    };
  };
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
  const shadowColor = useToken('colors', useColorModeValue('base.300', 'base.700'));

  const onMouseDown = () => {
    trackDrag.current = {
      ...trackDrag.current,
      mouseDown: true,
    };
  };

  const onMouseMove = () => {
    trackDrag.current = {
      ...trackDrag.current,
      isDragging: trackDrag.current.mouseDown === true,
    };
  };

  return (
    <Box
      _hover={{ cursor: 'pointer' }}
      bg="surface.base.poolcard"
      borderColor={shadowColor}
      borderRadius="34px"
      borderWidth={2}
      mt="60px"
      onClick={onClickHandler}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      width="100%"
    >
      <Box
        bg="surface.base.200"
        borderRadius="32px"
        boxShadow={`0px 0px 0px 2px ${shadowColor}`}
        position="relative"
        pt="50px"
        px="22px"
      >
        <Box height="72px" left="20px" position="absolute" top="-30px" width="72px">
          <TokenAvatar
            boxSize="72px"
            isLoading={isMetaDataLoading}
            src={poolTokenMetadata?.logoUrl}
          />
        </Box>
        <PoolCoundown
          endDate={pool.endAt}
          poolId={pool.poolAddress.toString()}
          startDate={pool.startAt}
        />
        <Box width="100%">
          <Box pb={4} pt={4}>
            <Box py={1}>
              {pool.name && (
                <NumberWithTooltip
                  showtooltip={pool?.name.length > 22}
                  textStyle="h3"
                  tooltip={pool.name}
                >
                  {shrinkText({
                    maxLength: 22,
                    mode: TrimMode.end,
                    string: pool?.name ?? '',
                  })}
                </NumberWithTooltip>
              )}
            </Box>
            <Box color="base.500" display="flex">
              <Skeleton height="auto" isLoaded={!isMetaDataLoading}>
                {poolTokenMetadata?.symbol && (
                  <NumberWithTooltip
                    as="span"
                    float="left"
                    fontWeight={500}
                    showtooltip={poolTokenMetadata?.symbol.length > 15}
                    textStyle="h3"
                    tooltip={poolTokenMetadata?.symbol}
                  >
                    {shrinkText({ maxLength: 15, string: poolTokenMetadata?.symbol })}
                  </NumberWithTooltip>
                )}
              </Skeleton>
            </Box>
          </Box>
          <Box minHeight="50px" py={1}>
            {!isMetaDataLoading ?
              <TokenDesc description={poolTokenMetadata?.poolDescription} />
            : <Skeleton height="50px" mb={2} mt={2} />}
          </Box>
          <Box pb={5} pt={3}>
            <SocialsListing
              align="left"
              socialsList={socialLink}
              variant="ghost-invariant"
              w="40px"
            />
          </Box>
        </Box>
      </Box>
      <Box pb={2} pt={5}>
        <Grid gap={2} px="22px" templateColumns="repeat(2, 1fr)" width="100%">
          <GridItem>
            <Box py={1}>
              <Skeleton isLoaded={!isMetaDataLoading}>
                <NumberWithTooltip
                  textStyle="h3"
                  tooltip={Token.fromRawAmount(pool.fundRaised).valueOf()}
                >
                  {formatNumber({
                    input: Token.fromRawAmount(pool.fundRaised),
                    placeholder: '0 SOL',
                    suffix: NATIVE_TOKEN.symbol,
                    type: NumberFormatType.TxDisplayValuesFormatterWithSubscript,
                  })}
                </NumberWithTooltip>
              </Skeleton>
            </Box>
            <Box>
              <Text color="base.400" textStyle="body-sm">
                Funds Raised
              </Text>
            </Box>
          </GridItem>
          <GridItem>
            <Participants count={participantsCount} />
          </GridItem>
        </Grid>
        <Box px={5} py={4}>
          <Link params={{ poolAddress: pool.poolAddress.toString() }} to="/lbp/swap/$poolAddress">
            {/* TODO: When integrating fast launch, handle fast launch variants as wells */}
            <ActionButton action="View Details" variant="secondary" width="100%" />
          </Link>
        </Box>
      </Box>
    </Box>
  );
};
export default Pool;
