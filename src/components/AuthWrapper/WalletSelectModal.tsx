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
  Flex,
  Grid,
  GridItem,
  // HStack,
  // Icon,
  Image,
  Link,
  Spinner,
  Text,
  useStyleConfig,
  VStack,
} from '@chakra-ui/react';
import { type WalletName } from '@solana/wallet-adapter-base';
import { useAtom, useAtomValue } from 'jotai';
// import { RxArrowTopRight } from 'react-icons/rx';

import { PhantomWalletName } from '@solana/wallet-adapter-wallets';

import { BasicModal } from '@components/ui/Modals';
import WalletInfoButton from '@components/WalletAdapter/WalletInfoButton';
import { UserAuthenticationStatus, WalletInfoButonActions } from '@constants/index';
import { useAuth } from '@hooks/useAuth';
import { useConnectors } from '@hooks/useConnectors';
import useWalletConnection from '@hooks/useWalletConnection';
import { useWeb3React } from '@hooks/useWeb3React';

import '@assets/css/spinner.css';

const WalletSelectModal = () => {
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
    onEmbeddedWalletReady: () => {
      setIsOpen(false);
    },
  });

  useEffect(() => {
    // connection successfull (in case failed keep the modal open)
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
    // setIsOpen(false);
  };

  const filledButtonStyle = useStyleConfig('Button', { variant: 'filled' });

  const onCloseModal = () => {
    if (userAuthState.authenticationStatus === UserAuthenticationStatus.ACCOUNT_SWITCHED)
      disconnect();
    setIsOpen(false);
  };

  return (
    <BasicModal
      closeButtonDisabled={
        userAuthState.authenticationStatus !== UserAuthenticationStatus.ACCOUNT_SWITCHED
      }
      closeOnOverlayClick={
        userAuthState.authenticationStatus !== UserAuthenticationStatus.ACCOUNT_SWITCHED
      }
      header={
        <>
          {userAuthState.authenticationStatus === UserAuthenticationStatus.CONNECTING_WALLET && (
            <Text textAlign="center" textStyle="h3">
              Connecting Wallet
            </Text>
          )}
          {userAuthState.authenticationStatus === UserAuthenticationStatus.SIGNING_USER && (
            <Text textAlign="center" textStyle="h3">
              Signing
            </Text>
          )}
          {userAuthState.authenticationStatus === UserAuthenticationStatus.NOT_AUTHORIZED && (
            <Text textAlign="center" textStyle="h3">
              Connect Your Wallet
            </Text>
          )}
        </>
      }
      modalBody={
        userAuthState.authenticationStatus === UserAuthenticationStatus.ACCOUNT_SWITCHED ?
          <Flex alignItems="center" direction="column" gap={6} justifyContent="space-between" p={4}>
            <Text textAlign="center" textStyle="body-md-bold">
              Account switched! Time to swing back in—sign again to keep the Apeon vibes going!
            </Text>
            <Button onClick={authenticateUser}>Sign message</Button>
          </Flex>
        : userAuthState.authenticationStatus === UserAuthenticationStatus.SIGNING_USER ?
          <Center flexDirection="column" gap={3}>
            <Flex alignItems="center" justifyContent="center" position="relative" py={14}>
              <Box className="spinner" />
              <Image boxSize={[12, 14]} src={wallet?.adapter.icon} zIndex={100} />
            </Flex>
            <Text textAlign="center" textStyle="body-regular-bold">
              Click sign-in in your wallet to confirm you own this wallet
            </Text>
          </Center>
        : <VStack gap={6}>
            <WalletInfoButton action={WalletInfoButonActions.DISCONNECT_WALLET} />

            <Grid gap={[2, 2, 4]} templateColumns="repeat(3, 1fr)">
              {connectors.map((connector) => {
                const isSelected = isSelectedWallet(connector);
                const downloadUrl = getDownloadUrl(connector);
                return (
                  <GridItem key={connector.meta?.displayName || connector.adapter.name}>
                    <Button
                      _hover={{
                        ...(connecting ?
                          {}
                        : {
                            border: `2px solid`,
                            borderColor: 'brand.accent.600',
                            color: 'brand.accent.600',
                            opacity: 1,
                          }),
                      }}
                      borderColor={
                        isConnected && isSelected ? 'brand.accent.600' : (
                          `${filledButtonStyle.borderColor}`
                        )
                      }
                      onClick={() =>
                        onConnectWallet(
                          connector.adapter.name,
                          connector.meta?.id === PhantomWalletName
                        )
                      }
                      borderRadius="2xl"
                      color={isSelected ? 'brand.accent.600' : `${filledButtonStyle.color}`}
                      filter={connecting && !isSelected ? 'blur(4px)' : undefined}
                      h={{ base: '72px', md: '92px' }}
                      isDisabled={connecting && !isSelected}
                      position="relative"
                      variant="filled"
                      w={{ base: '92px', md: '112px' }}
                    >
                      {downloadUrl && (
                        <Link
                          display="block"
                          href={downloadUrl}
                          inset={0}
                          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}
                          position="absolute"
                          target="_blank"
                          zIndex={1}
                        />
                      )}
                      {connecting && isSelected && (
                        <Flex
                          alignItems="center"
                          border="2px solid"
                          // borderColor="white"
                          borderRadius="2xl"
                          bottom="0"
                          justifyContent="center"
                          left="0"
                          position="absolute"
                          right="0"
                          top="0"
                          zIndex="10"
                        >
                          <Spinner mb={5} size={['sm', 'sm', 'md']} />
                        </Flex>
                      )}

                      <Flex
                        alignItems="center"
                        flexDirection="column"
                        gap={2}
                        justifyContent="space-between"
                      >
                        <Image
                          boxSize={[6, 6, 8]}
                          filter={connecting && isSelected ? 'blur(4px)' : undefined}
                          opacity={connecting && isSelected ? 0.3 : 1}
                          src={connector.meta?.logoUrl || connector.adapter.icon}
                        />
                        <Text textStyle="body-xs">
                          {connector.meta?.displayName || connector.adapter.name}
                        </Text>
                      </Flex>
                    </Button>
                  </GridItem>
                );
              })}
            </Grid>
          </VStack>

      }
      isOpen={isOpen}
      modalBodyProps={{ pb: 5 }}
      modalContentProps={{ bg: 'surface.base.600' }}
      onClose={onCloseModal}
      size={{ base: 'xs', md: 'md' }}
      isCentered
    />
  );
};

export default WalletSelectModal;
