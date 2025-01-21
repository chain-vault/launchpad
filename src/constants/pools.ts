import { PublicKey } from '@solana/web3.js';
import dayjs from 'dayjs';

import { PoolData } from '@app-types/apiIn';
import { DexType } from '@app-types/index';

import BaseDecimal from '@utils/decimalHelper';

import { CurveIndex } from './config';

export const TOKEN_META = [
  {
    decimals: 6,
    discord: '',
    extra_ape_count: 67,
    github: '',
    logoUrl: 'https://gateway.irys.xyz/IrAKSKZLuwgyxdU2vcKW_o_JffWk-b2-_cXmto46zKw',
    metadataUrl: 'https://gateway.irys.xyz/oRpmkmuD1kRfa_vfaEv7u1VMRV4q1ZPXSfj6-KWzwB4',
    mint: new PublicKey('BoxwNxUYKMV6ZzcKArP9HVrJq2gc4MLf6UGg3PitN38q'),
    name: 'Apes',
    poolDescription: 'H4sIAOZlEWcAA/MqLS5RSFRISkxJLC5WcCxIBQDzpG52EQAAAA==',
    roadmap: '',
    symbol: 'APE',
    telegram: '',
    totalSupply: '1000000000000000',
    twitter: '',
    website: '',
    whitepaper: '',
  },
  {
    decimals: 6,
    discord: '',
    extra_ape_count: 49,
    github: '',
    logoUrl: 'https://gateway.irys.xyz/Gw3JLNl4wn_GiC_Pkcy_4oYX962MkZb-BBU3vC2iaio',
    metadataUrl: 'https://gateway.irys.xyz/2I57T-ooh_2VbOYMiGP9APt5c6EHQaa5BoKTI4rM3Pk',
    mint: new PublicKey('BozKoTGQ3bvDrJnfnbwXEz6Kp4WLcWJHf2JqREbgVbHN'),
    name: 'CATMAN',
    poolDescription: 'H4sIAOxXEWcAA/NUKE/MK1EoyVcoSs1JTSxOVXB2DPF19AMA4kbdaBgAAAA=',
    roadmap: '',
    symbol: 'CATMN',
    telegram: '',
    totalSupply: '1000000000000000',
    twitter: '',
    website: '',
    whitepaper: '',
  },
];

export const LEGACY_POOLS: PoolData[] = [
  {
    bondingCurveProgress: 100,
    coefficient1: BaseDecimal.toDecimal(0),
    coefficient2: BaseDecimal.toDecimal(0),
    createdAt: 1729193471,
    curveAccount: new PublicKey('8hbi47Fs7MyXqDeyJZw5ExcnsLK87UqAsgU8MNpwK8qp'),
    curveIndex: CurveIndex.PRIME_LAUNCH,
    curveThresholdReached: true,
    developerAllocation: BaseDecimal.toDecimal(3.3902428893008),
    hasTokenLockBeenApplied: true,
    isTokenLockActive: false,
    liquidityLP: new PublicKey('2GFUn5nFy8gaR3yyJJHAoRvLhgQ2NJRPrWMtAhc6t99f'),
    lockEndTime: dayjs.unix(1730057471),
    marketCap: BaseDecimal.toDecimal(326000000000),
    poolCreator: new PublicKey('948fFNTdjir3v76AZ6BfBhj4JSGYD12byUoYun6RAc8k'),
    pooledToken: BaseDecimal.toDecimal(736691709.206025),
    poolId: new PublicKey('BWZf9a23Cc3kGvWV59LzyZ7zqvdCp3Aa7Hpr4qD5HM9u'),
    poolTokenBalance: BaseDecimal.toDecimal(263308290793975),
    selectedDex: DexType.METEORA,
    solBalance: BaseDecimal.toDecimal(86000000000),
    token: new PublicKey('BoxwNxUYKMV6ZzcKArP9HVrJq2gc4MLf6UGg3PitN38q'),
    tokenLockPeriod: 10,
    tokenName: 'Apes',
    tokenPrice: BaseDecimal.toDecimal(326),
  },
  {
    bondingCurveProgress: 100,
    coefficient1: BaseDecimal.toDecimal(0),
    coefficient2: BaseDecimal.toDecimal(0),
    createdAt: 1729189886,
    curveAccount: new PublicKey('8hbi47Fs7MyXqDeyJZw5ExcnsLK87UqAsgU8MNpwK8qp'),
    curveIndex: CurveIndex.PRIME_LAUNCH,
    curveThresholdReached: true,
    developerAllocation: BaseDecimal.toDecimal(2.3484452628632),
    hasTokenLockBeenApplied: true,
    isTokenLockActive: true,
    liquidityLP: new PublicKey('2Npi8D7ivootYrL8992ChXy2VeRrPPbFf345s53tbNm8'),
    lockEndTime: dayjs.unix(1731781886),
    marketCap: BaseDecimal.toDecimal(255000000000),
    poolCreator: new PublicKey('FFP7N3WssK7skgcGtPATaYKVki1R8NwsnVPvWSPtKh9g'),
    pooledToken: BaseDecimal.toDecimal(663301998.172607),
    poolId: new PublicKey('FSPMpHsANwbjU1aPo637WU88JyDLHstSm4Svi67M11dm'),
    poolTokenBalance: BaseDecimal.toDecimal(336698001827393),
    selectedDex: DexType.METEORA,
    solBalance: BaseDecimal.toDecimal(86000000000),
    token: new PublicKey('BozKoTGQ3bvDrJnfnbwXEz6Kp4WLcWJHf2JqREbgVbHN'),
    tokenLockPeriod: 30,
    tokenName: 'CATMAN',
    tokenPrice: BaseDecimal.toDecimal(255),
  },
];
export const getPooApedlCount = (token: PublicKey | string): number => {
  const meta = TOKEN_META.find(({ mint }) => mint.toString() === token.toString());
  return meta?.extra_ape_count ?? 0;
};
export const LEGACY_POOL_IDS = LEGACY_POOLS.map(({ poolId }) => poolId.toString());
export const isLegacyPool = (poolId: PublicKey | string): boolean =>
  LEGACY_POOL_IDS.indexOf(poolId.toString()) > -1;

export const getLegacyPoolById = (poolId: PublicKey | string): PoolData | undefined => {
  if (isLegacyPool(poolId)) {
    const pool = LEGACY_POOLS.find(({ poolId: id }) => id.toString() === poolId.toString());
    return pool || undefined;
  }
};

export const getLegacyPoolsByUser = (userId?: PublicKey | string): PoolData[] =>
  userId ? LEGACY_POOLS.filter((item) => item.poolCreator.toString() === userId.toString()) : [];
