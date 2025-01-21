import type { Idl, IdlEvents } from '@coral-xyz/anchor';

import { useQueryClient } from '@tanstack/react-query';
import bs58 from 'bs58';
import { useAtom } from 'jotai';
import { v4 as uuid } from 'uuid';

import { AllPoolAccounts, PoolAccountData } from '@app-types/lbp';

import {
  DEFAULT_TOKEN_DECIMAL,
  LBPEnv,
  NATIVE_TOKEN_ADDRESS,
  NATIVE_TOKEN_DECIMAL,
} from '@constants/config';
import { useGetProgramInstance } from '@hooks/useGetProgramInstance';
import { useEventListener } from '@hooks/useProgramEventListener';
import { ApeonLbp, LBPIdl } from '@idl/lbp';
import { convertBNToDecimal } from '@utils/decimalHelper';
import { formatDate } from '@utils/formatDate';
import { Token } from '@utils/token';

import { addEventsAtom } from '../atom';

const lbpEnv = bs58.encode(Uint8Array.from([LBPEnv]));

export const useTransaction = (poolId?: string, userId?: string) => {
  const queryClient = useQueryClient();

  const lbpProgram = useGetProgramInstance<ApeonLbp>(LBPIdl as Idl, false);
  const [, updateEvents] = useAtom(addEventsAtom);

  const handleEventCallback = (
    event: IdlEvents<ApeonLbp>['poolBuyEvent' | 'poolSellEvent'],
    eventTime: number,
    eventName: 'poolBuyEvent' | 'poolSellEvent',
    signature: string
  ) => {
    const {
      id,
      amountIn,
      amountOut,
      solBal: solBalance,
      token,
      tokenBal: tokenBalance,
      trader,
    } =
      eventName === 'poolBuyEvent' ?
        convertBNToDecimal(event as IdlEvents<ApeonLbp>['poolBuyEvent'])
      : convertBNToDecimal(event as IdlEvents<ApeonLbp>['poolSellEvent']);

    if (id.toString() === poolId) {
      const [tokenInAddress, tokenOutAddress, tokenInDecimal, tokenOutDecimal] =
        eventName === 'poolBuyEvent' ?
          [NATIVE_TOKEN_ADDRESS, token.toString(), NATIVE_TOKEN_DECIMAL, DEFAULT_TOKEN_DECIMAL]
        : [token.toString(), NATIVE_TOKEN_ADDRESS, DEFAULT_TOKEN_DECIMAL, NATIVE_TOKEN_DECIMAL];

      updateEvents({
        id: uuid(), // assign uuid till we define id for transactions
        amountIn: Token.fromRawAmount(amountIn.toString(), tokenInDecimal).toString(),
        amountOut: Token.fromRawAmount(amountOut.toString(), tokenOutDecimal).toString(),
        collateralTokenBalance: solBalance.toString(),
        date: eventTime,
        eventName,
        formatedDate: formatDate(eventTime),
        projectTokenBalance: tokenBalance.toString(),
        signature,
        tokenInAddress,
        tokenOutAddress,
        trader: trader.toString(),
      });

      // update the pools query
      queryClient.setQueryData<PoolAccountData | undefined>(
        ['lbpPool', poolId],
        (prevData) =>
          prevData && {
            ...prevData,
            solBalance,
            tokenBalance,
          }
      );
    }

    queryClient.setQueryData<AllPoolAccounts | undefined>(['lbp-pools', lbpEnv], (prevData) =>
      prevData?.length ?
        prevData.map((eachPool) => {
          if (eachPool.publicKey.toString() === id.toString()) {
            return {
              ...eachPool,
              account: {
                ...eachPool.account,
                solBalance,
                tokenBalance,
              },
            };
          }
          return eachPool;
        })
      : undefined
    );
    queryClient.setQueryData<AllPoolAccounts | undefined>(
      ['userLBPPools', userId, lbpEnv],
      (prevData) =>
        prevData?.length ?
          prevData.map((eachPool) => {
            if (eachPool.publicKey.toString() === id.toString()) {
              return {
                ...eachPool,
                account: {
                  ...eachPool.account,
                  solBalance,
                  tokenBalance,
                },
              };
            }
            return eachPool;
          })
        : undefined
    );
  };

  useEventListener(lbpProgram, 'poolBuyEvent', handleEventCallback);
  useEventListener(lbpProgram, 'poolSellEvent', handleEventCallback);
};
