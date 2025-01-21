import { useParams } from '@tanstack/react-router';

export const usePoolId = (): string => {
  const { poolAddress } = useParams({
    from: '/lbp/swap/$poolAddress',
  });
  return poolAddress;
};
