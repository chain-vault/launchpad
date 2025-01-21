import React, { useState } from 'react';

import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from '@chakra-ui/react';
import isFunction from 'lodash/isFunction';
import { TbChevronDown } from 'react-icons/tb';

import { SortOptions } from '@app-types/index';

type DropDownProps = {
  onSelect?: (sort: Record<string, string>) => void;
};

export const DropDown: React.FC<DropDownProps> = ({ onSelect }) => {
  const [selected, setSelected] = useState<string>(SortOptions.asc);
  const onChange = (value: string | string[]) => {
    const selectedValue = Array.isArray(value) ? value[0] : value;
    setSelected(selectedValue);
    if (isFunction(onSelect)) {
      onSelect({ sortBy: selectedValue });
    }
  };

  return (
    <Box width="100%">
      <Menu>
        <MenuButton
          as={Button}
          color="inherit"
          rightIcon={<TbChevronDown />}
          textStyle="body-md"
          variant="ghost"
          width="100%"
        >
          Sort :
          <Box
            as="span"
            display="inline-block"
            pl={1}
            textStyle="body-md"
            textTransform="capitalize"
          >
            {selected === SortOptions.asc ? 'Newest' : 'Oldest'}
          </Box>
        </MenuButton>

        <MenuList bg="surface.base.200" borderColor="surface.base.500" borderRadius="16px">
          <MenuOptionGroup
            defaultValue={selected}
            onChange={onChange}
            title="Sort by :"
            type="radio"
          >
            <MenuItemOption bg="transparent" textStyle="body-md" value={SortOptions.asc}>
              Newest
            </MenuItemOption>
            <MenuItemOption bg="transparent" textStyle="body-md" value={SortOptions.dsc}>
              Oldest
            </MenuItemOption>
          </MenuOptionGroup>
        </MenuList>
      </Menu>
    </Box>
  );
};
