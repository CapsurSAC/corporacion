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
import {
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
    useTheme,
} from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
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

interface CarreraTableRowProps {
    carrera: Carrera;
    comercioId: number;
    brandColor?: string;
}

function CarreraTableRow({
    carrera,
    comercioId,
    brandColor = '#0c43a3',
}: CarreraTableRowProps) {
    const diplomadosCount = carrera.diplomados?.length || 0;
    const especialidadesCount = carrera.especialidades?.length || 0;
    const cursosCount = carrera.cursos?.length || 0;

    return (
        <TableRow hover>
            <TableCell sx={{ fontWeight: 700, fontSize: '0.78rem' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SchoolIcon sx={{ fontSize: 18, flexShrink: 0, color: brandColor }} />
                    <Typography sx={{ fontWeight: 700, fontSize: '0.78rem', color: 'text.primary' }}>
                        {carrera.nombre}
                    </Typography>
                    {carrera.codigo && (
                        <Chip
                            label={carrera.codigo}
                            size="small"
                            sx={{
                                fontSize: '0.65rem',
                                height: 18,
                                fontWeight: 700,
                                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0',
                            }}
                        />
                    )}
                </Box>
            </TableCell>
            <TableCell sx={{ textAlign: 'center', width: 75 }}>
                {carrera.url_malla_curricular ? (
                    <Tooltip title="Ver Malla Curricular" arrow>
                        <IconButton
                            href={carrera.url_malla_curricular}
                            target="_blank"
                            size="small"
                        >
                            <PictureAsPdfIcon fontSize="small" sx={{ color: '#ea580c' }} />
                        </IconButton>
                    </Tooltip>
                ) : '-'}
            </TableCell>
            <TableCell sx={{ textAlign: 'center', width: 75 }}>
                {carrera.url_declaracion_jurada ? (
                    <Tooltip title="Ver Declaración Jurada" arrow>
                        <IconButton
                            href={carrera.url_declaracion_jurada}
                            target="_blank"
                            size="small"
                        >
                            <DescriptionIcon fontSize="small" sx={{ color: '#2563eb' }} />
                        </IconButton>
                    </Tooltip>
                ) : '-'}
            </TableCell>
            <TableCell sx={{ textAlign: 'center', width: 75 }}>
                {carrera.modelo_certificado ? (
                    <Tooltip title="Ver Modelo de Certificado" arrow>
                        <IconButton
                            href={carrera.modelo_certificado}
                            target="_blank"
                            size="small"
                        >
                            <WorkspacePremiumIcon fontSize="small" sx={{ color: '#059669' }} />
                        </IconButton>
                    </Tooltip>
                ) : '-'}
            </TableCell>
            <TableCell sx={{ textAlign: 'center', width: 145 }}>
                <Tooltip title={`Ver y administrar diplomados de ${carrera.nombre}`} arrow>
                    <Link
                        href={`/admin/diplomados?comercio_id=${comercioId}&carrera_id=${carrera.id}`}
                        style={{ textDecoration: 'none' }}
                    >
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<WorkspacePremiumIcon sx={{ fontSize: 15 }} />}
                            endIcon={<LaunchIcon sx={{ fontSize: 13, opacity: 0.8 }} />}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.72rem',
                                py: 0.3,
                                px: 1.2,
                                borderRadius: 1.5,
                                whiteSpace: 'nowrap',
                                color: brandColor,
                                borderColor: `${brandColor}50`,
                                bgcolor: diplomadosCount > 0 ? `${brandColor}12` : 'transparent',
                                '&:hover': {
                                    borderColor: brandColor,
                                    bgcolor: `${brandColor}22`,
                                },
                            }}
                        >
                            {diplomadosCount} {diplomadosCount === 1 ? 'Diplomado' : 'Diplomados'}
                        </Button>
                    </Link>
                </Tooltip>
            </TableCell>
            <TableCell sx={{ textAlign: 'center', width: 155 }}>
                <Tooltip title={`Ver y administrar especialidades de ${carrera.nombre}`} arrow>
                    <Link
                        href={`/admin/especialidades?comercio_id=${comercioId}&carrera_id=${carrera.id}`}
                        style={{ textDecoration: 'none' }}
                    >
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<CategoryIcon sx={{ fontSize: 15 }} />}
                            endIcon={<LaunchIcon sx={{ fontSize: 13, opacity: 0.8 }} />}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.72rem',
                                py: 0.3,
                                px: 1.2,
                                borderRadius: 1.5,
                                whiteSpace: 'nowrap',
                                color: brandColor,
                                borderColor: `${brandColor}50`,
                                bgcolor: especialidadesCount > 0 ? `${brandColor}12` : 'transparent',
                                '&:hover': {
                                    borderColor: brandColor,
                                    bgcolor: `${brandColor}22`,
                                },
                            }}
                        >
                            {especialidadesCount} {especialidadesCount === 1 ? 'Especialidad' : 'Especialidades'}
                        </Button>
                    </Link>
                </Tooltip>
            </TableCell>
            <TableCell sx={{ textAlign: 'center', width: 135 }}>
                <Tooltip title={`Ver y administrar cursos de ${carrera.nombre}`} arrow>
                    <Link
                        href={`/admin/cursos?comercio_id=${comercioId}&carrera_id=${carrera.id}`}
                        style={{ textDecoration: 'none' }}
                    >
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<MenuBookIcon sx={{ fontSize: 15 }} />}
                            endIcon={<LaunchIcon sx={{ fontSize: 13, opacity: 0.8 }} />}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.72rem',
                                py: 0.3,
                                px: 1.2,
                                borderRadius: 1.5,
                                whiteSpace: 'nowrap',
                                color: brandColor,
                                borderColor: `${brandColor}50`,
                                bgcolor: cursosCount > 0 ? `${brandColor}12` : 'transparent',
                                '&:hover': {
                                    borderColor: brandColor,
                                    bgcolor: `${brandColor}22`,
                                },
                            }}
                        >
                            {cursosCount} {cursosCount === 1 ? 'Curso' : 'Cursos'}
                        </Button>
                    </Link>
                </Tooltip>
            </TableCell>
        </TableRow>
    );
}

