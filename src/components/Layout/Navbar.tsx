import { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Link as ChakraLink,
  Collapse,
  Container,
  Divider,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Link, useLocation } from '@tanstack/react-router';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import { RxCross2 } from 'react-icons/rx';

// import { ActionButton } from '@components/ui/Button';
import { ConnectWalletButton } from '@components/WalletAdapter';
import WalletInfoButton from '@components/WalletAdapter/WalletInfoButton';
import { WalletInfoButonActions } from '@constants/index';
// import createPathConstants from '@constants/routes';
import useResponsiveValue from '@hooks/useResponsiveValue';
import { useWeb3React } from '@hooks/useWeb3React';

import { AppLogoMobile, BlockBeastLogo } from '@assets/imges';

// Redo whole file
// export const NavMenu = ({ isConnected, user }: { isConnected: boolean; user: string }) => {
//   // const pathConstants = useMemo(() => createPathConstants(), []);
//   const isSmallDevice = useResponsiveValue({ base: true, lg: false });

//   return (
//     <Flex
//       alignItems="center"
//       flexDirection="column"
//       gap={12}
//       h="100%"
//       justifyContent={{ base: 'unset', md: 'space-between' }}
//       pb={isSmallDevice ? 8 : 0}
//     >
//       <StyledFlex bg={isSmallDevice ? 'none' : 'surface.base.500'}>
//         {/* {Object.values(pathConstants).map(({ isDisabled, isExternal, label, url }) => (
//           <Link
//             disabled={isDisabled}
//             key={label}
//             rel={isExternal ? 'noopener noreferrer' : undefined}
//             target={isExternal ? '_blank' : '_self'}
//             to={`${url}`}
//           >
//             {({ isActive }) => (
//               <Text
//                 _hover={
//                   !isDisabled ?
//                     { color: 'brand.accent.600', transition: '0.1s ease-in' }
//                   : undefined
//                 }
//                 color={isActive ? 'brand.accent.600' : ''}
//                 cursor={isDisabled ? 'not-allowed' : 'pointer'}
//                 opacity={isDisabled ? 0.4 : 1}
//                 textStyle={{ base: 'h2', lg: 'body-md-semibold' }}
//               >
//                 {label}
//               </Text>
//             )}
//           </Link>
//         ))} */}
//       </StyledFlex>

//       {isSmallDevice ?
//         <Flex flexDirection="column" gap={2}>
//           {isConnected && (
//             <Center>
//               <VStack gap={4}>
//                 <ChakraLink mx="auto" to="/fast-launch/create" w={{ base: '100%', md: '228px' }}>
//                   <ActionButton
//                     action="Launch your token"
//                     isDisabled={!isApeInPoolCreationEnabled}
//                     px={4}
//                     variant="accent"
//                     w="100%"
//                   />
//                 </ChakraLink>

//                 <ChakraLink mx="auto" to="/launches/pump" w={{ base: '100%', md: '228px' }}>
//                   <ActionButton action="View all launches" px={4} variant="outline-ape" w="100%" />
//                 </ChakraLink>
//                 <Link search={{ user, view: 'pump' }} to="/profile">
//                   {({ isActive }) => (
//                     <Button
//                       color={isActive ? 'brand.accent.600' : 'inherit'}
//                       size="md"
//                       variant="ghost-invariant"
//                       w="150px"
//                     >
//                       Profile
//                     </Button>
//                   )}
//                 </Link>
//               </VStack>
//             </Center>
//           )}
//           <Center>
//             <SocialsListing
//               _hover={{ bg: 'brand.accent.600', transition: '0.1s ease-in' }}
//               socialsList={NAVBAR_SOCIAL_ICONS}
//             />
//           </Center>
//         </Flex>
//       : null}
//     </Flex>
//   );
// };

const Navbar = ({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) => {
  const { isConnected } = useWeb3React();
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
      bgColor="brand.accent.900"
      left={0}
      position="fixed"
      py={4}
      shadow="0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
      top={0}
      w="100%"
      zIndex={1000}
    >
      <Container maxW="container.xl">
        <Flex align="center" justify="space-between">
          {/* Logo and Navigation */}
          <HStack spacing={8}>
            <HStack spacing={2}>
              <Link to="/">
                <Image
                  alt="Launchpad Logo Mobile"
                  display={{ base: 'block', md: 'none' }}
                  height="42px"
                  src={AppLogoMobile}
                  width="auto"
                />

                <Image
                  alt="Launchpad Logo"
                  display={{ base: 'none', md: 'block' }}
                  height="42px"
                  src={BlockBeastLogo}
                  width="auto"
                />
              </Link>
            </HStack>
            <HStack display={{ base: 'none', md: 'flex' }} spacing={6}>
              <ChakraLink
                _hover={{ color: 'green.200', transition: '0.2s ease-in-out' }}
                color="green.100"
                fontSize="md"
                fontWeight="medium"
                href="/"
              >
                Market
              </ChakraLink>

              <ChakraLink
                _hover={{ color: 'green.200', transition: '0.2s ease-in-out' }}
                color="green.100"
                fontSize="md"
                fontWeight="medium"
                href={import.meta.env.VITE_BLOCKBEAST_URL}
                isExternal
              >
                Beasts
              </ChakraLink>
            </HStack>
          </HStack>

          {/* Action Buttons */}
          <HStack display={{ base: 'none', md: 'flex' }} spacing={4}>
            <Link to="/fast-launch/create">
              <Button
                _hover={{ bg: 'green.200' }}
                bg="green.100"
                color="gray.800"
                px={6}
                size="md"
                width="100%"
              >
                Launch AI Token
              </Button>
            </Link>

            {isConnected ?
              <WalletInfoButton action={WalletInfoButonActions.OPEN_WALLET_MODAL} />
            : <ConnectWalletButton _hover={{ bg: 'blue.500' }} bg="blue.400" width="80%" />}
          </HStack>
          <Flex alignItems="center" display={{ base: 'flex', lg: 'none', md: 'flex' }} gap={1}>
            {isMobile ?
              isConnected ?
                <WalletInfoButton action={WalletInfoButonActions.OPEN_WALLET_MODAL} />
              : <ConnectWalletButton _hover={{ bg: 'blue.500' }} bg="blue.400" width="80%" />
            : null}

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
        <Divider mt={4} />
        <Box pt={6}>
          <VStack spacing={6}>
            <ChakraLink
              _hover={{ color: 'green.200', transition: '0.2s ease-in-out' }}
              color="green.100"
              fontSize="md"
              fontWeight="medium"
              href="/"
            >
              Market
            </ChakraLink>

            <ChakraLink
              _hover={{ color: 'green.200', transition: '0.2s ease-in-out' }}
              color="green.100"
              fontSize="md"
              fontWeight="medium"
              href={import.meta.env.VITE_BLOCKBEAST_URL}
              isExternal
            >
              Beasts
            </ChakraLink>

            <Link to="/fast-launch/create">
              <Button
                _hover={{ bg: 'green.200' }}
                bg="green.100"
                color="gray.800"
                px={6}
                size="md"
                width="100%"
              >
                Launch AI Token
              </Button>
            </Link>
          </VStack>
          {isMobile ?
            <VStack gap={10} mb={10} mt={10}>
              <Text opacity="0.5" textStyle="body-regular">
                © 2025 blockbeast.ai, All Rights Reserved
              </Text>
            </VStack>
          : null}
        </Box>
      </Collapse>
    </Box>
  );
};

export default Navbar;
