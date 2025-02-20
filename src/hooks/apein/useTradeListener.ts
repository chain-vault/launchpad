import { lockedTokenAtom } from '@atoms/index';
import { Idl, IdlEvents } from '@coral-xyz/anchor';
import { useQueryClient } from '@tanstack/react-query';
import base58 from 'bs58';
import { useAtom } from 'jotai';
import isFunction from 'lodash/isFunction';
import some from 'lodash/some';

import { AllPoolAccounts, PoolAccountData } from '@app-types/apiIn';

import { ApeInCurveMode } from '@constants/config';
import { useGetProgramInstance } from '@hooks/useGetProgramInstance';
import { useEventListener } from '@hooks/useProgramEventListener';
import { FastLauchIdl, FastLauchIdlType } from '@idl/fastlaunch';
import { convertBNToDecimal } from '@utils/decimalHelper';

const isBuyOrSellEvent = (
  _event: ApeInEventType,
  eventName: string
): _event is IdlEvents<FastLauchIdlType>['poolBuyEvent' | 'poolSellEvent'] =>
  eventName === 'poolBuyEvent' || eventName === 'poolSellEvent';

const isLiquidityPoolUpdatedEvent = (
  _event: ApeInEventType,
  eventName: string
): _event is IdlEvents<FastLauchIdlType>['liquidityPoolAddressUpdatedEvent'] =>
  eventName === 'liquidityPoolAddressUpdatedEvent';

const isLockEvent = (
  _event: ApeInEventType,
  eventName: string
): _event is IdlEvents<FastLauchIdlType>['tokenLockEvent'] => eventName === 'tokenLockEvent';

export type ApeInEventType = IdlEvents<FastLauchIdlType>[ // | 'liquidityPoolAddressUpdatedEvent'
  | 'liquidityPoolAddressUpdatedEvent'
  | 'poolBuyEvent'
  | 'poolCreatedEvent'
  | 'poolSellEvent'
  | 'tokenLockEvent'];

