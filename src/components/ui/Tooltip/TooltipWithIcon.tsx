import type { IconType } from 'react-icons';

import type { ReactNode } from 'react';

import { Box, Icon, Text, Tooltip, type TooltipProps, useDisclosure } from '@chakra-ui/react';

interface TooltipWithIconProps extends Omit<TooltipProps, 'children' | 'label'> {
  icon: IconType | ReactNode;
  tooltipContent: ReactNode;
}

export const TooltipWithIcon = ({ icon, tooltipContent, ...props }: TooltipWithIconProps) => {
  const { isOpen, onClose, onOpen, onToggle } = useDisclosure();
  return (
    <Tooltip
      label={
        <Text opacity={0.5} textStyle="body-xs">
          {tooltipContent}
        </Text>
      }
      isOpen={isOpen}



      {...props}
    >
      <Box alignItems="center"
        as="span"
        display="inline-flex" onClick={onToggle} onMouseEnter={onOpen} onMouseLeave={onClose} userSelect="none">
        {typeof icon === 'function' ?
          <Icon as={icon} opacity={0.6} />
          : icon}
      </Box>
    </Tooltip>
  );
}
