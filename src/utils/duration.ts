import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const getDuration = (startDate: number, endDate: number) => {
  const start = dayjs.unix(startDate);
  const end = dayjs.unix(endDate);
  return `${end.diff(start, 'hours')}h`;
};

export const getTimeDifference = (timestamp: number): string => {
  const now = dayjs();
  const time = dayjs.unix(timestamp);
  const diffInSeconds = now.diff(time, 'second');

  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  if (diffInSeconds < 3600) return `${now.diff(time, 'minute')}m`;
  if (diffInSeconds < 86400) return `${now.diff(time, 'hour')}h`;
  if (diffInSeconds < 2592000) return `${now.diff(time, 'day')}d`;
  if (diffInSeconds < 31536000) return `${now.diff(time, 'month')}M`;
  return `${now.diff(time, 'year')}y`;
};

export const getTimeDifferenceFromNow = (timestamp: number): string => {
  const now = dayjs();
  const executedTime = dayjs(timestamp * 1000);

  const diffInSeconds = now.diff(executedTime, 'second');
  const diffInMinutes = now.diff(executedTime, 'minute');
  const diffInHours = now.diff(executedTime, 'hour');
  const diffInDays = now.diff(executedTime, 'day');

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  }
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  return `${diffInDays}d ago`;
};
