import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import { Breadcrumb } from '../../components/Breadcrumb';
import { DataTable, Column } from '../../components/Table';
import { IUserDetail, ICreateUserResponse } from '../../types/user.types';
import * as userService from '../../services/user.service';
import CreateUserDialog from './CreateUserDialog';
import PasswordRevealDialog from './PasswordRevealDialog';

const columns: Column<IUserDetail>[] = [
  { id: 'firstName', label: 'First Name', minWidth: 120 },
  { id: 'lastName', label: 'Last Name', minWidth: 120 },
  { id: 'email', label: 'Email', minWidth: 200 },
  {
    id: 'role',
    label: 'Role',
    minWidth: 120,
    render: (row) => {
      const label = row.role
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      return <Chip label={label} size="small" color="primary" variant="outlined" />;
    },
  },
  {
    id: 'isActive',
    label: 'Status',
    minWidth: 100,
    render: (row) => (
      <Chip
        label={row.isActive ? 'Active' : 'Inactive'}
        size="small"
        color={row.isActive ? 'success' : 'default'}
      />
    ),
  },
  {
    id: 'createdAt',
    label: 'Created',
    minWidth: 120,
    render: (row) => new Date(row.createdAt).toLocaleDateString(),
  },
];

const Users = () => {
  const [rows, setRows] = useState<IUserDetail[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [createdUserData, setCreatedUserData] = useState<ICreateUserResponse | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await userService.listUsers({
        page: page + 1,
        limit: rowsPerPage,
        sort: sortField,
        order: sortOrder,
        search: search || undefined,
      });
      if (response.success && response.data) {
        setRows(response.data.items);
        setTotalItems(response.data.totalItems);
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setIsLoading(false);
    }
  }, [page, rowsPerPage, sortField, sortOrder, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSortChange = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleCreateSuccess = (response: ICreateUserResponse) => {
    setCreateDialogOpen(false);
    setCreatedUserData(response);
    if (response.generatedPassword) {
      setPasswordDialogOpen(true);
    }
    setSnackbarOpen(true);
    fetchUsers();
  };

  return (
    <Box>
      <Breadcrumb />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Users</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateDialogOpen(true)}>
          Create User
        </Button>
      </Box>

      <DataTable
        columns={columns}
        rows={rows}
        totalItems={totalItems}
        page={page}
        rowsPerPage={rowsPerPage}
        sortField={sortField}
        sortOrder={sortOrder}
        searchValue={search}
        onPageChange={setPage}
        onRowsPerPageChange={(rpp) => {
          setRowsPerPage(rpp);
          setPage(0);
        }}
        onSortChange={handleSortChange}
        onSearchChange={(s) => {
          setSearch(s);
          setPage(0);
        }}
        isLoading={isLoading}
        getRowKey={(row) => row.userId}
      />

      <CreateUserDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {createdUserData?.generatedPassword && (
        <PasswordRevealDialog
          open={passwordDialogOpen}
          onClose={() => {
            setPasswordDialogOpen(false);
            setCreatedUserData(null);
          }}
          password={createdUserData.generatedPassword}
          email={createdUserData.email}
        />
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled">
          User created successfully
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Users;
