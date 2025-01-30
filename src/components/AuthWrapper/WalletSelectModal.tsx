import { useEffect, useState } from 'react';

import {
  confettiAtom,
  lastSelectedWallet,
  updateAuthStatusAtom,
  userAuthAtom,
  userAuthTokenWriteAtom,
  walletConnectModalAtom,
} from '@atoms/index';
import {
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  GridItem,
  Image,
  Link,
  Spinner,
  Text,
  useStyleConfig,
  VStack,
} from '@chakra-ui/react';
import { type WalletName } from '@solana/wallet-adapter-base';
import { PhantomWalletName } from '@solana/wallet-adapter-wallets';
import { useAtom, useAtomValue } from 'jotai';

import WalletInfoButton from '@components/WalletAdapter/WalletInfoButton';
import { UserAuthenticationStatus, WalletInfoButonActions } from '@constants/index';
import { useAuth } from '@hooks/useAuth';
import { useConnectors } from '@hooks/useConnectors';
import useWalletConnection from '@hooks/useWalletConnection';
import { useWeb3React } from '@hooks/useWeb3React';

import '@assets/css/spinner.css';

const WalletSelectDrawer = () => {
  const [selectedWallet, setSelectedWallet] = useState<WalletName>();
  const [userConnecting, setUserConnecting] = useState<boolean>(false);
  const { conectWallet, connecting, disconnect, isConnected } = useWalletConnection();
  const { authenticateUser } = useAuth();
  const { wallet } = useWeb3React();
  const [isOpen, setIsOpen] = useAtom(walletConnectModalAtom);
  const userAuthState = useAtomValue(userAuthAtom);
  const [confettiState, setConfettiState] = useAtom(confettiAtom);
  const [, setUserAuthToken] = useAtom(userAuthTokenWriteAtom);
  const [, setAuthStatus] = useAtom(updateAuthStatusAtom);
  const [connectStartTime, setConnectStartTime] = useState<null | number>(null);
  const [, updateSelectedWallet] = useAtom(lastSelectedWallet);
  const { connectors, getDownloadUrl, isSelectedWallet } = useConnectors({
    onEmbeddedWalletReady: () => setIsOpen(false),
  });

  useEffect(() => {
    if (
      isConnected &&
      userConnecting &&
      userAuthState.authenticationStatus === UserAuthenticationStatus.USER_AUTHENTICATED &&
      !connecting
    ) {
      setUserConnecting(false);
      setConfettiState({ ...confettiState, isConfettiActive: true });
      if (connectStartTime !== null) {
        const elapsedTime = Date.now() - connectStartTime;
        setConfettiState({ ...confettiState, interval: elapsedTime });
      }
    }
  }, [
    confettiState,
    connectStartTime,
    connecting,
    isConnected,
    selectedWallet,
    setConfettiState,
    userAuthState,
    userConnecting,
  ]);

  const onConnectWallet = (walletName: WalletName, isPhantomExtension: boolean = false) => {
    if (connecting) return;
    if (
      wallet?.adapter.name === walletName &&
      userAuthState.authenticationStatus === UserAuthenticationStatus.USER_AUTHENTICATED
    ) {
      return;
    }
    setUserAuthToken('');
    setAuthStatus({ authenticationStatus: UserAuthenticationStatus.CONNECTING_WALLET });
    setUserConnecting(true);
    setSelectedWallet(walletName);
    setConnectStartTime(Date.now());
    conectWallet(walletName);
    updateSelectedWallet({
      isEmbededPhantom: isPhantomExtension,
      name: walletName as string,
    });
  };

  const filledButtonStyle = useStyleConfig('Button', { variant: 'filled' });

  const onCloseDrawer = () => {
    if (userAuthState.authenticationStatus === UserAuthenticationStatus.ACCOUNT_SWITCHED) {
      disconnect();
    }
    setIsOpen(false);
  };

  return (
    <Drawer
      closeOnEsc={false} // Prevents closing with Esc key
      isOpen={isOpen}
      onClose={onCloseDrawer}
      placement="right"
      size={{ base: 'xs', md: 'md' }}
      closeOnOverlayClick // Prevents closing when clicking outside
    >
      <DrawerOverlay />
      <DrawerContent bg="surface.base.600">
        <DrawerHeader textAlign="left">
          <Flex alignItems="center" direction="row" justifyContent="space-between">
            <Flex direction="column">
              {userAuthState.authenticationStatus === UserAuthenticationStatus.CONNECTING_WALLET ?
                'Connecting Wallet'
              : userAuthState.authenticationStatus === UserAuthenticationStatus.SIGNING_USER ?
                'Signing'
              : 'Connect Your Wallet'}
              <Text textStyle="body-regular">You need to connect to a Solana wallet.</Text>
            </Flex>
            <Button onClick={onCloseDrawer} variant="outline">
              Close
            </Button>
          </Flex>
        </DrawerHeader>

        <DrawerBody>
          {userAuthState.authenticationStatus === UserAuthenticationStatus.ACCOUNT_SWITCHED ?
            <Flex alignItems="center" direction="column" gap={6} p={4}>
              <Text textAlign="center" textStyle="body-md-bold">
                Account switched! Time to swing back in—sign again to keep the Apeon vibes going!
              </Text>
              <Button onClick={authenticateUser}>Sign message</Button>
            </Flex>
          : userAuthState.authenticationStatus === UserAuthenticationStatus.SIGNING_USER ?
            <Center flexDirection="column" gap={3}>
              <Flex
                alignItems="center"
                gap={2}
                justifyContent="center"
                position="relative"
                py={14}
              >
                <Box className="spinner" />
                <Image boxSize={[12, 14]} src={wallet?.adapter.icon} zIndex={100} />
              </Flex>
              <Text textAlign="center" textStyle="body-regular-bold">
                Click sign-in in your wallet to confirm you own this wallet
              </Text>
            </Center>
          : <VStack gap={6}>
              <WalletInfoButton action={WalletInfoButonActions.DISCONNECT_WALLET} />
              <Grid gap={[2, 2, 4]} templateColumns="repeat(2, 1fr)">
                {connectors.map((connector) => {
                  const isSelected = isSelectedWallet(connector);
                  const downloadUrl = getDownloadUrl(connector);
                  return (
                    <GridItem key={connector.meta?.displayName || connector.adapter.name}>
                      <Button
                        _hover={
                          connecting ?
                            {}
                          : {
                              border: '2px solid',
                              borderColor: 'brand.accent.600',
                              color: 'brand.accent.600',
                              opacity: 1,
                            }
                        }
                        borderColor={
                          isConnected && isSelected ? 'brand.accent.600' : (
                            filledButtonStyle.borderColor
                          )
                        }
                        onClick={() =>
                          onConnectWallet(
                            connector.adapter.name,
                            connector.meta?.id === PhantomWalletName
                          )
                        }
                        borderRadius="2xl"
                        color={isSelected ? 'brand.accent.600' : filledButtonStyle.color}
                        filter={connecting && !isSelected ? 'blur(4px)' : undefined}
                        gap={3}
                        h={{ base: '58px', md: '60px' }}
                        isDisabled={connecting && !isSelected}
                        justifyContent="flex-start"
                        position="relative"
                        variant="filled"
                        w={{ base: '92px', md: '100%' }}
                      >
                        {downloadUrl && (
                          <Link
                            display="block"
                            href={downloadUrl}
                            inset={0}
                            onClick={(e) => e.stopPropagation()}
                            position="absolute"
                            target="_blank"
                            zIndex={1}
                          />
                        )}
                        <Image
                          boxSize={[6, 6, 8]}
                          src={connector.meta?.logoUrl || connector.adapter.icon}
                        />
                        <Text textStyle="body-lg">
                          {connector.meta?.displayName || connector.adapter.name}
                        </Text>
                      </Button>
                    </GridItem>
                  );
                })}
              </Grid>
            </VStack>
          }
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default WalletSelectDrawer;
