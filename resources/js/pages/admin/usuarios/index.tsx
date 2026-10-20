import { Head, router } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import GroupIcon from '@mui/icons-material/Group';
import SearchIcon from '@mui/icons-material/Search';
import {
    Avatar,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { FormEvent, useState } from 'react';
import { useNotification } from '@/hooks/use-notification';
import { confirmDeleteAlert } from '@/lib/swal';

interface Role {
    id: number;
    nombre: string;
    slug: 'admin' | 'capacitado';
    descripcion?: string | null;
}

interface UserItem {
    id: number;
    rol_id: number;
    name: string;
    email: string;
    email_verified_at?: string | null;
    is_enabled: boolean;
    rol?: Role | null;
    created_at?: string;
}

interface UserForm {
    name: string;
    email: string;
    rol_id: number | '';
    password: string;
    password_confirmation: string;
    email_verified: boolean;
    is_enabled: boolean;
}

const emptyForm: UserForm = {
    name: '',
    email: '',
    rol_id: '',
    password: '',
    password_confirmation: '',
    email_verified: true,
    is_enabled: true,
};

export default function UsersIndex({
    users = [],
    roles = [],
    filters = { search: '', role: 'all' },
}: {
    users: UserItem[];
    roles: Role[];
    filters?: { search?: string; role?: string };
}) {
    const { notify } = useNotification();
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);
    const [form, setForm] = useState<UserForm>(emptyForm);

    const applyFilters = (nextSearch = search, nextRole = roleFilter) => {
        const query: Record<string, string> = {};
        if (nextSearch.trim()) query.search = nextSearch.trim();
        if (nextRole !== 'all') query.role = nextRole;
        router.get('/admin/usuarios', query, { preserveState: true, preserveScroll: true, replace: true });
    };

    const openCreate = () => {
        setEditingUser(null);
        setForm({ ...emptyForm, rol_id: roles[0]?.id || '' });
        setDialogOpen(true);
    };

    const openEdit = (user: UserItem) => {
        setEditingUser(user);
        setForm({
            name: user.name,
            email: user.email,
            rol_id: user.rol_id,
            password: '',
            password_confirmation: '',
            email_verified: Boolean(user.email_verified_at),
            is_enabled: user.is_enabled,
        });
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setEditingUser(null);
        setForm(emptyForm);
    };

    const updateForm = <K extends keyof UserForm>(key: K, value: UserForm[K]) => {
        setForm((current) => ({ ...current, [key]: value }));
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        const url = editingUser ? `/admin/usuarios/${editingUser.id}` : '/admin/usuarios';
        const payload: Record<string, string | number | boolean> = { ...form };
        router[editingUser ? 'put' : 'post'](url, payload, {
            preserveScroll: true,
            onSuccess: () => {
                closeDialog();
                notify.success(editingUser ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente.');
            },
            onError: (errors) => {
                const first = Object.values(errors)[0];
                notify.error(typeof first === 'string' ? first : 'No se pudo guardar el usuario.');
            },
        });
    };

    const deleteUser = async (user: UserItem) => {
        const confirmed = await confirmDeleteAlert({
            title: '¿Eliminar usuario?',
            text: `Se eliminará permanentemente la cuenta de "${user.name}".`,
        });
        if (confirmed) {
            router.delete(`/admin/usuarios/${user.id}`, {
                preserveScroll: true,
                onSuccess: () => notify.success('Usuario eliminado correctamente.'),
                onError: (errors) => {
                    const first = Object.values(errors)[0];
                    notify.error(typeof first === 'string' ? first : 'No se pudo eliminar el usuario.');
                },
            });
        }
    };

    const toggleEnabled = (user: UserItem) => {
        router.patch(`/admin/usuarios/${user.id}/toggle-enabled`, {}, {
            preserveScroll: true,
            onSuccess: () => notify.success(user.is_enabled ? 'Usuario deshabilitado.' : 'Usuario habilitado.'),
            onError: (errors) => {
                const first = Object.values(errors)[0];
                notify.error(typeof first === 'string' ? first : 'No se pudo cambiar el estado del usuario.');
            },
        });
    };

    return (
        <>
            <Head title="Gestión de Usuarios - Grupo Capsur" />
            <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 2.5, width: '100%', boxSizing: 'border-box' }}>
                <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8 }}>
                            <Avatar sx={{ bgcolor: 'primary.main', color: '#fff', width: 42, height: 42, borderRadius: 1 }}>
                                <GroupIcon fontSize="small" />
                            </Avatar>
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 800 }}>Gestión de Usuarios</Typography>
                                    <Chip label={`${users.length} USUARIOS`} size="small" sx={{ color: 'primary.main', fontWeight: 800, fontSize: '0.68rem', height: 20 }} />
                                </Box>
                                <Typography variant="body2" color="text.secondary">Administra cuentas, roles y accesos del sistema.</Typography>
                            </Box>
                        </Box>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Nuevo usuario</Button>
                    </Box>
                </Paper>

                <Paper elevation={0} sx={{ p: 2, borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 1.5, alignItems: { md: 'center' } }}>
                        <TextField
                            size="small"
                            fullWidth
                            placeholder="Buscar por nombre o correo..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            onKeyDown={(event) => { if (event.key === 'Enter') applyFilters(); }}
                            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> } }}
                        />
                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <InputLabel>Rol</InputLabel>
                            <Select label="Rol" value={roleFilter} onChange={(event) => { setRoleFilter(event.target.value); applyFilters(search, event.target.value); }}>
                                <MenuItem value="all">Todos los roles</MenuItem>
                                {roles.map((role) => <MenuItem key={role.id} value={role.slug}>{role.nombre}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <Button variant="outlined" onClick={() => applyFilters()}>Buscar</Button>
                    </Box>
                </Paper>

                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 1.5, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 800 }}>USUARIO</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>CORREO</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>ROL</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>HABILITADO</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 800 }}>ACCIONES</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.length === 0 ? (
                                <TableRow><TableCell colSpan={5} align="center">No se encontraron usuarios.</TableCell></TableRow>
                            ) : users.map((user) => (
                                <TableRow key={user.id} hover>
                                    <TableCell>
                                        <Typography sx={{ fontWeight: 700 }}>{user.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">ID: {user.id}</Typography>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Chip size="small" label={user.rol?.nombre || 'Sin rol'} color={user.rol?.slug === 'admin' ? 'primary' : 'default'} />
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                            <Switch
                                                checked={user.is_enabled}
                                                onChange={() => toggleEnabled(user)}
                                                color="success"
                                                slotProps={{ input: { 'aria-label': `${user.is_enabled ? 'Deshabilitar' : 'Habilitar'} a ${user.name}` } }}
                                            />
                                            <Typography variant="caption" color={user.is_enabled ? 'success.main' : 'text.secondary'} sx={{ fontWeight: 700 }}>
                                                {user.is_enabled ? 'Habilitado' : 'Deshabilitado'}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                                            <Tooltip title="Editar"><IconButton onClick={() => openEdit(user)}><EditIcon /></IconButton></Tooltip>
                                            <Tooltip title="Eliminar"><IconButton color="error" onClick={() => deleteUser(user)}><DeleteIcon /></IconButton></Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
                <DialogTitle>{editingUser ? 'Editar usuario' : 'Crear usuario'}</DialogTitle>
                <Box component="form" onSubmit={submit}>
                    <DialogContent dividers>
                        <Stack spacing={2}>
                            <TextField required fullWidth label="Nombre completo" value={form.name} onChange={(event) => updateForm('name', event.target.value)} />
                            <TextField required fullWidth type="email" label="Correo electrónico" value={form.email} onChange={(event) => updateForm('email', event.target.value)} />
                            <FormControl fullWidth required>
                                <InputLabel>Rol</InputLabel>
                                <Select label="Rol" value={form.rol_id} onChange={(event) => updateForm('rol_id', Number(event.target.value))}>
                                    {roles.map((role) => <MenuItem key={role.id} value={role.id}>{role.nombre}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <TextField required={!editingUser} fullWidth type="password" label={editingUser ? 'Nueva contraseña (opcional)' : 'Contraseña'} value={form.password} onChange={(event) => updateForm('password', event.target.value)} helperText="Mínimo 8 caracteres." />
                            <TextField required={!editingUser} fullWidth type="password" label="Confirmar contraseña" value={form.password_confirmation} onChange={(event) => updateForm('password_confirmation', event.target.value)} />
                            <Button variant={form.email_verified ? 'contained' : 'outlined'} onClick={() => updateForm('email_verified', !form.email_verified)}>
                                {form.email_verified ? 'Correo verificado' : 'Marcar correo como verificado'}
                            </Button>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeDialog}>Cancelar</Button>
                        <Button type="submit" variant="contained" startIcon={editingUser ? <EditIcon /> : <AddIcon />}>{editingUser ? 'Guardar cambios' : 'Crear usuario'}</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    );
}
