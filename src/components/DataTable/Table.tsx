import { type ReactNode, useMemo, useState } from 'react';

import { Box, Flex, Skeleton } from '@chakra-ui/react';
import isFunction from 'lodash/isFunction';

import { Pagination } from '@components/Pagination';

import { TableContext } from './context';

interface TableProps<T> {
  children: ReactNode;
  columns: number;
  data: T[];
  hasPagination?: boolean;
  isLoading?: boolean;
  paginationVariant?: string;
  renderRow: (data: T, index: number) => ReactNode;
  resultsPerPage?: number;
  skeleton?: ReactNode;
}
export const Table = <T extends object>({
  children,
  columns,
  data = [],
  hasPagination = true,
  isLoading,
  paginationVariant,
  renderRow,
  resultsPerPage = 10,
  skeleton,
}: TableProps<T>) => {
  const [page, setPage] = useState<number>(1);

  const pageCount = Math.ceil(data && data.length ? data.length / resultsPerPage : 0);
  const paginatedResult: T[] = useMemo(() => {
    if (hasPagination && resultsPerPage && resultsPerPage > 0) {
      let result = data;
      const startIndex = (page - 1) * resultsPerPage;
      result = result.slice(startIndex, startIndex + resultsPerPage);
      return result;
    }
    return data;
  }, [resultsPerPage, data, page, hasPagination]);
  const showNextPage = () => {
    if (page + 1 <= pageCount) {
      setPage(page + 1);
    }
  };
  const showPrevPage = () => {
    if (page - 1 > 0) {
      setPage(page - 1);
    }
  };
  const context = useMemo(
    () => ({
      columns: 100 / columns,
    }),
    [columns]
  );

  return (
    <Flex flexDirection="column" textAlign="initial" width="100%">
      <TableContext.Provider value={context}>
        <Box textStyle="body-xs">{children}</Box>
        {isLoading && (
          <Box my={2}>{skeleton || <Skeleton height="60px" isLoaded={!isLoading} />}</Box>
        )}
        {isFunction(renderRow) && data && data.length > 0 && (
          <Box fontSize={16} mb={[3, 0, 0]}>
            {paginatedResult.map((item, index) => renderRow(item, index + 1))}
          </Box>
        )}
        {!isLoading && (!data || !data.length) && (
          <Box
            alignItems="center"
            display="flex"
            justifyContent="center"
            minH={100}
            opacity={0.3}
            userSelect="none"
          >
            No Data Available
          </Box>
        )}
        {hasPagination && resultsPerPage > 0 && pageCount > 1 && (
          <Box mt={6}>
            <Pagination
              onChange={(selectedPage) => setPage(selectedPage)}
              onNextClick={showNextPage}
              onPrevClick={showPrevPage}
              page={page}
              paginationVariant={paginationVariant}
              total={pageCount}
            />
          </Box>
        )}
      </TableContext.Provider>
    </Flex>
  );
};
