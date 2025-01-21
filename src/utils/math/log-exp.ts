import Decimal from 'decimal.js';

// Constants
const ONE_18 = new Decimal('1000000000000000000'); // 1e18
const ONE_20 = new Decimal('100000000000000000000'); // 1e20

const MAX_NATURAL_EXPONENT = new Decimal('130000000000000000000'); // 130e18
const MIN_NATURAL_EXPONENT = new Decimal('-41000000000000000000'); // (-41)e18

const LN_36_LOWER_BOUND = ONE_18.minus(new Decimal('100000000000000000')); // 1e18 - 1e17
const LN_36_UPPER_BOUND = ONE_18.plus(new Decimal('100000000000000000')); // 1e18 + 1e17

const MILD_EXPONENT_BOUND = Decimal.pow(2, 254).div(ONE_20);

const x0 = new Decimal('128000000000000000000'); // 2^7
const a0 = new Decimal('38877084059945950922200000000000000000000000000000000000'); // e^x0
const x1 = new Decimal('64000000000000000000'); // 2^6
const a1 = new Decimal('6235149080811616882910000000'); // e^x1

const x2 = new Decimal('3200000000000000000000'); // 2^5
const a2 = new Decimal('7896296018268069516100000000000000'); // e^x2
const x3 = new Decimal('1600000000000000000000'); // 2^4
const a3 = new Decimal('888611052050787263676000000'); // e^x3
const x4 = new Decimal('800000000000000000000'); // 2^3
const a4 = new Decimal('298095798704172827474000'); // e^x4
const x5 = new Decimal('400000000000000000000'); // 2^2
const a5 = new Decimal('5459815003314423907810'); // e^x5
const x6 = new Decimal('200000000000000000000'); // 2^1
const a6 = new Decimal('738905609893065022723'); // e^x6
const x7 = new Decimal('100000000000000000000'); // 2^0
const a7 = new Decimal('271828182845904523536'); // e^x7
const x8 = new Decimal('50000000000000000000'); // 2^(-1)
const a8 = new Decimal('164872127070012814685'); // e^x8
const x9 = new Decimal('25000000000000000000'); // 2^(-2)
const a9 = new Decimal('128402541668774148407'); // e^x9

const ln = (a: Decimal): Decimal => {
  const result = new Decimal(a).ln().times(ONE_18);
  return result;
};

const ln36 = (a: Decimal): Decimal => {
  const x = a.minus(ONE_18).div(ONE_18).times(100);
  const product = new Decimal(1).plus(x.div(100));
  let term = x.div(100);
  let seriesSum = product;

  term = term.times(x).div(100);
  seriesSum = seriesSum.plus(term);

  term = term.times(x).div(100).div(2);
  seriesSum = seriesSum.plus(term);

  term = term.times(x).div(100).div(3);
  seriesSum = seriesSum.plus(term);

  term = term.times(x).div(100).div(4);
  seriesSum = seriesSum.plus(term);

  term = term.times(x).div(100).div(5);
  seriesSum = seriesSum.plus(term);

  term = term.times(x).div(100).div(6);
  seriesSum = seriesSum.plus(term);

  term = term.times(x).div(100).div(7);
  seriesSum = seriesSum.plus(term);

  term = term.times(x).div(100).div(8);
  seriesSum = seriesSum.plus(term);

  return seriesSum.times(ONE_18).minus(ONE_18);
};

