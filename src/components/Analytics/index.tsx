import { Card, CardBody, CardHeader, Flex, Heading, Stack } from "@chakra-ui/react";

import { useFastLaunchSearchParams } from "@routes/~fast-launch/hooks/useFastLaunchSearchParams";
import { useGetAgentAnalytics } from "@routes/~fast-launch/hooks/useGetAgentInfo";


const AgentAnalytics = () => {
  const { data: analyticsData, isLoading: isAnalyticsDataLoading } = useGetAgentAnalytics(useFastLaunchSearchParams().agentId);

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
        <Card size="sm">
          <CardHeader>
            <Heading size='md'>{analyticsData.msg_count}</Heading>
          </CardHeader>
          <CardBody>
            Messages sent
          </CardBody>
        </Card>
      </Stack>
      <Stack>
        <Card size="sm">
          <CardHeader>
            <Heading size='md'>{analyticsData.user_count}</Heading>
          </CardHeader>
          <CardBody>
            User Count
          </CardBody>
        </Card>
      </Stack>
    </Flex>
    )
}

export default AgentAnalytics;