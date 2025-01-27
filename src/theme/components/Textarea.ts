import { defineStyleConfig } from '@chakra-ui/react';

export default defineStyleConfig({
  baseStyle: {
    _active: {
      borderColor: 'red',
      boxShadow: 'none !important',
    },
    _focus: {
      border: 'solid 1px !important',

      boxShadow: 'none !important',
    },
    _focusVisible: {
      borderColor: 'yellow !important',
      boxShadow: 'none !important',
    },
    bg: 'surface.base.700',
    border: 'solid 1px !important',
    borderColor: 'red',
    fontFamily: 'Space Grotesk',
    fontWeight: 600,
    minH: '164px',
  },
});
