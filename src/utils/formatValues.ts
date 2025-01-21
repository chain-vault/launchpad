import { DecimalType } from './decimalHelper';
import { Token } from './token';

export const calculateAmountWithSlippage = (
  amount: number | string,
  slippage: number,
  tokenDecimal: number
): DecimalType => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (Number.isNaN(numericAmount) || Number.isNaN(slippage) || slippage < 0) {
    // Handle invalid or negative values
    throw new Error('Invalid input values');
  }

  const slippageAmount = (slippage / 100) * numericAmount;
  const minAmount = Token.toRawAmount(numericAmount - slippageAmount, tokenDecimal);
  return minAmount;
};
