import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import { Meta, StoryObj } from '@storybook/react';

import useResponsiveValue from '@hooks/useResponsiveValue';

import { textStyles } from './textstyles';

// Meta configuration for the story
const meta: Meta = {
  decorators: [
    (Story) => (
      <Box p={4}>
        <Story />
      </Box>
    ),
  ],
  title: 'Tokens/TextStyles',
};

export default meta;
type Story = StoryObj;

// Story to list all text styles
export const Default: Story = {
  render: function Render() {
    const isSmallDevice = useResponsiveValue({ base: true, md: false });
    return (
      <Flex flexDirection="column" gap={6} justifyContent="flex-start">
        <Text textStyle="h2">Text Styles</Text>
        <Text opacity={0.5} textStyle="body-sm">
          {isSmallDevice ? 'Mobile resolution' : 'Desktop and tablet resolutions'}
        </Text>
        <Flex alignItems="flex-start" flexDirection="column" gap={8}>
          {Object.entries(textStyles).map(([key, style]) => (
            <VStack alignItems="start" key={key}>
              <Text mb={2} textStyle={key}>{`This is ${key} text`}</Text>
              <Text
                opacity={0.5}
                textStyle="body-xs"
              >{`Gilroy / ${style.fontWeight} / ${isSmallDevice ? style.fontSize.base : style.fontSize.md} / ${
                typeof style.lineHeight === 'string' ? style.lineHeight
                : isSmallDevice ? style.lineHeight?.base
                : style.lineHeight?.md
              }`}</Text>
            </VStack>
          ))}
        </Flex>
      </Flex>
    );
  },
};
