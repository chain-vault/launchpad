import { useMemo } from 'react';

import { useQuery as useGqlQuery } from '@apollo/client';
import { lockedTokenAtom } from '@atoms/index';
import { GET_LOCKED_TOKEN_HOLDERS } from '@integrations/graphql/queries/tokens';
import { skipToken, useQuery } from '@tanstack/react-query';
import Decimal from 'decimal.js';
import { useAtomValue } from 'jotai';
import { v4 as uuid } from 'uuid';

import { BASE_CONFIG, DEFAULT_TOKEN_DECIMAL } from '@constants/config';
import { DecimalType, ONE } from '@utils/decimalHelper';
import { Token } from '@utils/token';

import { useGetPoolById } from './apein/useGetPool';
import { useGetTokenSupply } from './useGetAllTokensWithMetadata';

/* eslint-disable no-await-in-loop */
type TokenAccount = {
  address: string;
  amount: number;
  isBondingCurve?: boolean;
  isDeveloper?: boolean;
  mint: string;
  owner: string;
  percentage: string;
};

type ApiResponse = {
  result: {
    token_accounts: TokenAccount[];
    total: number;
  };
};

const findHolders = async (
  mintAddress: string,
  poolAuthority: string,
  supply: DecimalType = ONE
) => {
  let page = 1;
  const holdersData: TokenAccount[] = [];
  const url = BASE_CONFIG.rpcUrl;

  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const response = await fetch(url, {
        body: JSON.stringify({
          id: uuid(),
          jsonrpc: '2.0',
          method: 'getTokenAccounts',
          params: {
            displayOptions: {},
            limit: 1000,
            mint: mintAddress,
            page,
          },
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      if (!response.ok) {
        console.error('Network response was not ok', response.statusText);
        break;
      }

      const data: ApiResponse = await response.json();

      if (!data.result || data.result.token_accounts.length === 0) {
        break;
      }

      // eslint-disable-next-line @typescript-eslint/no-loop-func
      data.result.token_accounts.forEach((account) => {
        const percentage = new Decimal(
          new Decimal(Token.fromRawAmount(account.amount, DEFAULT_TOKEN_DECIMAL)).div(supply)
        ).mul(100);
        const isBondingCurve = account.owner === poolAuthority || undefined;
        holdersData.push({ ...account, isBondingCurve, percentage: percentage.toString() });
      });
      if (data.result.total !== 1000) break;
      page += 1;
    }
  } catch (error) {
    console.error('Error fetching token holders:', error);
  }

  return holdersData;
};

const useGetAllTokenHolders = (poolId?: string) => {
  const { data: poolData, isLoading: isPoolDataLoading } = useGetPoolById(poolId);

  const { isLoading: isSupplyLoading, supply } = useGetTokenSupply(poolData?.token);

  const { poolCreator: tokenDeveloper, token } = poolData ?? {};
  const mint = token?.toString();

  const { data: lockedTokens, loading } = useGqlQuery(GET_LOCKED_TOKEN_HOLDERS, {
    context: { apiName: 'apein' },
    fetchPolicy: 'network-only',
    skip: !mint,
    variables: {
      id: mint ?? '',
    },
  });

  const lockedTokensFromEvent = useAtomValue(lockedTokenAtom);

  const lockedTokensForMint = mint ? lockedTokensFromEvent[mint] : undefined;

  const { data, isLoading, refetch } = useQuery({
    gcTime: 0,
    queryFn: mint && poolId ? () => findHolders(mint, poolId, supply) : skipToken,
    queryKey: ['holders', mint, poolId, supply],
    staleTime: 0,
  });

  const tokenHolders = useMemo(() => {
    let totalLockedTokens = new Decimal(0);
    const lockedTokenHoldingAccounts: string[] = [];
    if (!data?.length) return [];
    data.forEach((holder) => {
      // from events
      if (
        lockedTokensForMint?.length &&
        lockedTokensForMint.some((lockedToken) => lockedToken.escrowTokenAccount === holder.address)
      ) {
        lockedTokenHoldingAccounts.push(holder.address);
        totalLockedTokens = totalLockedTokens.add(holder.amount);
        return;
      }

      // from grapql
      if (
        lockedTokens?.lockedTokens?.length &&
        lockedTokens?.lockedTokens?.some(
          (lockedToken) => lockedToken.escrowToken === holder.address
        )
      ) {
        lockedTokenHoldingAccounts.push(holder.address);
        totalLockedTokens = totalLockedTokens.add(holder.amount);
      }
    });

    // if any missed from event
    lockedTokensForMint?.forEach((lockedToken) => {
      if (!lockedTokenHoldingAccounts.find((holder) => holder === lockedToken.escrowTokenAccount)) {
        totalLockedTokens = totalLockedTokens.add(lockedToken.lockedAmount);
        lockedTokenHoldingAccounts.push(lockedToken.escrowTokenAccount);
      }
    });

    // const allHoldersList1 = data ? [...data] : [];

    // // check if token developer a holder
    // const existingHolder1 = data.find((holder) => holder.owner === tokenDeveloper?.toString());

    let existingHolder = false;
    const allHoldersList = data.map((holder) => {
      if (holder.owner === tokenDeveloper?.toString()) {
        existingHolder = true;
        const amount = new Decimal(holder.amount).add(totalLockedTokens).toNumber();
        const percentage = Token.fromRawAmount(amount, DEFAULT_TOKEN_DECIMAL).div(supply).mul(100);
        return {
          ...holder,
          amount,
          isDeveloper: true,
          percentage,
        };
      }
      return holder;
    });

    if (tokenDeveloper && mint && totalLockedTokens.greaterThan(0) && !existingHolder) {
      const percentage = new Decimal(
        new Decimal(Token.fromRawAmount(totalLockedTokens, DEFAULT_TOKEN_DECIMAL)).div(supply)
      ).mul(100);
      const developerHolder = {
        address: tokenDeveloper.toString(),
        amount: totalLockedTokens.toNumber(),
        isDeveloper: true,
        mint,
        owner: tokenDeveloper.toString(),
        percentage: percentage.toString(),
      };
      allHoldersList.push(developerHolder);
    }

    const updatedHoldersList = allHoldersList.filter(
      (holder) => !lockedTokenHoldingAccounts.includes(holder.address)
    );

    return updatedHoldersList
      .sort((a, b) => b.amount - a.amount)
      .map((holder, idx) => ({ ...holder, rank: idx + 1 }));
  }, [data, lockedTokens?.lockedTokens, lockedTokensForMint, mint, supply, tokenDeveloper]);

  return {
    data: tokenHolders,
    isLoading: isLoading || loading || isPoolDataLoading || isSupplyLoading,
    refetch,
  };
};

export default useGetAllTokenHolders;
