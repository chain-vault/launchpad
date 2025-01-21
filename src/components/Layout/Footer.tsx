import { useMemo } from 'react';

import { Box, Link as ChakraLink, Flex, Image, Text } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';

import SocialsListing from '@components/SocialsListing';
import { NAVBAR_SOCIAL_ICONS } from '@constants/index';
import createPathConstants from '@constants/routes';

import AppLogo from '@assets/imges/app-logo.svg';

const Footer = () => {
  const pathConstants = useMemo(() => createPathConstants(), []);

  return (
    <Flex
      alignItems="center"
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
          _hover={{ bg: 'brand.accent.600', transition: '0.1s ease-in' }}
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
        <Text opacity="0.5" textStyle="body-regular">
          Version: {import.meta.env.VITE_APP_VERSION.substring(0, 6)}
        </Text>
        <Flex alignItems="center" gap={1} justifyContent="center">
          <Text opacity="0.5" textStyle="body-regular">
            Charts powered by{' '}
          </Text>
          <ChakraLink color="blue.500" href="https://www.tradingview.com/" isExternal>
            Tradingview
          </ChakraLink>
        </Flex>
        <Text opacity="0.5" textStyle="body-regular">
          © 2024 ApeOn, All Rights Reserved
        </Text>
      </Flex>
    </Flex>
  );
};

export default Footer;
