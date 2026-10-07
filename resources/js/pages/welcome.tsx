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

    // Detección automática y de alto rendimiento de la sección activa mediante IntersectionObserver (cero reflows, 60/120 FPS)
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const sectionIds = ['inicio', 'marcas', 'directorio-marcas', 'nosotros', 'beneficios', 'contacto'];
        const elements = sectionIds
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null);

        if (elements.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const intersecting = entries.filter((e) => e.isIntersecting);
                if (intersecting.length > 0) {
                    const topSection = intersecting.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                    const id = topSection.target.id;
                    setActiveNav(id === 'directorio-marcas' ? 'marcas' : id);
                }
            },
            {
                rootMargin: '-15% 0px -50% 0px',
                threshold: [0, 0.25, 0.5],
            }
        );

        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
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

    // Navegar y desplazarse suavemente a una sección (acelerado por hardware, no bloqueante)
    const handleNavClick = (sectionId: string) => {
        setActiveNav(sectionId === 'directorio-marcas' ? 'marcas' : sectionId);

        if (sectionId === 'inicio') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const element = document.getElementById(sectionId);
        if (element) {
            const header = document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : 65;
            const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
            const targetOffset = Math.max(0, Math.round(elementTop - headerHeight));

            window.scrollTo({
                top: targetOffset,
                behavior: 'smooth',
            });
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

                {/* 2. Hero Section - Propuesta visual institucional CAPSUR */}
                <Box
                    id="inicio"
                    sx={{
                        position: 'relative',
                        bgcolor: '#08142a',
                        minHeight: { xs: 'calc(100dvh - 65px)', md: 'calc(100dvh - 70px)' },
                        height: { xs: 'auto', md: 'calc(100dvh - 70px)' },
                        display: 'flex',
                        alignItems: 'stretch',
                        overflow: 'hidden',
                        scrollMarginTop: { xs: '65px', md: '75px' },
                    }}
                >
                    {/* Fachada institucional: conserva el tamaño actual y desplaza visualmente el degradado hacia la izquierda */}
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            zIndex: 0,
                            overflow: 'hidden',
                            pointerEvents: 'none',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: { xs: '100%', md: '76%', lg: '72%' },
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
                                    objectPosition: { xs: 'center 18%', md: 'center 20%' },
                                    display: 'block',
                                }}
                            />

                            {/* Transición suave entre el navy y la fotografía */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: {
                                        xs: 'linear-gradient(180deg, rgba(8,20,42,0.78) 0%, rgba(8,20,42,0.28) 48%, rgba(8,20,42,0.05) 100%)',
                                        md: 'linear-gradient(90deg, #08142a 0%, rgba(8,20,42,0.92) 10%, rgba(8,20,42,0.58) 22%, rgba(8,20,42,0.22) 36%, rgba(8,20,42,0.04) 50%, transparent 62%)',
                                    },
                                }}
                            />
                        </Box>

                        {/* Mancha navy lateral para mantener la lectura del contenido */}
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                background: {
                                    xs: 'linear-gradient(180deg, rgba(8,20,42,0.92) 0%, rgba(8,20,42,0.62) 42%, rgba(8,20,42,0.12) 100%)',
                                    md: 'linear-gradient(90deg, #08142a 0%, #08142a 17%, rgba(8,20,42,0.86) 28%, rgba(8,20,42,0.42) 39%, rgba(8,20,42,0.10) 51%, transparent 66%)',
                                },
                            }}
                        />

                        {/* Arcos decorativos muy sutiles inspirados en la referencia */}
                        <Box
                            sx={{
                                position: 'absolute',
                                width: { xs: 320, md: 760 },
                                height: { xs: 320, md: 760 },
                                border: '1px solid rgba(56, 189, 248, 0.16)',
                                borderRadius: '50%',
                                left: { xs: '-45%', md: '31%' },
                                top: { xs: '35%', md: '-58%' },
                                transform: 'rotate(-18deg)',
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                width: { xs: 260, md: 600 },
                                height: { xs: 260, md: 600 },
                                border: '1px solid rgba(56, 189, 248, 0.10)',
                                borderRadius: '50%',
                                left: { xs: '-34%', md: '35%' },
                                top: { xs: '42%', md: '-49%' },
                                transform: 'rotate(-18deg)',
                            }}
                        />
                    </Box>

                    <Container
                        maxWidth="xl"
                        sx={{
                            position: 'relative',
                            zIndex: 2,
                            width: '100%',
                            height: { xs: 'auto', md: '100%' },
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            px: { xs: 2, sm: 4, md: 5, lg: 6 },
                            pb: 0,
                        }}
                    >
                        <Grid
                            container
                            columnSpacing={{ xs: 3, md: 3, lg: 4 }}
                            rowSpacing={0}
                            sx={{
                                alignItems: 'flex-end',
                                justifyContent: 'space-between',
                                width: '100%',
                                height: { xs: 'auto', md: '100%' },
                                mb: 0,
                                pb: 0,
                            }}
                        >
                            {/* Contenido institucional */}
                            <Grid
                                size={{ xs: 12, md: 6, lg: 6 }}
                                sx={{
                                    alignSelf: 'center',
                                    py: { xs: 4, md: 3 },
                                }}
                            >
                                <Box sx={{ maxWidth: 650, position: 'relative', zIndex: 5 }}>
                                    <Box
                                        sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 1.2,
                                            px: 1.7,
                                            py: 0.75,
                                            mb: { xs: 2.2, md: 2.6 },
                                            border: '1px solid rgba(255,255,255,0.22)',
                                            borderRadius: '7px',
                                            bgcolor: 'rgba(8,20,42,0.48)',
                                            backdropFilter: 'blur(10px)',
                                        }}
                                    >
                                        <WorkspacePremiumIcon sx={{ fontSize: 17, color: '#f5b400' }} />
                                        <Box>
                                            <Typography
                                                sx={{
                                                    color: '#fff',
                                                    fontSize: { xs: '0.67rem', md: '0.72rem' },
                                                    fontWeight: 800,
                                                    letterSpacing: '0.12em',
                                                    lineHeight: 1.1,
                                                    textTransform: 'uppercase',
                                                }}
                                            >
                                                Corporación Educativa CAPSUR
                                            </Typography>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.62)', fontSize: '0.69rem', mt: 0.25 }}>
                                                Sede Central Institucional
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Typography
                                        component="h1"
                                        sx={{
                                            color: '#fff',
                                            fontSize: { xs: '2.7rem', sm: '3.5rem', md: '4rem', lg: '4.55rem' },
                                            fontWeight: 850,
                                            lineHeight: 0.98,
                                            letterSpacing: '-0.045em',
                                            mb: 2.4,
                                            textShadow: '0 4px 24px rgba(0,0,0,0.34)',
                                        }}
                                    >
                                        Formación que
                                        <Box component="span" sx={{ display: 'block', color: '#20b9f5' }}>
                                            impulsa tu futuro
                                        </Box>
                                    </Typography>

                                    <Box sx={{ width: { xs: 105, md: 135 }, height: 5, bgcolor: '#20b9f5', borderRadius: 99, mb: 2.7 }} />

                                    <Typography
                                        sx={{
                                            color: 'rgba(255,255,255,0.88)',
                                            fontSize: { xs: '0.98rem', sm: '1.04rem', md: '1.08rem' },
                                            lineHeight: 1.65,
                                            maxWidth: 610,
                                            mb: 3.5,
                                            textShadow: '0 2px 10px rgba(0,0,0,0.35)',
                                        }}
                                    >
                                        Carreras técnicas y superiores, capacitaciones e idiomas, con enfoque práctico, respaldo institucional y orientación al mundo laboral.
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: { xs: 4, md: 4.5 } }}>
                                        <Button
                                            variant="contained"
                                            onClick={() => handleNavClick('marcas')}
                                            endIcon={<ArrowForwardIcon />}
                                            sx={{
                                                bgcolor: '#0869ee',
                                                color: '#fff',
                                                px: { xs: 2.6, md: 3.2 },
                                                py: 1.25,
                                                borderRadius: '7px',
                                                textTransform: 'none',
                                                fontWeight: 800,
                                                fontSize: '0.9rem',
                                                boxShadow: '0 8px 24px rgba(0,105,238,0.30)',
                                                '&:hover': { bgcolor: '#0758c8', transform: 'translateY(-1px)' },
                                            }}
                                        >
                                            Explorar nuestras carreras
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={() => handleNavClick('nosotros')}
                                            startIcon={<PlayArrowIcon />}
                                            sx={{
                                                borderColor: 'rgba(255,255,255,0.35)',
                                                color: '#fff',
                                                bgcolor: 'rgba(255,255,255,0.04)',
                                                backdropFilter: 'blur(8px)',
                                                px: { xs: 2.4, md: 2.8 },
                                                py: 1.25,
                                                borderRadius: '7px',
                                                textTransform: 'none',
                                                fontWeight: 700,
                                                fontSize: '0.9rem',
                                                '&:hover': { borderColor: 'rgba(255,255,255,0.65)', bgcolor: 'rgba(255,255,255,0.08)' },
                                            }}
                                        >
                                            Conoce Grupo CAPSUR
                                        </Button>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'stretch',
                                            width: '100%',
                                            maxWidth: 590,
                                            pt: 2.1,
                                            borderTop: '1px solid rgba(255,255,255,0.18)',
                                        }}
                                    >
                                        {[
                                            { icon: <SchoolIcon />, value: '+7', label: 'instituciones' },
                                            { icon: <DescriptionIcon />, value: '+70', label: 'programas' },
                                            { icon: <WorkspacePremiumIcon />, value: 'Formación', label: 'especializada' },
                                        ].map((item, index) => (
                                            <Box
                                                key={item.label}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1.1,
                                                    flex: 1,
                                                    minWidth: 0,
                                                    px: index === 0 ? 0 : { xs: 1.5, md: 2.5 },
                                                    borderLeft: index === 0 ? 'none' : '1px solid rgba(255,255,255,0.15)',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 38,
                                                        height: 38,
                                                        borderRadius: '50%',
                                                        bgcolor: 'rgba(0,105,238,0.34)',
                                                        border: '1px solid rgba(56,189,248,0.22)',
                                                        color: '#fff',
                                                        display: 'grid',
                                                        placeItems: 'center',
                                                        flexShrink: 0,
                                                        '& svg': { fontSize: 20 },
                                                    }}
                                                >
                                                    {item.icon}
                                                </Box>
                                                <Box sx={{ minWidth: 0 }}>
                                                    <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: { xs: '0.92rem', md: '1rem' }, lineHeight: 1.1 }}>
                                                        {item.value}
                                                    </Typography>
                                                    <Typography sx={{ color: 'rgba(255,255,255,0.68)', fontSize: '0.72rem', mt: 0.3 }}>
                                                        {item.label}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </Grid>

                            {/* Composición visual derecha: fotografía de profesionales pegada a la base del hero */}
                            <Grid
                                size={{ xs: 12, md: 6, lg: 6 }}
                                sx={{
                                    alignSelf: 'flex-end',
                                    display: 'flex',
                                    justifyContent: { xs: 'center', md: 'flex-end' },
                                    alignItems: 'flex-end',
                                    height: { xs: 'auto', md: '100%' },
                                    lineHeight: 0,
                                    m: 0,
                                    pt: 0,
                                    pb: '0 !important',
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        maxWidth: { xs: 480, sm: 540, md: 640, lg: 760 },
                                        display: 'flex',
                                        justifyContent: { xs: 'center', md: 'flex-end' },
                                        alignItems: 'flex-end',
                                        lineHeight: 0,
                                        m: 0,
                                        p: 0,
                                    }}
                                >
                                    {/* Halo de contraste sutil detrás de los profesionales */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            width: { xs: 300, md: 540 },
                                            height: { xs: 300, md: 540 },
                                            borderRadius: '50%',
                                            right: { xs: '5%', md: '2%' },
                                            bottom: 0,
                                            background: 'radial-gradient(circle, rgba(0,119,255,0.28) 0%, rgba(0,119,255,0.06) 50%, transparent 70%)',
                                            pointerEvents: 'none',
                                            zIndex: 1,
                                        }}
                                    />

                                    {/* Fotografía de los profesionales pegada a la base */}
                                    <Box
                                        component="img"
                                        src="/images/profesionales.png"
                                        alt="Profesionales y estudiantes de Grupo CAPSUR"
                                        sx={{
                                            position: 'relative',
                                            zIndex: 2,
                                            display: 'block',
                                            verticalAlign: 'bottom',
                                            width: 'auto',
                                            maxWidth: '100%',
                                            maxHeight: { xs: 380, sm: 460, md: 'calc(100dvh - 85px)', lg: 'calc(100dvh - 80px)' },
                                            height: 'auto',
                                            objectFit: 'contain',
                                            filter: 'drop-shadow(0 16px 30px rgba(0,0,0,0.40))',
                                            lineHeight: 0,
                                            m: 0,
                                            p: 0,
                                        }}
                                    />
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
                                        background: 'radial-gradient(circle at 75% 35%, #1d5ec9 0%, #0d409d 42%, #082d70 80%, #051e4e 100%)',
                                        borderRadius: { xs: '4px', md: '4px 0 0 4px' },
                                    }}
                                >
                                    {/* Sutil sombra de respaldo en la esquina izquierda (detrás de la imagen) */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            inset: 0,
                                            zIndex: 1,
                                            pointerEvents: 'none',
                                            background: 'linear-gradient(90deg, rgba(5, 26, 68, 0.60) 0%, rgba(5, 26, 68, 0.28) 32%, transparent 60%)',
                                        }}
                                    />

                                    {/* Fotografía nítida y luminosa de Atención / Secretaria Grupo CAPSUR */}
                                    <Box
                                        component="img"
                                        src="/images/secretaria-capsur.png"
                                        alt="Atención al Cliente y Orientación - Grupo CAPSUR"
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: { xs: '-4%', sm: '-2%', md: '-1%', lg: '0%' },
                                            width: 'auto',
                                            maxWidth: { xs: '92%', sm: '86%', md: '88%' },
                                            maxHeight: { xs: '88%', sm: '92%', md: '94%' },
                                            objectFit: 'contain',
                                            objectPosition: 'bottom right',
                                            display: 'block',
                                            zIndex: 2,
                                            filter: 'drop-shadow(0 10px 24px rgba(0, 15, 50, 0.35))',
                                            pointerEvents: 'none',
                                        }}
                                    />

                                    {/* Textos destacados sobreimpresos - Margen izquierdo acotado para no tapar el cabello */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: { xs: 24, md: 34 },
                                            left: { xs: 24, md: 36 },
                                            maxWidth: { xs: 180, sm: 210, md: 220 },
                                            color: '#fff',
                                            zIndex: 3,
                                        }}
                                    >
                                        {/* Badge institucional moderno */}
                                        <Box
                                            sx={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 0.8,
                                                px: 1.2,
                                                py: 0.45,
                                                borderRadius: '6px',
                                                bgcolor: 'rgba(255, 255, 255, 0.14)',
                                                backdropFilter: 'blur(8px)',
                                                border: '1px solid rgba(255, 255, 255, 0.24)',
                                                mb: 1.5,
                                            }}
                                        >
                                            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#38bdf8' }} />
                                            <Typography
                                                sx={{
                                                    fontSize: '0.68rem',
                                                    fontWeight: 800,
                                                    letterSpacing: '0.14em',
                                                    textTransform: 'uppercase',
                                                    color: '#fff',
                                                    lineHeight: 1,
                                                }}
                                            >
                                                Grupo CAPSUR
                                            </Typography>
                                        </Box>

                                        <Typography
                                            sx={{
                                                fontSize: { xs: '1.25rem', sm: '1.45rem', md: '1.6rem' },
                                                fontWeight: 800,
                                                lineHeight: 1.15,
                                                letterSpacing: '-0.025em',
                                                textShadow: '0 2px 10px rgba(0, 18, 50, 0.5)',
                                                color: '#fff',
                                            }}
                                        >
                                            {contact.bannerTitle}
                                        </Typography>
                                    </Box>

                                    {/* Subtítulo institucional en píldora translúcida con icono */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: { xs: 18, md: 24 },
                                            left: { xs: 20, md: 28 },
                                            zIndex: 3,
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 0.9,
                                            px: 1.5,
                                            py: 0.7,
                                            borderRadius: '8px',
                                            bgcolor: 'rgba(5, 23, 62, 0.68)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255, 255, 255, 0.14)',
                                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.22)',
                                        }}
                                    >
                                        <LocationOnIcon sx={{ fontSize: 15, color: '#38bdf8', flexShrink: 0 }} />
                                        <Typography
                                            sx={{
                                                fontSize: { xs: '0.72rem', md: '0.76rem' },
                                                fontWeight: 700,
                                                color: '#ffffff',
                                                letterSpacing: '0.01em',
                                                lineHeight: 1.2,
                                            }}
                                        >
                                            {contact.bannerSubtitle}
                                        </Typography>
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
