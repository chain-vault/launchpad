import { Box, Card, Flex, HStack, Image, Progress, Skeleton, Text, VStack } from '@chakra-ui/react';
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

import { Banana } from '@assets/imges';

interface FastLaunchProps {
  isTokensLoading: boolean;
  pool: PoolWithTokenData;
}

const ApeXCard: React.FC<FastLaunchProps> = ({ isTokensLoading, pool }: FastLaunchProps) => {
  const location = useLocation();
  const isMobile = useResponsiveValue({ base: true, lg: false, md: false, xl: false });
  const { isLockActive } = useTokenLock(pool.lockEndTime);

  return (
    <Link
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        if (pool.refundProcessed) {
          e.preventDefault();
        }
      }}
      to={`/fast-launch/swap/${pool.poolId.toString()}`}
    >
      <VStack
        _hover={{
          cursor: 'pointer',
          transform: 'scale(1.02)',
        }}
        transition="transform 0.3s ease-in-out"
        w="100%"
      >
        <Card
          borderColor={
            isLockActive ? 'brand.accent.600 !important' : 'brand.secondary.600 !important'
          }
          bg="brand.secondary.600 !important"
          borderRadius="8px !important"
          borderWidth={1}
          boxShadow="none"
          pl={2}
          position="relative"
          pr={6}
          py={2}
          w="100%"
        >
          {pool.curveIndex && (
            <LaunchTypeIcon
              bg="brand.accent.600"
              boxSize="29px"
              position="absolute"
              right="10px"
              top="10px"
              type={pool.curveIndex}
              zIndex={10}
              enableToolTip
            />
          )}
          {/* Mobile */}
          <Flex direction="column" display={['flex', 'none', 'none']} gap={4} w="100%">
            <Text
              color="brand.accent.600"
              fontSize={['16px', '20px']}
              fontStyle="italic"
              position="absolute"
              textAlign="left"
              textStyle="h3"
              top={-6}
            >
              Ape X
            </Text>

            <HStack minH="80px" mt={3} position="relative">
              <Box borderRadius="24px" position="absolute" top="-10px">
                <TokenAvatar
                  borderRadius="24px"
                  boxSize="92px"
                  isLoading={isTokensLoading && !pool.logoUrl}
                  src={pool.logoUrl}
                />
              </Box>
              <Box ml="100px">
                <Skeleton isLoaded={!isTokensLoading}>
                  <Text
                    color="base.900"
                    noOfLines={1}
                    textAlign="left"
                    textStyle="body-regular-bold"
                  >
                    {pool.name ?
                      pool.name?.length > 25 ?
                        `${pool.name.slice(0, isMobile ? 25 : 32)}...`
                      : pool.name
                    : ''}
                  </Text>
                </Skeleton>
                <Skeleton isLoaded={!isTokensLoading}>
                  <Text
                    color="base.900"
                    opacity={0.5}
                    textAlign="left"
                    textStyle="body-regular-bold"
                  >
                    {pool.symbol ?
                      pool.symbol?.length > 25 ?
                        `${pool.symbol.slice(0, isMobile ? 25 : 32)}...`
                      : pool.symbol
                    : ''}
                  </Text>
                </Skeleton>
                <Skeleton isLoaded={!isTokensLoading} minH="34px">
                  {pool.hasTokenLockBeenApplied && (
                    <DeveloperTokenStatus
                      cardType="apex"
                      isLockActive={isLockActive}
                      isMobile={!!isMobile}
                      location={location}
                    />
                  )}
                </Skeleton>
              </Box>
            </HStack>
            {isTokensLoading ?
              <Skeleton h="25px" w="100px" />
            : <Flex gap={location.pathname === '/' ? 8 : 8} minH="42px" px={1} w="100%">
                <VStack alignItems="start" gap={0}>
                  <Text color="base.900" opacity={0.5} textStyle="body-sm-bold">
                    Created by:
                  </Text>
                  <Text color="base.900" textStyle="body-md-semibold">
                    {' '}
                    {shrinkText({
                      maxLength: 4,
                      string: pool.poolCreator?.toString() ?? '',
                    })}
                  </Text>
                </VStack>

                <VStack alignItems="start" gap={0}>
                  <Text color="base.900" opacity={0.5} textStyle="body-sm-bold">
                    Aped:
                  </Text>
                  <Text color="base.900" textStyle="body-md-semibold">
                    {pool.participantsCount}
                  </Text>
                </VStack>

                <VStack alignItems="start" gap={0}>
                  <Text color="base.900" opacity={0.5} textStyle="body-sm-bold">
                    Market Cap:
                  </Text>
                  <WithSolPriceUSD
                    color="base.900"
                    solInput={Token.fromRawAmount(pool.marketCap).valueOf()}
                    textStyle="body-md-semibold"
                  />
                </VStack>
              </Flex>
            }
          </Flex>
          {/* Other Devices */}
          <Flex gap={8}>
            <Box display={['none', 'flex', 'flex']} position="relative">
              <Skeleton isLoaded={!isTokensLoading}>
                <Text
                  color="brand.accent.600"
                  fontSize="20px"
                  fontStyle="italic"
                  position="absolute"
                  textAlign="left"
                  textStyle="h3"
                  top={-10}
                >
                  Ape X
                </Text>
              </Skeleton>
              <Skeleton isLoaded={!isTokensLoading} />
              <Box display={['none', 'flex', 'flex']}>
                <TokenAvatar
                  borderRadius="24px"
                  boxSize="234px"
                  isLoading={isTokensLoading && !pool.logoUrl}
                  src={pool.logoUrl}
                />
              </Box>
              <Image
                alt="banana"
                bottom={0}
                position="absolute"
                right={-20}
                src={Banana}
                transform="rotate(180deg)"
              />
            </Box>
            <Box position="relative" w="100%">
              <Image
                alt="banana"
                bottom={32}
                boxSize={['60px', 28, 28]}
                display={['none', 'block', 'block']}
                position="absolute"
                right={[-3, -14]}
                src={Banana}
                transform="rotate(240deg) scaleX(-1)"
              />
              <Image
                alt="banana"
                boxSize={['60px', 28, 28]}
                display={['none', 'block', 'block']}
                left={['260px', 60]}
                position="absolute"
                src={Banana}
                top={[-16, -12]}
                transform="rotate(120deg) "
              />
              <Box display={['none', 'block', 'block']} mt={2}>
                <Skeleton isLoaded={!isTokensLoading}>
                  {pool.name && (
                    <NumberWithTooltip
                      color="base.900"
                      display="block"
                      noOfLines={1}
                      showtooltip={pool.name.length > 25}
                      textAlign="left"
                      textStyle="body-regular-bold"
                      tooltip={pool.name ?? ''}
                      w="fit-content"
                    >
                      {pool.name ?
                        pool.name?.length > 25 ?
                          `${pool.name.slice(0, 30)}...`
                        : pool.name
                      : ''}
                    </NumberWithTooltip>
                  )}
                </Skeleton>
                <Skeleton isLoaded={!isTokensLoading}>
                  {pool.symbol && (
                    <NumberWithTooltip
                      color="base.900"
                      display="block"
                      noOfLines={1}
                      opacity={0.5}
                      showtooltip={pool.symbol.length > 25}
                      textAlign="left"
                      textStyle="body-regular-bold"
                      tooltip={pool.symbol ?? ''}
                      w="fit-content"
                    >
                      {pool.symbol ?
                        pool.symbol?.length > 25 ?
                          `${pool.symbol.slice(0, isMobile ? 25 : 32)}...`
                        : pool.symbol
                      : ''}
                    </NumberWithTooltip>
                  )}
                </Skeleton>
                {pool.hasTokenLockBeenApplied && (
                  <DeveloperTokenStatus
                    cardType="apex"
                    isLockActive={isLockActive}
                    isMobile={!!isMobile}
                    location={location}
                  />
                )}
              </Box>
              {isTokensLoading ?
                <Skeleton h="25px" mt={2} w="100px" />
              : <Flex alignItems="center" display={['none', 'flex', 'flex']} gap={4} mt={3}>
                  {/* <Flex
                  alignItems="center"
                  bg="base.100"
                  borderRadius="full"
                  boxSize="34px"
                  justifyContent="center"
                >
                  <TokenAvatar boxSize="28px" />
                </Flex> */}
                  <VStack alignItems="start" gap={1}>
                    <Text color="base.900" opacity={0.5} textStyle="body-sm-bold">
                      Created by:
                    </Text>
                    <NumberWithTooltip
                      color="base.900"
                      display="block"
                      noOfLines={1}
                      textAlign="left"
                      textStyle="body-md-semibold"
                      tooltip={pool.poolCreator?.toString() ?? ''}
                      showtooltip
                    >
                      {shrinkText({
                        maxLength: 4,
                        string: pool.poolCreator?.toString() ?? '',
                      })}
                    </NumberWithTooltip>
                  </VStack>
                  <VStack alignItems="start" gap={1}>
                    <Text color="base.900" opacity={0.5} textStyle="body-sm-bold">
                      Aped:
                    </Text>
                    <NumberWithTooltip
                      color="base.900"
                      display="block"
                      noOfLines={1}
                      showtooltip={pool.participantsCount > 5}
                      textAlign="left"
                      textStyle="body-md-semibold"
                      tooltip={pool.participantsCount.toString() ?? ''}
                    >
                      {shrinkText({
                        maxLength: 5,
                        string: pool.participantsCount.toString() ?? '',
                      })}
                    </NumberWithTooltip>
                  </VStack>
                  <VStack alignItems="start" gap={1}>
                    <Text color="base.900" opacity={0.5} textStyle="body-sm-bold">
                      Market Cap:
                    </Text>
                    <WithSolPriceUSD
                      color="base.900"
                      solInput={Token.fromRawAmount(pool.marketCap).valueOf()}
                      textStyle="body-md-semibold"
                    />
                  </VStack>
                </Flex>
              }

              {isTokensLoading ?
                <Box gap={2} w="100%">
                  <Skeleton h="25px" w="200px" />
                  <Skeleton h="25px" mt={4} w="250px" />
                </Box>
              : <>
                  <Box mt={2} pl={[1, 0]}>
                    <Flex justifyContent="space-between" mb={1} textStyle="body-md-bold">
                      <Text color="brand.accent.600">
                        {formatPercent(pool.bondingCurveProgress)}
                      </Text>
                      <Text color="base.700">{getTimeDifference(pool.createdAt)}</Text>
                    </Flex>
                    <Progress
                      sx={{
                        '& > div': {
                          backgroundColor: 'brand.accent.600',
                        },
                      }}
                      bg="surface.base.950"
                      borderRadius="full"
                      height="8px"
                      value={pool.bondingCurveProgress}
                      w="100%"
                    />
                  </Box>
                  <Box color="base.900" minHeight="50px" mt={2} pl={[1, 0]} textAlign="left">
                    <TokenDesc
                      description={pool.poolDescription}
                      lines={location.pathname === '/' ? 1 : 2}
                    />
                  </Box>
                </>
              }
            </Box>
          </Flex>
        </Card>
      </VStack>
    </Link>
  );
};

export default ApeXCard;
