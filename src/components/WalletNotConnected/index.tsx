import { Box, Card, CardBody, Image, Text, useColorModeValue, VStack } from '@chakra-ui/react';

import { ConnectWalletButton } from '@components/WalletAdapter';

import { LogoBlack, LogoWhite } from '@assets/imges';

const WalletNotConnected = () => {
  const appLogo = useColorModeValue(LogoBlack, LogoWhite);

  return (
    <Card>
      <CardBody>
        <VStack p={8} spacing={6} textAlign="center">
          <Image boxSize={16} src={appLogo} />
          <Text textStyle={{ base: 'subtitle', md: 'h3' }}>Wallet Not Connected</Text>
          <Text opacity={0.6} textStyle={{ base: 'body-xs', md: 'body-sm' }}>
            Please connect your wallet to continue.
          </Text>
          <Box>
            {/* <ActionButton
              action="Connect wallet"
              isLoading={connecting}
              onClick={onConnectWallet}
              variant="solid"
            /> */}
            <ConnectWalletButton variant="solid" showRightIcon />
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default WalletNotConnected;
