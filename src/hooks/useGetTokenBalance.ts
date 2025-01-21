import { AccountLayout } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { skipToken, useQueries, useQuery } from '@tanstack/react-query';
import Decimal from 'decimal.js';

import { NATIVE_TOKEN_ADDRESS } from '@constants/config';

import { getConnection, useWeb3Provider } from './useWeb3React';

/**
 * Function to calculate the token balance of single token in wallet
 * @param wallet Wallet address of the user
 * @param token mint account of the user
 * @returns token balance in Decimal.js format as raw amount
 */
async function fetchTokenBalance(
  wallet: PublicKey,
  token?: PublicKey,
  isNative?: boolean
): Promise<Decimal> {
  try {
    const connection = getConnection();

    if (!token) return new Decimal(0);

    if (isNative) {
      const balance = await connection.getBalance(wallet);
      return new Decimal(balance);
    }

    const walletTokenAccounts = await connection.getTokenAccountsByOwner(wallet, {
      mint: token,
    });

    if (!walletTokenAccounts.value.length) return new Decimal(0);
    const tokenAccountData = walletTokenAccounts.value[0];
    const accountInfo = AccountLayout.decode(tokenAccountData.account.data);
    const balance = accountInfo.amount.toString();
    return new Decimal(balance);
  } catch (err) {
    console.error('Failed to fetch token balance', err);
    return new Decimal(0);
  }
}

/**
 * Fetches the token balance for a given Token instance.
 * @param token - The Token instance or undefined if not available.
 * @returns The token balance in Decimal.js format included with token decimals.
 */
export const useTokenBalance = (token: PublicKey | undefined, isNative?: boolean) => {
  const provider = useWeb3Provider();

  const { data, isError, isLoading, isRefetching, refetch } = useQuery({
    queryFn:
      provider?.publicKey && token ?
        () => fetchTokenBalance(provider.publicKey, token, isNative)
      : skipToken,
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['token-balance', provider?.publicKey?.toString(), token?.toString(), isNative],
  });

  return { balance: data, isError, isLoading: isLoading || isRefetching, refetch };
};

export const useMultiTokenBalance = (token: (PublicKey | undefined)[]) => {
  const provider = useWeb3Provider();

  const { data, isError, isLoading } = useQueries({
    combine: (results) => ({
      data: results.map((result) => result.data),
      isError: results.some((result) => result.isError),
      isLoading: results.some((result) => result.isLoading),
      isSuccess: results.every((result) => result.isSuccess),
      pending: results.some((result) => result.isPending),
    }),
    queries:
      provider ?
        token.map((eachToken) => ({
          queryFn: () =>
            fetchTokenBalance(
              provider.publicKey,
              eachToken,
              eachToken?.toString().toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase()
            ),

          // eslint-disable-next-line @tanstack/query/exhaustive-deps
          queryKey: ['token-balance', eachToken?.toString(), provider?.publicKey.toString()],
        }))
      : [],
  });

  const dataFormatted = data.reduce<{ [key: string]: Decimal }>((acc, eachData, idx) => {
    const tokenKey = token?.[idx]?.toString() ?? 'token';
    acc[tokenKey] = eachData ?? new Decimal(0);
    return acc;
  }, {});

  return { balance: dataFormatted, isError, isLoading };
};
