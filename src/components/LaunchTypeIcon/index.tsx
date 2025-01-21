import React from 'react';

import { Box, BoxProps, Image, Tooltip } from '@chakra-ui/react';

import { CurveIndex } from '@constants/config';

import IconNanoLaunch from '@assets/imges/icon-nano-launch.png';
import IconPrimeLaunch from '@assets/imges/icon-prime-launch.png';

type LaunchTypeProps = { enableToolTip?: boolean; flip?: boolean; type: CurveIndex } & BoxProps;

export const LaunchTypeIcon: React.FC<LaunchTypeProps> = ({
  enableToolTip = false,
  flip,
  type,
  ...props
}) => (
  <Tooltip
    display={enableToolTip ? 'inherit' : 'none'}
    label={type === CurveIndex.NANO_LAUNCH ? 'Nano Launch' : 'Prime Launch'}
  >
    <Box
      alignItems="center"
      backgroundColor="brand.secondary.600"
      borderRadius="50%"
      boxSize="34px"
      display="flex"
      justifyContent="center"
      {...(flip ? { transform: 'rotateY(180deg)' } : {})}
      {...props}
    >
      <Image
        alt={`${type === CurveIndex.NANO_LAUNCH ? 'Nano' : 'Micro'} launch`}
        height="80%"
        src={type === CurveIndex.NANO_LAUNCH ? IconNanoLaunch : IconPrimeLaunch}
        transition="all ease .2s"
      />
    </Box>
  </Tooltip>
);
