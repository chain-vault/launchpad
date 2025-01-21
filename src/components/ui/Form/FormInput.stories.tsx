import { Box, Button, Image } from '@chakra-ui/react';
import { Meta, StoryObj } from '@storybook/react';
import { FieldValues, useForm } from 'react-hook-form';

import { SolLogo } from '@assets/icons';

import { FormInput } from './FormInput'; // Adjust the import path as needed

interface FormIputParams extends FieldValues {
  tokenTicker: string;
}

// Meta configuration
const meta: Meta<typeof FormInput> = {
  argTypes: {
    inputRightElement: { control: false }, // Disabling control for ReactNode type
    placeholder: { control: 'text' },
    type: { control: { type: 'select' }, options: ['text', 'number'] },
  },
  component: FormInput,
  decorators: [
    (Story) => {
      const methods = useForm<FormIputParams>();
      const { control } = methods;
      return (
        <Box w="50%">
          <Story control={control} />
        </Box>
      );
    },
  ],
  title: 'Atoms/Form/FormInput',
};

export default meta;
type Story = StoryObj<typeof FormInput>;

// Default FormInput Story
export const Default: Story = {
  args: {
    name: 'tokenTicker',
    placeholder: 'Enter text...',
    rules: { required: 'Required field' },
  },

  render: (args, { control }) => <FormInput<FormIputParams> {...args} control={control} />,
};

// With InputRightElement Story
export const WithInputRightElement: Story = {
  args: {
    inputRightElement: (
      <Button
        borderRadius="6px"
        leftIcon={<Image alt="sol logo" boxSize={4} src={SolLogo} />}
        minW="max-content"
        padding={1}
        size="xs"
        variant="ghost"
      >
        SOL
      </Button>
    ),
    name: 'tokenTicker',
    placeholder: 'Search...',
    rules: { required: 'Required field' },
  },
  render: (args, { control }) => <FormInput<FormIputParams> {...args} control={control} />,
};
