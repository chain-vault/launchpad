import { inputAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(
  inputAnatomy.keys
);

const filled = definePartsStyle({
  field: {
    _active: {
      background: 'base.100',
      borderColor: 'base.800',
    },
    _autofill: {
      transition: 'background-color 50000s ease-in-out 0s',
    },
    _dark: {
      _active: {
        background: 'base.800',
        borderColor: 'base.200',
      },
      _focus: {
        background: 'base.800',
        borderColor: 'base.200',
      },
      background: 'base.800',
    },
    _focus: {
      background: 'base.200',
      borderColor: 'base.800',
    },
    _invalid: {
      _active: {
        borderColor: 'danger.700 !important',
        color: 'danger.700',
      },
      _focus: {
        borderColor: 'danger.700 !important',
        color: 'danger.700',
      },
      borderColor: 'danger.700',
      color: 'danger.700',
    },
    background: 'base.150',
    border: '0.5px solid',
    borderRadius: 'xl',
    textStyle: 'body-md',
    transition: 'background-color 5000s ease-in-out 0s',
  },
});

const ghost = definePartsStyle({
  field: {
    _active: {
      background: 'surface.base.500',
    },
    _focus: {
      background: 'surface.base.500',
      borderColor: 'base.800',
    },
    _invalid: {
      _active: {
        borderColor: 'danger.700 !important',
        color: 'danger.700',
      },
      _focus: {
        borderColor: 'danger.700 !important',
        color: 'danger.700',
      },
      borderColor: 'danger.700',
      color: 'danger.700',
    },
    background: 'surface.base.500',
    border: '0.5px solid',
    borderColor: 'surface.base.500',
    borderRadius: 'xl',
    textStyle: 'body-md',
  },
});

const inputTheme = defineMultiStyleConfig({
  variants: {
    filled,
    ghost,
  },
});
export default inputTheme;
