import React from 'react';

import { Box, Button, chakra, Flex, Link, Text, Tooltip } from '@chakra-ui/react';
import { PublicKey } from '@solana/web3.js';
import { MdArrowOutward } from 'react-icons/md';

import { DexType } from '@app-types/index';

import { getMigrationDexPoolLink } from '@constants/config';
import { useGetPoolById } from '@hooks/apein/useGetPool';
import { capitalizeFirstLetter } from '@utils/formatString';

import { useFastLaunchSearchParams } from '../hooks/useFastLaunchSearchParams';

export const CurveCompleted: React.FC = () => {
  const { data: poolData } = useGetPoolById(useFastLaunchSearchParams().pool);
  const isMeteora = poolData?.selectedDex === DexType.METEORA;
  const hasTradeLink = !!(
    // isMeteora &&
    (poolData?.liquidityLP && poolData?.liquidityLP.toString() !== PublicKey.default.toString())
  );

  return (
    <Flex alignItems="center" direction="column" justifyContent="center" minH={350} px={8} py={8}>
      <Box mb={2}>
        <Text fontSize={{ base: 18, md: 24 }} textStyle="h2">
          Bonding Curve Completed
        </Text>
      </Box>
      <Box opacity={0.5} textAlign="center">
        <Text>
          {`Now you can trade this Agent in ${capitalizeFirstLetter(poolData?.selectedDex)}. Click the button below`}
        </Text>
      </Box>
      <Box width="100%">
        <Flex mt={3} py={3} width="100%">
          <Tooltip isDisabled={hasTradeLink} label="Not available now" placement="top">
            <Button
              _hover={{
                textDecoration: 'none',
              }}
              href={
                hasTradeLink ?
                  getMigrationDexPoolLink(
                    isMeteora ? poolData.liquidityLP.toString() : poolData.token.toString(),
                    isMeteora ? DexType.METEORA : DexType.RAYDIUM
                  )
                : undefined
              }
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                if (!hasTradeLink) {
                  e.preventDefault();
                }
              }}
              as={Link}
              data-liquidity={poolData?.liquidityLP}
              disabled={!hasTradeLink}
              fontWeight="bold"
              rightIcon={<MdArrowOutward />}
              target="_blank"
              textDecoration="none"
              w="full"
            >
              Trade on
              <chakra.span ml={1} textTransform="capitalize">
                {poolData?.selectedDex}
              </chakra.span>
            </Button>
          </Tooltip>
        </Flex>
      </Box>
    </Flex>
  );
};
