import { useState } from 'react';

import { Button, Center } from '@chakra-ui/react';
import { Meta, StoryObj } from '@storybook/react';

import BasicModal from './BasicModal';

const meta: Meta<typeof BasicModal> = {
  argTypes: {
    closeButtonDisabled: { control: 'boolean' },
    footer: { control: 'text' },
    header: { control: 'text' },
    isCentered: { control: 'boolean' },
    isOpen: { control: 'boolean' },
    modalBody: { control: 'text' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', 'full'] },
  },
  component: BasicModal,
  title: 'Atoms/Modal',
};

export default meta;
type Story = StoryObj<typeof BasicModal>;

export const Default: Story = {
  args: {
    footer: 'Modal Footer',
    header: 'Modal Header',
    isCentered: true,
    isOpen: false,
    modalBody: 'This is the modal body content.',
    modalContentProps: { bg: 'base.600' },
  },
  render: function Component(args) {
    const [isOpen, setIsOpen] = useState(false);
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    return (
      <Center>
        <Button onClick={handleOpen}>Open Modal</Button>
        <BasicModal {...args} isOpen={isOpen} onClose={handleClose} />
      </Center>
    );
  },
};
