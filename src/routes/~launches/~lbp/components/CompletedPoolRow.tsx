import { Flex, Text } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';

import { LBPPoolWithTokenData } from '@app-types/lbp';

import { Td, Tr } from '@components/DataTable';
import { TokenCard } from '@components/TokenCard';
import NumberWithTooltip from '@components/ui/Tooltip/NumberWithTooltip';
import { NATIVE_TOKEN } from '@constants/config';
import useResponsiveValue from '@hooks/useResponsiveValue';
import { formatDate } from '@utils/formatDate';
import { formatNumber, NumberFormatType } from '@utils/formatNumbers';
import { Token } from '@utils/token';

export const CompletedPoolRow = ({ participantsCount, ...pool }: LBPPoolWithTokenData) => {
  const { startAt, token } = pool;
  const navigate = useNavigate();
  const onClickHandler = () => {
    navigate({
      params: { poolAddress: pool.poolAddress.toString() },
      to: '/lbp/swap/$poolAddress',
    });
  };
  const isMobile = useResponsiveValue({ base: true, md: false });
  return !isMobile ?
      <Tr onClick={onClickHandler} pb={2} px={0} py={1}>
        <Flex alignItems="center" justify="space-between" width="100%">
          <Td flex={2}>
            <TokenCard token={token.toString()} />
          </Td>
          <Flex flex={2} justify="space-between">
            <Td textStyle={['body-sm']}>
              <NumberWithTooltip tooltip={Token.fromRawAmount(pool.fundRaised).valueOf()}>
                {formatNumber({
                  input: Token.fromRawAmount(pool.fundRaised),
                  placeholder: '0 SOL',
                  suffix: NATIVE_TOKEN.symbol,
                  type: NumberFormatType.TxDisplayValuesFormatterWithSubscript,
                })}
              </NumberWithTooltip>
            </Td>
            <Td>
              <Text as="span" textStyle={['body-sm']}>
                {participantsCount || 0}
              </Text>
            </Td>
            <Td textStyle={['body-sm']}>{formatDate(startAt)}</Td>
          </Flex>
        </Flex>
      </Tr>
    : <Tr onClick={onClickHandler} pb={1}>
        <Td maxW="100%" pb={1}>
          <Flex alignItems="center" justifyContent="space-between">
            <Td flex={1}>
              <TokenCard
                token={
                  pool.logoUrl && pool.symbol ?
                    { logoUrl: pool.logoUrl, name: pool.name, symbol: pool.symbol }
                  : pool.token.toString()
                }
              />
            </Td>

            <Flex flex={2} justify="space-between">
              <Td textStyle={['body-sm']}>
                {formatNumber({
                  input: Token.fromRawAmount(pool.fundRaised),
                  placeholder: '0 SOL',
                  suffix: NATIVE_TOKEN.symbol,
                  type: NumberFormatType.TxDisplayValuesFormatterWithSubscript,
                })}
              </Td>
              <Td flex={[0.5, 1]}>
                <Text as="span" textStyle={['body-sm']}>
                  {participantsCount || 0}
                </Text>
              </Td>
              <Td textStyle={['body-sm']}>{formatDate(startAt)}</Td>
            </Flex>
          </Flex>
        </Td>
      </Tr>;
};
