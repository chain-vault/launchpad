import { switchAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(
  switchAnatomy.keys
);

const boxy = definePartsStyle({
  thumb: {
    bg: 'surface.base.100',
  },
  track: {
    _checked: {
      bg: 'brand.accent.500',
    },
    bg: 'surface.base.400',
  },
});

export default defineMultiStyleConfig({ variants: { boxy } });
