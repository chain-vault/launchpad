import { createFileRoute } from '@tanstack/react-router';

import FastLaunchList from './components/FastLaunchList';

export const Route = createFileRoute('/launches/pump/')({
  component: () => <FastLaunchList />,
});
