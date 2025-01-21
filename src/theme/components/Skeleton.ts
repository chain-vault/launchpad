import { cssVar, defineStyle, defineStyleConfig } from '@chakra-ui/react';

const $startColor = cssVar('skeleton-start-color');
const $endColor = cssVar('skeleton-end-color');

const baseStyle = defineStyle({
  _dark: {
    [$endColor.variable]: 'rgba(56, 56, 56, 0.5)',
    [$startColor.variable]: '#383838',
    borderRadius: '6px',
  },
  _light: {
    [$endColor.variable]: 'rgba(56, 56, 56, 0.5)',
    [$startColor.variable]: '#E2E2E2',
    borderRadius: '6px',
  },
});

const skeletonTheme = defineStyleConfig({
  baseStyle,
});

export default skeletonTheme;