export const useApeinEventsHandler = (
  userId?: string,
  callback?: (
    event: ApeInEventType,
    eventTime: number,
    eventName:
      | 'liquidityPoolAddressUpdatedEvent'
      | 'poolBuyEvent'
      | 'poolCreatedEvent'
      | 'poolSellEvent'
      | 'tokenLockEvent',
    signature: string
  ) => void
) => {
  const curveModeBase58 = base58.encode(Uint8Array.from([ApeInCurveMode]));

  const queryClient = useQueryClient();

  const [, setLockedTokens] = useAtom(lockedTokenAtom);
  const updateLockedTokens = (
    mint: string,
    newToken: { escrowTokenAccount: string; lockedAmount: string; owner: string }
  ) => {
    setLockedTokens((prevTokens) => {
      if (prevTokens[mint]) {
        const updatedTokens = prevTokens[mint].filter(
          (token) => token.escrowTokenAccount !== newToken.escrowTokenAccount
        );

        return {
          ...prevTokens,
          [mint]: [...updatedTokens, newToken],
        };
      }

      return {
        ...prevTokens,
        [mint]: [newToken],
      };
    });
  };

  const handleEventCallback = (
    event: ApeInEventType,
    eventTime: number,
    eventName:
      | 'liquidityPoolAddressUpdatedEvent'
      | 'poolBuyEvent'
      | 'poolCreatedEvent'
      | 'poolSellEvent'
      | 'tokenLockEvent',
    signature: string
  ) => {
    if (isFunction(callback)) {
      callback(event, eventTime, eventName, signature);
      return;
    }

    if (isBuyOrSellEvent(event, eventName)) {
      const formattedTradeEvent = convertBNToDecimal(event);
      // update the pool fetch by id
      queryClient.setQueryData<PoolAccountData | undefined>(
        ['apeInPool', event.id.toString()],
        (prevData) =>
          prevData && {
            ...prevData,
            coefficient1: formattedTradeEvent.coefficient1,
            coefficient2: formattedTradeEvent.coefficient2,
            curveThresholdProgress: formattedTradeEvent.curveThresholdProgress,
            curveThresholdReached: formattedTradeEvent.curveThresholdReached,
            poolCreatorTokenBalance: formattedTradeEvent.poolCreatorTokenBalance,
            solBalance: formattedTradeEvent.solBal,
            tokenBalance: formattedTradeEvent.tokenBal,
            tokenPrice: formattedTradeEvent.tokenPrice,
          }
      );

      // update all pool fetches
      queryClient.setQueryData<AllPoolAccounts | undefined>(
        ['apein-pools', curveModeBase58],
        (prevData) =>
          prevData?.length ?
            prevData.map((eachPool) => {
              if (eachPool.publicKey.toString() === event.id.toString()) {
                return {
                  ...eachPool,
                  account: {
                    ...eachPool.account,
                    coefficient1: formattedTradeEvent.coefficient1,
                    coefficient2: formattedTradeEvent.coefficient2,
                    curveThresholdProgress: formattedTradeEvent.curveThresholdProgress,
                    curveThresholdReached: formattedTradeEvent.curveThresholdReached,
                    poolCreatorTokenBalance: formattedTradeEvent.poolCreatorTokenBalance,
                    solBalance: formattedTradeEvent.solBal,
                    tokenBalance: formattedTradeEvent.tokenBal,
                    tokenPrice: formattedTradeEvent.tokenPrice,
                  },
                };
              }
              return eachPool;
            })
          : undefined
      );

      // update user pools
      if (userId)
        queryClient.setQueryData<AllPoolAccounts | undefined>(
          ['userApeInPools', userId, curveModeBase58],
          (prevData) =>
            prevData?.length ?
              prevData.map((eachPool) => {
                if (eachPool.publicKey.toString() === formattedTradeEvent.id.toString()) {
                  return {
                    ...eachPool,
                    account: {
                      ...eachPool.account,
                      coefficient1: formattedTradeEvent.coefficient1,
                      coefficient2: formattedTradeEvent.coefficient2,
                      curveThresholdProgress: formattedTradeEvent.curveThresholdProgress,
                      curveThresholdReached: formattedTradeEvent.curveThresholdReached,
                      poolCreatorTokenBalance: formattedTradeEvent.poolCreatorTokenBalance,
                      solBalance: formattedTradeEvent.solBal,
                      tokenBalance: formattedTradeEvent.tokenBal,
                      tokenPrice: formattedTradeEvent.tokenPrice,
                    },
                  };
                }
                return eachPool;
              })
            : undefined
        );
    } else if (isLockEvent(event, eventName)) {
      updateLockedTokens(event.token.toString(), {
        escrowTokenAccount: event.escrowToken.toString(),
        lockedAmount: event.lockedToken.toString(),
        owner: event.escrow.toString(),
      });
    } else if (isLiquidityPoolUpdatedEvent(event, eventName)) {
      const formattedTradeEvent = convertBNToDecimal(event);

      queryClient.setQueryData<PoolAccountData | undefined>(
        ['apeInPool', event.id.toString()],
        (prevData) =>
          prevData && {
            ...prevData,
            liquidityPool: formattedTradeEvent.liquidityPoolAddress,
          }
      );

      queryClient.invalidateQueries({ queryKey: ['token-supply', event.token] });
      queryClient.invalidateQueries({ queryKey: ['all-tokens-suuply'] });
    } else {
      // pool create event

      // update all pools
      queryClient.setQueryData<AllPoolAccounts | undefined>(
        ['apein-pools', curveModeBase58],
        (prevData) => {
          const { id, ...account } = event;

          const accountFormatted = convertBNToDecimal(account);
          const newPoolData: AllPoolAccounts[0] = {
            account: accountFormatted,
            publicKey: id,
          };

          // Check if the entry with the same ID (converted to string) already exists
          if (!some(prevData, (pool) => pool.publicKey.toString() === id.toString())) {
            return prevData?.length ? [newPoolData, ...prevData] : [newPoolData];
          }

          // If there's already an entry with the same `id`, return prevData unchanged
          return prevData;
        }
      );

      // update user pools
      if (event.poolCreator.toString() === userId)
        queryClient.setQueryData<AllPoolAccounts | undefined>(
          ['userApeInPools', userId, curveModeBase58],
          (prevData) => {
            const { id, ...account } = event;

            const newPoolData: AllPoolAccounts[0] = {
              account: convertBNToDecimal(account),
              publicKey: id,
            };

            // Check if the entry with the same ID (converted to string) already exists
            if (!some(prevData, (pool) => pool.publicKey.toString() === id.toString())) {
              return prevData?.length ? [newPoolData, ...prevData] : [newPoolData];
            }

            // If there's already an entry with the same `id`, return prevData unchanged
            return prevData;
          }
        );
    }
  };

  const apeInProgram = useGetProgramInstance<FastLauchIdlType>(FastLauchIdl as Idl, false);
  useEventListener(apeInProgram, 'poolBuyEvent', handleEventCallback);
  useEventListener(apeInProgram, 'poolSellEvent', handleEventCallback);
  useEventListener(apeInProgram, 'poolCreatedEvent', handleEventCallback);
  useEventListener(apeInProgram, 'tokenLockEvent', handleEventCallback);
  useEventListener(apeInProgram, 'liquidityPoolAddressUpdatedEvent', handleEventCallback);
};
