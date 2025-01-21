import { Button, Center, IconButton as ChakraIconButton, Icon } from '@chakra-ui/react';
import { Meta, StoryObj } from '@storybook/react';
import { RxLinkBreak2 } from 'react-icons/rx';

const meta: Meta<typeof Button> = {
  argTypes: {
    isDisabled: {
      control: 'boolean',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'select' },
      options: ['solid', 'outline', 'ghost', 'filled', 'unstyled'],
    },
  },
  component: Button,
  title: 'Atoms/Button',
};

export default meta;
type Story = StoryObj<typeof Button>;

// Basic Button Story
export const Default: Story = {
  args: {
    children: 'This is a button',
    size: 'md',
    variant: 'solid',
  },
  render: (args) => (
    <Center>
      <Button {...args} />
    </Center>
  ),
};

type IconStory = StoryObj<typeof ChakraIconButton>;

export const IconButton: IconStory = {
  args: {
    'aria-label': 'storybook-button',
    icon: <Icon as={RxLinkBreak2} />,
    size: 'md',
    variant: 'solid',
  },
  render: (args) => (
    <Center>
      <ChakraIconButton {...args} />
    </Center>
  ),
};
