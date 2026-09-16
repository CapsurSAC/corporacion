import { Head, usePage, router, Link } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import DomainIcon from '@mui/icons-material/Domain';
import EditIcon from '@mui/icons-material/Edit';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LanguageIcon from '@mui/icons-material/Language';
import LaunchIcon from '@mui/icons-material/Launch';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import StorefrontIcon from '@mui/icons-material/Storefront';
import TableChartIcon from '@mui/icons-material/TableChart';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
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
    Popover,
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

    // Popover state for Detail View
    const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
    const [popoverComercio, setPopoverComercio] = useState<Comercio | null>(null);

    const handleOpenPopover = (event: React.MouseEvent<HTMLElement>, comercio: Comercio) => {
        setPopoverAnchor(event.currentTarget);
        setPopoverComercio(comercio);
    };

    const handleClosePopover = () => {
        setPopoverAnchor(null);
        setPopoverComercio(null);
    };

    const isPopoverOpen = Boolean(popoverAnchor);

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
                onSuccess: () => {
                    notify.success(`Comercio "${comercio.nombre}" eliminado exitosamente.`);
                },
                onError: () => {
                    notify.error('No se pudo eliminar el comercio.');
                },
            });
        }
    };

    return (
        <>
            <Head title="Comercios e Institutos - Grupo Capsur" />

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
                                        Comercios e Institutos
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

                                                {/* Columna 3: Acreditación & Plataformas */}
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, alignItems: 'center' }}>
                                                        {comercio.pagina_web && (
                                                            <Button
                                                                href={comercio.pagina_web}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                size="small"
                                                                variant="outlined"
                                                                startIcon={<LanguageIcon sx={{ fontSize: 13 }} />}
                                                                endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                                sx={{ textTransform: 'none', fontSize: '0.72rem', py: 0.2, px: 0.8, height: 22, borderRadius: 0.8 }}
                                                            >
                                                                Web
                                                            </Button>
                                                        )}
                                                        {comercio.certificado_url && (
                                                            <Button
                                                                href={comercio.certificado_url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                size="small"
                                                                variant="outlined"
                                                                color="error"
                                                                startIcon={<PictureAsPdfIcon sx={{ fontSize: 13 }} />}
                                                                endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                                sx={{ textTransform: 'none', fontSize: '0.72rem', py: 0.2, px: 0.8, height: 22, borderRadius: 0.8 }}
                                                            >
                                                                Certificado
                                                            </Button>
                                                        )}
                                                        {comercio.resolucion_revalidacion && (
                                                            <Chip
                                                                label={comercio.resolucion_revalidacion}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: (theme) =>
                                                                        theme.palette.mode === 'dark'
                                                                            ? 'rgba(255, 255, 255, 0.06)'
                                                                            : 'rgba(0, 0, 0, 0.04)',
                                                                    fontSize: '0.68rem',
                                                                    height: 20,
                                                                    borderRadius: 0.8,
                                                                    fontWeight: 600,
                                                                }}
                                                            />
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
                                                        <Tooltip title="Ficha Técnica Completa" arrow>
                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => handleOpenPopover(e, comercio)}
                                                                sx={{
                                                                    border: '1px solid',
                                                                    borderColor: 'divider',
                                                                    borderRadius: 1,
                                                                    '&:hover': { bgcolor: 'action.hover' },
                                                                }}
                                                            >
                                                                <InfoOutlinedIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>

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
                                Mostrando <strong>{comercios.length}</strong> comercios e institutos
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

                                                <Button
                                                    size="small"
                                                    variant="text"
                                                    startIcon={<InfoOutlinedIcon fontSize="small" />}
                                                    onClick={(e) => handleOpenPopover(e, comercio)}
                                                    sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.74rem', borderRadius: 0.8 }}
                                                >
                                                    Ficha Técnica
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Box>

            {/* POPOVER DE FICHA TÉCNICA */}
            <Popover
                open={isPopoverOpen}
                anchorEl={popoverAnchor}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                    paper: {
                        sx: {
                            p: 2.2,
                            width: { xs: 340, sm: 500 },
                            maxWidth: '95vw',
                            borderRadius: 1.5,
                            boxShadow: '0 8px 25px rgba(0,0,0,0.18)',
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'background.paper',
                        },
                    },
                }}
            >
                {popoverComercio && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                <Avatar sx={{ bgcolor: popoverComercio.color_hex || '#0c43a3', color: '#fff', width: 30, height: 30, fontWeight: 800, fontSize: '0.72rem', borderRadius: 0.8 }}>
                                    {(popoverComercio.sigla || popoverComercio.nombre.substring(0, 3)).substring(0, 3).toUpperCase()}
                                </Avatar>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: '0.92rem' }}>
                                    {popoverComercio.nombre}
                                </Typography>
                            </Box>
                            <IconButton size="small" onClick={handleClosePopover} sx={{ borderRadius: 0.8 }}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        <Grid container spacing={1.5}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                                    PÁGINA WEB:
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-all', fontSize: '0.82rem' }}>
                                    {popoverComercio.pagina_web ? (
                                        <a href={popoverComercio.pagina_web} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>
                                            {popoverComercio.pagina_web}
                                        </a>
                                    ) : 'No registrada'}
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                                    RESOLUCIÓN / ESCALE:
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.82rem' }}>
                                    {popoverComercio.resolucion_revalidacion || popoverComercio.escale_minedu || 'No especificada'}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Box sx={{ pt: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Link href={`/admin/comercios/${popoverComercio.id}/edit`} style={{ textDecoration: 'none' }}>
                                <Button variant="contained" size="small" startIcon={<EditIcon />} sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 1 }}>
                                    Abrir Edición Completa
                                </Button>
                            </Link>
                        </Box>
                    </Box>
                )}
            </Popover>

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
            title: 'Comercios e Institutos',
            href: '/admin/comercios',
        },
    ],
});
