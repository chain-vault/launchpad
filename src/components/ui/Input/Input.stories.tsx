import { Input, InputProps } from '@chakra-ui/react';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

// Meta information
const meta: Meta<InputProps> = {
  argTypes: {
    placeholder: {
      control: 'text',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'select' },
      options: ['outline', 'filled', 'flushed', 'unstyled'],
    },
  },
  component: Input,
  title: 'Atoms/Input',
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    onChange: fn(),
    placeholder: 'Enter text...',
    size: 'md',
    variant: 'filled',
  },
  render: (args) => <Input {...args} />,
};

export const Invalid: Story = {
  args: {
    isInvalid: true,
    onChange: fn(),
    placeholder: 'Enter text...',
    size: 'md',
    variant: 'filled',
  },
  render: (args) => <Input {...args} />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Enter text...',
    size: 'md',
    variant: 'filled',
  },
  render: (args) => <Input {...args} />,
};
