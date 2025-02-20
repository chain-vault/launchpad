import { useCallback, useMemo } from 'react';

import { type Idl } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { skipToken, useQuery } from '@tanstack/react-query';

import { CurveSettings } from '@app-types/apiIn';

import { CurveIndex, getCurveAccount } from '@constants/config';
import { useGetProgramInstance } from '@hooks/useGetProgramInstance';
import { FastLauchIdl, FastLauchIdlType } from '@idl/fastlaunch';
import { convertBNToDecimal } from '@utils/decimalHelper';

const useGetCurveSettings = (
  account: PublicKey | undefined,
  curveIndex?: CurveIndex
): {
  curveAccount?: PublicKey;
  curveSettings: CurveSettings | undefined;
  isLoading: boolean;
} => {
  const apeInProgram = useGetProgramInstance<FastLauchIdlType>(FastLauchIdl as Idl, false);
  const curveAccount =
    account ||
    (curveIndex ?
      apeInProgram?.programId && getCurveAccount(curveIndex, apeInProgram.programId)
    : undefined);

  const { data: curveSettings, isLoading } = useQuery<CurveSettings | undefined>({
    queryFn:
      apeInProgram && curveAccount ?
        async () => {
          const response = await apeInProgram.account.curveAccounts.fetch(curveAccount);
          return convertBNToDecimal(response);
        }
      : skipToken,
    queryKey: ['curveSettings', curveAccount],
    staleTime: Infinity,
  });

  return {
    curveAccount,
    curveSettings,
    isLoading,
  };
};

export const useGetAllCurveSettings = (): {
  curveSettings: CurveSettings[] | undefined;
  getCurveSettingsById: (id: PublicKey | string) => CurveSettings | null;
  isLoading: boolean;
} => {
  const apeInProgram = useGetProgramInstance<FastLauchIdlType>(FastLauchIdl as Idl, false);
  const accounts = useMemo(
    () =>
      apeInProgram ?
        [
          getCurveAccount(CurveIndex.PRIME_LAUNCH, apeInProgram.programId),
          getCurveAccount(CurveIndex.NANO_LAUNCH, apeInProgram.programId),
        ]
      : [],
    [apeInProgram]
  );

  const { data: curveSettings, isLoading } = useQuery<(CurveSettings | null)[] | undefined>({
    queryFn:
      apeInProgram && accounts.length ?
        async () => {
          const response = await apeInProgram.account.curveAccounts.fetchMultiple(accounts);
          return convertBNToDecimal(response);
        }
      : skipToken,
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['AllcurveSettings', accounts.map((account) => account.toString()).join('')],
    staleTime: Infinity,
  });

  const filterdResult = curveSettings ? curveSettings.filter((item) => item !== null) : [];
  const getCurveSettingsById = useCallback(
    (id: PublicKey | string) => {
      const index = accounts.findIndex((item) => item.toString() === id.toString());
      if (curveSettings && curveSettings[index] && curveSettings[index].curveIndex) {
        return curveSettings[index];
      }
      return null;
    },
    [accounts, curveSettings]
  );

  return {
    curveSettings: filterdResult,
    getCurveSettingsById,
    isLoading,
  };
};

export default useGetCurveSettings;
