import { Head, usePage, router } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import ImageIcon from '@mui/icons-material/Image';
import LaunchIcon from '@mui/icons-material/Launch';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
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
} from '@mui/material';
import { useState } from 'react';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { CursoDialog } from '@/components/admin/curso-dialog';
import { dashboard } from '@/routes';
import type { Curso, Comercio, Grupo, Carrera } from '@/types';

interface Props {
    cursos: Curso[];
    comercios: Comercio[];
    carreras?: Carrera[];
    grupos?: Grupo[];
    filters: {
        comercio_id?: string;
        tipo?: string;
        search?: string;
    };
}

export default function CursosIndex({
    cursos = [],
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
    const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);

    // Delete state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [cursoToDelete, setCursoToDelete] = useState<Curso | null>(null);
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
            `/${currentTeamSlug}/admin/cursos`,
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
        setSelectedCurso(null);
        setDialogOpen(true);
    };

    const handleEdit = (curso: Curso) => {
        setSelectedCurso(curso);
        setDialogOpen(true);
    };

    const handleDeletePrompt = (curso: Curso) => {
        setCursoToDelete(curso);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!cursoToDelete) {
            return;
        }

        setIsDeleting(true);

        router.delete(`/${currentTeamSlug}/admin/cursos/${cursoToDelete.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setDeleteDialogOpen(false);
                setCursoToDelete(null);
            },
        });
    };

    return (
        <>
            <Head title="Cursos y Talleres - Grupo Capsur" />

            <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 500 }}>
                            <MenuBookIcon fontSize="small" color="primary" />
                            <span>Catálogo Capsur</span>
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                            Cursos y Talleres
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Gestión de cursos (Tradicionales y Especializados), brochures, flyers, videos de YouTube, precios y actualización en Drive.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleCreate}
                        sx={{ px: 2.5, py: 0.8 }}
                    >
                        Nuevo Curso
                    </Button>
                </Box>

                {/* Filters Toolbar */}
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                        <Grid size={{ xs: 12, sm: 5, md: 4 }}>
                            <Box component="form" onSubmit={handleSearchSubmit}>
                                <TextField
                                    placeholder="Buscar curso o precio..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    size="small"
                                    fullWidth
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

                        <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="filter-comercio-label">Comercio / Instituto</InputLabel>
                                <Select
                                    labelId="filter-comercio-label"
                                    value={selectedComercio}
                                    label="Comercio / Instituto"
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setSelectedComercio(val);
                                        applyFilters({ comercio_id: val });
                                    }}
                                >
                                    <MenuItem value="all">Todos los Comercios</MenuItem>
                                    {comercios.map((c) => (
                                        <MenuItem key={c.id} value={String(c.id)}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box
                                                    sx={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '50%',
                                                        bgcolor: c.color_hex || '#3b82f6',
                                                    }}
                                                />
                                                <span>{c.nombre}</span>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 3, md: 3 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="filter-tipo-label">Tipo de Curso</InputLabel>
                                <Select
                                    labelId="filter-tipo-label"
                                    value={selectedTipo}
                                    label="Tipo de Curso"
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setSelectedTipo(val);
                                        applyFilters({ tipo: val });
                                    }}
                                >
                                    <MenuItem value="all">Todos los Tipos</MenuItem>
                                    <MenuItem value="sin_categoria">🎓 Sin Tipo / Libre (Matpel)</MenuItem>
                                    <MenuItem value="tradicional">Tradicional</MenuItem>
                                    <MenuItem value="especializado">Especializado</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 12, md: 2 }}>
                            {(selectedComercio !== 'all' || selectedTipo !== 'all' || search) && (
                                <Button
                                    size="small"
                                    color="inherit"
                                    onClick={() => {
                                        setSelectedComercio('all');
                                        setSelectedTipo('all');
                                        setSearch('');
                                        applyFilters({ comercio_id: 'all', tipo: 'all', search: '' });
                                    }}
                                >
                                    Limpiar Filtros
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </Paper>

                {/* Table */}
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <Table size="medium">
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
                                    LISTADO DE CURSOS Y TALLERES CAPSUR
                                </TableCell>
                            </TableRow>
                            <TableRow sx={{ bgcolor: '#152844' }}>
                                <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', width: 50 }}>
                                    N°
                                </TableCell>
                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                    Comercio
                                </TableCell>
                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                    Tipo
                                </TableCell>
                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                    Nombre del Curso
                                </TableCell>
                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                    Flyer
                                </TableCell>
                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                    Brochure
                                </TableCell>
                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                    YouTube
                                </TableCell>
                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                    Precio
                                </TableCell>
                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                    Actualizado Drive
                                </TableCell>
                                <TableCell align="center" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', width: 140 }}>
                                    ACCIONES
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cursos.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                                        No se encontraron cursos registrados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                cursos.map((curso, index) => {
                                    const brandColor = curso.comercio?.color_hex || '#3b82f6';
                                    const isEspecializado = curso.tipo === 'especializado';

                                    return (
                                        <TableRow
                                            key={curso.id}
                                            hover
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            {/* NRO */}
                                            <TableCell align="center" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                                                {index + 1}
                                            </TableCell>

                                            {/* COMERCIO */}
                                            <TableCell>
                                                {curso.comercio ? (
                                                    <Chip
                                                        label={curso.comercio.nombre}
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
                                                {!curso.tipo ? (
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '0.75rem' }}>
                                                        Libre / Sin tipo
                                                    </Typography>
                                                ) : (
                                                    <Chip
                                                        label={isEspecializado ? 'Especializado' : 'Tradicional'}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: isEspecializado ? '#f3e8ff' : '#e0f2fe',
                                                            color: isEspecializado ? '#6b21a8' : '#0369a1',
                                                            fontWeight: 700,
                                                            fontSize: '0.75rem',
                                                            border: `1px solid ${isEspecializado ? '#d8b4fe' : '#bae6fd'}`,
                                                        }}
                                                    />
                                                )}
                                            </TableCell>

                                            {/* NOMBRE */}
                                            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                                                <div>{curso.nombre}</div>
                                                {curso.carrera && (
                                                    <Box sx={{ mt: 0.5 }}>
                                                        <Chip
                                                            size="small"
                                                            icon={<SchoolIcon sx={{ fontSize: '13px !important' }} />}
                                                            label={`Carrera: ${curso.carrera.nombre}`}
                                                            variant="outlined"
                                                            sx={{ fontSize: '0.7rem', height: 20, borderColor: 'primary.light', color: 'primary.main', fontWeight: 600 }}
                                                        />
                                                    </Box>
                                                )}
                                            </TableCell>

                                            {/* FLYER */}
                                            <TableCell>
                                                {curso.flyer ? (
                                                    <Button
                                                        href={curso.flyer}
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
                                                {curso.brochure ? (
                                                    <Button
                                                        href={curso.brochure}
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
                                                {curso.youtube ? (
                                                    <Button
                                                        href={curso.youtube}
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
                                                {curso.precio ? (
                                                    <Chip
                                                        label={curso.precio}
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
                                                {curso.actualizado_drive ? (
                                                    <Button
                                                        href={curso.actualizado_drive}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        size="small"
                                                        startIcon={<CloudDoneIcon fontSize="small" sx={{ color: '#059669' }} />}
                                                        endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                        sx={{ fontSize: '0.75rem', p: 0.5, textTransform: 'none', fontWeight: 600, color: '#059669' }}
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
                                                    <Tooltip title="Editar Curso">
                                                        <IconButton size="small" onClick={() => handleEdit(curso)}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Eliminar Curso">
                                                        <IconButton size="small" color="error" onClick={() => handleDeletePrompt(curso)}>
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

            {/* Create / Edit Dialog */}
            <CursoDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                curso={selectedCurso}
                comercios={comercios}
                carreras={carreras}
                currentTeamSlug={currentTeamSlug}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="¿Eliminar Curso?"
                description={`¿Estás seguro de que deseas eliminar permanentemente el curso "${cursoToDelete?.nombre}"? Esta acción no se puede deshacer.`}
                onConfirm={confirmDelete}
                processing={isDeleting}
            />
        </>
    );
}

CursosIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: props.currentTeam ? dashboard(props.currentTeam.slug) : '/',
        },
        {
            title: 'Cursos y Talleres',
            href: props.currentTeam ? `/${props.currentTeam.slug}/admin/cursos` : '#',
        },
    ],
});
