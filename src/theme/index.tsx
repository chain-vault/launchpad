/* eslint-disable perfectionist/sort-objects */
import type { StyleFunctionProps } from '@chakra-ui/styled-system';

import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

import {
  ApeToast,
  ApeToggle,
  Button,
  Card,
  Checkbox,
  Container,
  DatePicker,
  FormLabel,
  Input,
  Modal,
  QuilEditor,
  Skeleton,
  Slider,
  Switch,
  Table,
  Tabs,
  Textarea,
  Tooltip,
} from './components';
import { colors, fontSizes, semanticColors, textStyles } from './foundations';

const breakpoints = {
  base: '0em', // 0px
  sm: '30em', // ~480px.
  md: '48em', // ~768px
  lg: '62em', // ~992px
  xl: '92em', // ~1472px
};
const colorModeManager = {
  get: () => localStorage.getItem('chakra-ui-color-mode') || 'dark',
  set: (value: string) => {
    localStorage.setItem('chakra-ui-color-mode', value);
  },
  ssr: false,
  type: 'localStorage',
};

const styles = {
  global: (props: StyleFunctionProps) => ({
    header: {
      color: mode(colors.base[800], colors.base[100])(props),
    },
    body: {
      color: mode(colors.base[800], colors.base[100])(props),
      bg: mode(colors.base[150], colors.base[800])(props),
    },
    '.toastWrapper': {
      padding: 1,
      border: 'solid 2px',
      borderColor: 'surface.base.600',
      borderRadius: '18px',
    },
  }),
};

export const theme = extendTheme({
  semanticTokens: {
    colors: semanticColors,
  },
  components: {
    // FormErrorMessage,
    Skeleton,
    FormLabel,
    Button,
    Slider,
    Input,
    Tabs,
    Card,
    Modal,
    DatePicker,
    QuilEditor,
    Container,
    Tooltip,
    Table,
    Switch,
    Textarea,
    Checkbox,
    ApeToast,
    ApeToggle,
    SkeletonCircle: {
      baseStyle: {
        borderRadius: 'full',
      },
    },
  },
  textStyles,
  fonts: {
    heading: 'Gilroy',
    body: 'Nunito',
  },
  config: {
    useSystemColorMode: false,
    initialColorMode: colorModeManager.get(),
  },
  breakpoints,
  colors,
  styles,
  fontSizes,
});

export default theme;

type Theme = typeof theme;

export type { Theme };
