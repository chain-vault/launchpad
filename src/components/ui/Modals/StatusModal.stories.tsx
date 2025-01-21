import { Meta, StoryObj } from '@storybook/react';

import { StatusModalTypes } from '@constants/index';

import StatusModal from './StatusModal';

const meta: Meta<typeof StatusModal> = {
  argTypes: {
    description: { control: 'text' },
    footerAction: { control: 'text' },
    isOpen: { control: 'boolean' },
    message: { control: 'text' },
    type: {
      control: {
        options: [StatusModalTypes.SUCCESS, StatusModalTypes.FAILED],
        type: 'select',
      },
    },
  },
  component: StatusModal,
  title: 'Atoms/Modal/StatusModal',
};

export default meta;

type Story = StoryObj<typeof StatusModal>;

export const Success: Story = {
  args: {
    description: 'Transaction completed successfully.',
    footerAction: 'Create Liquidity Pool',
    isOpen: true,
    message: 'Success message',
    type: StatusModalTypes.SUCCESS,
  },
};

export const Error: Story = {
  args: {
    description: 'Failed to complete transaction.',
    isOpen: true,
    type: StatusModalTypes.FAILED,
  },
  render: function Render(args) {
    return <StatusModal {...args} />;
  },
};
