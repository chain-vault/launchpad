import { atom } from 'jotai';

import { EventData } from './types';

export const eventsAtom = atom<EventData[]>([]);

export const addEventsAtom = atom(null, (get, set, newEvent: EventData) => {
  const currentEvents = get(eventsAtom);
  set(eventsAtom, [newEvent, ...currentEvents]);
});

export const price = atom<{ currentPrice: string; startPrice: string }>({
  currentPrice: '',
  startPrice: '',
});
export const updatePriceAtom = atom(
  null,
  (_get, set, newPrice: { currentPrice: string; startPrice: string }) => {
    set(price, newPrice);
  }
);
