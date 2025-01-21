import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Progress,
  Skeleton,
  Text,
  useColorModeValue,
  useToken,
} from '@chakra-ui/react';
import { Link, useLocation } from '@tanstack/react-router';

import { PoolWithTokenData } from '@app-types/apiIn';

import DeveloperTokenStatus from '@components/DeveloperTokenLockStatus';
import { LaunchTypeIcon } from '@components/LaunchTypeIcon';
import { TokenDesc } from '@components/PoolCard/Description';
import TokenAvatar from '@components/TokenAvatar';
import NumberWithTooltip from '@components/ui/Tooltip/NumberWithTooltip';
import WithSolPriceUSD from '@components/WithSolPriceUSD';
import useResponsiveValue from '@hooks/useResponsiveValue';
import { useTokenLock } from '@routes/~fast-launch/hooks/useLockCountdown';
import { getTimeDifference } from '@utils/duration';
import { formatPercent } from '@utils/formatNumbers';
import { shrinkText } from '@utils/shrinkText';
import { Token } from '@utils/token';

interface FastLaunchProps {
  isTokensLoading: boolean;
  pool: PoolWithTokenData;
}

const FastLaunch: React.FC<FastLaunchProps> = ({ isTokensLoading, pool }: FastLaunchProps) => {
  const shadowColor = useToken('colors', useColorModeValue('base.300', 'base.700'));
  const location = useLocation();
  const isMobile = useResponsiveValue({ base: true, lg: false, md: false, xl: false });
  const { isLockActive } = useTokenLock(pool.lockEndTime);

  return (
    <Link to={`/fast-launch/swap/${pool.poolId.toString()}`}>
      <Card
        _hover={{
          cursor: 'pointer',
          transform: 'scale(1.03)',
        }}
        bg="surface.base.200"
        borderColor={isLockActive ? 'brand.accent.600 !important' : `${shadowColor} !important`}
        borderRadius="32px !important"
        borderWidth="1px !important"
        boxShadow="none"
        h="100%"
        position="relative"
        transition="transform 0.3s ease-in-out"
        w="100%"
      >
        {pool && (
          <LaunchTypeIcon
            boxSize="29px"
            position="absolute"
            right="10px"
            top="10px"
            type={pool.curveIndex}
            enableToolTip
          />
        )}

        <CardHeader minH="98px" pb={0} pt={4} px={2}>
          <Flex gap={4}>
            <Box position="relative">
              <Box borderRadius="24px" left={2} position="absolute">
                <TokenAvatar
                  borderRadius="24px"
                  boxSize="92px"
                  isLoading={isTokensLoading && !pool?.logoUrl}
                  src={pool?.logoUrl}
                />
              </Box>
              {/* <Flex
              alignItems="center"
              bg="surface.base.200"
              borderRadius="full"
              boxSize="32px"
              justifyContent="center"
              position="absolute"
              right={-24}
              top={0}
            >
              <TokenAvatar boxSize="26px" />
            </Flex> */}
            </Box>
            <Box ml="92px">
              <Skeleton isLoaded={!isTokensLoading}>
                {pool?.name && (
                  <NumberWithTooltip
                    display="block"
                    noOfLines={1}
                    showtooltip={pool.name.length > 25}
                    textAlign="left"
                    textStyle="body-regular-bold"
                    tooltip={pool?.name ?? ''}
                    w="fit-content"
                  >
                    {pool?.name ?
                      pool?.name?.length > 25 ?
                        `${pool?.name.slice(0, isMobile || location.pathname === '/' ? 18 : 32)}...`
                      : pool?.name
                    : ''}
                  </NumberWithTooltip>
                )}
              </Skeleton>
              <Skeleton isLoaded={!isTokensLoading}>
                {pool?.symbol && (
                  <NumberWithTooltip
                    display="block"
                    noOfLines={1}
                    opacity={0.5}
                    showtooltip={pool?.symbol.length > 25}
                    textAlign="left"
                    textStyle="body-regular-bold"
                    tooltip={pool?.symbol ?? ''}
                    w="fit-content"
                  >
                    {pool?.symbol ?
                      pool?.symbol?.length > 25 ?
                        `${pool?.symbol.slice(0, isMobile || location.pathname === '/' ? 18 : 32)}...`
                      : pool?.symbol
                    : ''}
                  </NumberWithTooltip>
                )}
              </Skeleton>
              {pool?.hasTokenLockBeenApplied && (
                <DeveloperTokenStatus
                  isLockActive={isLockActive}
                  isMobile={!!isMobile}
                  location={location}
                />
              )}
            </Box>
          </Flex>
        </CardHeader>
        <CardBody pb={4} px={4} textAlign="left">
          {isTokensLoading ?
            <Skeleton h="25px" mb={2} w="100px" />
          : <Flex gap={location.pathname === '/' ? 8 : 8} mt={2} w="100%">
              <Flex
                alignItems="start"
                direction={location.pathname === '/' || isMobile ? 'column' : 'row'}
                gap={location.pathname === '/' ? 0 : 2}
              >
                <Text color="base.400" textStyle="body-sm-bold">
                  Created by:
                </Text>
                <NumberWithTooltip
                  display="block"
                  noOfLines={1}
                  textAlign="left"
                  textStyle="body-md-semibold"
                  tooltip={pool?.poolCreator?.toString() ?? ''}
                  showtooltip
                >
                  {shrinkText({
                    maxLength: 4,
                    string: pool?.poolCreator?.toString() ?? '',
                  })}
                </NumberWithTooltip>
              </Flex>

              <Flex
                alignItems="start"
                direction={location.pathname === '/' || isMobile ? 'column' : 'row'}
                gap={location.pathname === '/' ? 0 : 2}
              >
                <Text color="base.400" textStyle="body-sm-bold">
                  Aped:
                </Text>
                <NumberWithTooltip
                  display="block"
                  noOfLines={1}
                  showtooltip={pool?.participantsCount > 5}
                  textAlign="left"
                  textStyle="body-md-semibold"
                  tooltip={pool?.participantsCount.toString() ?? ''}
                >
                  {shrinkText({
                    maxLength: 5,
                    string: pool?.participantsCount.toString() ?? '',
                  })}
                </NumberWithTooltip>
              </Flex>

              <Flex
                alignItems="start"
                direction={location.pathname === '/' || isMobile ? 'column' : 'row'}
                gap={location.pathname === '/' ? 0 : 2}
              >
                <Text color="base.400" textStyle="body-sm-bold">
                  Market Cap:
                </Text>
                <WithSolPriceUSD
                  solInput={Token.fromRawAmount(pool.marketCap).valueOf()}
                  textStyle="body-md-semibold"
                />
              </Flex>
            </Flex>
          }
          {isTokensLoading ?
            <Box gap={2} w="100%">
              <Skeleton h="25px" w="200px" />
              <Skeleton h="25px" mt={4} w="250px" />
            </Box>
          : <>
              <Box minH="28px" mt={2}>
                <Flex justifyContent="space-between" mb={1} textStyle="body-md-bold">
                  <Text color="brand.accent.600">{formatPercent(pool.bondingCurveProgress)}</Text>
                  <Text>{getTimeDifference(pool.createdAt)}</Text>
                </Flex>
                <Progress
                  sx={{
                    '& > div': {
                      backgroundColor: 'brand.accent.600',
                    },
                  }}
                  bg="surface.base.950"
                  borderRadius="full"
                  height="6px"
                  value={pool.bondingCurveProgress}
                />
              </Box>
              <Box minHeight={location.pathname === '/' ? '31px' : '50px'} mt={2} py={1} w="100%">
                <TokenDesc
                  description={pool?.poolDescription}
                  lines={location.pathname === '/' ? 1 : 2}
                />
              </Box>
            </>
          }
        </CardBody>
      </Card>
    </Link>
  );
};

export default FastLaunch;
