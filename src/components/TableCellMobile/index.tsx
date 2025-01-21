import React, { type ReactNode } from 'react';

import { Box } from '@chakra-ui/react';

export const TableCellMobile: React.FC<{
  label: number | string;
  value: number | ReactNode | string | undefined;
}> = ({ label, value }) => (
  <Box>
    <Box mb={1} textStyle="body-xs">
      {value}
    </Box>
    <Box color="surface.base.800" fontSize="10px">
      {label}
    </Box>
  </Box>
);
