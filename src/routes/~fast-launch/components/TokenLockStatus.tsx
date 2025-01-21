import React from 'react';

import { Button, Flex, HStack, Icon, Image, Link, Text } from '@chakra-ui/react';
import { MdArrowOutward } from 'react-icons/md';

import { getTokenLockLink } from '@constants/config';
import { useGetPoolById } from '@hooks/apein/useGetPool';

import { JupiterSwapIcon, Lock, UnLocked } from '@assets/icons';

import { useFastLaunchSearchParams } from '../hooks/useFastLaunchSearchParams';
import { useTokenLock } from '../hooks/useLockCountdown';

export const TokenLockStatus: React.FC = () => {
  const { data: poolData } = useGetPoolById(useFastLaunchSearchParams().pool);
  const { isLockActive, label } = useTokenLock(poolData?.lockEndTime);
  return (
    <Flex
      bg={!isLockActive ? 'danger.500' : 'brand.accent.600'}
      borderRadius="32px"
      color={!isLockActive ? '' : 'base.900'}
      direction="column"
      gap={2}
      position="relative"
      py={2}
      textDecoration="none !important"
    >
      <Flex
        alignItems="baseline"
        direction="row"
        fontWeight="bold"
        justifyContent="center"
        textTransform="uppercase"
      >
        {isLockActive && <Image boxSize={4} position="relative" src={Lock} top="2px" />}
        {!isLockActive && <Image boxSize={4} position="relative" src={UnLocked} top="2px" />}

        <Text as="span" ml={1} textDecoration="none" textStyle="body-regular-bold">
          {`Developer tokens ${isLockActive ? '' : 'un'}locked`}
        </Text>
      </Flex>
      <Flex justifyContent="center" mb={8}>
        {isLockActive && (
          <Button bg="surface.base.500 !important" variant="ghost">
            <Text textStyle="body-md">Unlock : </Text>
            <Text as="span" color="brand.accent.600" ml={1} textStyle="body-regular-bold">
              {isLockActive ? label : 'in 0 days'}
            </Text>
          </Button>
        )}
        {!isLockActive && (
          <Button
            as={Link}
            href={getTokenLockLink(poolData?.token?.toString() ?? '')}
            target="_blank"
            textDecoration="none !important"
            textTransform="none"
            variant="ghost"
          >
            Jupiter Lock <Icon as={MdArrowOutward} boxSize={5} />
          </Button>
        )}
      </Flex>
      <Flex
        alignItems="center"
        bg="transparent"
        borderRadius="0px 0px 32px 32px"
        bottom={-1}
        color="base.900"
        gap={1}
        justifyContent="center"
        left={0}
        minH="30px"
        position="absolute"
        py={2}
        w="100%"
      >
        <Text textStyle="body-md-bold">Powered by</Text>
        <HStack alignItems="center" gap={1}>
          <Image boxSize={6} src={JupiterSwapIcon} />
          <Text fontFamily="inter" fontSize={['12px', '14px']} fontWeight="bold">
            Jupiter Lock
          </Text>
          {/* <Icon as={FaQuestionCircle} boxSize={3} ml={1} opacity={0.5} /> */}
        </HStack>
      </Flex>
    </Flex>
  );
};
