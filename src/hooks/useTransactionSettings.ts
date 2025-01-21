import {
  transactionSettingsReadOnly,
  updateSlippageAtom,
  updateTransactionSettingsAtom,
} from '@atoms/index';
import { useAtom, useAtomValue } from 'jotai';

import { Slippage } from '@app-types/index';

import { BASE_CONFIG } from '@constants/config';

const useTransactionSettings = () => {
  const { customRPCUrl, priorityFees, selectedRPC, slippage } = useAtomValue(
    transactionSettingsReadOnly
  );

  const [, updateSlippage] = useAtom(updateSlippageAtom);
  const [, updateTransactionSettings] = useAtom(updateTransactionSettingsAtom);

  const onUpdateSlippage = (value: string) => {
    if (value === Slippage.AUTO) updateSlippage(Slippage.AUTO);
    else if (value === Slippage.MAX) updateSlippage(Slippage.MAX);
    else if (value === '') updateSlippage('');
    else updateSlippage(parseFloat(value));
  };
  const isCustomRPC = customRPCUrl && customRPCUrl !== BASE_CONFIG.rpcUrl;

  return {
    customRPCUrl,
    isCustomRPC,
    onUpdateSlippage,
    priorityFees,
    selectedRPC,
    slippage,
    updateTransactionSettings,
  };
};

export default useTransactionSettings;
