import { createFileRoute } from '@tanstack/react-router';

import ProfileSection from './components';

type ProfileSearchParam = {
  user: string;
  view: 'lbp' | 'pump';
};

export const Route = createFileRoute('/profile/')({
  component: () => <ProfileSection />,
  validateSearch: (search: Record<string, unknown>): ProfileSearchParam => ({
    user: (search.user as string) || '',
    view: (search.view as 'lbp' | 'pump') || 'lbp',
  }),
});
