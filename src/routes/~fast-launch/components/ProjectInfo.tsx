import React from 'react';

import { Box, Flex, Skeleton } from '@chakra-ui/react';
import { useParams } from '@tanstack/react-router';

import useResponsiveValue from '@hooks/useResponsiveValue';
import { useTokenMetadata } from '@hooks/useToken';
import { decompressString } from '@utils/textCompression';

import { useGetAgent } from '../hooks/useGetAgentInfo';
import { useTokenAddress } from '../hooks/useTokenAddress';
import { Socials } from './Socials';

export const ProjectInfo: React.FC = () => {
  const isMobile = useResponsiveValue({ base: true, md: false });
  const { isMetaDataLoading, poolTokenMetadata } = useTokenMetadata(useTokenAddress(), true);
  const { poolAddress } = useParams({
    from: '/fast-launch/swap/$poolAddress',
  });
  const { data: agent, isLoading: isAgentLoading } = useGetAgent("e72321cb-6b8f-4941-8ea3-83f24a18ba9d");
  // console.log(agent);
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
