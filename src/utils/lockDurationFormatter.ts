import dayjs, { Dayjs } from 'dayjs';

export const formatLockDuration = (targetDateTime: Dayjs) => {
  if (dayjs().isAfter(targetDateTime)) {
    return '';
  }
  return targetDateTime.fromNow();
};
