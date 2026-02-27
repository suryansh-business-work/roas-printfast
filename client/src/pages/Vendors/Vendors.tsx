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
import { IVendor } from '../../types/vendor.types';
import * as vendorService from '../../services/vendor.service';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/user.types';
import CreateVendorDialog from './CreateVendorDialog';

const columns: Column<IVendor>[] = [
  { id: 'name', label: 'Name', minWidth: 150 },
  { id: 'email', label: 'Email', minWidth: 200 },
  { id: 'phone', label: 'Phone', minWidth: 130 },
  { id: 'contactPerson', label: 'Contact Person', minWidth: 150 },
  { id: 'city', label: 'City', minWidth: 120 },
  { id: 'state', label: 'State', minWidth: 100 },
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

const Vendors = () => {
  const { user } = useAuth();
  const canManage = user?.role === UserRole.GOD_USER || user?.role === UserRole.ADMIN_USER;

  const [rows, setRows] = useState<IVendor[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const fetchVendors = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await vendorService.listVendors({
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
    fetchVendors();
  }, [fetchVendors]);

  const handleSortChange = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleCreateSuccess = () => {
    setCreateDialogOpen(false);
    setSnackbarOpen(true);
    fetchVendors();
  };

  return (
    <Box>
      <Breadcrumb />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Vendors</Typography>
        {canManage && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Vendor
          </Button>
        )}
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
        getRowKey={(row) => row.vendorId}
      />

      {canManage && (
        <CreateVendorDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled">
          Vendor created successfully
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Vendors;
