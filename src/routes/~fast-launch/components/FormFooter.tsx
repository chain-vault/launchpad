import React, { useEffect, useMemo } from 'react';

import { Button, Flex, Spinner } from '@chakra-ui/react';
import Decimal from 'decimal.js';
import isFunction from 'lodash/isFunction';
import { useFormContext, useFormState } from 'react-hook-form';

import { ConnectWalletButton } from '@components/WalletAdapter';
import {
  DEPLOYMENT_BASE_COST,
  LOCK_FEE,
  NATIVE_TOKEN,
  NATIVE_TOKEN_DECIMAL,
} from '@constants/config';
import { isApeInPoolCreationEnabled } from '@constants/config/features';
import { useTokenBalance } from '@hooks/useGetTokenBalance';
import useMaxBalance from '@hooks/useMaxBalance';
import { Token } from '@utils/token';

import { useConnectWallet } from '#hooks/useWalletConnection';

export const FormFooter: React.FC<{
  isLoading: boolean;
  onCostChange: (cost: string, message: string) => void;
}> = ({ isLoading, onCostChange }) => {
  const { isConnected } = useConnectWallet();
  const { getValues, reset } = useFormContext();
  const { balance } = useTokenBalance(NATIVE_TOKEN.address, true);
  const maxBalance = useMaxBalance(balance, true, new Decimal(0));
  const formValues = getValues();
  const { isDirty } = useFormState();
  const clearForm = () => {
    reset({}, { keepDefaultValues: true });
    window.scrollTo(0, 0);
  };

  const [isButtonDisabled, buttonLabel, deploymentCost, message] = useMemo((): [
    boolean,
    string,
    string,
    string,
  ] => {
    if (!isApeInPoolCreationEnabled) return [true, 'Pool creation is disabled', '', ''];
    const { initialBuy, lockToken } = formValues;
    let cost = new Decimal(DEPLOYMENT_BASE_COST);
    let msg: string = ``;
    const hasInitialBuy = initialBuy && parseFloat(initialBuy) > 0;

    if (hasInitialBuy) {
      msg += `Total cost is the sum of network fee (~${DEPLOYMENT_BASE_COST}${NATIVE_TOKEN.symbol})`;
      if (lockToken && lockToken.locked) {
        cost = cost.add(new Decimal(Token.fromRawAmount(LOCK_FEE)));
        msg += `${!hasInitialBuy ? ' and ' : ''} Lock fee (~${Token.fromRawAmount(LOCK_FEE)}${NATIVE_TOKEN.symbol})`;
      }
      cost = cost.add(parseFloat(initialBuy));
      msg += ` and Iniitial swap amount (~${initialBuy}${NATIVE_TOKEN.symbol})`;
    } else {
      msg = `Total cost is ~${DEPLOYMENT_BASE_COST}${NATIVE_TOKEN.symbol} (network fee)`;
    }
    const insufficentFund = new Decimal(
      Token.fromRawAmount(maxBalance ?? 0, NATIVE_TOKEN_DECIMAL)
    ).lessThan(cost);
    if (insufficentFund) {
      return [insufficentFund, `Insufficent ${NATIVE_TOKEN.symbol} balance`, cost.toString(), msg];
    }
    return [false, 'Launch', cost.toString(), msg];
  }, [maxBalance, formValues]);

  useEffect(() => {
    if (deploymentCost && isFunction(onCostChange)) {
      onCostChange(deploymentCost, message);
    }
  }, [deploymentCost, onCostChange, message]);
  return (
    <Flex justifyContent="space-between" py={3}>
      <Button
        bgColor="surface.base.750"
        isDisabled={!isDirty}
        onClick={clearForm}
        type="button"
        variant="ghost"
      >
        Cancel
      </Button>
      {!isConnected && (
        // <Button onClick={onConnectWallet} type="button" variant="accent">
        //   Connect Wallet <Icon as={MdArrowOutward} boxSize={5} ml={5} />
        // </Button>
        <ConnectWalletButton variant="accent" w={{ base: '60%', md: '50%' }} showRightIcon />
      )}

      {isConnected && (
        <Button isDisabled={isButtonDisabled} px={4} type="submit" variant="accent">
          {buttonLabel}
          {isLoading && <Spinner boxSize={3} ml={2} />}
        </Button>
      )}
    </Flex>
  );
};
