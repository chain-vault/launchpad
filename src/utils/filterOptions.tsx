import { LuCalendarCheck2 } from 'react-icons/lu';
import { MdWifiTetheringErrorRounded } from 'react-icons/md';

import { LBPPoolStatus } from '@app-types/index';

export const filterOptions = [
  {
    icon: <MdWifiTetheringErrorRounded />,
    label: 'Live',
    value: LBPPoolStatus.LIVE_NOW,
  },
  {
    icon: <LuCalendarCheck2 />,
    label: 'Upcoming',
    value: LBPPoolStatus.COMING_SOON,
  },
  {
    icon: <LuCalendarCheck2 />,
    label: 'All',
    value: 'All',
  },
];
