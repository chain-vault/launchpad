import type { NumberType } from '@app-types/index';

import dayjs from 'dayjs';

import { LBPPoolData } from '@app-types/lbp';

import BaseDecimal, { DecimalType } from './decimalHelper';
import { Token } from './token';
import { Weights } from './weights';

export class PoolWeightedMath {
  static calculateCollateralTokenAmount({
    projectTokenAmount,
    projectTokenWeight,
    spotPrice,
  }: PoolWeightedMath.CalculateCollateralTokenAmount): DecimalType {
    const collateralWeight = BaseDecimal.toDecimal(Weights.getOppositeWeight(projectTokenWeight));
    const projectAmount = BaseDecimal.toDecimal(projectTokenAmount);
    const spotPriceO = BaseDecimal.toDecimal(spotPrice);
    const projectWeight = BaseDecimal.toDecimal(projectTokenWeight);

    return projectAmount.times(spotPriceO).times(collateralWeight).div(projectWeight);
  }

  static calculateprojectTokenAmount({
    collateralTokenAmount,
    collateralTokenWeight,
    projectTokenWeight,
    spotPrice,
  }: PoolWeightedMath.CalculateProjectAmount): DecimalType {
    const collateralAmount = BaseDecimal.toDecimal(collateralTokenAmount);
    const spotPriceOut = BaseDecimal.toDecimal(spotPrice);
    const collateralWeight = BaseDecimal.toDecimal(collateralTokenWeight);
    const projectWeight = BaseDecimal.toDecimal(projectTokenWeight);

    return collateralAmount.times(projectWeight).div(spotPriceOut.times(collateralWeight));
  }

  static currentWeights(pool: LBPPoolData, now = dayjs()) {
    const nowUnix = BaseDecimal.toDecimal(now.unix());
    const startTimeUnix = BaseDecimal.toDecimal(pool.startAt);
    const endTimeUnix = BaseDecimal.toDecimal(pool.endAt);

    const { collateralStartWeight, projectTokenEndWeight, projectTokenStartWeight } = pool;

    // elapsedCoefficient = (now - startTime) / (endTime - startTime)
    const elapsedCoefficient = nowUnix.minus(startTimeUnix).div(endTimeUnix.minus(startTimeUnix));

    // maxWeight = projectStartWeight + collateralStartWeight
    const maxWeight = projectTokenStartWeight.add(collateralStartWeight);

    // projectTokenWeightAtNow = (elapsedCoefficient * (endWeight - startWeight)) + startWeight :: (of projectToken)
    const projectTokenWeightAtNow = elapsedCoefficient
      .times(projectTokenEndWeight.minus(projectTokenStartWeight))
      .add(projectTokenStartWeight);

    // collateralWeightAtNow = maxWeight - projectTokenWeightAtNow
    const collateralWeightAtNow = maxWeight.minus(projectTokenWeightAtNow);

    return {
      collateralWeight: collateralWeightAtNow,
      maxWeight,
      projectTokenWeight: projectTokenWeightAtNow,
    };
  }

  static exactInputForSwapOut({
    amountOut,
    pool,
    tokenIn,
    tokenOut,
  }: PoolWeightedMath.ExactInForSwapOutParams): string {
    const { collateralWeight, projectTokenWeight } = this.currentWeights(pool);
    let amountOutWithFee = BaseDecimal.toDecimal(amountOut);
    const collateralWeightRound = collateralWeight.floor();
    const projectTokenWeightRound = projectTokenWeight.ceil();

    let weightIn: DecimalType;
    let weightOut: DecimalType;
    let balanceIn: DecimalType;
    let balanceOut: DecimalType;

    if (tokenIn.isCollateral) {
      amountOutWithFee = PoolWeightedMath.getInverseSwapFee({
        solAmount: amountOutWithFee,
        tradeFeeDenominator: pool.swapFeeDenominator,
        tradeFeeNumerator: pool.swapFeeNumerator,
      });
      weightIn = collateralWeightRound;
      weightOut = projectTokenWeightRound;
      balanceIn = BaseDecimal.toDecimal(pool.collateralBalance);
      balanceOut = BaseDecimal.toDecimal(pool.projectTokenBalance);
    } else {
      // if (shouldIncludeSwapFee)
      //   amountOutWithFee = amountOutWithFee.add(amountOutWithFee.times(swapFee));
      weightIn = projectTokenWeightRound;
      weightOut = collateralWeightRound;
      balanceIn = BaseDecimal.toDecimal(pool.projectTokenBalance);
      balanceOut = BaseDecimal.toDecimal(pool.collateralBalance);
    }

    const amountOutRaw = BaseDecimal.toDecimal(
      Token.toRawAmount(amountOutWithFee, tokenOut.decimal)
    );

    // there is no fund in pool
    if (balanceOut.lessThan(amountOutRaw)) return '';

    // exponent = weightOut / weightIn
    const exponent = weightOut.div(weightIn);

    // base = balanceOut / (balanceOut - amountOut)
    const base = balanceOut.div(balanceOut.sub(amountOutRaw));

    // amountOut = balanceIn * ((base ^ exponent) - 1),
    const amountIn = balanceIn.times(base.pow(exponent).minus(BaseDecimal.toDecimal(1)));

    // if (tokenIn.isCollateral && shouldIncludeSwapFee)
    //   amountIn = amountIn.add(amountIn.times(swapFee));

    return Token.fromRawAmount(amountIn, tokenIn.decimal).toFixed(tokenIn.decimal);
  }

