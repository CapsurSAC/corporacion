import { Head, Link, usePage } from '@inertiajs/react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BusinessIcon from '@mui/icons-material/Business';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    Grid,
    Chip,
    Paper,
} from '@mui/material';
import AppLogo from '@/components/app-logo';
import { dashboard, login } from '@/routes';

const GRUPOS_DESTACADOS = [
    {
        nombre: 'ESCIFOR',
        color: '#1d4ed8',
        descripcion: 'Formación profesional tecnológica y capacitación ejecutiva.',
        marcas: [
            { nombre: 'ISTP SIS', sigla: 'SIS', color: '#1d4ed8' },
            { nombre: 'ISTP AVANTI', sigla: 'AVANTI', color: '#dc2626' },
            { nombre: 'NEXT-ONLINE', sigla: 'NEXT', color: '#78350f' },
            { nombre: 'MAGISTER', sigla: 'MAGISTER', color: '#3b82f6' },
        ],
    },
    {
        nombre: 'MULTIMARCA',
        color: '#16a34a',
        descripcion: 'Especializaciones técnicas en seguridad, minería y gestión operativa.',
        marcas: [
            { nombre: 'CECAVA', sigla: 'CECAVA', color: '#16a34a' },
            { nombre: 'CECAVA-MIN', sigla: 'CMIN', color: '#ca8a04' },
            { nombre: 'MATPEL', sigla: 'MATPEL', color: '#ea580c' },
        ],
    },
    {
        nombre: 'GLOBALEX',
        color: '#0284c7',
        descripcion: 'Programas de alta especialización y desarrollo formativo.',
        marcas: [
            { nombre: 'ISTP GLOBALEX', sigla: 'GLOBALEX', color: '#0284c7' },
        ],
    },
    {
        nombre: 'IGE',
        color: '#d97706',
        descripcion: 'Instituto de gestión empresarial y desarrollo profesional.',
        marcas: [
            { nombre: 'ISTP IGE', sigla: 'IGE', color: '#d97706' },
        ],
    },
];

export default function Welcome() {
    const { auth, currentTeam } = usePage().props;
    const dashboardUrl = currentTeam ? dashboard(currentTeam.slug) : '/';

    return (
        <>
            <Head title="Bienvenido a Grupo Capsur - Catálogo Corporativo" />

            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
                {/* Navbar */}
                <Box
                    component="header"
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        py: 2,
                        px: { xs: 2, sm: 4 },
                    }}
                >
                    <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <AppLogo />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {auth.user ? (
                                <Link href={dashboardUrl} style={{ textDecoration: 'none' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{ px: 2.5 }}
                                    >
                                        Ir al Panel de Control
                                    </Button>
                                </Link>
                            ) : (
                                <Link href={login()} style={{ textDecoration: 'none' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ px: 3 }}
                                    >
                                        Iniciar Sesión
                                    </Button>
                                </Link>
                            )}
                        </Box>
                    </Container>
                </Box>

                {/* Hero Banner */}
                <Box
                    sx={{
                        py: { xs: 8, md: 12 },
                        background: 'linear-gradient(135deg, #152844 0%, #0c43a3 60%, #0a1526 100%)',
                        color: '#ffffff',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                        <Chip
                            icon={<VerifiedUserIcon sx={{ color: '#54d8ee !important' }} />}
                            label="Consorcio Educativo & Catálogo Institucional"
                            sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.12)',
                                color: '#ffffff',
                                fontWeight: 'bold',
                                mb: 3,
                                backdropFilter: 'blur(6px)',
                            }}
                        />

                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 900,
                                letterSpacing: '-0.02em',
                                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                                mb: 2,
                            }}
                        >
                            GRUPO <Box component="span" sx={{ color: '#60a5fa' }}>CAPSUR</Box>
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.85)',
                                fontWeight: 400,
                                lineHeight: 1.6,
                                mb: 5,
                                maxWidth: 700,
                                mx: 'auto',
                            }}
                        >
                            Plataforma centralizada de administración para grupos corporativos, marcas de educación tecnológica y catálogo de programas acreditados por MINEDU.
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
                            <Link href={auth.user ? dashboardUrl : login()} style={{ textDecoration: 'none' }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                        bgcolor: '#2563eb',
                                        '&:hover': { bgcolor: '#1d4ed8' },
                                        fontWeight: 'bold',
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 3,
                                    }}
                                >
                                    {auth.user ? 'Acceder al Catálogo' : 'Ingresar al Sistema'}
                                </Button>
                            </Link>
                        </Box>
                    </Container>
                </Box>

                {/* Features Section */}
                <Container maxWidth="lg" sx={{ py: 8, flex: 1 }}>
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography variant="overline" color="primary" sx={{ fontWeight: 'bold', letterSpacing: 1.5 }}>
                            ESTRUCTURA ORGANIZACIONAL
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                            Nuestros Grupos y Marcas Formativas
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mt: 1 }}>
                            Cada unidad opera bajo resoluciones oficiales, acreditación ESCALE MINEDU y plataformas digitales de última generación.
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {GRUPOS_DESTACADOS.map((grupo) => (
                            <Grid size={{ xs: 12, md: 6 }} key={grupo.nombre}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        p: 3,
                                        borderRadius: 3,
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            boxShadow: 3,
                                            borderColor: 'primary.main',
                                        },
                                    }}
                                >
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Box
                                                    sx={{
                                                        width: 36,
                                                        height: 36,
                                                        borderRadius: 2,
                                                        bgcolor: `${grupo.color}15`,
                                                        color: grupo.color,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <BusinessIcon fontSize="small" />
                                                </Box>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                    {grupo.nombre}
                                                </Typography>
                                            </Box>
                                            <Chip label="División Capsur" size="small" variant="outlined" />
                                        </Box>

                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                            {grupo.descripcion}
                                        </Typography>

                                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                            Institutos y Marcas:
                                        </Typography>

                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {grupo.marcas.map((marca) => (
                                                <Chip
                                                    key={marca.nombre}
                                                    label={marca.nombre}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: marca.color,
                                                        color: '#ffffff',
                                                        fontWeight: 'bold',
                                                        fontSize: '0.75rem',
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Stats Box */}
                    <Paper
                        variant="outlined"
                        sx={{
                            mt: 6,
                            p: 4,
                            borderRadius: 3,
                            bgcolor: 'action.hover',
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            gap: 3,
                            textAlign: 'center',
                        }}
                    >
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                4
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Grupos Corporativos
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                9+
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Comercios e Institutos
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                                100%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Conectividad Digital & MINEDU
                            </Typography>
                        </Box>
                    </Paper>
                </Container>

                {/* Footer */}
                <Box
                    component="footer"
                    sx={{
                        py: 3,
                        px: 2,
                        borderTop: 1,
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="caption" color="text.secondary">
                        © {new Date().getFullYear()} Grupo Capsur. Todos los derechos reservados.
                    </Typography>
                </Box>
            </Box>
        </>
    );
}
