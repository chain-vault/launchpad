import React, { type ReactElement, useRef, useState } from 'react';

import { Box, useRadio, useRadioGroup } from '@chakra-ui/react';
import isFunction from 'lodash/isFunction';

import { ThemeVariants } from '@app-types/index';

import { DropDown } from '@components/SortDropDown/SortDropDown';
import SearchBar from '@components/ui/SearchBar';

type FilterOption = {
  icon: ReactElement;
  label: string;
  value: number | string;
};
type ToolbarProps = {
  applyAction: (option: Record<string, number | string>) => void;
  filterOptions?: FilterOption[];
  onSearch?: (input: string) => void;
  searchBoxPlaceholder?: string;
  variant?: ThemeVariants;
};
type ToolbarRadioInputProps = {
  children: ReactElement;
  icon: ReactElement;
} & React.HTMLAttributes<HTMLInputElement>;

const ToolbarRadioInput: React.FC<ToolbarRadioInputProps> = ({ children, icon, ...props }) => {
  const { getInputProps, getRadioProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getRadioProps();
  return (
    <Box
      as="label"
      className="filter-button"
      display={{ base: 'flex', md: 'flex' }}
      flex={{ base: 'auto', md: 'initial' }}
      mr={[2, 2, 2]}
      role="toolbar"
    >
      <input {...input} />
      <Box
        {...checkbox}
        _checked={{
          bg: 'brand.secondary.100',
          borderColor: 'brand.secondary.600',
          color: 'base.750',
        }}
        _focus={{
          boxShadow: 'none',
        }}
        _hover={{
          borderColor: 'brand.secondary.600',
        }}
        alignItems="center"
        bg="surface.base.200"
        borderRadius={25}
        borderWidth="1px"
        color="inherit"
        cursor="pointer"
        display="inline-flex"
        justifyContent="center"
        position="relative"
        px={5}
        py={2}
        role="radio"
        width={{ base: '100%', md: 'auto' }}
      >
        {icon} {children}
      </Box>
    </Box>
  );
};

/**
 * @deprecated use ToolBarV2 component
 * @param param0
 * @returns
 */
export const Toolbar: React.FC<ToolbarProps> = ({
  applyAction,
  filterOptions,
  onSearch,
  searchBoxPlaceholder = 'Search',
  variant = ThemeVariants.APEIN,
}) => {
  const HAS_SEARCH = isFunction(onSearch);
  const [query, setQuery] = useState<string>('');
  const timer = useRef<null | ReturnType<typeof setInterval>>(null);
  const onSearchHandler = (input: string) => {
    setQuery(input);
    if (HAS_SEARCH) {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        onSearch(input);
      }, 700);
    }
  };
  const { getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: 'All',
    name: 'filter',
    onChange: (filterValue: string) => {
      applyAction({ status: filterValue });
    },
  });
  const group = getRootProps();
  return (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap={{ base: 'wrap', md: 'initial' }}
      justifyContent="space-between"
      py={4}
    >
      {HAS_SEARCH && (
        <Box
          display="flex"
          flex="auto"
          maxWidth={{ base: '100%', md: 300 }}
          mb={{ base: 3, md: 0 }}
          width={{ base: '100%', md: 'auto' }}
        >
          <SearchBar
            placeholder={searchBoxPlaceholder}
            search={query}
            setSearch={onSearchHandler}
            variant={variant}
          />
        </Box>
      )}
      {filterOptions && (
        <Box
          sx={{
            '> .filter-button:last-child': {
              mr: 0,
            },
          }}
          display="flex"
          flex="auto"
          flexDirection="row"
          justifyContent="flex-end"
          mb={{ base: 3, md: 0 }}
          pl={{ base: 0, md: 2 }}
          {...group}
        >
          {filterOptions.map((option) => {
            const radio = getRadioProps({ value: option.value });
            return (
              <ToolbarRadioInput icon={option.icon} {...radio} key={option.value}>
                <Box as="span" ml={2} textStyle="body-md">
                  {option.label}
                </Box>
              </ToolbarRadioInput>
            );
          })}
        </Box>
      )}

      <Box
        display="flex"
        flex="auto"
        justifyContent="flex-end"
        maxW={{ base: '100%', md: 170 }}
        minW={170}
        pl={{ base: 0, md: 2 }}
      >
        <DropDown onSelect={applyAction} />
      </Box>
    </Box>
  );
};

export default Toolbar;
