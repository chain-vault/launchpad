import React from 'react';

import { Flex, FormLabel, HStack, Image, Switch, Text } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

import { JupiterSwapIcon } from '@assets/icons';

import { LockPeriodDropDown } from './LockPeriodDropDown';

type LockTokenProps = {};
export const LockToken: React.FC<LockTokenProps> = () => {
  const name = 'lockToken.locked';
  const { getValues, register, watch } = useFormContext();
  const isEnabled = getValues(name);
  watch([name, 'lockToken.period']);
  return (
    <Flex
      bg="surface.base.200"
      borderRadius="13px"
      position="relative"
      px={5}
      py={3}
      width="100%"
      wrap="wrap"
      zIndex={3}
    >
      <Flex
        direction="column"
        flex="auto"
        justifyContent="center"
        maxW={{ base: '100%', md: '50%' }}
        minW={{ base: '100%', md: 'initial' }}
        position="relative"
        w={{ base: '100%', md: '50%' }}
      >
        <Flex
          direction="column"
          float="left"
          justifyContent="center"
          maxWidth={{ base: '100%', md: 140 }}
          position="relative"
        >
          <Flex
            alignItems="center"
            justifyContent="center"
            key={isEnabled ? 'checked' : 'disabled'}
            position="absolute"
            right="0"
          >
            <Switch {...register(name)} size="lg" variant="" />
          </Flex>
          <Flex>
            <FormLabel m={0}>Token Lock</FormLabel>
          </Flex>
          <Flex>
            <FormLabel fontWeight="normal" m={0} opacity={0.5}>
              Optional
            </FormLabel>
          </Flex>
        </Flex>
        <Flex alignItems="center" bg="transparent" gap={1} py={2} w="100%">
          <Text textStyle="body-sm">Powered by</Text>
          <HStack alignItems="center" gap={1}>
            <Image boxSize={5} src={JupiterSwapIcon} />
            <Text fontFamily="inter" fontSize={['12px', '12px']} fontWeight="bold">
              Jupiter Lock
            </Text>
          </HStack>
        </Flex>
      </Flex>
      <Flex
        alignItems="center"
        direction="row"
        // flex="auto"
        justifyContent={['center', 'end']}
        maxW={{ base: '100%', md: '50%' }}
        minW={{ base: '100%', md: 'initial' }}
        mt={{ base: 3, md: 0 }}
        w={{ base: '100%', md: '50%' }}
      >
        <LockPeriodDropDown disabled={!isEnabled} />
      </Flex>
    </Flex>
  );
};
