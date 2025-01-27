import { useMemo } from 'react';

import { Box, Link as ChakraLink, Flex, Image, Text } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';

import SocialsListing from '@components/SocialsListing';
import { NAVBAR_SOCIAL_ICONS } from '@constants/index';
import createPathConstants from '@constants/routes';

import AppLogo from '@assets//imges/block-beast-logo.svg';

const Footer = () => {
  const pathConstants = useMemo(() => createPathConstants(), []);

  return (
    <Flex
      alignItems="center"
      bg="#13192C"
      flexDirection="column"
      gap={3}
      height="100%"
      justifyContent="space-between"
      w="100%"
    >
      <Flex alignItems="center" flexDirection="column" gap={2}>
        <Link to="/">
          <Image
            _hover={{ opacity: '0.7', transition: '0.2s ease-in' }}
            alt="App Logo"
            src={AppLogo}
            w={28}
          />
        </Link>
        <SocialsListing
          _hover={{ bg: 'brand.accent.900', transition: '0.1s ease-in' }}
          bgColor="rgb(255 255 255 / 5%)"
          socialsList={NAVBAR_SOCIAL_ICONS}
        />
        <Box textAlign="center">
          {Object.values(pathConstants).map(({ isDisabled, isExternal, label, url }) => (
            <Link
              style={{
                display: label === 'LBP' ? 'none' : 'inline-block',
                marginLeft: 15,
                marginRight: 15,
              }}
              disabled={isDisabled}
              key={label}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              target={isExternal ? '_blank' : '_self'}
              to={`${url}`}
            >
              {({ isActive }) => (
                <Text
                  _hover={
                    !isDisabled ?
                      { color: 'brand.accent.600', transition: '0.1s ease-in' }
                    : undefined
                  }
                  color={isActive ? 'brand.accent.600' : ''}
                  cursor={isDisabled ? 'not-allowed' : 'pointer'}
                  opacity={isDisabled ? 0.4 : 1}
                  textStyle="body-md"
                >
                  {label}
                </Text>
              )}
            </Link>
          ))}
        </Box>
      </Flex>
      <Flex direction="column" gap={2} mb={6}>
        <Flex alignItems="center" direction="row" gap={2} justifyContent="center">
          <Flex alignItems="center" gap={1} justifyContent="center">
            <Text opacity="0.5" textStyle="body-regular">
              Charts powered by{' '}
            </Text>
            <ChakraLink color="blue.500" href="https://www.tradingview.com/" isExternal>
              Tradingview
            </ChakraLink>
          </Flex>
          <Box>
            <Text>|</Text>
          </Box>
          <Flex alignItems="center" gap={1} justifyContent="center">
            <Text opacity="0.5" textStyle="body-regular">
              Trades powered by{' '}
            </Text>
            <ChakraLink color="blue.500" href="https://www.apeon.it/" isExternal>
              Apeon
            </ChakraLink>
          </Flex>
          <Box>
            <Text>|</Text>
          </Box>
          <Text opacity="0.5" textStyle="body-regular">
            Version: {import.meta.env.VITE_APP_VERSION.substring(0, 6)}
          </Text>
        </Flex>
        <Text opacity="0.5" textStyle="body-regular">
          © 2025 blackbest.ai, All Rights Reserved
        </Text>
      </Flex>
    </Flex>
  );
};

export default Footer;
