import React, { type ReactElement, ReactNode } from 'react';

import {
  Box,
  Flex,
  Grid,
  GridItem,
  useBreakpointValue,
  useRadio,
  useRadioGroup,
} from '@chakra-ui/react';

import { FilterOption, RadioButtonOption } from '@app-types/index';

import { DropDown } from '@components/ui/DropDown';
import SearchBar from '@components/ui/SearchBar';

type ToolbarRadioInputProps = {
  children: ReactElement;
  icon?: ReactElement;
  type?: string;
} & React.HTMLAttributes<HTMLInputElement>;

interface ToolbarProps {
  dropDownFilterKey?: string;
  dropDownFilterOptions?: RadioButtonOption[];
  dropDownInitialValue?: RadioButtonOption;
  info?: ReactNode;
  onApplyFilter: (filter: Record<string, string>) => void;
  radioButtonInitialValue?: FilterOption;
  radioFilterKey?: string;
  radioFilterOptions?: FilterOption[];
  searchBarPlaceHolder?: string;
  searchBarWidth?: number | string;
  searchQuery: string;
  selectedDropDownFilter?: string;
  type?: string;
}

const ToolbarRadioInput: React.FC<ToolbarRadioInputProps> = ({
  children,
  icon,
  type,
  ...props
}) => {
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
          bg: type === 'lbp' ? 'surface.brand.secondary.100' : 'surface.brand.accent.100',
        }}
        _hover={{
          _checked: {
            bg: type === 'lbp' ? 'surface.brand.secondary.100' : 'surface.brand.accent.100',
          },
          bg: 'surface.base.500',
        }}
        alignItems="center"
        bg="surface.base.200"
        borderColor={type === 'lbp' ? 'brand.secondary.600' : 'brand.accent.600'}
        borderRadius={25}
        borderWidth="1px"
        cursor="pointer"
        display="inline-flex"
        justifyContent="center"
        position="relative"
        px={5}
        py={2}
        role="radio"
        width={{ base: '100%', md: 'auto' }}
      >
        {icon || ''} {children}
      </Box>
    </Box>
  );
};

export const Toolbar = ({
  dropDownFilterKey,
  dropDownFilterOptions,
  info,
  onApplyFilter,
  radioButtonInitialValue,
  radioFilterKey,
  radioFilterOptions,
  searchBarPlaceHolder = 'Search tokens, pools or pairs...',
  searchBarWidth,
  searchQuery,
  selectedDropDownFilter,
  type,
}: ToolbarProps) => {
  const isLargeDevice = useBreakpointValue({ base: false, lg: true });

  const onSearchHandler = (input: string) => {
    onApplyFilter({ searchQuery: input });
  };
  const { getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: radioButtonInitialValue?.value,
    name: 'filter',
    onChange: (filterValue: string) => {
      if (radioFilterKey && radioFilterOptions) onApplyFilter({ [radioFilterKey]: filterValue });
    },
  });

  const onSelectDropDownFilter = (value: RadioButtonOption) => {
    // setSelectedDropDownFilter(value);
    if (dropDownFilterKey && dropDownFilterOptions)
      onApplyFilter({ [dropDownFilterKey]: value.value });
  };

  const group = getRootProps();

  const selectedOption = dropDownFilterOptions?.find(
    (item) => item.value === selectedDropDownFilter
  );

  return (
    <Flex
      flexDirection={{ base: 'column', lg: 'row', md: 'row' }}
      gap={2}
      justifyContent="space-between"
      py={4}
      w="100%"
    >
      <Box w={{ base: '100%', lg: searchBarWidth || 300 }}>
        <SearchBar
          placeholder={searchBarPlaceHolder}
          search={searchQuery}
          setSearch={onSearchHandler}
        />
      </Box>

      {isLargeDevice && info && (
        <Box
          bg="surface.base.200"
          border="2px solid"
          borderColor="surface.base.500"
          borderRadius="3xl"
          px={6}
          py={2}
        >
          {info}
        </Box>
      )}

      <Flex flexDirection={{ base: 'column', md: 'row' }} gap={4} justifyContent="space-between">
        {radioFilterOptions && (
          <Flex {...group}>
            {radioFilterOptions.map((option) => {
              const radio = getRadioProps({ value: option.value });
              return (
                <ToolbarRadioInput icon={option.icon} {...radio} key={option.value} type={type}>
                  <Box as="span" textTransform="capitalize">
                    {option.label}
                  </Box>
                </ToolbarRadioInput>
              );
            })}
          </Flex>
        )}
        <Grid gap={4} templateColumns={info ? { base: 'repeat(2, 1fr)', lg: '1fr' } : '1fr'}>
          {!isLargeDevice && info && (
            <GridItem colSpan={{ base: 2, md: 1 }} order={{ base: 2, md: 1 }}>
              <Box
                bg="surface.base.200"
                border="2px solid"
                borderColor="surface.base.500"
                borderRadius="3xl"
                px={6}
                py={2}
              >
                {info}
              </Box>
            </GridItem>
          )}
          {dropDownFilterOptions && dropDownFilterKey && selectedOption && (
            <GridItem colSpan={{ base: 2, md: 1 }} order={{ base: 1, md: 2 }}>
              <DropDown
                currentValue={selectedOption}
                onSelect={onSelectDropDownFilter}
                options={dropDownFilterOptions}
                title={dropDownFilterKey}
              />
            </GridItem>
          )}
        </Grid>
      </Flex>
    </Flex>
  );
};

export default Toolbar;
