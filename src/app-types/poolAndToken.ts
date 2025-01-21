import type { AccountNamespace, Idl } from '@coral-xyz/anchor';

import { type PublicKey } from '@solana/web3.js';
import { Dayjs } from 'dayjs';
import { LineData, UTCTimestamp } from 'lightweight-charts';

import { SOCIAL_ICONS_MAP } from '.';

/**
 * Utility type to extract the return type of the fetch method for a specific account.
 * This type takes the IDL type and an account name as parameters and returns the type
 * returned by the fetch method for that account.
 *
 * @template T - The IDL type.
 * @template K - The key of the account in the AccountNamespace of the IDL.
 */
export type FetchAccountReturnType<T extends Idl, K extends keyof AccountNamespace<T>> = Awaited<
  ReturnType<AccountNamespace<T>[K]['fetch']>
>;

export type GetAllAccountReturnType<T extends Idl, K extends keyof AccountNamespace<T>> = Awaited<
  ReturnType<AccountNamespace<T>[K]['all']>
>;

export type TokenData = {
  address: PublicKey | string;
  decimal: number;
  isCollateral: boolean;
  isNative: boolean;
  logoUrl: string;
  name: string;
  symbol: string;
};

// export type PoolInfoReturnType =

export type LBPPoolData = {
  collateralBalance: string;
  collateralEndWeight: string;
  collateralStartWeight: string;
  creator: PublicKey;
  endAt: number;
  fundRaised: string;
  isSolClaimed: boolean;
  name: string;
  platformFee: string;
  poolAddress: PublicKey;
  projectTokenBalance: string;
  projectTokenEndWeight: string;
  projectTokenStartWeight: string;
  startAt: number;
  startCollaterolAmount: string;
  startProjectAmount: string;
  swapFee: string;
  token: PublicKey;
};

// from spl-tokens
export type TokenMetadataBase = {
  // Any additional metadata about the token as key-value pairs
  additionalMetadata: [string, string][];
  // The associated mint, used to counter spoofing to be sure that metadata belongs to a particular mint
  mint: PublicKey;
  // The longer name of the token
  name: string;
  // The shortened symbol for the token
  symbol: string;
  // The authority that can sign to update the metadata
  updateAuthority?: PublicKey;
  // The URI pointing to richer metadata
  uri: string;
};

// Here we refer as pool and token metadata because it has both details
export type PoolAndTokenMetadataReturnData = {
  dcd: string;
  description: string;
  gh: string;
  image: string;
  rmp: string;
  tg: string;
  tld: string;
  wb: string;
  wp: string;
  x: string;
} & { totalSupply: string } & TokenMetadataBase;

export type PoolAndTokenBaseInfo = {
  logoUrl: string;
  mint: PublicKey;
  name: string;
  poolDescription: string;
  symbol: string;
  totalSupply: string;
};

type SocialIconsKeys = keyof typeof SOCIAL_ICONS_MAP;
type SocialLinks = Partial<Record<SocialIconsKeys, string>>;
export type PoolAndTokenMetaData = PoolAndTokenBaseInfo & SocialLinks;

export type PoolCurveData = LineData<UTCTimestamp>;

export type SwapTransactionsTableData = {
  amount: string;
  date: number;
};

export type PoolDataFastLaunch = {
  allocation: string;
  allocationPercentage: string;
  bondingCurveCompleted: boolean;
  bondingCurveProgress: string;
  createdAt: number;
  creator: string | undefined;
  curveThreshold: string;
  hasTokenLock: boolean;
  initalBuyLockDays: number;
  liquidityLP: string;
  lockPeriodEnd: Dayjs;
  marketCap: string;
  // poolAuthority: string;
  pooledToken: string;
  poolId: string;
  poolTokenValue: string;
  price: string;
  selectedDex: string;
  solBalance: string;
  token: PublicKey;
  tokenBalance: string;
  tokenName: string;
  tradeFeeDenominator: string;
  tradeFeeNumerator: string;
  tradeMinimumSolAmount: string;
};
