import { Metaplex } from '@metaplex-foundation/js';
import { getTokenMetadata } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { skipToken, useQueries, useQuery } from '@tanstack/react-query';

import { PoolAndTokenMetaData, PoolAndTokenMetadataReturnData } from '@app-types/poolAndToken';

import { NATIVE_TOKEN_ADDRESS } from '@constants/config';
import { getConnection } from '@hooks/useWeb3React';
import BaseDecimal, { ONE } from '@utils/decimalHelper';

import { SolLogo } from '@assets/icons';

async function getLegacyTokenMetadata(token: PublicKey) {
  const connection = getConnection();

  const metaplex = Metaplex.make(connection);

  const metadataAccount = metaplex.nfts().pdas().metadata({ mint: token });

  const metadataAccountInfo = await connection.getAccountInfo(metadataAccount);

  if (metadataAccountInfo) {
    const metadata = await metaplex.nfts().findByMint({ mintAddress: token });
    return { ...metadata, mint: metadata.mint.address };
  }
}

const fetchTokenMetadata = async (
  token: PublicKey,
  isLegacyTokenProgram?: boolean
): Promise<null | PoolAndTokenMetadataReturnData> => {
  const connection = getConnection();

  if (token.toString().toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase()) {
    return {
      additionalMetadata: [],
      dcd: '',
      description: '',
      gh: '',
      image: SolLogo,
      mint: token,
      name: 'Solana',
      rmp: '',
      symbol: 'SOL',
      tg: '',
      tld: '',
      totalSupply: '',
      uri: '',
      wb: '',
      wp: '',
      x: '',
    };
  }

  const data = await connection.getTokenSupply(token);
  const supply =
    data?.value.uiAmountString ? BaseDecimal.toDecimal(data.value.uiAmountString) : ONE;

  let metadata;

  if (isLegacyTokenProgram) metadata = await getLegacyTokenMetadata(token);
  else metadata = await getTokenMetadata(connection, token);

  if (metadata?.uri) {
    const parsedJson = await fetch(metadata.uri).then((res) => res.json());
    if (parsedJson) {
      metadata = {
        ...metadata,
        ...parsedJson,
      };
    }
  }
  return (
    metadata &&
    ({ ...metadata, totalSupply: supply.toString() } as null | PoolAndTokenMetadataReturnData)
  );
};

export const useTokenMetadata = (
  tokenId?: string,
  isLegacyTokenProgram: boolean = false,
  skip: boolean = false
) => {
  const { data: tokenMetadata, isLoading } = useQuery({
    gcTime: Infinity,
    queryFn:
      !skip && tokenId ?
        () => fetchTokenMetadata(new PublicKey(tokenId), isLegacyTokenProgram)
      : skipToken,
    queryKey: ['token-metadata', tokenId, isLegacyTokenProgram],
  });

  const metdataFormatted: null | PoolAndTokenMetaData | undefined = tokenMetadata && {
    discord: tokenMetadata.dcd,
    github: tokenMetadata.gh,
    logoUrl: tokenMetadata.image,
    mint: tokenMetadata.mint,
    name: tokenMetadata?.name,
    poolDescription: tokenMetadata.tld,
    roadmap: tokenMetadata.rmp,
    symbol: tokenMetadata?.symbol,
    telegram: tokenMetadata.tg,
    totalSupply: tokenMetadata.totalSupply,
    twitter: tokenMetadata.x,
    website: tokenMetadata.wb,
    whitepaper: tokenMetadata.wp,
  };

  return {
    isMetaDataLoading: isLoading,
    poolTokenMetadata: metdataFormatted ?? null,
  };
};

export const useMultiTokensMetadata = (tokenIds: PublicKey[], isLegacyTokenProgram?: boolean) => {
  const { data, isLoading: isMetaDataLoading } = useQueries({
    combine: (results) => ({
      data: results.map((result) => result.data),
      isError: results.some((result) => result.isError),
      isLoading: results.some((result) => result.isLoading),
      isSuccess: results.every((result) => result.isSuccess),
      pending: results.some((result) => result.isPending),
    }),
    queries: tokenIds.map((token) => ({
      queryFn: () => fetchTokenMetadata(token, isLegacyTokenProgram),
      queryKey: ['token-metadata', token.toString(), isLegacyTokenProgram],
    })),
  });

  const tokensMetadataFormatted: (null | PoolAndTokenMetaData)[] = data.map((tokenMetadata) =>
    tokenMetadata ?
      {
        discord: tokenMetadata.dcd,
        github: tokenMetadata.gh,
        logoUrl: tokenMetadata.image,
        mint: tokenMetadata.mint,
        name: tokenMetadata?.name,
        poolDescription: tokenMetadata.tld,
        roadmap: tokenMetadata.rmp,
        symbol: tokenMetadata?.symbol,
        telegram: tokenMetadata.tg,
        totalSupply: tokenMetadata.totalSupply,
        twitter: tokenMetadata.x,
        website: tokenMetadata.wb,
        whitepaper: tokenMetadata.wp,
      }
    : null
  );

  return {
    isMetaDataLoading,
    poolTokensMetadata: tokensMetadataFormatted,
  };
};
