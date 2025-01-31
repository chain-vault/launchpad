import React, { useCallback, useEffect, useState } from 'react';

import { Card, CardBody, Flex, Grid, GridItem, Link, Skeleton, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { RxExternalLink } from 'react-icons/rx';

import { ClipboardText } from '@components/ClipboardText';
import NumberWithTooltip from '@components/ui/Tooltip/NumberWithTooltip';
import WithSolPriceUSD from '@components/WithSolPriceUSD';
import { getExplorerUrlAddressUrl, NATIVE_TOKEN, NATIVE_TOKEN_ADDRESS } from '@constants/config';
import { useGetPoolById } from '@hooks/apein/useGetPool';
import { useTokenMetadata } from '@hooks/useToken';
import { formatNumber, NumberFormatType } from '@utils/formatNumbers';
import { shrinkText } from '@utils/shrinkText';
import { Token } from '@utils/token';

import { useFastLaunchSearchParams } from '../hooks/useFastLaunchSearchParams';

export const TokenDetails: React.FC = () => {
  const [time, setTime] = useState('');
  const { data: poolData, isLoading: isPoolDataLoading } = useGetPoolById(
    useFastLaunchSearchParams().pool
  );
  const { isMetaDataLoading, poolTokenMetadata } = useTokenMetadata(
    poolData?.token?.toString() ?? '',
    true
  );
  const formatedTime = useCallback(() => {
    if (!isPoolDataLoading && poolData?.createdAt) {
      return dayjs.unix(poolData?.createdAt).fromNow();
    }
    return '';
  }, [poolData, isPoolDataLoading]);

  useEffect(() => {
    setTime(formatedTime());
    const timer = setTimeout(() => {
      setTime(formatedTime());
    }, 60 * 1000);
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [formatedTime, isPoolDataLoading, poolData]);

  const { pool } = useFastLaunchSearchParams();

  return (
    <Card pb={0}>
      <CardBody pb={0}>
        <Flex
          borderBottom="solid 1px"
          borderColor="surface.base.100"
          direction="row"
          fontWeight="bold"
          justifyContent="space-between"
          py={2}
        >
          <Flex flex="auto" textStyle="body-regular-bold">
            Token Created
          </Flex>
          <Flex textAlign="right" textStyle="body-regular-bold">
            <Skeleton h={5} isLoaded={!isPoolDataLoading} minW="100px">
              {time}
            </Skeleton>
          </Flex>
        </Flex>
        <Flex direction="column" py={2} textStyle="body-xs" width="100%">
          {poolData?.pooledToken && (
            <Grid
              borderBottom="solid 1px"
              borderColor="surface.base.500"
              gap={3}
              py={3}
              templateColumns="repeat(3, minmax(0, 1fr))"
            >
              <GridItem textStyle="body-md">
                <Skeleton isLoaded={!isMetaDataLoading}>
                  {poolTokenMetadata?.symbol && (
                    <NumberWithTooltip tooltip={poolTokenMetadata?.symbol}>
                      {`Pooled ${shrinkText({ maxLength: 10, string: poolTokenMetadata?.symbol ?? '' })}`}
                    </NumberWithTooltip>
                  )}
                </Skeleton>
              </GridItem>
              <GridItem textAlign="right" textStyle="body-md">
                <NumberWithTooltip textStyle="body-md" tooltip={poolData.pooledToken.toString()}>
                  {formatNumber({
                    input: poolData.pooledToken,
                    type: NumberFormatType.TxDisplayValuesFormatterWithSubscript,
                  })}
                </NumberWithTooltip>
              </GridItem>
              <GridItem textAlign="right" textStyle="body-md">
                <WithSolPriceUSD
                  solInput={poolData.pooledToken
                    .mul(Token.fromRawAmount(poolData?.tokenPrice ?? 0))
                    .toString()}
                  textStyle="body-md"
                />
              </GridItem>
            </Grid>
          )}

          {poolData?.pooledSol && (
            <Grid
              borderBottom="solid 1px"
              borderColor="surface.base.500"
              gap={3}
              py={3}
              templateColumns="repeat(3, minmax(0, 1fr))"
            >
              <GridItem textStyle="body-md">Pooled {NATIVE_TOKEN.symbol}</GridItem>
              <GridItem textAlign="right" textStyle="body-md">
                <NumberWithTooltip textStyle="body-md" tooltip={poolData.pooledSol.toString()}>
                  {formatNumber({
                    input: poolData.pooledSol,
                    suffix: NATIVE_TOKEN.symbol,
                    type: NumberFormatType.TokenBalanceFormatter,
                  })}
                </NumberWithTooltip>
              </GridItem>
              <GridItem textAlign="right" textStyle="body-md">
                <WithSolPriceUSD solInput={poolData.pooledSol} textStyle="body-md" />
              </GridItem>
            </Grid>
          )}

          <Grid
            borderBottom="solid 1px"
            borderColor="surface.base.500"
            gap={3}
            py={3}
            templateColumns="repeat(2, minmax(0, 1fr))"
          >
            <GridItem textStyle="body-md">
              <Skeleton isLoaded={!isMetaDataLoading}>
                {poolTokenMetadata?.symbol && (
                  <NumberWithTooltip tooltip={poolTokenMetadata?.symbol}>
                    {shrinkText({ string: poolTokenMetadata?.symbol ?? '' })}
                  </NumberWithTooltip>
                )}
              </Skeleton>
            </GridItem>
            <GridItem textAlign="right" textStyle="body-md">
              <Flex direction="row" justifyContent="flex-end">
                <ClipboardText theme="filled" trim>
                  {poolData?.token.toString() ?? ''}
                </ClipboardText>
                {poolData?.token.toString() && (
                  
                  <Link
                  alignItems="center"
                  display="inline-flex"
                  href={getExplorerUrlAddressUrl(poolData?.token.toString() ?? '')}
                  ml={2}
                  target="_blank"
                >
                  <RxExternalLink />
                </Link>
                )}
              </Flex>
            </GridItem>
          </Grid>

          <Grid
            borderBottom="solid 1px"
            borderColor="surface.base.500"
            gap={3}
            py={3}
            templateColumns="repeat(2, minmax(0, 1fr))"
          >
            <GridItem textStyle="body-md">SOL</GridItem>
            <GridItem textAlign="right" textStyle="body-md">
              <Flex direction="row" justifyContent="flex-end">
                <ClipboardText theme="filled" trim>
                  {NATIVE_TOKEN.address.toString()}
                </ClipboardText>
                <Link
                  alignItems="center"
                  display="inline-flex"
                  href={getExplorerUrlAddressUrl(NATIVE_TOKEN_ADDRESS)}
                  ml={2}
                  target="_blank"
                >
                  <RxExternalLink />
                </Link>
              </Flex>
            </GridItem>
          </Grid>

          <Grid
            borderBottom="solid 1px"
            borderColor="surface.base.500"
            gap={3}
            py={3}
            templateColumns="repeat(2, minmax(0, 1fr))"
          >
            <GridItem textStyle="body-md">Bonding curve</GridItem>
            <GridItem textAlign="right" textStyle="body-md">
              <Flex direction="row" justifyContent="flex-end">
                <ClipboardText theme="filled" trim>
                  {pool ?? ''}
                </ClipboardText>
                <Link
                  alignItems="center"
                  display="inline-flex"
                  href={getExplorerUrlAddressUrl(pool ?? '')}
                  ml={2}
                  target="_blank"
                >
                  <RxExternalLink />
                </Link>
              </Flex>
            </GridItem>
          </Grid>

          <Grid gap={3} py={3} templateColumns="repeat(2, minmax(0, 1fr))">
            <GridItem>
              <Flex alignItems="center" h="100%" textStyle="body-md">
                Migration DEX
              </Flex>
            </GridItem>

            {poolData?.selectedDex && (
              <GridItem textAlign="right">
                <Flex alignItems="center" justifyContent="flex-end">
                  <Text textStyle="body-regular-bold" textTransform="capitalize">
                    <Skeleton isLoaded={!isPoolDataLoading}> {poolData?.selectedDex}</Skeleton>
                  </Text>
                </Flex>
              </GridItem>
            )}
          </Grid>
        </Flex>
      </CardBody>
    </Card>
  );
};
