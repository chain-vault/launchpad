import { createContext } from 'react';

export const TableContext = createContext<{ columns: number }>({
  columns: 0,
});
