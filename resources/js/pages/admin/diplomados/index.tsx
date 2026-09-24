import { Head, usePage, router, Link } from '@inertiajs/react';
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
import LaunchIcon from '@mui/icons-material/Launch';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { ComercioBadge, ComercioAllBadge } from '@/components/admin/comercio-badge';
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
    ListSubheader,
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
import { DiplomadoDialog } from '@/components/admin/diplomado-dialog';
import { useNotification } from '@/hooks/use-notification';
import { confirmDeleteAlert } from '@/lib/swal';
import { dashboard } from '@/routes';
import type { Carrera, Comercio, Diplomado, Grupo, Rubro, Estado } from '@/types';

interface Props {
    diplomados: Diplomado[];
    comercios: Comercio[];
    carreras?: Carrera[];
    grupos?: Grupo[];
    rubros?: Rubro[];
    estados?: Estado[];
    filters: {
        comercio_id?: string;
        carrera_id?: string;
        estado_id?: string;
        rubro_id?: string;
        tipo?: string;
        search?: string;
    };
}

export default function DiplomadosIndex({
    diplomados = [],
    comercios = [],
    carreras = [],
    rubros = [],
    estados = [],
    filters,
}: Props) {
    const page = usePage();

    const { notify } = useNotification();

    const [search, setSearch] = useState<string>(filters.search || '');
    const [selectedComercio, setSelectedComercio] = useState<string>(filters.comercio_id || 'all');
    const [selectedCarrera, setSelectedCarrera] = useState<string>(filters.carrera_id || 'all');
    const [selectedRubroId, setSelectedRubroId] = useState<string>(filters.rubro_id || filters.tipo || 'all');
    const [selectedEstado, setSelectedEstado] = useState<string>(filters.estado_id || 'all');

    useEffect(() => {
        setSelectedComercio(filters.comercio_id || 'all');
        setSelectedCarrera(filters.carrera_id || 'all');
        setSelectedRubroId(filters.rubro_id || filters.tipo || 'all');
        setSelectedEstado(filters.estado_id || 'all');
        setSearch(filters.search || '');
    }, [filters]);

    const filteredCarreras = useMemo(() => {
        if (!selectedComercio || selectedComercio === 'all') return carreras;
        return carreras.filter((c) => String(c.comercio_id) === String(selectedComercio));
    }, [carreras, selectedComercio]);

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDiplomado, setSelectedDiplomado] = useState<Diplomado | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        if (params.get('create') === '1' || params.get('create') === 'true') {
            setSelectedDiplomado(null);
            setDialogOpen(true);
        } else if (params.get('edit_id')) {
            const id = Number(params.get('edit_id'));
            const found = diplomados.find((d) => d.id === id);
            if (found) {
                setSelectedDiplomado(found);
                setDialogOpen(true);
            }
        }
    }, [diplomados]);

    const applyFilters = (newFilters: {
        comercio_id?: string;
        carrera_id?: string;
        estado_id?: string;
        rubro_id?: string;
        search?: string;
    }) => {
        router.get(
            `/admin/diplomados`,
            {
                comercio_id: newFilters.comercio_id !== undefined ? (newFilters.comercio_id === 'all' ? undefined : newFilters.comercio_id) : (selectedComercio === 'all' ? undefined : selectedComercio),
                carrera_id: newFilters.carrera_id !== undefined ? (newFilters.carrera_id === 'all' ? undefined : newFilters.carrera_id) : (selectedCarrera === 'all' ? undefined : selectedCarrera),
                estado_id: newFilters.estado_id !== undefined ? (newFilters.estado_id === 'all' ? undefined : newFilters.estado_id) : (selectedEstado === 'all' ? undefined : selectedEstado),
                rubro_id: newFilters.rubro_id !== undefined ? (newFilters.rubro_id === 'all' ? undefined : newFilters.rubro_id) : (selectedRubroId === 'all' ? undefined : selectedRubroId),
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

    const handleComercioChange = (val: string) => {
        setSelectedComercio(val);
        const carreraValida =
            val === 'all' ||
            selectedCarrera === 'all' ||
            selectedCarrera === 'no_corresponde' ||
            carreras.some((c) => String(c.id) === selectedCarrera && String(c.comercio_id) === String(val));
        const nextCarrera = carreraValida ? selectedCarrera : 'all';
        if (!carreraValida) {
            setSelectedCarrera('all');
        }
        applyFilters({ comercio_id: val, carrera_id: nextCarrera });
    };

    const handleCarreraChange = (val: string) => {
        setSelectedCarrera(val);
        applyFilters({ carrera_id: val });
    };

    const handleRubroChange = (val: string) => {
        setSelectedRubroId(val);
        applyFilters({ rubro_id: val });
    };

    const handleEstadoChange = (val: string) => {
        setSelectedEstado(val);
        applyFilters({ estado_id: val });
    };

    const handleCreate = () => {
        setSelectedDiplomado(null);
        setDialogOpen(true);
    };

    const handleEdit = (diplomado: Diplomado) => {
        setSelectedDiplomado(diplomado);
        setDialogOpen(true);
    };

    const handleDeletePrompt = async (diplomado: Diplomado) => {
        const confirmed = await confirmDeleteAlert({
            title: `¿Eliminar diplomado "${diplomado.nombre}"?`,
            text: 'Esta acción eliminará permanentemente el diplomado.',
            confirmButtonText: 'Sí, eliminar',
        });

        if (confirmed) {
            router.delete(`/admin/diplomados/${diplomado.id}`, {
                preserveScroll: true,
                onError: () => {
                    notify.error('No se pudo eliminar el diplomado.');
                },
            });
        }
    };

    const getRubroChip = (diplomado: Diplomado) => {
        const rubro = diplomado.rubro || (diplomado.rubro_id ? rubros.find((r) => r.id === diplomado.rubro_id) : null);
        if (rubro) {
            const color = rubro.color_hex || '#7c3aed';
            return (
                <Chip
                    label={rubro.nombre}
                    size="small"
                    sx={{
                        bgcolor: `${color}15`,
                        color: color,
                        border: `1px solid ${color}35`,
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        height: 22,
                        borderRadius: 0.8,
                    }}
                />
            );
        }

        if (diplomado.tipo && diplomado.tipo !== 'general' && diplomado.tipo !== 'sin_categoria' && diplomado.tipo !== 'libre') {
            return (
                <Chip
                    label={diplomado.tipo}
                    size="small"
                    sx={{
                        bgcolor: '#4f46e515',
                        color: '#4f46e5',
                        border: '1px solid #4f46e535',
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        height: 22,
                        borderRadius: 0.8,
                    }}
                />
            );
        }

        return (
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '0.75rem' }}>
                General / Libre
            </Typography>
        );
    };

    return (
        <>
            <Head title="Diplomados" />

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
                                <WorkspacePremiumIcon fontSize="medium" />
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
                                        Diplomados
                                    </Typography>
                                    <Chip
                                        label={`${diplomados.length} PROGRAMAS`}
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
                                    Gestión de diplomados por rubros técnicos, brochures, flyers publicitarios, videos y recursos Drive.
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
                            Nuevo Diplomado
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
                    <Box component="form" onSubmit={handleSearchSubmit} sx={{ flex: 1, maxWidth: { xs: '100%', sm: 380 } }}>
                        <TextField
                            placeholder="Buscar diplomado, tema o precio..."
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

                    <Box sx={{ display: 'flex', gap: 1.2, flexWrap: 'wrap' }}>
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                            <InputLabel id="filtro-comercio-label">Filtrar por Comercio</InputLabel>
                            <Select
                                labelId="filtro-comercio-label"
                                value={selectedComercio}
                                label="Filtrar por Comercio"
                                onChange={(e) => handleComercioChange(e.target.value)}
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

                        {/* Filtro por Carrera Matriz */}
                        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 190 } }}>
                            <InputLabel id="filter-carrera-label">Carrera Matriz</InputLabel>
                            <Select
                                labelId="filter-carrera-label"
                                value={selectedCarrera}
                                label="Carrera Matriz"
                                onChange={(e) => handleCarreraChange(e.target.value)}
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
                                            <SchoolIcon sx={{ fontSize: '1rem', color: 'primary.main' }} />
                                            <Typography variant="body2">
                                                {c.nombre}
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 220 }}>
                            <InputLabel id="filtro-rubro-label">Rubro / Categoría</InputLabel>
                            <Select
                                labelId="filtro-rubro-label"
                                value={selectedRubroId}
                                label="Rubro / Categoría"
                                onChange={(e) => handleRubroChange(e.target.value)}
                            >
                                <MenuItem value="all">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CategoryIcon sx={{ fontSize: '1.1rem', color: 'text.secondary' }} />
                                        <Typography variant="body2">Todos los rubros</Typography>
                                    </Box>
                                </MenuItem>
                                <MenuItem value="sin_categoria">
                                    <Typography variant="body2" color="text.secondary">Libre / Sin Categoría</Typography>
                                </MenuItem>
                                {rubros.map((r) => (
                                    <MenuItem key={r.id} value={String(r.id)}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LabelIcon sx={{ fontSize: '1.1rem', color: r.color_hex || '#7c3aed', flexShrink: 0 }} />
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
                                onChange={(e) => handleEstadoChange(e.target.value)}
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
                                    DIPLOMADO / ESPECIALIZACIÓN
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', minWidth: 140 }}>
                                    RUBRO
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', minWidth: 140, textAlign: 'center' }}>
                                    ESTADO
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', minWidth: 240 }}>
                                    RECURSOS MULTIMEDIA
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', width: 120, textAlign: 'center' }}>
                                    PRECIO
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', width: 130, textAlign: 'right' }}>
                                    ACCIONES
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {diplomados.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 5 }}>
                                        <WorkspacePremiumIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1.2 }} />
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                             No se encontraron diplomados registrados
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.8 }}>
                                            {search || selectedComercio !== 'all' || selectedCarrera !== 'all' || selectedRubroId !== 'all' || selectedEstado !== 'all'
                                                ? 'No hay registros que coincidan con los filtros aplicados.'
                                                : 'Aún no se han registrado diplomados.'}
                                        </Typography>
                                        {search || selectedComercio !== 'all' || selectedCarrera !== 'all' || selectedRubroId !== 'all' || selectedEstado !== 'all' ? (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<ClearIcon />}
                                                onClick={() => {
                                                    setSearch('');
                                                    setSelectedComercio('all');
                                                    setSelectedCarrera('all');
                                                    setSelectedRubroId('all');
                                                    setSelectedEstado('all');
                                                    applyFilters({ comercio_id: 'all', carrera_id: 'all', rubro_id: 'all', estado_id: 'all', search: '' });
                                                }}
                                                sx={{ borderRadius: 1 }}
                                            >
                                                Limpiar filtros
                                            </Button>
                                        ) : (
                                            <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={handleCreate} sx={{ borderRadius: 1 }}>
                                                Crear Diplomado
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                diplomados.map((diplomado) => {
                                    const brandColor = diplomado.comercio?.color_hex || '#16a34a';

                                    return (
                                        <TableRow
                                            key={diplomado.id}
                                            hover
                                            sx={{
                                                transition: 'background-color 0.15s ease',
                                                '&:hover': { bgcolor: 'action.hover' },
                                            }}
                                        >
                                            {/* Columna 1: Diplomado */}
                                            <TableCell sx={{ py: 1.8 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8 }}>
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: `${brandColor}18`,
                                                            color: brandColor,
                                                            fontWeight: 900,
                                                            fontSize: '0.8rem',
                                                            width: 38,
                                                            height: 38,
                                                            borderRadius: 1,
                                                            border: `1px solid ${brandColor}35`,
                                                        }}
                                                    >
                                                        <WorkspacePremiumIcon fontSize="small" />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '0.92rem' }}>
                                                            {diplomado.nombre}
                                                        </Typography>
                                                        {diplomado.carrera && (
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.1 }}>
                                                                <SchoolIcon sx={{ fontSize: 12 }} />
                                                                <span>Carrera: {diplomado.carrera.nombre}</span>
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </TableCell>

                                            {/* Columna: Rubro */}
                                            <TableCell>
                                                {getRubroChip(diplomado)}
                                            </TableCell>

                                            {/* Columna: Estado */}
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                {diplomado.estado ? (
                                                    <Chip
                                                        label={diplomado.estado.nombre}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: diplomado.estado.color_hex ? `${diplomado.estado.color_hex}18` : 'grey.100',
                                                            color: diplomado.estado.color_hex || 'text.primary',
                                                            border: `1px solid ${diplomado.estado.color_hex ? `${diplomado.estado.color_hex}40` : 'divider'}`,
                                                            fontWeight: 700,
                                                            fontSize: '0.72rem',
                                                            height: 24,
                                                            borderRadius: 1,
                                                        }}
                                                    />
                                                ) : (
                                                    <Typography variant="caption" color="text.disabled">—</Typography>
                                                )}
                                            </TableCell>

                                            {/* Columna: Recursos Multimedia */}
                                            <TableCell>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, alignItems: 'center' }}>
                                                    {diplomado.brochure && (
                                                        <Button
                                                            href={diplomado.brochure}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            size="small"
                                                            variant="outlined"
                                                            startIcon={<DescriptionIcon sx={{ fontSize: 13 }} />}
                                                            endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                            sx={{ textTransform: 'none', fontSize: '0.72rem', py: 0.2, px: 0.8, height: 22, borderRadius: 0.8 }}
                                                        >
                                                            Brochure
                                                        </Button>
                                                    )}
                                                    {diplomado.flyer && (
                                                        <Button
                                                            href={diplomado.flyer}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            size="small"
                                                            variant="outlined"
                                                            color="warning"
                                                            startIcon={<ImageIcon sx={{ fontSize: 13 }} />}
                                                            endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                            sx={{ textTransform: 'none', fontSize: '0.72rem', py: 0.2, px: 0.8, height: 22, borderRadius: 0.8 }}
                                                        >
                                                            Flyer
                                                        </Button>
                                                    )}
                                                    {diplomado.youtube && (
                                                        <Button
                                                            href={diplomado.youtube}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            size="small"
                                                            variant="outlined"
                                                            color="error"
                                                            startIcon={<YouTubeIcon sx={{ fontSize: 13 }} />}
                                                            endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                            sx={{ textTransform: 'none', fontSize: '0.72rem', py: 0.2, px: 0.8, height: 22, borderRadius: 0.8 }}
                                                        >
                                                            YouTube
                                                        </Button>
                                                    )}
                                                    {diplomado.actualizado_drive && (
                                                        <Button
                                                            href={diplomado.actualizado_drive}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            size="small"
                                                            variant="outlined"
                                                            color="success"
                                                            startIcon={<CloudDoneIcon sx={{ fontSize: 13 }} />}
                                                            endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                            sx={{ textTransform: 'none', fontSize: '0.72rem', py: 0.2, px: 0.8, height: 22, borderRadius: 0.8 }}
                                                        >
                                                            Drive
                                                        </Button>
                                                    )}
                                                </Box>
                                            </TableCell>

                                            {/* Columna 5: Precio */}
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                {diplomado.precio ? (
                                                    <Chip
                                                        label={diplomado.precio}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: (theme) =>
                                                                theme.palette.mode === 'dark'
                                                                    ? 'rgba(12, 67, 163, 0.25)'
                                                                    : 'rgba(12, 67, 163, 0.08)',
                                                            color: 'primary.main',
                                                            fontWeight: 800,
                                                            fontSize: '0.74rem',
                                                            height: 22,
                                                            borderRadius: 0.8,
                                                        }}
                                                    />
                                                ) : (
                                                    <Typography variant="caption" color="text.disabled">-</Typography>
                                                )}
                                            </TableCell>

                                            {/* Columna 6: Acciones */}
                                            <TableCell sx={{ textAlign: 'right' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.8 }}>
                                                    <Tooltip title="Editar Diplomado" arrow>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleEdit(diplomado)}
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

                                                    <Tooltip title="Eliminar Diplomado" arrow>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDeletePrompt(diplomado)}
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
                            Mostrando <strong>{diplomados.length}</strong> diplomados y especializaciones
                        </Typography>
                    </Box>
                </TableContainer>
            </Box>

            {/* MODALES Y DIÁLOGOS CRUD */}
            <DiplomadoDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                diplomado={selectedDiplomado}
                comercios={comercios}
                carreras={carreras}
                rubros={rubros}
                estados={estados}
                defaultComercioId={selectedComercio !== 'all' ? Number(selectedComercio) : undefined}
                defaultCarreraId={filters.carrera_id && filters.carrera_id !== 'all' && filters.carrera_id !== 'no_corresponde' ? Number(filters.carrera_id) : undefined}
            />
        </>
    );
}

DiplomadosIndex.layout = () => ({
    breadcrumbs: [
        {
            title: 'Panel Principal',
            href: '/dashboard',
        },
        {
            title: 'Diplomados',
            href: '/admin/diplomados',
        },
    ],
});
