import React, { ReactNode } from 'react';

import { Box, BoxProps } from '@chakra-ui/react';

type TdProps = {
  children: ReactNode;
} & BoxProps;

export const Td: React.FC<TdProps> = ({ children, ...props }) => (
  <Box flex="1 1 0px" whiteSpace="wrap" width="100%" data-td {...props}>
    {children}
  </Box>
);
