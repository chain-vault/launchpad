import { createFileRoute } from '@tanstack/react-router';

import { useTransaction } from '@routes/~lbp/~swap/hooks';

import { ListPools } from './components/ListPools';

export const Route = createFileRoute('/launches/lbp/')({
  component: function Render() {
    useTransaction();
    return <ListPools />;
  },
});
