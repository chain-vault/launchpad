import { Box, Center, Flex, Heading, Wrap, WrapItem } from '@chakra-ui/react';

import { useFastLaunchSearchParams } from '@routes/~fast-launch/hooks/useFastLaunchSearchParams';
import { useGetAgentAnalytics } from '@routes/~fast-launch/hooks/useGetAgentInfo';

const AgentAnalytics = () => {
  const { data: analyticsData, isLoading: isAnalyticsDataLoading } = useGetAgentAnalytics(
    useFastLaunchSearchParams().agentId
  );

  if (!isAnalyticsDataLoading && analyticsData !== undefined)
    return (
      <Wrap>
        <WrapItem>
          <Center background="base.700" borderRadius={4} minH="60px" w="auto">
            <Flex direction="column" p={3}>
              <Box>
                <Heading size="sm">{analyticsData.msgCount}</Heading>
              </Box>
              <Box>Agent Engagement</Box>
            </Flex>
          </Center>
        </WrapItem>
        <WrapItem>
          <Center background="base.700" borderRadius={4} minH="60px" w="auto">
            <Flex direction="column" p={3}>
              <Box>
                <Heading size="sm">{analyticsData.userCount}</Heading>
              </Box>
              <Box>Unique Users</Box>
            </Flex>
          </Center>
        </WrapItem>
      </Wrap>
    );
};

export default AgentAnalytics;
