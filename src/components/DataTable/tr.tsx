import React, { type ReactNode } from 'react';

import { HStack, StackProps } from '@chakra-ui/react';
import isFunction from 'lodash/isFunction';

type TrProps = {
  children: ReactNode;
  onClick?: () => void;
} & StackProps;
export const Tr: React.FC<TrProps> = ({ children, onClick, ...props }) => {
  const onClickHandler = () => {
    if (isFunction(onClick)) onClick();
  };
  return (
    <HStack
      _hover={{
        bg: 'surface.base.600',
      }}
      borderBottom="2px"
      borderColor={{ base: 'surface.base.950', md: 'none' }}
      borderRadius={{ base: 0, md: 5 }}
      cursor={typeof onClick === 'function' ? 'pointer' : ''}
      onClick={onClickHandler}
      px={2}
      py={4}
      transitionDuration="0.2s"
      width="100%"
      data-row
      {...props}
    >
      {children}
    </HStack>
  );
};
