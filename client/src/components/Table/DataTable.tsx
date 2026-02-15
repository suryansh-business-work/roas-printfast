import { useState, useCallback, ChangeEvent } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

export interface Column<T> {
  id: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  minWidth?: number;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  totalItems: number;
  page: number;
  rowsPerPage: number;
  sortField: string;
  sortOrder: 'asc' | 'desc';
  searchValue: string;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onSortChange: (field: string) => void;
  onSearchChange: (search: string) => void;
  isLoading?: boolean;
  getRowKey: (row: T) => string;
}

const DataTable = <T,>({
  columns,
  rows,
  totalItems,
  page,
  rowsPerPage,
  sortField,
  sortOrder,
  searchValue,
  onPageChange,
  onRowsPerPageChange,
  onSortChange,
  onSearchChange,
  isLoading,
  getRowKey,
}: DataTableProps<T>) => {
  const [localSearch, setLocalSearch] = useState(searchValue);

  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setLocalSearch(e.target.value);
      const timeout = setTimeout(() => {
        onSearchChange(e.target.value);
      }, 400);
      return () => clearTimeout(timeout);
    },
    [onSearchChange],
  );

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2 }}>
        <TextField
          size="small"
          placeholder="Search..."
          value={localSearch}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />
      </Box>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={String(col.id)} sx={{ minWidth: col.minWidth, fontWeight: 600 }}>
                  {col.sortable !== false ? (
                    <TableSortLabel
                      active={sortField === col.id}
                      direction={sortField === col.id ? sortOrder : 'asc'}
                      onClick={() => onSortChange(String(col.id))}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow hover key={getRowKey(row)}>
                  {columns.map((col) => (
                    <TableCell key={String(col.id)}>
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[String(col.id)] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalItems}
        page={page}
        onPageChange={(_e, newPage) => onPageChange(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Paper>
  );
};

export default DataTable;
