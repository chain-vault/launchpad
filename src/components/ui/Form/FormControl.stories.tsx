import { Input } from '@chakra-ui/react';
import { Meta, StoryObj } from '@storybook/react';

import { Default as DefaultInput, Invalid } from '@components/ui/Input/Input.stories';

import { FormHandler } from './FormControl';

// Meta information
const meta: Meta<typeof FormHandler> = {
  argTypes: {
    fieldError: { control: false },
    helperText: { control: 'text' },
    htmlFor: { control: 'text' },
    inputField: { control: false },
    label: { control: 'text' },
  },
  component: FormHandler,
  title: 'Atoms/Form/FormHandler',
};

export default meta;

type Story = StoryObj<typeof FormHandler>;

// Default FormHandler Story
export const Default: Story = {
  args: {
    helperText: 'This will be your token name',
    htmlFor: 'token-name',
    inputField: <Input {...DefaultInput.args} />,
    label: 'Token Name',
  },
};

// FormHandler with Error Message
export const Error: Story = {
  args: {
    fieldError: {
      message: 'Required field',
      type: 'required',
    },
    helperText: 'This will be your token name',
    htmlFor: 'token-name',
    inputField: <Input {...Invalid.args} />,
    label: 'Token Name',
  },
};
