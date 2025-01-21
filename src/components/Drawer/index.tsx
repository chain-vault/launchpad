import React, { ReactNode, useEffect } from 'react';

import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
} from '@chakra-ui/react';

import { Slippage } from '@app-types/index';

import { RPCOptions } from '@constants/config/transactions';
import useResponsiveValue from '@hooks/useResponsiveValue';
import useTransactionSettings from '@hooks/useTransactionSettings';

interface CustomDrawerProps extends DrawerProps {
  children: ReactNode;
  closeButton?: boolean;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}
const CustomDrawer: React.FC<CustomDrawerProps> = ({
  children,
  closeButton = true,
  isOpen,
  onClose,
  title,
}) => {
  const isMobile = useResponsiveValue({ base: true, lg: false, md: false, xl: false });

  // Manual approximation for status bar and search bar heights
  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(('MSStream' in window) as any);
  const statusBarHeight = isIos ? 20 : 24;
  const searchBarHeight = isIos ? 56 : 48;
  const topPadding = statusBarHeight + searchBarHeight;

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
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement={isMobile ? 'bottom' : 'right'}
      size={isMobile ? 'md' : 'md'}
      preserveScrollBarGap
    >
      <DrawerOverlay />
      <DrawerContent bg="transparent" pt={isMobile ? `${topPadding + 32}px` : 'inherit'}>
        {closeButton && (
          <DrawerCloseButton bg="surface.base.200" mt={isMobile ? `${topPadding + 42}px` : 2} />
        )}
        {title && <DrawerHeader bg="surface.base.200">{title}</DrawerHeader>}
        <DrawerBody bg="surface.base.200" p={6}>
          {children}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
export default CustomDrawer;
