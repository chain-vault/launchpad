import {
  Box,
  Card,
  CardBody,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  SkeletonText,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useSearch } from '@tanstack/react-router';
import dayjs from 'dayjs';
import { useAtomValue } from 'jotai';

import { SOCIAL_ICONS_MAP } from '@app-types/index';

import TokenAvatar from '@components/TokenAvatar';
import { generateProfileUrl } from '@utils/buildUrl';
import { formatNumber, NumberFormatType } from '@utils/formatNumbers';

import { useGetAtomWithId } from '../atom';

const InfoPanel = () => {
  const { draft: draftId } = useSearch({
    from: '/lbp/create/',
  });

  const poolAndTokenInfo = useAtomValue(useGetAtomWithId(draftId));
  const { launchInfo, projectInfo, socialsInfo, tokenInfo } = poolAndTokenInfo;

  const socialUrlsMap = [
    {
      logo: SOCIAL_ICONS_MAP.website,
      name: 'website',
      url: projectInfo.website,
    },
    {
      logo: SOCIAL_ICONS_MAP.roadmap,
      name: 'roadmap',
      url: projectInfo.roadmap,
    },
    {
      logo: SOCIAL_ICONS_MAP.whitepaper,
      name: 'whitepaper',
      url: projectInfo.whitePaper,
    },
    {
      logo: SOCIAL_ICONS_MAP.twitter,
      name: 'twitter',
      url: socialsInfo.twitter,
    },
    {
      logo: SOCIAL_ICONS_MAP.telegram,
      name: 'telegram',
      url: socialsInfo.telegram,
    },
    {
      logo: SOCIAL_ICONS_MAP.discord,
      name: 'discord',
      url: socialsInfo.discord,
    },
    {
      logo: SOCIAL_ICONS_MAP.github,
      name: 'github',
      url: socialsInfo.github,
    },
  ];

  return (
    <Card h="fit-content">
      <CardBody>
        {/* Token info */}
        <Flex flexDirection="column" gap={4} justifyContent="start">
          <Text textAlign="start" textStyle="body-sm-bold">
            Token summary
          </Text>
          <HStack pl="40px" position="relative" w="100%">
            <Box left={0} position="absolute" top={0}>
              <TokenAvatar
                boxSize="8"
                isLoading={false}
                src={tokenInfo?.tokenLogoFilePreview?.preview}
              />
            </Box>

            <VStack alignItems="start" gap={1} maxWidth="100%">
              <SkeletonText
                isLoaded={!!tokenInfo.tokenName}
                noOfLines={1}
                skeletonHeight="16px"
                width={tokenInfo.tokenName ? '100%' : '100px'}
              >
                <Text textAlign="start" textStyle="body-md">
                  {tokenInfo.tokenName}
                </Text>
              </SkeletonText>
              <SkeletonText
                isLoaded={!!tokenInfo.tokenTicker}
                noOfLines={1}
                skeletonHeight="16px"
                width={tokenInfo.tokenTicker ? '100%' : '45px'}
              >
                <Text opacity={0.4} textAlign="start" textStyle="body-sm" whiteSpace="pre-line">
                  {tokenInfo.tokenTicker}
                </Text>
              </SkeletonText>
            </VStack>
          </HStack>
          {/* Social info */}
          <Grid
            gap={2}
            templateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
          >
            {socialUrlsMap.map(({ logo, name, url }) => {
              const displayUrl = url.length > 42 ? `${url.slice(0, 39)}...` : url;
              return (
                <GridItem colSpan={url.length > 14 ? 2 : 1} key={name} w="100%">
                  {url ?
                    <HStack
                      _hover={{ textDecoration: 'underline' }}
                      as="a"
                      href={generateProfileUrl(url, name)}
                      target="_blank"
                    >
                      <Icon as={logo} />
                      <Text
                        opacity={0.4}
                        textAlign="start"
                        textStyle="body-sm"
                        wordBreak="break-all"
                      >
                        {displayUrl}
                      </Text>
                    </HStack>
                  : <HStack>
                      <Icon as={logo} />
                      <SkeletonText
                        isLoaded={!!url}
                        minW="90px"
                        noOfLines={1}
                        skeletonHeight="16px"
                      >
                        <Text opacity={0.4} textAlign="start" textStyle="body-sm">
                          {displayUrl}
                        </Text>
                      </SkeletonText>
                    </HStack>
                  }
                </GridItem>
              );
            })}
          </Grid>

          <Flex flexDirection={{ base: 'row', lg: 'column' }} gap={{ base: 20, lg: 4 }}>
            {tokenInfo.tokenSupply ?
              <VStack alignItems="start" gap={1} mt={2} textStyle="body-sm">
                <Text opacity={0.4} textAlign="start">
                  Token Supply
                </Text>
                <Text textAlign="start" textStyle="body-sm">
                  {formatNumber({
                    input: tokenInfo.tokenSupply,
                    type: NumberFormatType.TxValuesFormatter,
                  })}
                </Text>
              </VStack>
            : null}
            {launchInfo.tokenAmount ?
              <VStack alignItems="start" gap={1} mt={2} textStyle="body-sm">
                <Text opacity={0.4} textAlign="start">
                  Token for Sale
                </Text>
                <Text textAlign="start" textStyle="body-sm">
                  {formatNumber({
                    input: launchInfo.tokenAmount,
                    type: NumberFormatType.TxValuesFormatter,
                  })}
                </Text>
              </VStack>
            : null}
          </Flex>

          {/* Launch Info */}
          {launchInfo.date ?
            <VStack alignItems="start" gap={1} mt={2} textStyle="body-sm">
              <Text opacity={0.4} textAlign="start">
                Start Date
              </Text>
              <Text textAlign="start" textStyle="body-sm">
                {dayjs(launchInfo.date).format('DD/MM/YYYY - HH:mm')}
              </Text>
            </VStack>
          : null}

          {launchInfo.spotPrice ?
            <VStack alignItems="start" gap={1} mt={2} textStyle="body-sm">
              <Text opacity={0.4} textAlign="start">
                Start Price
              </Text>
              <Text textAlign="start" textStyle="body-sm">
                {launchInfo.spotPrice} SOL
              </Text>
            </VStack>
          : null}
          {launchInfo.startWeight ?
            <VStack alignItems="start" gap={1} mt={2} textStyle="body-sm">
              <Text opacity={0.4} textAlign="start">
                Start Weight
              </Text>
              <Text textAlign="start" textStyle="body-sm">
                {`${launchInfo.startWeight} : ${100 - launchInfo.startWeight}`}
              </Text>
            </VStack>
          : null}
        </Flex>
      </CardBody>
    </Card>
  );
};

export default InfoPanel;
