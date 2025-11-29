'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import useAuthStore from '@/store/authStore';
import {
  Paper,
  TextField,
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  FileDownload,
  Edit as EditIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import { exportToExcel, formatUsersForExcel } from '@/lib/exportToExcel';

interface UserRow {
  id: number;
  email: string;
  name: string;
  role: string;
  rt_rw?: string;
  jenis_kelamin?: string;
  created_at: string;
}

const ROLE_LABELS: Record<string, string> = {
  warga: 'Warga',
  pengurus: 'Pengurus',
  sekretaris_rt: 'Sekretaris RT',
  sekretaris: 'Sekretaris',
  ketua_rt: 'Ketua RT',
  admin_rw: 'Admin RW',
  admin: 'Admin Sistem',
};

export default function AdminSystemPanel() {
  const { user } = useAuthStore();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 50; // Increased for better pagination, especially for superadmin
  
  // Form state
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'warga',
    rt_rw: '',
    jenis_kelamin: '',
  });
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: 'warga',
    rt_rw: '',
    jenis_kelamin: '',
  });
  const [formError, setFormError] = useState('');
  const [editFormError, setEditFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [editFormLoading, setEditFormLoading] = useState(false);
  
  // Get allowed roles based on current user role
  const getAllowedRoles = () => {
    const currentRole = user?.role || '';
    
    if (currentRole === 'admin' || currentRole === 'admin_sistem') {
      return ['warga', 'pengurus', 'sekretaris_rt', 'sekretaris', 'ketua_rt', 'admin_rw', 'admin'];
    }
    if (currentRole === 'admin_rw') {
      return ['warga', 'pengurus', 'sekretaris_rt', 'sekretaris', 'ketua_rt'];
    }
    if (currentRole === 'ketua_rt') {
      return ['warga', 'pengurus', 'sekretaris_rt'];
    }
    if (currentRole === 'sekretaris_rt' || currentRole === 'sekretaris') {
      return ['warga', 'pengurus'];
    }
    return []; // Pengurus dan warga tidak bisa buat user
  };
  
  const allowedRoles = getAllowedRoles();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (role && role !== 'all') params.set('role', role);
      params.set('limit', itemsPerPage.toString());
      params.set('offset', ((page - 1) * itemsPerPage).toString());
      
      console.log('[Frontend] Fetching users with params:', params.toString());
      const { data } = await api.get(`/auth/users?${params.toString()}`);
      
      console.log('[Frontend] Received data:', data);
      
      // Handle both array and object response
      if (Array.isArray(data)) {
        setUsers(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage) || 1);
      } else if (data && data.data) {
        setUsers(data.data);
        setTotalPages(Math.ceil((data.total || data.data.length) / itemsPerPage) || 1);
        console.log(`[Frontend] Total users: ${data.total}, Current page: ${data.page}, Users in this page: ${data.data.length}`);
      } else {
        setUsers([]);
        setTotalPages(1);
      }
    } catch (error: any) {
      console.error('[Frontend] Error fetching users:', error);
      console.error('[Frontend] Error response:', error.response?.data);
      alert(`Gagal mengambil data pengguna: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      if (page === 1) {
        fetchUsers();
      } else {
        setPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, role]);

  const removeUser = async (id: number) => {
    if (!confirm('Hapus pengguna ini?')) return;
    try {
      await api.delete(`/auth/users/${id}`);
      fetchUsers();
    } catch {
      alert('Gagal menghapus pengguna');
    }
  };

  const handleCreateUser = async () => {
    setFormError('');
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setFormError('Nama, email, password, dan role wajib diisi');
      return;
    }
    
    setFormLoading(true);
    try {
      const response = await api.post('/auth/users', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        rt_rw: formData.rt_rw || null,
        jenis_kelamin: formData.jenis_kelamin || null,
      });
      
      // Show success message
      if (response.data.message) {
        alert(response.data.message);
      } else {
        alert('User berhasil dibuat!');
      }
      
      setOpenDialog(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: allowedRoles[0] || 'warga',
        rt_rw: user?.rt_rw || '',
        jenis_kelamin: '',
      });
      fetchUsers();
    } catch (error: any) {
      setFormError(error.response?.data?.error || 'Gagal membuat pengguna');
    } finally {
      setFormLoading(false);
    }
  };
  
  const handleOpenDialog = () => {
    // Auto-fill RT/RW based on current user
    setFormData({
      name: '',
      email: '',
      password: '',
      role: allowedRoles[0] || 'warga',
      rt_rw: user?.rt_rw || '',
      jenis_kelamin: '',
    });
    setFormError('');
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (userRow: UserRow) => {
    setEditingUser(userRow);
    setEditFormData({
      name: userRow.name,
      email: userRow.email,
      role: userRow.role,
      rt_rw: userRow.rt_rw || '',
      jenis_kelamin: userRow.jenis_kelamin || '',
    });
    setEditFormError('');
    setEditDialog(true);
  };

  const handleUpdateUser = async () => {
    setEditFormError('');
    if (!editingUser) return;
    
    if (!editFormData.name || !editFormData.email || !editFormData.role) {
      setEditFormError('Nama, email, dan role wajib diisi');
      return;
    }
    
    setEditFormLoading(true);
    try {
      const response = await api.put(`/auth/users/${editingUser.id}`, {
        name: editFormData.name,
        email: editFormData.email,
        role: editFormData.role,
        rt_rw: editFormData.rt_rw || null,
        jenis_kelamin: editFormData.jenis_kelamin || null,
      });
      
      if (response.data.message) {
        alert(response.data.message);
      } else {
        alert('User berhasil diperbarui!');
      }
      
      setEditDialog(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error: any) {
      setEditFormError(error.response?.data?.error || 'Gagal memperbarui pengguna');
    } finally {
      setEditFormLoading(false);
    }
  };

  // Get page title based on role
  const getPageTitle = () => {
    const currentRole = user?.role || '';
    if (currentRole === 'admin' || currentRole === 'admin_sistem') {
      return 'Kelola Pengguna (Semua Role)';
    } else if (currentRole === 'admin_rw') {
      return `Kelola Pengguna RW ${user?.rt_rw?.split('/')[1] || ''}`;
    } else if (['ketua_rt', 'sekretaris_rt', 'sekretaris'].includes(currentRole)) {
      return `Kelola Warga ${user?.rt_rw || ''}`;
    }
    return 'Kelola Pengguna';
  };
  
  // Get description based on role
  const getPageDescription = () => {
    const currentRole = user?.role || '';
    if (currentRole === 'admin' || currentRole === 'admin_sistem') {
      return 'Lihat dan kelola semua pengguna sistem (Admin, RW, RT, Sekretaris, Pengurus, Warga)';
    } else if (currentRole === 'admin_rw') {
      return 'Lihat dan kelola RT dan warga di RW Anda';
    } else if (['ketua_rt', 'sekretaris_rt', 'sekretaris'].includes(currentRole)) {
      return 'Lihat dan kelola warga di RT Anda';
    }
    return '';
  };

  return (
    <div className="space-y-6">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827' }}>
            {getPageTitle()}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {users.length > 0 && (
            <Button
              variant="outlined"
              startIcon={<FileDownload />}
              onClick={() => {
                const formattedData = formatUsersForExcel(users);
                exportToExcel(formattedData, 'data_pengguna', 'Data Pengguna');
              }}
              sx={{
                borderColor: '#3B82F6',
                color: '#3B82F6',
                '&:hover': {
                  borderColor: '#2563EB',
                  bgcolor: '#EFF6FF',
                },
              }}
            >
              Export Excel
            </Button>
          )}
          {allowedRoles.length > 0 && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
              sx={{
                bgcolor: '#3B82F6',
                '&:hover': { bgcolor: '#2563EB' },
                borderRadius: 3,
                px: 3,
                py: 1.5,
              }}
            >
              Buat User Baru
            </Button>
            )}
          </Box>
        </Box>
        {getPageDescription() && (
          <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.875rem' }}>
            {getPageDescription()}
          </Typography>
        )}
      </Box>

      {/* Filters */}
      <Box className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            fullWidth
            size="medium"
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="text-gray-400" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: '#f9fafb',
                '&:hover': {
                  backgroundColor: '#f3f4f6',
                },
                '&.Mui-focused': {
                  backgroundColor: '#ffffff',
                },
              },
            }}
          />
          <TextField
            fullWidth
            size="medium"
            select
            // label="Filter Peran"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            variant="outlined"
            SelectProps={{ native: true }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: '#f9fafb',
                '&:hover': {
                  backgroundColor: '#f3f4f6',
                },
                '&.Mui-focused': {
                  backgroundColor: '#ffffff',
                },
              },
            }}
          >
            <option value="all">Semua Peran</option>
            {(() => {
              const currentRole = user?.role || '';
              // Super Admin: semua role
              if (currentRole === 'admin' || currentRole === 'admin_sistem') {
                return (
                  <>
                    <option value="admin">Admin Sistem</option>
                    <option value="admin_rw">Admin RW</option>
                    <option value="ketua_rt">Ketua RT</option>
                    <option value="sekretaris_rt">Sekretaris RT</option>
                    <option value="sekretaris">Sekretaris</option>
                    <option value="pengurus">Pengurus</option>
                    <option value="warga">Warga</option>
                  </>
                );
              }
              // Admin RW: RT dan warga
              if (currentRole === 'admin_rw') {
                return (
                  <>
                    <option value="ketua_rt">Ketua RT</option>
                    <option value="sekretaris_rt">Sekretaris RT</option>
                    <option value="sekretaris">Sekretaris</option>
                    <option value="pengurus">Pengurus</option>
                    <option value="warga">Warga</option>
                  </>
                );
              }
              // RT/Sekretaris: hanya warga
              if (['ketua_rt', 'sekretaris_rt', 'sekretaris'].includes(currentRole)) {
                return (
                  <>
                    <option value="warga">Warga</option>
                  </>
                );
              }
              return null;
            })()}
          </TextField>
        </div>
      </Box>

      {/* DataGrid Table */}
      <Paper
        elevation={0}
        sx={{
          height: 600,
          width: '100%',
          border: '1px solid #E5E7EB',
          borderRadius: 3,
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #F3F4F6',
          },
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: '#F9FAFB',
            borderBottom: '2px solid #E5E7EB',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid #E5E7EB',
          },
        }}
      >
        <DataGrid
          rows={users}
          columns={[
            {
              field: 'name',
              headerName: 'Nama',
              flex: 1,
              minWidth: 150,
              filterable: true,
            },
            {
              field: 'email',
              headerName: 'Email',
              flex: 1,
              minWidth: 200,
              filterable: true,
            },
            {
              field: 'role',
              headerName: 'Peran',
              width: 150,
              type: 'singleSelect',
              valueOptions: ['warga', 'pengurus', 'sekretaris_rt', 'sekretaris', 'ketua_rt', 'admin_rw', 'admin'],
              filterable: true,
              renderCell: (params) => (
                <Chip
                  label={ROLE_LABELS[params.value] || params.value}
                  size="small"
                  color={params.value === 'admin' ? 'error' : params.value === 'warga' ? 'default' : 'primary'}
                />
              ),
            },
            {
              field: 'rt_rw',
              headerName: 'RT/RW',
              width: 120,
              filterable: true,
              valueGetter: (value) => value || '-',
            },
            {
              field: 'jenis_kelamin',
              headerName: 'Gender',
              width: 120,
              filterable: true,
              valueGetter: (value: string | null) => value ? value.replace('_', ' ') : '-',
              renderCell: (params: any) => (
                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                  {params.value || '-'}
                </Typography>
              ),
            },
            {
              field: 'created_at',
              headerName: 'Dibuat',
              width: 150,
              type: 'dateTime',
              filterable: true,
              valueGetter: (value) => value ? new Date(value) : null,
              renderCell: (params) => {
                if (!params.value) return '-';
                return new Date(params.value).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                });
              },
            },
            {
              field: 'actions',
              type: 'actions',
              headerName: 'Aksi',
              width: 100,
              getActions: (params: any) => {
                const currentRole = user?.role || '';
                const targetRole = params.row.role;
                
                // Cek apakah user bisa hapus target user
                let canDelete = false;
                
                if (currentRole === 'admin' || currentRole === 'admin_sistem') {
                  // Super Admin: bisa hapus semua kecuali admin lain (kecuali admin_sistem)
                  if (currentRole === 'admin_sistem') {
                    canDelete = true; // Admin sistem bisa hapus semua
                  } else {
                    canDelete = targetRole !== 'admin' && targetRole !== 'admin_sistem';
                  }
                } else if (currentRole === 'admin_rw') {
                  // Admin RW: hanya bisa hapus RT dan warga di RW mereka
                  const allowedRoles = ['warga', 'ketua_rt', 'sekretaris_rt', 'sekretaris', 'pengurus'];
                  canDelete = allowedRoles.includes(targetRole);
                } else if (['ketua_rt', 'sekretaris_rt', 'sekretaris'].includes(currentRole)) {
                  // RT/Sekretaris: hanya bisa hapus warga di RT mereka
                  canDelete = targetRole === 'warga';
                }
                
                // Cegah hapus diri sendiri
                if (params.row.id === user?.id) {
                  canDelete = false;
                }
                
                // Cek apakah user bisa edit target user (hanya superadmin)
                let canEdit = false;
                if (currentRole === 'admin' || currentRole === 'admin_sistem') {
                  // Super Admin: bisa edit semua kecuali admin lain (kecuali admin_sistem)
                  if (currentRole === 'admin_sistem') {
                    canEdit = true; // Admin sistem bisa edit semua
                  } else {
                    canEdit = targetRole !== 'admin' && targetRole !== 'admin_sistem';
                  }
                }
                
                const actions = [];
                
                // Edit action (hanya untuk superadmin)
                if (canEdit) {
                  actions.push(
                    <GridActionsCellItem
                      key="edit"
                      icon={<EditIcon />}
                      label="Edit"
                      onClick={() => handleOpenEditDialog(params.row)}
                      showInMenu={false}
                    />
                  );
                }
                
                // Delete action
                if (canDelete) {
                  actions.push(
                    <GridActionsCellItem
                      key="delete"
                      icon={<DeleteIcon />}
                      label="Hapus"
                      onClick={() => removeUser(params.row.id)}
                      showInMenu={false}
                    />
                  );
                }
                
                return actions;
              },
            },
          ]}
          loading={loading}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
            sorting: {
              sortModel: [{ field: 'created_at', sort: 'desc' }],
            },
          }}
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
              printOptions: { disableToolbarButton: true },
              csvOptions: { disableToolbarButton: true },
            },
          }}
          sx={{
            '& .MuiDataGrid-toolbarContainer': {
              p: 2,
              borderBottom: '1px solid #E5E7EB',
            },
            '& .MuiDataGrid-row:hover': {
              bgcolor: '#F9FAFB',
            },
          }}
        />
      </Paper>

      {/* Create User Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="font-bold text-gray-900 pb-2">Buat User Baru</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            {formError && (
              <Alert severity="error" className="rounded-xl">
                {formError}
              </Alert>
            )}
            <TextField
              fullWidth
              label="Nama Lengkap *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              variant="outlined"
              size="medium"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              fullWidth
              label="Email *"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              variant="outlined"
              size="medium"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              fullWidth
              label="Password *"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              variant="outlined"
              size="medium"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <FormControl fullWidth size="medium" required>
              <InputLabel>Role *</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                label="Role *"
                sx={{
                  borderRadius: 2,
                }}
              >
                {allowedRoles.map((roleOption) => (
                  <MenuItem key={roleOption} value={roleOption}>
                    {ROLE_LABELS[roleOption] || roleOption}
                  </MenuItem>
                ))}
              </Select>
              {allowedRoles.length === 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Role Anda tidak memiliki permission untuk membuat user baru.
                </Alert>
              )}
            </FormControl>
            <TextField
              fullWidth
              label="RT/RW"
              placeholder="Format: RT001/RW005"
              value={formData.rt_rw}
              onChange={(e) => setFormData({ ...formData, rt_rw: e.target.value })}
              variant="outlined"
              size="medium"
              required={user?.role !== 'admin' && user?.role !== 'admin_sistem'}
              helperText={
                user?.role === 'admin_rw' 
                  ? `Harus di RT dalam RW ${user?.rt_rw?.split('/')[1] || ''}`
                  : user?.role === 'ketua_rt' || user?.role === 'sekretaris_rt' || user?.role === 'sekretaris'
                  ? `Harus sama dengan RT/RW Anda: ${user?.rt_rw || ''}`
                  : 'Format: RT001/RW005'
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <FormControl fullWidth size="medium">
              <InputLabel>Jenis Kelamin (opsional)</InputLabel>
              <Select
                value={formData.jenis_kelamin}
                onChange={(e) => setFormData({ ...formData, jenis_kelamin: e.target.value })}
                label="Jenis Kelamin (opsional)"
                sx={{
                  borderRadius: 2,
                }}
              >
                <MenuItem value="">Tidak Disediakan</MenuItem>
                <MenuItem value="laki_laki">Laki-laki</MenuItem>
                <MenuItem value="perempuan">Perempuan</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions className="px-6 py-4">
          <Button onClick={() => setOpenDialog(false)} className="text-gray-600">
            Batal
          </Button>
          <Button
            onClick={handleCreateUser}
            variant="contained"
            disabled={formLoading}
            className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6"
          >
            {formLoading ? 'Membuat...' : 'Buat User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="font-bold text-gray-900 pb-2">Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            {editFormError && (
              <Alert severity="error" className="rounded-xl">
                {editFormError}
              </Alert>
            )}
            <TextField
              fullWidth
              label="Nama Lengkap *"
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              variant="outlined"
              size="medium"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              fullWidth
              label="Email *"
              type="email"
              value={editFormData.email}
              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
              variant="outlined"
              size="medium"
              required
              disabled
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <FormControl fullWidth size="medium" required>
              <InputLabel>Role *</InputLabel>
              <Select
                value={editFormData.role}
                onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                label="Role *"
                sx={{
                  borderRadius: 2,
                }}
              >
                {allowedRoles.map((roleOption) => (
                  <MenuItem key={roleOption} value={roleOption}>
                    {ROLE_LABELS[roleOption] || roleOption}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="RT/RW"
              placeholder="Format: RT001/RW005"
              value={editFormData.rt_rw}
              onChange={(e) => setEditFormData({ ...editFormData, rt_rw: e.target.value })}
              variant="outlined"
              size="medium"
              helperText="Format: RT001/RW005"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <FormControl fullWidth size="medium">
              <InputLabel>Jenis Kelamin (opsional)</InputLabel>
              <Select
                value={editFormData.jenis_kelamin}
                onChange={(e) => setEditFormData({ ...editFormData, jenis_kelamin: e.target.value })}
                label="Jenis Kelamin (opsional)"
                sx={{
                  borderRadius: 2,
                }}
              >
                <MenuItem value="">Tidak Disediakan</MenuItem>
                <MenuItem value="laki_laki">Laki-laki</MenuItem>
                <MenuItem value="perempuan">Perempuan</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions className="px-6 py-4">
          <Button onClick={() => setEditDialog(false)} className="text-gray-600">
            Batal
          </Button>
          <Button
            onClick={handleUpdateUser}
            variant="contained"
            disabled={editFormLoading}
            className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6"
          >
            {editFormLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


