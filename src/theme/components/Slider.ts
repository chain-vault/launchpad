import { sliderAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(
  sliderAnatomy.keys
);

const baseStyle = definePartsStyle({
  filledTrack: {
    bg: 'brand.secondary.600',
    strokeWidth: '8px',
  },
  thumb: {
    _dark: {
      bg: 'base.900',
    },
    bg: 'base.100',
    border: '3px solid',
    borderColor: 'brand.secondary.600',
    boxSize: 4,
  },
  track: {
    _dark: {
      bg: 'base.800',
    },
    bg: 'base.200',
  },
});

const sliderTheme = defineMultiStyleConfig({
  baseStyle,
});
export default sliderTheme;
