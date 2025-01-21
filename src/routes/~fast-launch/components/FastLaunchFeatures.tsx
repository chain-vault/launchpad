import React from 'react';

import { Flex, Icon, Stack, Text } from '@chakra-ui/react';
import { IoCheckmarkSharp } from 'react-icons/io5';

import { NATIVE_TOKEN } from '@constants/config';

export const FastLaunchFeatures: React.FC<{ cost: string }> = ({ cost }) => (
  <Flex
    direction={{ base: 'column', md: 'row' }}
    fontSize={14}
    justifyContent="space-between"
    mb={{ base: 3, md: 3 }}
    width="100%"
  >
    <Stack mb={{ base: 2, md: 0 }}>
      <Flex alignItems="center">
        <Icon as={IoCheckmarkSharp} mr={1} />
        <Text as="span" color="surface.base.800">
          Takes just a few seconds
        </Text>
      </Flex>
    </Stack>
    <Stack mb={{ base: 2, md: 0 }}>
      <Flex alignItems="center">
        <Icon as={IoCheckmarkSharp} mr={1} />
        <Text as="span" fontWeight="bold" mr={2}>
          Free
        </Text>
        <Text as="span" color="surface.base.800">
          enhanced token info
        </Text>
      </Flex>
    </Stack>
    <Stack mb={{ base: 2, md: 0 }}>
      <Flex alignItems="center">
        <Icon as={IoCheckmarkSharp} mr={1} />
        <Text as="span" color="surface.base.800" mr={1}>
          Only
        </Text>
        <Text as="span" fontWeight="bold" mr={1}>
          ~{cost} {NATIVE_TOKEN.symbol}
        </Text>
        <Text as="span" color="surface.base.800">
          to deploy
        </Text>
      </Flex>
    </Stack>
  </Flex>
);
