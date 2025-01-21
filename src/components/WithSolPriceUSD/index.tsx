import { FC } from 'react';

import { Skeleton, TextProps } from '@chakra-ui/react';

import { NumberType } from '@app-types/index';

import NumberWithTooltip from '@components/ui/Tooltip/NumberWithTooltip';
import { useSolUsdPrice } from '@hooks/useSolUsdPrice';
import { formatNumber, NumberFormatType } from '@utils/formatNumbers';

export type Options = {
  formattingType: NumberFormatType;
  placeholder: string;
  prefix: string;
};
const DEFAULTS: Options = {
  formattingType: NumberFormatType.TxDisplayValuesFormatterWithSubscript,
  placeholder: '-',
  prefix: '$',
};

interface WithSolPriceUSDProps extends TextProps {
  formatOptions?: Options;
  solInput: NumberType;
}

const WithSolPriceUSD: FC<WithSolPriceUSDProps> = ({
  formatOptions,
  solInput,
  ...textProps
}: WithSolPriceUSDProps) => {
  const { isLoading, isPending, isRefetching, usdValue } = useSolUsdPrice(solInput);
  const options = { ...DEFAULTS, ...formatOptions };

  const displayText =
    usdValue ?
      `${options.prefix}${formatNumber({ input: usdValue, type: options.formattingType })}`
    : options.placeholder;

  return isLoading && isPending ?
      <Skeleton border="solid" h="15px" isLoaded={!isLoading && !isPending} w="50px" />
    : <NumberWithTooltip
        tooltip={isRefetching ? 'Updating...' : (usdValue ?? options.placeholder)}
        {...textProps}
      >
        {displayText}
      </NumberWithTooltip>;
};

export default WithSolPriceUSD;
