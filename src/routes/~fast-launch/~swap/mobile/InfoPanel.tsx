import React from 'react';

import { Box, Text } from '@chakra-ui/react';

import { useGetPoolById } from '@hooks/apein/useGetPool';
import { useTokenMetadata } from '@hooks/useToken';
import { BondingCurve } from '@routes/~fast-launch/components/BondingCurve';
import { DeveloperInfo } from '@routes/~fast-launch/components/DeveloperInfo';
import { ProjectInfo } from '@routes/~fast-launch/components/ProjectInfo';
import { TokenDetails } from '@routes/~fast-launch/components/TokenDetails';
import { useFastLaunchSearchParams } from '@routes/~fast-launch/hooks/useFastLaunchSearchParams';
import { useTokenAddress } from '@routes/~fast-launch/hooks/useTokenAddress';
import { decompressString } from '@utils/textCompression';

export const InfoPanel: React.FC = () => {
  const { data: poolData, isLoading: isPoolDataLoading } = useGetPoolById(
    useFastLaunchSearchParams().pool
  );
  const { isMetaDataLoading, poolTokenMetadata } = useTokenMetadata(useTokenAddress(), true);
  const desc = decompressString(poolTokenMetadata?.poolDescription ?? '');

  return (
    <Box>
      <Box mb={3}>
        <BondingCurve />
      </Box>
      {!isPoolDataLoading && poolData?.hasTokenLockBeenApplied && (
        <Box mb={3}>
          <DeveloperInfo />
        </Box>
      )}
      <Box mb={3} px={2} textStyle="body-xs">
        {!isMetaDataLoading && desc && desc.length && (
          <Box mb={1}>
            <Text textStyle="body-md-bold">Agent Description</Text>
          </Box>
        )}
        <Box>
          <ProjectInfo />
        </Box>
      </Box>
      <Box mb={3}>
        <TokenDetails />
      </Box>
    </Box>
  );
};
