import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';

dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  relativeTime: {
    d: '1 day',
    dd: '%d days',
    future: '%s',
    h: '1 hour',
    hh: '%d hours',
    m: '1 minute',
    M: '1 month',
    mm: '%d minutes',
    MM: '%d months',
    past: '%s ago',
    s: '%d seconds',
    y: '1 year',
    yy: '%d years',
  },
});
