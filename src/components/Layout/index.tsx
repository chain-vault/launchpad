import React, { useEffect } from 'react';

import {
  Alert,
  AlertIcon,
  Box,
  CloseButton,
  Grid,
  GridItem,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import { useLocation, useRouterState } from '@tanstack/react-router';
import { ToastContainer } from 'react-toastify';

import CustomDrawer from '@components/Drawer';
import Footer from '@components/Layout/Footer';
import SettingsBody from '@components/TransactionSettings/SettingsBody';
import { isApeInPoolCreationEnabled } from '@constants/config/features';
import { opacify } from '@theme/utils';

import '@assets/css/react-toastify.css';

import Navbar from './Navbar';

import 'react-toastify/dist/ReactToastify.css';

const FooterContainer = styled(Box)`
  position: relative;
  /* height: 230px; */
  text-align: center;

  &:before {
    /* z-index: 1;
    content: '';
    top: -55px;
    left: 0;
    width: 100%;
    height: 100px;
    position: absolute;
    color: white;
    clip-path: ellipse(55% 45% at 50% 50%); */
  }
`;

const Layout = ({ children }: React.PropsWithChildren) => {
  const router = useRouterState();
  const { colorMode } = useColorMode();
  const toastContainerClass = useColorModeValue('toast-container-light', 'toast-container-dark');

  const bgColor = useColorModeValue('brand.secondary.100', 'brand.secondary.900');
  const alertBg = opacify(90, bgColor);

  const { isOpen: isVisible, onClose } = useDisclosure({
    defaultIsOpen: !isApeInPoolCreationEnabled,
  });

  const { isOpen: isSettingsDrawerOpen, onClose: onCloseSettingsDrawer } = useDisclosure();
  // lifiting up state to add blur effect on collapse
  const { isOpen, onToggle } = useDisclosure();
  const { pathname } = useLocation();

  useEffect(() => {
    if (isSettingsDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isSettingsDrawerOpen]);

  useEffect(() => {
    if (isOpen) {
      onToggle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.location.pathname]);
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box
        bgAttachment="fixed"
        bgRepeat="no-repeat"
        bgSize="cover"
        bottom={0}
        left={0}
        position="fixed"
        right={0}
        top={0}
        zIndex={-1}
      />
      <Grid
        templateAreas={`
        "header"
        "main"
        "footer"
      `}
        flex="1"
        templateColumns="1fr"
        templateRows="82px 1fr auto"
      >
        <GridItem area="header" as="header">
          <Navbar isOpen={isOpen} onToggle={onToggle} />
        </GridItem>

        <GridItem
          area="main"
          filter={isOpen ? 'blur(7px)' : 'none'}
          mt={[0, 0, 6]}
          position="relative"
        >
          {isVisible && (
            <Alert
              alignItems="center"
              bg={alertBg}
              borderRadius="md"
              justifyContent="center"
              mb={4}
              status="warning"
              textAlign="center"
              variant="subtle"
            >
              <AlertIcon />
              <Text>New launch token requests are temporarily paused. Stay tuned for updates.</Text>
              <CloseButton ml={6} onClick={onClose} position="relative" />
            </Alert>
          )}

          {children}
        </GridItem>

        <GridItem
          display={
            pathname.indexOf('/fast-launch/swap') === -1 ?
              {}
            : { base: 'none !important', sm: 'grid !important' }
          }
          area="footer"
          as="footer"
          filter={isOpen ? 'blur(7px)' : 'none'}
          mt="100px"
          data-footer
        >
          <FooterContainer
            _before={{
              background: 'surface.base.100',
            }}
            background="surface.base.100"
          >
            <Footer />
          </FooterContainer>
        </GridItem>
      </Grid>
      <ToastContainer
        autoClose={5000}
        className="toast"
        position="bottom-right"
        theme={colorMode}
        toastClassName={`${toastContainerClass}`}
        closeButton
        hideProgressBar
      />
      <CustomDrawer
        isOpen={isSettingsDrawerOpen}
        onClose={onCloseSettingsDrawer}
        title="Settings"
        closeButton
      >
        <SettingsBody isBaseSettings />
      </CustomDrawer>
    </Box>
  );
};

export default Layout;
