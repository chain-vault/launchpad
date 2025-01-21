import { useMemo } from 'react';

import Decimal from 'decimal.js';

export const GAS_FEE_UPPER_LIMIT = new Decimal(10_000_000); // 0.01 SOL

const useMaxBalance = (
  balance: Decimal | undefined,
  isCollateralToken: boolean | undefined,
  gasFee: Decimal = GAS_FEE_UPPER_LIMIT
): Decimal | undefined => {
  const maxBalance = useMemo(
    () =>
      balance && !balance.isZero() ?
        isCollateralToken ? balance.minus(gasFee)
        : balance
      : new Decimal(0),
    [balance, gasFee, isCollateralToken]
  );

  return maxBalance.greaterThan(0) ? maxBalance : undefined;
};

export default useMaxBalance;
