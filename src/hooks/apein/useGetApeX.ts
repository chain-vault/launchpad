import { useMemo } from 'react';

import { PublicKey } from '@solana/web3.js';
import dayjs from 'dayjs';

import { CurveSettings, PoolWithTokenData } from '@app-types/apiIn';

import { isLegacyPool } from '@constants/pools';
import { usePairData } from '@hooks/usePairData';
import BaseDecimal, { DecimalType } from '@utils/decimalHelper';

import usePoolData from './useFastLaunchListWithToken';
import { useGetAllCurveSettings } from './useGetCurveSettings';

let maxParticipants = 0;
let minParticipants = 1000;

const isPoolLessThan48HoursOld = (thresholdTime: null | number): boolean => {
  if (!thresholdTime) return true;
  const createdAtDate = dayjs.unix(thresholdTime);
  const fortyEightHoursAgo = dayjs().subtract(24, 'hours');
  return createdAtDate.isAfter(fortyEightHoursAgo);
};

const calculatePoolScore = (pool: PoolWithTokenData, curveSettings: CurveSettings) => {
  const apedWeight = 0.5;
  const progressWeight = 0.3;
  const marketCapWeight = 0.2;
  const recencyWeight = 0.6;

  if (
    (!isPoolLessThan48HoursOld(pool.curveThresholdTime) && pool.curveThresholdReached) ||
    isLegacyPool(pool.poolId)
  ) {
    return 0;
  }

  // Normalized score for each factor
  const apedScore =
    (pool.participantsCount - minParticipants) / (maxParticipants - minParticipants || 1);
  // const progressScore = pool.bondingCurveProgress < 100 ? pool.bondingCurveProgress / 100 : 0;
  const progressScore = pool.bondingCurveProgress / 100;

  const marketCapScore = DecimalType.min(
    pool.marketCap.dividedBy(curveSettings.targetMarketcap),
    BaseDecimal.toDecimal(1)
  ).toNumber(); // Scale market cap between 0 and 1  const recencyScore = 1 / (Date.now() - pool.createdAt); // More recent pools score higher
  const recencyScore =
    1 / dayjs().diff(dayjs(pool.lastTransactionTime || pool.createdAt), 'millisecond'); // More recent pools score higher

  return (
    apedScore * apedWeight +
    progressScore * progressWeight +
    marketCapScore * marketCapWeight +
    recencyScore * recencyWeight
  );
};

export function sortPools(
  pools: PoolWithTokenData[],
  getCurveSettingsById: (id: PublicKey | string) => CurveSettings | null
): PoolWithTokenData[] {
  // Separate pools into active, completed, and max market cap
  const activePools = pools.filter((pool) => {
    const curveSettings = pool.curveAccount ? getCurveSettingsById(pool.curveAccount) : null;

    return (
      curveSettings &&
      !pool.curveThresholdReached &&
      pool.marketCap.lessThan(curveSettings.targetMarketcap)
    );
  });
  const completedOrMaxCapPools = pools.filter((pool) => {
    const curveSettings = pool.curveAccount ? getCurveSettingsById(pool.curveAccount) : null;
    if (!curveSettings) return true;
    return (
      pool.curveThresholdReached ||
      pool.marketCap.greaterThanOrEqualTo(curveSettings.targetMarketcap)
    );
  });

  // Sort active pools by score
  activePools.sort((a, b) => {
    const settingsA = a.curveAccount ? getCurveSettingsById(a.curveAccount) : null;
    const settingsB = b.curveAccount ? getCurveSettingsById(b.curveAccount) : null;
    if (!settingsA || !settingsB) {
      return 1;
    }
    return calculatePoolScore(b, settingsB) - calculatePoolScore(a, settingsA);
  });

  // Sort completed or max cap pools by a chosen metric, e.g., apedCount
  completedOrMaxCapPools.sort((a, b) => b.participantsCount - a.participantsCount); // Adjust as needed

  // Combine both arrays, with active pools first
  return [...activePools, ...completedOrMaxCapPools];
}

const useGetApeX = () => {
  const { data, isLoading, isTokensLoading } = usePoolData();
  const { isLoading: isPairDataLoading, pairData } = usePairData(true);
  const {
    curveSettings,
    getCurveSettingsById,
    isLoading: curveSettingsLoading,
  } = useGetAllCurveSettings();

  const sortedPools = useMemo(() => {
    if (!curveSettings) return [];

    // remove legacy pools from the list
    const formattedData = data.filter((pool) => !isLegacyPool(pool.poolId));
    const poolDataWithCurveCompletionTime = formattedData.map((pool) => ({
      ...pool,
      curveThresholdTime: pairData?.[pool.poolId.toString()]?.curveThresholdTime,
      lastTransactionTime: pairData?.[pool.poolId.toString()]?.lastTransactionTime,
    }));
    // this logic wont be effificient if the pools count is too large
    poolDataWithCurveCompletionTime.forEach((pool) => {
      maxParticipants = Math.max(maxParticipants, pool.participantsCount);
      minParticipants = Math.min(minParticipants, pool.participantsCount);
    });
    return poolDataWithCurveCompletionTime.sort((a, b) => {
      const settingsA = a.curveAccount ? getCurveSettingsById(a.curveAccount) : null;
      const settingsB = b.curveAccount ? getCurveSettingsById(b.curveAccount) : null;
      if (!settingsA || !settingsB) {
        return 1;
      }
      return calculatePoolScore(b, settingsB) - calculatePoolScore(a, settingsA);
    });
    // show the apex as recently completed pools (update later)
    // return sortPools(data, getCurveSettingsById);
  }, [curveSettings, data, getCurveSettingsById, pairData]);

  return {
    apeXdata: sortedPools,
    isLoading: curveSettingsLoading || isLoading || isTokensLoading || isPairDataLoading,
  };
};

export default useGetApeX;
