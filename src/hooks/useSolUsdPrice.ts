import { useMemo } from 'react';

import apiConfig from '@adapters/api/apiConfig';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import Decimal from 'decimal.js';

import { NumberType } from '@app-types/index';

import { PRICE_FEED_URL } from '@constants/config';

export const useSolUsdPrice = (solInput: NumberType) => {
  const { data, error, isError, isLoading, isPending, isRefetching } = useQuery<AxiosResponse>({
    enabled: !!solInput,
    gcTime: Infinity,
    queryFn: () => apiConfig({ method: 'GET', url: PRICE_FEED_URL }),
    queryKey: ['SOL_PRICE'],
    refetchInterval: 15 * 1000,
    // refetchOnMount: false,
  });

  const usdValue = useMemo(() => {
    if (
      !solInput ||
      (Decimal.isDecimal(solInput) && solInput.isZero()) ||
      isError ||
      !data?.data?.price
    )
      return null;
    const USD = new Decimal(solInput).mul(data.data.price).toString();
    return USD;
  }, [data?.data?.price, isError, solInput]);

  return {
    error,
    isLoading,
    isPending,
    isRefetching,
    usdValue,
  };
};
