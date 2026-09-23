import { Head, router, usePage } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import TagsIcon from '@mui/icons-material/Sell';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import CategoryIcon from '@mui/icons-material/Category';
import AwardIcon from '@mui/icons-material/EmojiEvents';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import {
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
import { useState } from 'react';
import { RubroDialog } from '@/components/admin/rubro-dialog';
import { useNotification } from '@/hooks/use-notification';
import { confirmDeleteAlert, showErrorAlert } from '@/lib/swal';
import { dashboard } from '@/routes';
import type { Rubro } from '@/types';

interface RubrosIndexProps {
    rubros: Rubro[];
    categorias: string[];
    filters: {
        search?: string | null;
        categoria?: string | null;
        activo?: string | null;
    };
}

export default function RubrosIndex({
    rubros = [],
    categorias = [],
    filters = {},
}: RubrosIndexProps) {
    
    
    const { notify } = useNotification();

    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategoria, setSelectedCategoria] = useState(filters.categoria || 'all');
    const [selectedActivo, setSelectedActivo] = useState(filters.activo || 'all');

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedRubro, setSelectedRubro] = useState<Rubro | null>(null);

    const applyFilters = (newFilters: {
        search?: string;
        categoria?: string;
        activo?: string;
    }) => {
        const query: Record<string, string> = {};

        const s = newFilters.search !== undefined ? newFilters.search : search;
        if (s.trim()) query.search = s.trim();

        const c = newFilters.categoria !== undefined ? newFilters.categoria : selectedCategoria;
        if (c && c !== 'all') query.categoria = c;

        const a = newFilters.activo !== undefined ? newFilters.activo : selectedActivo;
        if (a && a !== 'all') query.activo = a;

        router.get(`/admin/rubros`, query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
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
        setSelectedRubro(null);
        setDialogOpen(true);
    };

    const handleEdit = (rubro: Rubro) => {
        setSelectedRubro(rubro);
        setDialogOpen(true);
    };

    const handleDelete = async (rubro: Rubro) => {
        const diplomados = rubro.diplomados_count || 0;
        const cursos = rubro.cursos_count || 0;
        const especialidades = rubro.especialidades_count || 0;
        const totalAsociados = diplomados + cursos + especialidades;

        if (totalAsociados > 0) {
            const detalles: string[] = [];
            if (especialidades > 0) {
                detalles.push(`${especialidades} especialidad${especialidades > 1 ? 'es' : ''}`);
            }
            if (diplomados > 0) {
                detalles.push(`${diplomados} diplomado${diplomados > 1 ? 's' : ''}`);
            }
            if (cursos > 0) {
                detalles.push(`${cursos} curso${cursos > 1 ? 's' : ''}`);
            }

            const detallesTexto = detalles.join(', ');
            const mensaje = `No se puede eliminar el rubro "${rubro.nombre}" porque tiene ${detallesTexto} asociado${totalAsociados > 1 ? 's' : ''}. Si deseas ocultarlo del catálogo, puedes desactivarlo desde la opción de editar.`;

            await showErrorAlert('No se puede eliminar el rubro', mensaje);
            notify.error(mensaje);
            return;
        }

        const confirmed = await confirmDeleteAlert({
            title: '¿Eliminar Rubro?',
            text: `¿Estás seguro de eliminar permanentemente el rubro "${rubro.nombre}"? Esta acción no se puede deshacer.`,
        });

        if (confirmed) {
            router.delete(`/admin/rubros/${rubro.id}`, {
                preserveScroll: true,
                onSuccess: (page) => {
                    const pageAny = page as any;
                    const isError =
                        pageAny?.flash?.toast?.type === 'error' ||
                        pageAny?.props?.flash?.toast?.type === 'error' ||
                        pageAny?.props?.flash?.error;

                    if (!isError) {
                        notify.success(`Rubro "${rubro.nombre}" eliminado con éxito.`);
                    }
                },
                onError: () => {
                    notify.error('No se pudo eliminar el rubro.');
                },
            });
        }
    };


    return (
        <>
            <Head title="Gestión de Rubros - Grupo Capsur" />

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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                                sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 1.2,
                                    bgcolor: (theme) =>
                                        theme.palette.mode === 'dark'
                                            ? 'rgba(124, 58, 237, 0.2)'
                                            : 'rgba(124, 58, 237, 0.1)',
                                    color: '#7c3aed',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid',
                                    borderColor: (theme) =>
                                        theme.palette.mode === 'dark'
                                            ? 'rgba(124, 58, 237, 0.4)'
                                            : 'rgba(124, 58, 237, 0.2)',
                                    flexShrink: 0,
                                }}
                            >
                                <TagsIcon fontSize="medium" />
                            </Box>
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                                        Gestión de Rubros y Especialidades
                                    </Typography>
                                    <Chip
                                        label={`${rubros.length} RUBROS`}
                                        size="small"
                                        sx={{
                                            height: 20,
                                            fontSize: '0.68rem',
                                            fontWeight: 800,
                                            bgcolor: (theme) =>
                                                theme.palette.mode === 'dark'
                                                    ? 'rgba(124, 58, 237, 0.2)'
                                                    : 'rgba(124, 58, 237, 0.1)',
                                            color: '#7c3aed',
                                            border: '1px solid',
                                            borderColor: (theme) =>
                                                theme.palette.mode === 'dark'
                                                    ? 'rgba(124, 58, 237, 0.4)'
                                                    : 'rgba(124, 58, 237, 0.2)',
                                        }}
                                    />
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.2, fontSize: '0.82rem' }}>
                                    Categorías dinámicas para organizar y filtrar diplomados y cursos en todo el catálogo.
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
                                borderRadius: 1.2,
                                whiteSpace: 'nowrap',
                                alignSelf: { xs: 'stretch', sm: 'center' },
                            }}
                        >
                            Nuevo Rubro
                        </Button>
                    </Box>
                </Paper>


                {/* BARRA DE HERRAMIENTAS Y FILTROS */}
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
                    <Box component="form" onSubmit={handleSearchSubmit} sx={{ flex: 1, maxWidth: { xs: '100%', sm: 360 } }}>
                        <TextField
                            placeholder="Buscar por nombre, clave o descripción..."
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
                            <InputLabel id="filter-categoria-label">Categoría / Agrupación</InputLabel>
                            <Select
                                labelId="filter-categoria-label"
                                value={selectedCategoria}
                                label="Categoría / Agrupación"
                                onChange={(e) => {
                                    setSelectedCategoria(e.target.value);
                                    applyFilters({ categoria: e.target.value });
                                }}
                            >
                                <MenuItem value="all">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CategoryIcon sx={{ fontSize: '1.1rem', color: 'text.secondary' }} />
                                        <Typography variant="body2">Todas las categorías</Typography>
                                    </Box>
                                </MenuItem>
                                {categorias.map((cat) => (
                                    <MenuItem key={cat} value={cat}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CategoryIcon sx={{ fontSize: '1rem', color: 'primary.main' }} />
                                            <Typography variant="body2">{cat}</Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel id="filter-activo-label">Estado</InputLabel>
                            <Select
                                labelId="filter-activo-label"
                                value={selectedActivo}
                                label="Estado"
                                onChange={(e) => {
                                    setSelectedActivo(e.target.value);
                                    applyFilters({ activo: e.target.value });
                                }}
                            >
                                <MenuItem value="all">Todos los estados</MenuItem>
                                <MenuItem value="true">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CheckCircleIcon sx={{ fontSize: '1rem', color: 'success.main' }} />
                                        <Typography variant="body2">Activos</Typography>
                                    </Box>
                                </MenuItem>
                                <MenuItem value="false">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <BlockIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                                        <Typography variant="body2">Inactivos</Typography>
                                    </Box>
                                </MenuItem>
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
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', minWidth: 220, py: 1.5 }}>
                                    RUBRO / DISTINTIVO
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', minWidth: 180 }}>
                                    CATEGORÍA / GRUPO
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', minWidth: 180 }}>
                                    PROGRAMAS VINCULADOS
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', width: 100, textAlign: 'center' }}>
                                    ESTADO
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', width: 80, textAlign: 'center' }}>
                                    ORDEN
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', width: 120, textAlign: 'right' }}>
                                    ACCIONES
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rubros.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 5 }}>
                                        <TagsIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1.2 }} />
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                            No se encontraron rubros registrados
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.8 }}>
                                            {search || selectedCategoria !== 'all' || selectedActivo !== 'all'
                                                ? 'No hay registros que coincidan con los filtros aplicados.'
                                                : 'Aún no se han registrado rubros.'}
                                        </Typography>
                                        {search || selectedCategoria !== 'all' || selectedActivo !== 'all' ? (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<ClearIcon />}
                                                onClick={() => {
                                                    setSearch('');
                                                    setSelectedCategoria('all');
                                                    setSelectedActivo('all');
                                                    applyFilters({ categoria: 'all', activo: 'all', search: '' });
                                                }}
                                                sx={{ borderRadius: 1 }}
                                            >
                                                Limpiar filtros
                                            </Button>
                                        ) : (
                                            <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={handleCreate} sx={{ borderRadius: 1 }}>
                                                Crear Rubro
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rubros.map((rubro) => {
                                    const color = rubro.color_hex || '#7c3aed';

                                    return (
                                        <TableRow
                                            key={rubro.id}
                                            hover
                                            sx={{
                                                transition: 'background-color 0.15s ease',
                                                '&:hover': { bgcolor: 'action.hover' },
                                            }}
                                        >
                                            {/* Columna 1: Rubro / Distintivo */}
                                            <TableCell sx={{ py: 1.8 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8 }}>
                                                    <Box
                                                        sx={{
                                                            width: 36,
                                                            height: 36,
                                                            borderRadius: 1.2,
                                                            bgcolor: `${color}18`,
                                                            color: color,
                                                            border: `1px solid ${color}40`,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontWeight: 900,
                                                            fontSize: '0.82rem',
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                width: 14,
                                                                height: 14,
                                                                borderRadius: '50%',
                                                                bgcolor: color,
                                                            }}
                                                        />
                                                    </Box>
                                                    <Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '0.92rem' }}>
                                                                {rubro.nombre}
                                                            </Typography>
                                                            <Chip
                                                                label={rubro.nombre}
                                                                size="small"
                                                                sx={{
                                                                    height: 20,
                                                                    fontSize: '0.68rem',
                                                                    fontWeight: 700,
                                                                    bgcolor: `${color}15`,
                                                                    color: color,
                                                                    border: `1px solid ${color}35`,
                                                                }}
                                                            />
                                                        </Box>
                                                        {rubro.descripcion && (
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.2 }}>
                                                                {rubro.descripcion}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </TableCell>

                                            {/* Columna 2: Categoría */}
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {rubro.categoria || (
                                                        <Typography variant="caption" color="text.disabled">
                                                            Sin categoría
                                                        </Typography>
                                                    )}
                                                </Typography>
                                            </TableCell>

                                            {/* Columna 3: Programas y Especialidades Vinculados */}
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                    <Chip
                                                        icon={<CategoryIcon sx={{ fontSize: '13px !important' }} />}
                                                        label={`${rubro.especialidades_count || 0} Especialidades`}
                                                        size="small"
                                                        variant="outlined"
                                                        color={(rubro.especialidades_count || 0) > 0 ? 'warning' : 'default'}
                                                        sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700 }}
                                                    />
                                                    <Chip
                                                        icon={<AwardIcon sx={{ fontSize: '13px !important' }} />}
                                                        label={`${rubro.diplomados_count || 0} Diplomados`}
                                                        size="small"
                                                        variant="outlined"
                                                        color={(rubro.diplomados_count || 0) > 0 ? 'primary' : 'default'}
                                                        sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700 }}
                                                    />
                                                    <Chip
                                                        icon={<MenuBookIcon sx={{ fontSize: '13px !important' }} />}
                                                        label={`${rubro.cursos_count || 0} Cursos`}
                                                        size="small"
                                                        variant="outlined"
                                                        color={(rubro.cursos_count || 0) > 0 ? 'secondary' : 'default'}
                                                        sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700 }}
                                                    />
                                                </Box>
                                            </TableCell>

                                            {/* Columna 4: Estado */}
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                {rubro.activo ? (
                                                    <Chip
                                                        icon={<CheckCircleIcon sx={{ fontSize: '13px !important' }} />}
                                                        label="Activo"
                                                        size="small"
                                                        color="success"
                                                        variant="outlined"
                                                        sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700 }}
                                                    />
                                                ) : (
                                                    <Chip
                                                        icon={<BlockIcon sx={{ fontSize: '13px !important' }} />}
                                                        label="Inactivo"
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ height: 22, fontSize: '0.7rem', color: 'text.secondary' }}
                                                    />
                                                )}
                                            </TableCell>

                                            {/* Columna 5: Orden */}
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                                                    {rubro.orden}
                                                </Typography>
                                            </TableCell>

                                            {/* Columna 6: Acciones */}
                                            <TableCell sx={{ textAlign: 'right' }}>
                                                <Box sx={{ display: 'flex', gap: 0.8, justifyContent: 'flex-end' }}>
                                                    <Tooltip title="Editar Rubro">
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() => handleEdit(rubro)}
                                                            sx={{
                                                                border: '1px solid',
                                                                borderColor: 'divider',
                                                                borderRadius: 1,
                                                                '&:hover': { bgcolor: 'primary.lighter' },
                                                            }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>

                                                    {(() => {
                                                        const totalAsociados = (rubro.especialidades_count || 0) + (rubro.diplomados_count || 0) + (rubro.cursos_count || 0);
                                                        return (
                                                            <Tooltip title={totalAsociados > 0 ? `No se puede eliminar (${totalAsociados} elementos vinculados)` : "Eliminar Rubro"}>
                                                                <span>
                                                                    <IconButton
                                                                        size="small"
                                                                        color="error"
                                                                        onClick={() => handleDelete(rubro)}
                                                                        sx={{
                                                                            border: '1px solid',
                                                                            borderColor: totalAsociados > 0 ? 'action.disabledBackground' : 'divider',
                                                                            borderRadius: 1,
                                                                            opacity: totalAsociados > 0 ? 0.6 : 1,
                                                                            '&:hover': { bgcolor: totalAsociados > 0 ? 'action.hover' : 'error.lighter' },
                                                                        }}
                                                                    >
                                                                        <DeleteIcon fontSize="small" />
                                                                    </IconButton>
                                                                </span>
                                                            </Tooltip>
                                                        );
                                                    })()}
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
                            Mostrando <strong>{rubros.length}</strong> rubros configurados
                        </Typography>
                    </Box>
                </TableContainer>
            </Box>

            {/* DIÁLOGO MODAL CREAR / EDITAR */}
            <RubroDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                rubro={selectedRubro}
                categorias={categorias}
                
            />
        </>
    );
}

RubrosIndex.layout = () => ({
    breadcrumbs: [
        {
            title: 'Panel Principal',
            href: '/dashboard',
        },
        {
            title: 'Rubros y Especialidades',
            href: '/admin/rubros',
        },
    ],
});
