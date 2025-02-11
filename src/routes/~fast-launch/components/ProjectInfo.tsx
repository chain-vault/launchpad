import React from 'react';

import { Flex, Skeleton, Text } from '@chakra-ui/react';

import useResponsiveValue from '@hooks/useResponsiveValue';

import { useFastLaunchSearchParams } from '../hooks/useFastLaunchSearchParams';
import { useGetAgent } from '../hooks/useGetAgentInfo';

export const ProjectInfo: React.FC = () => {
  const isMobile = useResponsiveValue({ base: true, md: false });
  const { agentId } = useFastLaunchSearchParams();
  const { data: agent, isLoading: isAgentLoading } = useGetAgent(agentId);

  return (
    <Skeleton isLoaded={!isAgentLoading}>
      <Flex direction="column" flex="auto" textStyle="body-regular-bold">
        {isMobile && <Flex py={2}>Agent Info</Flex>}

        <Text textStyle="body-md">{agent?.description}</Text>
      </Flex>
    </Skeleton>
  );
};
