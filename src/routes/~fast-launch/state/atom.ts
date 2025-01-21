import { atom } from 'jotai';

import { TradeTypes } from '@app-types/index';

import { TabNames, TABS } from '../types';

export const tabsAtom = atom<TabNames>(TABS.Trade);

type TokenType = {
  address: string;
};
type SwapAtomType = {
  in: TokenType;
  out: TokenType;
  slippage: 'auto' | number;
};

export const swapAtom = atom<null | SwapAtomType>(null);

export type SwapInput = { in: string; out: string };
export type SwapInputKeys = `${keyof SwapInput}`;
export const swapInput = atom<SwapInput>({
  in: '',
  out: '',
});
export const tradeType = atom<TradeTypes>(TradeTypes.BUY);
export const golbalSOLUSDT = atom<{ lastValue: number; updated: number }>({
  lastValue: 0,
  updated: new Date().getTime(),
});
