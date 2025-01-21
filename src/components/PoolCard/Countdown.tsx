import React from 'react';

import { Box } from '@chakra-ui/react';
import { LuCalendarCheck2 } from 'react-icons/lu';
import { PiClockCountdownBold } from 'react-icons/pi';

import { LBPPoolStatus } from '@app-types/index';

import { POOL_STATUS_COLORS } from '@constants/poolStatusColor';

type CountDownProps = {
  countdown: string;
  position?: 'absolute' | 'relative';
  status: LBPPoolStatus;
};

export const Countdown: React.FC<CountDownProps> = ({
  countdown,
  position = 'absolute',
  status,
}) => {
  const color = POOL_STATUS_COLORS[status];
  return (
    <Box
      sx={
        position === 'absolute' ?
          {
            left: '20px',
            position: 'absolute',
            right: '0px',
            top: '-40px',
          }
        : {}
      }
      alignItems="center"
      color={status === LBPPoolStatus.LIVE_NOW ? 'surface.base.900' : color}
      display="flex"
      fontSize={13}
      justifyContent="center"
    >
      {status !== LBPPoolStatus.COMPLETED && (
        <Box
          sx={{
            '.box ': {
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
              mx: '2px',
            },
          }}
          bg="surface.base.600"
          borderRadius={30}
          display="inline-flex"
          flexDirection="row"
          px="10px"
          py="4px"
          textStyle="body-md-bold"
        >
          <Box className="box">
            {status === LBPPoolStatus.COMING_SOON && <LuCalendarCheck2 />}
            {status === LBPPoolStatus.LIVE_NOW && <PiClockCountdownBold />}
          </Box>
          <Box className="box" fontWeight="bold">
            {countdown}
          </Box>
        </Box>
      )}
    </Box>
  );
};
