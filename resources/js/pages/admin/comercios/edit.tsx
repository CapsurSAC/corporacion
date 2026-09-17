import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { useNotification } from '@/hooks/use-notification';
import { confirmDeleteAlert } from '@/lib/swal';
import { isMinLength, isValidHexColor } from '@/lib/validation';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BusinessIcon from '@mui/icons-material/Business';
import CategoryIcon from '@mui/icons-material/Category';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import DomainIcon from '@mui/icons-material/Domain';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ImageIcon from '@mui/icons-material/Image';
import LabelIcon from '@mui/icons-material/Label';
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
import { CarreraDialog } from '@/components/admin/carrera-dialog';
import { EspecialidadDialog } from '@/components/admin/especialidad-dialog';
import { DiplomadoDialog } from '@/components/admin/diplomado-dialog';
import { CursoDialog } from '@/components/admin/curso-dialog';
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
import type { Carrera, Comercio, Curso, Diplomado, Especialidad, Estado, Grupo, Rubro } from '@/types';

interface EditComercioPageProps {
    comercio: Comercio & {
        carreras?: (Carrera & {
            diplomados?: Diplomado[];
            cursos?: Curso[];
            especialidades?: (Especialidad & { rubro?: Rubro; estado?: Estado })[];
        })[];
        cursos?: Curso[];
        diplomados?: Diplomado[];
        especialidades?: (Especialidad & { carrera?: Carrera; rubro?: Rubro; estado?: Estado })[];
    };
    grupos: Grupo[];
    rubros?: Rubro[];
    estados?: Estado[];
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

export default function EditComercioPage({ comercio, grupos, rubros = [], estados = [] }: EditComercioPageProps) {
    
    
    const { notify } = useNotification();

    // Tabs state - initialize from URL ?tab=3 or ?tab=oferta
    const [currentTab, setCurrentTab] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const tab = params.get('tab');
            if (tab === '3' || tab === 'oferta') return 3;
            if (tab === '1' || tab === 'medios') return 1;
            if (tab === '2' || tab === 'acreditacion') return 2;
            if (tab === '0' || tab === 'datos') return 0;
        }
        return 0;
    });

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('tab', String(newValue));
            window.history.replaceState({}, '', url.toString());
        }
    };

    // Dialog states for in-situ CRUD
    const [carreraDialogOpen, setCarreraDialogOpen] = useState(false);
    const [selectedCarrera, setSelectedCarrera] = useState<Carrera | null>(null);

    const [especialidadDialogOpen, setEspecialidadDialogOpen] = useState(false);
    const [selectedEspecialidad, setSelectedEspecialidad] = useState<Especialidad | null>(null);
    const [defaultCarreraIdForEspecialidad, setDefaultCarreraIdForEspecialidad] = useState<number | null>(null);

    const [diplomadoDialogOpen, setDiplomadoDialogOpen] = useState(false);
    const [selectedDiplomado, setSelectedDiplomado] = useState<Diplomado | null>(null);
    const [defaultCarreraIdForDiplomado, setDefaultCarreraIdForDiplomado] = useState<number | null>(null);

    const [cursoDialogOpen, setCursoDialogOpen] = useState(false);
    const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
    const [defaultCarreraIdForCurso, setDefaultCarreraIdForCurso] = useState<number | null>(null);

    // YouTube & Photo addition states
    const [nuevoYoutube, setNuevoYoutube] = useState('');
    const [nuevaFoto, setNuevaFoto] = useState('');

    // Image preview modal state
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

    // Search filter for academic offer
    const [searchCarrera, setSearchCarrera] = useState('');

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

    const totalCarreras = comercio.carreras?.length || 0;
    const totalDiplomados = comercio.diplomados?.length || 0;
    const totalCursos = comercio.cursos?.length || 0;
    const totalEspecialidades =
        comercio.especialidades?.length ||
        (comercio.carreras?.reduce((acc, c) => acc + (c.especialidades?.length || 0), 0) || 0);
    const totalOferta = totalCarreras + totalDiplomados + totalCursos + totalEspecialidades;

    // In-situ CRUD handlers
    const handleOpenCreateCarrera = () => {
        setSelectedCarrera(null);
        setCarreraDialogOpen(true);
    };

    const handleOpenEditCarrera = (c: Carrera) => {
        setSelectedCarrera(c);
        setCarreraDialogOpen(true);
    };

    const handleDeleteCarrera = async (carrera: Carrera) => {
        const confirmed = await confirmDeleteAlert({
            title: `¿Eliminar carrera "${carrera.nombre}"?`,
            text: 'Esta acción no se puede deshacer y podría afectar a los diplomados, cursos y especialidades asociados.',
            confirmButtonText: 'Sí, eliminar carrera',
        });
        if (confirmed) {
            router.delete(`/admin/carreras/${carrera.id}`, {
                preserveScroll: true,
                onSuccess: () => notify.success('Carrera eliminada exitosamente.'),
                onError: () => notify.error('No se pudo eliminar la carrera.'),
            });
        }
    };

    const handleOpenCreateEspecialidad = (carreraId?: number) => {
        const availableCarreras = comercio.carreras || [];
        if (availableCarreras.length === 0) {
            notify.warning('Para registrar una especialidad, primero debes registrar al menos una Carrera Profesional a la cual pertenecerá.');
            setSelectedCarrera(null);
            setCarreraDialogOpen(true);
            return;
        }
        setSelectedEspecialidad(null);
        setDefaultCarreraIdForEspecialidad(carreraId || availableCarreras[0]?.id || null);
        setEspecialidadDialogOpen(true);
    };

    const handleOpenEditEspecialidad = (esp: Especialidad) => {
        setSelectedEspecialidad(esp);
        setDefaultCarreraIdForEspecialidad(esp.carrera_id || null);
        setEspecialidadDialogOpen(true);
    };

    const handleDeleteEspecialidad = async (especialidad: Especialidad) => {
        const confirmed = await confirmDeleteAlert({
            title: `¿Eliminar la especialidad "${especialidad.nombre}"?`,
            text: 'Esta acción no se puede deshacer.',
            confirmButtonText: 'Sí, eliminar',
        });
        if (confirmed) {
            router.delete(`/admin/especialidades/${especialidad.id}`, {
                preserveScroll: true,
                onSuccess: () => notify.success('Especialidad eliminada exitosamente.'),
                onError: () => notify.error('No se pudo eliminar la especialidad.'),
            });
        }
    };

    const handleOpenCreateDiplomado = (carreraId?: number) => {
        setSelectedDiplomado(null);
        setDefaultCarreraIdForDiplomado(carreraId || null);
        setDiplomadoDialogOpen(true);
    };

    const handleOpenEditDiplomado = (dip: Diplomado) => {
        setSelectedDiplomado(dip);
        setDefaultCarreraIdForDiplomado(dip.carrera_id || null);
        setDiplomadoDialogOpen(true);
    };

    const handleDeleteDiplomado = async (diplomado: Diplomado) => {
        const confirmed = await confirmDeleteAlert({
            title: `¿Eliminar el diplomado "${diplomado.nombre}"?`,
            text: 'Esta acción no se puede deshacer.',
            confirmButtonText: 'Sí, eliminar',
        });
        if (confirmed) {
            router.delete(`/admin/diplomados/${diplomado.id}`, {
                preserveScroll: true,
                onSuccess: () => notify.success('Diplomado eliminado exitosamente.'),
                onError: () => notify.error('No se pudo eliminar el diplomado.'),
            });
        }
    };

    const handleOpenCreateCurso = (carreraId?: number) => {
        setSelectedCurso(null);
        setDefaultCarreraIdForCurso(carreraId || null);
        setCursoDialogOpen(true);
    };

    const handleOpenEditCurso = (cur: Curso) => {
        setSelectedCurso(cur);
        setDefaultCarreraIdForCurso(cur.carrera_id || null);
        setCursoDialogOpen(true);
    };

    const handleDeleteCurso = async (curso: Curso) => {
        const confirmed = await confirmDeleteAlert({
            title: `¿Eliminar el curso "${curso.nombre}"?`,
            text: 'Esta acción no se puede deshacer.',
            confirmButtonText: 'Sí, eliminar',
        });
        if (confirmed) {
            router.delete(`/admin/cursos/${curso.id}`, {
                preserveScroll: true,
                onSuccess: () => notify.success('Curso eliminado exitosamente.'),
                onError: () => notify.error('No se pudo eliminar el curso.'),
            });
        }
    };

    // Filtered lists
    const filteredCarreras = useMemo(() => {
        if (!comercio.carreras) return [];
        if (!searchCarrera.trim()) return comercio.carreras;
        const q = searchCarrera.toLowerCase();
        return comercio.carreras.filter(
            (c) => c.nombre.toLowerCase().includes(q) || c.codigo?.toLowerCase().includes(q)
        );
    }, [comercio.carreras, searchCarrera]);

    const selectedGrupo = grupos.find((g) => String(g.id) === String(data.grupo_id));

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
                        onChange={handleTabChange}
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
                                {/* PANEL SUPERIOR DE ACCIONES RÁPIDAS DE OFERTA FORMATIVA */}
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: { xs: 2, sm: 2.5 },
                                        borderRadius: 2.5,
                                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(12, 67, 163, 0.12)' : '#f0f7ff',
                                        borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(12, 67, 163, 0.3)' : '#bfdbfe',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flexWrap: 'wrap',
                                        gap: 2,
                                    }}
                                >
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <SchoolIcon color="primary" />
                                            Oferta Formativa de {comercio.nombre}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Gestiona carreras profesionales, especialidades por rubro, diplomados y cursos para esta institución.
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<AddIcon />}
                                            onClick={handleOpenCreateCarrera}
                                            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                                        >
                                            + Nueva Carrera
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            startIcon={<CategoryIcon />}
                                            onClick={() => handleOpenCreateEspecialidad()}
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 700,
                                                borderRadius: 2,
                                                color: '#7c3aed',
                                                borderColor: '#7c3aed80',
                                                '&:hover': { borderColor: '#7c3aed', bgcolor: '#7c3aed0a' },
                                            }}
                                        >
                                            + Nueva Especialidad
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<WorkspacePremiumIcon />}
                                            onClick={() => handleOpenCreateDiplomado()}
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 700,
                                                borderRadius: 2,
                                                color: '#1e40af',
                                                borderColor: '#1e40af80',
                                                '&:hover': { borderColor: '#1e40af', bgcolor: '#1e40af0a' },
                                            }}
                                        >
                                            + Nuevo Diplomado
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<MenuBookIcon />}
                                            onClick={() => handleOpenCreateCurso()}
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 700,
                                                borderRadius: 2,
                                                color: '#059669',
                                                borderColor: '#05966980',
                                                '&:hover': { borderColor: '#059669', bgcolor: '#0596690a' },
                                            }}
                                        >
                                            + Nuevo Curso
                                        </Button>
                                    </Box>
                                </Paper>

                                {/* CARRERAS PROFESIONALES Y OFERTA FORMATIVA */}
                                <Card variant="outlined" sx={{ borderRadius: 2.5 }}>
                                    <CardHeader
                                        avatar={<SchoolIcon color="primary" />}
                                        title="Carreras Profesionales y Oferta Formativa"
                                        subheader={`Planes de estudio y carreras técnicas de ${comercio.nombre}. Cada carrera incluye sus diplomados, especialidades y cursos asociados.`}
                                        titleTypographyProps={{ variant: 'subtitle1', fontWeight: 700 }}
                                            action={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        color="primary"
                                                        startIcon={<AddIcon />}
                                                        onClick={handleOpenCreateCarrera}
                                                        sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                                                    >
                                                        Nueva Carrera
                                                    </Button>
                                                    <Link
                                                        href={`/admin/carreras?comercio_id=${comercio.id}`}
                                                        style={{ textDecoration: 'none' }}
                                                    >
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            color="inherit"
                                                            startIcon={<SchoolIcon />}
                                                            endIcon={<LaunchIcon sx={{ fontSize: '11px !important' }} />}
                                                            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                                                        >
                                                            Administrar Carreras
                                                        </Button>
                                                    </Link>
                                                </Box>
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

                                                                    {/* Badges de documentos y acciones de carrera */}
                                                                    <Box sx={{ display: 'flex', gap: 0.8, alignItems: 'center', flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
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
                                                                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20 }} />
                                                                        <Tooltip title="Editar carrera" arrow>
                                                                            <IconButton
                                                                                size="small"
                                                                                color="primary"
                                                                                onClick={() => handleOpenEditCarrera(carrera)}
                                                                                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, p: 0.5 }}
                                                                            >
                                                                                <EditIcon sx={{ fontSize: 16 }} />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip title="Eliminar carrera" arrow>
                                                                            <IconButton
                                                                                size="small"
                                                                                color="error"
                                                                                onClick={() => handleDeleteCarrera(carrera)}
                                                                                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, p: 0.5 }}
                                                                            >
                                                                                <DeleteIcon sx={{ fontSize: 16 }} />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </Box>
                                                                </Box>
                                                            </AccordionSummary>

                                                            <AccordionDetails sx={{ p: 2.5, bgcolor: (theme) => theme.palette.mode === 'dark' ? '#152844' : '#ffffff' }}>
                                                                {/* Diplomados de la Carrera */}
                                                                <Box sx={{ mb: 3 }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                                                                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#1e40af', display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem' }}>
                                                                            <WorkspacePremiumIcon sx={{ fontSize: 16 }} />
                                                                            DIPLOMADOS DE LA CARRERA ({carrera.diplomados?.length || 0})
                                                                        </Typography>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                            <Button
                                                                                size="small"
                                                                                variant="outlined"
                                                                                color="primary"
                                                                                startIcon={<AddIcon sx={{ fontSize: 15 }} />}
                                                                                onClick={() => handleOpenCreateDiplomado(carrera.id)}
                                                                                sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.72rem', py: 0.2, px: 1, borderRadius: 1.5 }}
                                                                            >
                                                                                Nuevo Diplomado
                                                                            </Button>
                                                                            <Link href={`/admin/diplomados?comercio_id=${comercio.id}`} style={{ textDecoration: 'none' }}>
                                                                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', '&:hover': { color: 'primary.main', textDecoration: 'underline' } }}>
                                                                                    Ver todos
                                                                                </Typography>
                                                                            </Link>
                                                                        </Box>
                                                                    </Box>

                                                                    {carrera.diplomados && carrera.diplomados.length > 0 ? (
                                                                        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5 }}>
                                                                            <Table size="small">
                                                                                <TableHead sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? '#0f1f38' : '#f8fafc' }}>
                                                                                    <TableRow>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem' }}>Nombre</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 95, textAlign: 'center' }}>Estado</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 70, textAlign: 'center' }}>Flyer</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 70, textAlign: 'center' }}>Brochure</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 70, textAlign: 'center' }}>YouTube</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 85, textAlign: 'center' }}>Precio</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 70, textAlign: 'center' }}>Drive</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 80, textAlign: 'center' }}>Acciones</TableCell>
                                                                                    </TableRow>
                                                                                </TableHead>
                                                                                <TableBody>
                                                                                    {carrera.diplomados.map((dip) => (
                                                                                        <TableRow key={dip.id} hover>
                                                                                            <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem' }}>{dip.nombre}</TableCell>
                                                                                            <TableCell sx={{ textAlign: 'center' }}>
                                                                                                {dip.estado ? (
                                                                                                    <Chip
                                                                                                        label={dip.estado.nombre}
                                                                                                        size="small"
                                                                                                        sx={{
                                                                                                            height: 20,
                                                                                                            fontSize: '0.68rem',
                                                                                                            fontWeight: 700,
                                                                                                            bgcolor: dip.estado.color_hex ? `${dip.estado.color_hex}18` : 'grey.100',
                                                                                                            color: dip.estado.color_hex || 'text.primary',
                                                                                                            border: `1px solid ${dip.estado.color_hex ? `${dip.estado.color_hex}35` : 'divider'}`,
                                                                                                        }}
                                                                                                    />
                                                                                                ) : '-'}
                                                                                            </TableCell>
                                                                                            <TableCell sx={{ textAlign: 'center' }}>
                                                                                                {dip.flyer ? (
                                                                                                    <Tooltip title="Ver flyer" arrow>
                                                                                                        <IconButton href={dip.flyer} target="_blank" size="small">
                                                                                                            <ImageIcon fontSize="small" sx={{ color: '#ea580c' }} />
                                                                                                        </IconButton>
                                                                                                    </Tooltip>
                                                                                                ) : '-'}
                                                                                            </TableCell>
                                                                                            <TableCell sx={{ textAlign: 'center' }}>
                                                                                                {dip.brochure ? (
                                                                                                    <Tooltip title="Ver brochure" arrow>
                                                                                                        <IconButton href={dip.brochure} target="_blank" size="small">
                                                                                                            <DescriptionIcon fontSize="small" sx={{ color: '#2563eb' }} />
                                                                                                        </IconButton>
                                                                                                    </Tooltip>
                                                                                                ) : '-'}
                                                                                            </TableCell>
                                                                                            <TableCell sx={{ textAlign: 'center' }}>
                                                                                                {dip.youtube ? (
                                                                                                    <Tooltip title="Ver video" arrow>
                                                                                                        <IconButton href={dip.youtube} target="_blank" size="small">
                                                                                                            <YouTubeIcon fontSize="small" color="error" />
                                                                                                        </IconButton>
                                                                                                    </Tooltip>
                                                                                                ) : '-'}
                                                                                            </TableCell>
                                                                                            <TableCell sx={{ textAlign: 'center' }}>
                                                                                                {dip.precio ? <Chip label={dip.precio} size="small" variant="outlined" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} /> : '-'}
                                                                                            </TableCell>
                                                                                            <TableCell sx={{ textAlign: 'center' }}>
                                                                                                {dip.actualizado_drive ? (
                                                                                                    <Tooltip title="Ver en Drive" arrow>
                                                                                                        <IconButton href={dip.actualizado_drive} target="_blank" size="small">
                                                                                                            <CloudDoneIcon fontSize="small" sx={{ color: '#059669' }} />
                                                                                                        </IconButton>
                                                                                                    </Tooltip>
                                                                                                ) : '-'}
                                                                                            </TableCell>
                                                                                            <TableCell sx={{ textAlign: 'center' }}>
                                                                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                                                                                    <Tooltip title="Editar diplomado" arrow>
                                                                                                        <IconButton size="small" color="primary" onClick={() => handleOpenEditDiplomado(dip)}>
                                                                                                            <EditIcon sx={{ fontSize: 16 }} />
                                                                                                        </IconButton>
                                                                                                    </Tooltip>
                                                                                                    <Tooltip title="Eliminar diplomado" arrow>
                                                                                                        <IconButton size="small" color="error" onClick={() => handleDeleteDiplomado(dip)}>
                                                                                                            <DeleteIcon sx={{ fontSize: 16 }} />
                                                                                                        </IconButton>
                                                                                                    </Tooltip>
                                                                                                </Box>
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    ))}
                                                                                </TableBody>
                                                                            </Table>
                                                                        </TableContainer>
                                                                    ) : (
                                                                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', display: 'block', py: 0.5 }}>
                                                                            Sin diplomados asociados.
                                                                        </Typography>
                                                                    )}
                                                                </Box>

                                                                {/* Especialidades de la Carrera */}
                                                                <Box sx={{ mb: 3 }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                                                                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#7c3aed', display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem' }}>
                                                                            <CategoryIcon sx={{ fontSize: 16 }} />
                                                                            ESPECIALIDADES DE LA CARRERA ({carrera.especialidades?.length || 0})
                                                                        </Typography>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                            <Button
                                                                                size="small"
                                                                                variant="outlined"
                                                                                color="secondary"
                                                                                startIcon={<AddIcon sx={{ fontSize: 15 }} />}
                                                                                onClick={() => handleOpenCreateEspecialidad(carrera.id)}
                                                                                sx={{
                                                                                    textTransform: 'none',
                                                                                    fontWeight: 700,
                                                                                    fontSize: '0.72rem',
                                                                                    py: 0.2,
                                                                                    px: 1,
                                                                                    borderRadius: 1.5,
                                                                                    color: '#7c3aed',
                                                                                    borderColor: '#7c3aed80',
                                                                                    '&:hover': { borderColor: '#7c3aed', bgcolor: '#7c3aed0a' }
                                                                                }}
                                                                            >
                                                                                Nueva Especialidad
                                                                            </Button>
                                                                            <Link href={`/admin/especialidades?comercio_id=${comercio.id}`} style={{ textDecoration: 'none' }}>
                                                                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', '&:hover': { color: '#7c3aed', textDecoration: 'underline' } }}>
                                                                                    Ver todas
                                                                                </Typography>
                                                                            </Link>
                                                                        </Box>
                                                                    </Box>

                                                                    {carrera.especialidades && carrera.especialidades.length > 0 ? (
                                                                        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5 }}>
                                                                            <Table size="small">
                                                                                <TableHead sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? '#0f1f38' : '#f8fafc' }}>
                                                                                    <TableRow>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem' }}>Nombre de la Especialidad</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', minWidth: 140 }}>Rubro Asignado</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 95, textAlign: 'center' }}>Estado</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 70, textAlign: 'center' }}>Flyer</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 70, textAlign: 'center' }}>Brochure</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 70, textAlign: 'center' }}>YouTube</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 85, textAlign: 'center' }}>Precio</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 70, textAlign: 'center' }}>Drive</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 80, textAlign: 'center' }}>Acciones</TableCell>
                                                                                    </TableRow>
                                                                                </TableHead>
                                                                                <TableBody>
                                                                                    {carrera.especialidades.map((esp) => {
                                                                                        const rubroColor = esp.rubro?.color_hex || '#7c3aed';
                                                                                        return (
                                                                                            <TableRow key={esp.id} hover>
                                                                                                <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem' }}>
                                                                                                    {esp.nombre}
                                                                                                </TableCell>
                                                                                                <TableCell>
                                                                                                    {esp.rubro ? (
                                                                                                        <Chip
                                                                                                            icon={<LabelIcon sx={{ fontSize: '13px !important', color: `${rubroColor} !important` }} />}
                                                                                                            label={esp.rubro.nombre}
                                                                                                            size="small"
                                                                                                            sx={{
                                                                                                                bgcolor: `${rubroColor}14`,
                                                                                                                color: rubroColor,
                                                                                                                border: `1px solid ${rubroColor}40`,
                                                                                                                fontWeight: 700,
                                                                                                                fontSize: '0.72rem',
                                                                                                                height: 22,
                                                                                                            }}
                                                                                                        />
                                                                                                    ) : (
                                                                                                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                                                                            Sin rubro
                                                                                                        </Typography>
                                                                                                    )}
                                                                                                </TableCell>
                                                                                                <TableCell sx={{ textAlign: 'center' }}>
                                                                                                    {esp.estado ? (
                                                                                                        <Chip
                                                                                                            label={esp.estado.nombre}
                                                                                                            size="small"
                                                                                                            sx={{
                                                                                                                height: 20,
                                                                                                                fontSize: '0.68rem',
                                                                                                                fontWeight: 700,
                                                                                                                bgcolor: esp.estado.color_hex ? `${esp.estado.color_hex}18` : 'grey.100',
                                                                                                                color: esp.estado.color_hex || 'text.primary',
                                                                                                                border: `1px solid ${esp.estado.color_hex ? `${esp.estado.color_hex}35` : 'divider'}`,
                                                                                                            }}
                                                                                                        />
                                                                                                    ) : '-'}
                                                                                                </TableCell>
                                                                                                <TableCell sx={{ textAlign: 'center' }}>
                                                                                                    {esp.flyer ? (
                                                                                                        <Tooltip title="Ver flyer" arrow>
                                                                                                            <IconButton href={esp.flyer} target="_blank" size="small">
                                                                                                                <ImageIcon fontSize="small" sx={{ color: '#ea580c' }} />
                                                                                                            </IconButton>
                                                                                                        </Tooltip>
                                                                                                    ) : '-'}
                                                                                                </TableCell>
                                                                                                <TableCell sx={{ textAlign: 'center' }}>
                                                                                                    {esp.brochure ? (
                                                                                                        <Tooltip title="Ver brochure" arrow>
                                                                                                            <IconButton href={esp.brochure} target="_blank" size="small">
                                                                                                                <DescriptionIcon fontSize="small" sx={{ color: '#2563eb' }} />
                                                                                                            </IconButton>
                                                                                                        </Tooltip>
                                                                                                    ) : '-'}
                                                                                                </TableCell>
                                                                                                <TableCell sx={{ textAlign: 'center' }}>
                                                                                                    {esp.youtube ? (
                                                                                                        <Tooltip title="Ver video" arrow>
                                                                                                            <IconButton href={esp.youtube} target="_blank" size="small">
                                                                                                                <YouTubeIcon fontSize="small" color="error" />
                                                                                                            </IconButton>
                                                                                                        </Tooltip>
                                                                                                    ) : '-'}
                                                                                                </TableCell>
                                                                                                <TableCell sx={{ textAlign: 'center' }}>
                                                                                                    {esp.precio ? <Chip label={esp.precio} size="small" variant="outlined" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} /> : '-'}
                                                                                                </TableCell>
                                                                                                <TableCell sx={{ textAlign: 'center' }}>
                                                                                                    {esp.actualizado_drive ? (
                                                                                                        <Tooltip title="Ver en Drive" arrow>
                                                                                                            <IconButton href={esp.actualizado_drive} target="_blank" size="small">
                                                                                                                <CloudDoneIcon fontSize="small" sx={{ color: '#059669' }} />
                                                                                                            </IconButton>
                                                                                                        </Tooltip>
                                                                                                    ) : '-'}
                                                                                                </TableCell>
                                                                                                <TableCell sx={{ textAlign: 'center' }}>
                                                                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                                                                                        <Tooltip title="Editar especialidad" arrow>
                                                                                                            <IconButton size="small" color="primary" onClick={() => handleOpenEditEspecialidad(esp)}>
                                                                                                                <EditIcon sx={{ fontSize: 16 }} />
                                                                                                            </IconButton>
                                                                                                        </Tooltip>
                                                                                                        <Tooltip title="Eliminar especialidad" arrow>
                                                                                                            <IconButton size="small" color="error" onClick={() => handleDeleteEspecialidad(esp)}>
                                                                                                                <DeleteIcon sx={{ fontSize: 16 }} />
                                                                                                            </IconButton>
                                                                                                        </Tooltip>
                                                                                                    </Box>
                                                                                                </TableCell>
                                                                                            </TableRow>
                                                                                        );
                                                                                    })}
                                                                                </TableBody>
                                                                            </Table>
                                                                        </TableContainer>
                                                                    ) : (
                                                                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', display: 'block', py: 0.5 }}>
                                                                            Sin especialidades asociadas a esta carrera.
                                                                        </Typography>
                                                                    )}
                                                                </Box>

                                                                {/* Cursos de la Carrera */}
                                                                <Box>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                                                                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f766e', display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem' }}>
                                                                            <MenuBookIcon sx={{ fontSize: 16 }} />
                                                                            CURSOS DE LA CARRERA ({carrera.cursos?.length || 0})
                                                                        </Typography>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                            <Button
                                                                                size="small"
                                                                                variant="outlined"
                                                                                color="secondary"
                                                                                startIcon={<AddIcon sx={{ fontSize: 15 }} />}
                                                                                onClick={() => handleOpenCreateCurso(carrera.id)}
                                                                                sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.72rem', py: 0.2, px: 1, borderRadius: 1.5 }}
                                                                            >
                                                                                Nuevo Curso
                                                                            </Button>
                                                                            <Link href={`/admin/cursos?comercio_id=${comercio.id}`} style={{ textDecoration: 'none' }}>
                                                                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', '&:hover': { color: '#0f766e', textDecoration: 'underline' } }}>
                                                                                    Ver todos
                                                                                </Typography>
                                                                            </Link>
                                                                        </Box>
                                                                    </Box>

                                                                    {carrera.cursos && carrera.cursos.length > 0 ? (
                                                                        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5 }}>
                                                                            <Table size="small">
                                                                                <TableHead sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? '#0f1f38' : '#f8fafc' }}>
                                                                                    <TableRow>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem' }}>Nombre</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 95, textAlign: 'center' }}>Estado</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 70, textAlign: 'center' }}>Flyer</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 70, textAlign: 'center' }}>Brochure</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 70, textAlign: 'center' }}>YouTube</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 85, textAlign: 'center' }}>Precio</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 70, textAlign: 'center' }}>Drive</TableCell>
                                                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 80, textAlign: 'center' }}>Acciones</TableCell>
                                                                                    </TableRow>
                                                                                </TableHead>
                                                                                <TableBody>
                                                                                    {carrera.cursos.map((cur) => (
                                                                                        <TableRow key={cur.id} hover>
                                                                                            <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem' }}>{cur.nombre}</TableCell>
                                                                                            <TableCell sx={{ textAlign: 'center' }}>
                                                                                                {cur.estado ? (
                                                                                                    <Chip
                                                                                                        label={cur.estado.nombre}
                                                                                                        size="small"
                                                                                                        sx={{
                                                                                                            height: 20,
                                                                                                            fontSize: '0.68rem',
                                                                                                            fontWeight: 700,
                                                                                                            bgcolor: cur.estado.color_hex ? `${cur.estado.color_hex}18` : 'grey.100',
                                                                                                            color: cur.estado.color_hex || 'text.primary',
                                                                                                            border: `1px solid ${cur.estado.color_hex ? `${cur.estado.color_hex}35` : 'divider'}`,
                                                                                                        }}
                                                                                                    />
                                                                                                ) : '-'}
                                                                                            </TableCell>
                                                                                            <TableCell sx={{ textAlign: 'center' }}>
                                                                                                {cur.flyer ? (
                                                                                                    <Tooltip title="Ver flyer" arrow>
                                                                                                        <IconButton href={cur.flyer} target="_blank" size="small">
                                                                                                            <ImageIcon fontSize="small" sx={{ color: '#ea580c' }} />
                                                                                                        </IconButton>
                                                                                                    </Tooltip>
                                                                                                ) : '-'}
                                                                                            </TableCell>
                                                                                            <TableCell sx={{ textAlign: 'center' }}>
                                                                                                {cur.brochure ? (
                                                                                                    <Tooltip title="Ver brochure" arrow>
                                                                                                        <IconButton href={cur.brochure} target="_blank" size="small">
                                                                                                            <DescriptionIcon fontSize="small" sx={{ color: '#2563eb' }} />
                                                                                                        </IconButton>
                                                                                                    </Tooltip>
                                                                                                ) : '-'}
                                                                                            </TableCell>
                                                                                            <TableCell sx={{ textAlign: 'center' }}>
                                                                                                {cur.youtube ? (
                                                                                                    <Tooltip title="Ver video" arrow>
                                                                                                        <IconButton href={cur.youtube} target="_blank" size="small">
                                                                                                            <YouTubeIcon fontSize="small" color="error" />
                                                                                                        </IconButton>
                                                                                                    </Tooltip>
                                                                                                ) : '-'}
                                                                                            </TableCell>
                                                                                            <TableCell sx={{ textAlign: 'center' }}>
                                                                                                {cur.precio ? <Chip label={cur.precio} size="small" variant="outlined" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} /> : '-'}
                                                                                            </TableCell>
                                                                                            <TableCell sx={{ textAlign: 'center' }}>
                                                                                                {cur.actualizado_drive ? (
                                                                                                    <Tooltip title="Ver en Drive" arrow>
                                                                                                        <IconButton href={cur.actualizado_drive} target="_blank" size="small">
                                                                                                            <CloudDoneIcon fontSize="small" sx={{ color: '#059669' }} />
                                                                                                        </IconButton>
                                                                                                    </Tooltip>
                                                                                                ) : '-'}
                                                                                            </TableCell>
                                                                                            <TableCell sx={{ textAlign: 'center' }}>
                                                                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                                                                                    <Tooltip title="Editar curso" arrow>
                                                                                                        <IconButton size="small" color="primary" onClick={() => handleOpenEditCurso(cur)}>
                                                                                                            <EditIcon sx={{ fontSize: 16 }} />
                                                                                                        </IconButton>
                                                                                                    </Tooltip>
                                                                                                    <Tooltip title="Eliminar curso" arrow>
                                                                                                        <IconButton size="small" color="error" onClick={() => handleDeleteCurso(cur)}>
                                                                                                            <DeleteIcon sx={{ fontSize: 16 }} />
                                                                                                        </IconButton>
                                                                                                    </Tooltip>
                                                                                                </Box>
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    ))}
                                                                                </TableBody>
                                                                            </Table>
                                                                        </TableContainer>
                                                                    ) : (
                                                                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', display: 'block', py: 0.5 }}>
                                                                            Sin cursos asociados.
                                                                        </Typography>
                                                                    )}
                                                                </Box>
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    ))}
                                                </Box>
                                            ) : (
                                                <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : '#f8fafc', borderRadius: 2 }}>
                                                    <SchoolIcon sx={{ fontSize: 44, color: 'primary.main', mb: 1, opacity: 0.8 }} />
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                                                        {searchCarrera ? 'No se encontraron carreras con ese criterio de búsqueda' : `No hay carreras registradas para ${comercio.nombre}`}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 480, mx: 'auto', mb: 2 }}>
                                                        {searchCarrera ? 'Prueba con otro término de búsqueda.' : 'Registra la primera carrera profesional o técnica. Una vez creada la carrera, podrás añadir sus especialidades por rubro y diplomados correspondientes.'}
                                                    </Typography>
                                                    {!searchCarrera && (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            startIcon={<AddIcon />}
                                                            onClick={handleOpenCreateCarrera}
                                                            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, px: 2.5 }}
                                                        >
                                                            Registrar Primera Carrera
                                                        </Button>
                                                    )}
                                                </Paper>
                                            )}
                                        </CardContent>
                                    </Card>


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

            {/* DIALOGOS CRUD IN-SITU */}
            <CarreraDialog
                open={carreraDialogOpen}
                onOpenChange={setCarreraDialogOpen}
                carrera={selectedCarrera}
                comercios={[comercio]}
                defaultComercioId={comercio.id}
            />

            <EspecialidadDialog
                open={especialidadDialogOpen}
                onOpenChange={setEspecialidadDialogOpen}
                especialidad={selectedEspecialidad}
                carreras={(comercio.carreras || []).map((c) => ({ ...c, comercio }))}
                rubros={rubros}
                estados={estados}
                defaultCarreraId={defaultCarreraIdForEspecialidad}
            />

            <DiplomadoDialog
                open={diplomadoDialogOpen}
                onOpenChange={setDiplomadoDialogOpen}
                diplomado={selectedDiplomado}
                comercios={[comercio]}
                carreras={comercio.carreras || []}
                rubros={rubros}
                estados={estados}
                defaultComercioId={comercio.id}
                defaultCarreraId={defaultCarreraIdForDiplomado}
            />

            <CursoDialog
                open={cursoDialogOpen}
                onOpenChange={setCursoDialogOpen}
                curso={selectedCurso}
                comercios={[comercio]}
                carreras={comercio.carreras || []}
                rubros={rubros}
                estados={estados}
                defaultComercioId={comercio.id}
                defaultCarreraId={defaultCarreraIdForCurso}
            />
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
