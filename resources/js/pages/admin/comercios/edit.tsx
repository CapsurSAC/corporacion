import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { useNotification } from '@/hooks/use-notification';
import { confirmDeleteAlert } from '@/lib/swal';
import { isMinLength, isValidHexColor } from '@/lib/validation';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import DomainIcon from '@mui/icons-material/Domain';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ImageIcon from '@mui/icons-material/Image';
import LanguageIcon from '@mui/icons-material/Language';
import LaunchIcon from '@mui/icons-material/Launch';
import LinkIcon from '@mui/icons-material/Link';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PaletteIcon from '@mui/icons-material/Palette';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SaveIcon from '@mui/icons-material/Save';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import StorefrontIcon from '@mui/icons-material/Storefront';
import TuneIcon from '@mui/icons-material/Tune';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import YouTubeIcon from '@mui/icons-material/YouTube';
import GoogleDriveIcon from '@/components/google-drive-icon';
import { getDriveDirectImageUrl, isGoogleDriveUrl } from '@/lib/utils';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Switch,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { useState, useMemo } from 'react';
import type { Carrera, Comercio, Curso, Diplomado, Grupo, Rubro } from '@/types';

interface EditComercioPageProps {
    comercio: Comercio & { carreras?: Carrera[]; cursos?: Curso[]; diplomados?: Diplomado[] };
    grupos: Grupo[];
    rubros?: Rubro[];
}

const COLOR_PRESETS = [
    { name: 'Azul Institucional', hex: '#0c43a3' },
    { name: 'Azul Real', hex: '#1d4ed8' },
    { name: 'Celeste Océano', hex: '#0284c7' },
    { name: 'Verde Esmeralda', hex: '#059669' },
    { name: 'Verde Forestal', hex: '#16a34a' },
    { name: 'Ámbar Cálido', hex: '#d97706' },
    { name: 'Naranja Fuego', hex: '#ea580c' },
    { name: 'Rojo Carmesí', hex: '#dc2626' },
    { name: 'Púrpura Imperial', hex: '#7c3aed' },
    { name: 'Gris Grafito', hex: '#4b5563' },
];

