import { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Icon,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import { FaQuestionCircle } from 'react-icons/fa';
import { RxMoon, RxSun } from 'react-icons/rx';

import { Slippage, ToggleButtonOption } from '@app-types/index';

import { ToggleButtonControlled } from '@components/ui/Button';
import InputGroup from '@components/ui/Input/InputGroup';
import { TabRadioButton } from '@components/ui/RadioButton';
import { TooltipWithIcon } from '@components/ui/Tooltip';
import {
  PriorityFeesOptions,
  RPCOptions,
  RPCToggleOptions,
  SLIPPAGE_CONSTANTS,
  SLIPPAGE_TYPE_OPTIONS,
} from '@constants/config/transactions';
import { ToastType } from '@constants/index';
import { HTTPS_URL_PATTERN } from '@constants/stringPattern';
import { useProgressiveToast } from '@hooks/useProgressiveToast';
import useTransactionSettings from '@hooks/useTransactionSettings';
import { checkRpcHealth } from '@utils/transaction';

enum SlippageError {
  SLIPPAGE_EXCEEDED,
  SLIPPAGE_LOW,
}

const ThemeOptions: ToggleButtonOption[] = [
  { id: 'light', label: <Icon as={RxSun} boxSize={4} />, value: 'light' },
  { id: 'dark', label: <Icon as={RxMoon} boxSize={4} />, value: 'dark' },
];

const SettingsBody = ({
  colorScheme = 'primary',
  isBaseSettings,
  toggleButtonVariant = '',
}: {
  colorScheme?: 'accent' | 'primary';
  isBaseSettings?: boolean;
  toggleButtonVariant?: string;
}) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { showToast } = useProgressiveToast();

  const {
    customRPCUrl,
    onUpdateSlippage,
    priorityFees,
    selectedRPC,
    slippage,
    updateTransactionSettings,
  } = useTransactionSettings();

  const isCustomRPCSelected = selectedRPC !== RPCOptions.HELIUS;
  const [isCustomSlippage, setIsCustomSlippage] = useState<boolean>(false);
  const [localRPCUrl, setlocalRPCUrl] = useState<string>(customRPCUrl);
  const [isInvalidRPC, setIsInvalidRPC] = useState<boolean>(false);
  const [isRPCUpdating, setIsRPCUpdating] = useState<boolean>(false);

  const [localSlippage, setLocalSlippage] = useState<number | string>(slippage);
  const [, setSlippageError] = useState<null | SlippageError>(null);

  useEffect(() => {
    if (selectedRPC === RPCOptions.CUSTOM && !customRPCUrl) {
      setlocalRPCUrl('');
      setIsInvalidRPC(false);
    }
    if (!slippage) {
      setLocalSlippage(Slippage.AUTO);
      setIsCustomSlippage(false);
    } else {
      setLocalSlippage(slippage);
      setIsCustomSlippage(slippage !== Slippage.AUTO);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsCustomSlippage(slippage !== Slippage.AUTO);
  }, [slippage]);

  const onSelectSlippageValue = (value: string) => {
    setLocalSlippage(value);
    onUpdateSlippage(value);
  };

  const onSwitchSlippage = () => {
    if (!isCustomSlippage) {
      onUpdateSlippage(SLIPPAGE_CONSTANTS[0].value);
      setLocalSlippage(SLIPPAGE_CONSTANTS[0].value);
    } else {
      onUpdateSlippage(Slippage.AUTO);
      setLocalSlippage(Slippage.AUTO);
    }
    setIsCustomSlippage((isCustom) => !isCustom);
  };

  const onChangeLocalSlippage = (value: string) => {
    setLocalSlippage(value);

    // shouldn't let slippage more than 100
    if (parseFloat(value) > 100) {
      onUpdateSlippage(Slippage.MAX);
      setSlippageError(SlippageError.SLIPPAGE_EXCEEDED);
      return;
    }
    if (parseFloat(value) < 0) {
      setSlippageError(SlippageError.SLIPPAGE_LOW);
      return;
    }
    if (!value) {
      onUpdateSlippage(Slippage.AUTO);
      setSlippageError(null);
      return;
    }
    onUpdateSlippage(value);
    setSlippageError(null);
  };

  const handleSlippageChange = (value: string) => {
    // validate slippage
    let sanitizedValue = value.replace(/[^0-9.]/g, '');

    const decimalIndex = sanitizedValue.indexOf('.');
    if (decimalIndex !== -1 && sanitizedValue.length - decimalIndex > 3) {
      sanitizedValue = sanitizedValue.slice(0, decimalIndex + 3);
    }

    const numericValue = parseFloat(sanitizedValue);

    if (Number.isNaN(numericValue)) {
      onChangeLocalSlippage('');
      return;
    }

    if (numericValue > 100) {
      return;
    }

    onChangeLocalSlippage(sanitizedValue);
  };

  const onSaveRPCUrl = async () => {
    const isValidUrl = HTTPS_URL_PATTERN.test(localRPCUrl);
    setIsRPCUpdating(true);
    if (isValidUrl) {
      showToast({
        title: 'Updating RPC',
        type: ToastType.LOADING,
      });
      const isHealthyRPC = await checkRpcHealth(localRPCUrl);
      if (isHealthyRPC) {
        updateTransactionSettings(['customRPCUrl', localRPCUrl]);
        setIsInvalidRPC(false);
        showToast({
          message: `RPC is currently set to Helius ${localRPCUrl}`,
          title: 'RPC updated successfully',
          type: ToastType.SUCCESS,
        });
        setIsRPCUpdating(false);
        return;
      }
      showToast({
        message: 'Invalid RPC node',
        title: 'Failed to update RPC node',
        type: ToastType.FAILED,
      });
    }
    setIsInvalidRPC(true);
    updateTransactionSettings(['customRPCUrl', '']);
    setIsRPCUpdating(false);
  };

  const onSwitchRPCToggle = () => {
    if (isCustomRPCSelected) {
      setIsInvalidRPC(false);
      setlocalRPCUrl('');
      updateTransactionSettings(['selectedRPC', RPCOptions.HELIUS]);
      showToast({
        message: 'RPC is currently set to Helius',
        title: 'RPC updated successfully',
        type: ToastType.SUCCESS,
      });
    } else {
      updateTransactionSettings(['selectedRPC', RPCOptions.CUSTOM]);
      setlocalRPCUrl(customRPCUrl);
      if (customRPCUrl)
        showToast({
          message: `RPC is currently set to Helius ${customRPCUrl}`,
          title: 'RPC updated successfully',
          type: ToastType.SUCCESS,
        });
    }
  };

  return (
    <Flex flexDirection="column" gap={4} justifyContent="space-between">
      {/* <Flex flexDirection="column" gap={4} justifyContent="space-between"> */}
      <VStack alignItems="flex-start" gap={3}>
        <Flex alignItems="center" justifyContent="space-between" w="100%">
          <HStack>
            <Text textStyle={isBaseSettings ? 'body-md-bold' : 'body-sm-bold'}>Max slippage</Text>
            <TooltipWithIcon
              icon={FaQuestionCircle}
              placement="auto"
              tooltipContent="Slippage tolerance is the maximum price change you are willing to accept."
            />
          </HStack>
          <ToggleButtonControlled
            value={
              !isCustomSlippage ? SLIPPAGE_TYPE_OPTIONS[0].value : SLIPPAGE_TYPE_OPTIONS[1].value
            }
            onSwitchToggle={onSwitchSlippage}
            options={SLIPPAGE_TYPE_OPTIONS}
            variant={toggleButtonVariant}
          />
        </Flex>
        <InputGroup
          colorScheme={colorScheme}
          inputRightElement="%"
          onChange={(e) => handleSlippageChange(e.target.value)}
          placeholder="Enter desired slippage"
          size="sm"
          type="number"
          value={localSlippage === Slippage.MAX ? '100' : localSlippage}
          variant="ghost"
        />
        <TabRadioButton
          name="slippage"
          onChange={onSelectSlippageValue}
          options={SLIPPAGE_CONSTANTS}
          value={String(localSlippage)}
        />
      </VStack>

      {isBaseSettings && (
        <>
          <Divider />
          <HStack justifyContent="space-between">
            <Text textStyle="body-md-bold">Theme</Text>
            <ToggleButtonControlled
              onSwitchToggle={toggleColorMode}
              options={ThemeOptions}
              value={colorMode}
              variant="base"
            />
          </HStack>
          <Divider />
          <VStack alignItems="flex-start" gap={4} justifyContent="center">
            <HStack justifyContent="space-between">
              <Text textStyle="body-md-bold">Priority fees</Text>
              <TooltipWithIcon
                icon={FaQuestionCircle}
                placement="auto"
                tooltipContent="For better landing rate but may spend more fees."
              />
            </HStack>

            <Box h="40px">
              <ToggleButtonControlled
                onSwitchToggle={(value) => updateTransactionSettings(['priorityFees', value])}
                options={PriorityFeesOptions}
                value={priorityFees}
                variant="multiToggle"
              />
            </Box>
          </VStack>
          <Divider />
          <VStack alignItems="flex-start" gap={3}>
            <HStack>
              <Text textStyle="body-md-bold">RPC Connection</Text>
              <TooltipWithIcon
                icon={FaQuestionCircle}
                placement="auto"
                tooltipContent="Select preferred RPC endpoint"
              />
            </HStack>
            <Box h="40px">
              <ToggleButtonControlled
                onSwitchToggle={onSwitchRPCToggle}
                options={RPCToggleOptions}
                value={!isCustomRPCSelected ? RPCToggleOptions[0].value : RPCToggleOptions[1].value}
                variant={toggleButtonVariant}
              />
            </Box>
            <InputGroup
              inputRightElement={
                <Button
                  borderRadius="md"
                  isDisabled={!isCustomRPCSelected}
                  onClick={onSaveRPCUrl}
                  size="xs"
                  variant="accent"
                >
                  Save
                </Button>
              }
              onChange={(e) => {
                setIsInvalidRPC(false);
                setlocalRPCUrl(e.target.value);
              }}
              colorScheme={colorScheme}
              isDisabled={!isCustomRPCSelected || isRPCUpdating}
              isInvalid={isInvalidRPC}
              placeholder="Custom RPC URL"
              size="md"
              value={localRPCUrl}
              variant="ghost"
            />
          </VStack>
        </>
      )}
    </Flex>
  );
};

export default SettingsBody;
