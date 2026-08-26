import { Head, Link, usePage } from '@inertiajs/react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import DomainIcon from '@mui/icons-material/Domain';
import LanguageIcon from '@mui/icons-material/Language';
import LaunchIcon from '@mui/icons-material/Launch';
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
import { useState, useMemo } from 'react';
import AppLogo from '@/components/app-logo';
import AcademicOfferExplorer from '@/components/catalog/academic-offer-explorer';
import ComercioDetailModal from '@/components/catalog/comercio-detail-modal';
import LoginPopover from '@/components/login-popover';
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
    };
    initialComercio?: Comercio | null;
}

export default function Welcome({
    grupos = [],
    stats = {
        totalGrupos: 3,
        totalComercios: 8,
        totalCarreras: 5,
        totalDiplomados: 37,
        totalCursos: 34,
    },
    initialComercio = null,
}: WelcomeProps) {
    const page = usePage();
    const auth = (page.props.auth || {}) as { user?: any };
    const currentTeam = page.props.currentTeam as { slug: string } | undefined;
    const dashboardUrl = currentTeam ? dashboard(currentTeam.slug) : '/';

    // Estado del Popover de inicio de sesión para el administrador
    const [loginAnchorEl, setLoginAnchorEl] = useState<HTMLButtonElement | null>(null);

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

                // Búsqueda profunda en carreras, diplomados y cursos del comercio
                const matchCarreras = com.carreras?.some((c) => c.nombre.toLowerCase().includes(term));
                const matchDiplomados = com.diplomados?.some((d) => d.nombre.toLowerCase().includes(term));
                const matchCursos = com.cursos?.some((cur) => cur.nombre.toLowerCase().includes(term));

                if (
                    !matchNombre &&
                    !matchSigla &&
                    !matchGrupo &&
                    !matchEscale &&
                    !matchResolucion &&
                    !matchCarreras &&
                    !matchDiplomados &&
                    !matchCursos
                ) {
                    return false;
                }
            }

            return true;
        });
    }, [allComercios, selectedGrupoId, searchQuery]);

    const totalProgramas = stats.totalCarreras + stats.totalDiplomados + stats.totalCursos;

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

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {auth.user ? (
                                <Link href={dashboardUrl} style={{ textDecoration: 'none' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{ px: 2.5, fontWeight: 700 }}
                                    >
                                        Ir al Panel de Control
                                    </Button>
                                </Link>
                            ) : (
                                <Tooltip title="Acceso exclusivo para el administrador del sistema" arrow>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={handleOpenLogin}
                                        sx={{ px: 2.5, fontWeight: 700 }}
                                    >
                                        Iniciar Sesión
                                    </Button>
                                </Tooltip>
                            )}
                        </Box>
                    </Container>
                </Box>

                {/* Hero Banner Corporativo de Consulta */}
                <Box
                    sx={{
                        pt: { xs: 6, md: 8 },
                        pb: { xs: 6, md: 7 },
                        background: 'linear-gradient(135deg, #0f1f38 0%, #0c43a3 55%, #081426 100%)',
                        color: '#ffffff',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                        <Chip
                            icon={<VerifiedUserIcon sx={{ color: '#54d8ee !important' }} />}
                            label="Consorcio Educativo & Catálogo de Marcas Acreditadas MINEDU"
                            sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.12)',
                                color: '#ffffff',
                                fontWeight: 'bold',
                                mb: 2.5,
                                backdropFilter: 'blur(6px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                        />

                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 900,
                                letterSpacing: '-0.02em',
                                fontSize: { xs: '2.2rem', sm: '3.2rem', md: '3.8rem' },
                                mb: 1.5,
                            }}
                        >
                            GRUPO <Box component="span" sx={{ color: '#60a5fa' }}>CAPSUR</Box>
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontWeight: 400,
                                lineHeight: 1.6,
                                mb: 4,
                                maxWidth: 780,
                                mx: 'auto',
                                fontSize: { xs: '1rem', md: '1.15rem' },
                            }}
                        >
                            Portal de consulta corporativa para colaboradores. Información institucional, códigos ESCALE MINEDU, resoluciones oficiales, aulas virtuales y oferta académica de todas nuestras marcas.
                        </Typography>

                        {/* Buscador Rápido en el Hero */}
                        <Box sx={{ maxWidth: 680, mx: 'auto', mb: 3 }}>
                            <TextField
                                fullWidth
                                placeholder="Buscar por marca, carrera, diplomado, curso o código ESCALE..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                sx={{
                                    bgcolor: 'rgba(255, 255, 255, 0.96)',
                                    borderRadius: 2.5,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2.5,
                                        height: 54,
                                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
                                        color: '#0f172a',
                                    },
                                }}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon color="primary" sx={{ ml: 1, mr: 0.5 }} />
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

                        {/* Indicadores en vivo */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                flexWrap: 'wrap',
                                gap: { xs: 1.5, sm: 3 },
                                pt: 1,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <DomainIcon sx={{ fontSize: 18, color: '#60a5fa' }} />
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.95)', fontWeight: 700 }}>
                                    {stats.totalGrupos} Grupos Corporativos
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <StorefrontIcon sx={{ fontSize: 18, color: '#34d399' }} />
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.95)', fontWeight: 700 }}>
                                    {stats.totalComercios} Marcas Institucionales
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <SchoolIcon sx={{ fontSize: 18, color: '#facc15' }} />
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.95)', fontWeight: 700 }}>
                                    {stats.totalCarreras} Carreras Acreditadas
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <WorkspacePremiumIcon sx={{ fontSize: 18, color: '#a78bfa' }} />
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.95)', fontWeight: 700 }}>
                                    {stats.totalDiplomados} Diplomados
                                </Typography>
                            </Box>
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
                                        No se encontraron comercios ni marcas
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                                        Intenta borrar el término de búsqueda o selecciona otro grupo corporativo.
                                    </Typography>
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
                                </Paper>
                            ) : (
                                <Grid container spacing={3}>
                                    {filteredComercios.map((comercio) => {
                                        const brandColor = comercio.color_hex || '#0c43a3';
                                        const carrerasCount = comercio.carreras?.length || comercio.carreras_count || 0;
                                        const diplomadosCount = comercio.diplomados?.length || comercio.diplomados_count || 0;
                                        const cursosCount = comercio.cursos?.length || comercio.cursos_count || 0;

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
                                                                    <VerifiedUserIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                                                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                                                        ESCALE:{' '}
                                                                        <Box component="span" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                                                            {comercio.escale_minedu}
                                                                        </Box>
                                                                    </Typography>
                                                                </Box>
                                                            )}

                                                            {comercio.resolucion_creacion && (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                                                    <Typography variant="caption" noWrap sx={{ fontWeight: 700 }}>
                                                                        R. Creación:{' '}
                                                                        <Box component="span" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                                                            {comercio.resolucion_creacion}
                                                                        </Box>
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                        </Box>

                                                        <Divider sx={{ mb: 2 }} />

                                                        {/* Píldoras de Oferta Académica */}
                                                        <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                                                            <Chip
                                                                label={`${carrerasCount} Carreras`}
                                                                size="small"
                                                                variant="outlined"
                                                                color={carrerasCount > 0 ? 'primary' : 'default'}
                                                                sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                                                            />
                                                            <Chip
                                                                label={`${diplomadosCount} Diplomados`}
                                                                size="small"
                                                                variant="outlined"
                                                                color={diplomadosCount > 0 ? 'secondary' : 'default'}
                                                                sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                                                            />
                                                            <Chip
                                                                label={`${cursosCount} Cursos`}
                                                                size="small"
                                                                variant="outlined"
                                                                color={cursosCount > 0 ? 'success' : 'default'}
                                                                sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                                                            />
                                                        </Box>
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
                                                                        sx={{ color: 'text.secondary', '&:hover': { color: 'info.main' } }}
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
