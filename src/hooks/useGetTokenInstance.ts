import { useMemo } from 'react';

import { TokenData } from '@app-types/poolAndToken';

import { DEFAULT_TOKEN_DECIMAL, NATIVE_TOKEN, NATIVE_TOKEN_ADDRESS } from '@constants/config';
import { getTokenInstance, Token } from '@utils/token';

import { useTokenMetadata } from './useToken';

/**
 * Custom hook to create a Token instance from token address.
 * @param tokenDetails - The object containing details of the token.
 * @returns A Token instance or null if tokenDetails is undefined.
 */
export const useTokenInstance = (
  tokenAddress?: string,
  isNative?: boolean,
  isLegacyTokenProgram?: boolean
): null | Token => {
  const { poolTokenMetadata } = useTokenMetadata(tokenAddress, isLegacyTokenProgram);

  return useMemo(() => {
    if (isNative || tokenAddress === NATIVE_TOKEN_ADDRESS) return NATIVE_TOKEN;
    const token =
      poolTokenMetadata ?
        getTokenInstance(
          poolTokenMetadata.name,
          poolTokenMetadata.symbol,
          DEFAULT_TOKEN_DECIMAL,
          poolTokenMetadata.mint,
          poolTokenMetadata.logoUrl,
          false,
          false,
          isLegacyTokenProgram
        )
      : null;

    return token;
  }, [isLegacyTokenProgram, isNative, poolTokenMetadata, tokenAddress]);
};

/**
 * Custom hook to create a Token instance from token details.
 * @param tokenDetails - The object containing details of the token.
 * @returns A Token instance or null if tokenDetails is undefined.
 * @deprecated
 */
const useTokenInstanceDepr = (tokenDetails: { isNative: true } | null | TokenData): null | Token =>
  useMemo(() => {
    if (!tokenDetails) {
      return null;
    }

    if (tokenDetails.isNative) return NATIVE_TOKEN;

    const { address, decimal, isCollateral, isNative, logoUrl, name, symbol } = tokenDetails;

    return getTokenInstance(name, symbol, decimal, address, logoUrl, isNative, isCollateral);
  }, [tokenDetails]);

export default useTokenInstanceDepr;
