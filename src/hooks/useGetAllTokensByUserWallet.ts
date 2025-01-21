import { AccountLayout, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { skipToken, useQuery } from '@tanstack/react-query';
import Decimal from 'decimal.js';

import { getConnection } from './useWeb3React';

const getTokenAccounts = async (wallet: string, isLegacyTokenProgram?: boolean) => {
  try {
    const assets: Record<string, Decimal> = {};
    const connection = getConnection();
    const tokenAccounts = await connection.getTokenAccountsByOwner(new PublicKey(wallet), {
      programId: isLegacyTokenProgram ? TOKEN_PROGRAM_ID : TOKEN_2022_PROGRAM_ID,
    });

    tokenAccounts.value.forEach((accountInfo) => {
      const { account } = accountInfo;

      const accountData = AccountLayout.decode(account.data);
      if (accountData.amount > 0n)
        assets[accountData.mint.toString()] = new Decimal(accountData.amount.toString());
    });
    return assets;
  } catch (err) {
    return {};
  }
};

const useGetTokenAccoutsByWallet = (user?: string, isLegacyTokenProgram?: boolean) => {
  const { data: tokenAccounts, isLoading } = useQuery({
    queryFn: user ? () => getTokenAccounts(user, isLegacyTokenProgram) : skipToken,
    queryKey: ['assets', user, isLegacyTokenProgram],
  });

  return {
    isLoading,
    tokenAccounts,
  };
};

export default useGetTokenAccoutsByWallet;
