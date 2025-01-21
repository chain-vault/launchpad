import { type FC, ReactNode } from 'react';

import { Box, Button, Center, Image, Text, VStack } from '@chakra-ui/react';

import { getExplorerUrl, StatusModalTypes } from '@constants/index';

import { BananaPeeled, CoconutError, CoconutTree } from '@assets/imges';

import BasicModal from './BasicModal';

const StatusElements = {
  fastLaunch: {
    [StatusModalTypes.FAILED]: {
      icon: <Image alt="error" boxSize={10} src={BananaPeeled} />,
      message: 'Failed',
    },
    [StatusModalTypes.SUCCESS]: {
      icon: <Image alt="success" boxSize={10} src={BananaPeeled} />,
      message: 'Success',
    },
  },
  lbp: {
    [StatusModalTypes.FAILED]: {
      icon: <Image alt="error" boxSize={10} src={CoconutError} />,
      message: 'Failed',
    },
    [StatusModalTypes.SUCCESS]: {
      icon: <Image alt="success" boxSize={10} src={CoconutTree} />,
      message: 'Success',
    },
  }
};

type StatusModalProps = {
  description: ReactNode;
  footerAction?: ReactNode;
  isFastLaunch?: boolean,
  isOpen: boolean;
  message?: string;
  onClose: () => void;
  onTryAgain?: () => void;
  txHash?: string;
  type: StatusModalTypes;
};

interface ModalBodyProps {
  description: ReactNode;
  message?: string;
  type: StatusModalTypes;
}

const ModalBody = ({ description, message, type }: ModalBodyProps) => (
  <VStack px={2}>
    <Text textAlign="center" textStyle="h3">
      {type === StatusModalTypes.FAILED ? 'Oh snap!' : message}
    </Text>
    <Text opacity={0.5} textAlign="center" textStyle="body-sm" whiteSpace="pre-line" wordBreak="break-word">
      {description}
    </Text>
  </VStack>
);

interface ModalFooterProps {
  footerAction?: ReactNode;
  isFastLaunch?: boolean
  onTryAgain?: () => void;
  txHash?: string;
  type: StatusModalTypes;
}

const ModalFooter = ({ footerAction, isFastLaunch = false, onTryAgain, txHash, type }: ModalFooterProps) => (
  <VStack w="100%">
    {type === StatusModalTypes.FAILED ?
      <Button onClick={onTryAgain} variant={isFastLaunch ? "accent" : "solid"} w="100%">
        Try again
      </Button>
      : footerAction}
    {txHash && (
      <Button
        as="a"
        border="2px solid"
        borderColor="surface.base.500"
        href={getExplorerUrl(txHash)}
        rel="noopener noreferrer"
        target="_blank"
        variant="unstyled"
        w="100%"
      >
        View transaction
      </Button>
    )}

  </VStack>
);

const StatusModal: FC<StatusModalProps> = ({
  description,
  footerAction,
  isFastLaunch = false,
  isOpen,
  message,
  onClose,
  onTryAgain,
  txHash,
  type
}: StatusModalProps) => {
  const bg =
    type === StatusModalTypes.FAILED ?
      isFastLaunch ? 'background.container.accent' : 'background.container.secondary'
      : isFastLaunch ? 'background.container.accent' : 'background.container.secondary';
  const iconBg =
    type === StatusModalTypes.FAILED ?
      `background.container.${isFastLaunch ? 'accent' : 'danger'}`
      : `background.container.${isFastLaunch ? "accent" : "secondary"}`;
  const target = isFastLaunch ? "fastLaunch" : "lbp";
  return (
    <BasicModal
      footer={
        <ModalFooter
          footerAction={footerAction}
          isFastLaunch={isFastLaunch}
          onTryAgain={onTryAgain}
          txHash={txHash}
          type={type}
        />
      }
      header={
        <Center>
          <Box bg={iconBg} borderRadius="xl">
            {StatusElements[target][type].icon}

          </Box>
        </Center>
      }
      isOpen={isOpen}
      modalBody={<ModalBody description={description} message={message} type={type} />}
      modalContentProps={{ bg }}
      onClose={onClose}
      size="xs"
      isCentered
    />
  );
};

export default StatusModal;
