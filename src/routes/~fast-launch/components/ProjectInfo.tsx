import React from 'react';

import { Box, Flex, Skeleton } from '@chakra-ui/react';

import useResponsiveValue from '@hooks/useResponsiveValue';
import { useTokenMetadata } from '@hooks/useToken';
import { decompressString } from '@utils/textCompression';

import { useFastLaunchSearchParams } from '../hooks/useFastLaunchSearchParams';
import { useGetAgent } from '../hooks/useGetAgentInfo';
import { useTokenAddress } from '../hooks/useTokenAddress';
import { Socials } from './Socials';

export const ProjectInfo: React.FC = () => {
  const isMobile = useResponsiveValue({ base: true, md: false });
  const { isMetaDataLoading, poolTokenMetadata } = useTokenMetadata(useTokenAddress(), true);
  const {agentId} = useFastLaunchSearchParams();
  const { data: agent, isLoading: isAgentLoading } = useGetAgent(agentId);
  console.log(agent)
  return (
    <>
      <Box maxW={{ base: '100%', md: '100%' }} overflowWrap="break-word" wordBreak="break-word">
        <Skeleton isLoaded={!isMetaDataLoading}>
          <Box
            dangerouslySetInnerHTML={{
              __html: decompressString(poolTokenMetadata?.poolDescription || ''),
            }}
            as="pre"
            className="editor-preview"
            fontFamily="inherit"
            whiteSpace="pre-line"
          />
        </Skeleton>
      </Box>
      <Box>{agent?.description}</Box>
      {isMobile && (
        <Flex py={2}>
          <Socials />
        </Flex>
      )}
    </>
  );
};
