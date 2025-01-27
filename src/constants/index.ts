import { SocialIconsMapList } from '@app-types/index';

export const NAVBAR_SOCIAL_ICONS: SocialIconsMapList = [
  {
    id: 'twitter',
    url: 'aiblockbeast',
  },
  {
    id: 'gitbook',
    url: 'https://docs.blockbeast.ai/',
  },
  {
    id: 'telegram',
    url: 'https://t.me/blockbeastai',
  },
];

export const getSocialLinkById = (id: (typeof NAVBAR_SOCIAL_ICONS)[number]['id']) => {
  const selected = NAVBAR_SOCIAL_ICONS.find((item) => item.id === id);
  if (selected) {
    return selected.url;
  }
  return '';
};

export enum InputCardContext {
  TOKENIN = 'TOKENIN',
  TOKENOUT = 'TOKENOUT',
}

export enum WalletInfoButonActions {
  OPEN_WALLET_MODAL,
  DISCONNECT_WALLET,
}

export enum UserAuthenticationStatus {
  ACCOUNT_SWITCHED = 'ACCOUNT_SWITCHED',
  CONNECTING_WALLET = 'CONNECTING_WALLET',
  NOT_AUTHORIZED = 'NOT_AUTHORIZED',
  SIGNING_USER = 'SIGNING_USER',
  USER_AUTHENTICATED = 'USER_AUTHENTICATED',
}

export enum FileUploadStatus {
  FUNDING_ARWEAVE_NODE = 'Funding Arweave node...',
  SIGNING_MESSAGE = 'Verify upload using wallet signature...',
  UPLOAD_ERROR = 'Upload failed!',
  UPLOAD_IDLE = 'Upload idle',
  UPLOAD_INIT = 'Uploading...',
  UPLOAD_SUCCESS = 'Successfully uploaded!',
}

export enum ToastType {
  FAILED = 'Error',
  LOADING = 'Loading',
  SUCCESS = 'Successful',
}

export enum StatusModalTypes {
  FAILED = 'FAILED',
  // IN_PROGRESS = 'IN_PROGRESS',
  SUCCESS = 'SUCCESS',
}

export enum TabMoveAction {
  NEXT = 1,
  PREV = -1,
}

export enum LocalStorageKeys {
  'TRADE_T_AND_C' = 'terms_and_conditions',
}

export const skeletonItems = (skeletonCount: number) =>
  new Array(skeletonCount).fill(null).map((_, index) => `skeleton-${Date.now()}-${index}`);

export * from './config';

export enum AuthErrorMessages {
  AUTHORIZATION_FAILED = 'Authorization failed.',
  Error = 'Error',
  GENERAL_ERROR = 'Something went wrong.',
  INVALID_REFERRAL_CODE = 'Invalid referral code',
  REFERRAL_CODE_ERROR = 'Failed to generate referal code. Please try again!',
}

export enum UploadSteps {
  COMPLETED = 'Token created successfully',
  CREATING_META_DATA = 'Creating metadata',
  CREATING_POOL = 'Creating pool',
  FAILED = 'Failed to create pool',
  FUNDING_ARWEAVE_NODE = FileUploadStatus.FUNDING_ARWEAVE_NODE,
  UPLOADING_METADATA = 'Uploading token metadata...',
}

export enum ProfileView {
  LAUNCHES = 'launches',
  PORTFOLIO = 'portfolio',
}

export const TRENDING_TOKENS = [
  { id: '1', difference: 'positive', name: 'Official Trump', percentage: '16.6%', price: '$50.50' },
  { id: '2', difference: 'negative', name: 'Official Trump', percentage: '16.6%', price: '$50.50' },
  { id: '3', difference: 'negative', name: 'Official Trump', percentage: '16.6%', price: '$50.50' },
];

export const SAMPLE_TOKEN = {
  ca: '4kiKP...Rpump',
  dayChange: 33.8,
  holders: 542,
  interactions: 325,
  marketCap: 187148462711,
  name: 'Trump',
  price: 53.26,
  symbol: 'TRP',
  volume: 18016044741,
};
