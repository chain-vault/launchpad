import { Box, Button, Flex, Text } from '@chakra-ui/react';

import { ConnectWalletButton } from '@components/WalletAdapter';

import { useConnectWallet } from '#hooks/useWalletConnection';

interface FormFooterProps {
  cancelText: string;
  isLoading?: boolean;
  onCancel: () => void;
  submitDisabled?: boolean;
  submitText: string;
}

const FormFooter = ({
  cancelText,
  isLoading,
  onCancel,
  submitDisabled,
  submitText,
}: FormFooterProps) => {
  const { isConnected } = useConnectWallet();
  return (
    <Flex alignItems="center" gap={2} justifyContent="space-between" w="100%">
      <Button minW={{ base: '80px', md: '124px' }} onClick={onCancel} variant="ghost">
        <Text textStyle="body-md">{cancelText}</Text>
      </Button>
      {isConnected ?
        <Button
          isDisabled={submitDisabled}
          isLoading={isLoading}
          minW={{ base: '208px', md: '192px' }}
          type="submit"
          variant="secondary"
        >
          <Text textStyle="body-md">{submitText}</Text>
        </Button>
      : <Box minW={{ base: '208px', md: '192px' }}>
          {/* <ActionButton
            action="Connect wallet"
            isLoading={connecting}
            onClick={onConnectWallet}
            variant="solid"
          /> */}
          <ConnectWalletButton variant="secondary" showRightIcon />
        </Box>
      }
    </Flex>
  );
};

export default FormFooter;
