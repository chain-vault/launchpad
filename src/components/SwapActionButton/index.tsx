import { Button } from '@chakra-ui/react';

import { ConnectWalletButton } from '@components/WalletAdapter';

interface SwapActionButtonProps {
  confirmMessage: string;
  disabledMessage: string;
  fastLaunch?: boolean;
  isDisabled?: boolean;
  isLoading: boolean;
  isWalletConected: boolean;
  onClickAction: () => void;
}
export const SwapActionButton = ({
  confirmMessage,
  disabledMessage,
  fastLaunch,
  isDisabled,
  isLoading,
  isWalletConected,
  onClickAction,
}: SwapActionButtonProps) =>
  !isWalletConected ?
    <ConnectWalletButton variant={fastLaunch ? 'accent' : 'secondary'} showRightIcon />
  : <Button
      isDisabled={!!disabledMessage || isDisabled}
      isLoading={isLoading}
      onClick={onClickAction}
      variant={fastLaunch ? 'accent' : 'secondary'}
      w="100%"
    >
      {disabledMessage || confirmMessage}
    </Button>;
