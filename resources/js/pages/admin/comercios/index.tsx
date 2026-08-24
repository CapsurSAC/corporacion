import { Head, usePage, router, Link } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import DomainIcon from '@mui/icons-material/Domain';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LanguageIcon from '@mui/icons-material/Language';
import LaunchIcon from '@mui/icons-material/Launch';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import StorefrontIcon from '@mui/icons-material/Storefront';
import TableChartIcon from '@mui/icons-material/TableChart';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import VisibilityIcon from '@mui/icons-material/Visibility';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    IconButton,
    Chip,
    TextField,
    InputAdornment,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    ToggleButtonGroup,
    ToggleButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    Popover,
} from '@mui/material';
import { useState } from 'react';
import { CarreraDialog } from '@/components/admin/carrera-dialog';
import { ComercioDialog } from '@/components/admin/comercio-dialog';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
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

export default function ComerciosIndex({ comercios = [], grupos = [], filters }: Props) {
    const page = usePage();
    const currentTeam = page.props.currentTeam as { slug: string } | undefined;
    const currentTeamSlug = currentTeam?.slug || 'default';

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

    // Dialog state for Detail / Preview
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [previewComercio, setPreviewComercio] = useState<Comercio | null>(null);

    // Dialog state for Delete
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [comercioToDelete, setComercioToDelete] = useState<Comercio | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const isComercioConCarreras = (c?: Comercio | null) => {
        if (!c) return false;
        const slug = c.slug?.toLowerCase() || '';
        const codigo = c.codigo?.toUpperCase() || '';
        const sigla = c.sigla?.toUpperCase() || '';
        const nombre = c.nombre?.toUpperCase() || '';
        return (
            slug === 'istp-sis' ||
            slug === 'istp-avanti' ||
            codigo === 'SIS' ||
            codigo === 'AVANTI' ||
            sigla === 'AVANTI' ||
            sigla === 'SIS' ||
            nombre.includes('AVANTI') ||
            nombre.includes('SIS') ||
            (c.carreras_count !== undefined && c.carreras_count > 0)
        );
    };

    const handleFilterChange = (grupoId: string) => {
        setSelectedGrupoFilter(grupoId);
        router.get(
            `/${currentTeamSlug}/admin/comercios`,
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
            `/${currentTeamSlug}/admin/comercios`,
            {
                grupo_id: selectedGrupoFilter === 'all' ? undefined : selectedGrupoFilter,
                search: search || undefined,
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

    const handleViewDetail = (comercio: Comercio) => {
        setPreviewComercio(comercio);
        setDetailModalOpen(true);
    };

    const handleQuickAddCarrera = (comercio: Comercio) => {
        setQuickComercioId(comercio.id);
        setCarreraDialogOpen(true);
    };

    const handleDeletePrompt = (comercio: Comercio) => {
        setComercioToDelete(comercio);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!comercioToDelete) {
            return;
        }

        setIsDeleting(true);

        router.delete(`/${currentTeamSlug}/admin/comercios/${comercioToDelete.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setDeleteDialogOpen(false);
                setComercioToDelete(null);
            },
        });
    };

    return (
        <>
            <Head title="Comercios e Institutos - Grupo Capsur" />

            <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 500 }}>
                            <StorefrontIcon fontSize="small" />
                            <span>Catálogo Capsur</span>
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                            Comercios e Institutos
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Matriz de acreditaciones oficiales MINEDU, resoluciones y plataformas por comercio.
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <ToggleButtonGroup
                            value={viewMode}
                            exclusive
                            onChange={(_, val) => val && setViewMode(val)}
                            size="small"
                        >
                            <ToggleButton value="table">
                                <TableChartIcon fontSize="small" sx={{ mr: { sm: 0.5 } }} />
                                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Matriz</Box>
                            </ToggleButton>
                            <ToggleButton value="grid">
                                <ViewModuleIcon fontSize="small" sx={{ mr: { sm: 0.5 } }} />
                                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Tarjetas</Box>
                            </ToggleButton>
                        </ToggleButtonGroup>

                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleCreate}
                            sx={{ px: 2.5, py: 0.8 }}
                        >
                            Nuevo Comercio
                        </Button>
                    </Box>
                </Box>

                {/* Filters Toolbar */}
                <Paper variant="outlined" sx={{ p: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
                    <Box component="form" onSubmit={handleSearchSubmit} sx={{ flex: 1, maxWidth: 450 }}>
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
                                },
                            }}
                        />
                    </Box>

                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel id="filtro-grupo-label">Filtrar por Grupo</InputLabel>
                        <Select
                            labelId="filtro-grupo-label"
                            value={selectedGrupoFilter}
                            label="Filtrar por Grupo"
                            onChange={(e) => handleFilterChange(e.target.value)}
                        >
                            <MenuItem value="all">🏢 Todos los grupos</MenuItem>
                            {grupos.map((g) => (
                                <MenuItem key={g.id} value={String(g.id)}>
                                    {g.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Paper>

                {/* TABLE VIEW: CLEAN MATRIX TABLE WITH POPOVER FOR FULL ATTRIBUTES */}
                {viewMode === 'table' && (
                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#152844' }}>
                                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', py: 1.5, minWidth: 160 }}>
                                        COMERCIO
                                    </TableCell>
                                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: 140 }}>
                                        GRUPO
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: 90 }}>
                                        SIGLA
                                    </TableCell>
                                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: 130 }}>
                                        CERTIFICADO
                                    </TableCell>
                                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: 130 }}>
                                        PAGINA WEB
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: 160 }}>
                                        ACCIONES
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {comercios.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                                            No se encontraron comercios registrados.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    comercios.map((comercio) => {
                                        const brandColor = comercio.color_hex || '#0c43a3';

                                        return (
                                            <TableRow
                                                key={comercio.id}
                                                hover
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                {/* COMERCIO */}
                                                <TableCell>
                                                    <Chip
                                                        label={comercio.nombre}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: brandColor,
                                                            color: '#ffffff',
                                                            fontWeight: 'bold',
                                                            fontSize: '0.75rem',
                                                            textTransform: 'uppercase',
                                                            width: 'fit-content',
                                                        }}
                                                    />
                                                </TableCell>

                                                {/* GRUPO */}
                                                <TableCell>
                                                    {comercio.grupo ? (
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight: 600,
                                                                color: 'text.primary',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: 0.8,
                                                            }}
                                                        >
                                                            <DomainIcon fontSize="small" sx={{ color: 'text.secondary', fontSize: '16px' }} />
                                                            {comercio.grupo.nombre}
                                                        </Typography>
                                                    ) : (
                                                        <Typography variant="caption" color="text.disabled">-</Typography>
                                                    )}
                                                </TableCell>

                                                {/* SIGLA */}
                                                <TableCell align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                                    {comercio.sigla || comercio.codigo || '-'}
                                                </TableCell>

                                                {/* CERTIFICADO */}
                                                <TableCell>
                                                    {comercio.certificado_url ? (
                                                        <Button
                                                            href={comercio.certificado_url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            size="small"
                                                            startIcon={<PictureAsPdfIcon fontSize="inherit" color="primary" />}
                                                            endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                            sx={{ fontSize: '0.75rem', p: 0.5, textTransform: 'none', fontWeight: 'bold' }}
                                                        >
                                                            Certificado
                                                        </Button>
                                                    ) : (
                                                        <Typography variant="caption" color="text.disabled">-</Typography>
                                                    )}
                                                </TableCell>

                                                {/* PAGINA WEB */}
                                                <TableCell>
                                                    {comercio.pagina_web ? (
                                                        <Button
                                                            href={comercio.pagina_web}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            size="small"
                                                            startIcon={<LanguageIcon fontSize="inherit" color="info" />}
                                                            endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                            sx={{ fontSize: '0.75rem', p: 0.5, textTransform: 'none', fontWeight: 'bold' }}
                                                        >
                                                            PaginaWeb
                                                        </Button>
                                                    ) : (
                                                        <Typography variant="caption" color="text.disabled">-</Typography>
                                                    )}
                                                </TableCell>

                                                {/* ACCIONES */}
                                                <TableCell align="center">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                                        <Tooltip title="Editar Comercio">
                                                            <Link
                                                                href={`/${currentTeamSlug}/admin/comercios/${comercio.id}/edit`}
                                                                style={{ color: 'inherit', display: 'inline-flex' }}
                                                            >
                                                                <IconButton size="small">
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                            </Link>
                                                        </Tooltip>
                                                        <Tooltip title="Eliminar Comercio">
                                                            <IconButton size="small" color="error" onClick={() => handleDeletePrompt(comercio)}>
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
                    </TableContainer>
                )}

                {/* GRID VIEW */}
                {viewMode === 'grid' && (
                    <Grid container spacing={2.5}>
                        {comercios.length === 0 ? (
                            <Grid size={{ xs: 12 }}>
                                <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderStyle: 'dashed' }}>
                                    <StorefrontIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        No se encontraron comercios
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        No hay comercios que coincidan con los filtros aplicados.
                                    </Typography>
                                    <Button variant="outlined" startIcon={<AddIcon />} onClick={handleCreate}>
                                        Registrar Comercio
                                    </Button>
                                </Paper>
                            </Grid>
                        ) : (
                            comercios.map((comercio) => {
                                const brandColor = comercio.color_hex || '#1d4ed8';

                                return (
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={comercio.id}>
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                borderRadius: 2.5,
                                                overflow: 'hidden',
                                                borderTop: `4px solid ${brandColor}`,
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    boxShadow: '0 8px 24px rgba(0,0,0,0.09)',
                                                    transform: 'translateY(-2px)',
                                                },
                                            }}
                                        >
                                            <CardContent sx={{ p: 2.5 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                                    <Box>
                                                        <Chip
                                                            label={comercio.nombre}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: brandColor,
                                                                color: '#ffffff',
                                                                fontWeight: 'bold',
                                                                fontSize: '0.75rem',
                                                                textTransform: 'uppercase',
                                                                mb: 0.5,
                                                            }}
                                                        />
                                                        {comercio.sigla && (
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>
                                                                SIGLA: {comercio.sigla}
                                                            </Typography>
                                                        )}
                                                        {comercio.grupo && (
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
                                                                <DomainIcon fontSize="inherit" />
                                                                {comercio.grupo.nombre}
                                                            </Typography>
                                                        )}
                                                    </Box>

                                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                        <IconButton size="small" onClick={() => handleViewDetail(comercio)} title="Ver Ficha">
                                                            <VisibilityIcon fontSize="small" />
                                                        </IconButton>
                                                        <Tooltip title="Editar comercio">
                                                            <Link
                                                                href={`/${currentTeamSlug}/admin/comercios/${comercio.id}/edit`}
                                                                style={{ color: 'inherit', display: 'inline-flex' }}
                                                            >
                                                                <IconButton size="small">
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                            </Link>
                                                        </Tooltip>
                                                        <IconButton size="small" color="error" onClick={() => handleDeletePrompt(comercio)} title="Eliminar comercio">
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </Box>

                                                <Typography variant="body2" color="text.secondary" sx={{ minHeight: 36, fontSize: '0.8125rem' }}>
                                                    {comercio.descripcion || 'Sin descripción especificada.'}
                                                </Typography>
                                            </CardContent>

                                            <Box sx={{ p: 2, pt: 1.5, borderTop: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                    Ficha Oficial Capsur
                                                </Typography>
                                                <Button
                                                    size="small"
                                                    variant="text"
                                                    startIcon={<InfoOutlinedIcon fontSize="small" />}
                                                    onClick={(e) => handleOpenPopover(e, comercio)}
                                                    sx={{ fontSize: '0.75rem', textTransform: 'none', fontWeight: 'bold' }}
                                                >
                                                    Ver Detalle
                                                </Button>
                                            </Box>
                                        </Card>
                                    </Grid>
                                );
                            })
                        )}
                    </Grid>
                )}
            </Box>

            {/* DETAIL MODAL PREVIEW */}
            {previewComercio && (
                <Dialog
                    open={detailModalOpen}
                    onClose={() => setDetailModalOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle sx={{ pb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Chip
                                label={previewComercio.nombre}
                                size="small"
                                sx={{
                                    bgcolor: previewComercio.color_hex || '#1d4ed8',
                                    color: '#ffffff',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                }}
                            />
                            {previewComercio.sigla && (
                                <Chip label={`Sigla: ${previewComercio.sigla}`} size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />
                            )}
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
                            Ficha Institucional & Acreditaciones Oficiales
                        </Typography>
                    </DialogTitle>
                    <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        {/* MATRIZ DE ATRIBUTOS E INFORMACIÓN EXTRA (EXACTA DEL CUADRO INSTITUCIONAL) */}
                        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                            <Table size="small">
                                {/* FILA 1: CERTIFICADO | RESOLUCIÓN REVALIDACIÓN | ESCALE MINEDU | MALLA CURRICULAR */}
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#152844' }}>
                                        <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', py: 1.2, width: '25%' }}>
                                            CERTIFICADO
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', py: 1.2, width: '25%' }}>
                                            RESOLUCION REVALIDACION
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', py: 1.2, width: '25%' }}>
                                            ESCALE MINEDU
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', py: 1.2, width: '25%' }}>
                                            MALLA CURRICULAR - 2022-2023
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow sx={{ bgcolor: 'background.paper' }}>
                                        <TableCell align="center">
                                            {previewComercio.certificado_url ? (
                                                <Button
                                                    href={previewComercio.certificado_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    size="small"
                                                    endIcon={<LaunchIcon sx={{ fontSize: '11px !important' }} />}
                                                    sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '0.8rem' }}
                                                >
                                                    Certificado
                                                </Button>
                                            ) : (
                                                <Typography variant="caption" color="text.disabled">-</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            {previewComercio.resolucion_revalidacion ? (
                                                <Button
                                                    href={previewComercio.resolucion_revalidacion.startsWith('http') ? previewComercio.resolucion_revalidacion : '#'}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    size="small"
                                                    endIcon={<LaunchIcon sx={{ fontSize: '11px !important' }} />}
                                                    sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '0.8rem' }}
                                                >
                                                    RESOLUCIÓN REVALIDACIÓN
                                                </Button>
                                            ) : (
                                                <Typography variant="caption" color="text.disabled">-</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            {previewComercio.escale_minedu ? (
                                                <Button
                                                    href={previewComercio.escale_minedu.startsWith('http') ? previewComercio.escale_minedu : (previewComercio.link_directo_escale || 'https://escale.minedu.gob.pe/')}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    size="small"
                                                    endIcon={<LaunchIcon sx={{ fontSize: '11px !important' }} />}
                                                    sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '0.8rem' }}
                                                >
                                                    EscaleMinedu
                                                </Button>
                                            ) : (
                                                <Typography variant="caption" color="text.disabled">-</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            {previewComercio.malla_curricular_url ? (
                                                <Button
                                                    href={previewComercio.malla_curricular_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    size="small"
                                                    endIcon={<LaunchIcon sx={{ fontSize: '11px !important' }} />}
                                                    sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '0.8rem' }}
                                                >
                                                    MALLA CURRICULAR BROCHURE
                                                </Button>
                                            ) : (
                                                <Typography variant="caption" color="text.disabled">-</Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* FILA 2: PLATAFORMA CARRERA | PAGINA WEB | RESOLUCION CREACION | SIGLA | LINK DIRECTO ESCALE */}
                        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#152844' }}>
                                        <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', py: 1.2, width: '20%' }}>
                                            PLATAFORMA CARRERA
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', py: 1.2, width: '20%' }}>
                                            PAGINA WEB
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', py: 1.2, width: '20%' }}>
                                            RESOLUCION CREACION
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', py: 1.2, width: '20%' }}>
                                            SIGLA
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', py: 1.2, width: '20%' }}>
                                            LINK DIRECTO ESCALE
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow sx={{ bgcolor: 'background.paper' }}>
                                        <TableCell align="center">
                                            {previewComercio.plataforma_carrera ? (
                                                <Button
                                                    href={previewComercio.plataforma_carrera}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    size="small"
                                                    endIcon={<LaunchIcon sx={{ fontSize: '11px !important' }} />}
                                                    sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '0.8rem' }}
                                                >
                                                    PlataformaCarrera
                                                </Button>
                                            ) : (
                                                <Typography variant="caption" color="text.disabled">-</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            {previewComercio.pagina_web ? (
                                                <Button
                                                    href={previewComercio.pagina_web}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    size="small"
                                                    endIcon={<LaunchIcon sx={{ fontSize: '11px !important' }} />}
                                                    sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '0.8rem' }}
                                                >
                                                    PaginaWeb
                                                </Button>
                                            ) : (
                                                <Typography variant="caption" color="text.disabled">-</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            {previewComercio.resolucion_creacion ? (
                                                <Button
                                                    href={previewComercio.resolucion_creacion.startsWith('http') ? previewComercio.resolucion_creacion : '#'}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    size="small"
                                                    endIcon={<LaunchIcon sx={{ fontSize: '11px !important' }} />}
                                                    sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '0.8rem' }}
                                                >
                                                    ResolucionCreacion
                                                </Button>
                                            ) : (
                                                <Typography variant="caption" color="text.disabled">-</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                                {previewComercio.sigla || previewComercio.codigo || '-'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            {previewComercio.link_directo_escale ? (
                                                <Button
                                                    href={previewComercio.link_directo_escale}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    size="small"
                                                    endIcon={<LaunchIcon sx={{ fontSize: '11px !important' }} />}
                                                    sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '0.8rem' }}
                                                >
                                                    LinkDirectoEscale
                                                </Button>
                                            ) : (
                                                <Typography variant="caption" color="text.disabled">-</Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* FILA 3: RECONOCIMIENTO DIRECTOR | SEMINARIO | CANAL DE YOUTUBE | CONVENIO | FOTOS */}
                        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#152844' }}>
                                        <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', py: 1.2, width: '20%' }}>
                                            RECONOCIMIENTO DIRECTOR
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', py: 1.2, width: '20%' }}>
                                            SEMINARIO
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', py: 1.2, width: '20%' }}>
                                            CANAL DE YOUTUBE
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', py: 1.2, width: '20%' }}>
                                            CONVENIO
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', py: 1.2, width: '20%' }}>
                                            FOTOS
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow sx={{ bgcolor: 'background.paper' }}>
                                        <TableCell align="center">
                                            {previewComercio.reconocimiento_director ? (
                                                <Button
                                                    href={previewComercio.reconocimiento_director.startsWith('http') ? previewComercio.reconocimiento_director : '#'}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    size="small"
                                                    endIcon={<LaunchIcon sx={{ fontSize: '11px !important' }} />}
                                                    sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '0.8rem' }}
                                                >
                                                    ReconocimientoDirector
                                                </Button>
                                            ) : (
                                                <Typography variant="caption" color="text.disabled">-</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            {previewComercio.seminario ? (
                                                <Button
                                                    href={previewComercio.seminario}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    size="small"
                                                    endIcon={<LaunchIcon sx={{ fontSize: '11px !important' }} />}
                                                    sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '0.8rem' }}
                                                >
                                                    Seminario
                                                </Button>
                                            ) : (
                                                <Typography variant="caption" color="text.disabled">-</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            {previewComercio.canales_youtube && previewComercio.canales_youtube.length > 0 ? (
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
                                                    {previewComercio.canales_youtube.map((yt, idx) => (
                                                        <Button
                                                            key={idx}
                                                            href={yt}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            size="small"
                                                            startIcon={<YouTubeIcon fontSize="small" color="error" />}
                                                            sx={{ textTransform: 'none', fontSize: '0.75rem', p: 0.2 }}
                                                        >
                                                            Link_Youtube{idx + 1}
                                                        </Button>
                                                    ))}
                                                </Box>
                                            ) : (
                                                <Typography variant="caption" color="text.disabled">-</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            {previewComercio.convenio ? (
                                                previewComercio.convenio.startsWith('http') ? (
                                                    <Button
                                                        href={previewComercio.convenio}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        size="small"
                                                        endIcon={<LaunchIcon sx={{ fontSize: '11px !important' }} />}
                                                        sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '0.8rem' }}
                                                    >
                                                        Convenio
                                                    </Button>
                                                ) : (
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 140 }}>
                                                        {previewComercio.convenio}
                                                    </Typography>
                                                )
                                            ) : (
                                                <Typography variant="caption" color="text.disabled">-</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            {previewComercio.fotos && previewComercio.fotos.length > 0 ? (
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
                                                    {previewComercio.fotos.map((f, fidx) => (
                                                        <Button
                                                            key={fidx}
                                                            href={f}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            size="small"
                                                            startIcon={<PhotoLibraryIcon fontSize="small" color="primary" />}
                                                            sx={{ textTransform: 'none', fontSize: '0.75rem', p: 0.2 }}
                                                        >
                                                            Foto{fidx + 1}
                                                        </Button>
                                                    ))}
                                                </Box>
                                            ) : (
                                                <Typography variant="caption" color="text.disabled">-</Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Catálogo y Promoción Vigente si existen */}
                        {(previewComercio.catalogo_url || previewComercio.promocion_vigente) && (
                            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                                <Grid container spacing={2}>
                                    {previewComercio.catalogo_url && (
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', display: 'block' }}>
                                                CATÁLOGO OFICIAL:
                                            </Typography>
                                            <Button href={previewComercio.catalogo_url} target="_blank" size="small" sx={{ textTransform: 'none' }}>
                                                Descargar Catálogo
                                            </Button>
                                        </Grid>
                                    )}
                                    {previewComercio.promocion_vigente && (
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', display: 'block' }}>
                                                PROMOCIÓN VIGENTE:
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                                {previewComercio.promocion_vigente}
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </Paper>
                        )}
                        {/* Banner de Carreras si es Avanti o SIS */}
                        {isComercioConCarreras(previewComercio) && (
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    bgcolor: 'rgba(12, 67, 163, 0.05)',
                                    borderColor: '#0c43a3',
                                    borderRadius: 2,
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    alignItems: { xs: 'flex-start', sm: 'center' },
                                    justifyContent: 'space-between',
                                    gap: 2,
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#0c43a3', color: '#fff', display: 'flex' }}>
                                        <SchoolIcon fontSize="small" />
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#152844' }}>
                                            Carreras Profesionales Oficiales de {previewComercio.nombre}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {previewComercio.carreras_count || 0} carreras con resolución, brochure y modelo de título registrados.
                                        </Typography>
                                    </Box>
                                </Box>
                                <Link
                                    href={`/${currentTeamSlug}/admin/carreras?comercio_id=${previewComercio.id}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <Button
                                        variant="contained"
                                        size="small"
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{ bgcolor: '#0c43a3', textTransform: 'none', fontWeight: 'bold', whiteSpace: 'nowrap' }}
                                    >
                                        Ver Carreras ({previewComercio.carreras_count || 0})
                                    </Button>
                                </Link>
                            </Paper>
                        )}
                    </DialogContent>
                </Dialog>
            )}

            {/* POPOVER INSTITUCIONAL "VER DETALLE" */}
            <Popover
                open={isPopoverOpen}
                anchorEl={popoverAnchor}
                onClose={handleClosePopover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                slotProps={{
                    paper: {
                        sx: {
                            width: 780,
                            maxWidth: '95vw',
                            borderRadius: 2.5,
                            boxShadow: '0 16px 40px rgba(12, 67, 163, 0.22)',
                            border: '1px solid rgba(21, 40, 68, 0.15)',
                            overflow: 'hidden',
                        },
                    },
                }}
            >
                {popoverComercio && (
                    <Box>
                        {/* Popover Header */}
                        <Box
                            sx={{
                                bgcolor: '#152844',
                                color: '#ffffff',
                                px: 2.5,
                                py: 1.3,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Chip
                                    label={popoverComercio.nombre}
                                    size="small"
                                    sx={{
                                        bgcolor: popoverComercio.color_hex || '#0c43a3',
                                        color: '#ffffff',
                                        fontWeight: 'bold',
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                    }}
                                />
                                {popoverComercio.sigla && (
                                    <Chip
                                        label={`SIGLA: ${popoverComercio.sigla}`}
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(255,255,255,0.15)',
                                            color: '#54d8ee',
                                            fontWeight: 'bold',
                                            fontSize: '0.75rem',
                                        }}
                                    />
                                )}
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#ffffff', letterSpacing: 0.3 }}>
                                    Ficha Institucional & Enlaces Oficiales
                                </Typography>
                            </Box>
                            <IconButton size="small" onClick={handleClosePopover} sx={{ color: '#ffffff' }}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        {/* Popover Body: Matriz de 3 Filas */}
                        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: '70vh', overflowY: 'auto' }}>
                            {/* FILA 1: CERTIFICADO | RESOLUCION REVALIDACION | ESCALE MINEDU | MALLA CURRICULAR */}
                            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#152844' }}>
                                            <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.7rem', textTransform: 'uppercase', py: 0.8, width: '25%' }}>
                                                CERTIFICADO
                                            </TableCell>
                                            <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.7rem', textTransform: 'uppercase', py: 0.8, width: '25%' }}>
                                                RESOLUCION REVALIDACION
                                            </TableCell>
                                            <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.7rem', textTransform: 'uppercase', py: 0.8, width: '25%' }}>
                                                ESCALE MINEDU
                                            </TableCell>
                                            <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.7rem', textTransform: 'uppercase', py: 0.8, width: '25%' }}>
                                                MALLA CURRICULAR - 2022-2023
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow sx={{ bgcolor: 'background.paper' }}>
                                            <TableCell align="center">
                                                {popoverComercio.certificado_url ? (
                                                    <Button
                                                        href={popoverComercio.certificado_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        size="small"
                                                        endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                        sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '0.75rem', p: 0.3 }}
                                                    >
                                                        Certificado
                                                    </Button>
                                                ) : (
                                                    <Typography variant="caption" color="text.disabled">-</Typography>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {popoverComercio.resolucion_revalidacion ? (
                                                    <Button
                                                        href={popoverComercio.resolucion_revalidacion.startsWith('http') ? popoverComercio.resolucion_revalidacion : '#'}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        size="small"
                                                        startIcon={<PictureAsPdfIcon fontSize="inherit" color="error" />}
                                                        endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                        sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '0.75rem', p: 0.3 }}
                                                    >
                                                        RESOLUCIÓN REVALIDACIÓN
                                                    </Button>
                                                ) : (
                                                    <Typography variant="caption" color="text.disabled">-</Typography>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {popoverComercio.escale_minedu ? (
                                                    <Button
                                                        href={popoverComercio.escale_minedu.startsWith('http') ? popoverComercio.escale_minedu : (popoverComercio.link_directo_escale || 'https://escale.minedu.gob.pe/')}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        size="small"
                                                        startIcon={<LanguageIcon fontSize="inherit" color="info" />}
                                                        endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                        sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '0.75rem', p: 0.3 }}
                                                    >
                                                        EscaleMinedu
                                                    </Button>
                                                ) : (
                                                    <Typography variant="caption" color="text.disabled">-</Typography>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {popoverComercio.malla_curricular_url ? (
                                                    <Button
                                                        href={popoverComercio.malla_curricular_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        size="small"
                                                        endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                        sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '0.75rem', p: 0.3 }}
                                                    >
                                                        MALLA CURRICULAR BROCHURE
                                                    </Button>
                                                ) : (
                                                    <Typography variant="caption" color="text.disabled">-</Typography>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* FILA 2: PLATAFORMA CARRERA | PAGINA WEB | RESOLUCION CREACION | SIGLA | LINK DIRECTO ESCALE */}
                            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#152844' }}>
                                            <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.7rem', textTransform: 'uppercase', py: 0.8, width: '20%' }}>
                                                PLATAFORMA CARRERA
                                            </TableCell>
                                            <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.7rem', textTransform: 'uppercase', py: 0.8, width: '20%' }}>
                                                PAGINA WEB
                                            </TableCell>
                                            <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.7rem', textTransform: 'uppercase', py: 0.8, width: '20%' }}>
                                                RESOLUCION CREACION
                                            </TableCell>
                                            <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.7rem', textTransform: 'uppercase', py: 0.8, width: '20%' }}>
                                                SIGLA
                                            </TableCell>
                                            <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.7rem', textTransform: 'uppercase', py: 0.8, width: '20%' }}>
                                                LINK DIRECTO ESCALE
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow sx={{ bgcolor: 'background.paper' }}>
                                            <TableCell align="center">
                                                {popoverComercio.plataforma_carrera ? (
                                                    <Button
                                                        href={popoverComercio.plataforma_carrera}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        size="small"
                                                        endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                        sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '0.75rem', p: 0.3 }}
                                                    >
                                                        PlataformaCarrera
                                                    </Button>
                                                ) : (
                                                    <Typography variant="caption" color="text.disabled">-</Typography>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {popoverComercio.pagina_web ? (
                                                    <Button
                                                        href={popoverComercio.pagina_web}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        size="small"
                                                        endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                        sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '0.75rem', p: 0.3 }}
                                                    >
                                                        PaginaWeb
                                                    </Button>
                                                ) : (
                                                    <Typography variant="caption" color="text.disabled">-</Typography>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {popoverComercio.resolucion_creacion ? (
                                                    <Button
                                                        href={popoverComercio.resolucion_creacion.startsWith('http') ? popoverComercio.resolucion_creacion : '#'}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        size="small"
                                                        endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                        sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '0.75rem', p: 0.3 }}
                                                    >
                                                        ResolucionCreacion
                                                    </Button>
                                                ) : (
                                                    <Typography variant="caption" color="text.disabled">-</Typography>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '0.8rem' }}>
                                                    {popoverComercio.sigla || popoverComercio.codigo || '-'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                {popoverComercio.link_directo_escale ? (
                                                    <Button
                                                        href={popoverComercio.link_directo_escale}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        size="small"
                                                        endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                        sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '0.75rem', p: 0.3 }}
                                                    >
                                                        LinkDirectoEscale
                                                    </Button>
                                                ) : (
                                                    <Typography variant="caption" color="text.disabled">-</Typography>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* FILA 3: RECONOCIMIENTO DIRECTOR | SEMINARIO | CANAL DE YOUTUBE | CONVENIO | FOTOS */}
                            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#152844' }}>
                                            <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.7rem', textTransform: 'uppercase', py: 0.8, width: '20%' }}>
                                                RECONOCIMIENTO DIRECTOR
                                            </TableCell>
                                            <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.7rem', textTransform: 'uppercase', py: 0.8, width: '20%' }}>
                                                SEMINARIO
                                            </TableCell>
                                            <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.7rem', textTransform: 'uppercase', py: 0.8, width: '20%' }}>
                                                CANAL DE YOUTUBE
                                            </TableCell>
                                            <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.7rem', textTransform: 'uppercase', py: 0.8, width: '20%' }}>
                                                CONVENIO
                                            </TableCell>
                                            <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.7rem', textTransform: 'uppercase', py: 0.8, width: '20%' }}>
                                                FOTOS
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow sx={{ bgcolor: 'background.paper' }}>
                                            <TableCell align="center">
                                                {popoverComercio.reconocimiento_director ? (
                                                    <Button
                                                        href={popoverComercio.reconocimiento_director.startsWith('http') ? popoverComercio.reconocimiento_director : '#'}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        size="small"
                                                        endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                        sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '0.75rem', p: 0.3 }}
                                                    >
                                                        ReconocimientoDirector
                                                    </Button>
                                                ) : (
                                                    <Typography variant="caption" color="text.disabled">-</Typography>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {popoverComercio.seminario ? (
                                                    <Button
                                                        href={popoverComercio.seminario}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        size="small"
                                                        endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                        sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '0.75rem', p: 0.3 }}
                                                    >
                                                        Seminario
                                                    </Button>
                                                ) : (
                                                    <Typography variant="caption" color="text.disabled">-</Typography>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {popoverComercio.canales_youtube && popoverComercio.canales_youtube.length > 0 ? (
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, alignItems: 'center' }}>
                                                        {popoverComercio.canales_youtube.map((yt, idx) => (
                                                            <Button
                                                                key={idx}
                                                                href={yt}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                size="small"
                                                                startIcon={<YouTubeIcon fontSize="small" color="error" />}
                                                                sx={{ textTransform: 'none', fontSize: '0.7rem', p: 0.2 }}
                                                            >
                                                                Link_Youtube{idx + 1}
                                                            </Button>
                                                        ))}
                                                    </Box>
                                                ) : (
                                                    <Typography variant="caption" color="text.disabled">-</Typography>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {popoverComercio.convenio ? (
                                                    popoverComercio.convenio.startsWith('http') ? (
                                                        <Button
                                                            href={popoverComercio.convenio}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            size="small"
                                                            endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                            sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '0.75rem', p: 0.3 }}
                                                        >
                                                            Convenio
                                                        </Button>
                                                    ) : (
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 130 }}>
                                                            {popoverComercio.convenio}
                                                        </Typography>
                                                    )
                                                ) : (
                                                    <Typography variant="caption" color="text.disabled">-</Typography>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {popoverComercio.fotos && popoverComercio.fotos.length > 0 ? (
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, alignItems: 'center' }}>
                                                        {popoverComercio.fotos.map((f, fidx) => (
                                                            <Button
                                                                key={fidx}
                                                                href={f}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                size="small"
                                                                startIcon={<PhotoLibraryIcon fontSize="small" color="primary" />}
                                                                sx={{ textTransform: 'none', fontSize: '0.7rem', p: 0.2 }}
                                                            >
                                                                Foto{fidx + 1}
                                                            </Button>
                                                        ))}
                                                    </Box>
                                                ) : (
                                                    <Typography variant="caption" color="text.disabled">-</Typography>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* Catálogo y Promoción Vigente si existen */}
                            {(popoverComercio.catalogo_url || popoverComercio.promocion_vigente) && (
                                <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 1.5 }}>
                                    <Grid container spacing={1.5}>
                                        {popoverComercio.catalogo_url && (
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', display: 'block' }}>
                                                    CATÁLOGO OFICIAL:
                                                </Typography>
                                                <Button href={popoverComercio.catalogo_url} target="_blank" size="small" sx={{ textTransform: 'none', fontSize: '0.75rem', p: 0.2 }}>
                                                    Descargar Catálogo
                                                </Button>
                                            </Grid>
                                        )}
                                        {popoverComercio.promocion_vigente && (
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', display: 'block' }}>
                                                    PROMOCIÓN VIGENTE:
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '0.8rem' }}>
                                                    {popoverComercio.promocion_vigente}
                                                </Typography>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Paper>
                            )}
                            {/* Banner de Carreras en Popover si es Avanti o SIS */}
                            {isComercioConCarreras(popoverComercio) && (
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 1.5,
                                        bgcolor: 'rgba(12, 67, 163, 0.06)',
                                        borderColor: '#0c43a3',
                                        borderRadius: 1.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: 1.5,
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <SchoolIcon fontSize="small" sx={{ color: '#0c43a3' }} />
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#152844', fontSize: '0.8rem' }}>
                                                Carreras Oficiales ({popoverComercio.carreras_count || 0})
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                                Gestión académica y títulos oficiales
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Link
                                        href={`/${currentTeamSlug}/admin/carreras?comercio_id=${popoverComercio.id}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Button
                                            variant="contained"
                                            size="small"
                                            endIcon={<ArrowForwardIcon sx={{ fontSize: '13px !important' }} />}
                                            sx={{ bgcolor: '#0c43a3', textTransform: 'none', fontWeight: 'bold', fontSize: '0.75rem', py: 0.3 }}
                                        >
                                            Ver Carreras
                                        </Button>
                                    </Link>
                                </Paper>
                            )}
                        </Box>
                    </Box>
                )}
            </Popover>

            {/* Dialogs */}
            <ComercioDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                comercio={selectedComercio}
                grupos={grupos}
                currentTeamSlug={currentTeamSlug}
            />

            <CarreraDialog
                open={carreraDialogOpen}
                onOpenChange={setCarreraDialogOpen}
                comercios={comercios}
                defaultComercioId={quickComercioId}
                currentTeamSlug={currentTeamSlug}
            />

            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title={`¿Eliminar comercio "${comercioToDelete?.nombre}"?`}
                description="Esta acción eliminará permanentemente el comercio y todas las carreras/programas asignados a él. ¿Deseas continuar?"
                onConfirm={confirmDelete}
                processing={isDeleting}
            />
        </>
    );
}

ComerciosIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: props.currentTeam ? dashboard(props.currentTeam.slug) : '/',
        },
        {
            title: 'Comercios e Institutos',
            href: props.currentTeam ? `/${props.currentTeam.slug}/admin/comercios` : '#',
        },
    ],
});
