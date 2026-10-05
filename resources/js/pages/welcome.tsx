import { Head, Link, usePage } from '@inertiajs/react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BusinessIcon from '@mui/icons-material/Business';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ClearIcon from '@mui/icons-material/Clear';
import DescriptionIcon from '@mui/icons-material/Description';
import EngineeringIcon from '@mui/icons-material/Engineering';
import FlightIcon from '@mui/icons-material/Flight';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import LanguageIcon from '@mui/icons-material/Language';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import LaunchIcon from '@mui/icons-material/Launch';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import StorefrontIcon from '@mui/icons-material/Storefront';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import {
    Avatar,
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
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState, useMemo, useEffect, useRef } from 'react';
import AppLogo from '@/components/app-logo';
import ComercioDetailModal from '@/components/catalog/comercio-detail-modal';
import LoginPopover from '@/components/login-popover';
import { useNotification } from '@/hooks/use-notification';
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

// Lista oficial de marcas del Grupo CAPSUR para el carrusel flotante
const SHOWCASE_BRANDS = [
    {
        name: 'SIS Instituto Sistemas del Sur',
        sigla: 'SIS',
        logo: '/logos-comercios/sis-para-fondo-blanco.png',
        matchTerm: 'SIS',
    },
    {
        name: 'AVANTI Instituto de Turismo y Hostelería',
        sigla: 'AVANTI',
        logo: '/logos-comercios/avanti-para-fondo-blanco.png',
        matchTerm: 'AVANTI',
    },
    {
        name: 'CECAVA Capacitaciones Especializadas',
        sigla: 'CECAVA',
        logo: '/logos-comercios/cecava-para-fondo-blanco.png',
        matchTerm: 'CECAVA',
    },
    {
        name: 'CECAVA MIN',
        sigla: 'CECAVA MIN',
        logo: '/logos-comercios/cecava-min-para-fondo-blanco.png',
        matchTerm: 'CECAVA MIN',
    },
    {
        name: 'MATPEL Materiales Peligrosos',
        sigla: 'MATPEL',
        logo: '/logos-comercios/matpel-para-fondo-blanco.png',
        matchTerm: 'MATPEL',
    },
    {
        name: 'Next Online Idiomas',
        sigla: 'Next Online',
        logo: '/logos-comercios/next-online-para-fondo-blanco.png',
        matchTerm: 'Next Online',
    },
    {
        name: 'Globalex Instituto Superior',
        sigla: 'Globalex',
        logo: '/logos-comercios/globalex-para-fondo-blanco.png',
        matchTerm: 'Globalex',
    },
];

// Lista cuadruplicada para garantizar un bucle continuo e infinito perfecto sin saltos
const INFINITE_BRANDS = [
    ...SHOWCASE_BRANDS,
    ...SHOWCASE_BRANDS,
    ...SHOWCASE_BRANDS,
    ...SHOWCASE_BRANDS,
];

