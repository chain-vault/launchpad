import { checkboxAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(
  checkboxAnatomy.keys
);

const accent = definePartsStyle({
  control: {
    _checked: {
      bg: 'brand.accent.500',
      borderColor: 'brand.accent.500',
    },
    _dark: {
      borderColor: 'brand.accent.500',
    },
    borderColor: 'brand.accent.600',
    borderWidth: '1px',
    rounded: 'sm',
  },
});

const secondary = definePartsStyle((props) => ({
  control: {
    _checked: {
      _hover: {
        bg: mode('brand.secondary.900', 'brand.secondary.500')(props),
      },
      bg: mode('brand.secondary.900', 'brand.secondary.500')(props),
      borderColor: mode('brand.secondary.900', 'brand.secondary.500')(props),
    },
    _dark: {
      borderColor: 'brand.secondary.500',
    },
    borderColor: mode('brand.secondary.900', 'brand.secondary.500')(props),
    borderWidth: '1px',
    rounded: 'sm',
  },
}));
export default defineMultiStyleConfig({ variants: { accent, secondary } });
