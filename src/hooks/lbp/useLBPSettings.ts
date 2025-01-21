import type { Idl } from '@coral-xyz/anchor';

import { useMemo } from 'react';

import { skipToken, useQuery } from '@tanstack/react-query';

import { LBPSettings, LBPSettingsResponse } from '@app-types/lbp';

import { ApeonLbp, LBPIdl } from '@idl/lbp';
import { convertBNToDecimal } from '@utils/decimalHelper';

import { useGetProgramInstance } from '../useGetProgramInstance';

const useLBPSettings = () => {
  const poolProgram = useGetProgramInstance<ApeonLbp>(LBPIdl as Idl, false);
  const programId = poolProgram?.programId;
  const { data, isLoading } = useQuery<LBPSettingsResponse | undefined>({
    queryFn: programId ? () => poolProgram?.account.lbpLaunchSettings.all() : skipToken,
    queryKey: ['lbpSettings', programId],
  });

  const dataFormatted: LBPSettings | undefined = useMemo(
    () => (data?.length && data?.[0]?.account ? convertBNToDecimal(data[0].account) : undefined),
    [data]
  );

  return {
    data: dataFormatted,
    isLoading,
  };
};

export default useLBPSettings;