  // value0 : main, value1: base
  static exactOutputForSwapInput({
    amountIn,
    pool,
    shouldIncludeSwapFee,
    tokenIn,
    tokenOut,
  }: PoolWeightedMath.ExactOutForSwapInParams): string {
    const { collateralWeight, projectTokenWeight } = this.currentWeights(pool);
    let amountInWithOutFee = BaseDecimal.toDecimal(amountIn);
    const collateralWeightRound = collateralWeight.floor();
    const projectTokenWeightRound = projectTokenWeight.ceil();

    let weightIn: DecimalType;
    let weightOut: DecimalType;
    let balanceIn: DecimalType;
    let balanceOut: DecimalType;

    if (tokenIn.isCollateral) {
      if (shouldIncludeSwapFee)
        amountInWithOutFee = amountInWithOutFee.sub(
          this.getSwapFee({
            solAmount: amountInWithOutFee,
            tradeFeeDenominator: pool.swapFeeDenominator,
            tradeFeeNumerator: pool.swapFeeNumerator,
          })
        );
      // amountInWithOutFee.minus(amountInWithOutFee.times(swapFee));
      weightIn = collateralWeightRound;
      weightOut = projectTokenWeightRound;
      balanceIn = BaseDecimal.toDecimal(pool.collateralBalance);
      balanceOut = BaseDecimal.toDecimal(pool.projectTokenBalance);
    } else {
      weightIn = projectTokenWeightRound;
      weightOut = collateralWeightRound;
      balanceIn = BaseDecimal.toDecimal(pool.projectTokenBalance);
      balanceOut = BaseDecimal.toDecimal(pool.collateralBalance);
    }

    const amountInRaw = BaseDecimal.toDecimal(
      Token.toRawAmount(amountInWithOutFee, tokenIn.decimal)
    );

    // if (balanceIn.lessThan(amountInRaw)) return '';

    // exponent = weightIn / weightOut
    const exponent = weightIn.div(weightOut);

    // base = balanceIn / (balanceIn + amountIn)
    const base = balanceIn.div(balanceIn.plus(amountInRaw));

    // amountOut = balanceOut * (1 - base ^ exponent),
    const amountOut = balanceOut.times(BaseDecimal.toDecimal(1).minus(base.pow(exponent)));
    // if (tokenOut.isCollateral && shouldIncludeSwapFee)
    //   amountOut = amountOut.minus(amountOut.times(swapFee));
    return Token.fromRawAmount(amountOut, tokenOut.decimal).toFixed(tokenOut.decimal);
  }

  static getInverseSwapFee({
    solAmount,
    tradeFeeDenominator,
    tradeFeeNumerator,
  }: PoolWeightedMath.SwapFee) {
    return BaseDecimal.toDecimal(solAmount).div(
      BaseDecimal.toDecimal(1).minus(tradeFeeNumerator.div(tradeFeeDenominator))
    );
  }

  static getSwapFee({
    solAmount,
    tradeFeeDenominator,
    tradeFeeNumerator,
  }: PoolWeightedMath.SwapFee) {
    return BaseDecimal.toDecimal(solAmount).mul(tradeFeeNumerator.div(tradeFeeDenominator));
  }

  static getTotalCurveIteration({
    endTime,
    startTime,
  }: PoolWeightedMath.GetTotalCurveIterationsParams): number {
    const now = dayjs().unix();
    const totalDuration = endTime - startTime;
    const elapsedDuration = now - startTime;
    const progressRatio = elapsedDuration / totalDuration;

    const startIterations = 2000;
    const endIterations = 800;

    const currentIterations = startIterations - progressRatio * (startIterations - endIterations);

    return Math.max(Math.round(currentIterations), endIterations);
  }

