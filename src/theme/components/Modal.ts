import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  dialog: {
    _dark: {
      borderColor: 'base.700',
    },
    bg: 'transparent',
    border: '2px solid',
    borderColor: 'base.200',
    borderRadius: '3xl',
  },
  header: {
    bg: 'none',
    borderTopRadius: 'inherit',
  },
  overlay: {
    backdropFilter: 'blur(5px)',
  },
});

const modalTheme = defineMultiStyleConfig({
  baseStyle,
});

export default modalTheme;
