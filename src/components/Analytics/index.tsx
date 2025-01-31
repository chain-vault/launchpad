import { Card, CardBody, CardHeader, Flex, Heading, Stack } from '@chakra-ui/react';

import { useFastLaunchSearchParams } from '@routes/~fast-launch/hooks/useFastLaunchSearchParams';
import { useGetAgentAnalytics } from '@routes/~fast-launch/hooks/useGetAgentInfo';

const AgentAnalytics = () => {
  const { data: analyticsData, isLoading: isAnalyticsDataLoading } = useGetAgentAnalytics(
    useFastLaunchSearchParams().agentId
  );

  if (!isAnalyticsDataLoading && analyticsData !== undefined)
    return (
      <Flex
        direction={{ base: 'column', md: 'row' }}
        fontSize={14}
        gap={4}
        justifyContent="flex-start"
        mb={{ base: 3, md: 3 }}
        width="100%"
      >
        <Stack>
          <Flex background="base.700" borderRadius={4} direction="column" p={3}>
            <Flex>
              <Heading size="sm">{analyticsData.msg_count}</Heading>
            </Flex>
            <Flex>Agent Engagement</Flex>
          </Flex>
        </Stack>
        <Stack>
          <Flex background="base.700" borderRadius={4} direction="column" p={3}>
            <Flex>
              <Heading size="sm">{analyticsData.user_count}</Heading>
            </Flex>
            <Flex>Unique Users</Flex>
          </Flex>
        </Stack>
      </Flex>
    );
};

export default AgentAnalytics;
