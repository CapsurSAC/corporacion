import { Head, usePage, router, Link } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import DomainIcon from '@mui/icons-material/Domain';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import LaunchIcon from '@mui/icons-material/Launch';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import {
    Avatar,
    Box,
    Button,
    Chip,
    IconButton,
    InputAdornment,
    Paper,
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
import { useState, useMemo } from 'react';
import { GrupoDialog } from '@/components/admin/grupo-dialog';
import { useNotification } from '@/hooks/use-notification';
import { confirmDeleteAlert } from '@/lib/swal';
import { dashboard } from '@/routes';
import type { Grupo } from '@/types';

interface Props {
    grupos: Grupo[];
}

// Colores institucionales predeterminados para la identidad visual de cada grupo
const getGrupoColor = (slug: string): string => {
    switch (slug) {
        case 'escifor':
            return '#0c43a3';
        case 'multimarca':
            return '#059669';
        case 'globalex':
            return '#0284c7';
        default:
            return '#4f46e5';
    }
};

export default function GruposIndex({ grupos = [] }: Props) {
    const page = usePage();
    
    
    const { notify } = useNotification();

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedGrupo, setSelectedGrupo] = useState<Grupo | null>(null);

    // Filtrado inteligente
    const filteredGrupos = useMemo(() => {
        return grupos.filter((g) => {
            const matchesSearch =
                g.nombre.toLowerCase().includes(search.toLowerCase()) ||
                g.slug.toLowerCase().includes(search.toLowerCase()) ||
                (g.descripcion && g.descripcion.toLowerCase().includes(search.toLowerCase())) ||
                (g.comercios && g.comercios.some((c) => c.nombre.toLowerCase().includes(search.toLowerCase())));

            const matchesStatus =
                statusFilter === 'all' ? true : statusFilter === 'active' ? g.activo : !g.activo;

            return matchesSearch && matchesStatus;
        });
    }, [grupos, search, statusFilter]);

    // Totales
    const totalGrupos = grupos.length;
    const gruposActivos = grupos.filter((g) => g.activo).length;

    const handleCreate = () => {
        setSelectedGrupo(null);
        setDialogOpen(true);
    };

    const handleEdit = (grupo: Grupo) => {
        setSelectedGrupo(grupo);
        setDialogOpen(true);
    };

    const handleDeletePrompt = async (grupo: Grupo) => {
        const confirmed = await confirmDeleteAlert({
            title: `¿Eliminar grupo "${grupo.nombre}"?`,
            text: 'Esta acción eliminará permanentemente el grupo comercial y todos los comercios y programas asociados a él.',
            confirmButtonText: 'Sí, eliminar grupo',
        });

        if (confirmed) {
            router.delete(`/admin/grupos/${grupo.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    notify.success(`El grupo comercial "${grupo.nombre}" ha sido eliminado exitosamente.`);
                },
                onError: () => {
                    notify.error('No se pudo eliminar el grupo comercial.');
                },
            });
        }
    };

    return (
        <>
            <Head title="Grupos Comerciales - Grupo Capsur" />

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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8 }}>
                            <Avatar
                                sx={{
                                    bgcolor: 'primary.main',
                                    color: '#ffffff',
                                    width: 42,
                                    height: 42,
                                    borderRadius: 1,
                                    boxShadow: '0 2px 8px rgba(12, 67, 163, 0.25)',
                                }}
                            >
                                <DomainIcon fontSize="small" />
                            </Avatar>
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 800,
                                            color: 'text.primary',
                                            letterSpacing: '-0.02em',
                                        }}
                                    >
                                        Grupos Comerciales
                                    </Typography>
                                    <Chip
                                        label={`${totalGrupos} GRUPOS`}
                                        size="small"
                                        sx={{
                                            bgcolor: (theme) =>
                                                theme.palette.mode === 'dark'
                                                    ? 'rgba(12, 67, 163, 0.25)'
                                                    : 'rgba(12, 67, 163, 0.08)',
                                            color: 'primary.main',
                                            fontWeight: 800,
                                            fontSize: '0.68rem',
                                            height: 20,
                                            borderRadius: 1,
                                            border: '1px solid',
                                            borderColor: (theme) =>
                                                theme.palette.mode === 'dark'
                                                    ? 'rgba(12, 67, 163, 0.4)'
                                                    : 'rgba(12, 67, 163, 0.2)',
                                        }}
                                    />
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.2, fontSize: '0.82rem' }}>
                                    Administración y control centralizado de los grupos corporativos y sus marcas formativas.
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
                                py: 0.8,
                                borderRadius: 1,
                                boxShadow: '0 2px 8px rgba(12, 67, 163, 0.25)',
                                alignSelf: { xs: 'stretch', sm: 'auto' },
                            }}
                        >
                            Nuevo Grupo
                        </Button>
                    </Box>
                </Paper>

                {/* BARRA DE HERRAMIENTAS CRUD */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 1.8,
                        borderRadius: 1.5,
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'stretch', sm: 'center' },
                        justifyContent: 'space-between',
                        gap: 2,
                        width: '100%',
                        boxSizing: 'border-box',
                    }}
                >
                    <Box sx={{ flex: 1, maxWidth: { xs: '100%', sm: 420 } }}>
                        <TextField
                            placeholder="Buscar por nombre, código o comercio..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            fullWidth
                            size="small"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: search ? (
                                        <InputAdornment position="end">
                                            <IconButton size="small" onClick={() => setSearch('')}>
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    ) : null,
                                },
                            }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mr: 0.5, display: { xs: 'none', md: 'inline' } }}>
                            ESTADO:
                        </Typography>
                        <Chip
                            label={`Todos (${totalGrupos})`}
                            clickable
                            size="small"
                            variant={statusFilter === 'all' ? 'filled' : 'outlined'}
                            color={statusFilter === 'all' ? 'primary' : 'default'}
                            onClick={() => setStatusFilter('all')}
                            sx={{ fontWeight: 700, borderRadius: 1 }}
                        />
                        <Chip
                            icon={<CheckCircleIcon sx={{ fontSize: '13px !important' }} />}
                            label={`Activos (${gruposActivos})`}
                            clickable
                            size="small"
                            variant={statusFilter === 'active' ? 'filled' : 'outlined'}
                            color={statusFilter === 'active' ? 'success' : 'default'}
                            onClick={() => setStatusFilter('active')}
                            sx={{ fontWeight: 700, borderRadius: 1 }}
                        />
                        <Chip
                            icon={<HighlightOffIcon sx={{ fontSize: '13px !important' }} />}
                            label={`Inactivos (${totalGrupos - gruposActivos})`}
                            clickable
                            size="small"
                            variant={statusFilter === 'inactive' ? 'filled' : 'outlined'}
                            color={statusFilter === 'inactive' ? 'default' : 'default'}
                            onClick={() => setStatusFilter('inactive')}
                            sx={{ fontWeight: 700, borderRadius: 1 }}
                        />
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
                                    GRUPO COMERCIAL / DIVISIÓN
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', width: 140 }}>
                                    IDENTIFICADOR (SLUG)
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', minWidth: 280 }}>
                                    COMERCIOS VINCULADOS
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', width: 130, textAlign: 'center' }}>
                                    PROGRAMAS
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', width: 120, textAlign: 'center' }}>
                                    ESTADO
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', width: 150, textAlign: 'right' }}>
                                    ACCIONES
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredGrupos.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 5 }}>
                                        <DomainIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1.2 }} />
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                            No se encontraron grupos comerciales
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.8 }}>
                                            {search
                                                ? `No hay resultados para "${search}".`
                                                : 'Aún no se han registrado grupos comerciales.'}
                                        </Typography>
                                        {search ? (
                                            <Button variant="outlined" size="small" startIcon={<ClearIcon />} onClick={() => setSearch('')} sx={{ borderRadius: 1 }}>
                                                Limpiar búsqueda
                                            </Button>
                                        ) : (
                                            <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={handleCreate} sx={{ borderRadius: 1 }}>
                                                Crear Grupo
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredGrupos.map((grupo) => {
                                    const brandColor = getGrupoColor(grupo.slug);
                                    const comercios = grupo.comercios || [];

                                    return (
                                        <TableRow
                                            key={grupo.id}
                                            hover
                                            sx={{
                                                transition: 'background-color 0.15s ease',
                                                '&:hover': { bgcolor: 'action.hover' },
                                            }}
                                        >
                                            {/* Columna 1: Grupo */}
                                            <TableCell sx={{ py: 1.8 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8 }}>
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: brandColor,
                                                            color: '#ffffff',
                                                            fontWeight: 900,
                                                            fontSize: '0.85rem',
                                                            width: 38,
                                                            height: 38,
                                                            borderRadius: 1,
                                                            boxShadow: `0 2px 6px ${brandColor}25`,
                                                        }}
                                                    >
                                                        {grupo.nombre.substring(0, 2).toUpperCase()}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '0.92rem' }}>
                                                            {grupo.nombre}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            sx={{
                                                                display: 'block',
                                                                mt: 0.1,
                                                                maxWidth: 320,
                                                                lineHeight: 1.35,
                                                                fontStyle: grupo.descripcion ? 'normal' : 'italic',
                                                            }}
                                                        >
                                                            {grupo.descripcion || 'Sin descripción corporativa.'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>

                                            {/* Columna 2: Slug */}
                                            <TableCell>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        fontFamily: 'monospace',
                                                        bgcolor: 'action.hover',
                                                        px: 1,
                                                        py: 0.3,
                                                        borderRadius: 0.8,
                                                        fontWeight: 700,
                                                        fontSize: '0.74rem',
                                                        color: 'text.primary',
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                    }}
                                                >
                                                    {grupo.slug}
                                                </Typography>
                                            </TableCell>

                                            {/* Columna 3: Comercios */}
                                            <TableCell>
                                                {comercios.length > 0 ? (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, alignItems: 'center' }}>
                                                        {comercios.map((com) => {
                                                            const comColor = com.color_hex || brandColor;
                                                            return (
                                                                <Link
                                                                    key={com.id}
                                                                    href={`/admin/comercios/${com.id}/edit`}
                                                                    style={{ textDecoration: 'none' }}
                                                                >
                                                                    <Chip
                                                                        label={com.sigla || com.nombre}
                                                                        size="small"
                                                                        sx={{
                                                                            bgcolor: `${comColor}18`,
                                                                            color: comColor,
                                                                            border: `1px solid ${comColor}35`,
                                                                            fontWeight: 700,
                                                                            fontSize: '0.72rem',
                                                                            height: 22,
                                                                            borderRadius: 0.8,
                                                                            cursor: 'pointer',
                                                                            transition: 'all 0.15s ease',
                                                                            '&:hover': {
                                                                                bgcolor: comColor,
                                                                                color: '#ffffff',
                                                                            },
                                                                        }}
                                                                    />
                                                                </Link>
                                                            );
                                                        })}
                                                    </Box>
                                                ) : (
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                        0 comercios asignados
                                                    </Typography>
                                                )}
                                            </TableCell>

                                            {/* Columna 4: Programas */}
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                <Chip
                                                    icon={<SchoolIcon sx={{ fontSize: '13px !important' }} />}
                                                    label={`${grupo.carreras_count || 0} programas`}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ fontWeight: 700, fontSize: '0.72rem', height: 22, borderRadius: 0.8 }}
                                                />
                                            </TableCell>

                                            {/* Columna 5: Estado */}
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                {grupo.activo ? (
                                                    <Chip
                                                        icon={<CheckCircleIcon sx={{ fontSize: '12px !important' }} />}
                                                        label="Activo"
                                                        color="success"
                                                        size="small"
                                                        sx={{ fontWeight: 800, fontSize: '0.7rem', height: 20, borderRadius: 0.8 }}
                                                    />
                                                ) : (
                                                    <Chip
                                                        icon={<HighlightOffIcon sx={{ fontSize: '12px !important' }} />}
                                                        label="Inactivo"
                                                        size="small"
                                                        sx={{ fontWeight: 800, fontSize: '0.7rem', height: 20, borderRadius: 0.8 }}
                                                    />
                                                )}
                                            </TableCell>

                                            {/* Columna 6: Acciones */}
                                            <TableCell sx={{ textAlign: 'right' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.8 }}>
                                                    <Link
                                                        href={`/admin/comercios?grupo_id=${grupo.id}`}
                                                        style={{ textDecoration: 'none' }}
                                                    >
                                                        <Tooltip title="Ver comercios del grupo" arrow>
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                sx={{
                                                                    border: '1px solid',
                                                                    borderColor: 'divider',
                                                                    borderRadius: 1,
                                                                    '&:hover': { bgcolor: 'action.hover' },
                                                                }}
                                                            >
                                                                <LaunchIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Link>

                                                    <Tooltip title="Editar grupo" arrow>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleEdit(grupo)}
                                                            sx={{
                                                                border: '1px solid',
                                                                borderColor: 'divider',
                                                                borderRadius: 1,
                                                                '&:hover': { bgcolor: 'action.hover' },
                                                            }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Eliminar grupo" arrow>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDeletePrompt(grupo)}
                                                            sx={{
                                                                border: '1px solid',
                                                                borderColor: 'divider',
                                                                borderRadius: 1,
                                                                '&:hover': { bgcolor: 'error.lighter' },
                                                            }}
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
                            Mostrando <strong>{filteredGrupos.length}</strong> de <strong>{totalGrupos}</strong> grupos comerciales
                        </Typography>
                    </Box>
                </TableContainer>
            </Box>

            {/* MODALES Y DIÁLOGOS CRUD */}
            <GrupoDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                grupo={selectedGrupo}
                
            />
        </>
    );
}

GruposIndex.layout = () => ({
    breadcrumbs: [
        {
            title: 'Panel Principal',
            href: '/dashboard',
        },
        {
            title: 'Grupos Comerciales',
            href: '/admin/grupos',
        },
    ],
});
