import React from 'react';

import { Box, Flex } from '@chakra-ui/react';

import { LBPPoolStatus, SortOptions, ThemeVariants } from '@app-types/index';

import { Table, Td, Th } from '@components/DataTable';
import Toolbar from '@components/Toolbar';
import { usePoolData } from '@hooks/lbp/useGetPoolsWithToken';

import { CompletedPoolRow } from './CompletedPoolRow';

type PoolsTableProps = {
  showOnlyCurated?: boolean;
};

export const CompletedPools: React.FC<PoolsTableProps> = () => {
  const { applyFilter, data, isLoading } = usePoolData(
    { sortBy: SortOptions.asc, status: LBPPoolStatus.COMPLETED },
    []
  );
  return (
    <Box width="100%">
      <Box>
        <Box>
          <Toolbar
            applyAction={applyFilter}
            onSearch={(query) => applyFilter({ searchQuery: query })}
            variant={ThemeVariants.LBP}
          />
        </Box>

        <Box width="100%">
          <Table
            columns={4}
            data={data}
            isLoading={isLoading}
            renderRow={(item) => <CompletedPoolRow {...item} />}
            resultsPerPage={10}
          >
            <Th mb={2}>
              <Flex justify="space-between" textStyle="body-sm" width="100%">
                <Td flex={[1, 2]} textAlign="left">
                  Project Name
                </Td>

                <Flex alignItems="flex-start" flex="2">
                  <Td textAlign="left">Funds Raised</Td>
                  <Td flex={[0.5, 1]} textAlign="left">
                    Aped
                  </Td>
                  <Td flex="1" textAlign="left">
                    Start Date
                  </Td>
                </Flex>
              </Flex>
            </Th>
          </Table>
        </Box>
      </Box>
    </Box>
  );
};
