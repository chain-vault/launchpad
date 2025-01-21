import { type ChangeEvent } from 'react';

import { Box, Flex, Icon } from '@chakra-ui/react';
import { RxMagnifyingGlass } from 'react-icons/rx';

import { ThemeVariants } from '@app-types/index';

type SearchBarProps = {
  placeholder: string;
  search: string;
  setSearch: (input: string) => void;
  variant?: ThemeVariants;
};

const SearchBar = ({
  placeholder = 'Enter search text',
  search,
  setSearch,
  variant,
}: SearchBarProps) => {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setSearch(inputValue);
  };

  return (
    <Flex
      _focusWithin={{ color: `brand.${variant}.600`, transition: '0.3s ease' }}
      _hover={{ color: `brand.${variant}.600`, transition: '0.3s ease' }}
      alignItems="center"
      bg="surface.base.100"
      borderRadius="3xl"
      boxSizing="border-box"
      h={10}
      justifyContent="start"
      px={4}
      textStyle="body-md"
      w="100%"
    >
      <Icon as={RxMagnifyingGlass} boxSize={4} focusable={false} mr={3} />
      <Box
        _focus={{ _placeholder: { color: `brand.${variant}.600`, transition: '0.3s ease' } }}
        _hover={{ _placeholder: { color: `brand.${variant}.600`, transition: '0.3s ease' } }}
        as="input"
        bg="none"
        border="none"
        onChange={handleSearchChange}
        outline="none"
        placeholder={placeholder}
        value={search}
        w="100%"
      />
    </Flex>
  );
};

export default SearchBar;
