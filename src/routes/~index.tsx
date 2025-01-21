import { Container, Flex, Image, Text } from '@chakra-ui/react';
import { createFileRoute } from '@tanstack/react-router';

import ApeX from '@components/Banner/ApeX';
import { LaunchTypeIcon } from '@components/LaunchTypeIcon';
import { LinkButton } from '@components/LinkButton';
import { CurveIndex } from '@constants/config';
import { isApeInPoolCreationEnabled } from '@constants/config/features';
import useResponsiveValue from '@hooks/useResponsiveValue';

import PeeledBanana from '@assets/imges/banana-peeled.png';

export const Route = createFileRoute('/')({
  component: function Render() {
    const isMobile = useResponsiveValue({ base: true, md: false });
    return (
      <>
        <Container textAlign="center">
          <Flex alignItems="center" direction="column" justifyContent="center">
            <Flex alignItems="center" justifyContent="center">
              <Flex boxSize="40px">
                <LaunchTypeIcon boxSize="40px" type={CurveIndex.NANO_LAUNCH} />
              </Flex>
              <Flex mx={3}>
                <Text textStyle="h2">Ape In</Text>
              </Flex>
              <Flex boxSize="40px">
                <LaunchTypeIcon boxSize="40px" type={CurveIndex.PRIME_LAUNCH} />
              </Flex>
            </Flex>
            <Flex direction="column" mb={6} mt={5}>
              <Text>
                Ready to go bananas?{' '}
                <Image
                  alt="Apen in"
                  display="inline-block"
                  src={PeeledBanana}
                  transform="rotateY(180deg)"
                  verticalAlign="middle"
                  w={22}
                />{' '}
                Create your tokens in seconds
              </Text>
              <Text>and launch instantly.</Text>
            </Flex>
            <Flex>
              <LinkButton
                align="left"
                height={43}
                label={`Launch${!isMobile ? ' your' : ''} token`}
                link={!isApeInPoolCreationEnabled ? '#' : '/fast-launch/create'}
                maxWidth={210}
                mr={2}
                size="small"
                variant="accent"
              />
              <LinkButton
                align="left"
                height={43}
                label="Explore"
                link="/launches/pump"
                maxWidth={210}
                size="small"
                variant="outline-ape"
              />
            </Flex>
          </Flex>
        </Container>
        <ApeX />
      </>
    );
  },
});
