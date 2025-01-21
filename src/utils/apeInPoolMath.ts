import { queryClient } from '@adapters/tanstack';

import { ApeInPoolSettings, CurveSettings } from '@app-types/apiIn';
import { TradeTypes } from '@app-types/index';

import { BASE_CONFIG } from '@constants/config';

import BaseDecimal, { DecimalType, ONE, ONE_TOKEN, ZERO } from './decimalHelper';

// coefficient1 = token reserve and coefficient2 = sol reserve/ collateral reserve

export class PoolMath {
  static exactInputForSwapOutput({
    amountOut,
    coefficient1,
    coefficient2,
    maxSol,
    productConstant: k,
    tradeType,
  }: PoolMath.ExactInputForSwapOutputParams) {
    const apeInSettings = queryClient.getQueryData<ApeInPoolSettings | undefined>([
      'apeInSettings',
      BASE_CONFIG.apeInProgramId,
    ])?.[0]?.account;
    if (!apeInSettings) return ZERO;
    let coefficientA;
    let coefficientB;

    if (tradeType === TradeTypes.BUY) {
      coefficientA = coefficient1; // token reserve
      coefficientB = coefficient2; // sol reserve
    } else {
      if (amountOut.lessThan(apeInSettings.tradeMinimumSolAmount)) return ZERO;
      coefficientB = coefficient1; // token reserve
      coefficientA = coefficient2; // sol reserve
    }

    /**
     * equation:
     * amountIn = (k / (coefficientA - amountOut)) - coefficientB
     */

    const newCoefficientA = coefficientA.minus(amountOut);
    const newCoefficientB = k.div(newCoefficientA).floor();
    let amountIn = newCoefficientB.minus(coefficientB);
    if (tradeType === TradeTypes.BUY) {
      // add fees to sol input
      amountIn = PoolMath.getInverseSwapFee({
        solAmount: amountIn,
        tradeFeeDenominator: apeInSettings.tradeFeeDenominator,
        tradeFeeNumerator: apeInSettings.tradeFeeNumerator,
      });

      // condition to not let user buy more than max sol
      if (amountIn.greaterThan(maxSol)) return maxSol;
    }
    if (amountIn.isNegative()) return ZERO;
    return amountIn;
  }

  static exactOutputForSwapInput({
    amountIn,
    coefficient1,
    coefficient2,
    maxSolInput,
    productConstant: k,
    tradeType,
  }: PoolMath.ExactOutputForSwapInputParams) {
    const apeInSettings = queryClient.getQueryData<ApeInPoolSettings | undefined>([
      'apeInSettings',
      BASE_CONFIG.apeInProgramId,
    ])?.[0]?.account;

    if (!apeInSettings) return ZERO;

    let coefficientA;
    let coefficientB;
    let amountInWithOutFee = amountIn;

    if (tradeType === TradeTypes.BUY) {
      if (
        !PoolMath.isValidSolInput({
          maxAllowedSolInput: maxSolInput,
          solInput: amountIn,
          tradeMinimumSolAmount: apeInSettings.tradeMinimumSolAmount,
        })
      )
        return ZERO;
      amountInWithOutFee = amountIn.sub(
        this.getSwapFee({
          solAmount: amountIn,
          tradeFeeDenominator: apeInSettings.tradeFeeDenominator,
          tradeFeeNumerator: apeInSettings.tradeFeeNumerator,
        })
      );
      coefficientA = coefficient1; // token reserve
      coefficientB = coefficient2; // sol reserve
    } else {
      coefficientB = coefficient1; // token reserve
      coefficientA = coefficient2; // sol reserve
    }

    /**
     * Equation:
     * amountOut = coefficient1 - (k / (coefficient2 + amountIn))
     */
    const newCoefficientB = coefficientB.add(amountInWithOutFee);
    const newCoefficientA = k.div(newCoefficientB).floor();
    const amountOut = coefficientA.minus(newCoefficientA);

    return amountOut;
    // if (tradeType === TradeTypes.SELL) return amountOut;
  }

  static getBondingCurveProgress({
    currentCurveThreshold,
    curveSettings,
  }: PoolMath.GetBondingCurveParams) {
    const precisionFactor = BaseDecimal.toDecimal(100000);
    const maxThreshold = BaseDecimal.toDecimal(100000);
    const { coefficient1, coefficient2, targetMarketcap } = curveSettings;
    // bonding curve progress
    const initialTokenPrice = coefficient2.mul(ONE_TOKEN).div(coefficient1).floor();
    const intialMarketCap = initialTokenPrice.mul(ONE); // in lamports and add a 1000

    const initialCurveThreshold = intialMarketCap
      .div(targetMarketcap)
      .div(3)
      .mul(precisionFactor)
      .floor();

    const progress = currentCurveThreshold
      .minus(initialCurveThreshold)
      .div(maxThreshold.minus(initialCurveThreshold))
      .mul(100);

    return DecimalType.max(0, DecimalType.min(100, progress)).toNumber();
  }

  /**
   * Function to get the swap fee for exactInForOut
   */
  static getInverseSwapFee({
    solAmount,
    tradeFeeDenominator,
    tradeFeeNumerator,
  }: PoolMath.SwapFee) {
    // amountWithFee = amount / (1-fee)
    return solAmount.div(
      BaseDecimal.toDecimal(1).minus(tradeFeeNumerator.div(tradeFeeDenominator))
    );
  }

  static getSwapFee({ solAmount, tradeFeeDenominator, tradeFeeNumerator }: PoolMath.SwapFee) {
    return solAmount.mul(tradeFeeNumerator.div(tradeFeeDenominator));
  }

  static isValidSolInput({
    maxAllowedSolInput,
    solInput,
    tradeMinimumSolAmount,
  }: PoolMath.ValidSolInputCheckParams) {
    return (
      solInput.greaterThanOrEqualTo(tradeMinimumSolAmount) ||
      (solInput.greaterThanOrEqualTo(maxAllowedSolInput) &&
        maxAllowedSolInput.lessThan(tradeMinimumSolAmount))
    );
  }
}

export namespace PoolMath {
  export type ExactOutputForSwapInputParams = {
    amountIn: DecimalType;
    coefficient1: DecimalType;
    coefficient2: DecimalType;
    maxSolInput: DecimalType;
    productConstant: DecimalType;
    tradeType: TradeTypes;
  };
  export type ExactInputForSwapOutputParams = {
    amountOut: DecimalType;
    coefficient1: DecimalType;
    coefficient2: DecimalType;
    maxSol: DecimalType;
    productConstant: DecimalType;
    tradeType: TradeTypes;
  };
  export type GetBondingCurveParams = {
    currentCurveThreshold: DecimalType;
    curveSettings: CurveSettings;
  };
  export type SwapFee = {
    solAmount: DecimalType;
    tradeFeeDenominator: DecimalType;
    tradeFeeNumerator: DecimalType;
  };
  export type ValidSolInputCheckParams = {
    maxAllowedSolInput: DecimalType;
    solInput: DecimalType;
    tradeMinimumSolAmount: DecimalType;
  };
}
