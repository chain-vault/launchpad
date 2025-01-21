import { Box, Button, useDisclosure } from '@chakra-ui/react';

import BubbleMapModal from '@components/BubbleMap/BubbleMapModal';
import { isApeInBubbleMapEnabled } from '@constants/config/features';
import { HoldersList } from '@routes/~fast-launch/components/Holders';

interface HoldersProps {
  loading: boolean;
  token: null | string;
}

export const Holders: React.FC<HoldersProps> = ({ loading, token }: HoldersProps) => {
  const {
    isOpen: isBubbleMapModalOpen,
    onClose: onBubbleMapModalClose,
    onOpen: onBubbleMapModalOpen,
  } = useDisclosure();
  return (
    <Box>
      <HoldersList />
      {isApeInBubbleMapEnabled && token && (
        <Button
          bottom="80px"
          onClick={onBubbleMapModalOpen}
          position="fixed"
          right="20px"
          size="sm"
          variant="outline-ape"
        >
          Generate Bubble Map
        </Button>
      )}
      <BubbleMapModal
        isOpen={isBubbleMapModalOpen}
        loading={loading}
        onClose={onBubbleMapModalClose}
        token={token}
      />
    </Box>
  );
};
