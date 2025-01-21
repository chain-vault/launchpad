import { type BN } from '@coral-xyz/anchor';
import { type PublicKey } from '@solana/web3.js';

import { DecimalType } from '@utils/decimalHelper';

/** Type for type safe Object.entries
 * @usage: const typedEntries = (Object.entries(data) as Entries<typeof data>).map(
                ([key, value]) => [key, value],
                // ^? (parameter) key: "a" | "b" | "c"
           );
 */
export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

/**
 * Recursive type to transform all `BN` instances in a type `T` to `Decimal`
 * and all `Decimal` instances to `DecimalType`, preserving other types as they are.
 *
 * - If `T` is exactly `BN`, it is replaced with `Decimal`.
 * - If `T` is exactly `Decimal`, it is replaced with `DecimalType`.
 * - If `T` is exactly `DecimalType`, it remains as `DecimalType`.
 * - If `T` is an object, it recursively applies the transformation to each property.
 * - All other types are left unchanged.
 *
 * @example
 * type Example = {
 *   amount: BN;
 *   description: string;
 *   metadata: {
 *     value: Decimal;
 *     nested: {
 *       price: BN;
 *     };
 *   };
 * };
 *
 * type TransformedExample = DeepTransformBNToDecimal<Example>;
 *  {
 *    amount: Decimal;
 *    description: string;
 *    metadata: {
 *      value: DecimalType;
 *      nested: {
 *        price: Decimal;
 *      };
 *    };
 *  }
 */
export type TransformBNToDecimal<T> =
  T extends BN ? DecimalType
  : T extends DecimalType ? DecimalType
  : T extends PublicKey ? PublicKey
  : {
      [K in keyof T]: TransformBNToDecimal<T[K]>;
    };
