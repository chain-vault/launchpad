import { useState } from 'react';

import { Center } from '@chakra-ui/react';
import { Meta, StoryObj } from '@storybook/react';

import SearchBar from './SearchBar'; // Adjust the import according to your file structure

const meta: Meta<typeof SearchBar> = {
  argTypes: {
    placeholder: { control: 'text', description: 'Placeholder text for the input' },
    search: { control: 'text', description: 'Current search text' },
    setSearch: { action: 'setSearch', description: 'Function to update search text' },
  },
  component: SearchBar,
  title: 'Atoms/SearchBar',
};

export default meta;

type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
  args: {
    placeholder: 'Enter search text...',
    search: '',
  },
  render: function Component(args) {
    const [search, setSearch] = useState(args.search || '');

    return (
      <Center w="400px">
        <SearchBar {...args} search={search} setSearch={setSearch} />
      </Center>
    );
  },
};
