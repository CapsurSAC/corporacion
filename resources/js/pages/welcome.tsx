import { Head, Link, usePage } from '@inertiajs/react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BusinessIcon from '@mui/icons-material/Business';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ClearIcon from '@mui/icons-material/Clear';
import DescriptionIcon from '@mui/icons-material/Description';
import DirectionsIcon from '@mui/icons-material/Directions';
import EmailIcon from '@mui/icons-material/Email';
import EngineeringIcon from '@mui/icons-material/Engineering';
import FlightIcon from '@mui/icons-material/Flight';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import LanguageIcon from '@mui/icons-material/Language';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import LaunchIcon from '@mui/icons-material/Launch';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MapIcon from '@mui/icons-material/Map';
import CloseIcon from '@mui/icons-material/Close';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import PhoneIcon from '@mui/icons-material/Phone';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import StorefrontIcon from '@mui/icons-material/Storefront';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
import BrandsCoverflowCarousel, { CoverflowBrandItem } from '@/components/catalog/brands-coverflow-carousel';
import ComercioDetailModal from '@/components/catalog/comercio-detail-modal';
import LoginPopover from '@/components/login-popover';
import { useNotification } from '@/hooks/use-notification';
import type { Comercio, ContactInfo, Grupo } from '@/types';

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
    contactInfo?: ContactInfo;
}

const NAV_ITEMS = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'nosotros', label: 'Nosotros' },
    { id: 'marcas', label: 'Nuestras marcas' },
    { id: 'beneficios', label: 'Beneficios' },
    { id: 'contacto', label: 'Contacto' },
];


