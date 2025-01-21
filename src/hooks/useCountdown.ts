import { useCallback, useEffect, useState } from 'react';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { LBPPoolStatus } from '@app-types/index';

import { EventManager } from '@utils/eventBus';
import { getPoolStatus, PoolCurrentStatus } from '@utils/poolStatus';

dayjs.extend(duration);

export const useCountDown = (
  startDate: number,
  endDate: number,
  poolId: string
): { countdown: string; status: LBPPoolStatus } | undefined => {
  const [coundown, setCountdown] = useState<{ countdown: string; status: LBPPoolStatus }>();
  const [currentPoolStatus, setCurrentPoolStatus] = useState<PoolCurrentStatus>();

  const updatePoolStatus = useCallback(() => {
    const status = getPoolStatus(startDate, endDate);
    setCurrentPoolStatus(status);
    const poolEvent = EventManager.getInstance('poolEvents');
    poolEvent.dispatchCustomEvent(poolId, status);

    return status;
  }, [endDate, poolId, startDate]);

  const showRemaining = useCallback(() => {
    const end = currentPoolStatus?.targetDate ? dayjs.unix(currentPoolStatus.targetDate) : 0;
    const now = dayjs();

    const distance = end ? end.toDate().getTime() - now.toDate().getTime() : 0;

    if (distance > 0) {
      return (
        currentPoolStatus && {
          countdown: dayjs.duration(distance).format('DD[D] H[H] mm[M] ss[S]'),
          status: currentPoolStatus?.status,
        }
      );
    }
    const status = updatePoolStatus();

    const newStatusEnd = status?.targetDate ? dayjs.unix(status.targetDate) : 0;
    const newStatusDistance =
      newStatusEnd ? newStatusEnd.toDate().getTime() - now.toDate().getTime() : 0;

    if (newStatusDistance > 0)
      return {
        countdown: dayjs.duration(newStatusDistance).format('DD[D] H[H] mm[M] ss[S]'),
        status: status.status,
      };

    // completed pool
    return {
      countdown: '',
      status: status.status,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPoolStatus?.targetDate, currentPoolStatus?.status, updatePoolStatus]);

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = showRemaining();
      setCountdown(remaining);
      if (!remaining?.countdown) {
        clearInterval(timer);
      }
    }, 1000);

    // Set initial time immediately
    updatePoolStatus();
    setCountdown(showRemaining());

    return () => {
      clearInterval(timer);
    };
  }, [showRemaining, updatePoolStatus]);

  return coundown;
};
