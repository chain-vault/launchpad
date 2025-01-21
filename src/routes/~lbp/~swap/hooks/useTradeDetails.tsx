import { useMemo } from 'react';

import { useQuery } from '@apollo/client';
import PAIR_DATA_QUERY from '@integrations/graphql/queries/pair';
import { PublicKey } from '@solana/web3.js';
import { useAtomValue } from 'jotai';
import reduce from 'lodash/reduce';

import { LBPPoolStatus, SocialIconsMapList } from '@app-types/index';

import { DEFAULT_TOKEN_DECIMAL } from '@constants/config';
import { useGetPoolById } from '@hooks/lbp/useGetPool';
import { useGetTokenSupply } from '@hooks/useGetAllTokensWithMetadata';
import { useTokenInstance } from '@hooks/useGetTokenInstance';
import { useTokenMetadata } from '@hooks/useToken';
import BaseDecimal, { ZERO } from '@utils/decimalHelper';
import { Token } from '@utils/token';

import { eventsAtom, price } from '../atom';
import { usePoolId } from './usePoolId';
import { useTokenAddress } from './useTokenAddress';

export const useTradeDetails = (currentPoolStatus?: LBPPoolStatus) => {
  const { currentPrice: tokenPrice } = useAtomValue(price);
  const eventDatas = useAtomValue(eventsAtom);

  const tokenId = useTokenAddress();
  const { data: poolData, isLoading: isPoolDataLoading } = useGetPoolById(usePoolId());
  const { isLoading: isSupplyLoading, supply } = useGetTokenSupply(
    tokenId ? new PublicKey(tokenId) : undefined
  );

  const { isMetaDataLoading, poolTokenMetadata } = useTokenMetadata(tokenId);

  const { data: pairData } = useQuery(PAIR_DATA_QUERY, {
    skip: !poolData,
    variables: {
      pairId: poolData?.poolAddress.toString() ?? '',
    },
  });

  const tokenIn = useTokenInstance(poolTokenMetadata?.mint?.toString());

  const {
    discord = '',
    github = '',
    telegram = '',
    twitter = '',
    website = '',
  } = poolTokenMetadata ?? {};

  const socialLink: SocialIconsMapList = [
    { id: 'twitter', url: twitter },
    { id: 'discord', url: discord },
    { id: 'telegram', url: telegram },
    { id: 'website', url: website },
    { id: 'github', url: github },
  ];
  const [fundsRaised, tokensReleased, tokensAvailable] = useMemo(() => {
    if (!poolData || currentPoolStatus === LBPPoolStatus.COMING_SOON) return [];

    const tokensReleasedValue = poolData.startProjectAmount.sub(poolData.projectTokenBalance);

    return [
      Token.fromRawAmount(poolData.fundRaised).valueOf(),
      tokensReleasedValue.lessThan(ZERO) ? '0' : (
        Token.fromRawAmount(tokensReleasedValue, DEFAULT_TOKEN_DECIMAL).valueOf()
      ),
      Token.fromRawAmount(poolData.projectTokenBalance, DEFAULT_TOKEN_DECIMAL).valueOf(),
    ];
  }, [currentPoolStatus, poolData]);

  const liquidity =
    poolData && currentPoolStatus === LBPPoolStatus.LIVE_NOW ?
      Token.fromRawAmount(poolData.collateralBalance)
        .add(
          Token.fromRawAmount(poolData.projectTokenBalance, DEFAULT_TOKEN_DECIMAL).mul(
            BaseDecimal.toDecimal(tokenPrice || 0)
          )
        )
        .valueOf()
    : undefined;

  const fdvMarketCap =
    supply && currentPoolStatus !== LBPPoolStatus.COMING_SOON ?
      supply.mul(tokenPrice || 0).valueOf()
    : undefined;

  const volume = useMemo(() => {
    let totalVolume = ZERO;
    if (eventDatas.length) {
      totalVolume = reduce(
        eventDatas,
        (recentSwapVolSum, eachEvent) => {
          if (eachEvent.eventName === 'poolBuyEvent')
            return recentSwapVolSum.add(BaseDecimal.toDecimal(eachEvent.amountIn).mul(2));
          return recentSwapVolSum.add(BaseDecimal.toDecimal(eachEvent.amountOut).mul(2));
        },
        BaseDecimal.toDecimal(0)
      );
    }

    return pairData?.pair?.totalVolumeSOL ?
        BaseDecimal.toDecimal(pairData.pair.totalVolumeSOL).add(totalVolume).toString()
      : totalVolume.toString();
  }, [eventDatas, pairData?.pair?.totalVolumeSOL]);

  return {
    fdvMarketCap,
    fundsRaised,
    isMetaDataLoading: isSupplyLoading || isMetaDataLoading,
    isPoolDataLoading,
    liquidity,
    pairData,
    socialLink,
    token: tokenIn,
    tokenPrice,
    tokensAvailable,
    tokensReleased,
    tradeVolume: volume,
  };
};
