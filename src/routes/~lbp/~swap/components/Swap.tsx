import { useMemo, useState } from 'react';

import { SeriesType } from '@adapters/charting_library';
import { transactionSettings } from '@atoms/index';
import {
  Alert,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Icon,
  IconButton,
  Image,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { IoMdRefresh } from 'react-icons/io';
import { LuArrowUpDown } from 'react-icons/lu';

import { LBPPoolStatus } from '@app-types/index';

// import { Graph } from '@components/Graph/Tradingview';
import StatusIndicator from '@components/Status/StatusIndicator';
import { SwapActionButton } from '@components/SwapActionButton';
import { SwapConfirmationModal } from '@components/SwapConfirmation';
import TransactionSettings from '@components/TransactionSettings';
import ToggleControlled from '@components/ui/Button/ToggleButton/ToggleControlled';
import InputGroup from '@components/ui/Input/InputGroup';
import { BasicModal } from '@components/ui/Modals';
import { TRADE_TYPE_OPTIONS } from '@constants/config/transactions';
import { InputCardContext } from '@constants/index';
import { useGetPoolById } from '@hooks/lbp/useGetPool';
import { usePoolCurve } from '@hooks/lbp/usePoolCurve';
import { useCountDown } from '@hooks/useCountdown';
import useMaxBalance from '@hooks/useMaxBalance';
import { useTokenMetadata } from '@hooks/useToken';
import { useConnectWallet } from '@hooks/useWalletConnection';
import { usePoolId } from '@routes/~lbp/~swap/hooks/usePoolId';
import { formatNumber, NumberFormatType } from '@utils/formatNumbers';
import { formatGraphData } from '@utils/groupFeedData';
import { Token } from '@utils/token';

import { BananaPeeled, CoconutTree } from '@assets/imges';

import { useSwap } from '../hooks';
import { useTokenAddress } from '../hooks/useTokenAddress';

const ChartSection = ({ currentPoolStatus }: { currentPoolStatus?: LBPPoolStatus }) => {
  const [poolCurve, , isPoolCurveLoading] = usePoolCurve(currentPoolStatus);

  const graphHeight = useBreakpointValue({ base: 320, md: 435 });
  const { isMetaDataLoading, poolTokenMetadata } = useTokenMetadata(useTokenAddress());
  const formattedData = useMemo(() => formatGraphData(poolCurve, 'value', 'time'), [poolCurve]);
  return (
    <></>
    // <Graph
    //   data={formattedData}
    //   height={graphHeight}
    //   isLoading={isPoolCurveLoading || isMetaDataLoading}
    //   symbol={poolTokenMetadata?.symbol ?? ''}
    //   type={SeriesType.Area}
    // />
  );
};

const SwapHeader = ({
  endAt,
  poolId,
  startAt,
}: {
  endAt: number;
  poolId: string;
  startAt: number;
}) => {
  const poolStatus = useCountDown(startAt, endAt, poolId);

  return (
    <Flex justifyContent="space-between">
      <VStack alignItems="start" gap={1.5}>
        <Text opacity={0.5} textStyle="body-sm">
          {poolStatus?.status === LBPPoolStatus.COMPLETED ?
            'Ended'
          : poolStatus?.status === LBPPoolStatus.COMING_SOON ?
            'Starts In'
          : 'Ends In'}
        </Text>
        <Text
          opacity={
            !poolStatus?.countdown || poolStatus?.status === LBPPoolStatus.COMPLETED ? 0.4 : 1
          }
          textStyle="body-md-semibold"
        >
          {poolStatus?.countdown || '0D 0H 0M 0S'}
        </Text>
      </VStack>
      {poolStatus && <StatusIndicator status={poolStatus.status} />}
    </Flex>
  );
};

const SwapSection = ({ currentPoolStatus }: { currentPoolStatus?: LBPPoolStatus }) => {
  const {
    buttonDisabled,
    canClaimFund,

    description,
    disabledMessage,

    isClaimFundPending,

    isPending,
    isSwapConfirmModalOpen,
    onChangeSwapAmount,
    onClaimFund,
    onCloseSwapConfirmModal,
    onOpenSwapConfirmModal,
    onSwap,

    onSwitchTokens,
    refetchTokenBalance,
    slippage,
    swapAmountIn,
    swapAmountOut,
    swapFee,
    tokenIn,
    tokenInBalance,
    tokenInBalanceLoading,
    tokenOut,
  } = useSwap(currentPoolStatus);
  const [rotation, setRotation] = useState(0);
  const [isClockwise, setIsClockwise] = useState(true);

  const poolId = usePoolId();

  const { isConnected, onConnectWallet } = useConnectWallet();
  const { data: poolData, isLoading: isPoolDataLoading } = useGetPoolById(poolId);

  const { endAt, startAt } = poolData ?? {};

  const maxTokenInBalance = useMaxBalance(tokenInBalance, tokenIn?.isCollateral);
  const [{ showConfirmationPopUp }, updateTransactionSettings] = useAtom(transactionSettings);

  const onSwapClick = () => {
    if (showConfirmationPopUp) {
      onOpenSwapConfirmModal();
    } else {
      onSwap();
    }
  };

  const onClickSwitchTokenIcon = () => {
    setRotation((prevRotation) => prevRotation + (isClockwise ? 180 : -180));
    setIsClockwise((prev) => !prev);
    onSwitchTokens();
  };

  return (
    <>
      <Skeleton isLoaded={!isPoolDataLoading && !!currentPoolStatus}>
        <Card h={447}>
          <CardHeader>
            <Skeleton isLoaded={!isPoolDataLoading && !!poolData?.poolAddress}>
              {poolData?.poolAddress && (
                <SwapHeader
                  endAt={endAt ?? 0}
                  poolId={poolData.poolAddress.toString()}
                  startAt={startAt ?? 0}
                />
              )}
            </Skeleton>
          </CardHeader>
          <CardBody bg="surface.base.600" borderRadius="8px" borderWidth={0}>
            {/* Live pool design */}
            {currentPoolStatus === LBPPoolStatus.LIVE_NOW && (
              <SimpleGrid rowGap={6}>
                <Flex alignItems="center" justifyContent="space-between">
                  <ToggleControlled
                    value={
                      tokenIn?.isCollateral ?
                        TRADE_TYPE_OPTIONS[0].value
                      : TRADE_TYPE_OPTIONS[1].value
                    }
                    onSwitchToggle={onClickSwitchTokenIcon}
                    options={TRADE_TYPE_OPTIONS}
                    variant="trade"
                  />
                  <TransactionSettings toggleButtonVariant="lbp" />
                </Flex>

                <VStack gap={2}>
                  <VStack w="100%">
                    <Flex alignItems="center" justifyContent="space-between" w="100%">
                      <Text textStyle="body-sm-bold">You Pay</Text>

                      <Flex alignItems="center" gap={2} justifyContent="space-between">
                        <IconButton
                          aria-label="refetch-balance"
                          boxSize={6}
                          icon={<Icon as={IoMdRefresh} />}
                          minW="unset"
                          onClick={() => refetchTokenBalance()}
                          p={3}
                          variant="filled"
                        />
                        <SkeletonText isLoaded={!tokenInBalanceLoading && !!tokenIn} noOfLines={1}>
                          <Text opacity={0.6} textStyle="body-sm">
                            {`Available: ${formatNumber({ input: Token.fromRawAmount(tokenInBalance ?? 0, tokenIn?.decimal), suffix: tokenIn?.symbol, type: NumberFormatType.TokenBalanceFormatter })}`}
                          </Text>
                        </SkeletonText>
                        {maxTokenInBalance && (
                          <Button
                            onClick={() =>
                              onChangeSwapAmount(
                                Token.fromRawAmount(maxTokenInBalance, tokenIn?.decimal).toString(),
                                InputCardContext.TOKENIN
                              )
                            }
                            borderRadius="md"
                            h={4}
                            p="1"
                            size="xs"
                            variant="secondary"
                          >
                            <Text textStyle="body-xs">MAX</Text>
                          </Button>
                        )}
                      </Flex>
                    </Flex>
                    <InputGroup
                      inputRightElement={
                        <InputGroup.TokenInputRightElement
                          tokenLogo={tokenIn?.logoUrl}
                          tokenTicker={tokenIn?.symbol}
                        />
                      }
                      onChange={(e) => onChangeSwapAmount(e.target.value, InputCardContext.TOKENIN)}
                      placeholder="0.00"
                      size="lg"
                      type="number"
                      value={swapAmountIn}
                    />
                  </VStack>

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

                  <VStack w="100%">
                    <Text alignSelf="flex-start" textStyle="body-sm-bold">
                      You Receive
                    </Text>
                    <InputGroup
                      inputRightElement={
                        <InputGroup.TokenInputRightElement
                          tokenLogo={tokenOut?.logoUrl}
                          tokenTicker={tokenOut?.symbol}
                        />
                      }
                      onChange={(e) =>
                        onChangeSwapAmount(e.target.value, InputCardContext.TOKENOUT)
                      }
                      placeholder="0.00"
                      size="lg"
                      type="number"
                      value={swapAmountOut}
                    />
                  </VStack>
                  <Box display="flex" w="100%">
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
                      variant="secondary"
                    >
                      <Text textStyle="body-sm">
                        Show confirmation popup before placing the trade
                      </Text>
                    </Checkbox>
                  </Box>

                  {description && (
                    <Box width="100%">
                      <Alert borderRadius={5} status="warning" textStyle="body-sm">
                        {description}
                      </Alert>
                    </Box>
                  )}
                </VStack>

                <SwapActionButton
                  confirmMessage={
                    showConfirmationPopUp ?
                      `Confirm & ${tokenIn?.isCollateral ? 'buy token' : 'sell token'}`
                    : `${tokenIn?.isCollateral ? 'Buy token' : 'Sell token'}`
                  }
                  disabledMessage={disabledMessage}
                  fastLaunch={false}
                  isDisabled={buttonDisabled}
                  isLoading={isPending}
                  isWalletConected={isConnected}
                  onClickAction={!isConnected ? onConnectWallet : onSwapClick}
                />
              </SimpleGrid>
            )}
            {/* Completed pool swap section */}
            {currentPoolStatus === LBPPoolStatus.COMPLETED && (
              <>
                <Flex
                  alignItems="center"
                  direction="column"
                  gap={3}
                  justifyContent="space-around"
                  mb={14}
                  mt={6}
                >
                  <Image
                    alt="lbp-completed"
                    bg="background.container.secondary"
                    borderRadius="xl"
                    boxSize={12}
                    src={CoconutTree}
                  />
                  <Text textStyle="h3">LBP Ended</Text>
                  {/* <Text opacity={0.5} textStyle="body-md">
                    If the LBP you participated in has vested <br /> tokens, you can view the token
                    stream using <br /> the link below.
                  </Text> */}
                </Flex>
                {canClaimFund && (
                  <SwapActionButton
                    confirmMessage="Claim fund"
                    disabledMessage={disabledMessage}
                    isLoading={isClaimFundPending}
                    isWalletConected={isConnected}
                    onClickAction={!isConnected ? onConnectWallet : onClaimFund}
                  />
                )}
              </>
            )}

            {/* Coming soon pool UI */}
            {currentPoolStatus === LBPPoolStatus.COMING_SOON && (
              <Flex
                alignItems="center"
                direction="column"
                gap={3}
                h="275px"
                justifyContent="center"
              >
                <Image
                  alt="lbp-coming-soon"
                  bg="background.container.secondary"
                  borderRadius="xl"
                  boxSize={12}
                  src={BananaPeeled}
                />
                <Text textStyle="h3">LBP Not Started</Text>
                <Text opacity={0.5} textStyle="body-md">
                  This LBP will be live shortly! Stay tuned for updates
                </Text>
              </Flex>
            )}
          </CardBody>
        </Card>
      </Skeleton>

      {tokenIn && tokenOut && (
        <BasicModal
          footer={
            <SwapActionButton
              confirmMessage={tokenIn?.isCollateral ? 'Confirm & Buy' : 'Confirm & Sell'}
              disabledMessage={disabledMessage ?? ''}
              fastLaunch={false}
              isLoading={isPending}
              isWalletConected={isConnected}
              onClickAction={!isConnected ? onConnectWallet : onSwap}
            />
          }
          modalBody={
            <SwapConfirmationModal
              slippage={slippage}
              swapAmountIn={swapAmountIn}
              swapAmountOut={swapAmountOut}
              swapFee={swapFee}
              tokenIn={tokenIn}
              tokenOut={tokenOut}
            />
          }
          header={<Text textStyle="body-regular-bold">Confirm transaction</Text>}
          isOpen={isSwapConfirmModalOpen}
          modalBodyProps={{ mx: 0, px: 0 }}
          modalContentProps={{ bg: 'surface.base.600' }}
          onClose={onCloseSwapConfirmModal}
          size={{ base: 'xs', md: 'sm' }}
        />
      )}
    </>
  );
};

const Swap = ({ currentPoolStatus }: { currentPoolStatus?: LBPPoolStatus }) => (
  <Grid columnGap={6} mt={4} rowGap={6} templateColumns={{ base: '1fr', lg: '1.8fr 1fr' }}>
    <GridItem mt={{ base: 8, md: 0 }} rowStart={{ base: 2, lg: 1 }}>
      <ChartSection currentPoolStatus={currentPoolStatus} />
    </GridItem>
    <GridItem>
      <SwapSection currentPoolStatus={currentPoolStatus} />
    </GridItem>
  </Grid>
);
export default Swap;
