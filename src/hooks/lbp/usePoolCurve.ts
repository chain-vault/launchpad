import { useEffect, useMemo, useRef, useState } from 'react';

import { useQuery } from '@apollo/client';
import TOKENS_DATA_QUERY from '@integrations/graphql/queries/tokens';
import dayjs from 'dayjs';
import Decimal from 'decimal.js';
import { useAtomValue } from 'jotai';
import uniqBy from 'lodash/uniqBy';

import { LBPPoolStatus } from '@app-types/index';
import { PoolCurveData } from '@app-types/poolAndToken';

import {
  DEFAULT_TOKEN_DECIMAL,
  NATIVE_TOKEN_ADDRESS,
  NATIVE_TOKEN_DECIMAL,
} from '@constants/config';
import { eventsAtom } from '@routes/~lbp/~swap/atom';
import { usePoolId } from '@routes/~lbp/~swap/hooks/usePoolId';
import { EventData } from '@routes/~lbp/~swap/types';
import { getPoolStatus } from '@utils/poolStatus';
import { PoolWeightedMath } from '@utils/poolWeightedMath';
import { Token } from '@utils/token';

import { useGetPoolById } from './useGetPool';

export const CurveTotalIterations = 500;

type PoolCurveItem = {
  time: number;
  value: number;
};

export const usePredictedPoolCurve = () => {
  const { data: poolData } = useGetPoolById(usePoolId());

  return useMemo(() => {
    if (!poolData) return [];
    const {
      collateralBalance,
      endAt: endTime,
      projectTokenBalance,
      projectTokenEndWeight,
      projectTokenStartWeight,
      startAt,
    } = poolData;

    if (
      !collateralBalance ||
      !endTime ||
      !projectTokenBalance ||
      !projectTokenEndWeight ||
      !projectTokenStartWeight ||
      !startAt
    )
      return [];

    const poolStatus = getPoolStatus(startAt, endTime);

    if (poolStatus.status === LBPPoolStatus.COMING_SOON) {
      const chartData = new Array(CurveTotalIterations).fill(undefined).map((_, iteration) => {
        const spotPriceData = PoolWeightedMath.iteratedSpotPrice({
          collateralTokenAmount: collateralBalance,
          endTime,
          endWeight: projectTokenEndWeight,
          iteration,
          projectTokenAmount: projectTokenBalance,
          startTime: startAt,
          startWeight: projectTokenStartWeight,
          totalIterations: CurveTotalIterations,
        });

        const curveData: PoolCurveData = {
          ...spotPriceData,
          //   color: 'red',
        } as PoolCurveData;

        return curveData;
      });

      const uniqueDatas = uniqBy(chartData, 'time');
      return uniqueDatas;
    }

    return [];
  }, [poolData]);
};

