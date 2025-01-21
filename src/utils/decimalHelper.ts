import { BN } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';

import { NumberTypeWithBN } from '@app-types/index';
import { TransformBNToDecimal } from '@app-types/utils';

Decimal.set({ precision: 35, rounding: 1 });

class BaseDecimal {
  static isDecimal(value: NumberTypeWithBN): boolean {
    return Decimal.isDecimal(value);
  }

  static toDecimal(value: NumberTypeWithBN): Decimal {
    if (value instanceof BN) {
      return new Decimal(value.toString());
    }
    if (BaseDecimal.isDecimal(value)) {
      return value as Decimal;
    }
    return new Decimal(value);
  }
}

/**
 * Recursively converts all `BN` instances within an object to `Decimal`
 * using `BaseDecimal.toDecimal(value)`.
 *
 * @param obj - The object to transform, which may contain nested objects or arrays of `BN`.
 * @returns A new object where all `BN` instances are converted to `Decimal`.
 */
export function convertBNToDecimal<T>(obj: T): TransformBNToDecimal<T> {
  // Check if the object is an instance of `BN` and convert to Decimal
  if (obj instanceof BN) {
    return BaseDecimal.toDecimal(obj) as TransformBNToDecimal<T>;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertBNToDecimal(item)) as unknown as TransformBNToDecimal<T>;
  }

  if (obj && typeof obj === 'object' && !(obj instanceof PublicKey)) {
    const result: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = convertBNToDecimal(obj[key]);
      }
    }
    return result as TransformBNToDecimal<T>;
  }

  // For primitive values (string, number, etc.), return as-is
  return obj as TransformBNToDecimal<T>;
}

export const ONE = BaseDecimal.toDecimal(1_000_000_000);
export const ONE_TOKEN = BaseDecimal.toDecimal(1_000_000);
export const ZERO = BaseDecimal.toDecimal(0);

export { Decimal as DecimalType };
export default BaseDecimal;
