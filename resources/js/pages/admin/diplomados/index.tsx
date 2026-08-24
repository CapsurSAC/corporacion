import { Head, usePage, router } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import ImageIcon from '@mui/icons-material/Image';
import LaunchIcon from '@mui/icons-material/Launch';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {
    Box,
    Grid,
    Typography,
    Button,
    IconButton,
    Chip,
    TextField,
    InputAdornment,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    ListSubheader,
} from '@mui/material';
import { useState } from 'react';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { DiplomadoDialog } from '@/components/admin/diplomado-dialog';
import { dashboard } from '@/routes';
import type { Diplomado, Comercio, Grupo, Carrera } from '@/types';

interface Props {
    diplomados: Diplomado[];
    comercios: Comercio[];
    carreras?: Carrera[];
    grupos?: Grupo[];
    filters: {
        comercio_id?: string;
        tipo?: string;
        search?: string;
    };
}

export default function DiplomadosIndex({
    diplomados = [],
    comercios = [],
    carreras = [],
    filters,
}: Props) {
    const page = usePage();
    const currentTeam = page.props.currentTeam as { slug: string } | undefined;
    const currentTeamSlug = currentTeam?.slug || 'default';

    const [search, setSearch] = useState<string>(filters.search || '');
    const [selectedComercio, setSelectedComercio] = useState<string>(filters.comercio_id || 'all');
    const [selectedTipo, setSelectedTipo] = useState<string>(filters.tipo || 'all');

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDiplomado, setSelectedDiplomado] = useState<Diplomado | null>(null);

    // Delete state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [diplomadoToDelete, setDiplomadoToDelete] = useState<Diplomado | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const applyFilters = (newFilters: {
        comercio_id?: string;
        tipo?: string;
        search?: string;
    }) => {
        const nextComercio = newFilters.comercio_id !== undefined ? newFilters.comercio_id : selectedComercio;
        const nextTipo = newFilters.tipo !== undefined ? newFilters.tipo : selectedTipo;
        const nextSearch = newFilters.search !== undefined ? newFilters.search : search;

        router.get(
            `/${currentTeamSlug}/admin/diplomados`,
            {
                comercio_id: nextComercio === 'all' ? undefined : nextComercio,
                tipo: nextTipo === 'all' ? undefined : nextTipo,
                search: nextSearch || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search });
    };

    const handleCreate = () => {
        setSelectedDiplomado(null);
        setDialogOpen(true);
    };

    const handleEdit = (diplomado: Diplomado) => {
        setSelectedDiplomado(diplomado);
        setDialogOpen(true);
    };

    const handleDeletePrompt = (diplomado: Diplomado) => {
        setDiplomadoToDelete(diplomado);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!diplomadoToDelete) {
            return;
        }

        setIsDeleting(true);

        router.delete(`/${currentTeamSlug}/admin/diplomados/${diplomadoToDelete.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setDeleteDialogOpen(false);
                setDiplomadoToDelete(null);
            },
        });
    };

    const getTipoChip = (tipo?: string | null) => {
        if (!tipo || tipo === 'general' || tipo === 'libre' || tipo === 'sin_categoria') {
            return (
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '0.75rem' }}>
                    Sin categoría (Libre)
                </Typography>
            );
        }

        switch (tipo) {
            // Rubros Cecava
            case 'ambientales':
                return (
                    <Chip
                        label="Ambientales"
                        size="small"
                        sx={{ bgcolor: '#ecfdf5', color: '#065f46', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #a7f3d0' }}
                    />
                );
            case 'calidad_isos':
                return (
                    <Chip
                        label="Calidad ISOs"
                        size="small"
                        sx={{ bgcolor: '#eff6ff', color: '#1e40af', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #bfdbfe' }}
                    />
                );
            case 'mineros':
                return (
                    <Chip
                        label="Mineros"
                        size="small"
                        sx={{ bgcolor: '#fff7ed', color: '#9a3412', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #fed7aa' }}
                    />
                );
            case 'administracion':
                return (
                    <Chip
                        label="Administración"
                        size="small"
                        sx={{ bgcolor: '#f0fdfa', color: '#115e59', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #99f6e4' }}
                    />
                );
            case 'arquitectura_ingenieria':
                return (
                    <Chip
                        label="Arq. e Ingeniería"
                        size="small"
                        sx={{ bgcolor: '#eef2ff', color: '#3730a3', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #c7d2fe' }}
                    />
                );
            case 'osha':
                return (
                    <Chip
                        label="OSHA"
                        size="small"
                        sx={{ bgcolor: '#fef2f2', color: '#991b1b', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #fecaca' }}
                    />
                );
            case 'comercio_exterior':
                return (
                    <Chip
                        label="Comex"
                        size="small"
                        sx={{ bgcolor: '#ecfeff', color: '#155e75', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #a5f3fc' }}
                    />
                );
            case 'rubro_legal':
                return (
                    <Chip
                        label="Rubro Legal"
                        size="small"
                        sx={{ bgcolor: '#f5f3ff', color: '#5b21b6', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #ddd6fe' }}
                    />
                );
            case 'no_actualizados':
                return (
                    <Chip
                        label="No Actualizado"
                        size="small"
                        sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #cbd5e1' }}
                    />
                );
            // Rubros Magister
            case 'nombramiento':
                return (
                    <Chip
                        label="Nombramiento"
                        size="small"
                        sx={{ bgcolor: '#ede9fe', color: '#5b21b6', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #c4b5fd' }}
                    />
                );
            case 'secundaria':
                return (
                    <Chip
                        label="Secundaria"
                        size="small"
                        sx={{ bgcolor: '#ecfdf5', color: '#065f46', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #a7f3d0' }}
                    />
                );
            case 'generico':
            default:
                return (
                    <Chip
                        label="Genérico"
                        size="small"
                        sx={{ bgcolor: '#f0f9ff', color: '#0369a1', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #bae6fd' }}
                    />
                );
        }
    };

    return (
        <>
            <Head title="Diplomados y Especializaciones - Grupo Capsur" />

            <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 500 }}>
                            <WorkspacePremiumIcon fontSize="small" color="primary" />
                            <span>Catálogo Capsur</span>
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                            Diplomados
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Gestión de diplomados por rubros técnicos (Cecava, Magister, Avanti, SIS), diplomados libres (Cecava-min), brochures, flyers, videos de YouTube, precios y actualización en Drive.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleCreate}
                        sx={{ px: 2.5, py: 0.8 }}
                    >
                        Nuevo Diplomado
                    </Button>
                </Box>

                {/* Filters Toolbar */}
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                        <Grid size={{ xs: 12, sm: 5, md: 4 }}>
                            <Box component="form" onSubmit={handleSearchSubmit}>
                                <TextField
                                    placeholder="Buscar diplomado o precio..."
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
                        </Grid>

                        <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="filtro-comercio-label">Filtrar por Comercio</InputLabel>
                                <Select
                                    labelId="filtro-comercio-label"
                                    value={selectedComercio}
                                    label="Filtrar por Comercio"
                                    onChange={(e) => {
                                        setSelectedComercio(e.target.value);
                                        applyFilters({ comercio_id: e.target.value });
                                    }}
                                >
                                    <MenuItem value="all">🏬 Todos los comercios</MenuItem>
                                    {comercios.map((c) => (
                                        <MenuItem key={c.id} value={String(c.id)}>
                                            {c.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 3, md: 4 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="filtro-tipo-label">Rubro / Categoría</InputLabel>
                                <Select
                                    labelId="filtro-tipo-label"
                                    value={selectedTipo}
                                    label="Rubro / Categoría"
                                    onChange={(e) => {
                                        setSelectedTipo(e.target.value);
                                        applyFilters({ tipo: e.target.value });
                                    }}
                                >
                                    <MenuItem value="all">🎓 Todos los rubros / tipos</MenuItem>
                                    <MenuItem value="sin_categoria">🎓 Sin Categoría / Libre (Cecava-min)</MenuItem>

                                    <ListSubheader sx={{ fontWeight: 800, color: 'text.primary' }}>CECAVA</ListSubheader>
                                    <MenuItem value="ambientales">🌿 Ambientales</MenuItem>
                                    <MenuItem value="calidad_isos">🏆 Calidad e ISOs</MenuItem>
                                    <MenuItem value="mineros">⛏️ Mineros</MenuItem>
                                    <MenuItem value="administracion">💼 Administración</MenuItem>
                                    <MenuItem value="arquitectura_ingenieria">📐 Arq. e Ingeniería</MenuItem>
                                    <MenuItem value="osha">🦺 OSHA</MenuItem>
                                    <MenuItem value="comercio_exterior">🚢 Comercio Exterior</MenuItem>
                                    <MenuItem value="rubro_legal">⚖️ Rubro Legal</MenuItem>
                                    <MenuItem value="no_actualizados">📁 No Actualizados</MenuItem>

                                    <ListSubheader sx={{ fontWeight: 800, color: 'text.primary' }}>MAGISTER</ListSubheader>
                                    <MenuItem value="nombramiento">📝 Nombramiento</MenuItem>
                                    <MenuItem value="secundaria">🏫 Secundaria</MenuItem>
                                    <MenuItem value="generico">🎓 Genérico</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Paper>

                {/* CRUD TABLE DIPLOMADOS */}
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table size="small">
                        <TableHead>
                            {/* Super Header azul Capsur */}
                            <TableRow sx={{ bgcolor: '#0c43a3' }}>
                                <TableCell
                                    colSpan={10}
                                    align="center"
                                    sx={{
                                        color: '#ffffff',
                                        fontWeight: 900,
                                        fontSize: '1rem',
                                        letterSpacing: 2,
                                        textTransform: 'uppercase',
                                        py: 1.2,
                                    }}
                                >
                                    DIPLOMADOS
                                </TableCell>
                            </TableRow>
                            <TableRow sx={{ bgcolor: '#152844' }}>
                                <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.78rem', textTransform: 'uppercase', width: 45 }}>
                                    #
                                </TableCell>
                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.78rem', textTransform: 'uppercase', minWidth: 120 }}>
                                    Comercio
                                </TableCell>
                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.78rem', textTransform: 'uppercase', minWidth: 130 }}>
                                    Rubro / Tipo
                                </TableCell>
                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.78rem', textTransform: 'uppercase', minWidth: 200 }}>
                                    NOMBRE DEL DIPLOMADO
                                </TableCell>
                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.78rem', textTransform: 'uppercase', minWidth: 100 }}>
                                    FLYER
                                </TableCell>
                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.78rem', textTransform: 'uppercase', minWidth: 100 }}>
                                    BROCHURE
                                </TableCell>
                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.78rem', textTransform: 'uppercase', minWidth: 100 }}>
                                    YOUTUBE
                                </TableCell>
                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.78rem', textTransform: 'uppercase', minWidth: 90 }}>
                                    PRECIO
                                </TableCell>
                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.78rem', textTransform: 'uppercase', minWidth: 130 }}>
                                    ACTUALIZADO DRIVE
                                </TableCell>
                                <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.78rem', textTransform: 'uppercase', width: 85 }}>
                                    Acciones
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {diplomados.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                                        No se encontraron diplomados registrados con los filtros seleccionados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                diplomados.map((diplomado, index) => {
                                    const brandColor = diplomado.comercio?.color_hex || '#16a34a';

                                    return (
                                        <TableRow
                                            key={diplomado.id}
                                            hover
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            {/* NRO */}
                                            <TableCell align="center" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                                                {index + 1}
                                            </TableCell>

                                            {/* COMERCIO */}
                                            <TableCell>
                                                {diplomado.comercio ? (
                                                    <Chip
                                                        label={diplomado.comercio.nombre}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: brandColor,
                                                            color: '#ffffff',
                                                            fontWeight: 'bold',
                                                            fontSize: '0.72rem',
                                                            textTransform: 'uppercase',
                                                        }}
                                                    />
                                                ) : (
                                                    <Typography variant="caption" color="text.disabled">-</Typography>
                                                )}
                                            </TableCell>

                                            {/* TIPO */}
                                            <TableCell>
                                                {getTipoChip(diplomado.tipo)}
                                            </TableCell>

                                            {/* NOMBRE */}
                                            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                                                <div>{diplomado.nombre}</div>
                                                {diplomado.carrera && (
                                                    <Box sx={{ mt: 0.5 }}>
                                                        <Chip
                                                            size="small"
                                                            icon={<SchoolIcon sx={{ fontSize: '13px !important' }} />}
                                                            label={`Carrera: ${diplomado.carrera.nombre}`}
                                                            variant="outlined"
                                                            sx={{ fontSize: '0.7rem', height: 20, borderColor: 'primary.light', color: 'primary.main', fontWeight: 600 }}
                                                        />
                                                    </Box>
                                                )}
                                            </TableCell>

                                            {/* FLYER */}
                                            <TableCell>
                                                {diplomado.flyer ? (
                                                    <Button
                                                        href={diplomado.flyer}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        size="small"
                                                        startIcon={<ImageIcon fontSize="small" sx={{ color: '#ea580c' }} />}
                                                        endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                        sx={{ fontSize: '0.75rem', p: 0.5, textTransform: 'none', fontWeight: 600 }}
                                                    >
                                                        Flyer
                                                    </Button>
                                                ) : (
                                                    <Typography variant="caption" color="text.disabled">-</Typography>
                                                )}
                                            </TableCell>

                                            {/* BROCHURE */}
                                            <TableCell>
                                                {diplomado.brochure ? (
                                                    <Button
                                                        href={diplomado.brochure}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        size="small"
                                                        startIcon={<DescriptionIcon fontSize="small" sx={{ color: '#2563eb' }} />}
                                                        endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                        sx={{ fontSize: '0.75rem', p: 0.5, textTransform: 'none', fontWeight: 600 }}
                                                    >
                                                        Brochure
                                                    </Button>
                                                ) : (
                                                    <Typography variant="caption" color="text.disabled">-</Typography>
                                                )}
                                            </TableCell>

                                            {/* YOUTUBE */}
                                            <TableCell>
                                                {diplomado.youtube ? (
                                                    <Button
                                                        href={diplomado.youtube}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        size="small"
                                                        startIcon={<YouTubeIcon fontSize="small" color="error" />}
                                                        endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                        sx={{ fontSize: '0.75rem', p: 0.5, textTransform: 'none', fontWeight: 600 }}
                                                    >
                                                        YouTube
                                                    </Button>
                                                ) : (
                                                    <Typography variant="caption" color="text.disabled">-</Typography>
                                                )}
                                            </TableCell>

                                            {/* PRECIO */}
                                            <TableCell>
                                                {diplomado.precio ? (
                                                    <Chip
                                                        label={diplomado.precio}
                                                        size="small"
                                                        variant="outlined"
                                                        color="primary"
                                                        sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
                                                    />
                                                ) : (
                                                    <Typography variant="caption" color="text.disabled">-</Typography>
                                                )}
                                            </TableCell>

                                            {/* ACTUALIZADO DRIVE */}
                                            <TableCell>
                                                {diplomado.actualizado_drive ? (
                                                    <Button
                                                        href={diplomado.actualizado_drive}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        size="small"
                                                        startIcon={<CloudDoneIcon fontSize="small" sx={{ color: '#059669' }} />}
                                                        endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                        sx={{ fontSize: '0.72rem', p: 0.5, textTransform: 'none', fontWeight: 600, color: '#059669' }}
                                                    >
                                                        Drive
                                                    </Button>
                                                ) : (
                                                    <Typography variant="caption" color="text.disabled">-</Typography>
                                                )}
                                            </TableCell>

                                            {/* ACCIONES */}
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                                    <Tooltip title="Editar Diplomado">
                                                        <IconButton size="small" onClick={() => handleEdit(diplomado)}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Eliminar Diplomado">
                                                        <IconButton size="small" color="error" onClick={() => handleDeletePrompt(diplomado)}>
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
            </Box>

            {/* Dialogs */}
            <DiplomadoDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                diplomado={selectedDiplomado}
                comercios={comercios}
                carreras={carreras}
                currentTeamSlug={currentTeamSlug}
            />

            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title={`¿Eliminar "${diplomadoToDelete?.nombre}"?`}
                description="¿Estás seguro de que deseas eliminar este diplomado del catálogo de Grupo Capsur?"
                onConfirm={confirmDelete}
                processing={isDeleting}
            />
        </>
    );
}

DiplomadosIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: props.currentTeam ? dashboard(props.currentTeam.slug) : '/',
        },
        {
            title: 'Diplomados',
            href: props.currentTeam ? `/${props.currentTeam.slug}/admin/diplomados` : '#',
        },
    ],
});
