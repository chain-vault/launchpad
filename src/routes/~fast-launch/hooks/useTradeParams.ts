import { useAtom } from 'jotai';

import { TradeTypes } from '@app-types/index';

import { NATIVE_TOKEN_ADDRESS } from '@constants/config';

import { tradeType } from '../state/atom';
import { useFastLaunchParams } from './useFastLaunchParams';

export const useTradeParams = () => {
  const [type] = useAtom(tradeType);
  const { tokenAddress } = useFastLaunchParams();
  const isBuy = type === TradeTypes.BUY;
  return {
    in: (isBuy ? NATIVE_TOKEN_ADDRESS.toString() : tokenAddress) ?? '',
    out: (isBuy ? tokenAddress : NATIVE_TOKEN_ADDRESS.toString()) ?? '',
  };
};
