import { useParams, useSearch } from '@tanstack/react-router';

export const useFastLaunchSearchParams = () => {
  const PATH = '/fast-launch/swap/$poolAddress';
  const { poolAddress } = useParams({
    from: PATH,
  });
  const { agentId, referal } = useSearch({
    from: PATH,
  });
  return {
    agentId,
    pool: poolAddress ?? '',
    referal,
  };
};
