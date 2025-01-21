import { useGetPoolById } from '@hooks/lbp/useGetPool';

import { usePoolId } from './usePoolId';

export const useTokenAddress = () => {
  const poolId = usePoolId();
  const { data: poolData } = useGetPoolById(poolId);

  return poolData?.token.toString() ?? undefined;
};
