import { useCallback, useEffect, useState } from 'react';

import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  SimpleGrid,
  SkeletonText,
} from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';
import { useAtom } from 'jotai';

import { LBPPoolStatus, PoolStatusUpdatedEvent } from '@app-types/index';

import { DEFAULT_TOKEN_DECIMAL } from '@constants/config';
import { useGetPoolById } from '@hooks/lbp/useGetPool';
import { useTokenMetadata } from '@hooks/useToken';
import { EventManager } from '@utils/eventBus';
import { getPoolStatus } from '@utils/poolStatus';
import { PoolWeightedMath } from '@utils/poolWeightedMath';
import { Token } from '@utils/token';

import { updatePriceAtom } from '../atom';
import { useTransaction } from '../hooks';
import { usePoolId } from '../hooks/usePoolId';
import { useTokenAddress } from '../hooks/useTokenAddress';
import Header from './Header';
import PoolDetailsPanel from './PoolDetailsPanel';
import Swap from './Swap';

const Trade = () => {
  const { isMetaDataLoading, poolTokenMetadata } = useTokenMetadata(useTokenAddress());

  const poolId = usePoolId();
  useTransaction(poolId);

  const { data: poolData, isLoading: isPoolDataLoading } = useGetPoolById(poolId);

  const [, setPrice] = useAtom(updatePriceAtom);

  const [currentPoolStatus, setCurrentPoolStatus] = useState<LBPPoolStatus>();

  useEffect(() => {
    const poolStatusEvent = EventManager.getInstance('poolEvents');

    const handlePoolStatusUpdated = (event: CustomEvent<PoolStatusUpdatedEvent>) => {
      setCurrentPoolStatus(event.detail.status);
    };

    poolStatusEvent.addCustomEventListener(poolId, handlePoolStatusUpdated);

    return () => {
      poolStatusEvent.removeCustomEventListener(poolId, handlePoolStatusUpdated);
    };
  }, [poolId]);

  const getPoolPrice = useCallback(() => {
    if (!poolData) return;
    const { status } = getPoolStatus(poolData.startAt, poolData.endAt);

    const startPrice = PoolWeightedMath.spotPrice({
      collateralTokenAmount: Token.fromRawAmount(poolData.startCollaterolAmount),
      collateralTokenWeight: poolData.collateralStartWeight,
      projectTokenAmount: Token.fromRawAmount(poolData.startProjectAmount, DEFAULT_TOKEN_DECIMAL),
      projectTokenWeight: poolData.projectTokenStartWeight,
    });

    if (status === LBPPoolStatus.COMING_SOON) {
      setPrice({ currentPrice: startPrice, startPrice });
      return;
    }

    let collateralTokenWeight;
    let projectTokenWeight;
    if (status === LBPPoolStatus.LIVE_NOW) {
      const weights = PoolWeightedMath.currentWeights(poolData);
      collateralTokenWeight = weights.collateralWeight;
      projectTokenWeight = weights.projectTokenWeight;
    } else {
      collateralTokenWeight = poolData.collateralEndWeight;
      projectTokenWeight = poolData.projectTokenEndWeight;
    }
    const price = PoolWeightedMath.spotPrice({
      collateralTokenAmount: Token.fromRawAmount(poolData.collateralBalance),
      collateralTokenWeight,
      projectTokenAmount: Token.fromRawAmount(poolData.projectTokenBalance, DEFAULT_TOKEN_DECIMAL),
      projectTokenWeight,
    });
    setPrice({ currentPrice: price, startPrice });
  }, [setPrice, poolData]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (poolData && !isPoolDataLoading) {
      const { status } = getPoolStatus(poolData.startAt, poolData.endAt);

      if (status === LBPPoolStatus.LIVE_NOW) {
        intervalId = setInterval(() => {
          getPoolPrice();
        }, 30000);
        getPoolPrice();
      } else if (status === LBPPoolStatus.COMING_SOON) {
        getPoolPrice();
      } else {
        getPoolPrice();
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [setPrice, currentPoolStatus, poolData, isPoolDataLoading, getPoolPrice]);

  return (
    <Box w="100%">
      <Container maxW="container.xl" textAlign="center">
        <SimpleGrid gap={6}>
          {/* Breaccrumb */}
          <Breadcrumb textStyle="body-sm">
            <BreadcrumbItem>
              <BreadcrumbLink
                _hover={{ opacity: 1, textColor: 'brand.secondary.600' }}
                as={Link}
                textDecoration="none"
                to="/launches/lbp/"
              >
                All Pools
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <SkeletonText isLoaded={!isMetaDataLoading} noOfLines={1}>
                <BreadcrumbLink cursor="initial !important" opacity={0.5} textDecoration="none">
                  {poolTokenMetadata?.name}
                </BreadcrumbLink>
              </SkeletonText>
            </BreadcrumbItem>
          </Breadcrumb>
          {/* Header */}
          <Header currentPoolStatus={currentPoolStatus} />
          {/* Trade Section */}
          <Swap currentPoolStatus={currentPoolStatus} />
          {/* Info section */}
          <PoolDetailsPanel />
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Trade;
