import type { ReactElement } from 'react';
import React from 'react';

import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  SimpleGrid,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';

import { ClipboardText } from '@components/ClipboardText';
import withContainer from '@components/HOC/withContainer';
import { PageHeader } from '@components/PageHeader';
import { ApeInCurveMode, CurveIndex, DEFAULT_TOKEN_DECIMAL } from '@constants/config';
import useGetCurveSettings from '@hooks/apein/useGetCurveSettings';
import { useApeInSettings } from '@hooks/apein/usePoolSettings';
import useLBPSettings from '@hooks/lbp/useLBPSettings';
import { formatDate } from '@utils/formatDate';
import { formatNumber, NumberFormatType } from '@utils/formatNumbers';
import { Token } from '@utils/token';

type SettingsMetricsProps = {
  children?: ReactElement;
  isLoading?: boolean;
  label: string;
  value?: number | string;
};
const SettingsMetrics = ({ children, isLoading = false, label, value }: SettingsMetricsProps) => (
  <VStack alignItems="flex-start" w="max-content">
    <Text opacity={0.5} textStyle="body-xs">
      {label}
    </Text>
    <Skeleton isLoaded={!isLoading}>
      {value && <Text textStyle="body-regular-bold">{value}</Text>}
      {!children && !value && <Text textStyle="body-regular-bold">-</Text>}
      {children}
    </Skeleton>
  </VStack>
);

const CurveSetting: React.FC<{ curveIndex: CurveIndex; title: string }> = ({
  curveIndex,
  title,
}) => {
  const {
    curveAccount,
    curveSettings,
    isLoading: isCurveSettingsLoading,
  } = useGetCurveSettings(undefined, curveIndex);
  return !isCurveSettingsLoading && curveSettings ?
      <Card borderRadius="2xl !important">
        <CardHeader textAlign="left">
          <Text textStyle="h3">{title}</Text>
        </CardHeader>
        <Divider />
        <CardBody>
          <Flex flexWrap="wrap" gap={8} justifyContent="space-between">
            <SettingsMetrics label="Curve Index" value={curveSettings.curveIndex} />
            <SettingsMetrics label="Platform Authority">
              <ClipboardText>{curveAccount?.toString() ?? ''}</ClipboardText>
            </SettingsMetrics>
            <SettingsMetrics
              label="Initial Coefficient1"
              value={curveSettings.coefficient1.valueOf()}
            />
            <SettingsMetrics
              label="Initial Coefficient2"
              value={curveSettings.coefficient2.valueOf()}
            />
            <SettingsMetrics
              label="Product constant (k)"
              value={curveSettings.productConstant.valueOf()}
            />
            <SettingsMetrics
              label="Max raise amount "
              value={`${formatNumber({ input: Token.fromRawAmount(curveSettings.maxRaiseAmount), placeholder: '-', suffix: 'SOL', type: NumberFormatType.TxValuesFormatter })}`}
            />
            <SettingsMetrics
              label="Tokens for sale"
              value={`${formatNumber({ input: Token.fromRawAmount(curveSettings.maxSoldTokens, DEFAULT_TOKEN_DECIMAL), placeholder: '-', suffix: 'Tokens', type: NumberFormatType.TxValuesFormatter })}`}
            />
            <SettingsMetrics
              label="Target market cap"
              value={`${formatNumber({ input: Token.fromRawAmount(curveSettings.targetMarketcap), placeholder: '-', suffix: 'SOL', type: NumberFormatType.TxValuesFormatter })}`}
            />
          </Flex>
        </CardBody>
      </Card>
    : null;
};

