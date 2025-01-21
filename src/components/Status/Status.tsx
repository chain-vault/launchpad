import React from 'react';

import { Box, Text } from '@chakra-ui/react';

import { LBPPoolStatus } from '@app-types/index';

import { POOL_STATUS_COLORS } from '@constants/poolStatusColor';

export const PoolStatus: React.FC<{ status: LBPPoolStatus }> = ({ status }) => {
  const dotBg = POOL_STATUS_COLORS[status];
  return (
    <Box
      border="solid 1px"
      borderColor="surface.base.500"
      borderRadius={20}
      display="flex"
      pl="30px"
      pr="15px"
      py={1}
      role="status"
    >
      <Box
        _after={{
          background: dotBg,
          borderRadius: '50%',
          content: "''",
          display: 'block',
          height: '13px',
          left: '-2px',
          opacity: 0.3,
          position: 'absolute',
          top: '-2px',
          width: '13px',
        }}
        as="span"
        background="red"
        bg={dotBg}
        borderRadius="50%"
        bottom="0"
        height="9px"
        left="13px"
        margin="auto"
        position="absolute"
        top="0"
        width="9px"
      />
      <Text>{status}</Text>
    </Box>
  );
};
