import { Flex, IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { RxMoon, RxSun } from 'react-icons/rx';

export const ColorModeToggleBar = () => {
  const { toggleColorMode } = useColorMode();
  const SwitchIcon = useColorModeValue(RxMoon, RxSun);

  return (
    <Flex justify="flex-end" mb={4}>
      <IconButton
        size="md"
        fontSize="lg"
        aria-label="color-mode"
        variant="ghost"
        color="current"
        marginLeft="2"
        onClick={toggleColorMode}
        icon={<SwitchIcon />}
      />
    </Flex>
  );
};
