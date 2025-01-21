import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const baseStyle = defineStyle({
  bg: 'surface.base.200',
  border: '1px solid',
  borderColor: 'surface.base.500',
  borderRadius: 'xl',
  boxShadow: 'surface.shadow',
  color: 'surface.base.900',
  p: 4,
});

const textToolTip = defineStyle({
  bg: 'surface.base.100',
  border: '1px solid',
  borderColor: 'surface.base.500',
  borderRadius: 0,
  boxShadow: 'surface.shadow',
  color: 'surface.base.900',
  opacity: 0.5,
  p: 0.5,
});

const tooltipTheme = defineStyleConfig({
  baseStyle,
  variants: {
    text: textToolTip,
  },
});

export default tooltipTheme;
