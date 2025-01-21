import { Flex, Image, Text } from '@chakra-ui/react';

import { SolLogo } from '@assets/icons';

interface TokenInputRightElementProps {
  tokenLogo?: string;
  tokenTicker?: string;
}

const TokenInputRightElement = ({
  tokenLogo = SolLogo,
  tokenTicker = 'SOL',
}: TokenInputRightElementProps) => (
  <Flex
    alignItems="center"
    bg="surface.base.600"
    borderRadius="md"
    gap={1}
    justifyContent="space-between"
    p={1}
  >
    <Image alt="sol logo" borderRadius="full" boxSize={5} objectFit="contain" src={tokenLogo} />
    <Text opacity={0.6} textStyle="body-sm">
      {tokenTicker}
    </Text>
  </Flex>
);

export default TokenInputRightElement;
