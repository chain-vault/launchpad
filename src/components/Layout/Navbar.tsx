import { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Center,
  chakra,
  Collapse,
  Container,
  Flex,
  Grid,
  GridItem,
  Icon,
  IconButton,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import { Link, useLocation } from '@tanstack/react-router';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import { IoSettings } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';

import SocialsListing from '@components/SocialsListing';
import { ActionButton } from '@components/ui/Button';
// import { ActionButton } from '@components/ui/Button';
import { ConnectWalletButton } from '@components/WalletAdapter';
import WalletInfoButton from '@components/WalletAdapter/WalletInfoButton';
import { isApeInPoolCreationEnabled } from '@constants/config/features';
import { NAVBAR_SOCIAL_ICONS, WalletInfoButonActions } from '@constants/index';
// import createPathConstants from '@constants/routes';
import useResponsiveValue from '@hooks/useResponsiveValue';
import { useWeb3React } from '@hooks/useWeb3React';

import { AppLogoMobile } from '@assets/imges';
import AppLogo from '@assets/imges/app-logo.svg';

const ChakraLink = chakra(Link);

const StyledFlex = styled(Flex)`
  font-size: 16px;
  align-items: center;
  border-radius: 42px;
  gap: 1.25rem;
  justify-content: space-between;
  padding: 0.625rem 1.25rem;

  ${({ theme }) => `
    @media (max-width: ${theme.breakpoints.lg}) {
      font-size: 32px;
      justify-content: center;
      flex-direction: column;
      margin-top: 24px;
    }
    @media (max-width: ${theme.breakpoints.md}) {
      font-size: 24px;
    }
  `}
`;

// Redo whole file
export const NavMenu = ({ isConnected, user }: { isConnected: boolean; user: string }) => {
  // const pathConstants = useMemo(() => createPathConstants(), []);
  const isSmallDevice = useResponsiveValue({ base: true, lg: false });

  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      gap={12}
      h="100%"
      justifyContent={{ base: 'unset', md: 'space-between' }}
      pb={isSmallDevice ? 8 : 0}
    >
      <StyledFlex bg={isSmallDevice ? 'none' : 'surface.base.500'}>
        {/* {Object.values(pathConstants).map(({ isDisabled, isExternal, label, url }) => (
          <Link
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
                textStyle={{ base: 'h2', lg: 'body-md-semibold' }}
              >
                {label}
              </Text>
            )}
          </Link>
        ))} */}
      </StyledFlex>

      {isSmallDevice ?
        <Flex flexDirection="column" gap={2}>
          {isConnected && (
            <Center>
              <VStack gap={4}>
                <ChakraLink mx="auto" to="/fast-launch/create" w={{ base: '100%', md: '228px' }}>
                  <ActionButton
                    action="Launch your token"
                    isDisabled={!isApeInPoolCreationEnabled}
                    px={4}
                    variant="accent"
                    w="100%"
                  />
                </ChakraLink>

                <ChakraLink mx="auto" to="/launches/pump" w={{ base: '100%', md: '228px' }}>
                  <ActionButton action="View all launches" px={4} variant="outline-ape" w="100%" />
                </ChakraLink>
                <Link search={{ user, view: 'pump' }} to="/profile">
                  {({ isActive }) => (
                    <Button
                      color={isActive ? 'brand.accent.600' : 'inherit'}
                      size="md"
                      variant="ghost-invariant"
                      w="150px"
                    >
                      Profile
                    </Button>
                  )}
                </Link>
              </VStack>
            </Center>
          )}
          <Center>
            <SocialsListing
              _hover={{ bg: 'brand.accent.600', transition: '0.1s ease-in' }}
              socialsList={NAVBAR_SOCIAL_ICONS}
            />
          </Center>
        </Flex>
      : null}
    </Flex>
  );
};

