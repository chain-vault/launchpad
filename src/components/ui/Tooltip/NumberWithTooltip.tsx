import { ReactNode } from 'react';

import { Text, TextProps, Tooltip } from '@chakra-ui/react';

interface NumberWithTooltipProps extends TextProps {
  children: ReactNode | string;
  showtooltip?: boolean;
  tooltip: string;
}

const NumberWithTooltip = ({
  children,
  showtooltip = true,
  tooltip,
  ...textProps
}: NumberWithTooltipProps) => (
  <Tooltip
    label={
      showtooltip && tooltip ?
        <Text opacity={1} textStyle="body-sm">
          {tooltip}
        </Text>
      : ''
    }
    _dark={{ bg: 'base.900' }}
    bg="base.100"
    borderColor="surface.base.600"
    borderWidth="1px"
    placement="top"
    px={2}
    py={2}
    rounded="md"
    variant="text"
  >
    {typeof children === 'string' ?
      <Text display="inline-block" {...textProps}>
        {children}
      </Text>
    : children}
  </Tooltip>
);

export default NumberWithTooltip;