const NAV_ITEMS = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'nosotros', label: 'Nosotros' },
    { id: 'marcas', label: 'Nuestras marcas' },
    { id: 'beneficios', label: 'Beneficios' },
    { id: 'contacto', label: 'Contacto' },
];

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

    // Navegación activa en la barra superior
    const [activeNav, setActiveNav] = useState('inicio');

    // Popover de inicio de sesión administrativo
    const [loginAnchorEl, setLoginAnchorEl] = useState<HTMLButtonElement | null>(null);

    // Modal de detalle de comercio
    const [selectedComercio, setSelectedComercio] = useState<Comercio | null>(initialComercio);
    const [detailModalOpen, setDetailModalOpen] = useState<boolean>(Boolean(initialComercio));


    // Filtros del directorio de marcas
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGrupoId, setSelectedGrupoId] = useState<number | 'all'>('all');

    // Referencia para el carrusel de logos
    const carouselTrackRef = useRef<HTMLDivElement>(null);

    // Control de animación del carrusel infinito de logos
    const [marqueeDirection, setMarqueeDirection] = useState<'normal' | 'reverse'>('normal');
    const [isMarqueeFast, setIsMarqueeFast] = useState(false);
    const [isMarqueeHovered, setIsMarqueeHovered] = useState(false);

    // Bandera para evitar conflictos entre el scroll manual y el scroll spy
    const isManualScrollingRef = useRef(false);
    const scrollRafRef = useRef<number | null>(null);


    // Cancelar animación de desplazamiento si el usuario interactúa manualmente con la rueda o pantalla
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const cancelProgrammedScroll = () => {
            if (isManualScrollingRef.current && scrollRafRef.current) {
                cancelAnimationFrame(scrollRafRef.current);
                scrollRafRef.current = null;
                isManualScrollingRef.current = false;
            }
        };

        window.addEventListener('wheel', cancelProgrammedScroll, { passive: true });
        window.addEventListener('touchmove', cancelProgrammedScroll, { passive: true });
        return () => {
            window.removeEventListener('wheel', cancelProgrammedScroll);
            window.removeEventListener('touchmove', cancelProgrammedScroll);
        };
    }, []);

    // Detección automática de sección activa durante el scroll del usuario
    useEffect(() => {
        if (typeof window === 'undefined') return;

        let ticking = false;
        const handleScroll = () => {
            if (isManualScrollingRef.current) return;

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollPos = (window.pageYOffset || document.documentElement.scrollTop) + 120;
                    // Lista ordenada según la aparición en la página
                    const sectionIds = ['inicio', 'marcas', 'nosotros', 'beneficios', 'contacto'];

                    for (let i = sectionIds.length - 1; i >= 0; i--) {
                        const id = sectionIds[i];
                        const el = document.getElementById(id);
                        if (el) {
                            const top = el.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop);
                            if (scrollPos >= top - 20) {
                                setActiveNav(id);
                                break;
                            }
                        }
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Detección automática de ?login=1
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

    // Aplanar la lista de comercios de todos los grupos
    const allComercios = useMemo(() => {
        const list: Comercio[] = [];
        grupos.forEach((grp) => {
            if (grp.comercios && Array.isArray(grp.comercios)) {
                grp.comercios.forEach((c) => {
                    list.push({ ...c, grupo: grp });
                });
            }
        });
        return list;
    }, [grupos]);

    // Filtrar comercios según grupo y término de búsqueda
    const filteredComercios = useMemo(() => {
        return allComercios.filter((com) => {
            if (selectedGrupoId !== 'all' && com.grupo_id !== selectedGrupoId) {
                return false;
            }

            if (searchQuery.trim()) {
                const term = searchQuery.toLowerCase().trim();
                const matchNombre = com.nombre?.toLowerCase().includes(term);
                const matchSigla = com.sigla?.toLowerCase().includes(term);
                const matchGrupo = com.grupo?.nombre?.toLowerCase().includes(term);
                const matchEscale = com.escale_minedu?.toLowerCase().includes(term);
                const matchResolucion = com.resolucion_creacion?.toLowerCase().includes(term);
                const matchCarreras = com.carreras?.some((c) => c.nombre?.toLowerCase().includes(term));
                const matchDiplomados = com.diplomados?.some((d) => d.nombre?.toLowerCase().includes(term));
                const matchCursos = com.cursos?.some((cu) => cu.nombre?.toLowerCase().includes(term));
                const matchEspecialidades = com.especialidades?.some((e) => e.nombre?.toLowerCase().includes(term));

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
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    // Desplazamiento animado veloz y ultra fluido con desaceleración cinematográfica (ease-out cuártico)
    const smoothScrollTo = (targetPosition: number, duration = 360) => {
        if (typeof window === 'undefined') return;

        // Cancelar animación anterior si el usuario hace clics rápidos consecutivos
        if (scrollRafRef.current) {
            cancelAnimationFrame(scrollRafRef.current);
            scrollRafRef.current = null;
        }

        const startPosition = window.pageYOffset || document.documentElement.scrollTop;
        const distance = targetPosition - startPosition;
        if (Math.abs(distance) < 2) return;

        isManualScrollingRef.current = true;
        let startTime: number | null = null;

        // Curva reactiva instantánea: acelera en el primer frame y desacelera suavemente como seda
        const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

        const step = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeOutQuart(progress);

            window.scrollTo(0, Math.round(startPosition + distance * ease));

            if (timeElapsed < duration) {
                scrollRafRef.current = requestAnimationFrame(step);
            } else {
                scrollRafRef.current = null;
                window.scrollTo(0, targetPosition);
                setTimeout(() => {
                    isManualScrollingRef.current = false;
                }, 50);
            }
        };

        scrollRafRef.current = requestAnimationFrame(step);
    };

    // Navegar y desplazarse suavemente a una sección
    const handleNavClick = (sectionId: string) => {
        setActiveNav(sectionId);

        if (sectionId === 'inicio') {
            smoothScrollTo(0, 300);
            return;
        }

        const element = document.getElementById(sectionId);
        if (element) {
            const header = document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : 70;
            const elementTop = element.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop);
            const targetOffset = Math.max(0, elementTop - headerHeight - 10);

            const distance = Math.abs(targetOffset - (window.pageYOffset || 0));
            // Cálculo cinemático por raíz cuadrada: respuesta entre 260ms y 450ms según distancia
            const duration = Math.min(450, Math.max(260, Math.round(Math.sqrt(distance) * 8.2)));

            smoothScrollTo(targetOffset, duration);
        }
    };

    // Control de flechas del carrusel de logos (invierte o acelera momentáneamente el flujo)
    const handleScrollBrands = (direction: 'left' | 'right') => {
        if (direction === 'left') {
            setMarqueeDirection('reverse');
        } else {
            setMarqueeDirection('normal');
        }
        setIsMarqueeFast(true);
        setTimeout(() => {
            setIsMarqueeFast(false);
        }, 1800);
    };

    // Buscar si una marca del carrusel corresponde a un comercio en DB
    const handleShowcaseBrandClick = (brand: typeof SHOWCASE_BRANDS[0]) => {
        const found = allComercios.find(
            (c) =>
                c.nombre.toLowerCase().includes(brand.matchTerm.toLowerCase()) ||
                (c.sigla && c.sigla.toLowerCase().includes(brand.matchTerm.toLowerCase()))
        );

        if (found) {
            handleOpenComercioDetail(found);
        } else {
            handleNavClick('marcas');
        }
    };

    // Filtrar y navegar directamente a una carrera específica desde el Hero
    const handleCareerClick = (query: string) => {
        setSearchQuery(query);
        handleNavClick('marcas');
    };

    return (
        <>
            <Head title="Grupo CAPSUR | Formación que impulsa tu futuro profesional" />

            <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff', color: '#0f172a', display: 'flex', flexDirection: 'column' }}>
                <Box
                    component="header"
                    sx={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 1200,
                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        borderBottom: '1px solid',
                        borderColor: 'rgba(226, 232, 240, 0.8)',
                        py: 1.2,
                        px: { xs: 2, sm: 4, lg: 6 },
                    }}
                >
                    <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box
                            component="a"
                            href="#inicio"
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick('inicio');
                            }}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <Box
                                component="img"
                                src="/images/logo-light.png"
                                alt="Grupo CAPSUR"
                                sx={{
                                    height: { xs: 34, md: 40 },
                                    width: 'auto',
                                    objectFit: 'contain',
                                }}
                            />
                        </Box>

                        {/* Menú de Navegación Central */}
                        <Box
                            component="nav"
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                alignItems: 'center',
                                gap: { md: 1, lg: 1.8 },
                            }}
                        >
                            {NAV_ITEMS.map((item) => {
                                const isActive = activeNav === item.id;
                                return (
                                    <Box
                                        key={item.id}
                                        onClick={() => handleNavClick(item.id)}
                                        sx={{
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            py: 0.7,
                                            px: { md: 1.4, lg: 1.8 },
                                            borderRadius: '8px',
                                            position: 'relative',
                                            transition: 'background-color 0.18s cubic-bezier(0.16, 1, 0.3, 1), transform 0.12s ease',
                                            '&:hover': {
                                                bgcolor: 'rgba(0, 86, 214, 0.05)',
                                            },
                                            '&:active': {
                                                transform: 'scale(0.96)',
                                            },
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '0.94rem',
                                                fontWeight: isActive ? 700 : 500,
                                                color: isActive ? '#0056d6' : '#334155',
                                                letterSpacing: '-0.01em',
                                                transition: 'color 0.16s cubic-bezier(0.16, 1, 0.3, 1)',
                                                '&:hover': {
                                                    color: '#0056d6',
                                                },
                                            }}
                                        >
                                            {item.label}
                                        </Typography>
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                width: isActive ? 28 : 0,
                                                height: 3,
                                                bgcolor: '#0056d6',
                                                borderRadius: 99,
                                                boxShadow: isActive ? '0 2px 8px rgba(0, 86, 214, 0.35)' : 'none',
                                                transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                                                opacity: isActive ? 1 : 0,
                                                transform: isActive ? 'scaleX(1)' : 'scaleX(0.3)',
                                                transformOrigin: 'center',
                                            }}
                                        />
                                    </Box>
                                );
                            })}
                        </Box>

                        {/* Botón Ingresar / Panel Derecho */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            {auth.user ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Chip
                                        avatar={
                                            <Avatar sx={{ bgcolor: '#0056d6', color: '#fff', width: 28, height: 28, fontSize: '0.8rem', fontWeight: 800 }}>
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
                                            endIcon={<ArrowForwardIcon />}
                                            sx={{
                                                bgcolor: '#0056d6',
                                                px: 2.6,
                                                py: 0.85,
                                                fontWeight: 700,
                                                borderRadius: 99,
                                                textTransform: 'none',
                                                fontSize: '0.88rem',
                                                boxShadow: '0 4px 14px rgba(0, 86, 214, 0.28)',
                                                '&:hover': {
                                                    bgcolor: '#0041a8',
                                                },
                                            }}
                                        >
                                            Panel de Control
                                        </Button>
                                    </Link>
                                </Box>
                            ) : (
                                <Button
                                    id="btn-iniciar-sesion"
                                    variant="contained"
                                    onClick={handleOpenLogin}
                                    startIcon={<PersonOutlinedIcon sx={{ fontSize: 19 }} />}
                                    sx={{
                                        bgcolor: '#0056d6',
                                        color: '#ffffff',
                                        borderRadius: 99,
                                        px: { xs: 2.2, sm: 3 },
                                        py: 0.9,
                                        fontWeight: 700,
                                        fontSize: '0.9rem',
                                        textTransform: 'none',
                                        boxShadow: '0 4px 14px rgba(0, 86, 214, 0.25)',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            bgcolor: '#0041a8',
                                            boxShadow: '0 6px 18px rgba(0, 86, 214, 0.35)',
                                            transform: 'translateY(-1px)',
                                        },
                                    }}
                                >
                                    Ingresar
                                </Button>
                            )}
                        </Box>
                    </Container>
                </Box>

                {/* 2. Hero Section con Fachada Institucional CAPSUR como Fondo Elegante */}
                <Box
                    id="inicio"
                    sx={{
                        position: 'relative',
                        bgcolor: '#08142a',
                        pt: { xs: 4, sm: 5, md: 6, lg: 7 },
                        pb: { xs: 4, md: 0 },
                        px: { xs: 2, sm: 3, md: 5, lg: 6 },
                        scrollMarginTop: { xs: '65px', md: '75px' },
                        overflow: 'hidden',
                    }}
                >
                    {/* Capa de Fondo (Wallpaper Completo): Fotografía Widescreen de la Fachada CAPSUR */}
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            zIndex: 0,
                            pointerEvents: 'none',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Imagen de la Fachada Institucional Widescreen en Alta Resolución */}
                        <Box
                            component="img"
                            src="/images/fachada-capsur.jpeg"
                            alt="Fachada Institucional Sede Central Grupo CAPSUR"
                            sx={{
                                position: 'absolute',
                                top:0,
                                right:0,
                                width: '70%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: {
                                    xs: 'center 15%',
                                    sm: 'center 18%',
                                    md: 'center 20%',
                                    lg: 'center 20%',
                                },
                            }}
                        />

                        {/* Sombreado Direccional Idéntico al Diseño Objetivo:
                            Oscuro a la izquierda para contraste tipográfico cristalino,
                            translúcido y luminoso en el centro y derecha para apreciar la palmera, el edificio y el cielo */}
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                background: {
                                    xs: 'linear-gradient(180deg, rgba(6, 17, 38, 0.90) 0%, rgba(6, 17, 38, 0.65) 45%, rgba(6, 17, 38, 0.15) 100%)',
                                    md: 'linear-gradient(90deg, rgba(6, 17, 38, 0.92) 0%, rgba(6, 17, 38, 0.82) 30%, rgba(6, 17, 38, 0.35) 54%, transparent 72%)',
                                },
                            }}
                        />
                    </Box>

                    <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, pt: { xs: 2, md: 3 }, pb: 5, px: { xs: 2, sm: 3 } }}>
                        {/* Contenido Hero: Textual (Izquierda) + Composición Visual de Profesionales (Derecha) */}
                        <Grid container spacing={{ xs: 4, lg: 5 }} sx={{ alignItems: { xs: 'center', md: 'flex-end' } }}>
                            {/* Columna Izquierda: Información Institucional, Copywriting, CTAs */}
                            <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                                <Box sx={{ maxWidth: 600, pb: { xs: 2, md: 5, lg: 6 } }}>
                                    {/* Eyebrow / Distintivo Institucional Stately */}
                                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.4, mb: 2.8, flexWrap: 'wrap' }}>
                                        <Box
                                            sx={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                px: 1.8,
                                                py: 0.65,
                                                borderRadius: '6px',
                                                bgcolor: 'rgba(255, 255, 255, 0.08)',
                                                backdropFilter: 'blur(12px)',
                                                border: '1px solid rgba(255, 255, 255, 0.18)',
                                            }}
                                        >
                                            <WorkspacePremiumIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                                            <Typography
                                                sx={{
                                                    fontSize: '0.72rem',
                                                    fontWeight: 700,
                                                    letterSpacing: '0.12em',
                                                    textTransform: 'uppercase',
                                                    color: '#ffffff',
                                                }}
                                            >
                                                Corporación Educativa CAPSUR
                                            </Typography>
                                        </Box>
                                        <Typography
                                            sx={{
                                                fontSize: '0.74rem',
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                fontWeight: 500,
                                                letterSpacing: '0.04em',
                                                display: { xs: 'none', sm: 'inline-block' },
                                            }}
                                        >
                                            • Sede Central Institucional
                                        </Typography>
                                    </Box>

                                    {/* Título Principal Ejecutivo Idéntico al Objetivo */}
                                    <Typography
                                        component="h1"
                                        sx={{
                                            fontSize: { xs: '2.5rem', sm: '3.2rem', md: '3.8rem', lg: '4.2rem' },
                                            fontWeight: 800,
                                            lineHeight: 1.1,
                                            letterSpacing: '-0.025em',
                                            color: '#ffffff',
                                            mb: 2.5,
                                            textShadow: '0 2px 18px rgba(0, 0, 0, 0.6)',
                                        }}
                                    >
                                        Carreras que<br />
                                        <Box
                                            component="span"
                                            sx={{
                                                color: '#38bdf8',
                                                fontWeight: 800,
                                            }}
                                        >
                                            impulsan
                                        </Box>{' '}
                                        tu futuro
                                    </Typography>

                                    {/* Bajada / Subtítulo Institucional Articulado */}
                                    <Typography
                                        sx={{
                                            fontSize: { xs: '0.98rem', sm: '1.05rem', md: '1.08rem' },
                                            color: 'rgba(255, 255, 255, 0.85)',
                                            lineHeight: 1.7,
                                            fontWeight: 400,
                                            maxWidth: 530,
                                            mb: 4,
                                            textShadow: '0 1px 6px rgba(0, 0, 0, 0.5)',
                                        }}
                                    >
                                        Formación técnica y superior con enfoque práctico e inserción laboral inmediata. Desarrolla competencias para liderar en el mundo productivo a través de nuestras prestigiosas instituciones en el sur del país.
                                    </Typography>

                                    {/* Grupo de Acciones / CTAs Ejecutivos */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                                        {/* Botón Principal Corporativo */}
                                        <Button
                                            variant="contained"
                                            onClick={() => handleNavClick('marcas')}
                                            endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
                                            sx={{
                                                bgcolor: '#0056d6',
                                                color: '#ffffff',
                                                px: 3.5,
                                                py: 1.3,
                                                borderRadius: '8px',
                                                fontWeight: 700,
                                                fontSize: '0.92rem',
                                                letterSpacing: '0.01em',
                                                textTransform: 'none',
                                                boxShadow: '0 4px 18px rgba(0, 86, 214, 0.4)',
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    bgcolor: '#0043a8',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 8px 24px rgba(0, 86, 214, 0.55)',
                                                },
                                            }}
                                        >
                                            Explorar Carreras
                                        </Button>

                                        {/* Botón Secundario Outline Glassmorphism */}
                                        <Button
                                            variant="outlined"
                                            onClick={() => handleNavClick('nosotros')}
                                            startIcon={<PlayArrowIcon sx={{ fontSize: 19 }} />}
                                            sx={{
                                                borderColor: 'rgba(255, 255, 255, 0.28)',
                                                color: '#ffffff',
                                                bgcolor: 'rgba(255, 255, 255, 0.06)',
                                                backdropFilter: 'blur(10px)',
                                                px: 2.8,
                                                py: 1.3,
                                                borderRadius: '8px',
                                                fontWeight: 600,
                                                fontSize: '0.92rem',
                                                textTransform: 'none',
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    borderColor: 'rgba(255, 255, 255, 0.6)',
                                                    bgcolor: 'rgba(255, 255, 255, 0.12)',
                                                    transform: 'translateY(-2px)',
                                                },
                                            }}
                                        >
                                            Conoce Grupo CAPSUR
                                        </Button>
                                    </Box>
                                </Box>
                            </Grid>

                            {/* Columna Derecha: Profesionales Asentados en la Base del Carrusel */}
                            <Grid
                                size={{ xs: 12, md: 6, lg: 6 }}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'flex-end',
                                    alignSelf: 'flex-end',
                                    mt: { xs: 2, md: 0 },
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        maxWidth: { xs: 460, sm: 540, md: 620, lg: 660 },
                                        mx: 'auto',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                        mb: 0,
                                    }}
                                >
                                    {/* Badge Flotante "Educación Superior" (Diseño Objetivo) */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: { xs: -8, sm: -14, md: -20, lg: -28 },
                                            right: { xs: 0, md: 8, lg: 16 },
                                            zIndex: 5,
                                            display: { xs: 'none', sm: 'flex' },
                                            alignItems: 'center',
                                            gap: 1.4,
                                            px: 2,
                                            py: 1.1,
                                            borderRadius: '12px',
                                            bgcolor: 'rgba(8, 24, 52, 0.88)',
                                            backdropFilter: 'blur(12px)',
                                            border: '1px solid rgba(255, 255, 255, 0.16)',
                                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: '8px',
                                                bgcolor: '#0056d6',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#ffffff',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <WorkspacePremiumIcon sx={{ fontSize: 20 }} />
                                        </Box>
                                        <Box>
                                            <Typography
                                                sx={{
                                                    color: '#ffffff',
                                                    fontWeight: 700,
                                                    fontSize: '0.86rem',
                                                    lineHeight: 1.2,
                                                }}
                                            >
                                                Educación Superior
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    color: 'rgba(255, 255, 255, 0.72)',
                                                    fontSize: '0.72rem',
                                                    lineHeight: 1.2,
                                                    mt: 0.3,
                                                }}
                                            >
                                                Validez oficial y alta demanda laboral
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Fotografía Central de los 3 Profesionales asentada firmemente sobre el carrusel */}
                                    <Box
                                        component="img"
                                        src="/images/profesionales.png"
                                        alt="Profesionales y técnicos de Grupo CAPSUR"
                                        sx={{
                                            position: 'relative',
                                            zIndex: 2,
                                            width: '100%',
                                            height: 'auto',
                                            display: 'block',
                                            verticalAlign: 'bottom',
                                            filter: 'drop-shadow(0 14px 28px rgba(0, 0, 0, 0.45))',
                                        }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>

                    </Container>
                </Box>

                {/* 3. Carrusel Flotante en Cápsula (Pill Bar) al pie del Hero - Movimiento Infinito */}
                <Box
                    sx={{
                        position: 'relative',
                        zIndex: 10,
                        maxWidth: 1140,
                        width: 'calc(100% - 32px)',
                        mx: 'auto',
                        mt: { xs: -3.5, md: -5 },
                        mb: { xs: 1.5, md: 2 },
                        px: { xs: 1.5, sm: 2.5 },
                        py: 1.4,
                        bgcolor: '#ffffff',
                        borderRadius: 99,
                        boxShadow: '0 12px 36px rgba(0, 50, 150, 0.12)',
                        border: '1px solid',
                        borderColor: 'rgba(226, 232, 240, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    {/* Botón Flecha Izquierda */}
                    <Tooltip title="Invertir dirección del carrusel" arrow>
                        <IconButton
                            size="small"
                            onClick={() => handleScrollBrands('left')}
                            sx={{
                                border: '1px solid #e2e8f0',
                                bgcolor: '#f8fafc',
                                width: 36,
                                height: 36,
                                flexShrink: 0,
                                color: '#475569',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    bgcolor: '#f1f5f9',
                                    color: '#0056d6',
                                    borderColor: '#cbd5e1',
                                    transform: 'scale(1.08)',
                                },
                            }}
                        >
                            <ChevronLeftIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                    </Tooltip>

                    {/* Pista de Logos con Movimiento Continuo e Infinito (Marquee) */}
                    <Box
                        sx={{
                            overflow: 'hidden',
                            flexGrow: 1,
                            mx: { xs: 1.5, sm: 2.5 },
                            position: 'relative',
                            maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                        }}
                        onMouseEnter={() => setIsMarqueeHovered(true)}
                        onMouseLeave={() => setIsMarqueeHovered(false)}
                        onTouchStart={() => setIsMarqueeHovered(true)}
                        onTouchEnd={() => setIsMarqueeHovered(false)}
                    >
                        <Box
                            ref={carouselTrackRef}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: { xs: 5, sm: 6.5, md: 8 },
                                width: 'max-content',
                                animation: `infiniteMarquee ${isMarqueeFast ? 10 : 36}s linear infinite`,
                                animationDirection: marqueeDirection,
                                animationPlayState: isMarqueeHovered ? 'paused' : 'running',
                                willChange: 'transform',
                                '@keyframes infiniteMarquee': {
                                    '0%': { transform: 'translate3d(0, 0, 0)' },
                                    '100%': { transform: 'translate3d(-50%, 0, 0)' },
                                },
                            }}
                        >
                            {INFINITE_BRANDS.map((brand, idx) => (
                                <Tooltip key={idx} title={`Explorar ${brand.name}`} arrow>
                                    <Box
                                        onClick={() => handleShowcaseBrandClick(brand)}
                                        sx={{
                                            cursor: 'pointer',
                                            flexShrink: 0,
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            px: 1.5,
                                            transition: 'transform 0.22s ease, opacity 0.22s ease',
                                            opacity: 0.9,
                                            '&:hover': {
                                                opacity: 1,
                                                transform: 'scale(1.08)',
                                            },
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={brand.logo}
                                            alt={brand.name}
                                            sx={{
                                                height: { xs: 30, sm: 34, md: 38 },
                                                maxWidth: { xs: 110, sm: 130, md: 155 },
                                                width: 'auto',
                                                objectFit: 'contain',
                                                userSelect: 'none',
                                            }}
                                        />
                                    </Box>
                                </Tooltip>
                            ))}
                        </Box>
                    </Box>

                    {/* Botón Flecha Derecha */}
                    <Tooltip title="Acelerar carrusel hacia adelante" arrow>
                        <IconButton
                            size="small"
                            onClick={() => handleScrollBrands('right')}
                            sx={{
                                border: '1px solid #e2e8f0',
                                bgcolor: '#f8fafc',
                                width: 36,
                                height: 36,
                                flexShrink: 0,
                                color: '#475569',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    bgcolor: '#f1f5f9',
                                    color: '#0056d6',
                                    borderColor: '#cbd5e1',
                                    transform: 'scale(1.08)',
                                },
                            }}
                        >
                            <ChevronRightIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* 4. Sección: Directorio de Nuestras Marcas e Instituciones */}
                <Box
                    id="marcas"
                    sx={{
                        pt: { xs: 1.5, md: 2 },
                        pb: { xs: 6, md: 9 },
                        bgcolor: '#fafcff',
                        borderBottom: '1px solid #eef2f6',
                        scrollMarginTop: { xs: '65px', md: '75px' },
                    }}
                >
                    <Container maxWidth="xl">
                        {/* Cabecera de la sección */}
                        <Box sx={{ textAlign: 'center', maxWidth: 750, mx: 'auto', mb: { xs: 2.5, md: 3.5 } }}>
                            <Chip
                                label="PORTAFOLIO OFICIAL"
                                size="small"
                                sx={{
                                    bgcolor: 'rgba(0, 86, 214, 0.08)',
                                    color: '#0056d6',
                                    fontWeight: 800,
                                    fontSize: '0.72rem',
                                    letterSpacing: '0.08em',
                                    borderRadius: 99,
                                    mb: 1.5,
                                }}
                            />
                            <Typography
                                variant="h3"
                                component="h2"
                                sx={{
                                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                    fontWeight: 900,
                                    color: '#09152a',
                                    letterSpacing: '-0.025em',
                                    mb: 1.5,
                                }}
                            >
                                Nuestras Marcas e Instituciones
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
                                Explora cada una de nuestras instituciones acreditadas, resoluciones oficiales MINEDU, carreras profesionales y plataformas de formación.
                            </Typography>
                        </Box>

                        {/* Barra de Búsqueda y Filtros de Grupo */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                alignItems: { xs: 'stretch', md: 'center' },
                                justifyContent: 'space-between',
                                bgcolor: '#ffffff',
                                p: 2,
                                borderRadius: 3,
                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                                border: '1px solid #e2e8f0',
                                mb: 4,
                                gap: 2,
                            }}
                        >
                            {/* Buscador */}
                            <TextField
                                size="small"
                                placeholder="Buscar por marca, carrera o código ESCALE..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ fontSize: 20, color: '#64748b' }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: searchQuery ? (
                                            <InputAdornment position="end">
                                                <IconButton size="small" onClick={() => setSearchQuery('')}>
                                                    <ClearIcon sx={{ fontSize: 16 }} />
                                                </IconButton>
                                            </InputAdornment>
                                        ) : null,
                                    },
                                }}
                                sx={{
                                    width: { xs: '100%', md: 340 },
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 99,
                                        bgcolor: '#f8fafc',
                                        fontSize: '0.88rem',
                                    },
                                }}
                            />

                            {/* Filtros de Grupos */}
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                                <Chip
                                    label={`Todos (${allComercios.length})`}
                                    clickable
                                    color={selectedGrupoId === 'all' ? 'primary' : 'default'}
                                    onClick={() => setSelectedGrupoId('all')}
                                    sx={{
                                        fontWeight: 700,
                                        borderRadius: 99,
                                        bgcolor: selectedGrupoId === 'all' ? '#0056d6' : '#f1f5f9',
                                    }}
                                />
                                {grupos.map((grp) => (
                                    <Chip
                                        key={grp.id}
                                        label={`${grp.nombre} (${grp.comercios?.length || 0})`}
                                        clickable
                                        color={selectedGrupoId === grp.id ? 'primary' : 'default'}
                                        onClick={() => setSelectedGrupoId(grp.id)}
                                        sx={{
                                            fontWeight: 700,
                                            borderRadius: 99,
                                            bgcolor: selectedGrupoId === grp.id ? '#0056d6' : '#f1f5f9',
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>

                        {/* Cuadrícula de Comercios */}
                        {filteredComercios.length === 0 ? (
                            <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 3, my: 4, bgcolor: '#ffffff' }}>
                                <StorefrontIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 1.5 }} />
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                    {allComercios.length === 0
                                        ? 'Catálogo en preparación'
                                        : 'No se encontraron comercios ni marcas'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                                    {allComercios.length === 0
                                        ? 'Aún no se han registrado marcas en el sistema.'
                                        : 'Intenta borrar el término de búsqueda o selecciona otro grupo corporativo.'}
                                </Typography>
                                {searchQuery && (
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<ClearIcon />}
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSelectedGrupoId('all');
                                        }}
                                        sx={{ borderRadius: 99, textTransform: 'none', fontWeight: 700 }}
                                    >
                                        Limpiar búsqueda
                                    </Button>
                                )}
                            </Paper>
                        ) : (
                            <Grid container spacing={3}>
                                {filteredComercios.map((comercio) => {
                                    const brandColor = comercio.color_hex || '#0056d6';
                                    const logoSrc = comercio.logo_modo_claro || comercio.logo_modo_oscuro;

                                    return (
                                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={comercio.id}>
                                            <Card
                                                variant="outlined"
                                                sx={{
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    borderRadius: 3.5,
                                                    transition: 'all 0.25s ease',
                                                    borderTop: 4,
                                                    borderTopColor: brandColor,
                                                    bgcolor: '#ffffff',
                                                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                                                    '&:hover': {
                                                        transform: 'translateY(-4px)',
                                                        boxShadow: `0 12px 28px ${brandColor}18`,
                                                        borderColor: brandColor,
                                                    },
                                                }}
                                            >
                                                <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                                    {/* Cabecera de la Tarjeta */}
                                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
                                                        {logoSrc ? (
                                                            <Box
                                                                component="img"
                                                                src={logoSrc}
                                                                alt={comercio.nombre}
                                                                sx={{
                                                                    width: 48,
                                                                    height: 48,
                                                                    objectFit: 'contain',
                                                                    borderRadius: 1.5,
                                                                    border: '1px solid #e2e8f0',
                                                                    p: 0.5,
                                                                    bgcolor: '#ffffff',
                                                                    flexShrink: 0,
                                                                }}
                                                            />
                                                        ) : (
                                                            <Avatar
                                                                sx={{
                                                                    width: 48,
                                                                    height: 48,
                                                                    bgcolor: brandColor,
                                                                    color: '#fff',
                                                                    fontWeight: 800,
                                                                    fontSize: '1rem',
                                                                    flexShrink: 0,
                                                                }}
                                                            >
                                                                {(comercio.sigla || comercio.nombre).substring(0, 3).toUpperCase()}
                                                            </Avatar>
                                                        )}

                                                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                            <Typography
                                                                variant="subtitle1"
                                                                sx={{
                                                                    fontWeight: 800,
                                                                    lineHeight: 1.25,
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap',
                                                                    color: '#0f172a',
                                                                }}
                                                                title={comercio.nombre}
                                                            >
                                                                {comercio.nombre}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                                                                {comercio.grupo?.nombre ? `División ${comercio.grupo.nombre}` : 'Corporación'}
                                                            </Typography>
                                                        </Box>

                                                        {comercio.escale_minedu && (
                                                            <Chip
                                                                label={comercio.escale_minedu}
                                                                size="small"
                                                                sx={{
                                                                    fontWeight: 800,
                                                                    fontSize: '0.65rem',
                                                                    height: 20,
                                                                    bgcolor: '#f1f5f9',
                                                                    color: '#475569',
                                                                }}
                                                            />
                                                        )}
                                                    </Box>

                                                    {/* Descripción */}
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{
                                                            mb: 2,
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            lineHeight: 1.5,
                                                            fontSize: '0.82rem',
                                                            flexGrow: 1,
                                                        }}
                                                    >
                                                        {comercio.descripcion ||
                                                            'Institución formativa perteneciente a Grupo Capsur con certificación técnica y académica.'}
                                                    </Typography>

                                                    {/* Promoción si existe */}
                                                    {comercio.promocion_vigente && (
                                                        <Box
                                                            sx={{
                                                                p: 1.2,
                                                                borderRadius: 1.5,
                                                                bgcolor: '#fffbeb',
                                                                border: '1px dashed #f59e0b',
                                                                mb: 2,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                gap: 1,
                                                            }}
                                                        >
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
                                                                <LocalOfferIcon sx={{ fontSize: 15, color: '#d97706', flexShrink: 0 }} />
                                                                <Typography
                                                                    variant="caption"
                                                                    sx={{
                                                                        fontWeight: 700,
                                                                        color: '#b45309',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        whiteSpace: 'nowrap',
                                                                    }}
                                                                >
                                                                    {comercio.promocion_vigente}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    )}

                                                    {/* Desglose de Programas Académicos */}
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, mb: 2 }}>
                                                        {comercio.carreras && comercio.carreras.length > 0 && (
                                                            <Chip
                                                                label={`${comercio.carreras.length} Carrera${comercio.carreras.length > 1 ? 's' : ''}`}
                                                                size="small"
                                                                variant="outlined"
                                                                sx={{ fontSize: '0.68rem', fontWeight: 700, height: 22 }}
                                                            />
                                                        )}
                                                        {comercio.especialidades && comercio.especialidades.length > 0 && (
                                                            <Chip
                                                                label={`${comercio.especialidades.length} Especialidad${comercio.especialidades.length > 1 ? 'es' : ''}`}
                                                                size="small"
                                                                variant="outlined"
                                                                sx={{ fontSize: '0.68rem', fontWeight: 700, height: 22 }}
                                                            />
                                                        )}
                                                        {comercio.diplomados && comercio.diplomados.length > 0 && (
                                                            <Chip
                                                                label={`${comercio.diplomados.length} Diplomado${comercio.diplomados.length > 1 ? 's' : ''}`}
                                                                size="small"
                                                                variant="outlined"
                                                                sx={{ fontSize: '0.68rem', fontWeight: 700, height: 22 }}
                                                            />
                                                        )}
                                                        {comercio.cursos && comercio.cursos.length > 0 && (
                                                            <Chip
                                                                label={`${comercio.cursos.length} Curso${comercio.cursos.length > 1 ? 's' : ''}`}
                                                                size="small"
                                                                variant="outlined"
                                                                sx={{ fontSize: '0.68rem', fontWeight: 700, height: 22 }}
                                                            />
                                                        )}
                                                    </Box>
                                                </CardContent>

                                                <Divider />

                                                {/* Acciones */}
                                                <Box
                                                    sx={{
                                                        p: 1.5,
                                                        px: 2,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        bgcolor: '#fafafa',
                                                    }}
                                                >
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                                                        onClick={() => handleOpenComercioDetail(comercio)}
                                                        sx={{
                                                            bgcolor: brandColor,
                                                            color: '#fff',
                                                            textTransform: 'none',
                                                            fontWeight: 800,
                                                            fontSize: '0.78rem',
                                                            px: 1.8,
                                                            py: 0.6,
                                                            borderRadius: 99,
                                                            boxShadow: 'none',
                                                            '&:hover': {
                                                                bgcolor: brandColor,
                                                                filter: 'brightness(0.92)',
                                                                boxShadow: `0 4px 12px ${brandColor}40`,
                                                            },
                                                        }}
                                                    >
                                                        Ver Ficha
                                                    </Button>

                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        {comercio.plataforma_carrera && (
                                                            <Tooltip title="Aula Virtual / Plataforma Educativa" arrow>
                                                                <IconButton
                                                                    size="small"
                                                                    component="a"
                                                                    href={comercio.plataforma_carrera}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    sx={{ color: '#64748b', '&:hover': { color: brandColor } }}
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
                                                                    sx={{ color: '#64748b', '&:hover': { color: brandColor } }}
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
                    </Container>
                </Box>

                {/* 5. Sección: Sobre Grupo CAPSUR y Capacitaciones Drive */}
                <Box id="nosotros" sx={{ py: { xs: 7, md: 10 }, bgcolor: '#ffffff', scrollMarginTop: { xs: '65px', md: '75px' } }}>
                    <Container maxWidth="xl">
                        <Grid container spacing={5} sx={{ alignItems: 'center' }}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Chip
                                    label="SOBRE NOSOTROS"
                                    size="small"
                                    sx={{
                                        bgcolor: 'rgba(0, 86, 214, 0.08)',
                                        color: '#0056d6',
                                        fontWeight: 800,
                                        fontSize: '0.72rem',
                                        letterSpacing: '0.08em',
                                        borderRadius: 99,
                                        mb: 1.5,
                                    }}
                                />
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontSize: { xs: '2rem', md: '2.8rem' },
                                        fontWeight: 900,
                                        color: '#09152a',
                                        letterSpacing: '-0.025em',
                                        lineHeight: 1.15,
                                        mb: 2.5,
                                    }}
                                >
                                    Impulsando el talento con excelencia y cobertura nacional
                                </Typography>
                                <Typography sx={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, mb: 3 }}>
                                    Grupo CAPSUR es una corporación dedicada a transformar el futuro de jóvenes y profesionales a través de una sólida red de institutos superiores, centros de capacitación continua y programas especializados adaptados a la demanda del mercado real.
                                </Typography>
                                <Typography sx={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, mb: 4 }}>
                                    Nuestras instituciones cuentan con respaldo oficial, acreditación institucional y convenios estratégicos para garantizar empleabilidad, titulación y actualización constante.
                                </Typography>

                                {/* Métricas Institucionales */}
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 6, sm: 4 }}>
                                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5, textAlign: 'center', bgcolor: '#f8fafc' }}>
                                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#0056d6' }}>
                                                {allComercios.length || 8}+
                                            </Typography>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>
                                                Marcas Oficiales
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 4 }}>
                                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5, textAlign: 'center', bgcolor: '#f8fafc' }}>
                                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#0056d6' }}>
                                                {stats.totalCarreras + stats.totalDiplomados + stats.totalCursos || 70}+
                                            </Typography>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>
                                                Programas Activos
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5, textAlign: 'center', bgcolor: '#f8fafc' }}>
                                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#0056d6' }}>
                                                100%
                                            </Typography>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>
                                                Acreditación Legal
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Repositorios de Capacitaciones Google Drive */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: { xs: 3, sm: 4 },
                                        borderRadius: 4,
                                        bgcolor: '#f8fbff',
                                        border: '1px solid #dbeafe',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                        <Avatar sx={{ bgcolor: '#0056d6', color: '#fff', width: 44, height: 44 }}>
                                            <FolderSharedIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#09152a' }}>
                                                Repositorios Oficiales de Capacitación
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Acceso centralizado a recursos y grabaciones en Google Drive
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Typography variant="body2" sx={{ color: '#475569', mb: 3.5, lineHeight: 1.6 }}>
                                        Plataforma directa para que estudiantes, docentes y colaboradores accedan a sesiones grabadas, material de estudio y talleres oficiales de nuestras divisiones formativas.
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {/* Botón Capacitación ESCIFOR */}
                                        <Button
                                            variant="contained"
                                            startIcon={<FolderSharedIcon />}
                                            endIcon={<LaunchIcon sx={{ fontSize: 15 }} />}
                                            onClick={() => handleRedirect(driveLinks?.escifor, 'ESCIFOR')}
                                            sx={{
                                                bgcolor: '#0c43a3',
                                                color: '#ffffff',
                                                py: 1.4,
                                                px: 3,
                                                borderRadius: 2.5,
                                                fontWeight: 700,
                                                fontSize: '0.9rem',
                                                textTransform: 'none',
                                                justifyContent: 'space-between',
                                                boxShadow: '0 4px 14px rgba(12, 67, 163, 0.25)',
                                                '&:hover': {
                                                    bgcolor: '#092f73',
                                                },
                                            }}
                                        >
                                            Capacitación ESCIFOR (Google Drive)
                                        </Button>

                                        {/* Botón Capacitación MULTIMARCA */}
                                        <Button
                                            variant="outlined"
                                            startIcon={<FolderSharedIcon />}
                                            endIcon={<LaunchIcon sx={{ fontSize: 15 }} />}
                                            onClick={() => handleRedirect(driveLinks?.multimarca, 'MULTIMARCA')}
                                            sx={{
                                                bgcolor: '#ffffff',
                                                borderColor: '#cbd5e1',
                                                borderWidth: 1.5,
                                                color: '#0f172a',
                                                py: 1.4,
                                                px: 3,
                                                borderRadius: 2.5,
                                                fontWeight: 700,
                                                fontSize: '0.9rem',
                                                textTransform: 'none',
                                                justifyContent: 'space-between',
                                                '&:hover': {
                                                    borderColor: '#94a3b8',
                                                    bgcolor: '#f8fafc',
                                                    borderWidth: 1.5,
                                                },
                                            }}
                                        >
                                            Capacitación MULTIMARCA (Google Drive)
                                        </Button>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {/* 6. Sección: Beneficios de Formarse en Grupo CAPSUR */}
                <Box id="beneficios" sx={{ py: { xs: 7, md: 10 }, bgcolor: '#f8fbff', borderTop: '1px solid #eef2f6', scrollMarginTop: { xs: '65px', md: '75px' } }}>
                    <Container maxWidth="xl">
                        <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto', mb: { xs: 5, md: 7 } }}>
                            <Chip
                                label="VENTAJAS Y GARANTÍAS"
                                size="small"
                                sx={{
                                    bgcolor: 'rgba(0, 86, 214, 0.08)',
                                    color: '#0056d6',
                                    fontWeight: 800,
                                    fontSize: '0.72rem',
                                    letterSpacing: '0.08em',
                                    borderRadius: 99,
                                    mb: 1.5,
                                }}
                            />
                            <Typography
                                variant="h3"
                                sx={{
                                    fontSize: { xs: '2rem', md: '2.8rem' },
                                    fontWeight: 900,
                                    color: '#09152a',
                                    letterSpacing: '-0.025em',
                                    mb: 1.5,
                                }}
                            >
                                Beneficios que potencian tu carrera
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
                                Diseñamos cada experiencia formativa combinando legalidad, práctica profesional e innovación tecnológica.
                            </Typography>
                        </Box>

                        <Grid container spacing={3.5}>
                            {[
                                {
                                    icon: <VerifiedUserIcon sx={{ fontSize: 32, color: '#0056d6' }} />,
                                    title: 'Acreditación y Licenciamiento MINEDU',
                                    desc: 'Resoluciones ministeriales oficiales, códigos ESCALE verificables y títulos a nombre de la nación.',
                                },
                                {
                                    icon: <SchoolIcon sx={{ fontSize: 32, color: '#0056d6' }} />,
                                    title: 'Aulas Virtuales y Soporte 24/7',
                                    desc: 'Campus digital interactivo con materiales actualizados, clases grabadas y acompañamiento docente continuo.',
                                },
                                {
                                    icon: <WorkspacePremiumIcon sx={{ fontSize: 32, color: '#0056d6' }} />,
                                    title: 'Alta Inserción y Prácticas',
                                    desc: 'Convenios estratégicos institucionales y empresariales para asegurar inserción laboral rápida.',
                                },
                                {
                                    icon: <BusinessIcon sx={{ fontSize: 32, color: '#0056d6' }} />,
                                    title: 'Soluciones para Empresas',
                                    desc: 'Planes de capacitación corporativa in-house, seguridad industrial, idiomas y tecnología a medida.',
                                },
                            ].map((beneficio, bIdx) => (
                                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={bIdx}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3.5,
                                            height: '100%',
                                            borderRadius: 3.5,
                                            bgcolor: '#ffffff',
                                            border: '1px solid #e2e8f0',
                                            transition: 'all 0.25s ease',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 12px 28px rgba(0, 86, 214, 0.1)',
                                                borderColor: '#93c5fd',
                                            },
                                        }}
                                    >
                                        <Box sx={{ mb: 2 }}>{beneficio.icon}</Box>
                                        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', mb: 1, color: '#0f172a' }}>
                                            {beneficio.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                                            {beneficio.desc}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>

                {/* 7. Sección Contacto & Footer */}
                <Box id="contacto" sx={{ py: 6, bgcolor: '#09152a', color: '#ffffff', mt: 'auto', scrollMarginTop: { xs: '65px', md: '75px' } }}>
                    <Container maxWidth="xl">
                        <Grid container spacing={4} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                    <Box
                                        component="img"
                                        src="/images/logo-capsur-letra-blanca.png"
                                        alt="Grupo CAPSUR"
                                        sx={{ height: 36, width: 'auto', objectFit: 'contain' }}
                                    />
                                </Box>
                                <Typography variant="body2" sx={{ color: '#94a3b8', maxWidth: 480, lineHeight: 1.6 }}>
                                    Corporación educativa e institucional comprometida con la formación de excelencia técnica, universitaria y profesional en el Perú.
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 700, mb: 0.5 }}>
                                    Plataforma Oficial de Consulta y Acceso Corporativo
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1 }}>
                                    Acreditaciones oficiales MINEDU vigentes.
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#64748b' }}>
                                    © {new Date().getFullYear()} Grupo CAPSUR. Todos los derechos reservados.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
                            
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
            </Box>
        </>
    );
}
