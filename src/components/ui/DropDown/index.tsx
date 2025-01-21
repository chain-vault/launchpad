import React from 'react';

import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from '@chakra-ui/react';
import find from 'lodash/find';
import { TbChevronDown } from 'react-icons/tb';

import { RadioButtonOption } from '@app-types/index';

type DropDownProps = {
  currentValue: RadioButtonOption;
  onSelect: (value: RadioButtonOption) => void;
  options: RadioButtonOption[];
  title: string;
};

export const DropDown: React.FC<DropDownProps> = ({ currentValue, onSelect, options, title }) => {
  const onChange = (value: string | string[]) => {
    const selectedValue = Array.isArray(value) ? value[0] : value;
    const selectedOption = find(options, { value: selectedValue });
    if (selectedOption) {
      onSelect(selectedOption);
    }
  };

  return (
    <Box width="100%">
      <Menu>
        <MenuButton
          as={Button}
          color="inherit"
          rightIcon={<TbChevronDown />}
          textTransform="capitalize"
          variant="ghost"
          width="100%"
        >
          {title}:
          <Box as="span" display="inline-block" pl={1} textTransform="capitalize">
            {currentValue?.displayValue}
          </Box>
        </MenuButton>

        <MenuList bg="surface.base.200" borderColor="surface.base.500" borderRadius="16px">
          <MenuOptionGroup
            onChange={onChange}
            textAlign="left"
            textTransform="capitalize"
            type="radio"
            value={currentValue.value}
          >
            {options.map((eachMenuItemOption) => (
              <MenuItemOption
                bg="transparent"
                key={eachMenuItemOption.id}
                value={eachMenuItemOption.value}
              >
                {eachMenuItemOption.displayValue}
              </MenuItemOption>
            ))}
          </MenuOptionGroup>
        </MenuList>
      </Menu>
    </Box>
  );
};
