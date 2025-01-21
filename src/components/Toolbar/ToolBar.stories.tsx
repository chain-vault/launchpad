import { useState } from 'react';

import { Box  } from '@chakra-ui/react';
import { Meta, StoryObj } from '@storybook/react';

import Toolbar from './index'; // Adjust the import according to your file structure

const meta: Meta<typeof Toolbar > = {
  argTypes: {
    filterOptions : { control : 'object' , description : 'filter options config'},
    onSearch : { action: 'setSearch', description: 'Function to update search text' },
    searchBoxPlaceholder :  { control : 'text' , description : 'width'  ,type : 'string'},
    

  },
  component: Toolbar  ,
  title: 'Atoms/Toolbar',
};

export default meta;

type Story = StoryObj<typeof Toolbar>;

export const Default: Story = {
  args: {
    filterOptions : [{
        icon : <Box>I</Box> ,
        label : 'Upcoming' ,
        value : 'upcoming'
    },{
        icon : <Box>I</Box> ,
        label : 'Live' ,
        value : 'live'
    }] ,
    searchBoxPlaceholder : 'Hello there'
  },
  render: function Component(args) {
    const [ s , onSearch] = useState('')
    return (
      <Box width="750px">
        Search : {s}
        <Toolbar onSearch={onSearch} {...args} />
      </Box>
    );
  },
};