const Navbar = ({
  isOpen,
  onOpenSettingsDrawer,
  onToggle,
}: {
  isOpen: boolean;
  onOpenSettingsDrawer: () => void;
  onToggle: () => void;
}) => {
  const { isConnected, publicKey } = useWeb3React();
  const location = useLocation();

  const isMobile = useResponsiveValue({ base: true, md: false });
  const isTab = useResponsiveValue({ base: false, lg: false, md: true });
  const isHomePage = location.pathname === '/';
  const [opacity, setOpacity] = useState(isHomePage ? 0 : 1);

  useEffect(() => {
    const handleScroll = () => {
      if (!isHomePage) {
        return;
      }
      const targetHeight = (window.innerHeight / 100) * 30; // 30vh
      const targetOpacity = window.pageYOffset / targetHeight;
      setOpacity(targetOpacity);
    };
    if (!isHomePage) {
      setOpacity(1);
    } else {
      setOpacity(0);
    }

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHomePage]);

  useEffect(() => {
    const onResizeHandler = () => {
      if (isOpen) {
        onToggle();
      }
    };
    window.addEventListener('resize', onResizeHandler);
    return () => {
      window.removeEventListener('resize', onResizeHandler);
    };
  }, [isOpen, onToggle]);

  return (
    <Box
      _after={{
        bg: 'background.header',
        content: "''",
        display: !isOpen ? 'block' : 'none',
        height: 'calc(100% + 10px)',
        left: 0,
        opacity,
        position: 'absolute',
        right: 0,
        top: 0,
        transitionDuration: '.2s',
      }}
      _dark={{
        bg:
          isMobile || isTab ?
            isOpen ? 'base.900'
            : ''
          : '',
      }}
      bg={
        isMobile || isTab ?
          isOpen ?
            'base.100'
          : ''
        : ''
      }
      borderBottomRadius={
        isMobile || isTab ?
          isOpen ?
            '30px'
          : '0px'
        : '0px'
      }
      left={0}
      position="fixed"
      top={0}
      w="100%"
      zIndex={1000}
    >
      <Container
        maxW={{
          '2xl': '1600px',
          lg: '1400px',
          md: '1200px',
          sm: '100%',
          xl: '1500px',
        }}
        p={0}
        w="100%"
      >
        <Flex
          alignItems="center"
          justifyContent="space-between"
          pos="relative"
          px={{ base: '5', lg: '10' }}
          py={{ base: '5', lg: '5' }}
          zIndex={2}
        >
          <Grid
            alignItems="center"
            flex={1}
            gap={12}
            // gridTemplateColumns={{ base: '', lg: '1fr 1fr' }}
          >
            <GridItem>
              <Flex>
                <Link to="/">
                  {isMobile ?
                    <Image
                      _hover={{ opacity: '0.7', transition: '0.2s ease-in' }}
                      alt="App Logo"
                      src={AppLogoMobile}
                      w="35px"
                    />
                  : <Image
                      _hover={{ opacity: '0.7', transition: '0.2s ease-in' }}
                      alt="App Logo"
                      src={AppLogo}
                      w="120px"
                    />
                  }
                </Link>
              </Flex>
            </GridItem>
            {/* <GridItem display={{ base: 'none', lg: 'flex', md: 'none' }}>
            <NavMenu isConnected={isConnected} user={publicKey?.toString() ?? ''} />
          </GridItem> */}
          </Grid>
          {!isMobile && location.pathname !== '/' && (
            <Grid display={['none', 'none', 'none', 'grid']}>
              <Flex gap={4}>
                {location.pathname !== '/fast-launch/create' && (
                  <ChakraLink mx="auto" to="/fast-launch/create" w={{ base: '100%', md: '200px' }}>
                    <ActionButton
                      action="Launch your token"
                      isDisabled={!isApeInPoolCreationEnabled}
                      px={4}
                      variant="accent"
                      w="100%"
                    />
                  </ChakraLink>
                )}

                {location.pathname !== '/launches/pump' && (
                  <ChakraLink mx="auto" to="/launches/pump" w={{ base: '100%', md: '200px' }}>
                    <ActionButton
                      action="View all launches"
                      px={4}
                      variant="outline-ape"
                      w="100%"
                    />
                  </ChakraLink>
                )}
              </Flex>
            </Grid>
          )}
          <Grid
            templateColumns={
              isConnected ?
                { base: '1fr', lg: '1fr 0.4fr 0.4fr 1fr 0.1fr', md: '0.2fr 0.2fr 1fr' }
              : { base: '1fr', lg: '2fr 1fr 1fr 0.2fr', md: '0.2fr 0.2fr 1fr' }
            }
            alignItems="center"
            display={{ base: 'none', md: 'grid' }}
            flex={1}
            gap={1.5}
          >
            <GridItem order={1} />
            {isConnected && (
              <GridItem
                alignItems="center"
                display={{ base: 'none', lg: 'grid' }}
                justifyContent="center"
                order={2}
              >
                <Link search={{ user: publicKey?.toString() ?? '', view: 'pump' }} to="/profile">
                  {({ isActive }) => (
                    <Button
                      color={isActive ? 'brand.accent.600' : 'inherit'}
                      size="sm"
                      variant="ghost-invariant"
                    >
                      Profile
                    </Button>
                  )}
                </Link>
              </GridItem>
            )}
            <GridItem
              alignSelf="center"
              display={{ base: 'none', lg: 'grid' }}
              justifyContent="flex-end"
              order={3}
            >
              <SocialsListing
                _hover={{ bg: 'brand.accent.600', transition: '0.1s ease-in' }}
                size="sm"
                socialsList={NAVBAR_SOCIAL_ICONS}
                variant="ghost-invariant"
              />
            </GridItem>

            <GridItem order={{ base: 4, lg: 4, md: 3 }}>
              {isConnected ?
                <WalletInfoButton action={WalletInfoButonActions.OPEN_WALLET_MODAL} />
              : <ConnectWalletButton size={{ base: 'xs', md: 'sm' }} />}
            </GridItem>
            <GridItem order={{ base: 5, lg: 4, md: 2 }}>
              {/* <TransactionSettings isBaseSettings /> */}
              <IconButton
                _hover={{ color: 'brand.accent.600', transition: '0.1s ease-in' }}
                aria-label="theme-button"
                color="surface.base.900"
                icon={<Icon as={IoSettings} boxSize={5} />}
                onClick={onOpenSettingsDrawer}
                size="md"
                variant="unstyled"
              />
            </GridItem>
          </Grid>

          {/* Mobile toggle button */}
          <Flex alignItems="center" display={{ base: 'flex', lg: 'none', md: 'flex' }} gap={1}>
            {isMobile ?
              isConnected ?
                <WalletInfoButton
                  action={WalletInfoButonActions.OPEN_WALLET_MODAL}
                  showAddress={false}
                />
              : <ConnectWalletButton size={{ base: 'sm', md: 'sm' }} />
            : null}
            <IconButton
              _hover={{ color: 'brand.accent.600', transition: '0.1s ease-in' }}
              aria-label="theme-button"
              color="surface.base.900"
              icon={<Icon as={IoSettings} boxSize={5} />}
              onClick={onOpenSettingsDrawer}
              size="md"
              variant="unstyled"
            />
            <IconButton
              icon={
                isOpen ?
                  <Icon as={RxCross2} fontSize={[16, 16, 24]} />
                : <Icon as={HiOutlineMenuAlt2} fontSize={[16, 16, 24]} />
              }
              _hover={{ bg: 'brand.accent.600', transition: '0.1s ease-in' }}
              aria-label="Toggle Navigation"
              bg="surface.base.900"
              color="surface.base.200"
              onClick={onToggle}
              size={['sm', 'sm', 'sm', 'md']}
            />
          </Flex>
        </Flex>
      </Container>
      <Collapse in={isOpen} animateOpacity>
        <Box>
          <NavMenu isConnected={isConnected} user={publicKey?.toString() ?? ''} />
          {isMobile ?
            <VStack gap={10} mb={10}>
              <Text opacity="0.5" textStyle="body-regular">
                © 2024 ApeOn, All Rights Reserved
              </Text>
            </VStack>
          : null}
        </Box>
      </Collapse>
      <Box position="relative">
        <IconButton
          _hover={{ bg: 'brand.accent.600', transition: '0.1s ease-in' }}
          aria-label="Toggle Navigation"
          bg="surface.base.900"
          bottom={[-14, -14]}
          color="surface.base.200"
          display={isOpen ? 'block' : 'none'}
          icon={<Icon as={RxCross2} fontSize={[16, 16, 24]} />}
          left="50%"
          onClick={onToggle}
          position="absolute"
          size={['sm', 'sm', 'sm', 'md']}
          transform="translate(-50%, -50%)"
        />
      </Box>
    </Box>
  );
};

export default Navbar;
