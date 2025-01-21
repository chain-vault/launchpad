import { Box } from '@chakra-ui/react';
import { Meta, StoryObj } from '@storybook/react';

import TokenAvatar from './index'; // Adjust the import according to your file structure

const meta: Meta<typeof TokenAvatar> = {
  argTypes: {
    src: { control: 'text', description: 'Image URL' },
  },
  component: TokenAvatar,
  title: 'Atoms/TokenAvatar',
};

export default meta;

type Story = StoryObj<typeof TokenAvatar>;

export const Default: Story = {
  args: {
    src: 'https://picsum.photos/200/300',
  },
  render: function Component(args) {
    return (
      <Box width="350px">
        <TokenAvatar {...args} />
      </Box>
    );
  },
};
