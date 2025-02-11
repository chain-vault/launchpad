import React from 'react';

import { Box, Button, Card, CardBody, Flex, Heading, Text } from '@chakra-ui/react';

import AgentAnalytics from '@components/Analytics';
import { useGetPoolById } from '@hooks/apein/useGetPool';
import { useTokenMetadata } from '@hooks/useToken';
import { BondingCurve } from '@routes/~fast-launch/components/BondingCurve';
import { DeveloperInfo } from '@routes/~fast-launch/components/DeveloperInfo';
import { HeaderMetrics } from '@routes/~fast-launch/components/HeaderMetrics';
import { ProjectInfo } from '@routes/~fast-launch/components/ProjectInfo';
import { Socials } from '@routes/~fast-launch/components/Socials';
import { TokenDetails } from '@routes/~fast-launch/components/TokenDetails';
import { useFastLaunchSearchParams } from '@routes/~fast-launch/hooks/useFastLaunchSearchParams';
import { useGetAgent } from '@routes/~fast-launch/hooks/useGetAgentInfo';
import { useTokenAddress } from '@routes/~fast-launch/hooks/useTokenAddress';
import { shrinkText } from '@utils/shrinkText';
import { decompressString } from '@utils/textCompression';

export const InfoPanel: React.FC = () => {
  const { data: poolData, isLoading: isPoolDataLoading } = useGetPoolById(
    useFastLaunchSearchParams().pool
  );
  const { isMetaDataLoading, poolTokenMetadata } = useTokenMetadata(useTokenAddress(), true);
  const desc = decompressString(poolTokenMetadata?.poolDescription ?? '');

  const { data: agent, isLoading: isAgentLoading } = useGetAgent(
    useFastLaunchSearchParams().agentId
  );

  return (
    <Box>
      <Flex direction="column" my={4}>
        <Box>
          <Heading size="md">Agent Metrics</Heading>
        </Box>
        <Box my={1}>
          <AgentAnalytics />

          {/* <Text opacity={0.5} textStyle="body-sm">
                    Last Updated : 1Min Ago
                  </Text> */}
        </Box>
        <Box pt={3}>
          <Flex alignSelf="flex-start" py={3}>
            <Socials />
          </Flex>
          <Flex
            alignContent="center"
            borderColor="#2C3655 !important"
            borderTop="1px"
            direction="row"
            justifyContent="space-between"
            py={3}
          >
            <Flex direction="column" ml={-3}>
              <Text mb={2} opacity={0.5} px={3} textStyle="body-sm">
                Created by
              </Text>
              <HeaderMetrics
                value={shrinkText({
                  maxLength: 6,
                  string: poolData?.poolCreator?.toString() ?? '-',
                })}
                label=""
              />
            </Flex>
            <Button
              onClick={() => {
                window.open(`${import.meta.env.VITE_BLOCKBEAST_URL}/chat/${agent?.id}`, '_blank');
              }}
              _hover={{ bg: 'green.200' }}
              bg="green.100"
              color="gray.800"
              px={6}
              size="md"
            >
              Reach Agent
            </Button>
          </Flex>
        </Box>
      </Flex>
      <Box mb={3}>
        <BondingCurve />
      </Box>
      {!isPoolDataLoading && poolData?.hasTokenLockBeenApplied && (
        <Box mb={3}>
          <DeveloperInfo />
        </Box>
      )}
      <Card>
        <CardBody>
          {!isMetaDataLoading && desc && desc.length && (
            <Box mb={1}>
              <Text textStyle="body-md-bold">Agent Description</Text>
            </Box>
          )}
          <Box>
            <ProjectInfo />
          </Box>
        </CardBody>
      </Card>
      <Box mb={3}>
        <TokenDetails />
      </Box>
    </Box>
  );
};
