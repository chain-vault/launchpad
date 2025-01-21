import { Box } from '@chakra-ui/react';
import { Meta, StoryObj } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';

import { FileUploadStatus } from '@constants/index';

import DropzoneInput from './index';

const meta: Meta<typeof DropzoneInput> = {
  argTypes: {
    fileUploadStatus: {
      control: { type: 'select' },
      options: [
        FileUploadStatus.UPLOAD_IDLE,
        FileUploadStatus.FUNDING_ARWEAVE_NODE,
        FileUploadStatus.UPLOAD_ERROR,
        FileUploadStatus.SIGNING_MESSAGE,
        FileUploadStatus.UPLOAD_INIT,
      ],
    },
    isInvalid: { control: 'boolean' },
    onChange: { action: 'changed' },
    onDeleteFile: { action: 'deleted' },
    selectedFile: { control: false },
  },
  component: DropzoneInput,
  decorators: [
    (Story) => {
      const methods = useForm();
      return (
        <FormProvider {...methods}>
          <Box mx="auto" width="400px">
            <Story />
          </Box>
        </FormProvider>
      );
    },
  ],
  title: 'Components/FileUpload/DropzoneInput',
};

export default meta;

type Story = StoryObj<typeof DropzoneInput>;

export const Default: Story = {
  args: {
    fileUploadStatus: FileUploadStatus.UPLOAD_IDLE,
    isInvalid: false,
    selectedFile: null,
  },
};

export const Uploading: Story = {
  args: {
    fileUploadStatus: FileUploadStatus.FUNDING_ARWEAVE_NODE,
    isInvalid: false,
  },
};

export const ErrorState: Story = {
  args: {
    fileUploadStatus: FileUploadStatus.UPLOAD_ERROR,
    isInvalid: true,
    selectedFile: null,
  },
};
