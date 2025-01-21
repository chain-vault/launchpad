import { useMemo } from 'react';

import { useQuery } from '@apollo/client';
import { transactionSettings } from '@atoms/index';
import { GET_ALL_TOKENS_METADATA } from '@integrations/graphql/queries/tokens';
import { PublicKey } from '@solana/web3.js';
import { skipToken, useQuery as useTanstackQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

import { PoolAndTokenMetaData } from '@app-types/poolAndToken';

import { DEFAULT_TOKEN_DECIMAL } from '@constants/config';
import { TOKEN_META } from '@constants/pools';
import BaseDecimal, { ONE } from '@utils/decimalHelper';
import { Token } from '@utils/token';

import { getConnection } from './useWeb3React';

export const fetchMultipleTokenSupplies = async (tokenMintAddresses: string[]) => {
  try {
    const connection = getConnection();

    const mintPublicKeys = tokenMintAddresses.map((address) => new PublicKey(address));

    const accountInfos = await connection.getMultipleAccountsInfo(mintPublicKeys);

    const tokenSupplies = accountInfos.map((accountInfo, index) => {
      if (accountInfo) {
        const data = Buffer.from(accountInfo.data);

        const supply = data.readBigUInt64LE(36); // Total supply is stored at offset 36 in mint accounts

        return {
          tokenMint: tokenMintAddresses[index],
          totalSupply: Token.fromRawAmount(supply.toString(), DEFAULT_TOKEN_DECIMAL),
        };
      }

      return { tokenMint: tokenMintAddresses[index], totalSupply: ONE };
    });

    return tokenSupplies;
  } catch (error) {
    console.error('Error fetching token supplies:', error);
  }
};

export const useGetAllTokensSupply = (tokens: string[]) =>
  useTanstackQuery({
    queryFn: tokens.length ? () => fetchMultipleTokenSupplies(tokens) : skipToken,
    queryKey: ['all-tokens-suuply', tokens],
  });

export const useGetTokenSupply = (token?: PublicKey) => {
  const { customRPCUrl, selectedRPC } = useAtomValue(transactionSettings);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const connection = useMemo(() => getConnection(), [selectedRPC, customRPCUrl]);
  const { data, isLoading } = useTanstackQuery({
    gcTime: Infinity,
    queryFn: token ? () => connection.getTokenSupply(token) : skipToken,
    queryKey: ['token-supply', token],
  });

  const supply = useMemo(
    () => (data?.value.uiAmountString ? BaseDecimal.toDecimal(data.value.uiAmountString) : ONE),
    [data?.value.uiAmountString]
  );

  return {
    isLoading,
    supply,
  };
};

const useGetAllTokensWithMetadata = (isFastLaunch?: boolean, poolCreator?: string) => {
  const { data: tokenData, loading } = useQuery(GET_ALL_TOKENS_METADATA, {
    context: { apiName: isFastLaunch ? 'apein' : 'lbp' },
    fetchPolicy: 'cache-first',
    variables: { owner: poolCreator },
  });

  let tokenList: PoolAndTokenMetaData[] | undefined = tokenData?.tokens.map(
    ({
      id,
      decimals,
      discord,
      github,
      logo,
      metadataUrl,
      name,
      poolDescription,
      roadmap,
      symbol,
      telegram,
      totalSupply,
      twitter,
      website,
      whitepaper,
    }) => ({
      decimals,
      discord,
      github,
      logoUrl: logo,
      metadataUrl,
      mint: new PublicKey(id),
      name,
      poolDescription,
      roadmap,
      symbol,
      telegram,
      totalSupply,
      twitter,
      website,
      whitepaper,
    })
  );
  /**
   * Merge legacy token meta
   */
  tokenList = [...(tokenList || []), ...(isFastLaunch ? TOKEN_META : [])];

  return {
    isLoading: loading,
    tokens: tokenList,
  };
};

export default useGetAllTokensWithMetadata;