  static iteratedSpotPrice({
    collateralTokenAmount,
    endTime,
    endWeight,
    iteration,
    maxWeight = Weights.MaxWeight,
    projectTokenAmount,
    startTime,
    startWeight,
    totalIterations,
  }: PoolWeightedMath.IteratedSpotPriceParams): PoolWeightedMath.IteratedSpotPrice {
    const sW = BaseDecimal.toDecimal(startWeight);
    const eW = BaseDecimal.toDecimal(endWeight);
    const mW = BaseDecimal.toDecimal(maxWeight);

    const invalidCondition = [sW, eW, mW].some((v) => v.isNaN() || v.isZero());
    if (invalidCondition) return { time: 0, value: 0 };

    // get time variables
    const { elapsedCoefficient, iterationTimestamp } = PoolWeightedMath.timeInterval({
      endTime,
      iteration,
      startTime,
      totalIterations,
    });
    // projectTokenWeight = (elapsedCoefficient * (endWeight - startWeight)) + startWeight;
    const projectTokenWeight = BaseDecimal.toDecimal(elapsedCoefficient)
      .times(eW.minus(sW))
      .plus(sW);
    // collateralTokenWeight = maxWeight - mainWeight
    const collateralTokenWeight = mW.minus(projectTokenWeight);

    return {
      time: iterationTimestamp,
      value: Number(
        this.spotPrice({
          collateralTokenAmount,
          collateralTokenWeight,
          projectTokenAmount,
          projectTokenWeight,
        })
      ),
    };
  }

  static spotPrice({
    collateralTokenAmount,
    collateralTokenWeight,
    projectTokenAmount,
    projectTokenWeight,
  }: PoolWeightedMath.SpotPriceParams): string {
    const projectAmount = BaseDecimal.toDecimal(projectTokenAmount);
    const projectWeight = BaseDecimal.toDecimal(projectTokenWeight);
    const collateralAmount = BaseDecimal.toDecimal(collateralTokenAmount);
    const collateralWeight = BaseDecimal.toDecimal(collateralTokenWeight);

    const invalidCondition = [
      projectWeight,
      projectAmount,
      collateralWeight,
      collateralAmount,
    ].some((v) => v.isNaN() || v.isZero());
    if (invalidCondition) return '0';

    // const spotPrice = (collateralAmount / collateralWeight) / (projectAmount / projectWeight);
    const spotPrice = collateralAmount.div(collateralWeight).div(projectAmount.div(projectWeight));

    return spotPrice.toString();
  }

  static timeInterval({
    endTime,
    iteration,
    startTime,
    totalIterations,
  }: PoolWeightedMath.TimeIntervalParams): PoolWeightedMath.TimeInterval {
    const t = BaseDecimal.toDecimal(iteration);
    const sT = BaseDecimal.toDecimal(startTime);
    const eT = BaseDecimal.toDecimal(endTime);
    const tT = BaseDecimal.toDecimal(totalIterations);

    // timeInterval = endTime - startTime;
    const timeInterval = eT.minus(sT);

    // iterationInterval = timeInterval / (totalIterations - 1);
    const iterationInterval = timeInterval.div(tT.minus(1));

    // elapsedCoefficient = iteration * iterationInterval / timeInterval;
    const elapsedCoefficient = t.times(iterationInterval).div(timeInterval);

    // iterationTimestamp = startTime + iteration * iterationInterval;
    const iterationTimestamp = sT.plus(t.times(iterationInterval));

    return {
      elapsedCoefficient: elapsedCoefficient.toNumber(),
      iterationInterval: iterationInterval.toNumber(),
      iterationTimestamp: iterationTimestamp.toNumber(),
      timeInterval: timeInterval.toNumber(),
    };
  }
}

export namespace PoolWeightedMath {
  export type TimeIntervalParams = {
    endTime: number;
    iteration: number;
    startTime: number;
    totalIterations: number;
  };

  export type TimeInterval = {
    elapsedCoefficient: number;
    iterationInterval: number;
    iterationTimestamp: number;
    timeInterval: number;
  };

  export type IteratedSpotPriceParams = {
    collateralTokenAmount: NumberType;
    endWeight: NumberType;
    maxWeight?: NumberType;
    projectTokenAmount: NumberType;
    startWeight: NumberType;
  } & TimeIntervalParams;

  export type CalculateCollateralTokenAmount = {
    projectTokenAmount: NumberType;
    projectTokenWeight: NumberType;
    spotPrice: NumberType;
  };

  export type CalculateProjectAmount = {
    collateralTokenAmount: NumberType;
    collateralTokenWeight: NumberType;
    projectTokenWeight: NumberType;
    spotPrice: NumberType;
  };

  export type SpotPriceParams = {
    collateralTokenAmount: NumberType;
    collateralTokenWeight: NumberType;
    projectTokenAmount: NumberType;
    projectTokenWeight: NumberType;
  };

  export type ExactInForSwapOutParams = {
    amountOut: string;
    pool: LBPPoolData;
    shouldIncludeSwapFee?: boolean;
    tokenIn: Token;
    tokenOut: Token;
  };

  export type ExactOutForSwapInParams = {
    amountIn: string;
    pool: LBPPoolData;
    shouldIncludeSwapFee?: boolean;
    tokenIn: Token;
    tokenOut: Token;
  };

  export type SwapFee = {
    solAmount: NumberType;
    tradeFeeDenominator: DecimalType;
    tradeFeeNumerator: DecimalType;
  };

  export type IteratedSpotPrice = { time: number; value: number };

  export type GetTotalCurveIterationsParams = { endTime: number; startTime: number };
}