export const exp = (x: Decimal): Decimal => {
  if (x.lt(MIN_NATURAL_EXPONENT) || x.gt(MAX_NATURAL_EXPONENT)) {
    throw new Error('INVALID_EXPONENT');
  }

  if (x.lt(0)) {
    return ONE_18.times(ONE_18).div(exp(x.negated()));
  }

  let firstAN: Decimal;
  if (x.gte(x0)) {
    x = x.minus(x0);
    firstAN = a0;
  } else if (x.gte(x1)) {
    x = x.minus(x1);
    firstAN = a1;
  } else {
    firstAN = new Decimal(1);
  }

  x = x.times(100);

  let product = ONE_20;

  if (x.gte(x2)) {
    x = x.minus(x2);
    product = product.times(a2).div(ONE_20);
  }
  if (x.gte(x3)) {
    x = x.minus(x3);
    product = product.times(a3).div(ONE_20);
  }
  if (x.gte(x4)) {
    x = x.minus(x4);
    product = product.times(a4).div(ONE_20);
  }
  if (x.gte(x5)) {
    x = x.minus(x5);
    product = product.times(a5).div(ONE_20);
  }
  if (x.gte(x6)) {
    x = x.minus(x6);
    product = product.times(a6).div(ONE_20);
  }
  if (x.gte(x7)) {
    x = x.minus(x7);
    product = product.times(a7).div(ONE_20);
  }
  if (x.gte(x8)) {
    x = x.minus(x8);
    product = product.times(a8).div(ONE_20);
  }
  if (x.gte(x9)) {
    x = x.minus(x9);
    product = product.times(a9).div(ONE_20);
  }

  let seriesSum = ONE_20;
  let term: Decimal;

  term = x;
  seriesSum = seriesSum.plus(term);

  term = term.times(x).div(ONE_20).div(2);
  seriesSum = seriesSum.plus(term);

  term = term.times(x).div(ONE_20).div(3);
  seriesSum = seriesSum.plus(term);

  term = term.times(x).div(ONE_20).div(4);
  seriesSum = seriesSum.plus(term);

  term = term.times(x).div(ONE_20).div(5);
  seriesSum = seriesSum.plus(term);

  term = term.times(x).div(ONE_20).div(6);
  seriesSum = seriesSum.plus(term);

  term = term.times(x).div(ONE_20).div(7);
  seriesSum = seriesSum.plus(term);

  term = term.times(x).div(ONE_20).div(8);
  seriesSum = seriesSum.plus(term);

  term = term.times(x).div(ONE_20).div(9);
  seriesSum = seriesSum.plus(term);

  term = term.times(x).div(ONE_20).div(10);
  seriesSum = seriesSum.plus(term);

  term = term.times(x).div(ONE_20).div(11);
  seriesSum = seriesSum.plus(term);

  term = term.times(x).div(ONE_20).div(12);
  seriesSum = seriesSum.plus(term);

  return product.times(seriesSum).div(ONE_20).times(firstAN).div(100);
};
export const pow = (x: Decimal, y: Decimal): Decimal => {
  if (y.isZero()) {
    return ONE_18;
  }

  if (x.isZero()) {
    return new Decimal(0);
  }

  if (x.gte(Decimal.pow(2, 255))) {
    throw new Error('X_OUT_OF_BOUNDS');
  }

  if (y.gte(MILD_EXPONENT_BOUND)) {
    throw new Error('Y_OUT_OF_BOUNDS');
  }

  let logXTimesY: Decimal;
  if (LN_36_LOWER_BOUND.lt(x) && x.lt(LN_36_UPPER_BOUND)) {
    const ln36X = ln36(x);

    logXTimesY = ln36X.div(ONE_18).times(y).plus(ln36X.mod(ONE_18).times(y).div(ONE_18));
  } else {
    logXTimesY = ln(x).times(y);
  }
  logXTimesY = logXTimesY.div(ONE_18);

  if (logXTimesY.lt(MIN_NATURAL_EXPONENT) || logXTimesY.gt(MAX_NATURAL_EXPONENT)) {
    throw new Error('PRODUCT_OUT_OF_BOUNDS');
  }

  return exp(logXTimesY);
};

export const log = (arg: Decimal, base: Decimal): Decimal => {
  let logBase: Decimal;
  if (LN_36_LOWER_BOUND.lt(base) && base.lt(LN_36_UPPER_BOUND)) {
    logBase = ln36(base);
  } else {
    logBase = ln(base).times(ONE_18);
  }

  let logArg: Decimal;
  if (LN_36_LOWER_BOUND.lt(arg) && arg.lt(LN_36_UPPER_BOUND)) {
    logArg = ln36(arg);
  } else {
    logArg = ln(arg).times(ONE_18);
  }

  return logArg.times(ONE_18).div(logBase);
};

// export const ln = (a: Decimal): Decimal => {
//   if (a.lte(0)) {
//     throw new Error('LOG_NEGATIVE');
//   }

//   if (a.lte(ONE_18)) {
//     return new Decimal(0);
//   }

//   let result = new Decimal(0);

//   if (a.gte(ONE_36)) {
//     result = result.plus(a.ln().div(ONE_18).times(ONE_18));
//     a = a.div(ONE_36);
//   }

//   if (a.gte(ONE_20)) {
//     result = result.plus(a.ln().div(ONE_18).times(ONE_18));
//     a = a.div(ONE_20);
//   }

//   return result.plus(a.ln());
// };
