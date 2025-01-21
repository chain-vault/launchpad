import { type Idl } from '@coral-xyz/anchor';
import { queryOptions, skipToken, useQuery } from '@tanstack/react-query';

import { ApeInPoolSettings } from '@app-types/apiIn';

import { ApeonFastlaunch, FastLauchIdl } from '@idl/fastlaunch';
import { convertBNToDecimal } from '@utils/decimalHelper';

import { getProgramInstance, useGetProgramInstance } from '../useGetProgramInstance';

export const useApeInSettings = (): {
  data: ApeInPoolSettings[0]['account'] | undefined;
  isLoading: boolean;
} => {
  const poolProgram = useGetProgramInstance<ApeonFastlaunch>(FastLauchIdl as Idl, false);
  const { data, isLoading } = useQuery<ApeInPoolSettings | undefined>({
    queryFn:
      poolProgram?.programId ?
        async () => {
          const response = await poolProgram?.account.fastLaunchSettings.all();
          return convertBNToDecimal(response);
        }
      : skipToken,
    queryKey: ['apeInSettings', poolProgram?.programId],
  });

  return {
    data: data?.[0]?.account,
    isLoading,
  };
};

export const getPoolSettingsQueryOptions = () => {
  const poolProgram = getProgramInstance<ApeonFastlaunch>(FastLauchIdl as Idl);
  const poolSettingsQueryOptions = queryOptions({
    queryFn:
      poolProgram?.programId ?
        async () => {
          const response = await poolProgram?.account.fastLaunchSettings.all();
          return convertBNToDecimal(response);
        }
      : skipToken,
    queryKey: ['apeInSettings', poolProgram?.programId],
  });
  return poolSettingsQueryOptions;
};
