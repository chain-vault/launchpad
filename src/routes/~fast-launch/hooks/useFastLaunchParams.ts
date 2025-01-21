import { useParams } from '@tanstack/react-router';

import { useGetPoolById } from '@hooks/apein/useGetPool';

export const useFastLaunchParams = () => {
  const { poolAddress } = useParams({
    from: '/fast-launch/swap/$poolAddress',
  });
  const { data: poolData } = useGetPoolById(poolAddress);
  return {
    tokenAddress: poolData?.token.toString() ?? '',
  };
};
