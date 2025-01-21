import Decimal from 'decimal.js';

import * as logExp from './log-exp';

export const ZERO = new Decimal(0);
export const ONE = new Decimal('1e10'); // 10^9

export const MAX_POW_RELATIVE_ERROR = new Decimal('1e-14'); // 10^(-14)

// Minimum base for the power function when the exponent is 'free' (larger than ONE)
export const MIN_POW_BASE_FREE_EXPONENT = new Decimal('0.7e9'); // 0.7e18

export const add = (a: Decimal, b: Decimal): Decimal => a.plus(b);

export const sub = (a: Decimal, b: Decimal): Decimal => {
  if (b.gt(a)) {
    throw new Error('SUB_OVERFLOW');
  }
  return a.minus(b);
};

export const mulDown = (a: Decimal, b: Decimal): Decimal => a.times(b).div(ONE);

export const mulUp = (a: Decimal, b: Decimal): Decimal => {
  const product = a.times(b);
  if (product.isZero()) {
    return product;
  }
  // The traditional divUp formula is:
  // divUp(x, y) := (x + y - 1) / y
  // To avoid intermediate overflow in the addition, we distribute the division and get:
  // divUp(x, y) := (x - 1) / y + 1
  // Note that this requires x != 0, which we already tested for

  return product.minus(new Decimal(1)).div(ONE).plus(new Decimal(1));
};

export const divDown = (a: Decimal, b: Decimal): Decimal => {
  if (b.isZero()) {
    throw new Error('ZERO_DIVISION');
  }
  if (a.isZero()) {
    return a;
  }
  return a.times(ONE).div(b);
};

export const divUp = (a: Decimal, b: Decimal): Decimal => {
  if (b.isZero()) {
    throw new Error('ZERO_DIVISION');
  }
  if (a.isZero()) {
    return a;
  }
  // The traditional divUp formula is:
  // divUp(x, y) := (x + y - 1) / y
  // To avoid intermediate overflow in the addition, we distribute the division and get:
  // divUp(x, y) := (x - 1) / y + 1
  // Note that this requires x != 0, which we already tested for.

  return a.times(ONE).minus(new Decimal(1)).div(b).plus(new Decimal(1));
};

// check the logic for 9 decimals, yet not correct
export const powDown = (x: Decimal, y: Decimal): Decimal => {
  const raw = logExp.pow(x, y);
  const maxError = add(mulUp(raw, MAX_POW_RELATIVE_ERROR), new Decimal(1));

  if (raw.lt(maxError)) {
    return new Decimal(0);
  }
  return sub(raw, maxError);
};

export const powUp = (x: Decimal, y: Decimal): Decimal => {
  const raw = logExp.pow(x, y);
  const maxError = add(mulUp(raw, MAX_POW_RELATIVE_ERROR), new Decimal(1));

  return add(raw, maxError);
};

export const complement = (x: Decimal): Decimal => (x.lt(ONE) ? ONE.minus(x) : new Decimal(0));
