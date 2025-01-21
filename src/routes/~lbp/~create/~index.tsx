import { useCallback, useEffect, useRef } from 'react';

import { createFileRoute, useSearch } from '@tanstack/react-router';
import { useSetAtom } from 'jotai';
import omit from 'lodash/omit';

import { defaulPoolData, tokenAndPoolInfoAtom } from './atom';
import CreatePool from './components';

type TokensSearch = {
  draft: string;
};

export const Route = createFileRoute('/lbp/create/')({
  component: function Render() {
    const setTokenAndPoolData = useSetAtom(tokenAndPoolInfoAtom);
    const { draft: draftId } = useSearch({
      from: '/lbp/create/',
    });
    const firstRender = useRef<boolean>(true);

    const cleanup = useCallback(() => {
      // Clean up function to remove the state data if not valuable data is entered
      if (firstRender.current) {
        firstRender.current = false;
      } else {
        setTokenAndPoolData((tokenAndPoolData) => {
          const newState = { ...tokenAndPoolData };
          newState.new = defaulPoolData;
          if (
            draftId !== 'new' &&
            (!newState?.[draftId]?.tokenInfo?.fileArweaveId || newState?.[draftId]?.isDeleted)
          ) {
            return omit(newState, draftId);
          }
          return newState;
        });
      }
    }, [draftId, setTokenAndPoolData]);

    useEffect(() => {
      if (firstRender.current) {
        firstRender.current = false;
      }
      // Cleanup on component unmount
      return () => cleanup();
    }, [cleanup, draftId]);

    useEffect(() => {
      // Cleanup on page reload
      window.addEventListener('beforeunload', cleanup);

      // Cleanup the event listener on component unmount
      return () => {
        window.removeEventListener('beforeunload', cleanup);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <CreatePool />;
  },
  validateSearch: (search: Record<string, unknown>): TokensSearch => ({
    draft: (search.draft as string) ?? 'new',
  }),
});
