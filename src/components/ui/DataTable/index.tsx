import { useId } from 'react';

import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { ReactNode } from '@tanstack/react-router';
import isFunction from 'lodash/isFunction';

type HeaderConfig<D> = {
  formatter?: (obj: D) => string;
  name: string;
  render: (obj: D) => ReactNode;
  visible?: boolean;
};
type DataTableProps<T> = {
  data: T[];
  headers: HeaderConfig<T>[];
  uid: (obj: T) => string;
};

export const DataTable = <T extends object>({ data, headers, uid }: DataTableProps<T>) => {
  const id = useId();
  return (
    <TableContainer id={id}>
      <Table>
        <Thead>
          {headers.map((header) => (
            <Th fontSize={12} key={header.name}>
              {header.name}
            </Th>
          ))}
        </Thead>
        <Tbody>
          {data &&
            data.length &&
            data.map((rowObj) => (
              <Tr key={uid(rowObj)}>
                {headers.map((headerConfig) => {
                  if (isFunction(headerConfig.render)) {
                    return (
                      <Td key={uid(rowObj) + headerConfig.name}>{headerConfig.render(rowObj)}</Td>
                    );
                  }
                  return null;
                })}
              </Tr>
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
