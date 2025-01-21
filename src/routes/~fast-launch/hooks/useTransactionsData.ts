import { useEffect, useMemo, useState } from 'react';

import { useQuery } from '@apollo/client';
import { IdlEvents } from '@coral-xyz/anchor';
import TOKENS_DATA_QUERY from '@integrations/graphql/queries/tokens';

import { SortOptions } from '@app-types/index';

import { DEFAULT_TOKEN_DECIMAL, NATIVE_TOKEN, NATIVE_TOKEN_DECIMAL } from '@constants/config';
import { useGetPoolById } from '@hooks/apein/useGetPool';
import { ApeInEventType, useApeinEventsHandler } from '@hooks/apein/useTradeListener';
import { useTokenMetadata } from '@hooks/useToken';
import { ApeonFastlaunch } from '@idl/fastlaunch';
import { convertBNToDecimal } from '@utils/decimalHelper';
import { Token } from '@utils/token';

import { useFastLaunchSearchParams } from './useFastLaunchSearchParams';

export type Transaction = {
  amountIn: string;
  amountOut: string;
  amountSOL: string;
  amountUSD: string;
  caller: string;
  eventType: string;
  signature: string;
  timestamp: number;
  tokenInAddr: string;
  tokenPrice: string;
};

const isBuyEvent = (
  _event: ApeInEventType,
  eventName: string
): _event is IdlEvents<ApeonFastlaunch>['poolBuyEvent'] => eventName === 'poolBuyEvent';

const isSellEvent = (
  _event: ApeInEventType,
  eventName: string
): _event is IdlEvents<ApeonFastlaunch>['poolSellEvent'] => eventName === 'poolSellEvent';

export const useTransactionsData = (sort: `${SortOptions}` = SortOptions.asc) => {
  const { pool } = useFastLaunchSearchParams();

  const { data: poolData } = useGetPoolById(pool);
  const [eventsData, setEventsData] = useState<Transaction[]>([]);
  const { poolTokenMetadata } = useTokenMetadata(poolData?.token.toString() || '', true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { called, data, error, loading } = useQuery(TOKENS_DATA_QUERY, {
    context: { apiName: 'apein' },
    fetchPolicy: 'no-cache',
    skip: !poolData || !poolData?.token,
    variables: {
      id: poolData?.token.toString() as string,
    },
  });

  useEffect(() => {
    if (!called) {
      return;
    }
    setIsLoading(loading);
  }, [loading, called]);

  useApeinEventsHandler(undefined, (event, time, eventName, signature) => {
    const isBuy = isBuyEvent(event, eventName);
    const isSell = isSellEvent(event, eventName);

    if ((isBuy || isSell) && event.id.toString() === pool) {
      const formattedEvent = convertBNToDecimal(event);
      const { amountIn, amountOut, tokenPrice } = formattedEvent;
      setEventsData((prev) => [
        ...prev,
        {
          amountIn: Token.fromRawAmount(
            amountIn,
            isBuy ? NATIVE_TOKEN.decimal : DEFAULT_TOKEN_DECIMAL
          ).toString(),
          amountOut: Token.fromRawAmount(
            amountOut,
            !isBuy ? NATIVE_TOKEN.decimal : DEFAULT_TOKEN_DECIMAL
          ).toString(),
          amountSOL: Token.fromRawAmount(
            isBuy ? amountIn : amountOut,
            NATIVE_TOKEN_DECIMAL
          ).toString(),
          amountUSD: '',
          caller: formattedEvent.trader.toString(),
          eventType: eventName,
          signature: signature || '',
          timestamp: time,
          tokenInAddr: formattedEvent.token.toString(),
          tokenPrice: Token.fromRawAmount(tokenPrice).toString(),
        },
      ]);
    }
  });
  const formattedData = useMemo(() => {
    const formated: Transaction[] = [...(data?.token?.swaps || []), ...eventsData]
      .map((item) => ({
        amountIn: item.amountIn,
        amountOut: item.amountOut,
        amountSOL: item.amountSOL,
        amountUSD: item.amountUSD,
        caller: item.caller,
        eventType: item.eventType,
        signature: item.signature,
        timestamp: item.timestamp,
        tokenInAddr: item.tokenInAddr,
        tokenPrice: item.tokenPrice ?? '',
      }))
      .sort((a, b) =>
        sort === SortOptions.dsc ? b.timestamp - a.timestamp : a.timestamp - b.timestamp
      );
    return formated;
  }, [data?.token?.swaps, eventsData, sort]);

  return useMemo(
    () => ({
      data: formattedData,
      error,
      loading: isLoading,
      symbol: poolTokenMetadata?.symbol,
    }),
    [error, formattedData, isLoading, poolTokenMetadata?.symbol]
  );
};
