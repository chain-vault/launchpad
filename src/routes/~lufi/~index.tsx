import { createFileRoute } from '@tanstack/react-router';

import PoolSettings from './PoolSettings';

export const Route = createFileRoute('/lufi/')({
  component: () => <PoolSettings />,
});
