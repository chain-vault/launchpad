import React from 'react';

import { Box, Image, ImageProps, SkeletonCircle } from '@chakra-ui/react';

import { FallbackSVG } from '@assets/icons';

interface TokenAvatarProps {
  borderRadius?: string;
  boxSize?: string;
  isLoading?: boolean;
  src?: string;
}
export const TokenAvatar: React.FC<Partial<ImageProps> & TokenAvatarProps> = ({
  borderRadius = 'full',
  boxSize = '12',
  isLoading = false,
  src,
  ...props
}) => (
  <Box
    _dark={{
      bg: 'base.900',
    }}
    alignItems="center"
    bg="base.100"
    borderRadius={borderRadius}
    boxSize={boxSize}
    display="flex"
    justifyContent="center"
    p="2px"
    position="relative"
  >
    <SkeletonCircle
      endColor="brand.accent.600"
      h={boxSize}
      isLoaded={!isLoading}
      minH={boxSize}
      minW={boxSize}
      size={boxSize}
      startColor="brand.secondary.500"
      sx={{ borderRadius: 'full !important' }}
      w={boxSize}
    >
      <Image
        fallback={
          <Box
            alignItems="center"
            display="flex"
            inset={0}
            justifyContent="center"
            position="absolute"
          >
            <FallbackSVG />
          </Box>
        }
        borderRadius={borderRadius}
        boxSize="100%"
        fallbackStrategy="beforeLoadOrError"
        objectFit="contain"
        src={src}
        {...props}
        _dark={{
          bg: 'base.800',
          borderColor: 'base.700',
          borderWidth: '1px',
        }}
        bg="base.100"
        border="solid"
        borderColor="base.300"
        borderWidth="2px"
      />
    </SkeletonCircle>
  </Box>
);

export default TokenAvatar;
