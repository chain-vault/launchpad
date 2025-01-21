/* eslint-disable no-await-in-loop */
import type { Idl, IdlEvents, Program } from '@coral-xyz/anchor';
import type { Connection, TransactionError, TransactionSignature } from '@solana/web3.js';

import * as Sentry from '@sentry/browser';
import isFunction from 'lodash/isFunction';

/* eslint-disable no-console */
import {
  FAST_LAUNCH_PROGRAM_ERRORS_MAP,
  LBP_PROGRAM_ERRORS_MAP,
  NETWORK_ERROR,
  PROGRAM_ERROR,
  TRANSACTION_TIMED_OUT,
} from '@constants/programErrors';

type EventHandler<T> = (event: T, slot?: number, signature?: string) => void;

type CustomInstructionError = {
  InstructionError: [number, { Custom?: number }];
};

export const DEFAULT_TIMEOUT = 31000;

/**
 * Represents a deferred promise that allows controlling its resolution and rejection.
 * @template T The type of the value promised by the Deferred instance.
 */
export class Deferred<T> {
  /**
   * The promise object associated with this Deferred instance.
   */
  promise: Promise<T>;

  /**
   * Rejects the associated promise with an optional reason.
   * @param {string} [reason] The reason for rejecting the promise.
   */
  reject!: (reason?: string) => void;

  /**
   * Resolves the associated promise with a specified value or another promise-like object.
   * @param {PromiseLike<T> | T} value The value to fulfill the promise with.
   */
  resolve!: (value: PromiseLike<T> | T) => void;

  /**
   * Creates a new Deferred instance.
   */
  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

export async function sleep(ms: number = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getErrorMessage(err: TransactionError, txid: string, isLBP: boolean = true): Error {
  // Send error to sentry
  Sentry.captureException(err, (scope) => {
    scope.setExtra('transaction hash', txid);
    return scope;
  });
  if (typeof err === 'string') {
    return new Error(PROGRAM_ERROR);
  }

  if ('InstructionError' in err) {
    const instructionError = (err as CustomInstructionError).InstructionError;
    const [, error] = instructionError;
    if (typeof error === 'string') return new Error(PROGRAM_ERROR);
    if ('Custom' in error) {
      const errorCode = error.Custom;
      const ERRORS = isLBP ? LBP_PROGRAM_ERRORS_MAP : FAST_LAUNCH_PROGRAM_ERRORS_MAP;
      if (errorCode && errorCode in ERRORS) {
        const customErrorMessage = ERRORS[errorCode];
        if (customErrorMessage) {
          return new Error(customErrorMessage.message);
        }
      } else {
        return new Error(PROGRAM_ERROR);
      }
    }
  }

  return new Error(PROGRAM_ERROR);
}

export async function waitTransactionSignatureConfirmation(
  txid: TransactionSignature,
  connection: Connection,
  isLBP = true,
  timeout: number = DEFAULT_TIMEOUT
) {
  let done = false;
  const result = await new Promise((resolve, reject) => {
    (async () => {
      setTimeout(() => {
        if (done) {
          return;
        }
        done = true;
        console.log('Timed out for txid', txid);
        Sentry.captureException('transaction timeout', (scope) => {
          scope.setExtra('transaction hash', txid);
          return scope;
        });
        reject(new Error(TRANSACTION_TIMED_OUT));
      }, timeout);
      try {
        connection.onSignature(
          txid,
          (sigantureResult) => {
            console.log('WS confirmed', txid, sigantureResult, sigantureResult.err);
            done = true;
            if (sigantureResult.err) {
              const errorMessage = getErrorMessage(sigantureResult.err, txid, isLBP);
              reject(errorMessage);
            } else {
              resolve(sigantureResult);
            }
          },
          connection.commitment
        );
        console.log('Set up WS connection', txid);
      } catch (e) {
        done = true;
        console.log('WS error in setup', txid, e);
        Sentry.captureException(new Error('network error on transaction'), (scope) => {
          scope.setExtra('transaction hash', txid);
          return scope;
        });
        reject(new Error(NETWORK_ERROR));
      }
      while (!done) {
        // eslint-disable-next-line
        (async () => {
          try {
            const signatureStatuses = await connection.getSignatureStatuses([txid]);

            console.log('signatures cancel proposal', signatureStatuses);

            const signatureStatus = signatureStatuses && signatureStatuses.value[0];

            console.log('signature status', signatureStatus, signatureStatuses);

            if (!done) {
              if (!signatureStatus) {
                // console.log('REST null result for', txid, signatureStatus);
              } else if (signatureStatus.err) {
                console.log('REST error for', txid, signatureStatus.err);
                done = true;
                const errorMessage = getErrorMessage(signatureStatus.err, txid, isLBP);
                reject(errorMessage);
              } else if (
                !(
                  signatureStatus.confirmations ||
                  signatureStatus.confirmationStatus === 'confirmed' ||
                  signatureStatus.confirmationStatus === 'finalized'
                )
              ) {
                console.log('REST not confirmed', txid, signatureStatus);
              } else {
                console.log('REST confirmed', txid, signatureStatus);
                done = true;
                resolve(signatureStatus);
              }
            }
          } catch (e) {
            if (!done) {
              console.log('REST connection error: txid', txid, e);
              Sentry.captureException(new Error('network error on transaction'), (scope) => {
                scope.setExtra('transaction hash', txid);
                return scope;
              });

              reject(NETWORK_ERROR);
            }
          }
        })();
        // eslint-disable-next-line no-await-in-loop
        await sleep(3000);
      }
    })();
  });
  done = true;
  return result;
}

/**
 * Creates a promise that resolves when a specific event is emitted by the given program instance. This is specifically used for waiting for particular event with signature
 * @template T The type of the IDL (Interface Definition Language) used by the program.
 * @template K The specific event name from the IDL events.
 * @param {Program<T>} program The Anchor program instance from which to listen for events.
 * @param {K} eventName The name of the event to listen for.
 * @param {AbortSignal} signal The signal used to abort the event listener.
 * @param {Deferred<string>} txIdDeferred The deferred promise for resolving the transaction ID.
 * @param {EventHandler<IdlEvents<T>[K]>} [handler] Optional handler function to process the event.
 * @returns {Promise<void>} A promise that resolves when the event matching the transaction ID is received.
 */
export const createEventPromise = <T extends Idl, K extends keyof IdlEvents<T>>(
  program: Program<T>,
  eventName: K,
  signal: AbortSignal,
  txIdDeferred: Deferred<string>,
  handler?: EventHandler<IdlEvents<T>[K]>
): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    const listener = program.addEventListener(eventName, async (event, slot, signature) => {
      const txId = await txIdDeferred.promise;
      if (signature === txId) {
        if (isFunction(handler)) handler(event, slot, signature);
        resolve();
        program.removeEventListener(listener);
      }
    });

    signal.addEventListener('abort', () => {
      program.removeEventListener(listener);
      reject(new Error(`Event listener for ${eventName.toString()} aborted`));
    });
  });