const PoolSettings = () => {
  const { data, isLoading } = useLBPSettings();
  const { data: fastLaunchData, isLoading: isFastLaunchLoading } = useApeInSettings();

  return (
    <SimpleGrid gap={6}>
      <PageHeader title="ApeOn Settings" includePoolNav />
      {isLoading || isFastLaunchLoading || !data ?
        <Skeleton height="100px" />
      : <Flex flexDirection="column" gap={16} w="100%">
          <Card borderRadius="2xl !important">
            <CardHeader textAlign="left">
              <Text textStyle="h3"> LBP Settings</Text>
            </CardHeader>
            <Divider />
            <CardBody>
              <Flex flexWrap="wrap" gap={4} justifyContent="space-between">
                <SettingsMetrics label="Platform Authority">
                  <ClipboardText>{data?.platformAuthority.toString() ?? ''}</ClipboardText>
                </SettingsMetrics>
                <SettingsMetrics
                  label="Platform Fee"
                  value={`${data.platformFeeNumerator.div(10)}%`}
                />
                <SettingsMetrics label="Swap Fee" value={`${data.swapFeeNumerator.div(10)}%`} />
                <SettingsMetrics
                  value={
                    data?.isPaused !== undefined ?
                      data?.isPaused ?
                        'Yes'
                      : 'No'
                    : '-'
                  }
                  label="LBP Paused"
                />
              </Flex>
            </CardBody>
          </Card>

          {fastLaunchData && (
            <Card borderRadius="2xl !important">
              <CardHeader textAlign="left">
                <Text textStyle="h3">{`Ape In Settings (Curve env: ${ApeInCurveMode})`}</Text>
              </CardHeader>
              <Divider />
              <CardBody>
                <Flex flexWrap="wrap" gap={8} justifyContent="space-between">
                  <SettingsMetrics
                    label="Trade Fee"
                    value={`${fastLaunchData.tradeFeeNumerator.div(10)}%`}
                  />

                  <SettingsMetrics
                    label="Minimum trade SOL amount"
                    value={`${formatNumber({ input: Token.fromRawAmount(fastLaunchData.tradeMinimumSolAmount), placeholder: '-', suffix: 'SOL', type: NumberFormatType.TxValuesFormatter })}`}
                  />
                  <SettingsMetrics
                    label="Initial token supply"
                    value={`${formatNumber({ input: Token.fromRawAmount(fastLaunchData.initialTokenForSale, DEFAULT_TOKEN_DECIMAL), placeholder: '-', suffix: 'Tokens', type: NumberFormatType.TxValuesFormatter })}`}
                  />

                  <SettingsMetrics
                    value={
                      fastLaunchData.isPaused !== undefined ?
                        fastLaunchData.isPaused ?
                          'Yes'
                        : 'No'
                      : '-'
                    }
                    label="ApeIn Paused"
                  />
                  <SettingsMetrics
                    label="Created/ Modified At"
                    value={formatDate(fastLaunchData.updatedAt) ?? ''}
                  />

                  <SettingsMetrics label="Platform Authority">
                    <ClipboardText>
                      {fastLaunchData.platformAuthority.toString() ?? ''}
                    </ClipboardText>
                  </SettingsMetrics>
                  <SettingsMetrics label="Trade fee wallet">
                    <ClipboardText>{fastLaunchData.tradeFeeWallet.toString() ?? ''}</ClipboardText>
                  </SettingsMetrics>
                  <SettingsMetrics label="Liquidity creator wallet">
                    <ClipboardText>
                      {fastLaunchData.liquidityCreatorWallet.toString() ?? ''}
                    </ClipboardText>
                  </SettingsMetrics>

                  <SettingsMetrics label="LP risk mitigation wallet">
                    <ClipboardText>
                      {fastLaunchData.lpRiskMitigationWallet.toString() ?? ''}
                    </ClipboardText>
                  </SettingsMetrics>
                </Flex>
              </CardBody>
            </Card>
          )}

          <CurveSetting
            curveIndex={CurveIndex.PRIME_LAUNCH}
            title="Ape In Prime Launch curve Settings"
          />
          <CurveSetting
            curveIndex={CurveIndex.NANO_LAUNCH}
            title="Ape In Nano Launch curve Settings"
          />
        </Flex>
      }
    </SimpleGrid>
  );
};

export default withContainer(PoolSettings);
