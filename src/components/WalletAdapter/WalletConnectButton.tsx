import { Button, Icon, type IconButtonProps } from '@chakra-ui/react';
import { MdArrowOutward } from 'react-icons/md';

import { useConnectWallet } from '@hooks/useWalletConnection';

interface ConnectWalletButtonProps extends Partial<IconButtonProps> {
  showRightIcon?: boolean;
}

const ConnectWalletButton = ({
  showRightIcon = false,
  variant,
  ...props
}: ConnectWalletButtonProps) => {
  const { connecting, onConnectWallet } = useConnectWallet();

  return (
    <Button
      disabled={connecting}
      onClick={onConnectWallet}
      size={props.size ? props.size : ['sm', 'sm', 'md']}
      variant={variant || 'solid'}
      width="100%"
      {...props}
    >
      {connecting ? 'Connecting...' : 'Connect wallet'}
      {showRightIcon && <Icon as={MdArrowOutward} boxSize={5} ml={5} />}
    </Button>
  );
};
export default ConnectWalletButton;
