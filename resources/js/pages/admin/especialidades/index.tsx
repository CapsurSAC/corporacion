import { Head, router, Link } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BlockIcon from '@mui/icons-material/Block';
import CategoryIcon from '@mui/icons-material/Category';
import ClearIcon from '@mui/icons-material/Clear';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import ImageIcon from '@mui/icons-material/Image';
import LabelIcon from '@mui/icons-material/Label';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { ComercioBadge, ComercioAllBadge } from '@/components/admin/comercio-badge';
import {
    Avatar,
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
import { useState, useEffect, useMemo } from 'react';
import { EspecialidadDialog } from '@/components/admin/especialidad-dialog';
import { useNotification } from '@/hooks/use-notification';
import { confirmDeleteAlert } from '@/lib/swal';
import type { Especialidad, Carrera, Comercio, Rubro, Estado } from '@/types';

interface Props {
    especialidades: Especialidad[];
    carreras: (Carrera & { comercio?: { id: number; nombre: string; codigo?: string | null; color_hex?: string | null } })[];
    rubros: Rubro[];
    comercios: Comercio[];
    estados?: Estado[];
    filters: {
        carrera_id?: string;
        rubro_id?: string;
        comercio_id?: string;
        estado_id?: string;
        search?: string;
    };
}

export default function EspecialidadesIndex({
    especialidades = [],
    carreras = [],
    rubros = [],
    comercios = [],
    estados = [],
    filters,
}: Props) {
    const { notify } = useNotification();

    const [search, setSearch] = useState<string>(filters.search || '');
    const [selectedCarrera, setSelectedCarrera] = useState<string>(filters.carrera_id || 'all');
    const [selectedRubro, setSelectedRubro] = useState<string>(filters.rubro_id || 'all');
    const [selectedComercio, setSelectedComercio] = useState<string>(filters.comercio_id || 'all');
    const [selectedEstado, setSelectedEstado] = useState<string>(filters.estado_id || 'all');

    useEffect(() => {
        setSelectedCarrera(filters.carrera_id || 'all');
        setSelectedRubro(filters.rubro_id || 'all');
        setSelectedComercio(filters.comercio_id || 'all');
        setSelectedEstado(filters.estado_id || 'all');
        setSearch(filters.search || '');
    }, [filters]);

    const filteredCarreras = useMemo(() => {
        if (!selectedComercio || selectedComercio === 'all') return carreras;
        return carreras.filter((c) => String(c.comercio_id) === String(selectedComercio));
    }, [carreras, selectedComercio]);

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingEspecialidad, setEditingEspecialidad] = useState<Especialidad | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        if (params.get('create') === '1' || params.get('create') === 'true') {
            setEditingEspecialidad(null);
            setDialogOpen(true);
        } else if (params.get('edit_id')) {
            const id = Number(params.get('edit_id'));
            const found = especialidades.find((e) => e.id === id);
            if (found) {
                setEditingEspecialidad(found);
                setDialogOpen(true);
            }
        }
    }, [especialidades]);

    const applyFilters = (newFilters: {
        carrera_id?: string;
        rubro_id?: string;
        comercio_id?: string;
        estado_id?: string;
        search?: string;
    }) => {
        router.get(
            `/admin/especialidades`,
            {
                carrera_id: newFilters.carrera_id !== undefined ? (newFilters.carrera_id === 'all' ? undefined : newFilters.carrera_id) : (selectedCarrera === 'all' ? undefined : selectedCarrera),
                rubro_id: newFilters.rubro_id !== undefined ? (newFilters.rubro_id === 'all' ? undefined : newFilters.rubro_id) : (selectedRubro === 'all' ? undefined : selectedRubro),
                comercio_id: newFilters.comercio_id !== undefined ? (newFilters.comercio_id === 'all' ? undefined : newFilters.comercio_id) : (selectedComercio === 'all' ? undefined : selectedComercio),
                estado_id: newFilters.estado_id !== undefined ? (newFilters.estado_id === 'all' ? undefined : newFilters.estado_id) : (selectedEstado === 'all' ? undefined : selectedEstado),
                search: newFilters.search !== undefined ? (newFilters.search || undefined) : (search || undefined),
            },
            { preserveState: true, replace: true }
        );
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
        setEditingEspecialidad(null);
        setDialogOpen(true);
    };

    const handleEdit = (especialidad: Especialidad) => {
        setEditingEspecialidad(especialidad);
        setDialogOpen(true);
    };

    const handleDelete = async (especialidad: Especialidad) => {
        const confirmed = await confirmDeleteAlert({
            title: `¿Estás seguro de eliminar la especialidad "${especialidad.nombre}"?`,
            text: 'Esta acción no se puede deshacer.',
        });

        if (confirmed) {
            router.delete(`/admin/especialidades/${especialidad.id}`, {
                preserveScroll: true,
                onError: () => {
                    notify.error('No se pudo eliminar la especialidad.');
                },
            });
        }
    };

    return (
        <>
            <Head title="Especialidades por Carrera - Catálogo Capsur" />

            <Box
                sx={{
                    p: { xs: 2, sm: 2.5, md: 3 },
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2.5,
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                }}
            >

                {/* CABECERA PRINCIPAL UNIFICADA (Estilo Cursos y Talleres) */}
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
                                <SchoolIcon fontSize="medium" />
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
                                        Especialidades
                                    </Typography>
                                    <Chip
                                        label={`${especialidades.length} REGISTROS`}
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
                                    Gestión de especialidades por carreras técnicas, rubros, brochures, flyers, videos y enlaces Drive.
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
                            Nueva Especialidad
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
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: { xs: 'stretch', md: 'center' },
                        justifyContent: 'space-between',
                        gap: 2,
                        width: '100%',
                        boxSizing: 'border-box',
                    }}
                >
                    <Box component="form" onSubmit={handleSearchSubmit} sx={{ flex: 1, maxWidth: { xs: '100%', md: 360 } }}>
                        <TextField
                            placeholder="Buscar especialidad o tema..."
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

                    <Box sx={{ display: 'flex', gap: 1.2, flexWrap: 'wrap', alignItems: 'center' }}>
                        {/* Filtro por Comercio */}
                        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 190 } }}>
                            <InputLabel id="filter-comercio-label">Comercio / Sede</InputLabel>
                            <Select
                                labelId="filter-comercio-label"
                                value={selectedComercio}
                                label="Comercio / Sede"
                                onChange={(e) => {
                                    const nextComercio = e.target.value;
                                    setSelectedComercio(nextComercio);
                                    const carreraValida =
                                        nextComercio === 'all' ||
                                        selectedCarrera === 'all' ||
                                        selectedCarrera === 'no_corresponde' ||
                                        carreras.some((c) => String(c.id) === selectedCarrera && String(c.comercio_id) === String(nextComercio));
                                    const nextCarrera = carreraValida ? selectedCarrera : 'all';
                                    if (!carreraValida) {
                                        setSelectedCarrera('all');
                                    }
                                    applyFilters({ comercio_id: nextComercio, carrera_id: nextCarrera });
                                }}
                            >
                                <MenuItem value="all">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <ComercioAllBadge size={22} label="ALL" />
                                        <Typography variant="body2">Todos los comercios</Typography>
                                    </Box>
                                </MenuItem>
                                {comercios.map((c) => (
                                    <MenuItem key={c.id} value={String(c.id)}>
                                        <ComercioBadge comercio={c} size={22} showName />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Filtro por Carrera */}
                        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 190 } }}>
                            <InputLabel id="filter-carrera-label">Carrera Matriz</InputLabel>
                            <Select
                                labelId="filter-carrera-label"
                                value={selectedCarrera}
                                label="Carrera Matriz"
                                onChange={(e) => {
                                    setSelectedCarrera(e.target.value);
                                    applyFilters({ carrera_id: e.target.value });
                                }}
                            >
                                <MenuItem value="all">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <SchoolIcon sx={{ fontSize: '1.1rem', color: 'text.secondary' }} />
                                        <Typography variant="body2">Todas las carreras</Typography>
                                    </Box>
                                </MenuItem>
                                <MenuItem value="no_corresponde">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <BlockIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                                        <Typography variant="body2">No corresponde</Typography>
                                    </Box>
                                </MenuItem>
                                {filteredCarreras.map((c) => (
                                    <MenuItem key={c.id} value={String(c.id)}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <SchoolIcon sx={{ fontSize: '1rem', color: c.comercio?.color_hex || 'primary.main' }} />
                                            <Typography variant="body2">
                                                {c.nombre}
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Filtro por Rubro */}
                        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 190 } }}>
                            <InputLabel id="filter-rubro-label">Rubro Asignado</InputLabel>
                            <Select
                                labelId="filter-rubro-label"
                                value={selectedRubro}
                                label="Rubro Asignado"
                                onChange={(e) => {
                                    setSelectedRubro(e.target.value);
                                    applyFilters({ rubro_id: e.target.value });
                                }}
                            >
                                <MenuItem value="all">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CategoryIcon sx={{ fontSize: '1.1rem', color: 'text.secondary' }} />
                                        <Typography variant="body2">Todos los rubros</Typography>
                                    </Box>
                                </MenuItem>
                                {rubros.map((r) => (
                                    <MenuItem key={r.id} value={String(r.id)}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LabelIcon sx={{ fontSize: '1.1rem', color: r.color_hex || '#0284c7', flexShrink: 0 }} />
                                            <Typography variant="body2">{r.nombre}</Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Filtro por Estado */}
                        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 160 } }}>
                            <InputLabel id="filter-estado-label">Estado</InputLabel>
                            <Select
                                labelId="filter-estado-label"
                                value={selectedEstado}
                                label="Estado"
                                onChange={(e) => {
                                    setSelectedEstado(e.target.value);
                                    applyFilters({ estado_id: e.target.value });
                                }}
                            >
                                <MenuItem value="all">
                                    <Typography variant="body2">Todos los estados</Typography>
                                </MenuItem>
                                {estados.map((est) => (
                                    <MenuItem key={est.id} value={String(est.id)}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    bgcolor: est.color_hex || '#94a3b8',
                                                }}
                                            />
                                            <Typography variant="body2">{est.nombre}</Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
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
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', minWidth: 260, py: 1.5 }}>
                                    ESPECIALIDAD ACADÉMICA
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', minWidth: 160 }}>
                                    RUBRO
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', minWidth: 140, textAlign: 'center' }}>
                                    ESTADO
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', minWidth: 200 }}>
                                    RECURSOS MULTIMEDIA
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', width: 120, textAlign: 'center' }}>
                                    PRECIO
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', width: 120, textAlign: 'right' }}>
                                    ACCIONES
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {especialidades.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 5 }}>
                                        <SchoolIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1.2 }} />
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                            No se encontraron especialidades registradas
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.8 }}>
                                            {search || selectedCarrera !== 'all' || selectedRubro !== 'all' || selectedComercio !== 'all' || selectedEstado !== 'all'
                                                ? 'No hay registros que coincidan con los filtros aplicados.'
                                                : 'Aún no se han registrado especialidades para las carreras técnicas.'}
                                        </Typography>
                                        {search || selectedCarrera !== 'all' || selectedRubro !== 'all' || selectedComercio !== 'all' || selectedEstado !== 'all' ? (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<ClearIcon />}
                                                onClick={() => {
                                                    setSearch('');
                                                    setSelectedCarrera('all');
                                                    setSelectedRubro('all');
                                                    setSelectedComercio('all');
                                                    setSelectedEstado('all');
                                                    applyFilters({ carrera_id: 'all', rubro_id: 'all', comercio_id: 'all', estado_id: 'all', search: '' });
                                                }}
                                                sx={{ textTransform: 'none', borderRadius: 1 }}
                                            >
                                                Limpiar Filtros
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={<AddIcon />}
                                                onClick={handleCreate}
                                                sx={{ textTransform: 'none', borderRadius: 1 }}
                                            >
                                                Crear Primera Especialidad
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                especialidades.map((esp) => (
                                    <TableRow key={esp.id} hover>
                                        {/* Especialidad */}
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: (theme) =>
                                                            theme.palette.mode === 'dark'
                                                                ? 'rgba(12, 67, 163, 0.3)'
                                                                : 'rgba(12, 67, 163, 0.08)',
                                                        color: 'primary.main',
                                                        width: 36,
                                                        height: 36,
                                                        borderRadius: 1,
                                                    }}
                                                >
                                                    <SchoolIcon fontSize="small" />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                                        {esp.nombre}
                                                    </Typography>
                                                    {esp.carrera ? (
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.1 }}>
                                                            <SchoolIcon sx={{ fontSize: 12 }} />
                                                            <span>Carrera: {esp.carrera.nombre}</span>
                                                        </Typography>
                                                    ) : (
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                            slug: {esp.slug}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        </TableCell>

                                        {/* Rubro */}
                                        <TableCell>
                                            {esp.rubro ? (
                                                <Chip
                                                    label={esp.rubro.nombre}
                                                    size="small"
                                                    sx={{
                                                        height: 24,
                                                        fontSize: '0.74rem',
                                                        fontWeight: 700,
                                                        bgcolor: esp.rubro.color_hex ? `${esp.rubro.color_hex}18` : 'primary.50',
                                                        color: esp.rubro.color_hex || 'primary.main',
                                                        border: '1px solid',
                                                        borderColor: esp.rubro.color_hex ? `${esp.rubro.color_hex}40` : 'primary.200',
                                                        borderRadius: 1,
                                                    }}
                                                />
                                            ) : (
                                                <Chip
                                                    label="Especialidad Libre"
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{
                                                        height: 22,
                                                        fontSize: '0.7rem',
                                                        color: 'text.secondary',
                                                        borderColor: 'divider',
                                                        bgcolor: 'action.hover',
                                                    }}
                                                />
                                            )}
                                        </TableCell>

                                        {/* Estado */}
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            {esp.estado ? (
                                                <Chip
                                                    label={esp.estado.nombre}
                                                    size="small"
                                                    sx={{
                                                        height: 24,
                                                        fontSize: '0.72rem',
                                                        fontWeight: 700,
                                                        bgcolor: esp.estado.color_hex ? `${esp.estado.color_hex}18` : 'grey.100',
                                                        color: esp.estado.color_hex || 'text.primary',
                                                        border: '1px solid',
                                                        borderColor: esp.estado.color_hex ? `${esp.estado.color_hex}40` : 'divider',
                                                        borderRadius: 1,
                                                    }}
                                                />
                                            ) : (
                                                <Typography variant="caption" color="text.disabled">
                                                    —
                                                </Typography>
                                            )}
                                        </TableCell>

                                        {/* Recursos Multimedia */}
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                                {esp.flyer && (
                                                    <Tooltip title="Ver Flyer / Afiche">
                                                        <IconButton
                                                            size="small"
                                                            href={esp.flyer}
                                                            target="_blank"
                                                            sx={{
                                                                color: '#0284c7',
                                                                bgcolor: 'rgba(2, 132, 199, 0.08)',
                                                                '&:hover': { bgcolor: 'rgba(2, 132, 199, 0.16)' },
                                                                borderRadius: 1,
                                                            }}
                                                        >
                                                            <ImageIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                {esp.brochure && (
                                                    <Tooltip title="Ver Brochure PDF">
                                                        <IconButton
                                                            size="small"
                                                            href={esp.brochure}
                                                            target="_blank"
                                                            sx={{
                                                                color: '#dc2626',
                                                                bgcolor: 'rgba(220, 38, 38, 0.08)',
                                                                '&:hover': { bgcolor: 'rgba(220, 38, 38, 0.16)' },
                                                                borderRadius: 1,
                                                            }}
                                                        >
                                                            <DescriptionIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                {esp.youtube && (
                                                    <Tooltip title="Ver Video en YouTube">
                                                        <IconButton
                                                            size="small"
                                                            href={esp.youtube}
                                                            target="_blank"
                                                            sx={{
                                                                color: '#ef4444',
                                                                bgcolor: 'rgba(239, 68, 68, 0.08)',
                                                                '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.16)' },
                                                                borderRadius: 1,
                                                            }}
                                                        >
                                                            <YouTubeIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                {esp.actualizado_drive && (
                                                    <Tooltip title="Carpeta Google Drive">
                                                        <IconButton
                                                            size="small"
                                                            href={esp.actualizado_drive}
                                                            target="_blank"
                                                            sx={{
                                                                color: '#059669',
                                                                bgcolor: 'rgba(5, 150, 105, 0.08)',
                                                                '&:hover': { bgcolor: 'rgba(5, 150, 105, 0.16)' },
                                                                borderRadius: 1,
                                                            }}
                                                        >
                                                            <CloudDoneIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                {!esp.flyer && !esp.brochure && !esp.youtube && !esp.actualizado_drive && (
                                                    <Typography variant="caption" color="text.disabled">
                                                        Sin recursos
                                                    </Typography>
                                                )}
                                            </Box>
                                        </TableCell>

                                        {/* Precio */}
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            {esp.precio ? (
                                                <Typography variant="body2" sx={{ fontWeight: 800, color: 'success.main' }}>
                                                    {esp.precio}
                                                </Typography>
                                            ) : (
                                                <Typography variant="caption" color="text.disabled">
                                                    —
                                                </Typography>
                                            )}
                                        </TableCell>

                                        {/* Acciones */}
                                        <TableCell sx={{ textAlign: 'right' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                                                <Tooltip title="Editar Especialidad">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEdit(esp)}
                                                        sx={{ color: 'primary.main', '&:hover': { bgcolor: 'primary.50' } }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Eliminar Especialidad">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDelete(esp)}
                                                        sx={{ color: 'error.main', '&:hover': { bgcolor: 'error.50' } }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Resumen inferior */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                        Mostrando <strong>{especialidades.length}</strong> especialidades registradas
                    </Typography>
                </Box>
            </Box>

            {/* Modal Dialog */}
            <EspecialidadDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                especialidad={editingEspecialidad}
                comercios={comercios}
                carreras={carreras}
                rubros={rubros}
                estados={estados}
                defaultComercioId={selectedComercio !== 'all' ? Number(selectedComercio) : null}
                defaultCarreraId={selectedCarrera !== 'all' && selectedCarrera !== 'no_corresponde' ? Number(selectedCarrera) : null}
                defaultRubroId={selectedRubro !== 'all' ? Number(selectedRubro) : null}
            />
        </>
    );
}

EspecialidadesIndex.layout = () => ({
    breadcrumbs: [
        {
            title: 'Panel Principal',
            href: '/dashboard',
        },
        {
            title: 'Carreras Técnicas',
            href: '/admin/carreras',
        },
        {
            title: 'Especialidades',
            href: '/admin/especialidades',
        },
    ],
});
