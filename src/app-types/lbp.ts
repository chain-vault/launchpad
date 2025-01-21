import type { PublicKey } from '@solana/web3.js';

import { ApeonLbp } from '@idl/lbp';
import { DecimalType } from '@utils/decimalHelper';

import {
  FetchAccountReturnType,
  GetAllAccountReturnType,
  PoolAndTokenMetaData,
} from './poolAndToken';
import { TransformBNToDecimal } from './utils';

export type AllPoolAccountsResponse = GetAllAccountReturnType<ApeonLbp, 'poolData'>;
export type PoolAccountDataResponse = FetchAccountReturnType<ApeonLbp, 'poolData'>;
export type LBPSettingsResponse = GetAllAccountReturnType<ApeonLbp, 'lbpLaunchSettings'>;
export type LBPAccountSettingsResponse = FetchAccountReturnType<ApeonLbp, 'lbpLaunchSettings'>;

export type PoolAccountData = TransformBNToDecimal<PoolAccountDataResponse>;
export type AllPoolAccounts = TransformBNToDecimal<AllPoolAccountsResponse>;
export type LBPSettings = TransformBNToDecimal<LBPAccountSettingsResponse>;

export type LBPPoolData = {
  collateralBalance: DecimalType;
  collateralEndWeight: DecimalType;
  collateralStartWeight: DecimalType;
  creator: PublicKey;
  endAt: number;
  fundRaised: DecimalType;
  isSolClaimed: boolean;
  name: string;
  poolAddress: PublicKey;
  projectTokenBalance: DecimalType;
  projectTokenEndWeight: DecimalType;
  projectTokenStartWeight: DecimalType;
  startAt: number;
  startCollaterolAmount: DecimalType;
  startProjectAmount: DecimalType;
  swapFeeDenominator: DecimalType;
  swapFeeNumerator: DecimalType;
  token: PublicKey;
};

export type LBPPoolWithTokenData = {
  participantsCount: number;
} & LBPPoolData &
  Partial<PoolAndTokenMetaData>;
