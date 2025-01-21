import { tabsAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(
  tabsAnatomy.keys
);

const secondary = definePartsStyle(({ colorScheme }) => ({
  root: {
    _dark: {
      color: 'base.200',
    },
    color: 'base.800',
  },
  tab: {
    _selected: {
      borderBottom: '2px solid',
      borderColor: 'brand.secondary.600 !important',
      mb: '-2px',
      opacity: 1,
    },
    fontWeight: 'bold',
    lineHeight: '18px',
    opacity: 0.5,
  },
  tablist: {
    _dark: {
      borderColor: colorScheme === 'brand' ? 'base.800' : 'base.600',
    },
    borderBottom: '2px solid',
    borderColor: colorScheme === 'brand' ? 'base.200' : 'base.300',
  },
}));

const classic = definePartsStyle(({ colorScheme }) => ({
  root: {
    _dark: {
      color: 'base.200',
    },
    color: 'base.800',
  },
  tab: {
    _selected: {
      borderBottom: '3px solid',
      borderColor:
        colorScheme === 'accent' ? 'brand.accent.600 !important' : 'brand.secondary.600 !important',
      mb: '-3px',
      opacity: 1,
    },
    fontWeight: 'bold',
    lineHeight: '18px',
    mr: '20px',
    opacity: 0.5,
    pb: '15px !important',
    pt: '6px !important',
    px: '0 !important',
  },
  tablist: {
    _dark: {
      borderColor: colorScheme === 'brand' ? 'base.800' : 'base.600',
    },
    borderBottom: '3px solid',
    borderColor: colorScheme === 'brand' ? 'base.200' : 'base.300',
  },
  tabpanel: {
    px: 0,
  },
}));

const tabTheme = defineMultiStyleConfig({
  sizes: {
    base: {
      root: {
        fontSize: 'xs',
      },
      tab: {
        fontSize: 'xs',
      },
      tablist: {
        gap: 4,
      },
    },
    md: {
      root: {
        fontSize: 'sm',
      },
      tab: {
        fontSize: 'sm',
      },
    },
  },
  variants: {
    classic,
    secondary,
  },
});

export default tabTheme;
