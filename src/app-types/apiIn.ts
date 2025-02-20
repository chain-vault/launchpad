import type { PublicKey } from '@solana/web3.js';
import type { Dayjs } from 'dayjs';

import { CurveIndex } from '@constants/config';
import { FastLauchIdlType } from '@idl/fastlaunch';
import { DecimalType } from '@utils/decimalHelper';

import {
  FetchAccountReturnType,
  GetAllAccountReturnType,
  PoolAndTokenMetaData,
} from './poolAndToken';
import { TransformBNToDecimal } from './utils';

export type PoolSettingsResponse = GetAllAccountReturnType<FastLauchIdlType, 'fastLaunchSettings'>;
export type PoolCurveSettings = FetchAccountReturnType<FastLauchIdlType, 'curveAccounts'>;
export type PoolAccountDataResponse = FetchAccountReturnType<FastLauchIdlType, 'poolData'>;
export type AllPoolAccountsResponse = GetAllAccountReturnType<FastLauchIdlType, 'poolData'>;

export type CurveSettings = TransformBNToDecimal<PoolCurveSettings>;
export type ApeInPoolSettings = TransformBNToDecimal<PoolSettingsResponse>;
export type PoolAccountData = TransformBNToDecimal<PoolAccountDataResponse>;
export type AllPoolAccounts = TransformBNToDecimal<AllPoolAccountsResponse>;

export type PoolData = {
  bondingCurveProgress: number;
  coefficient1: DecimalType;
  coefficient2: DecimalType;
  createdAt: number;
  curveAccount: PublicKey | undefined;
  curveIndex: CurveIndex;
  curveThresholdReached: boolean;
  developerAllocation: DecimalType;
  hasTokenLockBeenApplied: boolean;
  isTokenLockActive: boolean;
  liquidityLP: PublicKey;
  lockEndTime: Dayjs;
  marketCap: DecimalType;
  poolCreator: PublicKey;
  pooledSol?: DecimalType;
  pooledToken?: DecimalType;
  poolId: PublicKey;
  poolTokenBalance: DecimalType;
  refundProcessed?: boolean;
  selectedDex: string;
  solBalance: DecimalType;
  token: PublicKey;
  tokenLockPeriod: number;
  tokenName: string;
  tokenPrice: DecimalType;
};

export type PoolWithTokenData = {
  curveThresholdTime: null | number;
  lastTransactionTime?: null | number;
  participantsCount: number;
} & Partial<PoolAndTokenMetaData> &
  PoolData;
