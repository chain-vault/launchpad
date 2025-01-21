import { PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';

import { DexType, LockType } from '@app-types/index';

import { Token } from '@utils/token';

import { SolLogo } from '@assets/icons';
import { Meteora, Radium } from '@assets/imges';
/**
 * ENVs, app base urls and web3 related configs and constants
 */
export const BASE_CONFIG = {
  apeInProgramId: import.meta.env.VITE_APEIN_PROGRAM_ID,
  appApiBaseURL: '',
  envMode: import.meta.env.VITE_ENV,
  fastlaunchGraphqlApiEndpoint: import.meta.env.VITE_FAST_LAUNCH_GRAPHQL_API_ENDPOINT,
  lbpGraphqlApiEndpoint: import.meta.env.VITE_LBP_GRAPHQL_API_ENDPOINT,
  network: import.meta.env.VITE_NETWORK,
  rpcUrl: import.meta.env.VITE_RPC,
};

export const CREATE_POOL_FORM = 'https://forms.gle/Mw1u5f2HwoSp2M4H6';

// Base config
export const NATIVE_TOKEN_ADDRESS = 'so11111111111111111111111111111111111111112';
export const NATIVE_TOKEN_DECIMAL = 9;
export const DEFAULT_TOKEN_DECIMAL = 6;
export const MICRO_LAMPORTS = 15;
export const APPRX_COST_TO_DEPLOY = 0.02;
export const BONDING_CURVE_COMPLETION_SOL = 100;
export const ONE = 1_000_000_000;

// ape in lock relates
export const LOCK_PROGRAM_ID = new PublicKey('LocpQgucEQHbqNABEYvBvwoxCPsSbG91A1QaQhQQqjn');
export const EVENT_AUTHORITY = new PublicKey('AqUDk3wybxjZujrNbKmjr2YTUZ8RA1a1nyGgs1zSmvTG');
export const getCurveAccount = (curveIndex: string, programId: PublicKey) =>
  PublicKey.findProgramAddressSync(
    [Buffer.from('fast_curve'), Buffer.from(curveIndex)],
    programId
  )[0];
export enum CurveIndex {
  'NANO_LAUNCH' = '1',
  'PRIME_LAUNCH' = '0',
}
export const ApeInCurveMode = Number(import.meta.env.VITE_APEIN_CURVE_MODE);
export const LBPEnv = Number(import.meta.env.VITE_LBP_ENV);

export const NATIVE_TOKEN = new Token(
  'Solana',
  'SOL',
  NATIVE_TOKEN_DECIMAL,
  NATIVE_TOKEN_ADDRESS,
  SolLogo,
  true,
  true
);

// lbp creation configs
export const COLLATERAL_TOKEN_END_WEIGHT = 90;
export const PROJECT_TOKEN_END_WEIGHT = 10;

// File upload related config
export const ARWEAVE_FREE_UPLOAD_SIZE = 100 * 1024;
export const IRYS_FILE_PREFIX = 'https://gateway.irys.xyz/';

// Slippage settings
export const AUTO_SLIPPAGE_VALUE = 10; // 10%
export const MAX_SLIPPAGE_VALUE = 100; // 100%

export const PRICE_FEED_URL = 'https://tick.apeon.it/history?symbol=SOLUSDT';
export const LOCK_FEE = new Decimal(10_000_000); // 0.01 SOL
export const DEPLOYMENT_BASE_COST = 0.024;
export const JUPITER_LOCK = import.meta.env.VITE_JUPITER_LINK;
export const CHARTING_LIBRARY_PATH = 'https://cdn.apeon.it/charting_library/';
export const MIGRATION_DEX_POOL_URL = {
  [DexType.METEORA]: 'https://app.meteora.ag/pools/',
  [DexType.RAYDIUM]: 'https://raydium.io/swap/?inputMint=sol&outputMint=',
};
export const METEORA_URL = `https://app.meteora.ag/pools/`;
export const RAYDIUM_URL = `https://raydium.io/swap/?inputMint=sol&outputMint=`;
// Explorer url
export const SOLSCAN_BASE_URL = 'https://solscan.io/';
export const SOLEXPLORER_BASE_URL = 'https://explorer.solana.com/';

export const getExplorerUrl = (txHash: string) =>
  `${BASE_CONFIG.network === 'devnet' ? SOLEXPLORER_BASE_URL : SOLSCAN_BASE_URL}tx/${txHash}?cluster=${BASE_CONFIG.network}`;
export const getExplorerUrlAddressUrl = (address: string) =>
  `${BASE_CONFIG.network === 'devnet' ? SOLEXPLORER_BASE_URL : SOLSCAN_BASE_URL}address/${address}?cluster=${BASE_CONFIG.network}`;
export const getTokenLockLink = (token: string) => `${JUPITER_LOCK}${token}`;

export const getMeteoraLink = (pool: string) => `${METEORA_URL}${pool}`;
export const getRaydiumLink = (pool: string) => `${RAYDIUM_URL}${pool}`;

export const getMigrationDexPoolLink = (address: string, selectedDex: DexType = DexType.METEORA) =>
  `${MIGRATION_DEX_POOL_URL[selectedDex]}${address}`;

export const generateSignInMessage = (publicKey: string, nonce: string, timestamp: string) => `
Welcome to apeon.it dapp!

Please sign this message to authenticate your wallet and log in.

- Nonce: ${nonce}
- Solana account: ${publicKey}
- Issued at: ${timestamp}

Signing is the only way that you are the owner of the wallet you are connecting. Signing is safe, gas-less transaction that does not in any way give Apeon permission to perform any transaction with your wallet.
`;

// bubble map link
export const BUBBLE_MAP_LINK = `https://app.bubblemaps.io/sol/token/`;

export const DEX_OPTIONS: LockType[] = [
  {
    description:
      'Earn lifetime rewards with 90% of fees going to creators. Holders and influencer rewards coming soon!',
    icon: Meteora,
    title: 'Meteora',
    value: '0',
  },
  {
    description: 'Migrate Liquidity to the Major CP DEX',
    disabled: false,
    icon: Radium,
    title: 'Raydium',
    value: '1',
  },
];

export const PHANTOM_DOWNLOAD_URL = 'https://phantom.com/';
