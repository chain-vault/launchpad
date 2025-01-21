import { LAMPORTS_PER_SOL } from '@solana/web3.js';

import { BigIntish } from '@app-types/index';

import BaseDecimal, { DecimalType } from './decimalHelper';

/**
 * Converts a raw amount (in lamports) to a decimal value (in readable format) based on the specified decimals.
 * @param value - The raw amount to convert.
 * @param decimals - The number of decimal places.
 * @returns  The converted decimal value.
 */
export const fromReadableValuesFromDecimals = (value: BigIntish, decimals?: BigIntish) => {
  const valueInNumber = Number(value);
  const decimalsNumber = Number(decimals);

  // Check if they are valid numbers
  if (!Number.isNaN(valueInNumber)) {
    // Adjust balance by dividing by 10^decimals
    const divisor =
      decimalsNumber ? BaseDecimal.toDecimal(10).pow(decimalsNumber) : LAMPORTS_PER_SOL;

    const convertedValue = BaseDecimal.toDecimal(valueInNumber).div(divisor);

    return convertedValue.toDP(decimalsNumber || 9);
  }
  return BaseDecimal.toDecimal(0);
};

/**
 * Converts a value (readable number) to a raw amount (in lamports) based on the specified decimals.
 * @param value - The decimal value to convert.
 * @param decimals - The number of decimal places.
 * @returns The converted raw amount as a string without decimal points (if decimal is >= 0.5 round off to next value).
 * @deprecated
 */
export const convertReadableValuesToDecimalsV1 = (
  value: BigIntish,
  decimals?: BigIntish
): string => {
  const valueInNumber = Number(value);
  const decimalsNumber = Number(decimals);

  // Check if they are valid numbers
  if (!Number.isNaN(valueInNumber)) {
    const valueDecimal = BaseDecimal.toDecimal(valueInNumber);
    // Multiply value by 10^decimals
    const multiplier =
      decimalsNumber ? BaseDecimal.toDecimal(10).pow(decimalsNumber) : LAMPORTS_PER_SOL;

    const rawAmount = valueDecimal.times(multiplier);

    return rawAmount.toFixed(0);
  }
  return '0';
};

/**
 * Converts a value (readable number) to a raw amount (in lamports) based on the specified decimals.
 * @param value - The decimal value to convert.
 * @param decimals - The number of decimal places.
 * @returns The converted raw amount as a string without decimal points (if decimal is >= 0.5 round off to next value).
 */
export const convertReadableValuesToDecimals = (
  value: BigIntish,
  decimals?: BigIntish
): DecimalType => {
  const valueInNumber = Number(value);
  const decimalsNumber = Number(decimals);

  // Check if they are valid numbers
  if (!Number.isNaN(valueInNumber)) {
    const valueDecimal = BaseDecimal.toDecimal(valueInNumber);
    // Multiply value by 10^decimals
    const multiplier =
      decimalsNumber ? BaseDecimal.toDecimal(10).pow(decimalsNumber) : LAMPORTS_PER_SOL;

    const rawAmount = valueDecimal.times(multiplier);

    return rawAmount.floor();
  }
  return BaseDecimal.toDecimal(0);
};
