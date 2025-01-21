// BubbleMapModal.tsx
import { BubbleMap } from '@components/BubbleMap';
import { BasicModal } from '@components/ui/Modals';

interface BubbleMapModalProps {
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  token: null | string;
}

const BubbleMapModal: React.FC<BubbleMapModalProps> = ({
  isOpen,
  loading,
  onClose,
  token,
}: BubbleMapModalProps) => (
  <BasicModal
    modalContentProps={{
      _dark: {
        bg: '#0C0C0C',
      },
      bg: 'base.100',
      border: 'none',
    }}
    header="Bubble Map"
    isOpen={isOpen}
    modalBody={<BubbleMap loading={loading} token={token} />}
    modalBodyProps={{ px: 0, py: 0 }}
    motionPreset="slideInBottom"
    onClose={onClose}
    size={['full', '5xl']}
    isCentered
  />
);

export default BubbleMapModal;
