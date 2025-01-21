import { useMemo } from 'react';

import { type Idl, Program } from '@coral-xyz/anchor';

import { getNonSignerProvider, useWeb3Provider } from './useWeb3React';

/**
 * Custom hook to get an Anchor program instance.
 *
 * @template T - The type of the Anchor IDL.
 * @param  programIdl - The IDL of the Anchor program.
 * @param  [withSignerIfPossible=true] - Flag indicating whether to use a signer if available.
 * @returns  - The Anchor program instance or null if not available.
 *
 * @example
 * const program = useGetProgramInstance<MyProgramIdl>(idl, true);
 */
export const useGetProgramInstance = <T extends Idl>(
  programIdl: Idl | undefined,
  withSignerIfPossible = true
): null | Program<T> => {
  const provider = useWeb3Provider(withSignerIfPossible);
  return useMemo(() => {
    if (!provider || !programIdl) return null;
    try {
      return new Program<T>(programIdl as T, provider) as Program<T>;
    } catch (error) {
      console.error('Failed to get program', error);
      return null;
    }
  }, [programIdl, provider]);
};

export const getProgramInstance = <T extends Idl>(
  programIdl: Idl | undefined
): null | Program<T> => {
  const provider = getNonSignerProvider();
  if (!provider || !programIdl) return null;
  try {
    return new Program<T>(programIdl as T, provider) as Program<T>;
  } catch (error) {
    console.error('Failed to get program', error);
    return null;
  }
};
