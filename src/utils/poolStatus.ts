import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

import { LBPPoolStatus } from '@app-types/index';

dayjs.extend(isBetween);

export type PoolCurrentStatus = {
  status: LBPPoolStatus;
  targetDate: null | number;
};

/**
 * Determines the pool status based on the start and end dates.
 *
 * @param startDate - The Unix timestamp for the pool start date.
 * @param endDate - The Unix timestamp for the pool end date.
 * @returns An object containing the pool status text and target date.
 */
export const getPoolStatus = (startDate: number, endDate: number): PoolCurrentStatus => {
  const start = dayjs.unix(startDate);
  const end = dayjs.unix(endDate);
  const now = dayjs();

  // Check if the pool is live now
  if (now.isBetween(start, end)) {
    return {
      status: LBPPoolStatus.LIVE_NOW,
      targetDate: endDate,
    };
  }

  // Check if the pool is coming soon
  if (now.isBefore(start)) {
    return {
      status: LBPPoolStatus.COMING_SOON,
      targetDate: startDate,
    };
  }

  // Default to pool completed status
  return {
    status: LBPPoolStatus.COMPLETED,
    targetDate: null,
  };
};
