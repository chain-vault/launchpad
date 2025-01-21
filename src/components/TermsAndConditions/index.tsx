import { useEffect } from 'react';

import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

import { BasicModal } from '@components/ui/Modals';
import { LocalStorageKeys } from '@constants/index';
import useLocalStorage from '@hooks/useLocalStorage';
import { opacify } from '@theme/utils';

const MotionBox = motion(Box as any);

const ModalFooter = ({
  isTCAccepted,
  onAccept,
  onClose,
}: {
  isTCAccepted: boolean;
  onAccept: (value: boolean) => void;
  onClose: () => void;
}) => (
  <Flex alignItems="center" gap={6}>
    <HStack>
      <Checkbox
        sx={{
          '& .chakra-checkbox__control[data-checked]': {
            bgColor: 'brand.primary.500',
            borderColor: 'brand.primary.500',
          },
        }}
        checked={isTCAccepted}
        onChange={(e) => onAccept(e.target.checked)}
      >
        <Text textStyle="body-regular-bold">
          I have read the risk warning carefully and agree to take the risk myself
        </Text>
      </Checkbox>
    </HStack>
    <Button onClick={onClose} variant="solid">
      Close
    </Button>
  </Flex>
);

const TermsAndConditions = ({ alertId }: { alertId: LocalStorageKeys }) => {
  const { isOpen: isModalOpen, onClose: onModalClose, onOpen: onModalOpen } = useDisclosure();
  const { isOpen: isAlertOpen, onClose: onAlertClose, onOpen: onAlertOpen } = useDisclosure();

  const [isTCAccepted, onAcceptTC] = useLocalStorage<boolean>(alertId);

  useEffect(() => {
    if (!isTCAccepted) {
      setTimeout(onAlertOpen, 500);
    }
  }, [isTCAccepted, onAlertOpen, onModalOpen]);

  const bgColor = useColorModeValue('brand.secondary.100', 'brand.secondary.900');

  const alertBg = opacify(90, bgColor);

  const onClose = () => {
    onModalClose();
    if (isTCAccepted) onAlertClose();
  };

  return (
    <>
      <AnimatePresence>
        {isAlertOpen && (
          <MotionBox
            animate={{ opacity: 1, y: 0 }}
            bottom="0px"
            exit={{ opacity: 0, y: 50 }}
            initial={{ opacity: 0, y: 50 }}
            position="fixed"
            transition={{ duration: 0.5 }}
            width="100%"
            zIndex="1090"
          >
            <Alert
              alignItems="center"
              bg={alertBg}
              borderRadius="md"
              boxShadow="md"
              justifyContent="center"
              status="warning"
              textAlign="center"
              variant="subtle"
            >
              <AlertIcon alignSelf="flex-start" />
              <Flex alignItems="center" direction={{ base: 'column', lg: 'row' }} gap={4}>
                <Text textAlign="left" textStyle={{ base: 'body-sm', md: 'body-md' }}>
                  Using smart contracts may not always be secure, and inherent risks exist when
                  dealing with Tokens and cryptocurrencies. Prioritize conducting your own research
                  before investing.
                </Text>
                <Button
                  borderRadius="lg"
                  onClick={onModalOpen}
                  size="sm"
                  w={{ base: '100%', lg: 'auto' }}
                >
                  <Text textStyle="body-xs">Read Risk Advisory and Agree</Text>
                </Button>
              </Flex>
            </Alert>
          </MotionBox>
        )}
      </AnimatePresence>
      <BasicModal
        footer={
          <ModalFooter
            isTCAccepted={isTCAccepted as boolean}
            onAccept={onAcceptTC}
            onClose={onClose}
          />
        }
        modalBody={
          <Text lineHeight={['20px', '24px']} textStyle="body-md">
            By accessing and using Apeon, a liquidity bootstrapping pool (LBP) platform, you agree
            to comply with and be bound by these Terms and Conditions. You acknowledge that all
            transactions are conducted at your own risk and that the platform does not guarantee the
            success or profitability of any liquidity bootstrapping operations. You are responsible
            for maintaining the confidentiality of your account information and for all activities
            that occur under your account. The platform is provided “as is” without any warranties,
            and we disclaim all liability for any loss or damage arising from your use of the
            platform. These Terms may be updated from time to time, and your continued use of the
            platform constitutes acceptance of the revised Terms.
          </Text>
        }
        header="Terms and Conditions"
        isOpen={isModalOpen}
        modalContentProps={{ bg: 'surface.base.100' }}
        motionPreset="slideInBottom"
        onClose={onClose}
        size={{ base: 'sm', md: 'xl' }}
      />
    </>
  );
};

export default TermsAndConditions;
