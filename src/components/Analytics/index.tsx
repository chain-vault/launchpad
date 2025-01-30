import { useFastLaunchSearchParams } from "@routes/~fast-launch/hooks/useFastLaunchSearchParams";
import { useGetAgentAnalytics } from "@routes/~fast-launch/hooks/useGetAgentInfo";


const AgentAnalytics = () => {
    const {data: analyticsData , isLoading: isAnalyticsDataLoading} = useGetAgentAnalytics(useFastLaunchSearchParams().agentId);
    
  if(!isAnalyticsDataLoading && analyticsData !== undefined)
  return (
    <div>
      <div>{analyticsData.msg_count}</div>
      <div>{analyticsData.user_count}</div>
    </div>
  )
}

export default AgentAnalytics;