import dayjs from 'dayjs';

export const formatDate = (timestamp?: number, short: boolean = false): string =>
  timestamp ? dayjs.unix(timestamp).format(`DD MMM[,] YYYY${!short ? ' [-] HH:mm' : ''}`) : '-';
export const formatDate2 = (timestamp?: number): string =>
  timestamp ? dayjs.unix(timestamp).fromNow() : '';
