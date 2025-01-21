import { useState } from 'react';

import { Box } from '@chakra-ui/react';
import { Meta, StoryObj } from '@storybook/react';

import Editor from '.';

const meta: Meta<typeof Editor> = {
  argTypes: {
    isInvalid: { control: 'boolean' },
    value: { control: false },
  },
  component: Editor,
  title: 'Components/TextEditor',
};

export default meta;

type Story = StoryObj<typeof Editor>;

export const Default: Story = {
  args: {
    isInvalid: false,
  },
  render: function Render(args) {
    const [editorValue, setEditorValue] = useState(args.value || '');

    const handleChange = (value: string) => {
      setEditorValue(value);
      args.onChange(value);
    };
    return (
      <Box mx="auto" width="600px">
        <Editor {...args} onChange={handleChange} value={editorValue} />
      </Box>
    );
  },
};
