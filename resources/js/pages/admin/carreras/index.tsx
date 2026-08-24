import { Head, usePage, router, Link } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import ImageIcon from '@mui/icons-material/Image';
import LaunchIcon from '@mui/icons-material/Launch';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
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
} from '@mui/material';
import { useState } from 'react';
import { CarreraDialog } from '@/components/admin/carrera-dialog';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { dashboard } from '@/routes';
import type { Carrera, Comercio, Grupo } from '@/types';

interface Props {
    carreras: Carrera[];
    comercios: Comercio[];
    grupos?: Grupo[];
    filters: {
        comercio_id?: string;
        search?: string;
    };
}

export default function CarrerasIndex({
    carreras = [],
    comercios = [],
    filters,
}: Props) {
    const page = usePage();
    const currentTeam = page.props.currentTeam as { slug: string } | undefined;
    const currentTeamSlug = currentTeam?.slug || 'default';

    const [search, setSearch] = useState<string>(filters.search || '');
    const [selectedComercio, setSelectedComercio] = useState<string>(filters.comercio_id || 'all');

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCarrera, setSelectedCarrera] = useState<Carrera | null>(null);

    // Delete state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [carreraToDelete, setCarreraToDelete] = useState<Carrera | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const applyFilters = (newFilters: {
        comercio_id?: string;
        search?: string;
    }) => {
        router.get(
            `/${currentTeamSlug}/admin/carreras`,
            {
                comercio_id: newFilters.comercio_id === 'all' ? undefined : (newFilters.comercio_id ?? (selectedComercio === 'all' ? undefined : selectedComercio)),
                search: newFilters.search !== undefined ? (newFilters.search || undefined) : (search || undefined),
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search });
    };

    const handleCreate = () => {
        setSelectedCarrera(null);
        setDialogOpen(true);
    };

    const handleEdit = (carrera: Carrera) => {
        setSelectedCarrera(carrera);
        setDialogOpen(true);
    };

    const handleDeletePrompt = (carrera: Carrera) => {
        setCarreraToDelete(carrera);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!carreraToDelete) {
            return;
        }

        setIsDeleting(true);

        router.delete(`/${currentTeamSlug}/admin/carreras/${carreraToDelete.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setDeleteDialogOpen(false);
                setCarreraToDelete(null);
            },
        });
    };

    return (
        <>
            <Head title="Matriz de Carreras y Documentos - Grupo Capsur" />

            <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 500 }}>
                            <SchoolIcon fontSize="small" />
                            <span>Catálogo Capsur</span>
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                            Carreras y Programas
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Matriz de acreditación y enlaces documentales por carrera.
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Link
                            href={`/${currentTeamSlug}/admin/comercios`}
                            style={{ textDecoration: 'none' }}
                        >
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBackIcon />}
                                sx={{ px: 2, py: 0.8, textTransform: 'none' }}
                            >
                                Volver a Comercios
                            </Button>
                        </Link>

                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleCreate}
                            sx={{ px: 2.5, py: 0.8 }}
                        >
                            Nueva Carrera
                        </Button>
                    </Box>
                </Box>

                {/* Filters Toolbar */}
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Box component="form" onSubmit={handleSearchSubmit}>
                                <TextField
                                    placeholder="Buscar por nombre de carrera..."
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

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="filtro-comercio-label">Filtrar por Comercio / Instituto</InputLabel>
                                <Select
                                    labelId="filtro-comercio-label"
                                    value={selectedComercio}
                                    label="Filtrar por Comercio / Instituto"
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
                    </Grid>
                </Paper>

                {/* CRUD TABLE */}
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#152844' }}>
                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.78rem', textTransform: 'uppercase', py: 1.5 }}>
                                    Comercio
                                </TableCell>
                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                                    Nombre de la Carrera
                                </TableCell>
                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                                    Malla Curricular
                                </TableCell>
                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                                    Declaración Jurada
                                </TableCell>
                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                                    Modelo de Certificado
                                </TableCell>
                                <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                                    Acciones
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {carreras.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                                        No se encontraron carreras registradas con los filtros seleccionados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                carreras.map((carrera) => {
                                    const brandColor = carrera.comercio?.color_hex || '#1d4ed8';

                                    return (
                                        <TableRow
                                            key={carrera.id}
                                            hover
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            {/* COMERCIO */}
                                            <TableCell sx={{ minWidth: 140 }}>
                                                {carrera.comercio ? (
                                                    <Chip
                                                        label={carrera.comercio.nombre}
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

                                            {/* NOMBRE DE LA CARRERA */}
                                            <TableCell sx={{ fontWeight: 'bold', minWidth: 220, fontSize: '0.875rem' }}>
                                                {carrera.nombre}
                                            </TableCell>

                                            {/* URL MALLA CURRICULAR */}
                                            <TableCell sx={{ minWidth: 140 }}>
                                                {carrera.url_malla_curricular ? (
                                                    <Button
                                                        href={carrera.url_malla_curricular}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        size="small"
                                                        startIcon={<PictureAsPdfIcon fontSize="small" color="primary" />}
                                                        endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                        sx={{ fontSize: '0.75rem', p: 0.5, textTransform: 'none', fontWeight: 'bold' }}
                                                    >
                                                        Malla Curricular
                                                    </Button>
                                                ) : (
                                                    <Typography variant="caption" color="text.disabled">-</Typography>
                                                )}
                                            </TableCell>

                                            {/* URL DECLARACION JURADA */}
                                            <TableCell sx={{ minWidth: 150 }}>
                                                {carrera.url_declaracion_jurada ? (
                                                    <Button
                                                        href={carrera.url_declaracion_jurada}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        size="small"
                                                        startIcon={<DescriptionIcon fontSize="small" color="secondary" />}
                                                        endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                        sx={{ fontSize: '0.75rem', p: 0.5, textTransform: 'none', fontWeight: 'bold' }}
                                                    >
                                                        Declaración Jurada
                                                    </Button>
                                                ) : (
                                                    <Typography variant="caption" color="text.disabled">-</Typography>
                                                )}
                                            </TableCell>

                                            {/* MODELO DE CERTIFICADO */}
                                            <TableCell sx={{ minWidth: 160 }}>
                                                {carrera.modelo_certificado ? (
                                                    <Button
                                                        href={carrera.modelo_certificado}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        size="small"
                                                        startIcon={<WorkspacePremiumIcon fontSize="small" color="success" />}
                                                        endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                        sx={{ fontSize: '0.75rem', p: 0.5, textTransform: 'none', fontWeight: 'bold' }}
                                                    >
                                                        Modelo Certificado
                                                    </Button>
                                                ) : (
                                                    <Typography variant="caption" color="text.disabled">-</Typography>
                                                )}
                                            </TableCell>

                                            {/* ACCIONES */}
                                            <TableCell align="center" sx={{ minWidth: 100 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                                    <Tooltip title="Editar Carrera">
                                                        <IconButton size="small" onClick={() => handleEdit(carrera)}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Eliminar Carrera">
                                                        <IconButton size="small" color="error" onClick={() => handleDeletePrompt(carrera)}>
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
            <CarreraDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                carrera={selectedCarrera}
                comercios={comercios}
                currentTeamSlug={currentTeamSlug}
            />

            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title={`¿Eliminar "${carreraToDelete?.nombre}"?`}
                description="¿Estás seguro de que deseas eliminar este registro de carrera del catálogo de Grupo Capsur?"
                onConfirm={confirmDelete}
                processing={isDeleting}
            />
        </>
    );
}

CarrerasIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: props.currentTeam ? dashboard(props.currentTeam.slug) : '/',
        },
        {
            title: 'Comercios e Institutos',
            href: props.currentTeam ? `/${props.currentTeam.slug}/admin/comercios` : '#',
        },
        {
            title: 'Carreras y Programas',
            href: props.currentTeam ? `/${props.currentTeam.slug}/admin/carreras` : '#',
        },
    ],
});