/**
 * Creates an `AsyncIterable` for listening to events from a given program.
 * The iterator yields events as they are emitted by the program, and it
 * supports cancellation through an `AbortSignal`.
 *
 * @template T - The type of the IDL (Interface Definition Language) for the program.
 * @template K - The type of the event name key in the `IdlEvents` for the program.
 * @param  program - The program instance from which events are to be listened.
 * @param  eventName - The specific event name to listen for.
 * @param  signal - An `AbortSignal` to manage cancellation of event listening.
 * @returns - An `AsyncIterable` that yields events of type `IdlEvents<T>[K]`.
 */
export const createEventAsyncIterable = <T extends Idl, K extends keyof IdlEvents<T>>(
  program: Program<T>,
  eventName: K,
  signal: AbortSignal
): AsyncIterable<{ event: IdlEvents<T>[K]; signature: string }> => {
  let resolveCurrentPromise: (
    value:
      | { event: IdlEvents<T>[K]; signature: string }
      | PromiseLike<{ event: IdlEvents<T>[K]; signature: string }>
  ) => void;
  let rejectCurrentPromise: (reason?: Error) => void;

  const eventQueue: { event: IdlEvents<T>[K]; signature: string }[] = [];
  let currentPromise: null | Promise<{ event: IdlEvents<T>[K]; signature: string }> = null;

  /**
   * Handles incoming events and either resolves the current promise or queues the event.
   * @param  event - The event received from the program.
   */
  const handleEvent = (event: IdlEvents<T>[K], _slot: number, signature: string) => {
    if (resolveCurrentPromise) {
      // Resolve the promise with both the event and the signature as an object
      resolveCurrentPromise({ event, signature });
      currentPromise = null;
    } else {
      eventQueue.push({ event, signature });
    }
  };

  /**
   * Handles error events and rejects the current promise if needed.
   * @param event - The error event received from the program.
   * @param _slot - The slot number associated with the error event.
   * @param _signature - The signature associated with the error event.
   */
  const handleError = (event: IdlEvents<T>['error'], _slot: number, _signature: string) => {
    const error = new Error(`Error event received: ${JSON.stringify(event)}`);
    if (rejectCurrentPromise) {
      rejectCurrentPromise(error);
      currentPromise = null;
    }
  };

  // Add event listeners for the specified event and error events
  let listener: number | undefined = program.addEventListener(eventName, handleEvent);

  let errorListener: number | undefined = program.addEventListener('error', handleError);

  // Handle abortion of event listening
  signal.addEventListener('abort', () => {
    if (listener !== undefined) {
      program.removeEventListener(listener);
      listener = undefined;
    }
    if (errorListener !== undefined) {
      program.removeEventListener(errorListener);
      errorListener = undefined;
    }
    if (rejectCurrentPromise) {
      rejectCurrentPromise(new Error('Event listening aborted.'));
      currentPromise = null;
    }
  });

  /**
   * Creates a new promise for waiting until the next event is received.
   * @returns - A promise that resolves with the next event.
   */
  const createPromise = (): Promise<{ event: IdlEvents<T>[K]; signature: string }> =>
    new Promise<{ event: IdlEvents<T>[K]; signature: string }>((resolve, reject) => {
      resolveCurrentPromise = resolve;
      rejectCurrentPromise = reject;
    });

  return {
    /**
     * Async iterator for the `AsyncIterable` that yields events as they arrive.
     * @returns - An async iterator that yields events.
     */
    async *[Symbol.asyncIterator]() {
      try {
        while (!signal.aborted) {
          if (eventQueue.length > 0) {
            yield eventQueue.shift()!;
          } else {
            currentPromise = createPromise();
            yield await currentPromise;
          }
        }
      } finally {
        if (listener !== undefined) {
          program.removeEventListener(listener);
        }
        if (errorListener !== undefined) {
          program.removeEventListener(errorListener);
        }
      }
    },
  };
};

export async function checkRpcHealth(rpcUrl: string) {
  const requestBody = {
    id: 1,
    jsonrpc: '2.0',
    method: 'getHealth',
  };

  try {
    const response = await fetch(rpcUrl, {
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result.result === 'ok';
  } catch (error) {
    return false;
  }
}
