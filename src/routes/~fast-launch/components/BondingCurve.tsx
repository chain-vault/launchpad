import React, { useEffect, useRef } from 'react';

import { Box, Card, CardBody, Flex, Stack, Text, Tooltip } from '@chakra-ui/react';

import WithSolPriceUSD from '@components/WithSolPriceUSD';
import { NATIVE_TOKEN_DECIMAL } from '@constants/config';
import useGetCurveSettings from '@hooks/apein/useGetCurveSettings';
import { useGetPoolById } from '@hooks/apein/useGetPool';
import { useTokenMetadata } from '@hooks/useToken';
import { formatNumber, formatPercent, NumberFormatType } from '@utils/formatNumbers';
import { capitalizeFirstLetter } from '@utils/formatString';
import { Token } from '@utils/token';

import { useFastLaunchParams } from '../hooks/useFastLaunchParams';
import { useFastLaunchSearchParams } from '../hooks/useFastLaunchSearchParams';

type TokenBondingCurveCardProps = {
  label: string;
  originalValue: string | undefined;
  value: number | string;
};
const TokenBondingCurveCard: React.FC<TokenBondingCurveCardProps> = ({
  label,
  originalValue,
  value,
}) => (
  <Tooltip isDisabled={!originalValue} label={originalValue}>
    <Flex
      bg="surface.base.500"
      borderRadius="md"
      direction="column"
      flex="auto"
      px={2}
      py={2}
      userSelect="none"
    >
      <Flex>
        <Text as="span" textStyle="body-sm-bold">
          {value}
        </Text>
      </Flex>
      <Flex>
        <Text as="span" textStyle="body-xs">
          {label}
        </Text>
      </Flex>
    </Flex>
  </Tooltip>
);

export const BondingCurve: React.FC = () => {
  const progressbar = useRef<HTMLDivElement>(null);
  const { data: poolData, isLoading: isPoolDataLoading } = useGetPoolById(
    useFastLaunchSearchParams().pool
  );
  const { curveSettings } = useGetCurveSettings(poolData?.curveAccount);
  const { poolTokenMetadata } = useTokenMetadata(useFastLaunchParams().tokenAddress, true);
  useEffect(() => {
    if (poolData?.bondingCurveProgress) {
      setTimeout(() => {
        if (progressbar.current) {
          progressbar.current.style.width = `${poolData?.bondingCurveProgress}%`;
        }
      }, 1000);
    }
  }, [poolData]);
  if (isPoolDataLoading) {
    return null;
  }
  const isCompleted = !!poolData?.curveThresholdReached;

  return (
    <Box width="100%">
      <Card>
        {/* <CardHeader>Hello</CardHeader> */}

        <CardBody>
          {isCompleted && (
            <Flex fontWeight="bold" mb={4} textStyle="body-md">
              CREEEK!! Bonding curve completed!
            </Flex>
          )}

          <Flex
            alignItems="center"
            direction="row"
            fontWeight="bold"
            justifyContent="space-between"
            mb={1}
            py={2}
          >
            <Flex flex="auto" textStyle="body-regular-bold">
              Bonding curve progress :
              <Text as="span" color="brand.accent.600" ml={2} textStyle="body-regular-semibold">
                {formatPercent(poolData?.bondingCurveProgress)}
              </Text>
            </Flex>
          </Flex>

          <Box>
            <Box bg="surface.base.500" borderRadius={10} width="100%">
              <Box
                aria-valuenow={49}
                bg="brand.accent.600"
                borderRadius={10}
                height="8px"
                ref={progressbar}
                role="progressbar"
                transition="all cubic-bezier(0.4, 0, 1, 1) .8s"
                transitionDelay=".8s"
                w="0%"
              />
            </Box>
          </Box>

          {!isCompleted && (
            <>
              <Flex mb={3} py={2}>
                <Text color="surface.base.800" textStyle="body-md">
                  {`When the market cap reaches `}
                  <WithSolPriceUSD
                    solInput={Token.fromRawAmount(curveSettings?.targetMarketcap ?? 0)}
                  />

                  {` (${formatNumber({
                    input: Token.fromRawAmount(curveSettings?.targetMarketcap ?? '').toString(),
                    placeholder: '-',
                    suffix: 'SOL',
                    type: NumberFormatType.TxDisplayValuesFormatterWithSubscript,
                  })}) all the liquidity from the bonding curve will be deposited into ${capitalizeFirstLetter(poolData?.selectedDex)} and burned. Progression increases as the price goes up.`}
                </Text>
              </Flex>
              <Flex direction="row">
                <Stack direction="row" py={2}>
                  {[
                    {
                      label: 'SOL',
                      originalValue: Token.fromRawAmount(
                        poolData?.solBalance.toString() ?? 0,
                        NATIVE_TOKEN_DECIMAL
                      ).toString(),
                      value: formatNumber({
                        input: Token.fromRawAmount(poolData?.solBalance.toString() ?? 0),
                        type: NumberFormatType.TokenBalanceFormatter,
                      }),
                    },
                    {
                      label: `${poolTokenMetadata?.symbol ?? ''}`,
                      originalValue: Token.fromRawAmount(
                        poolData?.poolTokenBalance.toString() ?? 0,
                        6
                      ).toString(),
                      value: formatNumber({
                        input: Token.fromRawAmount(poolData?.poolTokenBalance ?? 0, 6),
                        type: NumberFormatType.TxDisplayValuesFormatterWithSubscript,
                      }),
                    },
                  ].map((item) => (
                    <TokenBondingCurveCard key={item.label} {...item} />
                  ))}
                </Stack>
              </Flex>
            </>
          )}
        </CardBody>
      </Card>
    </Box>
  );
};
