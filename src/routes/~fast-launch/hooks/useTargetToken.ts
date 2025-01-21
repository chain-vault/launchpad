import { useTokenMetadata } from '@hooks/useToken';

import { useFastLaunchParams } from './useFastLaunchParams';

export const useTargetToken = () => {
  const params = useFastLaunchParams();
  const meta = useTokenMetadata(params.tokenAddress, true);
  return meta;
};
