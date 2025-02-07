import { CurveIndex } from '@constants/config';

export enum TABS {
  Info = 'Info',
  // eslint-disable-next-line perfectionist/sort-enums
  Chart = 'Chart',
  Trade = 'Trade',
  // eslint-disable-next-line perfectionist/sort-enums
  Holders = 'Holders',

  Txs = 'Txs',
}
export type TabNames = `${TABS}`;

export type FastLaunchForm = {
  beastBiography: string;
  beastDescription: string;
  beastGreeting: string;
  cookieFun: boolean;
  discord: string;
  initialBuy: number | string;
  lockToken: {
    locked: boolean;
    period: string;
  };
  migrationDEX: string;
  otherLink: string;
  outToken?: string;
  projectDescription: string;
  telegram: string;
  tokenLogo: null | typeof File;
  tokenName: string;
  tokenTicker: string;
  twitter: string;
  type: CurveIndex;
  website: string;
};
