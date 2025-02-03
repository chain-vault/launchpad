import type { BN } from '@coral-xyz/anchor';
import type Decimal from 'decimal.js';

import type { ReactElement, ReactNode } from 'react';

import { BiLogoTelegram } from 'react-icons/bi';
import { FaDiscord, FaGithub } from 'react-icons/fa';
import { FaMedium, FaXTwitter } from 'react-icons/fa6';
import { GoProjectRoadmap } from 'react-icons/go';
import { IoIosLink } from 'react-icons/io';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { SiGitbook } from 'react-icons/si';

import { GetAllAccountReturnType } from '@app-types/poolAndToken';

import { type ApeonLbp } from '@idl/lbp';
/**
 * All icons
 */

declare global {
  interface Window {
    phantom?: any;
  }
}

export const SOCIAL_ICONS_MAP = {
  discord: FaDiscord,
  gitbook: SiGitbook,
  github: FaGithub,
  medium: FaMedium,
  roadmap: GoProjectRoadmap,
  telegram: BiLogoTelegram,
  twitter: FaXTwitter,
  website: IoIosLink,
  whitepaper: IoDocumentTextOutline,
} as const;

export type Nullish<T> = null | T | undefined;

export type NumberType = Decimal | number | string;
export type NumberTypeWithBN = BN | Decimal | number | string;
export type BigIntish = bigint | NumberType;

export enum Slippage {
  AUTO = 'Auto',
  MAX = 'Max',
}

export interface FilePreviewType {
  isUploaded: boolean;
  name: string;
  preview: string;
  size: number;
  type: string;
}

export type LockType = {
  description: string;
  disabled?: boolean;
  icon: string;
  title: string;
  value: string;
};
export type ValidDateTimeArg = number;

export enum LBPPoolStatus {
  COMING_SOON = 'Coming Soon',
  COMPLETED = 'Completed',
  LIVE_NOW = 'Live Now',
}

export type PoolStatusColor = {
  [key in LBPPoolStatus]: string;
};

export type SocialIconsMapList = {
  id: keyof typeof SOCIAL_ICONS_MAP;
  isDisabled?: boolean;
  url: string;
}[];
export type PoolAccountAllResponse = GetAllAccountReturnType<ApeonLbp, 'poolData'>;
export type PoolDataType = PoolAccountAllResponse[0];
export type PoolStatusUpdatedEvent = {
  countdown: string;
  status: LBPPoolStatus;
};

// Radio button options type

export type RadioButtonOption = {
  displayValue: string;
  id: string;
  value: string;
};

export type FilterOption = {
  icon?: ReactElement;
  id: string;
  label: string;
  value: string;
};

export enum SortOptions {
  asc = 'asc',
  dsc = 'dsc',
}

export enum DexType {
  METEORA = 'meteora',
  RAYDIUM = 'raydium',
}

export enum TradeTypes {
  BUY = 'buy',
  SELL = 'sell',
}

export enum PoolListSortOptions {
  ASC = 'asc',
  DESC = 'desc',
  DEVELOPER_LOCKED = 'developerLocked',
  MARKET_CAP = 'marketCap',
}

export enum TrimMode {
  'center' = 'center',
  'end' = 'end',
}

export enum ThemeVariants {
  APEIN = 'accent',
  LBP = 'secondary',
}

export type ToggleButtonOption = {
  highlightColor?: boolean;
  id: string;
  label: ReactNode;
  value: string;
};

export type GenericLambdaResponse<T> = {
  body: {
    response: T;
  };
  statusCode: number;
};
