import { walletConnectModalAtom } from '@atoms/index';
import { Box, Flex, HStack, Icon, IconButton, Image, Text, useClipboard } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { FaCheck } from 'react-icons/fa6';
import { PiCopy } from 'react-icons/pi';
import { RiShutDownLine } from 'react-icons/ri';
import { RxChevronDown } from 'react-icons/rx';

import { WalletInfoButonActions } from '@constants/index';
// import useResponsiveValue from '@hooks/useResponsiveValue';

import useWalletConnection from '@hooks/useWalletConnection';
import { useWeb3React } from '@hooks/useWeb3React';

import { CircleInsideCircle } from '@assets/icons';

interface WalletInfoButtonProps {
  action: WalletInfoButonActions;
  showAddress?: boolean;
}

const WalletInfoButton = ({ action, showAddress = true }: WalletInfoButtonProps) => {
  const { publicKey, wallet } = useWeb3React();
  // const isMobile = useResponsiveValue({ base: true, md: false });
  const { disconnect, isConnected } = useWalletConnection();
  const [, setIsOpen] = useAtom(walletConnectModalAtom);
  const { hasCopied, onCopy } = useClipboard(publicKey ? publicKey.toBase58() : '');

  // const { balance: tokenInBalance, isLoading: tokenInBalanceLoading } = useTokenBalance(
  //   new PublicKey(NATIVE_TOKEN_ADDRESS),
  //   true
  // );

  // const isBalanceZero =
  //   Token.fromRawAmount(tokenInBalance ?? 0, NATIVE_TOKEN?.decimal).toString() === '0';

  const getAddressShortened = () =>
    publicKey && showAddress ?
      `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : '';

  return (
    <Box
      // w={
      //   action === WalletInfoButonActions.DISCONNECT_WALLET ?
      //     { base: '230px', md: '270px' }
      //   : { base: '100px', md: '200px' }
      // }
      bg="surface.base.200"
      border="2px solid"
      borderColor="surface.base.500"
      borderRadius="3xl"
      cursor="default"
      px="2"
      py="1"
    >
      {isConnected ?
        <Flex align="center" justifyContent="space-between" w="100%">
          <HStack w="100%">
            <Box p={1} textAlign="left">
              <Image borderRadius="20px" boxSize={6} src={wallet?.adapter.icon ?? ''} />
            </Box>
            <Flex alignItems="center" gap={1} mr="1.5" textAlign="left" w="100%">
              <Text letterSpacing="0.4px" textStyle="body-sm">
                {getAddressShortened()}{' '}
              </Text>
              {/* <Text display={showAddress ? 'flex' : 'none'} textStyle="body-md-bold">
                |
              </Text> */}
              {/* <Skeleton isLoaded={!connecting}>
                <NumberWithTooltip
                  tooltip={Token.fromRawAmount(
                    tokenInBalance ?? 0,
                    NATIVE_TOKEN?.decimal
                  ).toString()}
                >
                  <Text textStyle="body-sm">
                    {`${formatNumber({ input: Token.fromRawAmount(tokenInBalance ?? 0, NATIVE_TOKEN?.decimal), suffix: NATIVE_TOKEN?.symbol, type: NumberFormatType.TokenBalanceFormatter })}`}
                  </Text>
                </NumberWithTooltip>
              </Skeleton> */}
            </Flex>
          </HStack>
          {action === WalletInfoButonActions.DISCONNECT_WALLET ?
            <HStack alignItems="flex-end" flex="auto" gap={0} justifyContent="flex-end">
              <IconButton
                aria-label="disconnect-wallet"
                icon={<Icon as={hasCopied ? FaCheck : PiCopy} />}
                mr={1}
                onClick={onCopy}
                p={{ base: 0.5, md: 2 }}
                size="xs"
                variant="ghost-invariant"
              />
              <IconButton
                aria-label="disconnect-wallet"
                icon={<Icon as={RiShutDownLine} />}
                mr={1}
                onClick={disconnect}
                p={{ base: 0.5, md: 2 }}
                size="xs"
                variant="ghost-invariant"
              />
            </HStack>
          : <IconButton
              aria-label="disconnect-wallet"
              icon={<Icon as={RxChevronDown} />}
              mr={1}
              onClick={() => setIsOpen(true)}
              p={2}
              size="xs"
              variant="ghost-invariant"
            />
          }
        </Flex>
      : <Flex align="center" w="100%">
          <Box p={1} textAlign="left">
            <CircleInsideCircle />
          </Box>
          <Box flex="1" mr={5} opacity="0.5" textAlign="center" textStyle="body-sm">
            Not connected
          </Box>
        </Flex>
      }
    </Box>
  );
};

export default WalletInfoButton;
