import { Decimal } from 'decimal.js';

import { NumberType } from '@app-types/index';

export abstract class Weights {
  static readonly MaxWeight = 100;

  static readonly MinWeight = 1;

  static readonly TotalWeight = 100;

  public static getOppositeWeight(weight: NumberType): number {
    const decimalWeight = new Decimal(weight);
    const totalWeight = new Decimal(Weights.TotalWeight);
    return totalWeight.minus(decimalWeight).toNumber();
  }
}
