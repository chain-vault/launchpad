import React from 'react';

import { Box } from '@chakra-ui/react';

import StatusIndicator from '@components/Status/StatusIndicator';
import { useCountDown } from '@hooks/useCountdown';

import { Countdown } from './Countdown';

type PoolCoundownProps = {
  endDate: number;
  poolId: string;
  startDate: number;
};
export const PoolCoundown: React.FC<PoolCoundownProps> = ({ endDate, poolId, startDate }) => {
  const poolStatus = useCountDown(startDate, endDate, poolId);
  return (
    poolStatus && (
      <>
        <Countdown countdown={poolStatus.countdown} status={poolStatus.status} />
        <Box position="absolute" right="22px" top="22px">
          <StatusIndicator status={poolStatus?.status} />
        </Box>
      </>
    )
  );
};
