import { Box, Flex, HStack, Icon, IconButton, Image, Text, VStack } from '@chakra-ui/react';
import { LuArrowUpDown } from 'react-icons/lu';

import InfoRowItem from '@components/InfoRowItem';
import { DEFAULT_TOKEN_DECIMAL } from '@constants/config';
import BaseDecimal, { DecimalType, ONE_TOKEN } from '@utils/decimalHelper';
import { formatNumber, formatPercent, NumberFormatType } from '@utils/formatNumbers';
import { calculateAmountWithSlippage } from '@utils/formatValues';
import { Token } from '@utils/token';

interface SwapConfirmationModalProps {
  currentMarketPrice?: DecimalType;
  slippage: number;
  swapAmountIn: string;
  swapAmountOut: string;
  swapFee: string;
  tokenIn: Token;
  tokenOut: Token;
}
export const SwapConfirmationModal = ({
  currentMarketPrice,
  slippage,
  swapAmountIn,
  swapAmountOut,
  swapFee,
  tokenIn,
  tokenOut,
}: SwapConfirmationModalProps) => {
  const isBuy = tokenIn.isCollateral;
  const [solAmount, tokenAmount] =
    isBuy ?
      [
        Token.toRawAmount(BaseDecimal.toDecimal(swapAmountIn).sub(swapFee)),
        Token.toRawAmount(swapAmountOut, DEFAULT_TOKEN_DECIMAL),
      ]
    : [Token.toRawAmount(swapAmountOut), Token.toRawAmount(swapAmountIn, DEFAULT_TOKEN_DECIMAL)];

  const tokenPrice = solAmount.mul(ONE_TOKEN).div(tokenAmount).trunc();

  const priceImpact =
    currentMarketPrice && tokenPrice.sub(currentMarketPrice).div(currentMarketPrice).mul(100);

  // const pricePerInToken =
  //   isBuy ?
  //     BaseDecimal.toDecimal(1).div(Token.fromRawAmount(tokenPrice)).valueOf()
  //   : Token.fromRawAmount(tokenPrice).valueOf();

  const displayPrice = BaseDecimal.toDecimal(swapAmountOut ?? 0).div(
    BaseDecimal.toDecimal(swapAmountIn ?? '')
  );

  return tokenIn && tokenOut ?
      <Flex direction="column" gap={6}>
        <VStack gap={0.5} px={5}>
          <Box bg="surface.base.200" borderRadius="xl" padding={4} w="100%">
            <HStack gap={2}>
              <Image boxSize={8} src={tokenIn?.logoUrl} />
              <VStack alignItems="flex-start">
                <Text opacity={0.5} textStyle="body-sm">
                  You Pay
                </Text>
                <Text textStyle="body-regular-bold" wordBreak="break-all">
                  {BaseDecimal.toDecimal(swapAmountIn).toDP(tokenIn.decimal).valueOf()}{' '}
                  {tokenIn?.symbol}
                </Text>
              </VStack>
            </HStack>
          </Box>
          <IconButton
            aria-label="swap-tokens"
            icon={<Icon as={LuArrowUpDown} boxSize={4} />}
            // onClick={onSwitchTokens}
            opacity={0.6}
            size="xs"
            variant="ghost"
            w="auto"
          />
          <Box bg="surface.base.200" borderRadius="xl" padding={4} w="100%">
            <HStack gap={2}>
              <Image borderRadius="full" boxSize={8} src={tokenOut?.logoUrl} />
              <VStack alignItems="flex-start">
                <Text opacity={0.5} textStyle="body-sm">
                  You Receive
                </Text>
                <Text textStyle="body-regular-bold" wordBreak="break-all">
                  {BaseDecimal.toDecimal(swapAmountOut).toDP(tokenOut.decimal).valueOf()}{' '}
                  {tokenOut.symbol}
                </Text>
              </VStack>
            </HStack>
          </Box>
        </VStack>

        {/* Details */}
        <Box bg="surface.base.200" opacity={0.5} p={4}>
          <VStack>
            <InfoRowItem
              label="Price"
              tooltipValue={displayPrice.valueOf()}
              value={`1 ${tokenIn.symbol} ≈ ${formatNumber({ input: displayPrice, suffix: tokenOut.symbol, type: NumberFormatType.TxValuesFormatter })}`}
            />
            {/* <InfoRowItem label="Liquidity Provider Fee" value="0.00297 SOL" /> */}
            {currentMarketPrice && priceImpact && (
              <InfoRowItem
                helperText="The impact your trade has on the market price of this pool."
                isPositive={priceImpact?.isPositive()}
                label="Price Impact"
                value={formatPercent(priceImpact.toNumber())}
              />
            )}
            <InfoRowItem label="Slippage tolerance" value={`${slippage.toString()}%`} />
            <InfoRowItem
              tooltipValue={Token.fromRawAmount(
                calculateAmountWithSlippage(swapAmountOut ?? '0', slippage, tokenOut.decimal),
                tokenOut.decimal
              ).valueOf()}
              label="Minimum received"
              value={`≈ ${formatNumber({ input: Token.fromRawAmount(calculateAmountWithSlippage(swapAmountOut ?? '0', slippage, tokenOut.decimal), tokenOut.decimal), placeholder: `0 ${tokenOut.symbol}`, suffix: tokenOut.symbol, type: NumberFormatType.TxValuesFormatter })}`}
            />
            <InfoRowItem
              label="Swap fee"
              tooltipValue={swapFee}
              value={`≈ ${formatNumber({ input: swapFee, suffix: 'SOL', type: NumberFormatType.TxValuesFormatter })}`}
            />
          </VStack>
        </Box>
      </Flex>
    : null;
};
