import { FC } from 'react';

import { Flex, Image, Text } from '@chakra-ui/react';
import { ParsedLocation } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { BsUnlockFill } from 'react-icons/bs';

import { Lock } from '@assets/imges';

const MotionFlex = motion(Flex as any);

interface DeveloperTokenStatusProps {
  cardType?: 'apex' | 'other';
  isLockActive: boolean;
  isMobile?: boolean;
  location: ParsedLocation;
}

const DeveloperTokenStatus: FC<DeveloperTokenStatusProps> = ({
  cardType = 'other',
  isLockActive,
  isMobile = false,
  location,
}) => {
  // Set width based on route and device type

  const width =
    location.pathname === '/' && !isMobile ? '205px'
    : isMobile ? '180px'
    : '210px';

  return (
    <MotionFlex
      animate={{
        background: [
          'linear-gradient(45deg, #b982f2, #ffe502)',
          'linear-gradient(45deg, #ffe502, #b982f2)',
        ],
      }}
      transition={{
        duration: 1,
        ease: 'easeInOut',
        repeat: Infinity,
      }}
      alignItems="center"
      bg="linear-gradient(45deg, #b982f2, #000)"
      h="34px"
      mt={2}
      position="relative"
      px={1}
      py={1}
      rounded="full"
      w={width}
    >
      <Flex
        bg={
          isLockActive && cardType === 'apex' ? 'brand.secondary.600 !important'
          : isLockActive && cardType === 'other' ?
            'surface.base.200'
          : ''
        }
        color={
          cardType === 'apex' ? 'base.900'
          : isLockActive && cardType === 'other' ?
            'surface.base.900'
          : 'base.900'
        }
        alignItems="center"
        gap={1}
        h="30px"
        justifyContent="center"
        left="50%"
        position="absolute"
        rounded="full"
        textStyle="body-md"
        transform="translateX(-50%)"
        w={`calc(${width} - 4px)`}
      >
        {isLockActive ?
          <Image mb={0.5} src={Lock} />
        : <BsUnlockFill />}
        <Text textStyle="body-sm-bold">
          Developer Tokens {isLockActive ? 'Locked' : 'Unlocked'}
        </Text>
      </Flex>
    </MotionFlex>
  );
};

export default DeveloperTokenStatus;
