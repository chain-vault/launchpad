import theme from '../src/theme';
import { ChakraProvider } from '@chakra-ui/react';
import type { Preview } from '@storybook/react';

import { ColorModeToggleBar } from './ColorModeToggler';

const preview: Preview = {
  decorators: [
    (Story) => (
      <ChakraProvider theme={theme}>
        <ColorModeToggleBar />
        <Story />
      </ChakraProvider>
    ),
  ],
  parameters: {
    chakra: {
      theme,
    },
    actions: { argTypesRegex: '^on.*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
