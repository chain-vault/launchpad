import React, { type ReactNode } from 'react';

import { HStack, StackProps } from '@chakra-ui/react';

type ThProps = {
  children: ReactNode;
} & StackProps;
export const Th: React.FC<ThProps> = ({ children, ...props }) => (
  <HStack color="surface.base.800" p={0} pt={2} {...props} textStyle="body-sm">
    {children}
  </HStack>
);
