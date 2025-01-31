import React from 'react';

import { Box, Flex, Skeleton } from '@chakra-ui/react';

import useResponsiveValue from '@hooks/useResponsiveValue';

import { useFastLaunchSearchParams } from '../hooks/useFastLaunchSearchParams';
import { useGetAgent } from '../hooks/useGetAgentInfo';
import { Socials } from './Socials';

export const ProjectInfo: React.FC = () => {
  const isMobile = useResponsiveValue({ base: true, md: false });
  const { agentId } = useFastLaunchSearchParams();
  const { data: agent, isLoading: isAgentLoading } = useGetAgent(agentId);

  return (
    <>
      <Skeleton isLoaded={!isAgentLoading}>
        <Box>{agent?.description}</Box>
      </Skeleton>
      {isMobile && (
        <Flex py={2}>
          <Socials />
        </Flex>
      )}
    </>
  );
};