export const usePoolCurve = (
  currentPoolStatus?: LBPPoolStatus
): [PoolCurveData[], PoolCurveData[], boolean] => {
  const [timer, setTimer] = useState(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (currentPoolStatus === LBPPoolStatus.LIVE_NOW) {
      const updateTimer = () => {
        setTimer(Date.now());
      };

      intervalRef.current = setInterval(updateTimer, 30000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentPoolStatus]);

  const { data: poolData, isLoading: isPoolDataLoading } = useGetPoolById(usePoolId());
  const collateralTokenDecimal = NATIVE_TOKEN_DECIMAL;
  const projectTokenDecimal = DEFAULT_TOKEN_DECIMAL;

  const eventDatas = useAtomValue(eventsAtom);

  const { data: swapTransactionData, loading: swapTransactionDataLoading } = useQuery(
    TOKENS_DATA_QUERY,
    {
      skip: !poolData?.token.toString(),
      variables: {
        id: poolData?.token.toString() ?? '',
      },
    }
  );

  const formattedSwapData: Omit<
    EventData,
    'formatedDate' | 'id' | 'signature' | 'tokenInAddress' | 'tokenOutAddress' | 'trader'
  >[] = useMemo(() => {
    if (!swapTransactionData) return [];
    return swapTransactionData.token.swaps.map((eachSwap) => ({
      amountIn: eachSwap.amountIn,
      amountOut: eachSwap.amountOut,
      collateralTokenBalance: eachSwap.amountSOL,
      date: eachSwap.timestamp,
      eventName:
        eachSwap.tokenInAddr.toLowerCase() === NATIVE_TOKEN_ADDRESS ?
          'poolBuyEvent'
        : 'poolSellEvent',
      projectTokenBalance: eachSwap.amountIn,
    }));
  }, [swapTransactionData]);

  const historyData = [...eventDatas, ...formattedSwapData].sort((a, b) => a.date - b.date);

  const isLoading = isPoolDataLoading || swapTransactionDataLoading;

  return useMemo(() => {
    if (!poolData || isLoading) return [[], [], isLoading];
    const {
      collateralBalance,
      endAt: endTime,
      projectTokenBalance,
      projectTokenEndWeight: endWeight,
      projectTokenStartWeight: startWeight,
      startAt: startTime,
      startCollaterolAmount,
      startProjectAmount,
    } = poolData;
    const result: PoolCurveItem[] = [];
    const predictedResult: PoolCurveItem[] = [];

    const now = dayjs().unix();

    const totalPoolCurveIteration = PoolWeightedMath.getTotalCurveIteration({ endTime, startTime });

    if (currentPoolStatus === LBPPoolStatus.COMING_SOON) return [[], [], isLoading];

    if (currentPoolStatus === LBPPoolStatus.COMPLETED && intervalRef.current)
      clearInterval(intervalRef.current);

    const pushPoolCurveItem = (
      spotPrice: PoolWeightedMath.IteratedSpotPrice,
      isResult: boolean
    ): void => {
      const newItem: PoolCurveItem = spotPrice;

      if (isResult) {
        result.push(newItem);
      }
      predictedResult.push(newItem);
    };

    // Set initial values
    let historyIndex = 0;

    // mainAmount referred as project amount and base amount referred as collaretal amount
    let mainAmount = Token.fromRawAmount(startProjectAmount, projectTokenDecimal);
    let baseAmount = Token.fromRawAmount(startCollaterolAmount, collateralTokenDecimal);

    // For each iteration of the chart
    for (let i = 0; i < totalPoolCurveIteration; i += 1) {
      const { iterationInterval, iterationTimestamp } = PoolWeightedMath.timeInterval({
        endTime,
        iteration: i,
        startTime,
        totalIterations: totalPoolCurveIteration,
      });

      const iterationEndingTimestamp = iterationTimestamp + iterationInterval;

      const spotPrice = PoolWeightedMath.iteratedSpotPrice({
        collateralTokenAmount: baseAmount,
        endTime,
        endWeight,
        iteration: i,
        projectTokenAmount: mainAmount,
        startTime,
        startWeight,
        totalIterations: totalPoolCurveIteration,
      });

      pushPoolCurveItem(spotPrice, iterationEndingTimestamp <= now);

      // If now is between the current iteration
      if (now < iterationEndingTimestamp && now > iterationTimestamp) {
        const {
          collateralWeight: currentCollateralTokenWeight,
          projectTokenWeight: currentProjectTokenWeight,
        } = PoolWeightedMath.currentWeights(poolData);

        const nowSpotPrice = PoolWeightedMath.spotPrice({
          collateralTokenAmount: Token.fromRawAmount(collateralBalance),
          collateralTokenWeight: currentCollateralTokenWeight,
          projectTokenAmount: Token.fromRawAmount(projectTokenBalance, DEFAULT_TOKEN_DECIMAL),
          projectTokenWeight: currentProjectTokenWeight,
        });

        const nowSpotPriceElement = { time: now, value: Number(nowSpotPrice) };
        pushPoolCurveItem(nowSpotPriceElement, true);
        // eslint-disable-next-line no-continue
        continue;
      }

      // For each history in this iteration of the chart
      for (let j = historyIndex; j < historyData.length; j += 1) {
        historyIndex = j;
        if (historyData[j].date > iterationEndingTimestamp) {
          break;
        }

        if (historyData[j].eventName === 'poolSellEvent') {
          mainAmount = mainAmount.add(new Decimal(historyData[j].amountIn));
          baseAmount = baseAmount.sub(new Decimal(historyData[j].amountOut));
        } else {
          mainAmount = mainAmount.sub(new Decimal(historyData[j].amountOut));
          baseAmount = baseAmount.add(new Decimal(historyData[j].amountIn));
        }

        // ends the loop if the history is the last one
        if (historyIndex === historyData.length - 1) {
          historyIndex += 1;
        }
      }
    }

    const reultsWithUniqueTime = uniqBy(result, 'time');

    if (!reultsWithUniqueTime.length)
      return [[predictedResult[0]], predictedResult, isLoading] as [
        PoolCurveData[],
        PoolCurveData[],
        boolean,
      ];

    return [reultsWithUniqueTime, predictedResult, isLoading] as [
      PoolCurveData[],
      PoolCurveData[],
      boolean,
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    collateralTokenDecimal,
    historyData,
    isLoading,
    poolData,
    projectTokenDecimal,
    timer,
    currentPoolStatus,
  ]);
};
