import React from 'react';

import { Box, Skeleton, Text } from '@chakra-ui/react';

import { TokenAvatar } from '@components/TokenAvatar';
import NumberWithTooltip from '@components/ui/Tooltip/NumberWithTooltip';
import { NATIVE_TOKEN, NATIVE_TOKEN_ADDRESS } from '@constants/config';
import useResponsiveValue from '@hooks/useResponsiveValue';
import { useTokenMetadata } from '@hooks/useToken';

type TokenCardProps = {
  isFastLaunch?: boolean;
  isInverted?: boolean; // to indicate that Symbol comes top of name
  token: { logoUrl: string; name: string; symbol: string } | string;
};
export const TokenCard: React.FC<TokenCardProps> = ({
  isFastLaunch = false,
  isInverted = false,
  token,
}) => {
  const { isMetaDataLoading, poolTokenMetadata } = useTokenMetadata(
    typeof token === 'string' ? token : '',
    isFastLaunch,
    token === NATIVE_TOKEN_ADDRESS || typeof token !== 'string'
  );

  const { logoUrl, name, symbol } =
    token === NATIVE_TOKEN_ADDRESS ? NATIVE_TOKEN
    : typeof token === 'string' ? poolTokenMetadata || {}
    : token;
  const isMobile = useResponsiveValue({ base: true, md: false });

  return (
    <Box alignItems="center" display="flex" flexDirection="row" position="relative">
      <Box display="flex" flex="auto" maxWidth="38px" mt="auto">
        <TokenAvatar alt={name} boxSize="30px" isLoading={isMetaDataLoading} src={logoUrl} />
      </Box>
      <Box minW="50%" px="0px" textAlign="left">
        <Box mb={1}>
          <Skeleton h={5} isLoaded={!isMetaDataLoading}>
            {name && symbol && (
              <NumberWithTooltip
                showtooltip={isInverted ? symbol.length > 18 : name.length > 18}
                textStyle="body-sm"
                tooltip={isInverted ? symbol : name}
              >
                <Text as="span" textStyle="body-sm">
                  {isInverted ?
                    isMobile && symbol && symbol?.length > 9 ?
                      `${symbol?.slice(0, 9)}...`
                    : symbol?.length > 18 ?
                      `${symbol.slice(0, 18)}...`
                    : symbol
                  : isMobile && name && name?.length > 9 ?
                    `${name?.slice(0, 9)}...`
                  : name.length > 18 ?
                    `${name.slice(0, 18)}...`
                  : name}
                </Text>
              </NumberWithTooltip>
            )}
          </Skeleton>
        </Box>
        <Skeleton isLoaded={!isMetaDataLoading}>
          {name && symbol && (
            <NumberWithTooltip
              showtooltip={isInverted ? name.length > 18 : symbol.length > 18}
              tooltip={isInverted ? name : symbol}
            >
              <Box opacity={0.5} textStyle="body-sm">
                {isInverted ?
                  isMobile && name && name?.length > 9 ?
                    `${name?.slice(0, 9)}...`
                  : name && name.length > 18 ?
                    `${name.slice(0, 18)}...`
                  : name
                : isMobile && symbol && symbol?.length > 9 ?
                  `${symbol?.slice(0, 9)}...`
                : symbol && symbol?.length > 18 ?
                  `${symbol.slice(0, 18)}...`
                : symbol}
              </Box>
            </NumberWithTooltip>
          )}
        </Skeleton>
      </Box>
    </Box>
  );
};