export default function EditComercioPage({ comercio, grupos, rubros = [] }: EditComercioPageProps) {
    
    
    const { notify } = useNotification();

    // Tabs state
    const [currentTab, setCurrentTab] = useState(0);

    // YouTube & Photo addition states
    const [nuevoYoutube, setNuevoYoutube] = useState('');
    const [nuevaFoto, setNuevaFoto] = useState('');

    // Image preview modal state
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

    // Search filters for academic offer
    const [searchCarrera, setSearchCarrera] = useState('');
    const [searchDiplomado, setSearchDiplomado] = useState('');
    const [filterDiplomadoTipo, setFilterDiplomadoTipo] = useState('all');
    const [searchCurso, setSearchCurso] = useState('');
    const [filterCursoTipo, setFilterCursoTipo] = useState('all');

    const { data, setData, put, processing, errors } = useForm({
        grupo_id: String(comercio.grupo_id),
        nombre: comercio.nombre || '',
        sigla: comercio.sigla || comercio.codigo || '',
        color_hex: comercio.color_hex || '#0c43a3',
        pagina_web: comercio.pagina_web || '',
        plataforma_carrera: comercio.plataforma_carrera || '',
        certificado_url: comercio.certificado_url || '',
        resolucion_revalidacion: comercio.resolucion_revalidacion || '',
        resolucion_creacion: comercio.resolucion_creacion || '',
        escale_minedu: comercio.escale_minedu || '',
        link_directo_escale: comercio.link_directo_escale || '',
        malla_curricular_url: comercio.malla_curricular_url || '',
        catalogo_url: comercio.catalogo_url || '',
        brochure_vacaciones_utiles: comercio.brochure_vacaciones_utiles || '',
        como_ingresar_plataforma: comercio.como_ingresar_plataforma || '',
        reconocimiento_director: comercio.reconocimiento_director || '',
        seminario: comercio.seminario || '',
        convenio: comercio.convenio || '',
        promocion_vigente: comercio.promocion_vigente || '',
        canales_youtube: comercio.canales_youtube || [],
        fotos: comercio.fotos || [],
        descripcion: comercio.descripcion || '',
        activo: Boolean(comercio.activo),
    });

    const isAcademic =
        comercio.slug === 'istp-avanti' ||
        comercio.slug === 'istp-sis' ||
        comercio.codigo === 'AVANTI' ||
        comercio.codigo === 'SIS' ||
        (comercio.carreras && comercio.carreras.length > 0);

    const hasCursos =
        comercio.slug === 'next-online' ||
        comercio.codigo === 'NEXT' ||
        comercio.slug === 'cecava' ||
        comercio.codigo === 'CECAVA' ||
        comercio.slug === 'cecava-min' ||
        comercio.codigo === 'CECAVA-MIN' ||
        comercio.slug === 'matpel' ||
        comercio.codigo === 'MATPEL' ||
        (comercio.cursos && comercio.cursos.length > 0);

    const hasDiplomados =
        comercio.slug === 'magister' ||
        comercio.codigo === 'MAGISTER' ||
        comercio.slug === 'cecava' ||
        comercio.codigo === 'CECAVA' ||
        comercio.slug === 'cecava-min' ||
        comercio.codigo === 'CECAVA-MIN' ||
        comercio.slug === 'matpel' ||
        comercio.codigo === 'MATPEL' ||
        (comercio.diplomados && comercio.diplomados.length > 0);

    const isCecavaMin =
        comercio.slug === 'cecava-min' ||
        comercio.codigo === 'CECAVA-MIN';

    const isMatpel =
        comercio.slug === 'matpel' ||
        comercio.codigo === 'MATPEL';

    const isDiplomadoLibre = isCecavaMin || isMatpel;

    const standaloneDiplomados = useMemo(
        () => comercio.diplomados?.filter((d) => !d.carrera_id) || [],
        [comercio.diplomados]
    );

    const standaloneCursos = useMemo(
        () => comercio.cursos?.filter((c) => !c.carrera_id) || [],
        [comercio.cursos]
    );

    const showStandaloneDiplomados =
        (hasDiplomados && !isAcademic) || (isAcademic && standaloneDiplomados.length > 0);

    const showStandaloneCursos =
        (hasCursos && !isAcademic) || (isAcademic && standaloneCursos.length > 0);

    const totalCarreras = comercio.carreras?.length || 0;
    const totalDiplomados = comercio.diplomados?.length || 0;
    const totalCursos = comercio.cursos?.length || 0;
    const totalOferta = totalCarreras + totalDiplomados + totalCursos;

    // Filtered lists
    const filteredCarreras = useMemo(() => {
        if (!comercio.carreras) return [];
        if (!searchCarrera.trim()) return comercio.carreras;
        const q = searchCarrera.toLowerCase();
        return comercio.carreras.filter(
            (c) => c.nombre.toLowerCase().includes(q) || c.codigo?.toLowerCase().includes(q)
        );
    }, [comercio.carreras, searchCarrera]);

    const filteredStandaloneDiplomados = useMemo(() => {
        return standaloneDiplomados.filter((d) => {
            const matchesSearch =
                !searchDiplomado.trim() ||
                d.nombre.toLowerCase().includes(searchDiplomado.toLowerCase());
            const matchesTipo =
                filterDiplomadoTipo === 'all' || d.tipo === filterDiplomadoTipo;
            return matchesSearch && matchesTipo;
        });
    }, [standaloneDiplomados, searchDiplomado, filterDiplomadoTipo]);

    const filteredStandaloneCursos = useMemo(() => {
        return standaloneCursos.filter((c) => {
            const matchesSearch =
                !searchCurso.trim() ||
                c.nombre.toLowerCase().includes(searchCurso.toLowerCase());
            const matchesTipo =
                filterCursoTipo === 'all' ||
                c.tipo === filterCursoTipo;
            return matchesSearch && matchesTipo;
        });
    }, [standaloneCursos, searchCurso, filterCursoTipo]);

    const selectedGrupo = grupos.find((g) => String(g.id) === String(data.grupo_id));

    const getDiplomadoChip = (tipo?: string | null) => {
        if (!tipo || tipo === 'general' || tipo === 'libre' || tipo === 'sin_categoria') {
            return (
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '0.72rem' }}>
                    Sin categoría
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
                        bgcolor: `${color}18`,
                        color: color,
                        border: `1px solid ${color}40`,
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        height: 22,
                    }}
                />
            );
        }

        const map: Record<string, { label: string; bg: string; color: string; border: string }> = {
            tradicional: { label: 'Tradicional', bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' },
            especializado: { label: 'Especializado', bg: '#f3e8ff', color: '#6b21a8', border: '#e9d5ff' },
            ambientales: { label: 'Ambientales', bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0' },
            calidad_isos: { label: 'Calidad ISOs', bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' },
            mineros: { label: 'Mineros', bg: '#fff7ed', color: '#9a3412', border: '#fed7aa' },
            administracion: { label: 'Administración', bg: '#f0fdfa', color: '#115e59', border: '#99f6e4' },
            arquitectura_ingenieria: { label: 'Arq. e Ingeniería', bg: '#eef2ff', color: '#3730a3', border: '#c7d2fe' },
            osha: { label: 'OSHA', bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
            comercio_exterior: { label: 'Comex', bg: '#ecfeff', color: '#155e75', border: '#a5f3fc' },
            rubro_legal: { label: 'Rubro Legal', bg: '#f5f3ff', color: '#5b21b6', border: '#ddd6fe' },
            no_actualizados: { label: 'No Actualizado', bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' },
            nombramiento: { label: 'Nombramiento', bg: '#ede9fe', color: '#5b21b6', border: '#c4b5fd' },
            secundaria: { label: 'Secundaria', bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0' },
            generico: { label: 'Genérico', bg: '#f0f9ff', color: '#0369a1', border: '#bae6fd' },
        };

        const config = map[tipo] || { label: tipo, bg: '#f8fafc', color: '#334155', border: '#cbd5e1' };

        return (
            <Chip
                label={config.label}
                size="small"
                sx={{
                    bgcolor: config.bg,
                    color: config.color,
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    border: `1px solid ${config.border}`,
                    height: 22,
                }}
            />
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones breves y uniformes
        if (!isMinLength(data.nombre, 3)) {
            setCurrentTab(0);
            notify.error('El nombre institucional debe tener al menos 3 caracteres.');
            return;
        }

        if (!data.grupo_id) {
            setCurrentTab(0);
            notify.error('Debes seleccionar el grupo comercial perteneciente.');
            return;
        }

        if (data.color_hex && !isValidHexColor(data.color_hex)) {
            setCurrentTab(0);
            notify.error('El color corporativo debe ser un código hexadecimal válido (ej. #1d4ed8).');
            return;
        }

        put(`/admin/comercios/${comercio.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                notify.success('Información institucional actualizada exitosamente.');
            },
            onError: () => {
                notify.error('Ocurrió un error al guardar los cambios.');
            },
        });
    };

    const handleAddYoutube = () => {
        const trimmed = nuevoYoutube.trim();
        if (!trimmed) {
            notify.warning('Ingresa el enlace o URL del canal o video de YouTube.');
            return;
        }
        setData('canales_youtube', [...data.canales_youtube, trimmed]);
        setNuevoYoutube('');
        notify.success('Canal de YouTube agregado a la lista.');
    };

    const handleRemoveYoutube = async (index: number) => {
        const confirmed = await confirmDeleteAlert({
            title: '¿Remover canal de YouTube?',
            text: 'Se eliminará este enlace de la lista de canales del comercio.',
            confirmButtonText: 'Sí, remover',
        });
        if (confirmed) {
            setData(
                'canales_youtube',
                data.canales_youtube.filter((_, i) => i !== index)
            );
            notify.info('Canal removido de la lista.');
        }
    };

    const handleAddFoto = () => {
        const trimmed = nuevaFoto.trim();
        if (!trimmed) {
            notify.warning('Ingresa el enlace o URL de la fotografía.');
            return;
        }
        setData('fotos', [...data.fotos, trimmed]);
        setNuevaFoto('');
        notify.success('Fotografía agregada a la galería.');
    };

    const handleRemoveFoto = async (index: number) => {
        const confirmed = await confirmDeleteAlert({
            title: '¿Remover fotografía?',
            text: 'Se eliminará esta imagen de la galería del comercio.',
            confirmButtonText: 'Sí, remover',
        });
        if (confirmed) {
            setData(
                'fotos',
                data.fotos.filter((_, i) => i !== index)
            );
            notify.info('Fotografía removida de la galería.');
        }
    };

    return (
        <>
            <Head title={`Editar ${comercio.nombre} - Catálogo Capsur`} />

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2.5,
                    width: '100%',
                    boxSizing: 'border-box',
                }}
            >
                {/* HERO HEADER MODERNO */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, sm: 2.5 },
                        borderRadius: 1.5,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                        position: 'relative',
                        overflow: 'hidden',
                        width: '100%',
                        boxSizing: 'border-box',
                    }}
                >
                    {/* Borde superior de acento con el color del comercio */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 5,
                            bgcolor: data.color_hex || '#0c43a3',
                        }}
                    />

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: { xs: 'flex-start', md: 'center' },
                            justifyContent: 'space-between',
                            gap: 2.5,
                        }}
                    >
                        {/* Identidad izquierda */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flex: 1, minWidth: 0 }}>
                            <Link href={`/admin/comercios`} style={{ textDecoration: 'none' }}>
                                <Tooltip title="Volver al listado de comercios" arrow>
                                    <IconButton
                                        sx={{
                                            bgcolor: 'action.hover',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            '&:hover': { bgcolor: 'action.selected' },
                                        }}
                                    >
                                        <ArrowBackIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Link>

                            {/* Avatar de marca con el color corporativo */}
                            <Avatar
                                sx={{
                                    bgcolor: data.color_hex || '#0c43a3',
                                    color: '#ffffff',
                                    fontWeight: 900,
                                    fontSize: '1.2rem',
                                    width: 52,
                                    height: 52,
                                    boxShadow: `0 4px 14px ${data.color_hex || '#0c43a3'}40`,
                                    border: '2px solid #ffffff',
                                }}
                            >
                                {(data.sigla || data.nombre || 'C').substring(0, 3).toUpperCase()}
                            </Avatar>

                            <Box sx={{ minWidth: 0 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 800,
                                            color: 'text.primary',
                                            letterSpacing: '-0.02em',
                                        }}
                                    >
                                        {data.nombre || comercio.nombre}
                                    </Typography>

                                    <Chip
                                        label={data.sigla || comercio.codigo || 'COMERCIO'}
                                        size="small"
                                        sx={{
                                            bgcolor: data.color_hex || '#0c43a3',
                                            color: '#ffffff',
                                            fontWeight: 800,
                                            fontSize: '0.72rem',
                                            height: 22,
                                        }}
                                    />

                                    {selectedGrupo && (
                                        <Chip
                                            icon={<DomainIcon sx={{ fontSize: '13px !important' }} />}
                                            label={selectedGrupo.nombre}
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontWeight: 600, fontSize: '0.72rem', height: 22 }}
                                        />
                                    )}

                                    <Chip
                                        label={data.activo ? 'ACTIVO' : 'INACTIVO'}
                                        color={data.activo ? 'success' : 'default'}
                                        size="small"
                                        sx={{
                                            fontWeight: 800,
                                            fontSize: '0.68rem',
                                            height: 22,
                                        }}
                                    />
                                </Box>

                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.85rem' }}>
                                    Edita la ficha técnica, acreditaciones, presencia digital y oferta académica de este comercio.
                                </Typography>
                            </Box>
                        </Box>

                        {/* Botón de Guardado Superior Rápido */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, alignSelf: { xs: 'stretch', md: 'auto' }, justifyContent: { xs: 'flex-end', md: 'auto' } }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={processing}
                                startIcon={processing ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                                sx={{
                                    bgcolor: data.color_hex || '#0c43a3',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    px: 2.8,
                                    py: 0.9,
                                    borderRadius: 2,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                                    '&:hover': { filter: 'brightness(0.92)' },
                                }}
                            >
                                {processing ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </Box>
                    </Box>
                </Paper>

                {/* NAVEGACIÓN POR PESTAÑAS (TABS) */}
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        overflow: 'hidden',
                        width: '100%',
                        boxSizing: 'border-box',
                    }}
                >
                    <Tabs
                        value={currentTab}
                        onChange={(_, newValue) => setCurrentTab(newValue)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            px: 2,
                            borderBottom: 1,
                            borderColor: 'divider',
                            bgcolor: 'background.paper',
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                minHeight: 52,
                                gap: 1,
                                px: 2.5,
                            },
                        }}
                    >
                        <Tab
                            icon={<BusinessIcon sx={{ fontSize: 18 }} />}
                            iconPosition="start"
                            label="Datos & Marca"
                        />
                        <Tab
                            icon={
                                <Badge
                                    badgeContent={data.canales_youtube.length + data.fotos.length}
                                    color="primary"
                                    sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', height: 16, minWidth: 16 } }}
                                >
                                    <LanguageIcon sx={{ fontSize: 18 }} />
                                </Badge>
                            }
                            iconPosition="start"
                            label="Presencia Digital & Medios"
                        />
                        <Tab
                            icon={<VerifiedUserIcon sx={{ fontSize: 18 }} />}
                            iconPosition="start"
                            label="Acreditación & MINEDU"
                        />
                        <Tab
                            icon={
                                <Badge
                                    badgeContent={totalOferta}
                                    color="secondary"
                                    sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', height: 16, minWidth: 16 } }}
                                >
                                    <SchoolIcon sx={{ fontSize: 18 }} />
                                </Badge>
                            }
                            iconPosition="start"
                            label={`Oferta Formativa (${totalOferta})`}
                        />
                    </Tabs>

                    {/* CONTENIDO DE PESTAÑAS */}
                    <Box sx={{ p: { xs: 2.5, sm: 3.5 }, width: '100%', boxSizing: 'border-box' }}>
                        {/* ========================================================================= */}
                        {/* PESTAÑA 0: DATOS INSTITUCIONALES Y MARCA */}
                        {/* ========================================================================= */}
                        {currentTab === 0 && (
                            <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
                                {/* Subcard 1: Datos Principales */}
                                <Grid size={{ xs: 12, md: 7 }}>
                                    <Card variant="outlined" sx={{ borderRadius: 2.5, height: '100%' }}>
                                        <CardHeader
                                            avatar={<StorefrontIcon color="primary" />}
                                            title="1. Identidad Institucional"
                                            subheader="Configuración de nombres oficiales, siglas y grupo de pertenencia"
                                            titleTypographyProps={{ variant: 'subtitle1', fontWeight: 700 }}
                                        />
                                        <Divider />
                                        <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                            <TextField
                                                label="Nombre Institucional *"
                                                value={data.nombre}
                                                onChange={(e) => setData('nombre', e.target.value)}
                                                placeholder="Ej. ISTP SIS, ISTP AVANTI, NEXT-ONLINE..."
                                                error={!!errors.nombre}
                                                helperText={errors.nombre || 'Nombre legal o comercial que figurará en el catálogo'}
                                                fullWidth
                                                required
                                                size="small"
                                            />

                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField
                                                        label="Sigla / Código Corto"
                                                        value={data.sigla}
                                                        onChange={(e) => setData('sigla', e.target.value)}
                                                        placeholder="Ej. SIS, AVANTI, NXT"
                                                        error={!!errors.sigla}
                                                        helperText={errors.sigla || 'Identificador corto en badges y etiquetas'}
                                                        fullWidth
                                                        size="small"
                                                    />
                                                </Grid>

                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <FormControl fullWidth size="small" error={!!errors.grupo_id}>
                                                        <InputLabel id="grupo-select-label">Grupo Comercial *</InputLabel>
                                                        <Select
                                                            labelId="grupo-select-label"
                                                            value={data.grupo_id}
                                                            label="Grupo Comercial *"
                                                            onChange={(e) => setData('grupo_id', e.target.value)}
                                                        >
                                                            {grupos.map((g) => (
                                                                <MenuItem key={g.id} value={String(g.id)}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        <DomainIcon fontSize="small" color="action" />
                                                                        <span>{g.nombre}</span>
                                                                    </Box>
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>

                                            <Box
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    bgcolor: data.activo ? 'rgba(46, 125, 50, 0.05)' : 'action.hover',
                                                    border: '1px solid',
                                                    borderColor: data.activo ? 'rgba(46, 125, 50, 0.2)' : 'divider',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                        Estado Operativo del Comercio
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {data.activo
                                                            ? 'Visible públicamente en el catálogo y filtros de búsqueda'
                                                            : 'Oculto temporalmente del catálogo público'}
                                                    </Typography>
                                                </Box>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={data.activo}
                                                            onChange={(e) => setData('activo', e.target.checked)}
                                                            color="success"
                                                        />
                                                    }
                                                    label={
                                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                            {data.activo ? 'Activo' : 'Inactivo'}
                                                        </Typography>
                                                    }
                                                    sx={{ m: 0 }}
                                                />
                                            </Box>

                                            <TextField
                                                label="Descripción Institucional / Resumen"
                                                value={data.descripcion}
                                                onChange={(e) => setData('descripcion', e.target.value)}
                                                placeholder="Breve reseña sobre el comercio o instituto, áreas de formación o servicios..."
                                                error={!!errors.descripcion}
                                                helperText={errors.descripcion}
                                                fullWidth
                                                multiline
                                                rows={3}
                                                size="small"
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Subcard 2: Identidad Visual y Paleta de Color */}
                                <Grid size={{ xs: 12, md: 5 }}>
                                    <Card variant="outlined" sx={{ borderRadius: 2.5, height: '100%' }}>
                                        <CardHeader
                                            avatar={<PaletteIcon color="primary" />}
                                            title="Color Corporativo"
                                            subheader="Personalización visual del badge y detalles de marca"
                                            titleTypographyProps={{ variant: 'subtitle1', fontWeight: 700 }}
                                        />
                                        <Divider />
                                        <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                            {/* Selector Input y Previsualizador */}
                                            <Box
                                                sx={{
                                                    p: 2.5,
                                                    borderRadius: 2.5,
                                                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                }}
                                            >
                                                <Box sx={{ position: 'relative' }}>
                                                    <input
                                                        type="color"
                                                        value={data.color_hex}
                                                        onChange={(e) => setData('color_hex', e.target.value)}
                                                        style={{
                                                            width: 48,
                                                            height: 48,
                                                            padding: 0,
                                                            border: 'none',
                                                            borderRadius: '50%',
                                                            cursor: 'pointer',
                                                        }}
                                                    />
                                                </Box>

                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                                                        CÓDIGO HEXADECIMAL
                                                    </Typography>
                                                    <TextField
                                                        size="small"
                                                        value={data.color_hex}
                                                        onChange={(e) => setData('color_hex', e.target.value)}
                                                        fullWidth
                                                        placeholder="#0c43a3"
                                                        error={!!errors.color_hex}
                                                        helperText={errors.color_hex}
                                                        slotProps={{
                                                            input: {
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <Box
                                                                            sx={{
                                                                                width: 14,
                                                                                height: 14,
                                                                                borderRadius: '50%',
                                                                                bgcolor: data.color_hex || '#0c43a3',
                                                                            }}
                                                                        />
                                                                    </InputAdornment>
                                                                ),
                                                            },
                                                        }}
                                                    />
                                                </Box>
                                            </Box>

                                            {/* Paleta de Colores Predefinidos */}
                                            <Box>
                                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1.5 }}>
                                                    PALETAS RECOMENDADAS:
                                                </Typography>
                                                <Grid container spacing={1}>
                                                    {COLOR_PRESETS.map((preset) => {
                                                        const isSelected = data.color_hex.toLowerCase() === preset.hex.toLowerCase();
                                                        return (
                                                            <Grid size={{ xs: 6 }} key={preset.hex}>
                                                                <Box
                                                                    onClick={() => setData('color_hex', preset.hex)}
                                                                    sx={{
                                                                        p: 1,
                                                                        borderRadius: 2,
                                                                        border: '1px solid',
                                                                        borderColor: (theme) =>
                                                                            isSelected
                                                                                ? preset.hex
                                                                                : theme.palette.mode === 'dark'
                                                                                  ? 'rgba(255, 255, 255, 0.1)'
                                                                                  : '#e2e8f0',
                                                                        bgcolor: (theme) =>
                                                                            isSelected
                                                                                ? theme.palette.mode === 'dark'
                                                                                    ? `${preset.hex}25`
                                                                                    : `${preset.hex}15`
                                                                                : theme.palette.mode === 'dark'
                                                                                  ? 'rgba(255, 255, 255, 0.04)'
                                                                                  : '#ffffff',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 1.2,
                                                                        cursor: 'pointer',
                                                                        transition: 'all 0.15s ease',
                                                                        '&:hover': {
                                                                            borderColor: preset.hex,
                                                                            bgcolor: (theme) =>
                                                                                theme.palette.mode === 'dark'
                                                                                    ? 'rgba(255, 255, 255, 0.08)'
                                                                                    : '#f8fafc',
                                                                            transform: 'translateY(-1px)',
                                                                        },
                                                                    }}
                                                                >
                                                                    <Box
                                                                        sx={{
                                                                            width: 20,
                                                                            height: 20,
                                                                            borderRadius: '50%',
                                                                            bgcolor: preset.hex,
                                                                            flexShrink: 0,
                                                                            boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                                                                        }}
                                                                    />
                                                                    <Typography
                                                                        variant="caption"
                                                                        sx={{
                                                                            fontWeight: isSelected ? 800 : 600,
                                                                            fontSize: '0.75rem',
                                                                            lineHeight: 1.1,
                                                                            color: (theme) =>
                                                                                isSelected
                                                                                    ? theme.palette.mode === 'dark'
                                                                                        ? '#ffffff'
                                                                                        : preset.hex
                                                                                    : 'text.primary',
                                                                        }}
                                                                    >
                                                                        {preset.name}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                        );
                                                    })}
                                                </Grid>
                                            </Box>

                                            {/* Previsualización en Vivo de la Ficha */}
                                            <Box sx={{ mt: 1 }}>
                                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>
                                                    VISTA PREVIA EN CATÁLOGO:
                                                </Typography>
                                                <Paper
                                                    variant="outlined"
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: 2,
                                                        borderLeft: `5px solid ${data.color_hex || '#0c43a3'}`,
                                                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#fafafa',
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                                            {data.nombre || 'Nombre del Comercio'}
                                                        </Typography>
                                                        <Chip
                                                            label={data.sigla || 'SIGLA'}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: data.color_hex || '#0c43a3',
                                                                color: '#ffffff',
                                                                fontWeight: 800,
                                                                fontSize: '0.68rem',
                                                                height: 20,
                                                            }}
                                                        />
                                                    </Box>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebKitLineClamp: 2, WebKitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                        {data.descripcion || 'Sin descripción registrada actualmente...'}
                                                    </Typography>
                                                </Paper>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        )}

                        {/* ========================================================================= */}
                        {/* PESTAÑA 1: PRESENCIA DIGITAL Y MEDIOS MULTIMEDIA */}
                        {/* ========================================================================= */}
                        {currentTab === 1 && (
                            <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
                                {/* Subcard 1: Enlaces Oficiales y Plataformas */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Card variant="outlined" sx={{ borderRadius: 2.5, height: '100%' }}>
                                        <CardHeader
                                            avatar={<LanguageIcon color="primary" />}
                                            title="Portales y Accesos Oficiales"
                                            subheader="Enlaces principales a la web institucional, aulas virtuales y catálogos"
                                            titleTypographyProps={{ variant: 'subtitle1', fontWeight: 700 }}
                                        />
                                        <Divider />
                                        <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                            <TextField
                                                label="Página Web Oficial (URL)"
                                                value={data.pagina_web}
                                                onChange={(e) => setData('pagina_web', e.target.value)}
                                                placeholder="https://..."
                                                error={!!errors.pagina_web}
                                                helperText={errors.pagina_web || 'Portal web institucional principal'}
                                                fullWidth
                                                size="small"
                                                slotProps={{
                                                    input: {
                                                        endAdornment: data.pagina_web ? (
                                                            <InputAdornment position="end">
                                                                <Tooltip title="Abrir enlace en nueva pestaña" arrow>
                                                                    <IconButton href={data.pagina_web} target="_blank" size="small">
                                                                        <LaunchIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </InputAdornment>
                                                        ) : null,
                                                    },
                                                }}
                                            />

                                            <TextField
                                                label="Plataforma Virtual / Aula de Carrera (URL)"
                                                value={data.plataforma_carrera}
                                                onChange={(e) => setData('plataforma_carrera', e.target.value)}
                                                placeholder="https://aula.comercio.edu.pe"
                                                error={!!errors.plataforma_carrera}
                                                helperText={errors.plataforma_carrera || 'Campus o aula virtual para estudiantes'}
                                                fullWidth
                                                size="small"
                                                slotProps={{
                                                    input: {
                                                        endAdornment: data.plataforma_carrera ? (
                                                            <InputAdornment position="end">
                                                                <Tooltip title="Abrir aula virtual" arrow>
                                                                    <IconButton href={data.plataforma_carrera} target="_blank" size="small">
                                                                        <LaunchIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </InputAdornment>
                                                        ) : null,
                                                    },
                                                }}
                                            />

                                            <TextField
                                                label="Catálogo Institucional (URL PDF)"
                                                value={data.catalogo_url}
                                                onChange={(e) => setData('catalogo_url', e.target.value)}
                                                placeholder="https://.../catalogo-2026.pdf"
                                                error={!!errors.catalogo_url}
                                                helperText={errors.catalogo_url || 'Brochure o catálogo corporativo en PDF'}
                                                fullWidth
                                                size="small"
                                                slotProps={{
                                                    input: {
                                                        endAdornment: data.catalogo_url ? (
                                                            <InputAdornment position="end">
                                                                <Tooltip title="Ver catálogo PDF" arrow>
                                                                    <IconButton href={data.catalogo_url} target="_blank" size="small">
                                                                        <PictureAsPdfIcon fontSize="small" color="primary" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </InputAdornment>
                                                        ) : null,
                                                    },
                                                }}
                                            />

                                            <TextField
                                                label="Brochure Vacaciones Útiles (Link / URL)"
                                                value={data.brochure_vacaciones_utiles}
                                                onChange={(e) => setData('brochure_vacaciones_utiles', e.target.value)}
                                                placeholder="https://.../vacaciones-utiles.pdf"
                                                error={!!errors.brochure_vacaciones_utiles}
                                                helperText={errors.brochure_vacaciones_utiles || 'Folleto o documento de temporada de vacaciones útiles'}
                                                fullWidth
                                                size="small"
                                                slotProps={{
                                                    input: {
                                                        endAdornment: data.brochure_vacaciones_utiles ? (
                                                            <InputAdornment position="end">
                                                                <Tooltip title="Ver brochure vacaciones útiles" arrow>
                                                                    <IconButton href={data.brochure_vacaciones_utiles} target="_blank" size="small">
                                                                        <PictureAsPdfIcon fontSize="small" color="primary" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </InputAdornment>
                                                        ) : null,
                                                    },
                                                }}
                                            />

                                            <TextField
                                                label="Link de Promoción Vigente (URL / Enlace)"
                                                value={data.promocion_vigente}
                                                onChange={(e) => setData('promocion_vigente', e.target.value)}
                                                placeholder="https://.../promocion-vigente"
                                                error={!!errors.promocion_vigente}
                                                helperText={errors.promocion_vigente || 'Enlace directo a la promoción, afiche, flyer o documento de descuentos'}
                                                fullWidth
                                                size="small"
                                                slotProps={{
                                                    input: {
                                                        endAdornment: data.promocion_vigente ? (
                                                            <InputAdornment position="end">
                                                                <Tooltip title="Abrir enlace de promoción" arrow>
                                                                    <IconButton href={data.promocion_vigente} target="_blank" size="small">
                                                                        <LaunchIcon fontSize="small" color="primary" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </InputAdornment>
                                                        ) : null,
                                                    },
                                                }}
                                            />

                                            <TextField
                                                label="Tutorial / ¿Cómo ingresar a la plataforma? (Video o Guía)"
                                                value={data.como_ingresar_plataforma}
                                                onChange={(e) => setData('como_ingresar_plataforma', e.target.value)}
                                                placeholder="https://youtube.com/watch?v=..."
                                                error={!!errors.como_ingresar_plataforma}
                                                helperText={errors.como_ingresar_plataforma || 'Enlace directo al tutorial de acceso'}
                                                fullWidth
                                                size="small"
                                                slotProps={{
                                                    input: {
                                                        endAdornment: data.como_ingresar_plataforma ? (
                                                            <InputAdornment position="end">
                                                                <Tooltip title="Ver tutorial" arrow>
                                                                    <IconButton href={data.como_ingresar_plataforma} target="_blank" size="small">
                                                                        <YouTubeIcon fontSize="small" color="error" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </InputAdornment>
                                                        ) : null,
                                                    },
                                                }}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Subcard 2: Gestor de YouTube y Fotos */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        {/* Gestor de Canales y Videos de YouTube */}
                                        <Card variant="outlined" sx={{ borderRadius: 2.5 }}>
                                            <CardHeader
                                                avatar={<YouTubeIcon color="error" />}
                                                title={`Canales y Videos de YouTube (${data.canales_youtube.length})`}
                                                subheader="Registra enlaces directos a canales o videos promocionales"
                                                titleTypographyProps={{ variant: 'subtitle1', fontWeight: 700 }}
                                            />
                                            <Divider />
                                            <CardContent sx={{ p: 2.5 }}>
                                                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                                    <TextField
                                                        size="small"
                                                        placeholder="Pegar URL de YouTube..."
                                                        value={nuevoYoutube}
                                                        onChange={(e) => setNuevoYoutube(e.target.value)}
                                                        fullWidth
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                handleAddYoutube();
                                                            }
                                                        }}
                                                    />
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        onClick={handleAddYoutube}
                                                        sx={{ minWidth: 44, px: 2, bgcolor: '#dc2626', '&:hover': { bgcolor: '#b91c1c' } }}
                                                    >
                                                        <AddIcon fontSize="small" />
                                                    </Button>
                                                </Box>

                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 180, overflowY: 'auto', pr: 0.5 }}>
                                                    {data.canales_youtube.map((url, index) => (
                                                        <Paper
                                                            key={index}
                                                            variant="outlined"
                                                            sx={{
                                                                p: 1,
                                                                px: 1.5,
                                                                borderRadius: 1.5,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                gap: 1,
                                                                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#f8fafc',
                                                                borderColor: 'divider',
                                                            }}
                                                        >
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                                                                <YouTubeIcon color="error" sx={{ fontSize: 18, flexShrink: 0 }} />
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        fontSize: '0.78rem',
                                                                        fontWeight: 600,
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        whiteSpace: 'nowrap',
                                                                    }}
                                                                >
                                                                    {url}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                                                                <IconButton href={url} target="_blank" size="small">
                                                                    <LaunchIcon sx={{ fontSize: 16 }} />
                                                                </IconButton>
                                                                <IconButton size="small" color="error" onClick={() => handleRemoveYoutube(index)}>
                                                                    <DeleteIcon sx={{ fontSize: 16 }} />
                                                                </IconButton>
                                                            </Box>
                                                        </Paper>
                                                    ))}
                                                    {data.canales_youtube.length === 0 && (
                                                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', py: 1 }}>
                                                            No hay canales ni videos agregados.
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </CardContent>
                                        </Card>

                                        {/* Gestor de Fotos / Galería */}
                                        <Card variant="outlined" sx={{ borderRadius: 2.5 }}>
                                            <CardHeader
                                                avatar={<PhotoLibraryIcon color="primary" />}
                                                title={`Galería Fotográfica y Sedes (${data.fotos.length})`}
                                                subheader="Fotos de infraestructura, eventos y sedes (enlaces de Google Drive o imágenes directas)"
                                                titleTypographyProps={{ variant: 'subtitle1', fontWeight: 700 }}
                                            />
                                            <Divider />
                                            <CardContent sx={{ p: 2.5 }}>
                                                <Box sx={{ display: 'flex', gap: 1, mb: 2.5 }}>
                                                    <TextField
                                                        size="small"
                                                        placeholder="Pegar enlace de Google Drive de la foto o URL de imagen..."
                                                        value={nuevaFoto}
                                                        onChange={(e) => setNuevaFoto(e.target.value)}
                                                        fullWidth
                                                        slotProps={{
                                                            input: {
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <PhotoLibraryIcon color="action" fontSize="small" />
                                                                    </InputAdornment>
                                                                ),
                                                            },
                                                        }}
                                                        onKeyDown={(e) => {
                                                             if (e.key === 'Enter') {
                                                                 e.preventDefault();
                                                                 handleAddFoto();
                                                             }
                                                        }}
                                                    />
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        onClick={handleAddFoto}
                                                        sx={{ minWidth: 44, px: 2 }}
                                                    >
                                                        <AddIcon fontSize="small" />
                                                    </Button>
                                                </Box>

                                                {/* Cuadrícula de fotos con renderizado de imagen real y preview */}
                                                <Grid container spacing={2}>
                                                    {data.fotos.map((url, index) => (
                                                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                                                            <Paper
                                                                variant="outlined"
                                                                sx={{
                                                                    borderRadius: 2,
                                                                    overflow: 'hidden',
                                                                    border: '1px solid',
                                                                    borderColor: 'divider',
                                                                    transition: 'all 0.2s',
                                                                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
                                                                    '&:hover': {
                                                                        borderColor: '#2684fc',
                                                                        boxShadow: '0 4px 14px rgba(38, 132, 252, 0.18)',
                                                                    },
                                                                }}
                                                            >
                                                                {/* Contenedor de la foto real */}
                                                                <Box
                                                                    sx={{
                                                                        position: 'relative',
                                                                        height: 140,
                                                                        width: '100%',
                                                                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#f1f5f9',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        overflow: 'hidden',
                                                                        cursor: 'pointer',
                                                                    }}
                                                                    onClick={() => setPreviewImageUrl(getDriveDirectImageUrl(url))}
                                                                >
                                                                    <Box
                                                                        component="img"
                                                                        src={getDriveDirectImageUrl(url)}
                                                                        alt={`Foto ${index + 1}`}
                                                                        sx={{
                                                                            width: '100%',
                                                                            height: '100%',
                                                                            objectFit: 'cover',
                                                                            display: 'block',
                                                                            transition: 'transform 0.3s',
                                                                            '&:hover': { transform: 'scale(1.05)' },
                                                                        }}
                                                                    />
                                                                    {isGoogleDriveUrl(url) && (
                                                                        <Chip
                                                                            icon={<GoogleDriveIcon size={14} />}
                                                                            label="Drive"
                                                                            size="small"
                                                                            sx={{
                                                                                position: 'absolute',
                                                                                top: 8,
                                                                                left: 8,
                                                                                bgcolor: 'rgba(0, 0, 0, 0.65)',
                                                                                color: '#ffffff',
                                                                                backdropFilter: 'blur(4px)',
                                                                                fontWeight: 700,
                                                                                fontSize: '0.68rem',
                                                                                height: 22,
                                                                                '& .MuiChip-icon': { ml: 0.5 },
                                                                            }}
                                                                        />
                                                                    )}
                                                                </Box>

                                                                {/* Barra de información y acciones */}
                                                                <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                                                                    <Box sx={{ minWidth: 0, flex: 1 }}>
                                                                        <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                                                                            Foto / Sede {index + 1}
                                                                        </Typography>
                                                                        <Typography variant="caption" noWrap color="text.secondary" sx={{ display: 'block' }}>
                                                                            {isGoogleDriveUrl(url) ? 'Google Drive' : 'Imagen web'}
                                                                        </Typography>
                                                                    </Box>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                        <Tooltip title="Ampliar foto" arrow>
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={() => setPreviewImageUrl(getDriveDirectImageUrl(url))}
                                                                                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}
                                                                            >
                                                                                <VisibilityIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip title="Abrir en Google Drive" arrow>
                                                                            <IconButton
                                                                                size="small"
                                                                                component="a"
                                                                                href={url}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                color="primary"
                                                                                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}
                                                                            >
                                                                                <LaunchIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip title="Eliminar foto" arrow>
                                                                            <IconButton
                                                                                size="small"
                                                                                color="error"
                                                                                onClick={() => handleRemoveFoto(index)}
                                                                                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}
                                                                            >
                                                                                <DeleteIcon sx={{ fontSize: 18 }} />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </Box>
                                                                </Box>
                                                            </Paper>
                                                        </Grid>
                                                    ))}
                                                    {data.fotos.length === 0 && (
                                                        <Grid size={{ xs: 12 }}>
                                                            <Box sx={{ textAlign: 'center', py: 4, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : '#f8fafc', borderRadius: 2, border: '1px dashed', borderColor: 'divider' }}>
                                                                <PhotoLibraryIcon sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.4, mb: 1 }} />
                                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                                                    No hay fotos agregadas.
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Pega arriba el enlace de Google Drive de una foto o cualquier URL de imagen.
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                    )}
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                </Grid>
                            </Grid>
                        )}

                        {/* ========================================================================= */}
                        {/* PESTAÑA 2: ACREDITACIÓN INSTITUCIONAL Y REGISTRO MINEDU */}
                        {/* ========================================================================= */}
                        {currentTab === 2 && (
                            <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
                                {/* Subcard 1: Resoluciones y Documentación Legal */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Card variant="outlined" sx={{ borderRadius: 2.5, height: '100%' }}>
                                        <CardHeader
                                            avatar={<PictureAsPdfIcon color="primary" />}
                                            title="Resoluciones y Documentos Oficiales"
                                            subheader="Documentación de creación, revalidación ministerial y directiva"
                                            titleTypographyProps={{ variant: 'subtitle1', fontWeight: 700 }}
                                        />
                                        <Divider />
                                        <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                            <TextField
                                                label="Resolución de Creación (PDF / Documento)"
                                                value={data.resolucion_creacion}
                                                onChange={(e) => setData('resolucion_creacion', e.target.value)}
                                                placeholder="https://.../resolucion-creacion.pdf"
                                                error={!!errors.resolucion_creacion}
                                                helperText={errors.resolucion_creacion || 'Resolución ministerial o directiva de fundación'}
                                                fullWidth
                                                size="small"
                                                slotProps={{
                                                    input: {
                                                        endAdornment: data.resolucion_creacion ? (
                                                            <InputAdornment position="end">
                                                                <Tooltip title="Ver documento PDF" arrow>
                                                                    <IconButton href={data.resolucion_creacion} target="_blank" size="small">
                                                                        <PictureAsPdfIcon fontSize="small" color="primary" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </InputAdornment>
                                                        ) : null,
                                                    },
                                                }}
                                            />

                                            <TextField
                                                label="Resolución de Revalidación (PDF / Documento)"
                                                value={data.resolucion_revalidacion}
                                                onChange={(e) => setData('resolucion_revalidacion', e.target.value)}
                                                placeholder="https://.../resolucion-revalidacion.pdf"
                                                error={!!errors.resolucion_revalidacion}
                                                helperText={errors.resolucion_revalidacion || 'Resolución de renovación o licenciamiento institucional'}
                                                fullWidth
                                                size="small"
                                                slotProps={{
                                                    input: {
                                                        endAdornment: data.resolucion_revalidacion ? (
                                                            <InputAdornment position="end">
                                                                <Tooltip title="Ver documento PDF" arrow>
                                                                    <IconButton href={data.resolucion_revalidacion} target="_blank" size="small">
                                                                        <PictureAsPdfIcon fontSize="small" color="secondary" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </InputAdornment>
                                                        ) : null,
                                                    },
                                                }}
                                            />

                                            <TextField
                                                label="Certificado Digital / Acreditación (PDF)"
                                                value={data.certificado_url}
                                                onChange={(e) => setData('certificado_url', e.target.value)}
                                                placeholder="https://.../certificado.pdf"
                                                error={!!errors.certificado_url}
                                                helperText={errors.certificado_url || 'Certificado oficial o acreditación de calidad'}
                                                fullWidth
                                                size="small"
                                                slotProps={{
                                                    input: {
                                                        endAdornment: data.certificado_url ? (
                                                            <InputAdornment position="end">
                                                                <Tooltip title="Ver certificado" arrow>
                                                                    <IconButton href={data.certificado_url} target="_blank" size="small">
                                                                        <PictureAsPdfIcon fontSize="small" color="primary" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </InputAdornment>
                                                        ) : null,
                                                    },
                                                }}
                                            />

                                            <TextField
                                                label="Reconocimiento de Director (PDF / Documento)"
                                                value={data.reconocimiento_director}
                                                onChange={(e) => setData('reconocimiento_director', e.target.value)}
                                                placeholder="https://.../reconocimiento-director.pdf"
                                                error={!!errors.reconocimiento_director}
                                                helperText={errors.reconocimiento_director || 'Documento de reconocimiento de dirección general'}
                                                fullWidth
                                                size="small"
                                                slotProps={{
                                                    input: {
                                                        endAdornment: data.reconocimiento_director ? (
                                                            <InputAdornment position="end">
                                                                <Tooltip title="Ver reconocimiento" arrow>
                                                                    <IconButton href={data.reconocimiento_director} target="_blank" size="small">
                                                                        <WorkspacePremiumIcon fontSize="small" color="primary" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </InputAdornment>
                                                        ) : null,
                                                    },
                                                }}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Subcard 2: ESCALE MINEDU y Convenios */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Card variant="outlined" sx={{ borderRadius: 2.5, height: '100%' }}>
                                        <CardHeader
                                            avatar={<VerifiedUserIcon color="primary" />}
                                            title="Registro ESCALE y Alianzas"
                                            subheader="Padrón oficial del Ministerio de Educación y convenios interinstitucionales"
                                            titleTypographyProps={{ variant: 'subtitle1', fontWeight: 700 }}
                                        />
                                        <Divider />
                                        <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                            <TextField
                                                label="Código / Padrón ESCALE - MINEDU"
                                                value={data.escale_minedu}
                                                onChange={(e) => setData('escale_minedu', e.target.value)}
                                                placeholder="https://escale.minedu.gob.pe/... o Código modular"
                                                error={!!errors.escale_minedu}
                                                helperText={errors.escale_minedu || 'Código modular o enlace al portal ESCALE'}
                                                fullWidth
                                                size="small"
                                                slotProps={{
                                                    input: {
                                                        endAdornment: data.escale_minedu ? (
                                                            <InputAdornment position="end">
                                                                <Tooltip title="Consultar ESCALE" arrow>
                                                                    <IconButton href={data.escale_minedu} target="_blank" size="small">
                                                                        <LaunchIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </InputAdornment>
                                                        ) : null,
                                                    },
                                                }}
                                            />

                                            <TextField
                                                label="Link Directo Consulta ESCALE"
                                                value={data.link_directo_escale}
                                                onChange={(e) => setData('link_directo_escale', e.target.value)}
                                                placeholder="https://escale.minedu.gob.pe/padron-ce?..."
                                                error={!!errors.link_directo_escale}
                                                helperText={errors.link_directo_escale || 'URL con parámetros directos de búsqueda en ESCALE'}
                                                fullWidth
                                                size="small"
                                                slotProps={{
                                                    input: {
                                                        endAdornment: data.link_directo_escale ? (
                                                            <InputAdornment position="end">
                                                                <Tooltip title="Abrir enlace directo ESCALE" arrow>
                                                                    <IconButton href={data.link_directo_escale} target="_blank" size="small">
                                                                        <LaunchIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </InputAdornment>
                                                        ) : null,
                                                    },
                                                }}
                                            />

                                            <TextField
                                                label="Malla Curricular General (Brochure PDF)"
                                                value={data.malla_curricular_url}
                                                onChange={(e) => setData('malla_curricular_url', e.target.value)}
                                                placeholder="https://.../malla-curricular.pdf"
                                                error={!!errors.malla_curricular_url}
                                                helperText={errors.malla_curricular_url || 'Brochure general del plan de estudios institucional'}
                                                fullWidth
                                                size="small"
                                                slotProps={{
                                                    input: {
                                                        endAdornment: data.malla_curricular_url ? (
                                                            <InputAdornment position="end">
                                                                <Tooltip title="Ver malla curricular" arrow>
                                                                    <IconButton href={data.malla_curricular_url} target="_blank" size="small">
                                                                        <PictureAsPdfIcon fontSize="small" color="primary" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </InputAdornment>
                                                        ) : null,
                                                    },
                                                }}
                                            />

                                            <TextField
                                                label="Convenios Institucionales (Alianzas / Redes)"
                                                value={data.convenio}
                                                onChange={(e) => setData('convenio', e.target.value)}
                                                placeholder="Convenios con universidades, empresas, colegios profesionales..."
                                                error={!!errors.convenio}
                                                helperText={errors.convenio || 'Alianzas estratégicas vigentes'}
                                                fullWidth
                                                size="small"
                                            />

                                            <TextField
                                                label="Seminarios / Talleres Especiales (Enlace)"
                                                value={data.seminario}
                                                onChange={(e) => setData('seminario', e.target.value)}
                                                placeholder="https://.../seminarios"
                                                error={!!errors.seminario}
                                                helperText={errors.seminario || 'Página o landing de conferencias y masterclasses'}
                                                fullWidth
                                                size="small"
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        )}

                        {/* ========================================================================= */}
                        {/* PESTAÑA 3: OFERTA FORMATIVA (CARRERAS, DIPLOMADOS Y CURSOS) */}
                        {/* ========================================================================= */}
                        {currentTab === 3 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, width: '100%', boxSizing: 'border-box' }}>
                                {/* 1. CARRERAS PROFESIONALES ACADÉMICAS */}
                                {isAcademic && (
                                    <Card variant="outlined" sx={{ borderRadius: 2.5 }}>
                                        <CardHeader
                                            avatar={<SchoolIcon color="primary" />}
                                            title="1. Carreras Profesionales Registradas"
                                            subheader={`Planes de estudio oficiales registrados para ${comercio.nombre}, junto con sus diplomados y cursos.`}
                                            titleTypographyProps={{ variant: 'subtitle1', fontWeight: 700 }}
                                            action={
                                                <Link
                                                    href={`/admin/carreras?comercio_id=${comercio.id}`}
                                                    style={{ textDecoration: 'none' }}
                                                >
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="primary"
                                                        startIcon={<SchoolIcon />}
                                                        endIcon={<LaunchIcon sx={{ fontSize: '11px !important' }} />}
                                                        sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                                                    >
                                                        Administrar Carreras
                                                    </Button>
                                                </Link>
                                            }
                                        />
                                        <Divider />
                                        <CardContent sx={{ p: 3 }}>
                                            {/* Buscador de Carreras */}
                                            {totalCarreras > 2 && (
                                                <Box sx={{ mb: 2.5 }}>
                                                    <TextField
                                                        size="small"
                                                        placeholder="Buscar carrera por nombre o código..."
                                                        value={searchCarrera}
                                                        onChange={(e) => setSearchCarrera(e.target.value)}
                                                        sx={{ maxWidth: 380 }}
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
                                            )}

                                            {filteredCarreras.length > 0 ? (
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                    {filteredCarreras.map((carrera) => (
                                                        <Accordion
                                                            key={carrera.id}
                                                            defaultExpanded
                                                            variant="outlined"
                                                            sx={{
                                                                borderRadius: '12px !important',
                                                                '&:before': { display: 'none' },
                                                                overflow: 'hidden',
                                                                bgcolor: (theme) => theme.palette.mode === 'dark' ? '#152844' : '#fafafa',
                                                            }}
                                                        >
                                                            <AccordionSummary
                                                                expandIcon={<ExpandMoreIcon />}
                                                                sx={{
                                                                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#f1f5f9',
                                                                    px: 2.5,
                                                                    minHeight: 56,
                                                                }}
                                                            >
                                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mr: 2, flexWrap: 'wrap', gap: 1 }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                                        <SchoolIcon color="primary" sx={{ fontSize: 22 }} />
                                                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                                                                            {carrera.nombre}
                                                                        </Typography>
                                                                        {carrera.codigo && (
                                                                            <Chip
                                                                                label={carrera.codigo}
                                                                                size="small"
                                                                                sx={{ fontSize: '0.68rem', height: 20, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0', fontWeight: 800 }}
                                                                            />
                                                                        )}
                                                                    </Box>

                                                                    {/* Badges de documentos de carrera */}
                                                                    <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
                                                                        {carrera.url_malla_curricular && (
                                                                            <Button
                                                                                href={carrera.url_malla_curricular}
                                                                                target="_blank"
                                                                                size="small"
                                                                                startIcon={<PictureAsPdfIcon fontSize="small" color="primary" />}
                                                                                sx={{ textTransform: 'none', fontSize: '0.72rem', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#ffffff', border: '1px solid', borderColor: 'divider', py: 0.2 }}
                                                                            >
                                                                                Malla
                                                                            </Button>
                                                                        )}
                                                                        {carrera.url_declaracion_jurada && (
                                                                            <Button
                                                                                href={carrera.url_declaracion_jurada}
                                                                                target="_blank"
                                                                                size="small"
                                                                                startIcon={<DescriptionIcon fontSize="small" color="secondary" />}
                                                                                sx={{ textTransform: 'none', fontSize: '0.72rem', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#ffffff', border: '1px solid', borderColor: 'divider', py: 0.2 }}
                                                                            >
                                                                                DJ
                                                                            </Button>
                                                                        )}
                                                                        {carrera.modelo_certificado && (
                                                                            <Button
                                                                                href={carrera.modelo_certificado}
                                                                                target="_blank"
                                                                                size="small"
                                                                                startIcon={<WorkspacePremiumIcon fontSize="small" color="success" />}
                                                                                sx={{ textTransform: 'none', fontSize: '0.72rem', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#ffffff', border: '1px solid', borderColor: 'divider', py: 0.2 }}
                                                                            >
                                                                                Certificado
                                                                            </Button>
                                                                        )}
                                                                    </Box>
                                                                </Box>
                                                            </AccordionSummary>

                                                            <AccordionDetails sx={{ p: 2.5, bgcolor: (theme) => theme.palette.mode === 'dark' ? '#152844' : '#ffffff' }}>
                                                                {/* Diplomados de la Carrera */}
                                                                <Box sx={{ mb: 2.5 }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                                                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#1e40af', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                            <WorkspacePremiumIcon sx={{ fontSize: 16 }} />
                                                                            DIPLOMADOS DE LA CARRERA ({carrera.diplomados?.length || 0})
                                                                        </Typography>
                                                                        <Link href={`/admin/diplomados?comercio_id=${comercio.id}`} style={{ textDecoration: 'none' }}>
                                                                            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, '&:hover': { textDecoration: 'underline' } }}>
                                                                                + Administrar Diplomados
                                                                            </Typography>
                                                                        </Link>
                                                                    </Box>

                                                                    {carrera.diplomados && carrera.diplomados.length > 0 ? (
                                                                        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5 }}>
                                                                            <Table size="small">
                                                                                <TableHead sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? '#0f1f38' : '#f8fafc' }}>
                                                                                    <TableRow>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem' }}>Nombre</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 90 }}>Flyer</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 90 }}>Brochure</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 90 }}>YouTube</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 85 }}>Precio</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 90 }}>Drive</TableCell>
                                                                                    </TableRow>
                                                                                </TableHead>
                                                                                <TableBody>
                                                                                    {carrera.diplomados.map((dip) => (
                                                                                        <TableRow key={dip.id} hover>
                                                                                            <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem' }}>{dip.nombre}</TableCell>
                                                                                            <TableCell>
                                                                                                {dip.flyer ? (
                                                                                                    <IconButton href={dip.flyer} target="_blank" size="small" color="primary">
                                                                                                        <ImageIcon fontSize="small" sx={{ color: '#ea580c' }} />
                                                                                                    </IconButton>
                                                                                                ) : '-'}
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                {dip.brochure ? (
                                                                                                    <IconButton href={dip.brochure} target="_blank" size="small" color="primary">
                                                                                                        <DescriptionIcon fontSize="small" sx={{ color: '#2563eb' }} />
                                                                                                    </IconButton>
                                                                                                ) : '-'}
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                {dip.youtube ? (
                                                                                                    <IconButton href={dip.youtube} target="_blank" size="small">
                                                                                                        <YouTubeIcon fontSize="small" color="error" />
                                                                                                    </IconButton>
                                                                                                ) : '-'}
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                {dip.precio ? <Chip label={dip.precio} size="small" variant="outlined" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} /> : '-'}
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                {dip.actualizado_drive ? (
                                                                                                    <IconButton href={dip.actualizado_drive} target="_blank" size="small">
                                                                                                        <CloudDoneIcon fontSize="small" sx={{ color: '#059669' }} />
                                                                                                    </IconButton>
                                                                                                ) : '-'}
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    ))}
                                                                                </TableBody>
                                                                            </Table>
                                                                        </TableContainer>
                                                                    ) : (
                                                                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                                            Sin diplomados asociados.
                                                                        </Typography>
                                                                    )}
                                                                </Box>

                                                                {/* Cursos de la Carrera */}
                                                                <Box>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                                                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f766e', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                            <MenuBookIcon sx={{ fontSize: 16 }} />
                                                                            CURSOS DE LA CARRERA ({carrera.cursos?.length || 0})
                                                                        </Typography>
                                                                        <Link href={`/admin/cursos?comercio_id=${comercio.id}`} style={{ textDecoration: 'none' }}>
                                                                            <Typography variant="caption" sx={{ color: '#0f766e', fontWeight: 700, '&:hover': { textDecoration: 'underline' } }}>
                                                                                + Administrar Cursos
                                                                            </Typography>
                                                                        </Link>
                                                                    </Box>

                                                                    {carrera.cursos && carrera.cursos.length > 0 ? (
                                                                        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5 }}>
                                                                            <Table size="small">
                                                                                <TableHead sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? '#0f1f38' : '#f8fafc' }}>
                                                                                    <TableRow>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem' }}>Nombre</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 90 }}>Flyer</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 90 }}>Brochure</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 90 }}>YouTube</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 85 }}>Precio</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 90 }}>Drive</TableCell>
                                                                                    </TableRow>
                                                                                </TableHead>
                                                                                <TableBody>
                                                                                    {carrera.cursos.map((cur) => (
                                                                                        <TableRow key={cur.id} hover>
                                                                                            <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem' }}>{cur.nombre}</TableCell>
                                                                                            <TableCell>
                                                                                                {cur.flyer ? (
                                                                                                    <IconButton href={cur.flyer} target="_blank" size="small">
                                                                                                        <ImageIcon fontSize="small" sx={{ color: '#ea580c' }} />
                                                                                                    </IconButton>
                                                                                                ) : '-'}
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                {cur.brochure ? (
                                                                                                    <IconButton href={cur.brochure} target="_blank" size="small">
                                                                                                        <DescriptionIcon fontSize="small" sx={{ color: '#2563eb' }} />
                                                                                                    </IconButton>
                                                                                                ) : '-'}
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                {cur.youtube ? (
                                                                                                    <IconButton href={cur.youtube} target="_blank" size="small">
                                                                                                        <YouTubeIcon fontSize="small" color="error" />
                                                                                                    </IconButton>
                                                                                                ) : '-'}
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                {cur.precio ? <Chip label={cur.precio} size="small" variant="outlined" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} /> : '-'}
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                {cur.actualizado_drive ? (
                                                                                                    <IconButton href={cur.actualizado_drive} target="_blank" size="small">
                                                                                                        <CloudDoneIcon fontSize="small" sx={{ color: '#059669' }} />
                                                                                                    </IconButton>
                                                                                                ) : '-'}
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    ))}
                                                                                </TableBody>
                                                                            </Table>
                                                                        </TableContainer>
                                                                    ) : (
                                                                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                                            Sin cursos asociados.
                                                                        </Typography>
                                                                    )}
                                                                </Box>
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    ))}
                                                </Box>
                                            ) : (
                                                <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : '#f8fafc', borderRadius: 2 }}>
                                                    <SchoolIcon sx={{ fontSize: 36, color: 'text.secondary', mb: 1 }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {searchCarrera ? 'No se encontraron carreras con ese criterio de búsqueda.' : 'No hay carreras registradas para este comercio.'}
                                                    </Typography>
                                                </Paper>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}

                                {/* 2. DIPLOMADOS INDEPENDIENTES / POR RUBRO */}
                                {showStandaloneDiplomados && (
                                    <Card variant="outlined" sx={{ borderRadius: 2.5 }}>
                                        <CardHeader
                                            avatar={<WorkspacePremiumIcon color="primary" />}
                                            title={isDiplomadoLibre ? "2. Diplomados Registrados (Libres / Sin Categoría)" : "2. Diplomados y Especializaciones por Rubro"}
                                            subheader={`Oferta de diplomados registrados para ${comercio.nombre}`}
                                            titleTypographyProps={{ variant: 'subtitle1', fontWeight: 700 }}
                                            action={
                                                <Link
                                                    href={`/admin/diplomados?comercio_id=${comercio.id}`}
                                                    style={{ textDecoration: 'none' }}
                                                >
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="primary"
                                                        startIcon={<WorkspacePremiumIcon />}
                                                        endIcon={<LaunchIcon sx={{ fontSize: '11px !important' }} />}
                                                        sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                                                    >
                                                        Administrar Diplomados
                                                    </Button>
                                                </Link>
                                            }
                                        />
                                        <Divider />
                                        <CardContent sx={{ p: 3 }}>
                                            {/* Filtro y Buscador de Diplomados */}
                                            <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexWrap: 'wrap', alignItems: 'center' }}>
                                                <TextField
                                                    size="small"
                                                    placeholder="Buscar diplomado..."
                                                    value={searchDiplomado}
                                                    onChange={(e) => setSearchDiplomado(e.target.value)}
                                                    sx={{ minWidth: 260 }}
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

                                                {!isDiplomadoLibre && (
                                                    <FormControl size="small" sx={{ minWidth: 200 }}>
                                                        <InputLabel id="filtro-dip-label">Filtrar por Rubro</InputLabel>
                                                        <Select
                                                            labelId="filtro-dip-label"
                                                            value={filterDiplomadoTipo}
                                                            label="Filtrar por Rubro"
                                                            onChange={(e) => setFilterDiplomadoTipo(e.target.value)}
                                                        >
                                                            <MenuItem value="all">Todos los rubros</MenuItem>
                                                            {rubros && rubros.length > 0 ? (
                                                                rubros.map((r) => (
                                                                    <MenuItem key={r.clave} value={r.clave}>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: r.color_hex || '#7c3aed', flexShrink: 0 }} />
                                                                            {r.nombre}
                                                                        </Box>
                                                                    </MenuItem>
                                                                ))
                                                            ) : (
                                                                <>
                                                                    <MenuItem value="ambientales">Ambientales</MenuItem>
                                                                    <MenuItem value="calidad_isos">Calidad ISOs</MenuItem>
                                                                    <MenuItem value="mineros">Mineros</MenuItem>
                                                                    <MenuItem value="administracion">Administración</MenuItem>
                                                                    <MenuItem value="arquitectura_ingenieria">Arq. e Ingeniería</MenuItem>
                                                                    <MenuItem value="osha">OSHA</MenuItem>
                                                                    <MenuItem value="comercio_exterior">Comercio Exterior</MenuItem>
                                                                    <MenuItem value="rubro_legal">Rubro Legal</MenuItem>
                                                                </>
                                                            )}
                                                        </Select>
                                                    </FormControl>
                                                )}
                                            </Box>

                                            {filteredStandaloneDiplomados.length > 0 ? (
                                                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                                                    <Table size="small">
                                                        <TableHead sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? '#0f1f38' : '#f8fafc' }}>
                                                            <TableRow>
                                                                {!isDiplomadoLibre && (
                                                                    <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', minWidth: 130 }}>Rubro / Tipo</TableCell>
                                                                )}
                                                                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', minWidth: 220 }}>Nombre del Diplomado</TableCell>
                                                                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', width: 90 }}>Flyer</TableCell>
                                                                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', width: 90 }}>Brochure</TableCell>
                                                                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', width: 90 }}>YouTube</TableCell>
                                                                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', width: 90 }}>Precio</TableCell>
                                                                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', width: 90 }}>Drive</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {filteredStandaloneDiplomados.map((dip) => (
                                                                <TableRow key={dip.id} hover>
                                                                    {!isDiplomadoLibre && (
                                                                        <TableCell>{getDiplomadoChip(dip.tipo)}</TableCell>
                                                                    )}
                                                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.82rem' }}>{dip.nombre}</TableCell>
                                                                    <TableCell>
                                                                        {dip.flyer ? (
                                                                            <IconButton href={dip.flyer} target="_blank" size="small">
                                                                                <ImageIcon fontSize="small" sx={{ color: '#ea580c' }} />
                                                                            </IconButton>
                                                                        ) : '-'}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {dip.brochure ? (
                                                                            <IconButton href={dip.brochure} target="_blank" size="small">
                                                                                <DescriptionIcon fontSize="small" sx={{ color: '#2563eb' }} />
                                                                            </IconButton>
                                                                        ) : '-'}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {dip.youtube ? (
                                                                            <IconButton href={dip.youtube} target="_blank" size="small">
                                                                                <YouTubeIcon fontSize="small" color="error" />
                                                                            </IconButton>
                                                                        ) : '-'}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {dip.precio ? <Chip label={dip.precio} size="small" variant="outlined" color="primary" sx={{ height: 22, fontWeight: 700 }} /> : '-'}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {dip.actualizado_drive ? (
                                                                            <IconButton href={dip.actualizado_drive} target="_blank" size="small">
                                                                                <CloudDoneIcon fontSize="small" sx={{ color: '#059669' }} />
                                                                            </IconButton>
                                                                        ) : '-'}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            ) : (
                                                <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : '#f8fafc', borderRadius: 2 }}>
                                                    <WorkspacePremiumIcon sx={{ fontSize: 36, color: 'text.secondary', mb: 1 }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        No se encontraron diplomados registrados.
                                                    </Typography>
                                                </Paper>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}

                                {/* 3. CURSOS INDEPENDIENTES */}
                                {showStandaloneCursos && (
                                    <Card variant="outlined" sx={{ borderRadius: 2.5 }}>
                                        <CardHeader
                                            avatar={<MenuBookIcon color="primary" />}
                                            title="3. Cursos y Talleres Registrados"
                                            subheader={`Oferta de cursos independientes para ${comercio.nombre}`}
                                            titleTypographyProps={{ variant: 'subtitle1', fontWeight: 700 }}
                                            action={
                                                <Link
                                                    href={`/admin/cursos?comercio_id=${comercio.id}`}
                                                    style={{ textDecoration: 'none' }}
                                                >
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="primary"
                                                        startIcon={<MenuBookIcon />}
                                                        endIcon={<LaunchIcon sx={{ fontSize: '11px !important' }} />}
                                                        sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                                                    >
                                                        Administrar Cursos
                                                    </Button>
                                                </Link>
                                            }
                                        />
                                        <Divider />
                                        <CardContent sx={{ p: 3 }}>
                                            {/* Buscador y filtro de Cursos */}
                                            <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexWrap: 'wrap', alignItems: 'center' }}>
                                                <TextField
                                                    size="small"
                                                    placeholder="Buscar curso..."
                                                    value={searchCurso}
                                                    onChange={(e) => setSearchCurso(e.target.value)}
                                                    sx={{ minWidth: 260 }}
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

                                                {!isMatpel && (
                                                    <FormControl size="small" sx={{ minWidth: 200 }}>
                                                        <InputLabel id="filtro-cur-label">Filtrar por Rubro</InputLabel>
                                                        <Select
                                                            labelId="filtro-cur-label"
                                                            value={filterCursoTipo}
                                                            label="Filtrar por Rubro"
                                                            onChange={(e) => setFilterCursoTipo(e.target.value)}
                                                        >
                                                            <MenuItem value="all">Todos los rubros y tipos</MenuItem>
                                                            {rubros && rubros.length > 0 ? (
                                                                rubros.map((r) => (
                                                                    <MenuItem key={r.clave} value={r.clave}>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: r.color_hex || '#0284c7', flexShrink: 0 }} />
                                                                            {r.nombre}
                                                                        </Box>
                                                                    </MenuItem>
                                                                ))
                                                            ) : (
                                                                <>
                                                                    <MenuItem value="tradicional">Tradicional</MenuItem>
                                                                    <MenuItem value="especializado">Especializado</MenuItem>
                                                                    <MenuItem value="ambientales">Ambientales</MenuItem>
                                                                    <MenuItem value="calidad_isos">Calidad e ISOs</MenuItem>
                                                                    <MenuItem value="mineros">Mineros</MenuItem>
                                                                    <MenuItem value="administracion">Administración</MenuItem>
                                                                    <MenuItem value="arquitectura_ingenieria">Arq. e Ingeniería</MenuItem>
                                                                    <MenuItem value="osha">OSHA</MenuItem>
                                                                    <MenuItem value="comercio_exterior">Comercio Exterior</MenuItem>
                                                                    <MenuItem value="rubro_legal">Rubro Legal</MenuItem>
                                                                    <MenuItem value="no_actualizados">No Actualizados</MenuItem>
                                                                    <MenuItem value="nombramiento">Nombramiento</MenuItem>
                                                                    <MenuItem value="secundaria">Secundaria</MenuItem>
                                                                    <MenuItem value="generico">Genérico</MenuItem>
                                                                </>
                                                            )}
                                                        </Select>
                                                    </FormControl>
                                                )}
                                            </Box>

                                            {filteredStandaloneCursos.length > 0 ? (
                                                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                                                    <Table size="small">
                                                        <TableHead sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? '#0f1f38' : '#f8fafc' }}>
                                                            <TableRow>
                                                                {!isMatpel && (
                                                                    <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', minWidth: 130 }}>Rubro / Tipo</TableCell>
                                                                )}
                                                                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', minWidth: 220 }}>Nombre del Curso</TableCell>
                                                                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', width: 90 }}>Flyer</TableCell>
                                                                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', width: 90 }}>Brochure</TableCell>
                                                                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', width: 90 }}>YouTube</TableCell>
                                                                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', width: 90 }}>Precio</TableCell>
                                                                <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', width: 90 }}>Drive</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {filteredStandaloneCursos.map((curso) => (
                                                                <TableRow key={curso.id} hover>
                                                                    {!isMatpel && (
                                                                        <TableCell>
                                                                            {getDiplomadoChip(curso.tipo)}
                                                                        </TableCell>
                                                                    )}
                                                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.82rem' }}>{curso.nombre}</TableCell>
                                                                        <TableCell>
                                                                            {curso.flyer ? (
                                                                                <IconButton href={curso.flyer} target="_blank" size="small">
                                                                                    <ImageIcon fontSize="small" sx={{ color: '#ea580c' }} />
                                                                                </IconButton>
                                                                            ) : '-'}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {curso.brochure ? (
                                                                                <IconButton href={curso.brochure} target="_blank" size="small">
                                                                                    <DescriptionIcon fontSize="small" sx={{ color: '#2563eb' }} />
                                                                                </IconButton>
                                                                            ) : '-'}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {curso.youtube ? (
                                                                                <IconButton href={curso.youtube} target="_blank" size="small">
                                                                                    <YouTubeIcon fontSize="small" color="error" />
                                                                                </IconButton>
                                                                            ) : '-'}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {curso.precio ? <Chip label={curso.precio} size="small" variant="outlined" color="primary" sx={{ height: 22, fontWeight: 700 }} /> : '-'}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {curso.actualizado_drive ? (
                                                                                <IconButton href={curso.actualizado_drive} target="_blank" size="small">
                                                                                    <CloudDoneIcon fontSize="small" sx={{ color: '#059669' }} />
                                                                                </IconButton>
                                                                            ) : '-'}
                                                                        </TableCell>
                                                                    </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            ) : (
                                                <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : '#f8fafc', borderRadius: 2 }}>
                                                    <MenuBookIcon sx={{ fontSize: 36, color: 'text.secondary', mb: 1 }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        No se encontraron cursos registrados.
                                                    </Typography>
                                                </Paper>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}

                                {/* 4. SIN OFERTA EDUCATIVA/CURSOS (COMERCIOS CORPORATIVOS DIRECTOS) */}
                                {!isAcademic && !hasDiplomados && !hasCursos && (
                                    <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : '#f8fafc', borderRadius: 2.5 }}>
                                        <CheckCircleIcon color="action" sx={{ fontSize: 44, mb: 1, color: '#94a3b8' }} />
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                                            Comercio de Rubro Corporativo / Comercial Directo
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
                                            Este comercio no cuenta con programas académicos, carreras ni cursos técnicos registrados en el sistema.
                                        </Typography>
                                    </Paper>
                                )}
                            </Box>
                        )}
                    </Box>
                </Paper>

                {/* BARRA INFERIOR FLOTANTE DE GUARDADO */}
                <Paper
                    elevation={3}
                    sx={{
                        p: 2,
                        px: 3,
                        borderRadius: 3,
                        bgcolor: 'background.paper',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                        position: 'sticky',
                        bottom: 16,
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                        border: '1px solid',
                        borderColor: 'divider',
                        zIndex: 10,
                        width: '100%',
                        boxSizing: 'border-box',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                            Modificando: <strong>{data.nombre || comercio.nombre}</strong>
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Link href={`/admin/comercios`} style={{ textDecoration: 'none' }}>
                            <Button variant="outlined" color="inherit" sx={{ textTransform: 'none', fontWeight: 600, px: 2.5, borderRadius: 2 }}>
                                Cancelar
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={processing}
                            startIcon={processing ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                            sx={{
                                bgcolor: data.color_hex || '#0c43a3',
                                textTransform: 'none',
                                fontWeight: 700,
                                px: 3.5,
                                py: 1,
                                borderRadius: 2,
                                '&:hover': { filter: 'brightness(0.92)' },
                            }}
                        >
                            {processing ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </Box>
                </Paper>
            </Box>

            {/* DIÁLOGO MODAL PARA PREVISUALIZACIÓN DE FOTOS */}
            <Dialog
                open={Boolean(previewImageUrl)}
                onClose={() => setPreviewImageUrl(null)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Vista Previa de Imagen
                    </Typography>
                    <IconButton size="small" onClick={() => setPreviewImageUrl(null)}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 2, textAlign: 'center', bgcolor: '#0f172a' }}>
                    {previewImageUrl && (
                        <Box
                            component="img"
                            src={previewImageUrl}
                            alt="Previsualización"
                            sx={{
                                maxWidth: '100%',
                                maxHeight: '70vh',
                                objectFit: 'contain',
                                borderRadius: 1.5,
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

EditComercioPage.layout = (props: { comercio?: Comercio }) => {
    const comercioNombre = props?.comercio?.nombre ? `Editar ${props.comercio.nombre}` : 'Editar Comercio';
    const editHref = props?.comercio?.id ? `/admin/comercios/${props.comercio.id}/edit` : '#';

    return {
        breadcrumbs: [
            {
                title: 'Panel Principal',
                href: '/dashboard',
            },
            {
                title: 'Comercios e Institutos',
                href: '/admin/comercios',
            },
            {
                title: comercioNombre,
                href: editHref,
            },
        ],
    };
};
