/* eslint-disable react-hooks/exhaustive-deps */
import type { Idl, IdlEvents, Program } from '@coral-xyz/anchor';

import { useEffect, useRef } from 'react';

import dayjs from 'dayjs';

import { createEventAsyncIterable } from '@utils/transaction';

/**
 * Custom hook to listen to events from a program and manage state.
 *
 * @template T - The type of the IDL (Interface Definition Language) for the program.
 * @template K - The type of the event name key in the `IdlEvents` for the program.
 * @template E - The type of the event data.
 * @param {Program<T>} program - The program instance to listen for events from.
 * @param {K} eventName - The specific event name to listen for.
 * @returns {E[]} - The state holding the array of events.
 */
export function useEventListener<T extends Idl, K extends keyof IdlEvents<T>, E = IdlEvents<T>[K]>(
  program: null | Program<T>,
  eventName: K,
  eventCallBack: (event: E, eventTime: number, eventName: K, signature: string) => void
): void {
  const abortController = new AbortController();
  const { signal } = abortController;

  const isEventCreated = useRef<boolean>(false);

  const isFirstRender = useRef<boolean>(false);

  useEffect(() => {
    const listenToEvents = async () => {
      if (program) {
        // try {
        //   // eslint-disable-next-line no-restricted-syntax
        //   for await (const event of createEventAsyncIterable(program, eventName, signal)) {
        //     setEvents((prevEvents) => [...prevEvents, event as E]);
        //   }
        // } catch (error) {
        //   console.error('Event listening error:', error);
        // }
        const eventIterable = createEventAsyncIterable(program, eventName, signal);
        const eventIterator = eventIterable[Symbol.asyncIterator]();

        const handleNextEvent = async () => {
          try {
            const { done, value } = await eventIterator.next();

            if (!done) {
              eventCallBack(value.event as E, dayjs().unix(), eventName, value.signature);
              // Schedule the next event handling
              if (!signal.aborted) {
                setTimeout(handleNextEvent, 0); // Use setTimeout to avoid blocking
              }
            }
          } catch (error) {
            console.error('Event listening error:', error);
          }
        };

        handleNextEvent();
      }
    };

    if (!isEventCreated.current && !!program) {
      isEventCreated.current = true;
      listenToEvents();
    }
  }, [program]);

  // only for cleanup on last render
  useEffect(
    () => () => {
      if (!isFirstRender.current) isFirstRender.current = true;
      else abortController.abort();
    },
    []
  );
}