export default function EditComercioPage({ comercio, grupos, rubros = [], estados = [] }: EditComercioPageProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [logoError, setLogoError] = useState(false);

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

    // YouTube & Photo addition states
    const [nuevoYoutube, setNuevoYoutube] = useState('');
    const [nuevaFoto, setNuevaFoto] = useState('');

    // Image preview modal state
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

    // Search filter for academic offer
    const [searchCarrera, setSearchCarrera] = useState('');

    // Oferta Formativa Section Switcher: 'carreras' vs 'directas'
    const [ofertaSection, setOfertaSection] = useState<'carreras' | 'directas'>(() => {
        const hasCarreras = (comercio.carreras?.length || 0) > 0;
        const hasDirect = (comercio.especialidades?.some((e) => !e.carrera_id) ||
            comercio.diplomados?.some((d) => !d.carrera_id) ||
            comercio.cursos?.some((c) => !c.carrera_id));
        if (!hasCarreras && hasDirect) return 'directas';
        return 'carreras';
    });

    // Sub-tab for Oferta General / Directa: 'especialidades' | 'diplomados' | 'cursos'
    const [directSubTab, setDirectSubTab] = useState<'especialidades' | 'diplomados' | 'cursos'>('especialidades');

    const { data, setData, put, processing, errors } = useForm({
        grupo_id: String(comercio.grupo_id),
        nombre: comercio.nombre || '',
        sigla: comercio.sigla || comercio.codigo || '',
        color_hex: comercio.color_hex || '#0c43a3',
        logo_modo_claro: comercio.logo_modo_claro || '',
        logo_modo_oscuro: comercio.logo_modo_oscuro || '',
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

    const brandColor = data.color_hex || comercio.color_hex || '#0c43a3';

    const activeLogoClaro = data.logo_modo_claro || comercio.logo_modo_claro;
    const activeLogoOscuro = data.logo_modo_oscuro || comercio.logo_modo_oscuro;
    const rawLogo = isDark
        ? (activeLogoOscuro || activeLogoClaro)
        : (activeLogoClaro || activeLogoOscuro);
    const logoSrc = rawLogo ? getDriveDirectImageUrl(rawLogo) : null;

    useEffect(() => {
        setLogoError(false);
    }, [logoSrc]);

    const totalCarreras = comercio.carreras?.length || 0;
    const totalDiplomados = comercio.diplomados?.length || 0;
    const totalCursos = comercio.cursos?.length || 0;
    const totalEspecialidades =
        comercio.especialidades?.length ||
        (comercio.carreras?.reduce((acc, c) => acc + (c.especialidades?.length || 0), 0) || 0);
    const totalOferta = totalCarreras + totalDiplomados + totalCursos + totalEspecialidades;

    const especialidadesDirectas = useMemo(() => {
        return (comercio.especialidades || []).filter((e) => !e.carrera_id);
    }, [comercio.especialidades]);

    const diplomadosDirectos = useMemo(() => {
        return (comercio.diplomados || []).filter((d) => !d.carrera_id);
    }, [comercio.diplomados]);

    const cursosDirectos = useMemo(() => {
        return (comercio.cursos || []).filter((c) => !c.carrera_id);
    }, [comercio.cursos]);

    const totalGenerales = especialidadesDirectas.length + diplomadosDirectos.length + cursosDirectos.length;

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
                            bgcolor: brandColor,
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

                            {/* Logo institucional según tema claro/oscuro con fallback a avatar de sigla */}
                            {logoSrc && !logoError ? (
                                <Box
                                    sx={{
                                        height: 52,
                                        minWidth: 52,
                                        maxWidth: 100,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        px: 1,
                                        py: 0.5,
                                        bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                                        borderRadius: 2,
                                        border: '1px solid',
                                        borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
                                        boxShadow: isDark ? '0 2px 10px rgba(0, 0, 0, 0.4)' : '0 2px 10px rgba(0, 0, 0, 0.05)',
                                        flexShrink: 0,
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={logoSrc}
                                        alt={`Logo ${data.nombre || comercio.nombre}`}
                                        onError={() => setLogoError(true)}
                                        sx={{
                                            maxHeight: 38,
                                            maxWidth: 84,
                                            objectFit: 'contain',
                                        }}
                                    />
                                </Box>
                            ) : (
                                <Avatar
                                    sx={{
                                        bgcolor: brandColor,
                                        color: '#ffffff',
                                        fontWeight: 900,
                                        fontSize: '1.2rem',
                                        width: 52,
                                        height: 52,
                                        boxShadow: `0 4px 14px ${brandColor}40`,
                                        border: '2px solid #ffffff',
                                    }}
                                >
                                    {(data.sigla || data.nombre || 'C').substring(0, 3).toUpperCase()}
                                </Avatar>
                            )}

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
                                            bgcolor: brandColor,
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
                            '& .MuiTabs-indicator': {
                                bgcolor: brandColor,
                                height: 3,
                                borderRadius: '3px 3px 0 0',
                            },
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                minHeight: 52,
                                gap: 1,
                                px: 2.5,
                                '&.Mui-selected': {
                                    color: `${brandColor} !important`,
                                },
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
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            fontSize: '0.65rem',
                                            height: 16,
                                            minWidth: 16,
                                            bgcolor: brandColor,
                                            color: '#ffffff',
                                        },
                                    }}
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
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            fontSize: '0.65rem',
                                            height: 16,
                                            minWidth: 16,
                                            bgcolor: brandColor,
                                            color: '#ffffff',
                                        },
                                    }}
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
                                            avatar={<StorefrontIcon sx={{ color: brandColor }} />}
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
                                            avatar={<PaletteIcon sx={{ color: brandColor }} />}
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
                                                                                bgcolor: brandColor,
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
                                                        borderLeft: `5px solid ${brandColor}`,
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
                                                                bgcolor: brandColor,
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
                                            avatar={<LanguageIcon sx={{ color: brandColor }} />}
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
                                                                        <PictureAsPdfIcon fontSize="small" sx={{ color: brandColor }} />
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
                                                                        <PictureAsPdfIcon fontSize="small" sx={{ color: brandColor }} />
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
                                                                        <LaunchIcon fontSize="small" sx={{ color: brandColor }} />
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
                                                avatar={<PhotoLibraryIcon sx={{ color: brandColor }} />}
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
                                                        sx={{
                                                            minWidth: 44,
                                                            px: 2,
                                                            bgcolor: brandColor,
                                                            color: '#ffffff',
                                                            '&:hover': {
                                                                bgcolor: brandColor,
                                                                filter: 'brightness(0.9)',
                                                            },
                                                        }}
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
                                                                        borderColor: brandColor,
                                                                        boxShadow: `0 4px 14px ${brandColor}30`,
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
                                                                                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, color: brandColor }}
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
                                            avatar={<PictureAsPdfIcon sx={{ color: brandColor }} />}
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
                                                                        <PictureAsPdfIcon fontSize="small" sx={{ color: brandColor }} />
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
                                                                        <PictureAsPdfIcon fontSize="small" sx={{ color: brandColor }} />
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
                                                                        <PictureAsPdfIcon fontSize="small" sx={{ color: brandColor }} />
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
                                                                        <WorkspacePremiumIcon fontSize="small" sx={{ color: brandColor }} />
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
                                            avatar={<VerifiedUserIcon sx={{ color: brandColor }} />}
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
                                                                        <PictureAsPdfIcon fontSize="small" sx={{ color: brandColor }} />
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
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, width: '100%', boxSizing: 'border-box' }}>
                                {/* SELECTOR DE SECCIÓN TIPO SEGMENTED PILL (CARRERAS vs OFERTA GENERAL) */}
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 0.8,
                                        mb: 2.5,
                                        borderRadius: 2.5,
                                        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#0f172a' : '#f8fafc',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flexWrap: 'wrap',
                                        gap: 1.5,
                                    }}
                                >
                                    <Tabs
                                        value={ofertaSection}
                                        onChange={(_, val) => setOfertaSection(val)}
                                        sx={{
                                            minHeight: 42,
                                            '& .MuiTabs-indicator': {
                                                height: '100%',
                                                borderRadius: 2,
                                                bgcolor: brandColor,
                                                boxShadow: `0 2px 8px ${brandColor}40`,
                                                zIndex: 0,
                                            },
                                            '& .MuiTab-root': {
                                                minHeight: 38,
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 700,
                                                fontSize: '0.84rem',
                                                zIndex: 1,
                                                px: 2.5,
                                                transition: 'all 0.2s ease',
                                                color: 'text.secondary',
                                                '&.Mui-selected': {
                                                    color: '#ffffff !important',
                                                },
                                            },
                                        }}
                                    >
                                        <Tab
                                            value="carreras"
                                            icon={<SchoolIcon sx={{ fontSize: 18 }} />}
                                            iconPosition="start"
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <span>Carreras Profesionales</span>
                                                    <Chip
                                                        size="small"
                                                        label={totalCarreras}
                                                        sx={{
                                                            height: 19,
                                                            fontSize: '0.7rem',
                                                            fontWeight: 800,
                                                            bgcolor: ofertaSection === 'carreras' ? 'rgba(255,255,255,0.25)' : 'action.selected',
                                                            color: ofertaSection === 'carreras' ? '#ffffff' : 'text.primary',
                                                        }}
                                                    />
                                                </Box>
                                            }
                                        />
                                        <Tab
                                            value="directas"
                                            icon={<StorefrontIcon sx={{ fontSize: 18 }} />}
                                            iconPosition="start"
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <span>Oferta General / Directa</span>
                                                    <Chip
                                                        size="small"
                                                        label={totalGenerales}
                                                        sx={{
                                                            height: 19,
                                                            fontSize: '0.7rem',
                                                            fontWeight: 800,
                                                            bgcolor: ofertaSection === 'directas' ? 'rgba(255,255,255,0.25)' : 'action.selected',
                                                            color: ofertaSection === 'directas' ? '#ffffff' : 'text.primary',
                                                        }}
                                                    />
                                                </Box>
                                            }
                                        />
                                    </Tabs>

                                    {/* Acciones de la sección Carreras */}
                                    {ofertaSection === 'carreras' && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
                                            {totalCarreras > 2 && (
                                                <TextField
                                                    size="small"
                                                    placeholder="Buscar carrera..."
                                                    value={searchCarrera}
                                                    onChange={(e) => setSearchCarrera(e.target.value)}
                                                    sx={{ width: 190 }}
                                                    slotProps={{
                                                        input: {
                                                            sx: { height: 32, fontSize: '0.78rem' },
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <SearchIcon sx={{ fontSize: 16 }} color="action" />
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    }}
                                                />
                                            )}
                                            <Link href={`/admin/carreras?comercio_id=${comercio.id}`} style={{ textDecoration: 'none' }}>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    endIcon={<LaunchIcon sx={{ fontSize: '13px !important' }} />}
                                                    sx={{
                                                        textTransform: 'none',
                                                        fontWeight: 700,
                                                        borderRadius: 2,
                                                        fontSize: '0.75rem',
                                                        py: 0.5,
                                                        px: 1.5,
                                                        color: brandColor,
                                                        borderColor: `${brandColor}60`,
                                                        '&:hover': {
                                                            borderColor: brandColor,
                                                            bgcolor: `${brandColor}10`,
                                                        },
                                                    }}
                                                >
                                                    Administrar Carreras
                                                </Button>
                                            </Link>
                                        </Box>
                                    )}
                                </Paper>

                                {/* SECCIÓN 1: CARRERAS PROFESIONALES */}
                                {ofertaSection === 'carreras' && (
                                    filteredCarreras.length > 0 ? (
                                        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                                            <Table size="small">
                                                <TableHead sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? '#0f1f38' : '#f8fafc' }}>
                                                    <TableRow>
                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem' }}>Carrera / Plan de Estudios</TableCell>
                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 75, textAlign: 'center' }}>Malla</TableCell>
                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 75, textAlign: 'center' }}>DJ</TableCell>
                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 75, textAlign: 'center' }}>Certificado</TableCell>
                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 145, textAlign: 'center' }}>Diplomados</TableCell>
                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 155, textAlign: 'center' }}>Especialidades</TableCell>
                                                        <TableCell sx={{ fontWeight: 800, fontSize: '0.72rem', width: 135, textAlign: 'center' }}>Cursos</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {filteredCarreras.map((carrera) => (
                                                        <CarreraTableRow
                                                            key={carrera.id}
                                                            carrera={carrera}
                                                            comercioId={comercio.id}
                                                            brandColor={brandColor}
                                                        />
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    ) : (
                                        <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : '#f8fafc', borderRadius: 2 }}>
                                            <SchoolIcon sx={{ fontSize: 44, color: brandColor, mb: 1, opacity: 0.85 }} />
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                                                {searchCarrera ? 'No se encontraron carreras con ese criterio de búsqueda' : `No hay carreras registradas para ${comercio.nombre}`}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 480, mx: 'auto', mb: 2 }}>
                                                {searchCarrera ? 'Prueba con otro término de búsqueda.' : 'Registra la primera carrera profesional o técnica. Cada carrera incluirá sus diplomados, especialidades y cursos organizados en pestañas.'}
                                            </Typography>
                                            {!searchCarrera && (
                                                <Link href={`/admin/carreras?comercio_id=${comercio.id}&create=1`} style={{ textDecoration: 'none' }}>
                                                    <Button
                                                        variant="contained"
                                                        startIcon={<AddIcon />}
                                                        sx={{
                                                            textTransform: 'none',
                                                            fontWeight: 700,
                                                            borderRadius: 2,
                                                            px: 2.5,
                                                            bgcolor: brandColor,
                                                            color: '#ffffff',
                                                            '&:hover': {
                                                                bgcolor: brandColor,
                                                                filter: 'brightness(0.9)',
                                                            },
                                                        }}
                                                    >
                                                        Registrar Primera Carrera
                                                    </Button>
                                                </Link>
                                            )}
                                        </Paper>
                                    )
                                )}

                                {/* SECCIÓN 2: OFERTA GENERAL / DIRECTA DEL COMERCIO */}
                                {ofertaSection === 'directas' && (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {/* SUB-TABS: Especialidades, Diplomados, Cursos */}
                                        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                                            <Tabs
                                                value={directSubTab}
                                                onChange={(_, val) => setDirectSubTab(val)}
                                                sx={{
                                                    minHeight: 40,
                                                    '& .MuiTabs-indicator': {
                                                        bgcolor: brandColor,
                                                        height: 2.5,
                                                        borderRadius: '2px 2px 0 0',
                                                    },
                                                    '& .MuiTab-root': {
                                                        minHeight: 40,
                                                        textTransform: 'none',
                                                        fontWeight: 700,
                                                        fontSize: '0.8rem',
                                                        py: 0.5,
                                                        '&.Mui-selected': {
                                                            color: `${brandColor} !important`,
                                                        },
                                                    },
                                                }}
                                            >
                                                <Tab
                                                    value="especialidades"
                                                    icon={<CategoryIcon sx={{ fontSize: 16 }} />}
                                                    iconPosition="start"
                                                    label={`Especialidades Directas (${especialidadesDirectas.length})`}
                                                />
                                                <Tab
                                                    value="diplomados"
                                                    icon={<WorkspacePremiumIcon sx={{ fontSize: 16 }} />}
                                                    iconPosition="start"
                                                    label={`Diplomados Directos (${diplomadosDirectos.length})`}
                                                />
                                                <Tab
                                                    value="cursos"
                                                    icon={<MenuBookIcon sx={{ fontSize: 16 }} />}
                                                    iconPosition="start"
                                                    label={`Cursos Directos (${cursosDirectos.length})`}
                                                />
                                            </Tabs>
                                        </Box>

                                        <Box>
                                            {/* SubTab: Especialidades Directas */}
                                            {directSubTab === 'especialidades' && (
                                                <Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                                                        <Typography variant="caption" sx={{ fontWeight: 800, color: brandColor, display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.78rem' }}>
                                                            <CategoryIcon sx={{ fontSize: 17 }} />
                                                            ESPECIALIDADES DIRECTAS DEL COMERCIO ({especialidadesDirectas.length})
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Link href={`/admin/especialidades?comercio_id=${comercio.id}&create=1`} style={{ textDecoration: 'none' }}>
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    startIcon={<AddIcon sx={{ fontSize: 15 }} />}
                                                                    sx={{
                                                                        textTransform: 'none',
                                                                        fontWeight: 700,
                                                                        fontSize: '0.72rem',
                                                                        py: 0.3,
                                                                        px: 1.2,
                                                                        borderRadius: 1.5,
                                                                        color: brandColor,
                                                                        borderColor: `${brandColor}60`,
                                                                        '&:hover': {
                                                                            borderColor: brandColor,
                                                                            bgcolor: `${brandColor}10`,
                                                                        },
                                                                    }}
                                                                >
                                                                    Nueva Especialidad Directa
                                                                </Button>
                                                            </Link>
                                                            <Link href={`/admin/especialidades?comercio_id=${comercio.id}`} style={{ textDecoration: 'none' }}>
                                                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', '&:hover': { color: brandColor, textDecoration: 'underline' } }}>
                                                                    Ver todas en módulo
                                                                </Typography>
                                                            </Link>
                                                        </Box>
                                                    </Box>

                                                    {especialidadesDirectas.length > 0 ? (
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
                                                                    {especialidadesDirectas.map((esp) => {
                                                                        const rubroColor = esp.rubro?.color_hex || '#7c3aed';
                                                                        return (
                                                                            <TableRow key={esp.id} hover>
                                                                                <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem' }}>{esp.nombre}</TableCell>
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
                                                                                    {esp.precio ? <Chip label={esp.precio} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem', color: brandColor, borderColor: `${brandColor}60`, fontWeight: 700 }} /> : '-'}
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
                                                                                        <Tooltip title="Editar en módulo de Especialidades" arrow>
                                                                                            <Link href={`/admin/especialidades?comercio_id=${comercio.id}&edit_id=${esp.id}`}>
                                                                                                <IconButton size="small" sx={{ color: brandColor }}>
                                                                                                    <EditIcon sx={{ fontSize: 16 }} />
                                                                                                </IconButton>
                                                                                            </Link>
                                                                                        </Tooltip>
                                                                                        <Tooltip title="Administrar / Eliminar en módulo de Especialidades" arrow>
                                                                                            <Link href={`/admin/especialidades?comercio_id=${comercio.id}`}>
                                                                                                <IconButton size="small" color="error">
                                                                                                    <DeleteIcon sx={{ fontSize: 16 }} />
                                                                                                </IconButton>
                                                                                            </Link>
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
                                                        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : '#f8fafc', borderRadius: 2 }}>
                                                            <CategoryIcon sx={{ fontSize: 36, color: brandColor, mb: 1, opacity: 0.85 }} />
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                                Sin especialidades directas asociadas a este comercio.
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                                                                Puedes registrar especialidades independientes que pertenezcan a la institución sin depender de una carrera específica.
                                                            </Typography>
                                                            <Link href={`/admin/especialidades?comercio_id=${comercio.id}&create=1`} style={{ textDecoration: 'none' }}>
                                                                <Button
                                                                    size="small"
                                                                    variant="contained"
                                                                    sx={{
                                                                        textTransform: 'none',
                                                                        fontWeight: 700,
                                                                        borderRadius: 2,
                                                                        bgcolor: brandColor,
                                                                        color: '#ffffff',
                                                                        '&:hover': {
                                                                            bgcolor: brandColor,
                                                                            filter: 'brightness(0.9)',
                                                                        },
                                                                    }}
                                                                >
                                                                    + Registrar Primera Especialidad Directa
                                                                </Button>
                                                            </Link>
                                                        </Paper>
                                                    )}
                                                </Box>
                                            )}

                                            {/* SubTab: Diplomados Directos */}
                                            {directSubTab === 'diplomados' && (
                                                <Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                                                        <Typography variant="caption" sx={{ fontWeight: 800, color: brandColor, display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.78rem' }}>
                                                            <WorkspacePremiumIcon sx={{ fontSize: 17 }} />
                                                            DIPLOMADOS DIRECTOS DEL COMERCIO ({diplomadosDirectos.length})
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Link href={`/admin/diplomados?comercio_id=${comercio.id}&create=1`} style={{ textDecoration: 'none' }}>
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    startIcon={<AddIcon sx={{ fontSize: 15 }} />}
                                                                    sx={{
                                                                        textTransform: 'none',
                                                                        fontWeight: 700,
                                                                        fontSize: '0.72rem',
                                                                        py: 0.3,
                                                                        px: 1.2,
                                                                        borderRadius: 1.5,
                                                                        color: brandColor,
                                                                        borderColor: `${brandColor}60`,
                                                                        '&:hover': {
                                                                            borderColor: brandColor,
                                                                            bgcolor: `${brandColor}10`,
                                                                        },
                                                                    }}
                                                                >
                                                                    Nuevo Diplomado Directo
                                                                </Button>
                                                            </Link>
                                                            <Link href={`/admin/diplomados?comercio_id=${comercio.id}`} style={{ textDecoration: 'none' }}>
                                                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', '&:hover': { color: brandColor, textDecoration: 'underline' } }}>
                                                                    Ver todos en módulo
                                                                </Typography>
                                                            </Link>
                                                        </Box>
                                                    </Box>

                                                    {diplomadosDirectos.length > 0 ? (
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
                                                                    {diplomadosDirectos.map((dip) => (
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
                                                                                {dip.precio ? <Chip label={dip.precio} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem', color: brandColor, borderColor: `${brandColor}60`, fontWeight: 700 }} /> : '-'}
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
                                                                                    <Tooltip title="Editar en módulo de Diplomados" arrow>
                                                                                        <Link href={`/admin/diplomados?comercio_id=${comercio.id}&edit_id=${dip.id}`}>
                                                                                            <IconButton size="small" sx={{ color: brandColor }}>
                                                                                                <EditIcon sx={{ fontSize: 16 }} />
                                                                                            </IconButton>
                                                                                        </Link>
                                                                                    </Tooltip>
                                                                                    <Tooltip title="Administrar / Eliminar en módulo de Diplomados" arrow>
                                                                                        <Link href={`/admin/diplomados?comercio_id=${comercio.id}`}>
                                                                                            <IconButton size="small" color="error">
                                                                                                <DeleteIcon sx={{ fontSize: 16 }} />
                                                                                            </IconButton>
                                                                                        </Link>
                                                                                    </Tooltip>
                                                                                </Box>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    ) : (
                                                        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : '#f8fafc', borderRadius: 2 }}>
                                                            <WorkspacePremiumIcon sx={{ fontSize: 36, color: brandColor, mb: 1, opacity: 0.85 }} />
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                                Sin diplomados directos asociados a este comercio.
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                                                                Puedes crear diplomados institucionales directos que no pertenezcan a una carrera en particular.
                                                            </Typography>
                                                            <Link href={`/admin/diplomados?comercio_id=${comercio.id}&create=1`} style={{ textDecoration: 'none' }}>
                                                                <Button
                                                                    size="small"
                                                                    variant="contained"
                                                                    sx={{
                                                                        textTransform: 'none',
                                                                        fontWeight: 700,
                                                                        borderRadius: 2,
                                                                        bgcolor: brandColor,
                                                                        color: '#ffffff',
                                                                        '&:hover': {
                                                                            bgcolor: brandColor,
                                                                            filter: 'brightness(0.9)',
                                                                        },
                                                                    }}
                                                                >
                                                                    + Registrar Primer Diplomado Directo
                                                                </Button>
                                                            </Link>
                                                        </Paper>
                                                    )}
                                                </Box>
                                            )}

                                            {/* SubTab: Cursos Directos */}
                                            {directSubTab === 'cursos' && (
                                                <Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                                                        <Typography variant="caption" sx={{ fontWeight: 800, color: brandColor, display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.78rem' }}>
                                                            <MenuBookIcon sx={{ fontSize: 17 }} />
                                                            CURSOS DIRECTOS DEL COMERCIO ({cursosDirectos.length})
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Link href={`/admin/cursos?comercio_id=${comercio.id}&create=1`} style={{ textDecoration: 'none' }}>
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    startIcon={<AddIcon sx={{ fontSize: 15 }} />}
                                                                    sx={{
                                                                        textTransform: 'none',
                                                                        fontWeight: 700,
                                                                        fontSize: '0.72rem',
                                                                        py: 0.3,
                                                                        px: 1.2,
                                                                        borderRadius: 1.5,
                                                                        color: brandColor,
                                                                        borderColor: `${brandColor}60`,
                                                                        '&:hover': {
                                                                            borderColor: brandColor,
                                                                            bgcolor: `${brandColor}10`,
                                                                        },
                                                                    }}
                                                                >
                                                                    Nuevo Curso Directo
                                                                </Button>
                                                            </Link>
                                                            <Link href={`/admin/cursos?comercio_id=${comercio.id}`} style={{ textDecoration: 'none' }}>
                                                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', '&:hover': { color: brandColor, textDecoration: 'underline' } }}>
                                                                    Ver todos en módulo
                                                                </Typography>
                                                            </Link>
                                                        </Box>
                                                    </Box>

                                                    {cursosDirectos.length > 0 ? (
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
                                                                    {cursosDirectos.map((cur) => (
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
                                                                                {cur.precio ? <Chip label={cur.precio} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem', color: brandColor, borderColor: `${brandColor}60`, fontWeight: 700 }} /> : '-'}
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
                                                                                    <Tooltip title="Editar en módulo de Cursos" arrow>
                                                                                        <Link href={`/admin/cursos?comercio_id=${comercio.id}&edit_id=${cur.id}`}>
                                                                                            <IconButton size="small" sx={{ color: brandColor }}>
                                                                                                <EditIcon sx={{ fontSize: 16 }} />
                                                                                            </IconButton>
                                                                                        </Link>
                                                                                    </Tooltip>
                                                                                    <Tooltip title="Administrar / Eliminar en módulo de Cursos" arrow>
                                                                                        <Link href={`/admin/cursos?comercio_id=${comercio.id}`}>
                                                                                            <IconButton size="small" color="error">
                                                                                                <DeleteIcon sx={{ fontSize: 16 }} />
                                                                                            </IconButton>
                                                                                        </Link>
                                                                                    </Tooltip>
                                                                                </Box>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    ) : (
                                                        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : '#f8fafc', borderRadius: 2 }}>
                                                            <MenuBookIcon sx={{ fontSize: 36, color: brandColor, mb: 1, opacity: 0.85 }} />
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                                Sin cursos directos asociados a este comercio.
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                                                                Puedes crear cursos institucionales libres que pertenezcan a la institución.
                                                            </Typography>
                                                            <Link href={`/admin/cursos?comercio_id=${comercio.id}&create=1`} style={{ textDecoration: 'none' }}>
                                                                <Button
                                                                    size="small"
                                                                    variant="contained"
                                                                    sx={{
                                                                        textTransform: 'none',
                                                                        fontWeight: 700,
                                                                        borderRadius: 2,
                                                                        bgcolor: brandColor,
                                                                        color: '#ffffff',
                                                                        '&:hover': {
                                                                            bgcolor: brandColor,
                                                                            filter: 'brightness(0.9)',
                                                                        },
                                                                    }}
                                                                >
                                                                    + Registrar Primer Curso Directo
                                                                </Button>
                                                            </Link>
                                                        </Paper>
                                                    )}
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
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
                                bgcolor: brandColor,
                                textTransform: 'none',
                                fontWeight: 700,
                                px: 3.5,
                                py: 1,
                                borderRadius: 2,
                                '&:hover': { bgcolor: brandColor, filter: 'brightness(0.92)' },
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