// Encabezado institucional unificado para todas las secciones de contenido.
// El hero mantiene su propio lenguaje visual y no utiliza este componente.
const SectionHeader = ({
    eyebrow,
    title,
    description,
}: {
    eyebrow: string;
    title: string;
    description: string;
}) => (
    <Box
        sx={{
            textAlign: 'center',
            maxWidth: 900,
            mx: 'auto',
            mb: { xs: 4.5, md: 6 },
        }}
    >
        <Box
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.25,
                mb: 1.75,
                color: '#0056d6',
            }}
        >
            <Box sx={{ width: { xs: 24, md: 34 }, height: 2, bgcolor: '#0056d6', borderRadius: 1 }} />
            <Typography
                component="span"
                sx={{
                    fontSize: { xs: '0.68rem', md: '0.72rem' },
                    fontWeight: 800,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: '#0056d6',
                    lineHeight: 1,
                }}
            >
                {eyebrow}
            </Typography>
            <Box sx={{ width: { xs: 24, md: 34 }, height: 2, bgcolor: '#0056d6', borderRadius: 1 }} />
        </Box>
        <Typography
            component="h2"
            sx={{
                fontSize: { xs: '2rem', sm: '2.45rem', md: '3rem' },
                fontWeight: 850,
                color: '#09152a',
                letterSpacing: '-0.035em',
                lineHeight: 1.08,
                mb: 1.6,
            }}
        >
            {title}
        </Typography>
        <Typography
            sx={{
                color: '#64748b',
                fontSize: { xs: '0.98rem', md: '1.06rem' },
                lineHeight: 1.65,
                maxWidth: 820,
                mx: 'auto',
            }}
        >
            {description}
        </Typography>
    </Box>
);

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
    contactInfo,
}: WelcomeProps) {
    const page = usePage();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const { notify } = useNotification();
    const auth = (page.props.auth || {}) as { user?: any };
    const dashboardUrl = auth.user ? '/dashboard' : '/';

    // Información institucional de contacto oficial
    const contact = useMemo(() => {
        const address = contactInfo?.address || 'Av. Coronel Justo Arias Aragüez N° 1111';
        const addressDetail = contactInfo?.addressDetail || 'Tacna, Perú — Edificio Corporativo Grupo CAPSUR';
        const phone = contactInfo?.phone || '+51 963 147 270';
        const phoneDetail = contactInfo?.phoneDetail || 'Matrículas, carreras y certificaciones técnicas';
        const whatsapp = contactInfo?.whatsapp || phone;
        const whatsappMessage = contactInfo?.whatsappMessage || 'Hola, deseo más información sobre los programas de Grupo CAPSUR';
        const email = contactInfo?.email || 'contacto@grupocapsur.edu.pe';
        const emailDetail = contactInfo?.emailDetail || 'Consultas corporativas';
        const schedule = contactInfo?.schedule || 'Lun - Sáb · 8:00 AM – 7:00 PM';
        const scheduleDetail = contactInfo?.scheduleDetail || 'Atención continua';
        const mapsUrl = contactInfo?.mapsUrl || 'https://www.google.com/maps/search/?api=1&query=Av.+Coronel+Justo+Arias+Arag%C3%BCez+1111,+Tacna,+Per%C3%BA';
        const mapsEmbedUrl = contactInfo?.mapsEmbedUrl || 'https://maps.google.com/maps?q=Av.+Coronel+Justo+Arias+Arag%C3%BCez+1111,+Tacna,+Per%C3%BA&t=&z=16&ie=UTF8&iwloc=&output=embed';
        const bannerTitle = contactInfo?.bannerTitle || 'Educación que genera oportunidades';
        const bannerSubtitle = contactInfo?.bannerSubtitle || 'Sede Central Institucional · Tacna, Perú';

        const rawWa = (whatsapp || '').replace(/\D+/g, '');
        const cleanWa = rawWa.length === 9 && rawWa.startsWith('9') ? `51${rawWa}` : rawWa;
        const whatsappHref = cleanWa ? `https://wa.me/${cleanWa}?text=${encodeURIComponent(whatsappMessage)}` : '#';

        return {
            address,
            addressDetail,
            phone,
            phoneDetail,
            whatsapp,
            whatsappMessage,
            whatsappHref,
            email,
            emailDetail,
            schedule,
            scheduleDetail,
            mapsUrl,
            mapsEmbedUrl,
            bannerTitle,
            bannerSubtitle,
        };
    }, [contactInfo]);

    // Navegación activa en la barra superior
    const [activeNav, setActiveNav] = useState('inicio');

    // Popover de inicio de sesión administrativo
    const [loginAnchorEl, setLoginAnchorEl] = useState<HTMLButtonElement | null>(null);

    // Modal de detalle de comercio
    const [selectedComercio, setSelectedComercio] = useState<Comercio | null>(initialComercio);
    const [detailModalOpen, setDetailModalOpen] = useState<boolean>(Boolean(initialComercio));

    // Modal para visualizar mapa interactivo de ubicación
    const [mapModalOpen, setMapModalOpen] = useState<boolean>(false);


    // Filtros del directorio de marcas
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGrupoId, setSelectedGrupoId] = useState<number | 'all'>('all');

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
                    const sectionIds = ['inicio', 'marcas', 'directorio-marcas', 'nosotros', 'beneficios', 'contacto'];

                    for (let i = sectionIds.length - 1; i >= 0; i--) {
                        const id = sectionIds[i];
                        const el = document.getElementById(id);
                        if (el) {
                            const top = el.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop);
                            if (scrollPos >= top - 20) {
                                setActiveNav(id === 'directorio-marcas' ? 'marcas' : id);
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

    // Manejar interacción y selección de marca desde el carrusel 3D Cover Flow
    const handleCoverflowBrandSelect = (brand: CoverflowBrandItem) => {
        const queryTerm = brand.sigla || brand.name;
        const found = allComercios.find(
            (c) =>
                c.nombre.toLowerCase().includes(queryTerm.toLowerCase()) ||
                (c.sigla && c.sigla.toLowerCase().includes(queryTerm.toLowerCase()))
        );

        if (found) {
            handleOpenComercioDetail(found);
        } else {
            setSearchQuery(brand.sigla);
            handleNavClick('directorio-marcas');
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
                        minHeight: { xs: 'calc(100dvh - 65px)', md: 'calc(100dvh - 70px)' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        px: { xs: 2, sm: 3, md: 5, lg: 6 },
                        height:'100vh',
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
                        {/* Contenedor de la Imagen con Difuminado Progresivo */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: { xs: '100%', md: '75%', lg: '70%' },
                                height: '100%',
                            }}
                        >
                            <Box
                                component="img"
                                src="/images/fachada-capsur.jpeg"
                                alt="Fachada Institucional Sede Central Grupo CAPSUR"
                                sx={{
                                    width: '100%',
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

                            {/* Difuminado directo sobre el borde izquierdo de la foto:
                                Inicia en #08142a 100% sólido para fundirse de forma invisible con el fondo */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: {
                                        xs: 'none',
                                        md: 'linear-gradient(to right, #08142a 0%, rgba(8, 20, 42, 0.92) 8%, rgba(8, 20, 42, 0.62) 20%, rgba(8, 20, 42, 0.28) 36%, rgba(8, 20, 42, 0.08) 50%, transparent 64%)',
                                    },
                                }}
                            />
                        </Box>

                        {/* Sombreado Direccional General: Asegura contraste legible para textos y botones */}
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                background: {
                                    xs: 'linear-gradient(180deg, rgba(8, 20, 42, 0.95) 0%, rgba(8, 20, 42, 0.75) 45%, rgba(8, 20, 42, 0.20) 100%)',
                                    md: 'linear-gradient(90deg, #08142a 0%, #08142a 18%, rgba(8, 20, 42, 0.90) 28%, rgba(8, 20, 42, 0.62) 38%, rgba(8, 20, 42, 0.28) 49%, rgba(8, 20, 42, 0.08) 60%, transparent 72%)',
                                },
                            }}
                        />
                    </Box>

                    <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, width: '100%', py: { xs: 2, md: 0 }, px: { xs: 2, sm: 3 } }}>
                        {/* Contenido Hero: Textual (Izquierda) + Composición Visual de Profesionales (Derecha) */}
                        <Grid container spacing={{ xs: 4, lg: 5 }} sx={{ alignItems: 'center' }}>
                            {/* Columna Izquierda: Información Institucional, Copywriting, CTAs */}
                            <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                                <Box sx={{ maxWidth: 600 }}>
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

                            {/* Columna Derecha: Profesionales */}
                            <Grid
                                size={{ xs: 12, md: 6, lg: 6 }}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
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
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                 
                                </Box>
                            </Grid>
                        </Grid>

                    </Container>
                </Box>

                {/* 3. Nueva Sección: Carrusel de Marcas (3D Cover Flow) */}
                <BrandsCoverflowCarousel onSelectBrand={handleCoverflowBrandSelect} />

                {/* 4. Sección: Directorio de Nuestras Marcas e Instituciones */}
                <Box
                    id="directorio-marcas"
                    sx={{
                        pt: { xs: 6, md: 8 },
                        pb: { xs: 6, md: 9 },
                        bgcolor: '#fafcff',
                        borderBottom: '1px solid #eef2f6',
                        scrollMarginTop: { xs: '65px', md: '75px' },
                    }}
                >
                    <Container maxWidth={false} sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 } }}>
                        <SectionHeader
                            eyebrow="Portafolio oficial"
                            title="Nuestras Marcas e Instituciones"
                            description="Explora cada una de nuestras instituciones acreditadas, resoluciones oficiales MINEDU, carreras profesionales y plataformas de formación."
                        />

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
                    <Container maxWidth={false} sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 } }}>
                        <SectionHeader
                            eyebrow="Sobre nosotros"
                            title="Impulsando el talento con excelencia y cobertura nacional"
                            description="Una sólida red de instituciones y programas de formación orientados al desarrollo profesional y a las necesidades del mundo laboral."
                        />
                        <Grid container spacing={5} sx={{ alignItems: 'center' }}>
                            <Grid size={{ xs: 12, md: 6 }}>
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
                    <Container maxWidth={false} sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 } }}>
                        <SectionHeader
                            eyebrow="Ventajas y garantías"
                            title="Beneficios que potencian tu carrera"
                            description="Diseñamos cada experiencia formativa combinando respaldo institucional, práctica profesional e innovación tecnológica."
                        />

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

               
                {/* 7. Sección Contacto - Diseño editorial institucional */}
                <Box
                    id="contacto"
                    sx={{
                        py: { xs: 7, md: 10 },
                        bgcolor: '#f8fbff',
                        borderTop: '1px solid #e2e8f0',
                        scrollMarginTop: { xs: '65px', md: '75px' },
                        overflow: 'hidden',
                    }}
                >
                    <Container
                        maxWidth={false}
                        sx={{
                            width: '100%',
                            px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
                        }}
                    >
                        <SectionHeader
                            eyebrow="Contacto institucional"
                            title="Estamos aquí para atenderte"
                            description="Encuentra nuestra sede central y utiliza nuestros canales oficiales para recibir orientación sobre admisiones, programas académicos, certificaciones y servicios corporativos."
                        />

                        {/* Composición inspirada en una portada editorial: imagen + información */}
                        <Grid container spacing={{ xs: 3, md: 0 }} sx={{ mb: { xs: 3, md: 4 } }}>
                            {/* Imagen institucional */}
                            <Grid size={{ xs: 12, md: 5.2 }}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: { xs: 340, sm: 400, md: 500 },
                                        overflow: 'hidden',
                                        background: 'radial-gradient(ellipse at 85% 20%, #1754b5 0%, #0c43a3 50%, #051d4d 100%)',
                                        borderRadius: { xs: '4px', md: '4px 0 0 4px' },
                                    }}
                                >
                                    {/* Fotografía de Atención / Secretaria Grupo CAPSUR */}
                                    <Box
                                        component="img"
                                        src="/images/secretaria-capsur.png"
                                        alt="Atención al Cliente y Orientación - Grupo CAPSUR"
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: { xs: '-6%', sm: '-2%', md: '0%' },
                                            width: { xs: '100%', sm: '88%', md: '92%' },
                                            maxHeight: { xs: '84%', sm: '86%', md: '90%' },
                                            objectFit: 'contain',
                                            objectPosition: 'bottom right',
                                            display: 'block',
                                            zIndex: 1,
                                            filter: 'drop-shadow(0 14px 28px rgba(0, 0, 0, 0.45))',
                                            pointerEvents: 'none',
                                        }}
                                    />

                                    {/* Scrim gradiente para garantizar legibilidad de textos */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            inset: 0,
                                            zIndex: 2,
                                            pointerEvents: 'none',
                                            background: {
                                                xs: 'linear-gradient(to bottom, rgba(5, 29, 77, 0.9) 0%, rgba(5, 29, 77, 0.4) 45%, rgba(5, 29, 77, 0.88) 100%)',
                                                md: 'linear-gradient(105deg, rgba(5, 29, 77, 0.92) 0%, rgba(5, 29, 77, 0.65) 45%, rgba(5, 29, 77, 0.1) 75%)',
                                            },
                                        }}
                                    />

                                    {/* Textos destacados sobreimpresos */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: { xs: 28, md: 42 },
                                            left: { xs: 28, md: 46 },
                                            right: 28,
                                            color: '#fff',
                                            zIndex: 3,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '0.72rem',
                                                fontWeight: 800,
                                                letterSpacing: '0.18em',
                                                textTransform: 'uppercase',
                                                opacity: 0.9,
                                                mb: 1.5,
                                            }}
                                        >
                                            Grupo CAPSUR
                                        </Typography>
                                        <Box sx={{ width: 64, height: 2, bgcolor: '#38bdf8', mb: 2 }} />
                                        <Typography
                                            sx={{
                                                fontSize: { xs: '1.65rem', md: '2.25rem' },
                                                fontWeight: 800,
                                                lineHeight: 1.08,
                                                letterSpacing: '-0.03em',
                                                maxWidth: 390,
                                            }}
                                        >
                                            {contact.bannerTitle}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: { xs: 24, md: 34 },
                                            left: { xs: 28, md: 46 },
                                            right: { xs: 28, md: 46 },
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-end',
                                            color: '#fff',
                                            zIndex: 3,
                                        }}
                                    >
                                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, opacity: 0.85, maxWidth: 250, lineHeight: 1.5 }}>
                                            {contact.bannerSubtitle}
                                        </Typography>
                                        <Box sx={{ width: 52, height: 3, bgcolor: '#38bdf8' }} />
                                    </Box>
                                </Box>
                            </Grid>

                            {/* Información institucional */}
                            <Grid size={{ xs: 12, md: 6.8 }}>
                                <Box
                                    sx={{
                                        height: { md: 500 },
                                        bgcolor: '#ffffff',
                                        border: '1px solid #dbe4ef',
                                        borderLeft: { md: 'none' },
                                        borderRadius: { xs: '4px', md: '0 4px 4px 0' },
                                        p: { xs: 3, sm: 4, md: 5 },
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: '#0056d6',
                                            fontSize: '0.72rem',
                                            fontWeight: 800,
                                            letterSpacing: '0.16em',
                                            textTransform: 'uppercase',
                                            mb: 1.2,
                                        }}
                                    >
                                        Canales oficiales
                                    </Typography>
                                    <Typography
                                        component="h3"
                                        sx={{
                                            color: '#09152a',
                                            fontSize: { xs: '1.65rem', md: '2.15rem' },
                                            fontWeight: 800,
                                            letterSpacing: '-0.03em',
                                            lineHeight: 1.12,
                                            mb: 3.2,
                                        }}
                                    >
                                        Conecta con Grupo CAPSUR
                                    </Typography>

                                    <Grid container spacing={{ xs: 2.5, md: 3.5 }}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Box sx={{ borderTop: '2px solid', borderColor: 'primary.main', pt: 1.5 }}>
                                                <Typography sx={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', mb: 0.7 }}>
                                                    Sede central
                                                </Typography>
                                                <Typography sx={{ color: '#0f172a', fontWeight: 750, fontSize: '0.98rem', lineHeight: 1.45 }}>
                                                    {contact.address}
                                                </Typography>
                                                <Typography sx={{ color: '#64748b', fontSize: '0.82rem', mt: 0.35 }}>
                                                    {contact.addressDetail}
                                                </Typography>
                                                <Button
                                                    size="small"
                                                    startIcon={<LocationOnIcon sx={{ fontSize: 15 }} />}
                                                    onClick={() => setMapModalOpen(true)}
                                                    sx={{
                                                        mt: 0.8,
                                                        p: 0,
                                                        textTransform: 'none',
                                                        fontWeight: 750,
                                                        fontSize: '0.78rem',
                                                        color: 'primary.main',
                                                        justifyContent: 'flex-start',
                                                        minWidth: 0,
                                                        '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                                                    }}
                                                >
                                                    Ver ubicación en el mapa
                                                </Button>
                                            </Box>
                                        </Grid>

                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Box sx={{ borderTop: '2px solid #0056d6', pt: 1.5 }}>
                                                <Typography sx={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', mb: 0.7 }}>
                                                    Atención e informes
                                                </Typography>
                                                <Typography sx={{ color: '#0f172a', fontWeight: 800, fontSize: '1rem' }}>
                                                    {contact.phone}
                                                </Typography>
                                                <Typography sx={{ color: '#64748b', fontSize: '0.82rem', mt: 0.35 }}>
                                                    {contact.phoneDetail}
                                                </Typography>
                                            </Box>
                                        </Grid>

                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Box sx={{ borderTop: '1px solid #e2e8f0', pt: 1.8 }}>
                                                <Typography sx={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', mb: 0.7 }}>
                                                    Correo institucional
                                                </Typography>
                                                <Typography sx={{ color: '#0f172a', fontWeight: 700, fontSize: '0.88rem' }}>
                                                    {contact.email}
                                                </Typography>
                                                <Typography sx={{ color: '#64748b', fontSize: '0.78rem', mt: 0.3 }}>
                                                    {contact.emailDetail}
                                                </Typography>
                                            </Box>
                                        </Grid>

                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Box sx={{ borderTop: '1px solid #e2e8f0', pt: 1.8 }}>
                                                <Typography sx={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', mb: 0.7 }}>
                                                    Horario de atención
                                                </Typography>
                                                <Typography sx={{ color: '#0f172a', fontWeight: 700, fontSize: '0.88rem' }}>
                                                    {contact.schedule}
                                                </Typography>
                                                <Typography sx={{ color: '#64748b', fontSize: '0.78rem', mt: 0.3 }}>
                                                    {contact.scheduleDetail}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 3.5 }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<WhatsAppIcon sx={{ fontSize: 19 }} />}
                                            endIcon={<ArrowForwardIcon sx={{ fontSize: 17 }} />}
                                            href={contact.whatsappHref}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                px: 2.5,
                                                py: 1.1,
                                                borderRadius: 1,
                                                textTransform: 'none',
                                                fontWeight: 750,
                                                boxShadow: 'none',
                                            }}
                                        >
                                            Escribir a WhatsApp
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            startIcon={<MapIcon sx={{ fontSize: 18 }} />}
                                            onClick={() => setMapModalOpen(true)}
                                            sx={{
                                                px: 2.5,
                                                py: 1.1,
                                                borderRadius: 1,
                                                textTransform: 'none',
                                                fontWeight: 700,
                                            }}
                                        >
                                            Ver Mapa de Ubicación
                                        </Button>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>

                        {/* Modal Interactivo con Mapa de Ubicación */}
                        <Dialog
                            open={mapModalOpen}
                            onClose={() => setMapModalOpen(false)}
                            maxWidth="md"
                            fullWidth
                            slotProps={{
                                paper: {
                                    sx: {
                                        borderRadius: 2.5,
                                        overflow: 'hidden',
                                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
                                    },
                                },
                            }}
                        >
                            <DialogTitle
                                sx={{
                                    m: 0,
                                    p: { xs: 2, sm: 2.5 },
                                    bgcolor: 'background.paper',
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 1.5,
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: 'primary.main',
                                            color: '#ffffff',
                                            width: 40,
                                            height: 40,
                                            borderRadius: 1,
                                            boxShadow: '0 2px 8px rgba(12, 67, 163, 0.25)',
                                        }}
                                    >
                                        <LocationOnIcon fontSize="small" />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: { xs: '1rem', sm: '1.1rem' }, lineHeight: 1.2 }}>
                                            Ubicación de nuestra sede central
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', mt: 0.2 }}>
                                            {contact.address}{contact.addressDetail ? ` · ${contact.addressDetail}` : ''}
                                        </Typography>
                                    </Box>
                                </Box>
                                <IconButton
                                    aria-label="Cerrar modal de mapa"
                                    onClick={() => setMapModalOpen(false)}
                                    size="small"
                                    sx={{
                                        color: 'text.secondary',
                                        '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
                                    }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </DialogTitle>

                            <DialogContent
                                sx={{
                                    p: 0,
                                    height: { xs: 350, sm: 440, md: 520 },
                                    position: 'relative',
                                    bgcolor: '#f1f5f9',
                                }}
                            >
                                {contact.mapsEmbedUrl ? (
                                    <iframe
                                        title="Ubicación en Google Maps de Grupo CAPSUR"
                                        src={contact.mapsEmbedUrl}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0, position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                ) : (
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', p: 3 }}>
                                        <Typography color="text.secondary">No se ha configurado la URL del mapa interactivo.</Typography>
                                    </Box>
                                )}
                            </DialogContent>

                            <DialogActions
                                sx={{
                                    px: { xs: 2, sm: 2.5 },
                                    py: 1.8,
                                    borderTop: '1px solid',
                                    borderColor: 'divider',
                                    bgcolor: 'background.paper',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: 1.5,
                                }}
                            >
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    endIcon={<LaunchIcon sx={{ fontSize: 16 }} />}
                                    href={contact.mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 1 }}
                                >
                                    Abrir en la aplicación de Google Maps
                                </Button>
                                <Button
                                    onClick={() => setMapModalOpen(false)}
                                    color="inherit"
                                    variant="text"
                                    sx={{ textTransform: 'none', fontWeight: 700 }}
                                >
                                    Cerrar
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Container>
                </Box>

                {/* 8. Footer Corporativo */}
                <Box sx={{ py: 6, bgcolor: '#08142a', color: '#ffffff', mt: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
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
                                    Corporación educativa e institucional comprometida con la formación de excelencia técnica, superior y profesional en el sur del Perú.
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
