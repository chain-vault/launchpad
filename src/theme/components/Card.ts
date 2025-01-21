import { cardAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  container: {
    // dark theme
    _dark: {
      bg: 'base.800',
      borderColor: 'base.700',
      borderRadius: '40px',
      borderWidth: '2px',
    },
    bg: 'base.100',
    borderColor: 'base.200',
    borderRadius: '40px',
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
