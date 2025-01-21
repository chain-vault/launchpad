import { Box } from '@chakra-ui/react';
import { Meta, StoryObj } from '@storybook/react';

import { FilePreview } from './index';

const meta: Meta<typeof FilePreview> = {
  argTypes: {
    filePreview: { control: false },
  },
  component: FilePreview,
  title: 'Components/FileUpload/FilePreview',
};

export default meta;

type Story = StoryObj<typeof FilePreview>;

const filePreview = {
  isUploaded: true,
  name: 'test-file.png',
  preview: '',
  size: 10000,
  type: 'png',
};
export const Default: Story = {
  args: {
    filePreview,
  },
  render: (args) => (
    <Box mx="auto" width="600px">
      <FilePreview {...args} />
    </Box>
  ),
};
