import React from 'react';

import { Box, Button } from '@chakra-ui/react';
import ReactPaginate, { ReactPaginateProps } from 'react-paginate';

type PaginationProps = {
  onChange: (page: number) => void;
  onNextClick?: () => void;
  onPrevClick?: () => void;
  page: number;
  paginationVariant?: string;
  total: number;
} & Partial<ReactPaginateProps>;
export const Pagination: React.FC<PaginationProps> = ({
  onChange,
  onNextClick,
  onPrevClick,
  page,
  paginationVariant,
  total,
  ...paginationProps
}) => {
  const onPageChange = ({ selected }: { selected: number }) => {
    onChange(selected + 1);
  };
  return (
    <Box display="flex" flexDirection="row" gap={[2, 0, 0]}>
      {onPrevClick && (
        <Box maxW={{ base: '50%', md: '124px' }} minW={{ base: '50%', md: '124px' }}>
          <Button
            isDisabled={page === 1}
            onClick={onPrevClick}
            variant={paginationVariant || 'ghost'}
            width="100%"
          >
            Previous
          </Button>
        </Box>
      )}
      <Box
        sx={{
          '.paginate': {
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            'li:not(.previous) a,li:not(.next) a': {
              alignItems: 'center',
              base: { opacity: 0.1 },
              borderRadius: '50%',
              display: 'flex',
              height: '40px',
              justifyContent: 'center',
              width: '40px',
            },

            'li.next,li.previous': {
              display: 'none',
            },

            'li.selected a': {
              bg: 'surface.base.600',
            },
            position: 'relative',
            'ul,li': {
              listStyle: 'none',
              listStyleType: 'none',
            },
            width: '100%',
          },
        }}
        display={{ base: 'none', md: 'flex' }}
        flexDirection="row"
        width="100%"
      >
        <ReactPaginate
          breakLabel="..."
          className="paginate"
          forcePage={page - 1}
          onPageChange={onPageChange}
          pageCount={total}
          renderOnZeroPageCount={null}
          {...paginationProps}
        />
      </Box>
      {onNextClick && (
        <Box
          maxW={{ base: '50%', md: '124px' }}
          minW={{ base: '50%', md: '124px' }}
          onClick={onNextClick}
        >
          <Button isDisabled={page === total} variant={paginationVariant || 'ghost'} width="100%">
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
};
