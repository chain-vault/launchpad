import { Box, Container } from '@chakra-ui/react';
import { useLocation } from '@tanstack/react-router';

import { PoolListSortOptions, RadioButtonOption } from '@app-types/index';

import withContainer from '@components/HOC/withContainer';
import { PageHeader } from '@components/PageHeader';
import Toolbar from '@components/Toolbar/ToolbarV2';
import usePoolData from '@hooks/apein/useFastLaunchListWithToken';
import { useApeinEventsHandler } from '@hooks/apein/useTradeListener';

import Launches from './Launches';

const DropDownFilterOptions: RadioButtonOption[] = [
  {
    id: PoolListSortOptions.ASC,
    displayValue: 'New',
    value: PoolListSortOptions.ASC,
  },
  {
    id: PoolListSortOptions.DESC,
    displayValue: 'Old',
    value: PoolListSortOptions.DESC,
  },
  {
    id: PoolListSortOptions.MARKET_CAP,
    displayValue: 'Market Cap',
    value: PoolListSortOptions.MARKET_CAP,
  },
  {
    id: PoolListSortOptions.DEVELOPER_LOCKED,
    displayValue: 'Developer Locked Tokens',
    value: PoolListSortOptions.DEVELOPER_LOCKED,
  },
];

const FastLaunchList = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const initialFilter = {
    searchQuery: '',
    sort: (queryParams.get('sort') as PoolListSortOptions) ?? PoolListSortOptions.ASC,
  };
  const { data, filters, isLoading, isTokensLoading, onChangeFilters } = usePoolData(initialFilter);
  useApeinEventsHandler();
  return (
    <Box width="100%">
      <Container mb={20} px={0} variant="container.1080">
        <PageHeader title="Ape In" includePoolNav />
        <Toolbar
          dropDownInitialValue={
            DropDownFilterOptions.find((option) => option.value === initialFilter.sort) ??
            DropDownFilterOptions[0]
          }
          dropDownFilterKey="sort"
          dropDownFilterOptions={DropDownFilterOptions}
          onApplyFilter={(newFilters) => onChangeFilters(newFilters)}
          radioFilterKey="view"
          searchBarWidth="75%"
          searchQuery={filters.searchQuery}
        />
        <Launches
          isLoading={isLoading || isTokensLoading}
          isTokensLoading={isTokensLoading}
          pools={data}
        />
      </Container>
    </Box>
  );
};

export default withContainer(FastLaunchList);
