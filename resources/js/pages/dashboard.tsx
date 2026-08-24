import { Head, usePage, Link } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';
import StorefrontIcon from '@mui/icons-material/Storefront';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    Paper,
} from '@mui/material';
import { useState } from 'react';
import { CarreraDialog } from '@/components/admin/carrera-dialog';
import { ComercioDialog } from '@/components/admin/comercio-dialog';
import { GrupoDialog } from '@/components/admin/grupo-dialog';
import PendingInvitationsModal from '@/components/pending-invitations-modal';
import { dashboard } from '@/routes';
import type { DashboardInvitation, Grupo, CapsurStats } from '@/types';

type Props = {
    pendingInvitations?: DashboardInvitation[];
    grupos?: Grupo[];
    stats?: CapsurStats;
};

export default function Dashboard({
    pendingInvitations = [],
    grupos = [],
    stats = {
        totalGrupos: 0,
        totalComercios: 0,
        totalCarreras: 0,
        carrerasActivas: 0,
        carrerasEnConvocatoria: 0,
    },
}: Props) {
    const page = usePage();
    const currentTeam = page.props.currentTeam as { slug: string; name: string } | undefined;
    const currentTeamSlug = currentTeam?.slug || 'default';

    const [showInvitations, setShowInvitations] = useState(
        pendingInvitations.length > 0
    );

    // Quick Creation Modals
    const [grupoModalOpen, setGrupoModalOpen] = useState(false);
    const [comercioModalOpen, setComercioModalOpen] = useState(false);
    const [carreraModalOpen, setCarreraModalOpen] = useState(false);

    // Extract all comercios for dropdown
    const allComercios = grupos.flatMap((g) => g.comercios || []);

    return (
        <>
            <Head title="Panel de Control - Grupo Capsur" />

            <PendingInvitationsModal
                invitations={pendingInvitations}
                open={pendingInvitations.length > 0 && showInvitations}
                onOpenChange={setShowInvitations}
            />

            <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                {/* Hero Header */}
                <Paper
                    sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 4,
                        p: { xs: 3, sm: 4 },
                        color: '#ffffff',
                        background: 'linear-gradient(135deg, #152844 0%, #0c43a3 60%, #0a1526 100%)',
                        boxShadow: '0 10px 25px -5px rgba(21, 40, 68, 0.5)',
                    }}
                >
                    <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', gap: 3 }}>
                        <Box sx={{ maxWidth: 650 }}>
                            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.5, borderRadius: 5, bgcolor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', mb: 1.5 }}>
                                <AutoAwesomeIcon sx={{ fontSize: 16, color: '#fde047' }} />
                                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                                    Administración de Catálogo Empresarial
                                </Typography>
                            </Box>
                            <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.02em', mb: 1 }}>
                                GRUPO <Box component="span" sx={{ color: '#60a5fa' }}>CAPSUR</Box>
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.6 }}>
                                Gestión centralizada de grupos corporativos, marcas formativas y catálogo de carreras profesionales, especializaciones y cursos.
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setGrupoModalOpen(true)}
                                sx={{ bgcolor: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)' } }}
                            >
                                Grupo
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setComercioModalOpen(true)}
                                sx={{ bgcolor: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)' } }}
                            >
                                Comercio
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={() => setCarreraModalOpen(true)}
                                sx={{ bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' }, fontWeight: 'bold' }}
                            >
                                Programa
                            </Button>
                        </Box>
                    </Box>
                </Paper>

                {/* KPI Metrics */}
                <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                                        Grupos Registrados
                                    </Typography>
                                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.main', color: '#fff', display: 'flex' }}>
                                        <BusinessIcon fontSize="small" />
                                    </Box>
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {stats.totalGrupos}
                                </Typography>
                                <Link
                                    href={`/${currentTeamSlug}/admin/grupos`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <Typography variant="caption" color="primary" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontWeight: 'bold', mt: 1 }}>
                                        <span>Administrar grupos</span>
                                        <ArrowForwardIcon sx={{ fontSize: 12 }} />
                                    </Typography>
                                </Link>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                                        Comercios e Institutos
                                    </Typography>
                                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'success.main', color: '#fff', display: 'flex' }}>
                                        <StorefrontIcon fontSize="small" />
                                    </Box>
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {stats.totalComercios}
                                </Typography>
                                <Link
                                    href={`/${currentTeamSlug}/admin/comercios`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <Typography variant="caption" color="success.main" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontWeight: 'bold', mt: 1 }}>
                                        <span>Ver todas las marcas</span>
                                        <ArrowForwardIcon sx={{ fontSize: 12 }} />
                                    </Typography>
                                </Link>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                                        Programas Académicos
                                    </Typography>
                                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'info.main', color: '#fff', display: 'flex' }}>
                                        <SchoolIcon fontSize="small" />
                                    </Box>
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {stats.totalCarreras}
                                </Typography>
                                <Link
                                    href={`/${currentTeamSlug}/admin/carreras`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <Typography variant="caption" color="info.main" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontWeight: 'bold', mt: 1 }}>
                                        <span>Explorar catálogo</span>
                                        <ArrowForwardIcon sx={{ fontSize: 12 }} />
                                    </Typography>
                                </Link>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                                        Convocatorias Activas
                                    </Typography>
                                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'warning.main', color: '#fff', display: 'flex' }}>
                                        <TrendingUpIcon fontSize="small" />
                                    </Box>
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {stats.carrerasActivas + stats.carrerasEnConvocatoria}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                    {stats.carrerasEnConvocatoria} en periodo de inscripción
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* NUESTROS COMERCIOS - Visual Organigram Map */}
                <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <Box sx={{ p: 2.5, px: 3, borderBottom: 1, borderColor: 'divider', bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                                NUESTROS COMERCIOS
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Mapa organizativo interactivo de marcas e institutos de Grupo Capsur.
                            </Typography>
                        </Box>

                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => setComercioModalOpen(true)}
                        >
                            Añadir Comercio
                        </Button>
                    </Box>

                    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {grupos.map((grupo) => (
                            <Paper
                                key={grupo.id}
                                variant="outlined"
                                sx={{
                                    p: 2.5,
                                    borderRadius: 2.5,
                                    bgcolor: 'background.paper',
                                    transition: 'border-color 0.2s',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                    },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2, borderBottom: 1, borderColor: 'divider' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <BusinessIcon color="primary" fontSize="small" />
                                        <Typography variant="subtitle1" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                            {grupo.nombre}
                                        </Typography>
                                        <Chip
                                            label={`${grupo.comercios?.length || 0} marcas`}
                                            size="small"
                                            variant="outlined"
                                            sx={{ height: 20, fontSize: '0.7rem' }}
                                        />
                                    </Box>

                                    <Link
                                        href={`/${currentTeamSlug}/admin/comercios?grupo_id=${grupo.id}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold', '&:hover': { textDecoration: 'underline' } }}>
                                            Administrar
                                        </Typography>
                                    </Link>
                                </Box>

                                {/* Buttons Grid */}
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, pt: 2.5 }}>
                                    {grupo.comercios && grupo.comercios.length > 0 ? (
                                        grupo.comercios.map((comercio) => {
                                            const brandColor = comercio.color_hex || '#1d4ed8';
                                            const isAcademic =
                                                comercio.slug === 'istp-avanti' ||
                                                comercio.slug === 'istp-sis' ||
                                                comercio.codigo === 'AVANTI' ||
                                                comercio.codigo === 'SIS' ||
                                                (comercio.carreras_count !== undefined && comercio.carreras_count > 0);

                                            const targetUrl = isAcademic
                                                ? `/${currentTeamSlug}/admin/carreras?comercio_id=${comercio.id}`
                                                : `/${currentTeamSlug}/admin/comercios?grupo_id=${grupo.id}`;

                                            return (
                                                <Link
                                                    key={comercio.id}
                                                    href={targetUrl}
                                                    style={{ textDecoration: 'none' }}
                                                >
                                                    <Button
                                                        variant="contained"
                                                        sx={{
                                                            bgcolor: brandColor,
                                                            color: '#ffffff',
                                                            fontWeight: 'bold',
                                                            px: 2,
                                                            py: 1,
                                                            borderRadius: 2,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: 0.5,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1.5,
                                                            '&:hover': {
                                                                bgcolor: brandColor,
                                                                filter: 'brightness(1.1)',
                                                                transform: 'scale(1.04)',
                                                            },
                                                            transition: 'all 0.15s ease-in-out',
                                                        }}
                                                    >
                                                        <span>{comercio.nombre}</span>
                                                        {isAcademic && (
                                                            <Box
                                                                component="span"
                                                                sx={{
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    px: 0.8,
                                                                    py: 0.2,
                                                                    borderRadius: 1,
                                                                    bgcolor: 'rgba(0,0,0,0.3)',
                                                                    fontSize: '0.68rem',
                                                                    fontWeight: 'bold',
                                                                }}
                                                            >
                                                                {comercio.carreras_count || 0} Carreras
                                                            </Box>
                                                        )}
                                                    </Button>
                                                </Link>
                                            );
                                        })
                                    ) : (
                                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', py: 1 }}>
                                            No hay comercios asignados a este grupo aún.
                                        </Typography>
                                    )}
                                </Box>
                            </Paper>
                        ))}
                    </Box>
                </Paper>
            </Box>

            {/* Quick Modals */}
            <GrupoDialog
                open={grupoModalOpen}
                onOpenChange={setGrupoModalOpen}
                currentTeamSlug={currentTeamSlug}
            />

            <ComercioDialog
                open={comercioModalOpen}
                onOpenChange={setComercioModalOpen}
                grupos={grupos}
                currentTeamSlug={currentTeamSlug}
            />

            <CarreraDialog
                open={carreraModalOpen}
                onOpenChange={setCarreraModalOpen}
                comercios={allComercios}
                currentTeamSlug={currentTeamSlug}
            />
        </>
    );
}

Dashboard.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: props.currentTeam ? dashboard(props.currentTeam.slug) : '/',
        },
    ],
});
