import { cardAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  container: {
    // dark theme
    _dark: {
      bg: 'base.800',
      borderColor: 'base.800',
      borderRadius: '8px',
      borderWidth: '2px',
    },
    bg: 'base.100',
    borderColor: 'base.100',
    borderRadius: '8px',
    borderStyle: 'solid',
    borderWidth: '2px',
  },
});

const secondary = definePartsStyle({
  container: {
    _dark: {
      bg: 'container.secondary.dark',
    },
    bg: 'container.secondary.light',
  },
});

const Card = defineMultiStyleConfig({
  baseStyle,
  variants: {
    secondary,
  },
});

export default Card;
