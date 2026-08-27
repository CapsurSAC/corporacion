import { Head, router, usePage } from '@inertiajs/react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import EditIcon from '@mui/icons-material/Edit';
import ImageIcon from '@mui/icons-material/Image';
import LightModeIcon from '@mui/icons-material/LightMode';
import SearchIcon from '@mui/icons-material/Search';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Tab,
    Tabs,
    TextField,
    Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useNotification } from '@/hooks/use-notification';
import type { Comercio, Grupo } from '@/types';

interface Props {
    comercios: Comercio[];
    grupos: Grupo[];
    filters: {
        grupo_id?: string | number | null;
        search?: string | null;
    };
}

export default function LogosIndex({ comercios = [], grupos = [], filters = {} }: Props) {
    const page = usePage();
    
    const { notify } = useNotification();

    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedGrupo, setSelectedGrupo] = useState<string | number>(filters.grupo_id || 'all');

    // Estado del diálogo de edición de logos
    const [editingComercio, setEditingComercio] = useState<Comercio | null>(null);
    const [dialogTab, setDialogTab] = useState<number>(0);
    const [claroPath, setClaroPath] = useState<string>('');
    const [oscuroPath, setOscuroPath] = useState<string>('');
    const [claroFile, setClaroFile] = useState<File | null>(null);
    const [oscuroFile, setOscuroFile] = useState<File | null>(null);
    const [claroPreview, setClaroPreview] = useState<string | null>(null);
    const [oscuroPreview, setOscuroPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Filtrar comercios en el cliente para búsqueda en vivo
    const filteredComercios = useMemo(() => {
        return comercios.filter((c) => {
            const matchesGrupo =
                selectedGrupo === 'all' || String(c.grupo_id) === String(selectedGrupo);
            const matchesSearch =
                !searchQuery ||
                c.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (c.sigla && c.sigla.toLowerCase().includes(searchQuery.toLowerCase())) ||
                c.slug.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesGrupo && matchesSearch;
        });
    }, [comercios, selectedGrupo, searchQuery]);

    const handleOpenEdit = (comercio: Comercio) => {
        setEditingComercio(comercio);
        setClaroPath(comercio.logo_modo_claro || '');
        setOscuroPath(comercio.logo_modo_oscuro || '');
        setClaroFile(null);
        setOscuroFile(null);
        setClaroPreview(comercio.logo_modo_claro || null);
        setOscuroPreview(comercio.logo_modo_oscuro || null);
        setDialogTab(0);
    };

    const handleCloseEdit = () => {
        setEditingComercio(null);
        setClaroFile(null);
        setOscuroFile(null);
        setClaroPreview(null);
        setOscuroPreview(null);
    };

    const handleClaroFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setClaroFile(file);
            setClaroPreview(URL.createObjectURL(file));
        }
    };

    const handleOscuroFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setOscuroFile(file);
            setOscuroPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingComercio) return;

        setIsSubmitting(true);

        const formData = new FormData();
        if (claroFile) {
            formData.append('logo_modo_claro_file', claroFile);
        } else {
            formData.append('logo_modo_claro', claroPath);
        }

        if (oscuroFile) {
            formData.append('logo_modo_oscuro_file', oscuroFile);
        } else {
            formData.append('logo_modo_oscuro', oscuroPath);
        }

        router.post(`/admin/logos/${editingComercio.id}`, formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                notify.success(`Logos de ${editingComercio.nombre} actualizados con éxito.`);
                handleCloseEdit();
            },
            onError: (errors) => {
                setIsSubmitting(false);
                const firstMsg = Object.values(errors)[0] as string;
                notify.error(firstMsg || 'Error al actualizar los logotipos.');
            },
        });
    };

    return (
        <>
            <Head title="Gestión de Logos Institucionales - Grupo Capsur" />

            <Box
                sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    width: '100%',
                    boxSizing: 'border-box',
                }}
            >
                {/* Cabecera Principal */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, sm: 2.5 },
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                bgcolor: 'primary.main',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(12, 67, 163, 0.25)',
                            }}
                        >
                            <ImageIcon sx={{ fontSize: 28 }} />
                        </Box>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                                Logos Institucionales
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.2 }}>
                                Administra los logotipos de cada marca para el modo claro (fondos blancos) y modo oscuro (fondos oscuros).
                            </Typography>
                        </Box>
                    </Box>

                    <Chip
                        icon={<CheckCircleIcon color="success" />}
                        label={`${comercios.length} Marcas Registradas`}
                        variant="outlined"
                        sx={{ fontWeight: 700 }}
                    />
                </Paper>

                {/* Barra de Filtros y Búsqueda */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                        alignItems: { sm: 'center' },
                        justifyContent: 'space-between',
                    }}
                >
                    <TextField
                        size="small"
                        placeholder="Buscar por nombre o sigla de marca..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ minWidth: { xs: '100%', sm: 320 } }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: searchQuery ? (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => setSearchQuery('')}>
                                            <ClearIcon fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ) : null,
                            },
                        }}
                    />

                    <FormControl size="small" sx={{ minWidth: 220 }}>
                        <InputLabel>Grupo Corporativo</InputLabel>
                        <Select
                            value={selectedGrupo}
                            label="Grupo Corporativo"
                            onChange={(e) => setSelectedGrupo(e.target.value)}
                        >
                            <MenuItem value="all">Todos los Grupos ({comercios.length})</MenuItem>
                            {grupos.map((g) => (
                                <MenuItem key={g.id} value={g.id}>
                                    {g.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Paper>

                {/* Cuadrícula de Comercios con sus Logos */}
                <Grid container spacing={3}>
                    {filteredComercios.map((comercio) => {
                        const brandColor = comercio.color_hex || '#0c43a3';

                        return (
                            <Grid key={comercio.id} size={{ xs: 12, md: 6, lg: 6 }}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 2.5,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        borderTop: `4px solid ${brandColor}`,
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                                            borderColor: brandColor,
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {/* Fila del Título y Grupo */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: brandColor,
                                                        color: '#ffffff',
                                                        fontWeight: 800,
                                                        fontSize: '0.85rem',
                                                        width: 38,
                                                        height: 38,
                                                    }}
                                                >
                                                    {comercio.sigla || comercio.nombre.substring(0, 2).toUpperCase()}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                                                        {comercio.nombre}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {comercio.grupo?.nombre || 'Grupo no asignado'}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<EditIcon fontSize="small" />}
                                                onClick={() => handleOpenEdit(comercio)}
                                                sx={{
                                                    borderRadius: 1.5,
                                                    textTransform: 'none',
                                                    fontWeight: 700,
                                                    borderColor: 'divider',
                                                }}
                                            >
                                                Editar Logos
                                            </Button>
                                        </Box>

                                        {/* Paneles de Vista Previa: Claro y Oscuro */}
                                        <Grid container spacing={2}>
                                            {/* PANEL MODO CLARO */}
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Box
                                                    sx={{
                                                        p: 1.5,
                                                        borderRadius: 2,
                                                        bgcolor: '#ffffff',
                                                        color: '#0f172a',
                                                        border: '1px solid #e2e8f0',
                                                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.6, mb: 1 }}>
                                                        <LightModeIcon sx={{ fontSize: 15, color: '#f59e0b' }} />
                                                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                                                            Modo Claro
                                                        </Typography>
                                                    </Box>

                                                    <Box
                                                        sx={{
                                                            height: 70,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            p: 0.5,
                                                        }}
                                                    >
                                                        {comercio.logo_modo_claro ? (
                                                            <Box
                                                                component="img"
                                                                src={comercio.logo_modo_claro}
                                                                alt={`Logo claro ${comercio.nombre}`}
                                                                sx={{
                                                                    maxHeight: 60,
                                                                    maxWidth: '100%',
                                                                    objectFit: 'contain',
                                                                }}
                                                            />
                                                        ) : (
                                                            <Typography variant="caption" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                                                                Sin logo claro configurado
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Grid>

                                            {/* PANEL MODO OSCURO */}
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Box
                                                    sx={{
                                                        p: 1.5,
                                                        borderRadius: 2,
                                                        bgcolor: '#09152e',
                                                        color: '#f8fafc',
                                                        border: '1px solid #1e293b',
                                                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4)',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.6, mb: 1 }}>
                                                        <DarkModeIcon sx={{ fontSize: 15, color: '#60a5fa' }} />
                                                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                                                            Modo Oscuro
                                                        </Typography>
                                                    </Box>

                                                    <Box
                                                        sx={{
                                                            height: 70,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            p: 0.5,
                                                        }}
                                                    >
                                                        {comercio.logo_modo_oscuro ? (
                                                            <Box
                                                                component="img"
                                                                src={comercio.logo_modo_oscuro}
                                                                alt={`Logo oscuro ${comercio.nombre}`}
                                                                sx={{
                                                                    maxHeight: 60,
                                                                    maxWidth: '100%',
                                                                    objectFit: 'contain',
                                                                }}
                                                            />
                                                        ) : (
                                                            <Typography variant="caption" sx={{ color: '#64748b', fontStyle: 'italic' }}>
                                                                Sin logo oscuro configurado
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>

            {/* DIÁLOGO MODAL PARA EDITAR LOGOS */}
            <Dialog
                open={Boolean(editingComercio)}
                onClose={handleCloseEdit}
                maxWidth="sm"
                fullWidth
                slotProps={{ paper: { sx: { borderRadius: 3 } } }}
            >
                {editingComercio && (
                    <Box component="form" onSubmit={handleSubmit}>
                        <DialogTitle sx={{ pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar sx={{ bgcolor: editingComercio.color_hex || 'primary.main', width: 34, height: 34 }}>
                                    <ImageIcon fontSize="small" />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                                        Editar Logos de {editingComercio.nombre}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Personaliza los logotipos para cada esquema de color
                                    </Typography>
                                </Box>
                            </Box>
                        </DialogTitle>

                        <DialogContent sx={{ pt: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <Tabs
                                value={dialogTab}
                                onChange={(_, val) => setDialogTab(val)}
                                variant="fullWidth"
                                sx={{ borderBottom: 1, borderColor: 'divider' }}
                            >
                                <Tab
                                    icon={<LightModeIcon fontSize="small" />}
                                    iconPosition="start"
                                    label="Modo Claro (Fondo Blanco)"
                                    sx={{ fontWeight: 700, textTransform: 'none' }}
                                />
                                <Tab
                                    icon={<DarkModeIcon fontSize="small" />}
                                    iconPosition="start"
                                    label="Modo Oscuro (Fondo Oscuro)"
                                    sx={{ fontWeight: 700, textTransform: 'none' }}
                                />
                            </Tabs>

                            {/* TAB 0: MODO CLARO */}
                            {dialogTab === 0 && (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {/* Recuadro de vista previa en fondo blanco */}
                                    <Box
                                        sx={{
                                            p: 3,
                                            borderRadius: 2,
                                            bgcolor: '#ffffff',
                                            border: '2px dashed #cbd5e1',
                                            textAlign: 'center',
                                            minHeight: 90,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {claroPreview ? (
                                            <Box
                                                component="img"
                                                src={claroPreview}
                                                alt="Preview Claro"
                                                sx={{ maxHeight: 75, maxWidth: '100%', objectFit: 'contain' }}
                                            />
                                        ) : (
                                            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                                Sin logotipo para fondo claro
                                            </Typography>
                                        )}
                                    </Box>

                                    <Button
                                        component="label"
                                        variant="outlined"
                                        startIcon={<CloudUploadIcon />}
                                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                                    >
                                        Subir Archivo PNG / SVG Claro
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/png,image/jpeg,image/svg+xml,image/webp"
                                            onChange={handleClaroFileChange}
                                        />
                                    </Button>

                                    <Divider>O especifica la ruta</Divider>

                                    <TextField
                                        label="Ruta o URL del Logo Claro"
                                        placeholder="/logos-comercios/..."
                                        value={claroPath}
                                        onChange={(e) => {
                                            setClaroPath(e.target.value);
                                            setClaroFile(null);
                                            setClaroPreview(e.target.value || null);
                                        }}
                                        fullWidth
                                        size="small"
                                        helperText="Ruta relativa en public o enlace web directo"
                                    />
                                </Box>
                            )}

                            {/* TAB 1: MODO OSCURO */}
                            {dialogTab === 1 && (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {/* Recuadro de vista previa en fondo oscuro */}
                                    <Box
                                        sx={{
                                            p: 3,
                                            borderRadius: 2,
                                            bgcolor: '#09152e',
                                            border: '2px dashed #334155',
                                            textAlign: 'center',
                                            minHeight: 90,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {oscuroPreview ? (
                                            <Box
                                                component="img"
                                                src={oscuroPreview}
                                                alt="Preview Oscuro"
                                                sx={{ maxHeight: 75, maxWidth: '100%', objectFit: 'contain' }}
                                            />
                                        ) : (
                                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                                Sin logotipo para fondo oscuro
                                            </Typography>
                                        )}
                                    </Box>

                                    <Button
                                        component="label"
                                        variant="outlined"
                                        color="info"
                                        startIcon={<CloudUploadIcon />}
                                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                                    >
                                        Subir Archivo PNG / SVG Oscuro
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/png,image/jpeg,image/svg+xml,image/webp"
                                            onChange={handleOscuroFileChange}
                                        />
                                    </Button>

                                    <Divider>O especifica la ruta</Divider>

                                    <TextField
                                        label="Ruta o URL del Logo Oscuro"
                                        placeholder="/logos-comercios/..."
                                        value={oscuroPath}
                                        onChange={(e) => {
                                            setOscuroPath(e.target.value);
                                            setOscuroFile(null);
                                            setOscuroPreview(e.target.value || null);
                                        }}
                                        fullWidth
                                        size="small"
                                        helperText="Ruta relativa en public o enlace web directo"
                                    />
                                </Box>
                            )}
                        </DialogContent>

                        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                            <Button onClick={handleCloseEdit} color="inherit" sx={{ fontWeight: 700 }}>
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                                startIcon={isSubmitting && <CircularProgress size={18} color="inherit" />}
                                sx={{ borderRadius: 1.5, px: 3, fontWeight: 700 }}
                            >
                                {isSubmitting ? 'Guardando...' : 'Guardar Logotipos'}
                            </Button>
                        </DialogActions>
                    </Box>
                )}
            </Dialog>
        </>
    );
}
