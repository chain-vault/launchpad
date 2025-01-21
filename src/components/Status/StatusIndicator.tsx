import { Box, Flex } from '@chakra-ui/react';

import { LBPPoolStatus } from '@app-types/index';

import { POOL_STATUS_COLORS } from '@constants/poolStatusColor';

interface StatusIndicatorProps {
  size?: 'lg' | 'md';
  status: LBPPoolStatus;
}

const StatusIndicator = ({ size = 'lg', status }: StatusIndicatorProps) => {
  const indicatorColor = POOL_STATUS_COLORS[status];

  return (
    <Flex
      alignItems="center"
      bg="surface.base.300"
      border="2px solid"
      borderColor="surface.base.500"
      borderRadius="3xl"
      cursor="default"
      gap={1}
      h={size === 'lg' ? 9 : 7}
      justifyContent="center"
      px="0"
      w="fit-content"
    >
      <Box p={1} textAlign="left">
        <Box
          alignItems="center"
          display="flex"
          height={size === 'lg' ? '20px' : '16px'}
          justifyContent="center"
          position="relative"
          width="20px"
        >
          <Box
            background={indicatorColor}
            borderRadius="50%"
            height={size === 'lg' ? '20px' : '16px'}
            opacity={0.3}
            position="absolute"
            width={size === 'lg' ? '20px' : '16px'}
          />
          <Box
            background={indicatorColor}
            borderRadius="50%"
            height={size === 'lg' ? '10px' : '6px'}
            width={size === 'lg' ? '10px' : '6px'}
          />
        </Box>
      </Box>
      <Box flex="1" mr={4} textAlign="center" textStyle="body-sm-bold">
        {status}
      </Box>
    </Flex>
  );
};

export default StatusIndicator;
