import React, { useState } from 'react';

import { transactionSettings } from '@atoms/index';
import {
  Alert,
  Box,
  Button,
  Card,
  CardBody,
  Checkbox,
  Flex,
  Icon,
  IconButton,
  SkeletonText,
  Text,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { IoMdRefresh } from 'react-icons/io';
import { LuArrowUpDown } from 'react-icons/lu';

import { SwapActionButton } from '@components/SwapActionButton';
import { SwapConfirmationModal } from '@components/SwapConfirmation';
import TransactionSettings from '@components/TransactionSettings';
import { ToggleButtonControlled } from '@components/ui/Button';
import InputGroup from '@components/ui/Input/InputGroup';
import { BasicModal } from '@components/ui/Modals';
import { ConnectWalletButton } from '@components/WalletAdapter';
import { TRADE_TYPE_OPTIONS } from '@constants/config/transactions';
import { TRANSACTION_MESSAGES } from '@constants/messages';
import { useConnectWallet } from '@hooks/useWalletConnection';
import { shrinkText } from '@utils/shrinkText';
import { Token } from '@utils/token';

import { useSwap } from '../hooks/useSwap';
import { useSwapData } from '../hooks/useSwapData';
import { CurveCompleted } from './CurveCompleted';

export const SwapSection: React.FC = () => {
  const [rotation, setRotation] = useState(0);
  const [isClockwise, setIsClockwise] = useState(true);
  const { isConnected } = useConnectWallet();
  const {
    bondingCurveCompleted,
    buttonEnabled,
    buttonLabel,
    confirmation,
    currentMarketPrice,
    description,
    fee,
    formatedBalence,
    isBuy,
    isTokenBalenceLoading,
    maxAllowedSolInput,
    onChangeHandler,
    onSetMaxAmount,
    onToggle,
    refetchTokenBalence,
    reset,

    showWaring,
    slippage,
    tokenIn,
    tokenOut,
    values,
  } = useSwapData();

  const [{ showConfirmationPopUp }, updateTransactionSettings] = useAtom(transactionSettings);

  const swapAmountIn =
    isBuy ?
      Token.toRawAmount(values.in).greaterThan(maxAllowedSolInput) ?
        Token.fromRawAmount(maxAllowedSolInput).valueOf()
      : values.in
    : values.in;

  const { isPending, onSwap } = useSwap();

  const onClickSwitchTokenIcon = () => {
    setRotation((prevRotation) => prevRotation + (isClockwise ? 180 : -180));
    setIsClockwise((prev) => !prev);
    onToggle();
  };

  const onConfirm = () => {
    confirmation.onClose();
    reset();
    onSwap();
  };

  const onSwapHandler = () => {
    if (!showConfirmationPopUp) {
      onConfirm();
      return;
    }
    confirmation.onOpen();
  };

  return (
    <Card bg="surface.base.600 !important">
      {!bondingCurveCompleted && (
        <>
          {tokenIn && tokenOut && confirmation.isOpen && values.in && values.out && (
            <BasicModal
              footer={
                <SwapActionButton
                  confirmMessage={isBuy ? 'Buy' : 'Sell'}
                  disabledMessage=""
                  isLoading={isPending}
                  isWalletConected={isConnected}
                  onClickAction={onConfirm}
                  fastLaunch
                />
              }
              modalBody={
                <SwapConfirmationModal
                  currentMarketPrice={currentMarketPrice}
                  slippage={slippage}
                  swapAmountIn={swapAmountIn}
                  swapAmountOut={values.out}
                  swapFee={fee || ''}
                  tokenIn={tokenIn}
                  tokenOut={tokenOut}
                />
              }
              header={<Text textStyle="body-regular-bold">Confirm transaction</Text>}
              isOpen={confirmation.isOpen}
              modalBodyProps={{ mx: 0, px: 0 }}
              modalContentProps={{ bg: 'surface.base.600' }}
              onClose={confirmation.onClose}
              size={{ base: 'xs', md: 'sm' }}
            />
          )}
          <CardBody>
            <Flex direction="column">
              <Flex direction="row" justifyContent="space-between" mb={4}>
                <Flex>
                  <ToggleButtonControlled
                    onSwitchToggle={onClickSwitchTokenIcon}
                    options={TRADE_TYPE_OPTIONS}
                    value={isBuy ? TRADE_TYPE_OPTIONS[0].value : TRADE_TYPE_OPTIONS[1].value}
                    variant="trade"
                  />
                </Flex>
                <Flex>
                  <TransactionSettings colorScheme="accent" toggleButtonVariant="lbp" />
                </Flex>
              </Flex>
              <Box mb={2}>
                <Flex direction="row" justifyContent="space-between" mb={2}>
                  <Flex textStyle="body-md">You Pay</Flex>
                  <Flex color="surface.base.800" textStyle="body-md">
                    <Flex alignItems="center" gap={2} justifyContent="space-between">
                      <IconButton
                        aria-label="refetch-balance"
                        boxSize={6}
                        icon={<Icon as={IoMdRefresh} />}
                        minW="unset"
                        onClick={() => refetchTokenBalence()}
                        p={3}
                        variant="filled"
                      />
                      <SkeletonText isLoaded={!isTokenBalenceLoading} noOfLines={1}>
                        <Text opacity={0.6} textStyle="body-sm">
                          Available: {formatedBalence}
                        </Text>
                      </SkeletonText>

                      <Button
                        borderRadius="md"
                        h={4}
                        onClick={onSetMaxAmount}
                        p="1"
                        size="xs"
                        variant="accent"
                      >
                        <Text textStyle="body-xs">MAX</Text>
                      </Button>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex direction="row" justifyContent="space-between" mb={1}>
                  <InputGroup
                    inputRightElement={
                      <InputGroup.TokenInputRightElement
                        tokenLogo={tokenIn?.logoUrl}
                        tokenTicker={tokenIn?.symbol.slice(0, 12)}
                      />
                    }
                    name="in"
                    onChange={onChangeHandler}
                    placeholder="0.00"
                    size="lg"
                    type="number"
                    value={values.in}
                  />
                </Flex>
              </Box>
              <Flex justifyContent="center">
                <IconButton
                  aria-label="swap-tokens"
                  icon={<Icon as={LuArrowUpDown} boxSize={5} />}
                  mb={-5}
                  onClick={onClickSwitchTokenIcon}
                  opacity={0.6}
                  transform={`rotate(${rotation}deg)`}
                  transition="transform 0.5s ease"
                  variant="ghost"
                />
              </Flex>
              <Box mb={2}>
                <Flex direction="row" justifyContent="space-between" mb={2}>
                  <Flex textStyle="body-md">You Receive</Flex>
                </Flex>
                <Flex direction="row" justifyContent="space-between">
                  <InputGroup
                    inputRightElement={
                      <InputGroup.TokenInputRightElement
                        tokenLogo={tokenOut?.logoUrl}
                        tokenTicker={shrinkText({ string: tokenOut?.symbol ?? '' })}
                      />
                    }
                    name="out"
                    onChange={onChangeHandler}
                    placeholder="0.00"
                    size="lg"
                    type="number"
                    value={values.out}
                  />
                </Flex>
              </Box>

              {!!(description || showWaring) && (
                <Box>
                  <Box>
                    <Alert borderRadius={5} status="warning" textStyle="body-sm">
                      {description || TRANSACTION_MESSAGES.SLIPPAGE_WARNING}
                    </Alert>
                  </Box>
                </Box>
              )}
              <Checkbox
                onChange={() =>
                  updateTransactionSettings((currentSettings) => ({
                    ...currentSettings,
                    showConfirmationPopUp: !currentSettings.showConfirmationPopUp,
                  }))
                }
                defaultChecked={showConfirmationPopUp}
                my={2}
                size="sm"
                textAlign="initial"
                variant="accent"
              >
                <Text textStyle="body-sm">Show confirmation popup before placing the trade</Text>
              </Checkbox>
              <Flex mt={3}>
                {!isConnected && (
                  // <Button onClick={onConnectWallet} variant="accent" w="100%">
                  //   Connect Wallet <Icon as={MdArrowOutward} boxSize={5} ml={5} />
                  // </Button>
                  <ConnectWalletButton variant="accent" showRightIcon />
                )}
                {isConnected && (
                  <Button
                    isDisabled={!buttonEnabled}
                    isLoading={isPending}
                    onClick={onSwapHandler}
                    variant="accent"
                    w="100%"
                  >
                    {buttonLabel}
                  </Button>
                )}
              </Flex>
            </Flex>
          </CardBody>
        </>
      )}
      {bondingCurveCompleted && <CurveCompleted />}
    </Card>
  );
};
