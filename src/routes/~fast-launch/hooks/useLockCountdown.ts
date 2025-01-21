import { useEffect, useState } from 'react';

import dayjs, { Dayjs } from 'dayjs';

import { formatLockDuration } from '@utils/lockDurationFormatter';

export const useTokenLock = (endTime: Dayjs | undefined, disableAutoRefresh: boolean = false) => {
  const getLockdata = () => ({
    isLockActive: endTime ? !dayjs().isAfter(endTime) : false,
    label: endTime ? formatLockDuration(endTime) : '',
  });
  const [state, setState] = useState<{
    isLockActive: boolean;
    label: string;
  }>(getLockdata());
  useEffect(() => {
    if (disableAutoRefresh) {
      return;
    }
    const timer = setInterval(() => {
      setState(getLockdata());
      if (!getLockdata().isLockActive) {
        clearInterval(timer);
      }
    }, 1000);
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  });
  return {
    ...state,
    getLockdata,
  };
};
