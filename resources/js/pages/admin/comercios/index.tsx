import { Head, usePage, router, Link } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import DomainIcon from '@mui/icons-material/Domain';
import EditIcon from '@mui/icons-material/Edit';
import LanguageIcon from '@mui/icons-material/Language';
import LaunchIcon from '@mui/icons-material/Launch';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import StorefrontIcon from '@mui/icons-material/Storefront';
import TableChartIcon from '@mui/icons-material/TableChart';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {
    Avatar,
    Box,
    Button,
    Chip,
    FormControl,
    Grid,
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
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { CarreraDialog } from '@/components/admin/carrera-dialog';
import { ComercioDialog } from '@/components/admin/comercio-dialog';
import { useNotification } from '@/hooks/use-notification';
import { confirmDeleteAlert, showSuccessToast } from '@/lib/swal';
import { dashboard } from '@/routes';
import type { Comercio, Grupo } from '@/types';

const ensureHttp = (url?: string | null): string => {
    if (!url) return '';
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    return `https://${trimmed}`;
};

interface Props {
    comercios: Comercio[];
    grupos: Grupo[];
    filters: {
        grupo_id?: string;
        search?: string;
    };
}

export default function ComerciosIndex({ comercios = [], grupos = [], filters = {} }: Props) {
    const page = usePage();
    
    
    const { notify } = useNotification();

    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [selectedGrupoFilter, setSelectedGrupoFilter] = useState<string>(
        filters.grupo_id || 'all'
    );
    const [search, setSearch] = useState<string>(filters.search || '');

    // Dialog state for Comercio Create/Edit
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedComercio, setSelectedComercio] = useState<Comercio | null>(null);

    // Dialog state for Quick Add Carrera
    const [carreraDialogOpen, setCarreraDialogOpen] = useState(false);
    const [quickComercioId, setQuickComercioId] = useState<number | null>(null);



    const handleFilterChange = (grupoId: string) => {
        setSelectedGrupoFilter(grupoId);
        router.get(
            `/admin/comercios`,
            {
                grupo_id: grupoId === 'all' ? undefined : grupoId,
                search: search || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            `/admin/comercios`,
            {
                grupo_id: selectedGrupoFilter === 'all' ? undefined : selectedGrupoFilter,
                search: search || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleClearSearch = () => {
        setSearch('');
        router.get(
            `/admin/comercios`,
            {
                grupo_id: selectedGrupoFilter === 'all' ? undefined : selectedGrupoFilter,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleCreate = () => {
        setSelectedComercio(null);
        setDialogOpen(true);
    };

    const handleEdit = (comercio: Comercio) => {
        setSelectedComercio(comercio);
        setDialogOpen(true);
    };

    const handleDeletePrompt = async (comercio: Comercio) => {
        const confirmed = await confirmDeleteAlert({
            title: `¿Eliminar comercio "${comercio.nombre}"?`,
            text: 'Esta acción eliminará permanentemente el comercio y todos sus programas vinculados.',
            confirmButtonText: 'Sí, eliminar comercio',
        });

        if (confirmed) {
            router.delete(`/admin/comercios/${comercio.id}`, {
                preserveScroll: true,
                onError: () => {
                    notify.error('No se pudo eliminar el comercio.');
                },
            });
        }
    };

    return (
        <>
            <Head title="Comercios" />

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
                {/* CABECERA PRINCIPAL UNIFICADA */}
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
                                <StorefrontIcon fontSize="small" />
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
                                        Comercios
                                    </Typography>
                                    <Chip
                                        label={`${comercios.length} MARCAS`}
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
                                    Gestión centralizada de marcas comerciales, institutos, acreditaciones MINEDU y plataformas.
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
                            <ToggleButtonGroup
                                value={viewMode}
                                exclusive
                                onChange={(_, val) => val && setViewMode(val)}
                                size="small"
                                sx={{ bgcolor: 'background.paper' }}
                            >
                                <ToggleButton value="table" sx={{ px: 1.5, py: 0.5, fontWeight: 700, fontSize: '0.76rem', borderRadius: '4px 0 0 4px !important' }}>
                                    <TableChartIcon fontSize="small" sx={{ mr: 0.6 }} />
                                    Tabla
                                </ToggleButton>
                                <ToggleButton value="grid" sx={{ px: 1.5, py: 0.5, fontWeight: 700, fontSize: '0.76rem', borderRadius: '0 4px 4px 0 !important' }}>
                                    <ViewModuleIcon fontSize="small" sx={{ mr: 0.6 }} />
                                    Tarjetas
                                </ToggleButton>
                            </ToggleButtonGroup>

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
                                }}
                            >
                                Nuevo Comercio
                            </Button>
                        </Box>
                    </Box>
                </Paper>

                {/* BARRA DE HERRAMIENTAS */}
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
                    <Box component="form" onSubmit={handleSearchSubmit} sx={{ flex: 1, maxWidth: { xs: '100%', sm: 420 } }}>
                        <TextField
                            placeholder="Buscar por nombre, código, sigla o resolución..."
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
                                            <IconButton size="small" onClick={handleClearSearch}>
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    ) : null,
                                },
                            }}
                        />
                    </Box>

                    <FormControl size="small" sx={{ minWidth: 220 }}>
                        <InputLabel id="filtro-grupo-label">Filtrar por Grupo</InputLabel>
                        <Select
                            labelId="filtro-grupo-label"
                            value={selectedGrupoFilter}
                            label="Filtrar por Grupo"
                            onChange={(e) => handleFilterChange(e.target.value)}
                        >
                            <MenuItem value="all">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <DomainIcon sx={{ fontSize: '1.1rem', color: 'text.secondary' }} />
                                    <Typography variant="body2">Todos los grupos</Typography>
                                </Box>
                            </MenuItem>
                            {grupos.map((g) => (
                                <MenuItem key={g.id} value={String(g.id)}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <DomainIcon sx={{ fontSize: '1rem', color: 'primary.main' }} />
                                        <Typography variant="body2">{g.nombre}</Typography>
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Paper>

                {/* VISTA DE TABLA CRUD */}
                {viewMode === 'table' && (
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
                                        COMERCIO / INSTITUTO
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', width: 110, textAlign: 'center' }}>
                                        SIGLA
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', minWidth: 180 }}>
                                        ACREDITACIÓN & PLATAFORMA
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', minWidth: 200 }}>
                                        OFERTA FORMATIVA
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', width: 150, textAlign: 'right' }}>
                                        ACCIONES
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {comercios.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} sx={{ textAlign: 'center', py: 5 }}>
                                            <StorefrontIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1.2 }} />
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                                No se encontraron comercios registrados
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.8 }}>
                                                {search || selectedGrupoFilter !== 'all'
                                                    ? 'No hay comercios que coincidan con los filtros aplicados.'
                                                    : 'Aún no se han registrado comercios.'}
                                            </Typography>
                                            {search || selectedGrupoFilter !== 'all' ? (
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<ClearIcon />}
                                                    onClick={() => {
                                                        setSearch('');
                                                        handleFilterChange('all');
                                                    }}
                                                    sx={{ borderRadius: 1 }}
                                                >
                                                    Limpiar filtros
                                                </Button>
                                            ) : (
                                                <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={handleCreate} sx={{ borderRadius: 1 }}>
                                                    Registrar Comercio
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    comercios.map((comercio) => {
                                        const brandColor = comercio.color_hex || '#0c43a3';

                                        return (
                                            <TableRow
                                                key={comercio.id}
                                                hover
                                                sx={{
                                                    transition: 'background-color 0.15s ease',
                                                    '&:hover': { bgcolor: 'action.hover' },
                                                }}
                                            >
                                                {/* Columna 1: Comercio & Sigla */}
                                                <TableCell sx={{ py: 1.8 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8 }}>
                                                        <Avatar
                                                            sx={{
                                                                bgcolor: brandColor,
                                                                color: '#ffffff',
                                                                fontWeight: 900,
                                                                fontSize: '0.8rem',
                                                                width: 38,
                                                                height: 38,
                                                                borderRadius: 1,
                                                                boxShadow: `0 2px 6px ${brandColor}25`,
                                                            }}
                                                        >
                                                            {(comercio.sigla || comercio.nombre.substring(0, 3)).substring(0, 3).toUpperCase()}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '0.92rem' }}>
                                                                {comercio.nombre}
                                                            </Typography>
                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                                sx={{
                                                                    display: 'block',
                                                                    mt: 0.1,
                                                                    maxWidth: 300,
                                                                    lineHeight: 1.35,
                                                                }}
                                                            >
                                                                {comercio.descripcion || 'Sin descripción corporativa.'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>

                                                {/* Columna 2: Sigla */}
                                                <TableCell sx={{ textAlign: 'center' }}>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            fontFamily: 'monospace',
                                                            bgcolor: 'action.hover',
                                                            px: 1,
                                                            py: 0.3,
                                                            borderRadius: 0.8,
                                                            fontWeight: 800,
                                                            fontSize: '0.74rem',
                                                            color: 'text.primary',
                                                            border: '1px solid',
                                                            borderColor: 'divider',
                                                        }}
                                                    >
                                                        {comercio.sigla || comercio.codigo || '-'}
                                                    </Typography>
                                                </TableCell>

                                                {/* Columna 3: Acreditación & Plataforma (Máximo 3 botones vivos y llamativos) */}
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, alignItems: 'center' }}>
                                                        {/* Botón 1: Web (Planeta) */}
                                                        {comercio.pagina_web && (
                                                            <Tooltip title={`Visitar Sitio Web: ${comercio.pagina_web}`} arrow>
                                                                <Button
                                                                    href={ensureHttp(comercio.pagina_web)}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    size="small"
                                                                    startIcon={<LanguageIcon sx={{ fontSize: '15px !important', color: '#0284c7' }} />}
                                                                    endIcon={<LaunchIcon sx={{ fontSize: '10px !important', color: '#0284c7', opacity: 0.9 }} />}
                                                                    sx={{
                                                                        textTransform: 'none',
                                                                        fontSize: '0.74rem',
                                                                        fontWeight: 750,
                                                                        py: 0.3,
                                                                        px: 1,
                                                                        height: 25,
                                                                        borderRadius: 1.2,
                                                                        border: '1.5px solid #0284c7',
                                                                        color: (theme) => theme.palette.mode === 'dark' ? '#38bdf8' : '#0369a1',
                                                                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(56, 189, 248, 0.08)' : 'rgba(2, 132, 199, 0.06)',
                                                                        transition: 'all 0.2s ease',
                                                                        '&:hover': {
                                                                            border: '1.5px solid #0369a1',
                                                                            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(56, 189, 248, 0.18)' : 'rgba(2, 132, 199, 0.14)',
                                                                            boxShadow: '0 2px 10px rgba(2, 132, 199, 0.32)',
                                                                            transform: 'translateY(-1px)',
                                                                        },
                                                                    }}
                                                                >
                                                                    Web
                                                                </Button>
                                                            </Tooltip>
                                                        )}

                                                        {/* Botón 2: Plataforma (Sombrero) */}
                                                        {comercio.plataforma_carrera && (
                                                            <Tooltip title={`Ir a la Plataforma / Aula Virtual: ${comercio.plataforma_carrera}`} arrow>
                                                                <Button
                                                                    href={ensureHttp(comercio.plataforma_carrera)}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    size="small"
                                                                    startIcon={<SchoolIcon sx={{ fontSize: '16px !important', color: '#6366f1' }} />}
                                                                    endIcon={<LaunchIcon sx={{ fontSize: '10px !important', color: '#6366f1', opacity: 0.9 }} />}
                                                                    sx={{
                                                                        textTransform: 'none',
                                                                        fontSize: '0.74rem',
                                                                        fontWeight: 750,
                                                                        py: 0.3,
                                                                        px: 1,
                                                                        height: 25,
                                                                        borderRadius: 1.2,
                                                                        border: '1.5px solid #6366f1',
                                                                        color: (theme) => theme.palette.mode === 'dark' ? '#a5b4fc' : '#4338ca',
                                                                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(129, 140, 248, 0.08)' : 'rgba(99, 102, 241, 0.06)',
                                                                        transition: 'all 0.2s ease',
                                                                        '&:hover': {
                                                                            border: '1.5px solid #4f46e5',
                                                                            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(129, 140, 248, 0.18)' : 'rgba(99, 102, 241, 0.14)',
                                                                            boxShadow: '0 2px 10px rgba(99, 102, 241, 0.32)',
                                                                            transform: 'translateY(-1px)',
                                                                        },
                                                                    }}
                                                                >
                                                                    Plataforma
                                                                </Button>
                                                            </Tooltip>
                                                        )}

                                                        {/* Botón 3: Tutorial (YouTube) */}
                                                        {comercio.como_ingresar_plataforma && (
                                                            <Tooltip title={`Tutorial de acceso (YouTube): ${comercio.como_ingresar_plataforma}`} arrow>
                                                                <Button
                                                                    href={ensureHttp(comercio.como_ingresar_plataforma)}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    size="small"
                                                                    startIcon={<YouTubeIcon sx={{ fontSize: '18px !important', color: '#dc2626' }} />}
                                                                    endIcon={<LaunchIcon sx={{ fontSize: '10px !important', color: '#dc2626', opacity: 0.9 }} />}
                                                                    sx={{
                                                                        textTransform: 'none',
                                                                        fontSize: '0.74rem',
                                                                        fontWeight: 750,
                                                                        py: 0.3,
                                                                        px: 1,
                                                                        height: 25,
                                                                        borderRadius: 1.2,
                                                                        border: '1.5px solid #dc2626',
                                                                        color: (theme) => theme.palette.mode === 'dark' ? '#f87171' : '#b91c1c',
                                                                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(248, 113, 113, 0.08)' : 'rgba(220, 38, 38, 0.06)',
                                                                        transition: 'all 0.2s ease',
                                                                        '&:hover': {
                                                                            border: '1.5px solid #b91c1c',
                                                                            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(248, 113, 113, 0.18)' : 'rgba(220, 38, 38, 0.14)',
                                                                            boxShadow: '0 2px 10px rgba(220, 38, 38, 0.32)',
                                                                            transform: 'translateY(-1px)',
                                                                        },
                                                                    }}
                                                                >
                                                                    Tutorial
                                                                </Button>
                                                            </Tooltip>
                                                        )}

                                                        {/* Fallback si no tiene ninguno de los 3 enlaces */}
                                                        {!comercio.pagina_web && !comercio.plataforma_carrera && !comercio.como_ingresar_plataforma && (
                                                            <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic', fontSize: '0.72rem' }}>
                                                                Sin enlaces registrados
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </TableCell>



                                                {/* Columna 4: Oferta Formativa */}
                                                <TableCell sx={{ minWidth: 200 }}>
                                                    <Link
                                                        href={`/admin/comercios/${comercio.id}/edit?tab=3`}
                                                        style={{ textDecoration: 'none' }}
                                                    >
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            startIcon={<SchoolIcon sx={{ fontSize: '15px !important' }} />}
                                                            sx={{
                                                                textTransform: 'none',
                                                                fontWeight: 800,
                                                                fontSize: '0.74rem',
                                                                borderRadius: 1.5,
                                                                bgcolor: `${brandColor}15`,
                                                                color: brandColor,
                                                                border: `1px solid ${brandColor}40`,
                                                                boxShadow: 'none',
                                                                '&:hover': {
                                                                    bgcolor: brandColor,
                                                                    color: '#ffffff',
                                                                    boxShadow: `0 2px 8px ${brandColor}40`,
                                                                },
                                                                py: 0.5,
                                                                px: 1.2,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 0.5,
                                                            }}
                                                        >
                                                            Oferta Formativa
                                                            <Box
                                                                component="span"
                                                                sx={{
                                                                    ml: 0.5,
                                                                    px: 0.6,
                                                                    py: 0.1,
                                                                    borderRadius: 1,
                                                                    bgcolor: `${brandColor}25`,
                                                                    color: 'inherit',
                                                                    fontSize: '0.68rem',
                                                                    fontWeight: 900,
                                                                }}
                                                            >
                                                                {(comercio.carreras_count || 0) + (comercio.diplomados_count || 0) + (comercio.cursos_count || 0) + (comercio.especialidades_count || 0)}
                                                            </Box>
                                                        </Button>
                                                    </Link>
                                                    <Box sx={{ display: 'flex', gap: 0.6, mt: 0.5, flexWrap: 'wrap' }}>
                                                        {Boolean(comercio.carreras_count) && (
                                                            <Typography variant="caption" sx={{ fontSize: '0.66rem', color: 'text.secondary' }}>
                                                                {comercio.carreras_count} carr.
                                                            </Typography>
                                                        )}
                                                        {Boolean(comercio.especialidades_count) && (
                                                            <Typography variant="caption" sx={{ fontSize: '0.66rem', color: 'text.secondary' }}>
                                                                • {comercio.especialidades_count} esp.
                                                            </Typography>
                                                        )}
                                                        {Boolean(comercio.diplomados_count) && (
                                                            <Typography variant="caption" sx={{ fontSize: '0.66rem', color: 'text.secondary' }}>
                                                                • {comercio.diplomados_count} dip.
                                                            </Typography>
                                                        )}
                                                        {Boolean(comercio.cursos_count) && (
                                                            <Typography variant="caption" sx={{ fontSize: '0.66rem', color: 'text.secondary' }}>
                                                                • {comercio.cursos_count} cur.
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </TableCell>

                                                {/* Columna 5: Acciones */}
                                                <TableCell sx={{ textAlign: 'right' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.8 }}>
                                                        <Tooltip title="Editar Ficha de Comercio" arrow>
                                                            <Link
                                                                href={`/admin/comercios/${comercio.id}/edit`}
                                                                style={{ textDecoration: 'none' }}
                                                            >
                                                                <IconButton
                                                                    size="small"
                                                                    sx={{
                                                                        border: '1px solid',
                                                                        borderColor: 'divider',
                                                                        borderRadius: 1,
                                                                        '&:hover': { bgcolor: 'action.hover' },
                                                                    }}
                                                                >
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                            </Link>
                                                        </Tooltip>

                                                        <Tooltip title="Eliminar Comercio" arrow>
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleDeletePrompt(comercio)}
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
                                Mostrando <strong>{comercios.length}</strong> comercios
                            </Typography>
                        </Box>
                    </TableContainer>
                )}

                {/* VISTA EN TARJETAS */}
                {viewMode === 'grid' && (
                    <Grid container spacing={2.5} sx={{ width: '100%', m: 0 }}>
                        {comercios.map((comercio) => {
                            const brandColor = comercio.color_hex || '#0c43a3';

                            return (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={comercio.id}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            borderRadius: 1.5,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            bgcolor: 'background.paper',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                                            '&:hover': {
                                                borderColor: brandColor,
                                                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                                            },
                                        }}
                                    >
                                        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, bgcolor: brandColor }} />

                                        <Box sx={{ p: 2.2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.8 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                                    <Avatar sx={{ bgcolor: brandColor, color: '#fff', fontWeight: 900, width: 34, height: 34, borderRadius: 1, fontSize: '0.72rem' }}>
                                                        {(comercio.sigla || comercio.nombre.substring(0, 3)).substring(0, 3).toUpperCase()}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: '0.9rem', lineHeight: 1.2 }}>
                                                            {comercio.nombre}
                                                        </Typography>
                                                        {comercio.grupo && (
                                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                                                {comercio.grupo.nombre}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>

                                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                    <Link href={`/admin/comercios/${comercio.id}/edit`} style={{ textDecoration: 'none' }}>
                                                        <IconButton size="small" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 0.8 }}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Link>
                                                    <IconButton size="small" color="error" onClick={() => handleDeletePrompt(comercio)} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 0.8 }}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Box>

                                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.78rem', lineHeight: 1.45, flex: 1, mb: 1.8 }}>
                                                {comercio.descripcion || 'Sin descripción corporativa registrada.'}
                                            </Typography>

                                            <Box sx={{ pt: 1.2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                                                <Link href={`/admin/comercios/${comercio.id}/edit?tab=3`} style={{ textDecoration: 'none' }}>
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        startIcon={<SchoolIcon sx={{ fontSize: '14px !important' }} />}
                                                        sx={{
                                                            textTransform: 'none',
                                                            fontWeight: 800,
                                                            fontSize: '0.72rem',
                                                            bgcolor: brandColor,
                                                            color: '#ffffff',
                                                            borderRadius: 1,
                                                            boxShadow: `0 2px 6px ${brandColor}30`,
                                                            '&:hover': { bgcolor: brandColor, filter: 'brightness(0.95)' },
                                                        }}
                                                    >
                                                        Oferta Formativa ({(comercio.carreras_count || 0) + (comercio.diplomados_count || 0) + (comercio.cursos_count || 0) + (comercio.especialidades_count || 0)})
                                                    </Button>
                                                </Link>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Box>

            {/* MODALES Y DIÁLOGOS CRUD */}
            <ComercioDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                comercio={selectedComercio}
                grupos={grupos}
                
            />

            <CarreraDialog
                open={carreraDialogOpen}
                onOpenChange={setCarreraDialogOpen}
                comercios={comercios}
                defaultComercioId={quickComercioId}
                
            />
        </>
    );
}

ComerciosIndex.layout = () => ({
    breadcrumbs: [
        {
            title: 'Panel Principal',
            href: '/dashboard',
        },
        {
            title: 'Comercios',
            href: '/admin/comercios',
        },
    ],
});
