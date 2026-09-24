import { Head, Link, usePage } from '@inertiajs/react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import DomainIcon from '@mui/icons-material/Domain';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import LanguageIcon from '@mui/icons-material/Language';
import LaunchIcon from '@mui/icons-material/Launch';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LoginIcon from '@mui/icons-material/Login';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import StorefrontIcon from '@mui/icons-material/Storefront';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    Tab,
    Tabs,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState, useMemo, useEffect } from 'react';
import AppLogo from '@/components/app-logo';
import AcademicOfferExplorer from '@/components/catalog/academic-offer-explorer';
import ComercioDetailModal from '@/components/catalog/comercio-detail-modal';
import LoginPopover from '@/components/login-popover';
import { useNotification } from '@/hooks/use-notification';
import { dashboard } from '@/routes';
import type { Comercio, Grupo } from '@/types';

interface WelcomeProps {
    grupos?: Grupo[];
    stats?: {
        totalGrupos: number;
        totalComercios: number;
        totalCarreras: number;
        totalDiplomados: number;
        totalCursos: number;
        totalEspecialidades?: number;
    };
    initialComercio?: Comercio | null;
    driveLinks?: {
        escifor?: string;
        multimarca?: string;
    };
}

export default function Welcome({
    grupos = [],
    stats = {
        totalGrupos: 3,
        totalComercios: 8,
        totalCarreras: 5,
        totalDiplomados: 37,
        totalCursos: 34,
        totalEspecialidades: 0,
    },
    initialComercio = null,
    driveLinks = {
        escifor: '',
        multimarca: '',
    },
}: WelcomeProps) {
    const page = usePage();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const { notify } = useNotification();
    const auth = (page.props.auth || {}) as { user?: any };
    const dashboardUrl = auth.user ? '/dashboard' : '/';

    // Estado del Popover de inicio de sesión para el administrador
    const [loginAnchorEl, setLoginAnchorEl] = useState<HTMLButtonElement | null>(null);

    // Detección automática: si se accede con ?login=1 o desde un intento de acceso protegido,
    // se abre inmediatamente el minicuadro de inicio de sesión anclado al botón.
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('login') === '1' || params.get('login') === 'true') {
                const timer = setTimeout(() => {
                    const btn = document.getElementById('btn-iniciar-sesion') as HTMLButtonElement | null;
                    if (btn) {
                        setLoginAnchorEl(btn);
                    }
                }, 100);
                return () => clearTimeout(timer);
            }
        }
    }, []);

    // Estado de la Ficha Modal de Comercio seleccionada para consulta
    const [selectedComercio, setSelectedComercio] = useState<Comercio | null>(initialComercio);
    const [detailModalOpen, setDetailModalOpen] = useState<boolean>(Boolean(initialComercio));

    // Navegación principal entre vistas: 0 = "Marcas por Grupo", 1 = "Buscador Global de Programas"
    const [activeViewTab, setActiveViewTab] = useState<number>(0);

    // Filtros de búsqueda para marcas
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGrupoId, setSelectedGrupoId] = useState<number | 'all'>('all');

    const handleOpenLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (loginAnchorEl === event.currentTarget) {
            setLoginAnchorEl(null);
        } else {
            setLoginAnchorEl(event.currentTarget);
        }
    };

    const handleCloseLogin = () => {
        setLoginAnchorEl(null);
    };

    const handleOpenComercioDetail = (comercio: Comercio) => {
        setSelectedComercio(comercio);
        setDetailModalOpen(true);
    };

    const handleCloseComercioDetail = () => {
        setDetailModalOpen(false);
    };

    const handleRedirect = (url?: string, label?: string) => {
        if (!url || !url.trim()) {
            notify.info(
                `El enlace de Drive Capacitación ${label} aún no ha sido configurado en el panel administrativo.`
            );
            return;
        }
        const fullUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
        window.open(fullUrl, '_blank', 'noopener,noreferrer');
    };

    // Extraer todos los comercios planos
    const allComercios = useMemo(() => {
        const list: Comercio[] = [];
        grupos.forEach((g) => {
            if (g.comercios) {
                g.comercios.forEach((c) => {
                    list.push({ ...c, grupo: g });
                });
            }
        });
        return list;
    }, [grupos]);

    // Filtrar comercios según grupo y término de búsqueda
    const filteredComercios = useMemo(() => {
        return allComercios.filter((com) => {
            // Filtro por grupo
            if (selectedGrupoId !== 'all' && com.grupo_id !== selectedGrupoId) {
                return false;
            }

            // Filtro por búsqueda
            if (searchQuery.trim()) {
                const term = searchQuery.toLowerCase().trim();
                const matchNombre = com.nombre.toLowerCase().includes(term);
                const matchSigla = com.sigla?.toLowerCase().includes(term);
                const matchGrupo = com.grupo?.nombre.toLowerCase().includes(term);
                const matchEscale = com.escale_minedu?.toLowerCase().includes(term);
                const matchResolucion =
                    com.resolucion_creacion?.toLowerCase().includes(term) ||
                    com.resolucion_revalidacion?.toLowerCase().includes(term);

                // Búsqueda profunda en carreras, diplomados, cursos y especialidades del comercio
                const matchCarreras = com.carreras?.some((c) => c.nombre.toLowerCase().includes(term));
                const matchDiplomados = com.diplomados?.some((d) => d.nombre.toLowerCase().includes(term));
                const matchCursos = com.cursos?.some((cur) => cur.nombre.toLowerCase().includes(term));
                const matchEspecialidades = com.especialidades?.some((esp) => esp.nombre.toLowerCase().includes(term));

                if (
                    !matchNombre &&
                    !matchSigla &&
                    !matchGrupo &&
                    !matchEscale &&
                    !matchResolucion &&
                    !matchCarreras &&
                    !matchDiplomados &&
                    !matchCursos &&
                    !matchEspecialidades
                ) {
                    return false;
                }
            }

            return true;
        });
    }, [allComercios, selectedGrupoId, searchQuery]);

    const totalProgramas = stats.totalCarreras + stats.totalDiplomados + stats.totalCursos + (stats.totalEspecialidades || 0);

    return (
        <>
            <Head title="Catálogo Corporativo Grupo Capsur - Portal de Consulta Interna" />

            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
                {/* Navbar Superior */}
                <Box
                    component="header"
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        py: 1.8,
                        px: { xs: 2, sm: 4 },
                        position: 'sticky',
                        top: 0,
                        zIndex: 1100,
                        backdropFilter: 'blur(8px)',
                    }}
                >
                    <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <AppLogo />
                            <Chip
                                label="Catálogo Corporativo"
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{
                                    fontWeight: 800,
                                    fontSize: '0.72rem',
                                    display: { xs: 'none', sm: 'inline-flex' },
                                }}
                            />
                            <Chip
                                label="Modo Consulta"
                                size="small"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: '0.7rem',
                                    bgcolor: 'action.hover',
                                    display: { xs: 'none', md: 'inline-flex' },
                                }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            {auth.user ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Chip
                                        avatar={
                                            <Avatar sx={{ bgcolor: 'primary.main', color: '#fff', width: 28, height: 28, fontSize: '0.8rem', fontWeight: 800 }}>
                                                {(auth.user.name || 'A').substring(0, 1).toUpperCase()}
                                            </Avatar>
                                        }
                                        label={auth.user.name || 'Administrador'}
                                        size="medium"
                                        variant="outlined"
                                        sx={{ fontWeight: 700, display: { xs: 'none', sm: 'inline-flex' } }}
                                    />
                                    <Link href={dashboardUrl} style={{ textDecoration: 'none' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            endIcon={<ArrowForwardIcon />}
                                            sx={{
                                                px: 2.5,
                                                py: 0.9,
                                                fontWeight: 800,
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                boxShadow: '0 4px 14px rgba(12, 67, 163, 0.25)',
                                            }}
                                        >
                                            Ir al Panel de Control
                                        </Button>
                                    </Link>
                                </Box>
                            ) : (
                                <Tooltip title="Acceso exclusivo para el administrador del sistema" arrow>
                                    <Button
                                        id="btn-iniciar-sesion"
                                        variant="outlined"
                                        color="primary"
                                        onClick={handleOpenLogin}
                                        startIcon={<LoginIcon />}
                                        sx={{
                                            px: { xs: 2, sm: 2.8 },
                                            py: 0.9,
                                            fontWeight: 800,
                                            borderRadius: 2,
                                            borderColor: 'primary.main',
                                            borderWidth: 2,
                                            textTransform: 'none',
                                            fontSize: '0.92rem',
                                            bgcolor: (theme) =>
                                                theme.palette.mode === 'dark'
                                                    ? 'rgba(96, 165, 250, 0.08)'
                                                    : 'rgba(12, 67, 163, 0.04)',
                                            boxShadow: '0 2px 8px rgba(12, 67, 163, 0.08)',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                borderWidth: 2,
                                                bgcolor: 'primary.main',
                                                color: '#ffffff',
                                                boxShadow: '0 4px 16px rgba(12, 67, 163, 0.3)',
                                                transform: 'translateY(-1px)',
                                            },
                                        }}
                                    >
                                        Iniciar Sesión
                                    </Button>
                                </Tooltip>
                            )}
                        </Box>
                    </Container>
                </Box>

                {/* Hero Banner Corporativo de Consulta - Ultra Rápido y Optimizado */}
                <Box
                    sx={{
                        pt: { xs: 6, md: 8 },
                        pb: { xs: 6, md: 7 },
                        color: '#ffffff',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #091322 0%, #0c3e8a 52%, #060e1d 100%)',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1.2px, transparent 1.2px)',
                            backgroundSize: '24px 24px',
                            pointerEvents: 'none',
                        },
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '100%',
                            maxWidth: '1200px',
                            height: '100%',
                            background: 'radial-gradient(ellipse at 50% 0%, rgba(56, 189, 248, 0.16) 0%, transparent 70%)',
                            pointerEvents: 'none',
                        },
                    }}
                >
                    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                        {/* Badge Flotante */}
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1.2,
                                px: 2,
                                py: 0.6,
                                mb: 2,
                                borderRadius: 5,
                                bgcolor: 'rgba(255, 255, 255, 0.08)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                            }}
                        >
                            <Box
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: '#22c55e',
                                    boxShadow: '0 0 8px #22c55e',
                                }}
                            />
                            <Typography
                                variant="caption"
                                sx={{
                                    fontWeight: 800,
                                    letterSpacing: '0.1em',
                                    fontSize: '0.73rem',
                                    textTransform: 'uppercase',
                                    color: 'rgba(255, 255, 255, 0.95)',
                                }}
                            >
                                Portal Integral de Consulta Corporativa
                            </Typography>
                        </Box>

                        {/* Título Principal */}
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 900,
                                letterSpacing: '-0.025em',
                                fontSize: { xs: '2.4rem', sm: '3.4rem', md: '4rem' },
                                lineHeight: 1.15,
                                mb: 1.8,
                            }}
                        >
                            GRUPO{' '}
                            <Box
                                component="span"
                                sx={{
                                    background: 'linear-gradient(135deg, #60a5fa 0%, #38bdf8 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                CAPSUR
                            </Box>
                        </Typography>

                        {/* Subtítulo */}
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.88)',
                                fontWeight: 400,
                                lineHeight: 1.6,
                                mb: 3.5,
                                maxWidth: 780,
                                mx: 'auto',
                                fontSize: { xs: '1rem', md: '1.14rem' },
                            }}
                        >
                            Portal de consulta para colaboradores. Información institucional, códigos ESCALE MINEDU, resoluciones oficiales, aulas virtuales y oferta formativa completa de todas nuestras marcas.
                        </Typography>

                        {/* Buscador Rápido en el Hero - 100% Fluido */}
                        <Box sx={{ maxWidth: 680, mx: 'auto', mb: 3 }}>
                            <TextField
                                fullWidth
                                placeholder="Buscar por marca, carrera, diplomado, curso o código ESCALE..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                sx={{
                                    bgcolor: (theme) =>
                                        theme.palette.mode === 'dark'
                                            ? 'rgba(15, 23, 42, 0.96)'
                                            : '#ffffff',
                                    borderRadius: 2.5,
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2.5,
                                        height: 52,
                                        color: (theme) => (theme.palette.mode === 'dark' ? '#f8fafc' : '#0f172a'),
                                        fontSize: '0.96rem',
                                        '& fieldset': {
                                            borderColor: 'rgba(255, 255, 255, 0.25)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#38bdf8',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#0284c7',
                                            borderWidth: 2,
                                        },
                                    },
                                }}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ ml: 1, mr: 0.5, color: '#0284c7', fontSize: 22 }} />
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
                        </Box>

                        {/* Botones de Capacitaciones Drive */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: 2,
                                mb: 3,
                            }}
                        >
                            <Tooltip
                                title="Abrir carpeta en Google Drive con grabaciones y capacitaciones de ESCIFOR"
                                arrow
                                placement="bottom"
                            >
                                <Button
                                    variant="contained"
                                    size="medium"
                                    startIcon={<FolderSharedIcon sx={{ fontSize: 18 }} />}
                                    endIcon={<LaunchIcon sx={{ fontSize: 15 }} />}
                                    onClick={() => handleRedirect(driveLinks?.escifor, 'ESCIFOR')}
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.14)',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        color: '#ffffff',
                                        fontWeight: 800,
                                        fontSize: '0.86rem',
                                        letterSpacing: '0.02em',
                                        px: 2.8,
                                        py: 0.9,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.18)',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            bgcolor: 'rgba(255, 255, 255, 0.25)',
                                            borderColor: '#38bdf8',
                                            transform: 'translateY(-1px)',
                                        },
                                    }}
                                >
                                    Capacitación ESCIFOR
                                </Button>
                            </Tooltip>

                            <Tooltip
                                title="Abrir carpeta en Google Drive con grabaciones y capacitaciones de MULTIMARCA"
                                arrow
                                placement="bottom"
                            >
                                <Button
                                    variant="contained"
                                    size="medium"
                                    startIcon={<FolderSharedIcon sx={{ fontSize: 18 }} />}
                                    endIcon={<LaunchIcon sx={{ fontSize: 15 }} />}
                                    onClick={() => handleRedirect(driveLinks?.multimarca, 'MULTIMARCA')}
                                    sx={{
                                        bgcolor: 'rgba(34, 197, 94, 0.22)',
                                        border: '1px solid rgba(74, 222, 128, 0.45)',
                                        color: '#ffffff',
                                        fontWeight: 800,
                                        fontSize: '0.86rem',
                                        letterSpacing: '0.02em',
                                        px: 2.8,
                                        py: 0.9,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.18)',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            bgcolor: 'rgba(34, 197, 94, 0.35)',
                                            borderColor: '#4ade80',
                                            transform: 'translateY(-1px)',
                                        },
                                    }}
                                >
                                    Capacitación MULTIMARCA
                                </Button>
                            </Tooltip>
                        </Box>

                        {/* Indicadores en vivo */}
                        <Box
                            sx={{
                                display: 'inline-flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: { xs: 1.2, sm: 2 },
                                p: { xs: 1, sm: 1.2 },
                                px: { xs: 2, sm: 2.5 },
                                borderRadius: 3,
                                bgcolor: 'rgba(0, 0, 0, 0.25)',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                <DomainIcon sx={{ fontSize: 17, color: '#60a5fa' }} />
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.95)', fontWeight: 700 }}>
                                    {stats.totalGrupos} Grupos Corporativos
                                </Typography>
                            </Box>
                            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.18)', display: { xs: 'none', sm: 'block' } }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                <StorefrontIcon sx={{ fontSize: 17, color: '#34d399' }} />
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.95)', fontWeight: 700 }}>
                                    {stats.totalComercios} Marcas Institucionales
                                </Typography>
                            </Box>
                            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.18)', display: { xs: 'none', sm: 'block' } }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                <SchoolIcon sx={{ fontSize: 17, color: '#facc15' }} />
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.95)', fontWeight: 700 }}>
                                    {stats.totalCarreras} Carreras Acreditadas
                                </Typography>
                            </Box>
                            {(stats.totalEspecialidades || 0) > 0 && (
                                <>
                                    <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.18)', display: { xs: 'none', sm: 'block' } }} />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                        <AutoAwesomeIcon sx={{ fontSize: 17, color: '#38bdf8' }} />
                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.95)', fontWeight: 700 }}>
                                            {stats.totalEspecialidades} {stats.totalEspecialidades === 1 ? 'Especialidad' : 'Especialidades'}
                                        </Typography>
                                    </Box>
                                </>
                            )}
                            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.18)', display: { xs: 'none', sm: 'block' } }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                <WorkspacePremiumIcon sx={{ fontSize: 17, color: '#a78bfa' }} />
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.95)', fontWeight: 700 }}>
                                    {stats.totalDiplomados} Diplomados
                                </Typography>
                            </Box>
                            {(stats.totalCursos || 0) > 0 && (
                                <>
                                    <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.18)', display: { xs: 'none', sm: 'block' } }} />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                        <MenuBookIcon sx={{ fontSize: 17, color: '#4ade80' }} />
                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.95)', fontWeight: 700 }}>
                                            {stats.totalCursos} {stats.totalCursos === 1 ? 'Curso' : 'Cursos'}
                                        </Typography>
                                    </Box>
                                </>
                            )}
                        </Box>
                    </Container>
                </Box>

                {/* Sección Principal del Catálogo */}
                <Container maxWidth="xl" sx={{ py: 4, flex: 1 }}>
                    {/* Barra de pestañas de vista */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: { xs: 'stretch', md: 'center' },
                            justifyContent: 'space-between',
                            borderBottom: 1,
                            borderColor: 'divider',
                            mb: 3.5,
                            gap: 2,
                        }}
                    >
                        <Tabs
                            value={activeViewTab}
                            onChange={(_, val) => setActiveViewTab(val)}
                            sx={{
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 800,
                                    fontSize: '0.95rem',
                                    minHeight: 52,
                                    gap: 1.2,
                                    px: 2.5,
                                },
                            }}
                        >
                            <Tab
                                icon={<StorefrontIcon fontSize="small" />}
                                iconPosition="start"
                                label={`Marcas e Institutos (${filteredComercios.length})`}
                            />
                            <Tab
                                icon={
                                    <Badge badgeContent={totalProgramas} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', height: 16, minWidth: 16 } }}>
                                        <SchoolIcon fontSize="small" />
                                    </Badge>
                                }
                                iconPosition="start"
                                label="Explorador de Programas y Cursos"
                            />
                        </Tabs>

                        {/* Filtros por Grupo cuando se está en la vista de Marcas */}
                        {activeViewTab === 0 && (
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', pb: { xs: 1, md: 0 } }}>
                                <Chip
                                    label={`Todos (${allComercios.length})`}
                                    clickable
                                    color={selectedGrupoId === 'all' ? 'primary' : 'default'}
                                    onClick={() => setSelectedGrupoId('all')}
                                    sx={{ fontWeight: 800, borderRadius: 2 }}
                                />
                                {grupos.map((grp) => (
                                    <Chip
                                        key={grp.id}
                                        label={`${grp.nombre} (${grp.comercios?.length || 0})`}
                                        clickable
                                        color={selectedGrupoId === grp.id ? 'primary' : 'default'}
                                        onClick={() => setSelectedGrupoId(grp.id)}
                                        sx={{ fontWeight: 800, borderRadius: 2 }}
                                    />
                                ))}
                            </Box>
                        )}
                    </Box>

                    {/* VISTA 0: CUADRÍCULA DE COMERCIOS */}
                    {activeViewTab === 0 && (
                        <>
                            {filteredComercios.length === 0 ? (
                                <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 3, my: 4 }}>
                                    <StorefrontIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 1.5 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                        {allComercios.length === 0
                                            ? 'Catálogo en preparación'
                                            : 'No se encontraron comercios ni marcas'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                                        {allComercios.length === 0
                                            ? 'Aún no se han registrado marcas en el sistema. El administrador puede agregarlas desde el panel administrativo.'
                                            : 'Intenta borrar el término de búsqueda o selecciona otro grupo corporativo.'}
                                    </Typography>
                                    {allComercios.length > 0 && (
                                        <Button
                                            variant="outlined"
                                            onClick={() => {
                                                setSearchQuery('');
                                                setSelectedGrupoId('all');
                                            }}
                                            sx={{ borderRadius: 2, textTransform: 'none' }}
                                        >
                                            Restablecer Filtros
                                        </Button>
                                    )}
                                </Paper>
                            ) : (
                                <Grid container spacing={3}>
                                    {filteredComercios.map((comercio) => {
                                        const brandColor = comercio.color_hex || '#0c43a3';
                                        const carrerasCount = comercio.carreras?.length || comercio.carreras_count || 0;
                                        const especialidadesCount = comercio.especialidades?.length || comercio.especialidades_count || 0;
                                        const diplomadosCount = comercio.diplomados?.length || comercio.diplomados_count || 0;
                                        const cursosCount = comercio.cursos?.length || comercio.cursos_count || 0;
                                        const hasOferta = carrerasCount > 0 || especialidadesCount > 0 || diplomadosCount > 0 || cursosCount > 0;

                                        return (
                                            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={comercio.id}>
                                                <Card
                                                    variant="outlined"
                                                    sx={{
                                                        height: '100%',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'space-between',
                                                        borderRadius: 2.5,
                                                        position: 'relative',
                                                        overflow: 'hidden',
                                                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        '&:hover': {
                                                            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)',
                                                            transform: 'translateY(-3px)',
                                                            borderColor: brandColor,
                                                        },
                                                    }}
                                                >
                                                    {/* Barra superior del color de la marca */}
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

                                                    <CardContent sx={{ p: 3, pt: 3.5 }}>
                                                        {/* Cabecera de Marca */}
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5, mb: 2 }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8 }}>
                                                                {(() => {
                                                                    const logoSrc = isDark
                                                                        ? (comercio.logo_modo_oscuro || comercio.logo_modo_claro)
                                                                        : (comercio.logo_modo_claro || comercio.logo_modo_oscuro);

                                                                    if (logoSrc) {
                                                                        return (
                                                                            <Box
                                                                                sx={{
                                                                                    height: 48,
                                                                                    width: 82,
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'center',
                                                                                    p: 0.5,
                                                                                    bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                                                                                    borderRadius: 2,
                                                                                    border: '1px solid',
                                                                                    borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
                                                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                                                                                    flexShrink: 0,
                                                                                }}
                                                                            >
                                                                                <Box
                                                                                    component="img"
                                                                                    src={logoSrc}
                                                                                    alt={`Logo ${comercio.nombre}`}
                                                                                    sx={{
                                                                                        maxHeight: 40,
                                                                                        maxWidth: '100%',
                                                                                        objectFit: 'contain',
                                                                                    }}
                                                                                />
                                                                            </Box>
                                                                        );
                                                                    }

                                                                    return (
                                                                        <Avatar
                                                                            sx={{
                                                                                width: 48,
                                                                                height: 48,
                                                                                bgcolor: brandColor,
                                                                                color: '#ffffff',
                                                                                fontWeight: 900,
                                                                                fontSize: '1.1rem',
                                                                                boxShadow: `0 4px 12px ${brandColor}40`,
                                                                            }}
                                                                        >
                                                                            {(comercio.sigla || comercio.nombre).substring(0, 3).toUpperCase()}
                                                                        </Avatar>
                                                                    );
                                                                })()}
                                                                <Box>
                                                                    <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                                                                        {comercio.nombre}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                                                        {comercio.grupo?.nombre ? `División ${comercio.grupo.nombre}` : 'Grupo Capsur'}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>

                                                            {comercio.sigla && (
                                                                <Chip
                                                                    label={comercio.sigla}
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: `${brandColor}15`,
                                                                        color: brandColor,
                                                                        fontWeight: 800,
                                                                        fontSize: '0.75rem',
                                                                    }}
                                                                />
                                                            )}
                                                        </Box>

                                                        {/* Descripción */}
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{
                                                                mb: 2.5,
                                                                lineHeight: 1.55,
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden',
                                                                height: 44,
                                                            }}
                                                        >
                                                            {comercio.descripcion || 'Institución formativa perteneciente a Grupo Capsur con certificación técnica y académica.'}
                                                        </Typography>

                                                        {/* Acreditaciones MINEDU */}
                                                        <Box sx={{ mb: 2.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                            {comercio.escale_minedu && (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <VerifiedUserIcon sx={{ fontSize: 16, color: brandColor }} />
                                                                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                                                        ESCALE:{' '}
                                                                        <Box component="span" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                                                            {comercio.escale_minedu}
                                                                        </Box>
                                                                    </Typography>
                                                                </Box>
                                                            )}

                                                            {comercio.resolucion_creacion && (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, minWidth: 0 }}>
                                                                        <CheckCircleIcon sx={{ fontSize: 16, color: brandColor, flexShrink: 0 }} />
                                                                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                                                            R. Creación:
                                                                        </Typography>
                                                                    </Box>
                                                                    {comercio.resolucion_creacion.startsWith('http') || comercio.resolucion_creacion.includes('drive.google.com') ? (
                                                                        <Button
                                                                            size="small"
                                                                            variant="outlined"
                                                                            component="a"
                                                                            href={comercio.resolucion_creacion.startsWith('http') ? comercio.resolucion_creacion : `https://${comercio.resolucion_creacion}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            endIcon={<LaunchIcon sx={{ fontSize: '13px !important' }} />}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                            sx={{
                                                                                py: 0.1,
                                                                                px: 1,
                                                                                borderRadius: 1.5,
                                                                                textTransform: 'none',
                                                                                fontSize: '0.72rem',
                                                                                fontWeight: 700,
                                                                                lineHeight: 1.4,
                                                                                color: brandColor,
                                                                                borderColor: brandColor,
                                                                                '&:hover': {
                                                                                    borderColor: brandColor,
                                                                                    bgcolor: `${brandColor}10`,
                                                                                },
                                                                            }}
                                                                        >
                                                                            Ver documento
                                                                        </Button>
                                                                    ) : (
                                                                        <Typography variant="caption" noWrap sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                                                            {comercio.resolucion_creacion}
                                                                        </Typography>
                                                                    )}
                                                                </Box>
                                                            )}

                                                            {comercio.resolucion_revalidacion && (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, minWidth: 0 }}>
                                                                        <CheckCircleIcon sx={{ fontSize: 16, color: brandColor, flexShrink: 0 }} />
                                                                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                                                            R. Revalidación:
                                                                        </Typography>
                                                                    </Box>
                                                                    {comercio.resolucion_revalidacion.startsWith('http') || comercio.resolucion_revalidacion.includes('drive.google.com') ? (
                                                                        <Button
                                                                            size="small"
                                                                            variant="outlined"
                                                                            component="a"
                                                                            href={comercio.resolucion_revalidacion.startsWith('http') ? comercio.resolucion_revalidacion : `https://${comercio.resolucion_revalidacion}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            endIcon={<LaunchIcon sx={{ fontSize: '13px !important' }} />}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                            sx={{
                                                                                py: 0.1,
                                                                                px: 1,
                                                                                borderRadius: 1.5,
                                                                                textTransform: 'none',
                                                                                fontSize: '0.72rem',
                                                                                fontWeight: 700,
                                                                                lineHeight: 1.4,
                                                                                color: brandColor,
                                                                                borderColor: brandColor,
                                                                                '&:hover': {
                                                                                    borderColor: brandColor,
                                                                                    bgcolor: `${brandColor}10`,
                                                                                },
                                                                            }}
                                                                        >
                                                                            Ver documento
                                                                        </Button>
                                                                    ) : (
                                                                        <Typography variant="caption" noWrap sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                                                            {comercio.resolucion_revalidacion}
                                                                        </Typography>
                                                                    )}
                                                                </Box>
                                                            )}

                                                            {comercio.promocion_vigente && (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, minWidth: 0 }}>
                                                                        <LocalOfferIcon sx={{ fontSize: 15, color: '#ea580c', flexShrink: 0 }} />
                                                                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#ea580c' }}>
                                                                            Promoción:
                                                                        </Typography>
                                                                    </Box>
                                                                    <Button
                                                                        size="small"
                                                                        variant="outlined"
                                                                        component="a"
                                                                        href={comercio.promocion_vigente.startsWith('http') ? comercio.promocion_vigente : `https://${comercio.promocion_vigente}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        endIcon={<LaunchIcon sx={{ fontSize: '13px !important' }} />}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        sx={{
                                                                            py: 0.1,
                                                                            px: 1,
                                                                            borderRadius: 1.5,
                                                                            textTransform: 'none',
                                                                            fontSize: '0.72rem',
                                                                            fontWeight: 700,
                                                                            lineHeight: 1.4,
                                                                            color: '#ea580c',
                                                                            borderColor: '#ea580c',
                                                                            '&:hover': { borderColor: '#c2410c', bgcolor: 'rgba(234, 88, 12, 0.05)' },
                                                                        }}
                                                                    >
                                                                        Ver promoción
                                                                    </Button>
                                                                </Box>
                                                            )}
                                                        </Box>

                                                        {/* Píldoras de Oferta Académica */}
                                                        {hasOferta && (
                                                            <>
                                                                <Divider sx={{ mb: 2 }} />
                                                                <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                                                                    {carrerasCount > 0 && (
                                                                        <Chip
                                                                            label={`${carrerasCount} ${carrerasCount === 1 ? 'Carrera' : 'Carreras'}`}
                                                                            size="small"
                                                                            variant="outlined"
                                                                            sx={{
                                                                                fontWeight: 700,
                                                                                fontSize: '0.72rem',
                                                                                color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                                                                                borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : '#000000',
                                                                            }}
                                                                        />
                                                                    )}
                                                                    {especialidadesCount > 0 && (
                                                                        <Chip
                                                                            label={`${especialidadesCount} ${especialidadesCount === 1 ? 'Especialidad' : 'Especialidades'}`}
                                                                            size="small"
                                                                            variant="outlined"
                                                                            sx={{
                                                                                fontWeight: 700,
                                                                                fontSize: '0.72rem',
                                                                                color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                                                                                borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : '#000000',
                                                                            }}
                                                                        />
                                                                    )}
                                                                    {diplomadosCount > 0 && (
                                                                        <Chip
                                                                            label={`${diplomadosCount} ${diplomadosCount === 1 ? 'Diplomado' : 'Diplomados'}`}
                                                                            size="small"
                                                                            variant="outlined"
                                                                            sx={{
                                                                                fontWeight: 700,
                                                                                fontSize: '0.72rem',
                                                                                color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                                                                                borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : '#000000',
                                                                            }}
                                                                        />
                                                                    )}
                                                                    {cursosCount > 0 && (
                                                                        <Chip
                                                                            label={`${cursosCount} ${cursosCount === 1 ? 'Curso' : 'Cursos'}`}
                                                                            size="small"
                                                                            variant="outlined"
                                                                            sx={{
                                                                                fontWeight: 700,
                                                                                fontSize: '0.72rem',
                                                                                color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                                                                                borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : '#000000',
                                                                            }}
                                                                        />
                                                                    )}
                                                                </Box>
                                                            </>
                                                        )}
                                                    </CardContent>

                                                    {/* Pie de Tarjeta con Acciones Rápidas */}
                                                    <Box
                                                        sx={{
                                                            p: 2,
                                                            px: 3,
                                                            borderTop: 1,
                                                            borderColor: 'divider',
                                                            bgcolor: 'action.hover',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            gap: 1,
                                                        }}
                                                    >
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            onClick={() => handleOpenComercioDetail(comercio)}
                                                            endIcon={<ArrowForwardIcon fontSize="small" />}
                                                            sx={{
                                                                borderRadius: 1.5,
                                                                textTransform: 'none',
                                                                fontWeight: 800,
                                                                bgcolor: brandColor,
                                                                '&:hover': { bgcolor: brandColor, opacity: 0.9 },
                                                            }}
                                                        >
                                                            Ver Ficha Completa
                                                        </Button>

                                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                            {comercio.plataforma_carrera && (
                                                                <Tooltip title="Aula Virtual / Plataforma" arrow>
                                                                    <IconButton
                                                                        size="small"
                                                                        component="a"
                                                                        href={comercio.plataforma_carrera}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        sx={{ color: 'text.secondary', '&:hover': { color: brandColor } }}
                                                                    >
                                                                        <SchoolIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}
                                                            {comercio.pagina_web && (
                                                                <Tooltip title="Página Web Oficial" arrow>
                                                                    <IconButton
                                                                        size="small"
                                                                        component="a"
                                                                        href={comercio.pagina_web}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        sx={{ color: 'text.secondary', '&:hover': { color: brandColor } }}
                                                                    >
                                                                        <LanguageIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                </Card>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            )}
                        </>
                    )}

                    {/* VISTA 1: EXPLORADOR GLOBAL DE OFERTA ACADÉMICA */}
                    {activeViewTab === 1 && (
                        <AcademicOfferExplorer
                            grupos={grupos}
                            onSelectComercio={(comercio) => handleOpenComercioDetail(comercio)}
                        />
                    )}
                </Container>

                {/* Ficha Modal de Consulta Detallada de Comercio */}
                <ComercioDetailModal
                    open={detailModalOpen}
                    comercio={selectedComercio}
                    onClose={handleCloseComercioDetail}
                />

                {/* Popover desplegable para Iniciar Sesión (Acceso Administrativo) */}
                <LoginPopover
                    open={Boolean(loginAnchorEl)}
                    anchorEl={loginAnchorEl}
                    onClose={handleCloseLogin}
                />

                {/* Footer Institucional */}
                <Box
                    component="footer"
                    sx={{
                        py: 3.5,
                        px: 2,
                        borderTop: 1,
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        textAlign: 'center',
                        mt: 'auto',
                    }}
                >
                    <Container maxWidth="lg">
                        <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                            Grupo Capsur • Plataforma de Consulta Corporativa para Colaboradores
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Acreditaciones oficiales MINEDU y programas bajo resoluciones ministeriales vigentes. Acceso restringido para modificaciones administrativas.
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                            © {new Date().getFullYear()} Grupo Capsur. Todos los derechos reservados.
                        </Typography>
                    </Container>
                </Box>
            </Box>
        </>
    );
}
