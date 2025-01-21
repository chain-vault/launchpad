import { useBreakpointValue } from '@chakra-ui/react';

type BreakpointValues<T> = { [key: string]: T; base: T } | T[];

/**
 * Custom hook to get responsive values based on Chakra UI breakpoints modified from useBreakPointValues.
 * Always sets `ssr: false` for useBreakpointValue.
 *
 * @template T
 * @param {BreakpointValues<T>} values - An object or array containing the values for different breakpoints.
 * @returns {T | undefined} - The value corresponding to the current breakpoint.
 */
function useResponsiveValue<T>(values: BreakpointValues<T>): T | undefined {
  return useBreakpointValue(values, { ssr: false });
}

export default useResponsiveValue;
