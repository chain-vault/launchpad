import React from 'react';

import { Flex, FormLabel, HStack, Image, Switch, Text } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

import { CookieFunIcon } from '@assets/icons';

type DataSwarmProps = {};
export const DataSwarm: React.FC<DataSwarmProps> = () => {
  const cookieFun = 'cookieFun';
  const { getValues, register, watch } = useFormContext();
  const isEnabled = getValues(cookieFun);
  watch(cookieFun);
  return (
    <Flex
      alignItems="center"
      bg="surface.base.200"
      borderRadius="13px"
      justifyContent="space-between"
      position="relative"
      px={5}
      py={3}
      width="100%"
      wrap="wrap"
      zIndex={3}
    >
      {/* Left Content */}
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
            right={{ base: '0', md: '-5' }}
          >
            <Switch {...register(cookieFun)} size="lg" />
          </Flex>
          <Flex>
            <FormLabel m={0}>Data Swarm API</FormLabel>
          </Flex>
          <Flex>
            <FormLabel fontWeight="normal" m={0} opacity={0.5}>
              Optional
            </FormLabel>
          </Flex>
        </Flex>
      </Flex>

      <Flex alignItems="center" bg="transparent" gap={1} justifyContent="flex-end" py={2} w="auto">
        <Text textStyle="body-sm">By</Text>
        <HStack alignItems="center" gap={1}>
          <Image boxSize={5} src={CookieFunIcon} />
          <Text fontFamily="inter" fontSize={['12px', '12px']} fontWeight="bold">
            cookie.fun
          </Text>
        </HStack>
      </Flex>
    </Flex>
  );
};
