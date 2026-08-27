import { Head, usePage, router } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import ImageIcon from '@mui/icons-material/Image';
import LaunchIcon from '@mui/icons-material/Launch';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import StorefrontIcon from '@mui/icons-material/Storefront';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
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
import { useState } from 'react';
import { DiplomadoDialog } from '@/components/admin/diplomado-dialog';
import { useNotification } from '@/hooks/use-notification';
import { confirmDeleteAlert } from '@/lib/swal';
import { dashboard } from '@/routes';
import type { Carrera, Comercio, Diplomado, Grupo, Rubro } from '@/types';

interface Props {
    diplomados: Diplomado[];
    comercios: Comercio[];
    carreras?: Carrera[];
    grupos?: Grupo[];
    rubros?: Rubro[];
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
    rubros = [],
    filters,
}: Props) {
    const page = usePage();
    
    
    const { notify } = useNotification();

    const [search, setSearch] = useState<string>(filters.search || '');
    const [selectedComercio, setSelectedComercio] = useState<string>(filters.comercio_id || 'all');
    const [selectedTipo, setSelectedTipo] = useState<string>(filters.tipo || 'all');

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDiplomado, setSelectedDiplomado] = useState<Diplomado | null>(null);

    const applyFilters = (newFilters: {
        comercio_id?: string;
        tipo?: string;
        search?: string;
    }) => {
        router.get(
            `/admin/diplomados`,
            {
                comercio_id: newFilters.comercio_id !== undefined ? (newFilters.comercio_id === 'all' ? undefined : newFilters.comercio_id) : (selectedComercio === 'all' ? undefined : selectedComercio),
                tipo: newFilters.tipo !== undefined ? (newFilters.tipo === 'all' ? undefined : newFilters.tipo) : (selectedTipo === 'all' ? undefined : selectedTipo),
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
        applyFilters({ comercio_id: val });
    };

    const handleTipoChange = (val: string) => {
        setSelectedTipo(val);
        applyFilters({ tipo: val });
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
                onSuccess: () => {
                    notify.success(`Diplomado "${diplomado.nombre}" eliminado exitosamente.`);
                },
                onError: () => {
                    notify.error('No se pudo eliminar el diplomado.');
                },
            });
        }
    };

    const getTipoChip = (tipo?: string | null) => {
        if (!tipo || tipo === 'general' || tipo === 'libre' || tipo === 'sin_categoria') {
            return (
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '0.75rem' }}>
                    General / Libre
                </Typography>
            );
        }

        const rubroMatch = rubros.find((r) => r.clave === tipo);
        if (rubroMatch) {
            const color = rubroMatch.color_hex || '#7c3aed';
            return (
                <Chip
                    label={rubroMatch.nombre}
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

        const tipoLabels: Record<string, { label: string; color: string }> = {
            ambientales: { label: 'Ambientales', color: '#059669' },
            calidad_isos: { label: 'Calidad ISOs', color: '#0284c7' },
            mineros: { label: 'Mineros', color: '#d97706' },
            administracion: { label: 'Administración', color: '#0d9488' },
            arquitectura_ingenieria: { label: 'Arq. e Ingeniería', color: '#6366f1' },
            osha: { label: 'OSHA', color: '#dc2626' },
            comercio_exterior: { label: 'Comex', color: '#0891b2' },
            rubro_legal: { label: 'Rubro Legal', color: '#7c3aed' },
            no_actualizados: { label: 'No Actualizado', color: '#64748b' },
            nombramiento: { label: 'Nombramiento', color: '#7c3aed' },
            secundaria: { label: 'Secundaria', color: '#059669' },
            generico: { label: 'Genérico', color: '#0284c7' },
        };

        const config = tipoLabels[tipo] || { label: tipo, color: '#4f46e5' };

        return (
            <Chip
                label={config.label}
                size="small"
                sx={{
                    bgcolor: `${config.color}15`,
                    color: config.color,
                    border: `1px solid ${config.color}35`,
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    height: 22,
                    borderRadius: 0.8,
                }}
            />
        );
    };

    return (
        <>
            <Head title="Diplomados y Especializaciones - Grupo Capsur" />

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
                                        Diplomados y Especializaciones
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

                        <FormControl size="small" sx={{ minWidth: 220 }}>
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
                                <MenuItem value="all">🎓 Todos los rubros</MenuItem>
                                <MenuItem value="sin_categoria">Libre / Sin Categoría</MenuItem>
                                {rubros && rubros.length > 0 ? (
                                    rubros.map((r) => (
                                        <MenuItem key={r.clave} value={r.clave}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: r.color_hex || '#7c3aed', flexShrink: 0 }} />
                                                {r.nombre}
                                            </Box>
                                        </MenuItem>
                                    ))
                                ) : (
                                    <>
                                        <ListSubheader sx={{ fontWeight: 800, color: 'text.primary', lineHeight: '30px' }}>CECAVA</ListSubheader>
                                        <MenuItem value="ambientales">🌿 Ambientales</MenuItem>
                                        <MenuItem value="calidad_isos">🏆 Calidad e ISOs</MenuItem>
                                        <MenuItem value="mineros">⛏️ Mineros</MenuItem>
                                        <MenuItem value="administracion">💼 Administración</MenuItem>
                                        <MenuItem value="arquitectura_ingenieria">📐 Arq. e Ingeniería</MenuItem>
                                        <MenuItem value="osha">🦺 OSHA</MenuItem>
                                        <MenuItem value="comercio_exterior">🚢 Comercio Exterior</MenuItem>
                                        <MenuItem value="rubro_legal">⚖️ Rubro Legal</MenuItem>
                                        <MenuItem value="no_actualizados">📁 No Actualizados</MenuItem>

                                        <ListSubheader sx={{ fontWeight: 800, color: 'text.primary', lineHeight: '30px' }}>MAGISTER</ListSubheader>
                                        <MenuItem value="nombramiento">📝 Nombramiento</MenuItem>
                                        <MenuItem value="secundaria">🏫 Secundaria</MenuItem>
                                        <MenuItem value="generico">🎓 Genérico</MenuItem>
                                    </>
                                )}
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
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', minWidth: 150 }}>
                                    COMERCIO
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', minWidth: 140 }}>
                                    RUBRO / TIPO
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
                                            {search || selectedComercio !== 'all' || selectedTipo !== 'all'
                                                ? 'No hay registros que coincidan con los filtros aplicados.'
                                                : 'Aún no se han registrado diplomados.'}
                                        </Typography>
                                        {search || selectedComercio !== 'all' || selectedTipo !== 'all' ? (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<ClearIcon />}
                                                onClick={() => {
                                                    setSearch('');
                                                    setSelectedComercio('all');
                                                    setSelectedTipo('all');
                                                    applyFilters({ comercio_id: 'all', tipo: 'all', search: '' });
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

                                            {/* Columna 2: Comercio */}
                                            <TableCell>
                                                {diplomado.comercio ? (
                                                    <Chip
                                                        icon={<StorefrontIcon sx={{ fontSize: '13px !important' }} />}
                                                        label={diplomado.comercio.nombre}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: `${brandColor}18`,
                                                            color: brandColor,
                                                            border: `1px solid ${brandColor}35`,
                                                            fontWeight: 700,
                                                            fontSize: '0.72rem',
                                                            height: 24,
                                                            borderRadius: 0.8,
                                                        }}
                                                    />
                                                ) : (
                                                    <Typography variant="caption" color="text.disabled">-</Typography>
                                                )}
                                            </TableCell>

                                            {/* Columna 3: Rubro / Tipo */}
                                            <TableCell>
                                                {getTipoChip(diplomado.tipo)}
                                            </TableCell>

                                            {/* Columna 4: Recursos Multimedia */}
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
