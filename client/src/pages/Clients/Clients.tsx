import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { DataTable, Column } from '../../components/Table';
import { Breadcrumb } from '../../components/Breadcrumb';
import { IClient } from '../../types/client.types';
import * as clientService from '../../services/client.service';
import CreateClientDialog from './CreateClientDialog';

const Clients = () => {
  const [clients, setClients] = useState<IClient[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await clientService.listClients({
        page: page + 1,
        limit: rowsPerPage,
        sort: sortField,
        order: sortOrder,
        search: search || undefined,
        filters,
      });
      if (response.success && response.data) {
        setClients(response.data.items);
        setTotalItems(response.data.totalItems);
      }
    } catch {
      // Error handled silently
    } finally {
      setIsLoading(false);
    }
  }, [page, rowsPerPage, sortField, sortOrder, search, filters]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleToggleActive = useCallback(
    async (client: IClient) => {
      try {
        if (client.isActive) {
          await clientService.deactivateClient(client.clientId);
        } else {
          await clientService.activateClient(client.clientId);
        }
        fetchClients();
      } catch {
        // Error handled silently
      }
    },
    [fetchClients],
  );

  const handleSortChange = useCallback(
    (field: string) => {
      if (sortField === field) {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortOrder('asc');
      }
    },
    [sortField],
  );

  const columns: Column<IClient>[] = [
    { id: 'name', label: 'Name', filterable: true, filterType: 'text', minWidth: 130 },
    { id: 'email', label: 'Email', filterable: true, filterType: 'text', minWidth: 180 },
    { id: 'label', label: 'Label', filterable: true, filterType: 'text', minWidth: 100 },
    { id: 'category', label: 'Category', filterable: true, filterType: 'text', minWidth: 110 },
    { id: 'tag', label: 'Tag', filterable: true, filterType: 'text', minWidth: 100 },
    { id: 'vendorName', label: 'Vendor', sortable: false, minWidth: 120 },
    {
      id: 'isActive',
      label: 'Status',
      minWidth: 100,
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { value: 'true', label: 'Active' },
        { value: 'false', label: 'Inactive' },
      ],
      render: (row) => (
        <Chip
          label={row.isActive ? 'Active' : 'Inactive'}
          color={row.isActive ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      sortable: false,
      minWidth: 80,
      render: (row) => (
        <Tooltip title={row.isActive ? 'Deactivate' : 'Activate'}>
          <IconButton size="small" onClick={() => handleToggleActive(row)}>
            {row.isActive ? <BlockIcon color="error" /> : <CheckCircleIcon color="success" />}
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box>
      <Breadcrumb />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Clients</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          Add Client
        </Button>
      </Box>
      <DataTable
        columns={columns}
        rows={clients}
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
        filters={filters}
        onFiltersChange={(f) => {
          setFilters(f);
          setPage(0);
        }}
        isLoading={isLoading}
        getRowKey={(row) => row.clientId}
      />
      <CreateClientDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={fetchClients}
      />
    </Box>
  );
};

export default Clients;
