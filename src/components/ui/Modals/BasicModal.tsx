import type { FC, ReactNode } from 'react';

import {
  ModalProps as ChakraModalProps,
  Heading,
  Modal,
  ModalBody,
  ModalBodyProps,
  ModalCloseButton,
  ModalContent,
  ModalContentProps,
  ModalFooter,
  ModalFooterProps,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

interface BasicModalProps extends Omit<ChakraModalProps, 'children'> {
  closeButtonDisabled?: boolean;
  footer?: ReactNode;
  header?: ReactNode;
  modalBody: ReactNode;
  modalBodyProps?: ModalBodyProps;
  modalContentProps?: ModalContentProps;
  modalFooterProps?: ModalFooterProps;
}

const BasicModal: FC<BasicModalProps> = ({
  closeButtonDisabled,
  footer,
  header,
  isOpen,
  modalBody,
  modalBodyProps,
  modalContentProps,
  modalFooterProps,
  onClose,
  ...rest
}) => (
  <Modal
    aria-label="Focus on the modal"
    autoFocus={false}
    isOpen={isOpen}
    onClose={onClose}
    {...rest}
  >
    <ModalOverlay />
    <ModalContent {...modalContentProps} alignItems="center" justifyContent="center">
      {header && (
        <ModalHeader alignItems="center">
          <Heading size="md">{header}</Heading>
        </ModalHeader>
      )}
      {!closeButtonDisabled && <ModalCloseButton />}
      <ModalBody {...modalBodyProps}>{modalBody}</ModalBody>
      {footer && <ModalFooter {...modalFooterProps}>{footer}</ModalFooter>}
    </ModalContent>
  </Modal>
);

export default BasicModal;
