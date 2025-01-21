import React, { useEffect } from 'react';

import {
  Button,
  Flex,
  Icon,
  IconButton,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { FaChevronDown } from 'react-icons/fa';
import { IoSettings } from 'react-icons/io5';

import { Slippage } from '@app-types/index';

import { RPCOptions } from '@constants/config/transactions';
import useTransactionSettings from '@hooks/useTransactionSettings';

import SettingsBody from './SettingsBody';

const TransactionSettings: React.FC<{
  colorScheme?: 'accent' | 'primary';
  isBaseSettings?: boolean;
  toggleButtonVariant?: string;
}> = ({ colorScheme = 'primary', isBaseSettings, toggleButtonVariant = '' }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { customRPCUrl, onUpdateSlippage, selectedRPC, slippage, updateTransactionSettings } =
    useTransactionSettings();

  useEffect(() => {
    if (selectedRPC === RPCOptions.CUSTOM && !customRPCUrl) {
      updateTransactionSettings(['selectedRPC', RPCOptions.HELIUS]);
    }
    if (!slippage) {
      onUpdateSlippage(Slippage.AUTO);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Popover isOpen={isOpen} onClose={onClose} onOpen={onOpen} placement="bottom-end">
      <PopoverTrigger>
        {isBaseSettings ?
          <IconButton
            _hover={{ color: 'brand.accent.600', transition: '0.1s ease-in' }}
            aria-label="theme-button"
            color={isOpen ? 'brand.accent.600' : 'surface.base.900'}
            icon={<Icon as={IoSettings} boxSize={5} />}
            size="md"
            variant="unstyled"
          />
        : <Button
            justifyContent="space-between"
            rightIcon={<Icon as={FaChevronDown} boxSize={2.5} mr={-2} />}
            size="sm"
            variant="filled"
          >
            <Flex gap={2}>
              <Text opacity={0.6} textStyle="body-sm">
                Slippage:
              </Text>
              <Text textStyle="body-sm">
                {!slippage ?
                  Slippage.AUTO
                : slippage !== Slippage.AUTO && slippage !== Slippage.MAX ?
                  `${slippage}%`
                : slippage}
              </Text>
            </Flex>
          </Button>
        }
      </PopoverTrigger>

      <PopoverContent
        bg="surface.base.200"
        borderColor="surface.base.500"
        borderRadius="20px"
        borderWidth="2px"
        px={3}
        py={4}
      >
        <PopoverCloseButton />
        <PopoverBody pt={4}>
          <SettingsBody
            colorScheme={colorScheme}
            isBaseSettings={isBaseSettings}
            toggleButtonVariant={toggleButtonVariant}
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default TransactionSettings;
