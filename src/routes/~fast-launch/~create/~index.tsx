import { createFileRoute } from '@tanstack/react-router';

import { useApeinEventsHandler } from '@hooks/apein/useTradeListener';

import { CreateFastLaunch } from '../components/Create';

export const Route = createFileRoute('/fast-launch/create/')({
  component: function Render() {
    useApeinEventsHandler();
    return <CreateFastLaunch />;
  },
});
