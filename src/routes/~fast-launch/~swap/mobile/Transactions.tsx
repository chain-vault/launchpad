import React from 'react';

import { Box } from '@chakra-ui/react';

import { TransactionsList } from '@routes/~fast-launch/components/Transactions';

export const Transactions: React.FC = () => (
  <Box>
    <TransactionsList />
  </Box>
);
