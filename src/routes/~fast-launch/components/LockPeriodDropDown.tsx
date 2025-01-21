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
import { useFormContext } from 'react-hook-form';
import { TbChevronDown } from 'react-icons/tb';

type LockPeriodDropDownProps = {
  disabled?: boolean;
};
const LOCK_PERIODS = ['1', '10', '20', '30'];
export const LockPeriodDropDown: React.FC<LockPeriodDropDownProps> = ({ disabled }) => {
  const name = 'lockToken.period';

  const { getValues, setValue, watch } = useFormContext();
  const onChange = (value: string | string[]) => {
    const selectedValue = Array.isArray(value) ? value[0] : value;
    setValue(name, selectedValue);
  };
  watch(name);
  const selected = getValues(name);

  return (
    <Box
      maxW={{ base: '100%', md: 180 }}
      opacity={disabled ? 0.3 : 1}
      position="relative"
      textAlign="left"
      width={['100%', '100%']}
      zIndex={1}
    >
      <Menu>
        <MenuButton
          as={Button}
          color="inherit"
          colorScheme="base"
          cursor={disabled ? 'not-allowed' : 'pointer'}
          mx={2}
          rightIcon={<TbChevronDown />}
          variant="filled"
          width={['100%', '100%']}
        >
          Period: {selected} Day{selected > 1 ? 's' : ''}
        </MenuButton>

        {!disabled && (
          <MenuList
            bg="surface.base.200"
            borderColor="surface.base.500"
            borderRadius="16px"
            maxW={['200px', '160px']}
            minW={['200px', '160px']}
          >
            <MenuOptionGroup
              defaultValue={selected}
              maxWidth="140px"
              onChange={onChange}
              title=""
              type="radio"
            >
              {LOCK_PERIODS.map((period) => (
                <MenuItemOption
                  bg="transparent"
                  disabled={selected === period}
                  fontWeight="medium"
                  icon={null}
                  key={period}
                  opacity={selected === period ? 0.3 : 1}
                  value={period}
                >
                  {period}
                </MenuItemOption>
              ))}
            </MenuOptionGroup>
          </MenuList>
        )}
      </Menu>
    </Box>
  );
};
