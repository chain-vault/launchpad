import React, { useMemo } from 'react';

import { Flex, Icon, useClipboard } from '@chakra-ui/react';
import { PiCheckSquare, PiCopy } from 'react-icons/pi';

import NumberWithTooltip from '@components/ui/Tooltip/NumberWithTooltip';
import useResponsiveValue from '@hooks/useResponsiveValue';

export const ClipboardText: React.FC<{
  children: string;
  maxLength?: number;
  theme?: 'filled' | 'primary';
  trim?: boolean;
}> = ({ children = '', maxLength = 12, theme = 'primary', trim = false }) => {
  const isMobile = useResponsiveValue({ base: true, lg: false, md: false, xl: false });

  const { hasCopied, onCopy } = useClipboard(children);
  const displayValue = useMemo(() => {
    if (!trim || children.length < maxLength) {
      return children;
    }
    const max = maxLength - 3;
    const trimLength = Math.floor(max / (isMobile ? 4 : 4));
    return [children.substr(0, trimLength), '...', children.substr(-trimLength)].join('');
  }, [children, maxLength, trim]);
  // const padding =
  //   theme === 'primary' ?
  //     {
  //       pr: '25px',
  //     }
  //   : { borderRadius: '5px', p: 2, paddingBottom: 1, paddingTop: 1, pl: '25px' };
  return (
    <Flex _hover={{ cursor: 'pointer' }} alignItems="center" data-test={theme} gap={1} onClick={onCopy}>
      <NumberWithTooltip
        textStyle={trim ? 'body-md' : { base: 'body-sm', md: 'body-md' }}
        tooltip={children}
      >
        {displayValue}
      </NumberWithTooltip>

      <Icon
        as={!hasCopied ? PiCopy : PiCheckSquare}
        color="surface.base.800"
        cursor="pointer"
      />
    </Flex>
  );
};
