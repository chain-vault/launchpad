import { Box, Text } from '@chakra-ui/react';
import { Meta, StoryObj } from '@storybook/react';

import { fontSizes } from './fontsizes';

const meta: Meta = {
  title: 'Tokens/Font Sizes',
};

export default meta;
type Story = StoryObj;

const FontSizeBox = ({ fontSize, label }: { fontSize: string; label: string }) => (
  <Box mb={4}>
    <Text fontSize={fontSize} textStyle="h2">
      {label}
    </Text>
    ¯
    <Text mt={2} textStyle="body-xs">
      {fontSize}
    </Text>
    <Text mt={2} opacity={0.5} textStyle="body-xs">
      Lorem ipsum dolor sit amet consectetur adipisicing elit.
    </Text>
  </Box>
);

export const Default: Story = {
  render: () => (
    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Font Sizes
      </Text>
      {Object.entries(fontSizes)
        .reverse()
        .map(([key, value]) => (
          <FontSizeBox fontSize={value} key={key} label={key} />
        ))}
    </Box>
  ),
};
