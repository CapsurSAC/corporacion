import { Head, router } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SearchIcon from '@mui/icons-material/Search';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import SchoolIcon from '@mui/icons-material/School';
import {
    Box,
    Button,
    Chip,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
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
import { useState } from 'react';
import { EstadoDialog } from '@/components/admin/estado-dialog';
import { useNotification } from '@/hooks/use-notification';
import { confirmDeleteAlert } from '@/lib/swal';
import type { Estado } from '@/types';

interface EstadosIndexProps {
    estados: Estado[];
    filters: {
        search?: string | null;
        activo?: string | null;
    };
}

export default function EstadosIndex({
    estados = [],
    filters = {},
}: EstadosIndexProps) {
    const { notify } = useNotification();

    const [search, setSearch] = useState(filters.search || '');
    const [selectedActivo, setSelectedActivo] = useState(filters.activo || 'all');

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedEstado, setSelectedEstado] = useState<Estado | null>(null);

    const applyFilters = (newFilters: {
        search?: string;
        activo?: string;
    }) => {
        const query: Record<string, string> = {};

        const s = newFilters.search !== undefined ? newFilters.search : search;
        if (s.trim()) query.search = s.trim();

        const a = newFilters.activo !== undefined ? newFilters.activo : selectedActivo;
        if (a && a !== 'all') query.activo = a;

        router.get(`/admin/estados`, query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search });
    };

    const handleClearSearch = () => {
        setSearch('');
        applyFilters({ search: '' });
    };

    const handleCreate = () => {
        setSelectedEstado(null);
        setDialogOpen(true);
    };

    const handleEdit = (estado: Estado) => {
        setSelectedEstado(estado);
        setDialogOpen(true);
    };

    const handleDelete = async (estado: Estado) => {
        const confirmed = await confirmDeleteAlert({
            title: '¿Eliminar Estado?',
            text: `¿Estás seguro de eliminar permanentemente el estado "${estado.nombre}"? Esta acción no se puede deshacer.`,
        });

        if (confirmed) {
            router.delete(`/admin/estados/${estado.id}`, {
                preserveScroll: true,
                onSuccess: (page) => {
                    const pageAny = page as any;
                    const flash = pageAny?.props?.flash || pageAny?.flash;
                    const isError =
                        flash?.toast?.type === 'error' ||
                        Boolean(flash?.error);

                    if (isError) {
                        const errorMsg = flash?.toast?.message || flash?.error;
                        if (errorMsg) {
                            notify.error(errorMsg);
                        }
                    }
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    notify.error(typeof firstError === 'string' ? firstError : 'No se pudo eliminar el estado.');
                },
            });
        }
    };

    return (
        <>
            <Head title="Gestión de Estados - Grupo Capsur" />

            <Box
                sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2.5,
                    width: '100%',
                    boxSizing: 'border-box',
                }}
            >
                {/* CABECERA PRINCIPAL */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, sm: 2.5 },
                        borderRadius: 1.5,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: (theme) =>
                            theme.palette.mode === 'dark'
                                ? '0 2px 10px rgba(0,0,0,0.3)'
                                : '0 2px 10px rgba(0,0,0,0.03)',
                        width: '100%',
                        boxSizing: 'border-box',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            justifyContent: 'space-between',
                            gap: 2,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                                sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 1.2,
                                    bgcolor: (theme) =>
                                        theme.palette.mode === 'dark'
                                            ? 'rgba(22, 163, 74, 0.2)'
                                            : 'rgba(22, 163, 74, 0.1)',
                                    color: '#16a34a',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid',
                                    borderColor: (theme) =>
                                        theme.palette.mode === 'dark'
                                            ? 'rgba(22, 163, 74, 0.4)'
                                            : 'rgba(22, 163, 74, 0.2)',
                                    flexShrink: 0,
                                }}
                            >
                                <CheckCircleIcon fontSize="medium" />
                            </Box>
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                                        Gestión de Estados
                                    </Typography>
                                    <Chip
                                        label={`${estados.length} ESTADOS`}
                                        size="small"
                                        sx={{
                                            height: 20,
                                            fontSize: '0.68rem',
                                            fontWeight: 800,
                                            bgcolor: (theme) =>
                                                theme.palette.mode === 'dark'
                                                    ? 'rgba(22, 163, 74, 0.2)'
                                                    : 'rgba(22, 163, 74, 0.1)',
                                            color: '#16a34a',
                                            border: '1px solid',
                                            borderColor: (theme) =>
                                                theme.palette.mode === 'dark'
                                                    ? 'rgba(22, 163, 74, 0.4)'
                                                    : 'rgba(22, 163, 74, 0.2)',
                                        }}
                                    />
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.2, fontSize: '0.82rem' }}>
                                    Administra los estados informativos y de ciclo de vida (ej. Nuevo, Vendido, No actualizado) para los programas académicos.
                                </Typography>
                            </Box>
                        </Box>

                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleCreate}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 700,
                                px: 2.5,
                                borderRadius: 1.2,
                                whiteSpace: 'nowrap',
                                alignSelf: { xs: 'stretch', sm: 'center' },
                            }}
                        >
                            Nuevo Estado
                        </Button>
                    </Box>
                </Paper>

                {/* FILTROS Y BÚSQUEDA */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        borderRadius: 1.5,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        width: '100%',
                        boxSizing: 'border-box',
                    }}
                >
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: '1fr auto',
                            },
                            gap: 1.5,
                            alignItems: 'center',
                        }}
                    >
                        {/* Buscador */}
                        <form onSubmit={handleSearchSubmit} style={{ width: '100%' }}>
                            <TextField
                                size="small"
                                fullWidth
                                placeholder="Buscar estado por nombre o descripción..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon fontSize="small" color="action" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: search ? (
                                            <InputAdornment position="end">
                                                <IconButton size="small" onClick={handleClearSearch} edge="end">
                                                    <ClearIcon fontSize="small" />
                                                </IconButton>
                                            </InputAdornment>
                                        ) : null,
                                    },
                                }}
                            />
                        </form>

                        {/* Filtro Activo */}
                        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 160 } }}>
                            <InputLabel id="filtro-activo-label">Estado</InputLabel>
                            <Select
                                labelId="filtro-activo-label"
                                label="Estado"
                                value={selectedActivo}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSelectedActivo(val);
                                    applyFilters({ activo: val });
                                }}
                            >
                                <MenuItem value="all">Todos</MenuItem>
                                <MenuItem value="true">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CheckCircleIcon sx={{ fontSize: '1rem', color: 'success.main' }} />
                                        <Typography variant="body2">Activos</Typography>
                                    </Box>
                                </MenuItem>
                                <MenuItem value="false">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <BlockIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                                        <Typography variant="body2">Inactivos</Typography>
                                    </Box>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Paper>

                {/* TABLA CRUD */}
                <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                        borderRadius: 1.5,
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        overflow: 'hidden',
                        width: '100%',
                        boxSizing: 'border-box',
                    }}
                >
                    <Table>
                        <TableHead
                            sx={{
                                bgcolor: (theme) =>
                                    theme.palette.mode === 'dark'
                                        ? 'rgba(255, 255, 255, 0.04)'
                                        : '#f8fafc',
                                borderBottom: '2px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <TableRow>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', minWidth: 220, py: 1.5 }}>
                                    ESTADO / DISTINTIVO
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', minWidth: 200 }}>
                                    DESCRIPCIÓN
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', minWidth: 180 }}>
                                    PROGRAMAS VINCULADOS
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', width: 100, textAlign: 'center' }}>
                                    ESTADO
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', width: 80, textAlign: 'center' }}>
                                    ORDEN
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', width: 120, textAlign: 'right' }}>
                                    ACCIONES
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {estados.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 5 }}>
                                        <CheckCircleIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1.2 }} />
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                            No se encontraron estados registrados
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.8 }}>
                                            {search || selectedActivo !== 'all'
                                                ? 'No hay registros que coincidan con los filtros aplicados.'
                                                : 'Aún no se han configurado estados.'}
                                        </Typography>
                                        {search || selectedActivo !== 'all' ? (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<ClearIcon />}
                                                onClick={() => {
                                                    setSearch('');
                                                    setSelectedActivo('all');
                                                    applyFilters({ activo: 'all', search: '' });
                                                }}
                                                sx={{ borderRadius: 1 }}
                                            >
                                                Limpiar filtros
                                            </Button>
                                        ) : (
                                            <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={handleCreate} sx={{ borderRadius: 1 }}>
                                                Crear Estado
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                estados.map((estado) => {
                                    const color = estado.color_hex || '#16a34a';

                                    return (
                                        <TableRow
                                            key={estado.id}
                                            hover
                                            sx={{
                                                transition: 'background-color 0.15s ease',
                                                '&:hover': { bgcolor: 'action.hover' },
                                            }}
                                        >
                                            {/* Estado / Distintivo */}
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Box
                                                        sx={{
                                                            width: 14,
                                                            height: 14,
                                                            borderRadius: '50%',
                                                            bgcolor: color,
                                                            flexShrink: 0,
                                                            boxShadow: `0 0 6px ${color}80`,
                                                        }}
                                                    />
                                                    <Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                                {estado.nombre}
                                                            </Typography>
                                                            <Chip
                                                                label={estado.nombre}
                                                                size="small"
                                                                sx={{
                                                                    height: 20,
                                                                    fontSize: '0.72rem',
                                                                    fontWeight: 700,
                                                                    bgcolor: `${color}18`,
                                                                    color: color,
                                                                    border: `1px solid ${color}40`,
                                                                }}
                                                            />
                                                        </Box>
                                                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                                                            {color}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>

                                            {/* Descripción */}
                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        maxWidth: 260,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {estado.descripcion || '—'}
                                                </Typography>
                                            </TableCell>

                                            {/* Programas Vinculados */}
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                    <Tooltip title={`${estado.especialidades_count ?? 0} Especialidades`}>
                                                        <Chip
                                                            icon={<SchoolIcon sx={{ fontSize: '0.9rem !important' }} />}
                                                            label={estado.especialidades_count ?? 0}
                                                            size="small"
                                                            sx={{
                                                                height: 22,
                                                                fontSize: '0.72rem',
                                                                fontWeight: 600,
                                                                bgcolor: (theme) =>
                                                                    theme.palette.mode === 'dark'
                                                                        ? 'rgba(255, 255, 255, 0.05)'
                                                                        : 'rgba(0, 0, 0, 0.04)',
                                                            }}
                                                        />
                                                    </Tooltip>
                                                    <Tooltip title={`${estado.diplomados_count ?? 0} Diplomados`}>
                                                        <Chip
                                                            icon={<WorkspacePremiumIcon sx={{ fontSize: '0.9rem !important' }} />}
                                                            label={estado.diplomados_count ?? 0}
                                                            size="small"
                                                            sx={{
                                                                height: 22,
                                                                fontSize: '0.72rem',
                                                                fontWeight: 600,
                                                                bgcolor: (theme) =>
                                                                    theme.palette.mode === 'dark'
                                                                        ? 'rgba(255, 255, 255, 0.05)'
                                                                        : 'rgba(0, 0, 0, 0.04)',
                                                            }}
                                                        />
                                                    </Tooltip>
                                                    <Tooltip title={`${estado.cursos_count ?? 0} Cursos`}>
                                                        <Chip
                                                            icon={<MenuBookIcon sx={{ fontSize: '0.9rem !important' }} />}
                                                            label={estado.cursos_count ?? 0}
                                                            size="small"
                                                            sx={{
                                                                height: 22,
                                                                fontSize: '0.72rem',
                                                                fontWeight: 600,
                                                                bgcolor: (theme) =>
                                                                    theme.palette.mode === 'dark'
                                                                        ? 'rgba(255, 255, 255, 0.05)'
                                                                        : 'rgba(0, 0, 0, 0.04)',
                                                            }}
                                                        />
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>

                                            {/* Estado Activo */}
                                            <TableCell align="center">
                                                {estado.activo ? (
                                                    <Chip
                                                        icon={<CheckCircleIcon sx={{ fontSize: '0.85rem !important' }} />}
                                                        label="Activo"
                                                        size="small"
                                                        color="success"
                                                        variant="outlined"
                                                        sx={{ height: 22, fontSize: '0.72rem', fontWeight: 700 }}
                                                    />
                                                ) : (
                                                    <Chip
                                                        icon={<BlockIcon sx={{ fontSize: '0.85rem !important' }} />}
                                                        label="Inactivo"
                                                        size="small"
                                                        color="default"
                                                        variant="outlined"
                                                        sx={{ height: 22, fontSize: '0.72rem', fontWeight: 600 }}
                                                    />
                                                )}
                                            </TableCell>

                                            {/* Orden */}
                                            <TableCell align="center">
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {estado.orden}
                                                </Typography>
                                            </TableCell>

                                            {/* Acciones */}
                                            <TableCell align="right">
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                                                    <Tooltip title="Editar Estado">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleEdit(estado)}
                                                            sx={{ color: 'primary.main' }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Eliminar Estado">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDelete(estado)}
                                                            sx={{ color: 'error.main' }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>

                    {/* Footer de la Tabla */}
                    <Box
                        sx={{
                            p: 1.8,
                            px: 2.5,
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            bgcolor: (theme) =>
                                theme.palette.mode === 'dark'
                                    ? 'rgba(255, 255, 255, 0.02)'
                                    : '#f8fafc',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            Mostrando <strong>{estados.length}</strong> estados configurados
                        </Typography>
                    </Box>
                </TableContainer>
            </Box>

            {/* DIÁLOGO MODAL CREAR / EDITAR */}
            <EstadoDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                estado={selectedEstado}
            />
        </>
    );
}

EstadosIndex.layout = () => ({
    breadcrumbs: [
        {
            title: 'Panel Principal',
            href: '/dashboard',
        },
        {
            title: 'Estados',
            href: '/admin/estados',
        },
    ],
});
