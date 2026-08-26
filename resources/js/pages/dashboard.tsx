import { Head, usePage, Link } from '@inertiajs/react';
import BusinessIcon from '@mui/icons-material/Business';
import LaunchIcon from '@mui/icons-material/Launch';
import StorefrontIcon from '@mui/icons-material/Storefront';
import {
    Avatar,
    Box,
    Button,
    Chip,
    Grid,
    Paper,
    Tooltip,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import PendingInvitationsModal from '@/components/pending-invitations-modal';
import { dashboard } from '@/routes';
import type { DashboardInvitation, Grupo } from '@/types';

type Props = {
    pendingInvitations?: DashboardInvitation[];
    grupos?: Grupo[];
};

// Colores de acento corporativo por grupo
const getGrupoColor = (slug: string): string => {
    switch (slug) {
        case 'escifor':
            return '#0c43a3';
        case 'multimarca':
            return '#059669';
        case 'globalex':
            return '#0284c7';
        default:
            return '#4f46e5';
    }
};

export default function Dashboard({
    pendingInvitations = [],
    grupos = [],
}: Props) {
    const page = usePage();
    const currentTeam = page.props.currentTeam as { slug: string; name: string } | undefined;
    const currentTeamSlug = currentTeam?.slug || 'default';

    const [showInvitations, setShowInvitations] = useState(
        pendingInvitations.length > 0
    );

    return (
        <>
            <Head title="Panel Principal - Grupo Capsur" />

            <PendingInvitationsModal
                invitations={pendingInvitations}
                open={pendingInvitations.length > 0 && showInvitations}
                onOpenChange={setShowInvitations}
            />

            <Box
                sx={{
                    p: { xs: 2, sm: 2.5, md: 3 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 2.5,
                    width: '100%',
                    flex: 1,
                    minHeight: 'calc(100vh - 4.5rem)',
                    boxSizing: 'border-box',
                }}
            >
                {/* CABECERA COMPACTA */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 1.5, sm: 1.8 },
                        px: { xs: 2, sm: 2.5 },
                        borderRadius: 1.5,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: (theme) =>
                            theme.palette.mode === 'dark'
                                ? '0 2px 10px rgba(0,0,0,0.3)'
                                : '0 2px 10px rgba(0,0,0,0.03)',
                        width: '100%',
                        boxSizing: 'border-box',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 1.5,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar
                                sx={{
                                    bgcolor: 'primary.main',
                                    color: '#ffffff',
                                    width: 38,
                                    height: 38,
                                    borderRadius: 1,
                                    boxShadow: '0 2px 8px rgba(12, 67, 163, 0.25)',
                                }}
                            >
                                <StorefrontIcon fontSize="small" />
                            </Avatar>
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 800,
                                            color: 'text.primary',
                                            letterSpacing: '-0.02em',
                                            fontSize: '1.05rem',
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        Comercios e Institutos
                                    </Typography>
                                    <Chip
                                        label="GRUPO CAPSUR"
                                        size="small"
                                        sx={{
                                            bgcolor: (theme) =>
                                                theme.palette.mode === 'dark'
                                                    ? 'rgba(12, 67, 163, 0.25)'
                                                    : 'rgba(12, 67, 163, 0.08)',
                                            color: 'primary.main',
                                            fontWeight: 800,
                                            fontSize: '0.65rem',
                                            height: 20,
                                            borderRadius: 1,
                                            border: '1px solid',
                                            borderColor: (theme) =>
                                                theme.palette.mode === 'dark'
                                                    ? 'rgba(12, 67, 163, 0.4)'
                                                    : 'rgba(12, 67, 163, 0.2)',
                                        }}
                                    />
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.78rem' }}>
                                    Selecciona un comercio para consultar o editar su información institucional y oferta formativa.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>

                {/* CUADRÍCULA DE DIVISIONES */}
                <Grid
                    container
                    spacing={2.5}
                    sx={{
                        width: '100%',
                        m: 0,
                    }}
                >
                    {grupos.map((grupo) => {
                        const brandColor = getGrupoColor(grupo.slug);
                        const comercios = grupo.comercios || [];

                        return (
                            <Grid
                                size={{ xs: 12, md: 4 }}
                                key={grupo.id}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        height: '100%',
                                        p: { xs: 2, sm: 2.5 },
                                        borderRadius: 1.5,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        bgcolor: 'background.paper',
                                        boxShadow: (theme) =>
                                            theme.palette.mode === 'dark'
                                                ? '0 2px 10px rgba(0,0,0,0.3)'
                                                : '0 2px 10px rgba(0,0,0,0.02)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        boxSizing: 'border-box',
                                        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                                        '&:hover': {
                                            borderColor: brandColor,
                                            boxShadow: (theme) =>
                                                theme.palette.mode === 'dark'
                                                    ? '0 4px 20px rgba(0,0,0,0.4)'
                                                    : '0 4px 16px rgba(0,0,0,0.06)',
                                        },
                                    }}
                                >
                                    {/* Acento superior de color institucional */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: 3,
                                            bgcolor: brandColor,
                                        }}
                                    />

                                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        {/* Cabecera del Grupo */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                pb: 1.5,
                                                mb: 2,
                                                borderBottom: '1px solid',
                                                borderColor: 'divider',
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: `${brandColor}15`,
                                                        color: brandColor,
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: 1,
                                                        fontSize: '0.8rem',
                                                        fontWeight: 800,
                                                    }}
                                                >
                                                    <BusinessIcon fontSize="small" />
                                                </Avatar>
                                                <Box>
                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{
                                                            fontWeight: 800,
                                                            letterSpacing: 0.5,
                                                            fontSize: '0.95rem',
                                                            lineHeight: 1.2,
                                                        }}
                                                    >
                                                        {grupo.nombre}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                                                        {comercios.length} {comercios.length === 1 ? 'comercio' : 'comercios'}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Link
                                                href={`/${currentTeamSlug}/admin/comercios?grupo_id=${grupo.id}`}
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <Tooltip title="Ver listado completo del grupo" arrow>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            fontWeight: 700,
                                                            color: brandColor,
                                                            fontSize: '0.72rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 0.4,
                                                            bgcolor: `${brandColor}10`,
                                                            px: 1,
                                                            py: 0.3,
                                                            borderRadius: 1,
                                                            '&:hover': { bgcolor: `${brandColor}20` },
                                                        }}
                                                    >
                                                        <span>Ver todos</span>
                                                        <LaunchIcon sx={{ fontSize: 11 }} />
                                                    </Typography>
                                                </Tooltip>
                                            </Link>
                                        </Box>

                                        {/* Botones de Comercios con Esquinas Finas */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1.2,
                                                mb: 2,
                                            }}
                                        >
                                            {comercios.length > 0 ? (
                                                comercios.map((comercio) => {
                                                    const comColor = comercio.color_hex || brandColor;
                                                    const targetUrl = `/${currentTeamSlug}/admin/comercios/${comercio.id}/edit`;

                                                    return (
                                                        <Link
                                                            key={comercio.id}
                                                            href={targetUrl}
                                                            style={{ textDecoration: 'none' }}
                                                        >
                                                            <Button
                                                                fullWidth
                                                                variant="contained"
                                                                sx={{
                                                                    height: 50,
                                                                    bgcolor: comColor,
                                                                    color: '#ffffff',
                                                                    fontWeight: 800,
                                                                    fontSize: '0.84rem',
                                                                    px: 1.8,
                                                                    borderRadius: 1,
                                                                    textTransform: 'uppercase',
                                                                    letterSpacing: 0.5,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between',
                                                                    boxShadow: `0 2px 8px ${comColor}25`,
                                                                    transition: 'all 0.15s ease-in-out',
                                                                    '&:hover': {
                                                                        bgcolor: comColor,
                                                                        filter: 'brightness(1.1)',
                                                                        transform: 'translateY(-1px)',
                                                                        boxShadow: `0 4px 12px ${comColor}40`,
                                                                    },
                                                                }}
                                                            >
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, minWidth: 0 }}>
                                                                    <Avatar
                                                                        sx={{
                                                                            bgcolor: 'rgba(255, 255, 255, 0.22)',
                                                                            color: '#ffffff',
                                                                            width: 28,
                                                                            height: 28,
                                                                            fontWeight: 900,
                                                                            fontSize: '0.68rem',
                                                                            borderRadius: 0.8,
                                                                            flexShrink: 0,
                                                                        }}
                                                                    >
                                                                        {(comercio.sigla || comercio.nombre.substring(0, 3)).substring(0, 3).toUpperCase()}
                                                                    </Avatar>
                                                                    <Typography sx={{ fontWeight: 800, fontSize: '0.84rem', letterSpacing: 0.4, color: '#ffffff', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                                                        {comercio.nombre}
                                                                    </Typography>
                                                                </Box>
                                                                <LaunchIcon sx={{ fontSize: 14, opacity: 0.85, flexShrink: 0 }} />
                                                            </Button>
                                                        </Link>
                                                    );
                                                })
                                            ) : (
                                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', py: 2, textAlign: 'center' }}>
                                                    Sin comercios registrados.
                                                </Typography>
                                            )}
                                        </Box>

                                        {/* Descripción Corporativa al Pie */}
                                        {grupo.descripcion && (
                                            <Box
                                                sx={{
                                                    mt: 'auto',
                                                    pt: 1.5,
                                                    borderTop: '1px solid',
                                                    borderColor: 'divider',
                                                }}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{
                                                        fontSize: '0.75rem',
                                                        lineHeight: 1.4,
                                                        display: 'block',
                                                    }}
                                                >
                                                    {grupo.descripcion}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
        </>
    );
}

Dashboard.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Panel Principal',
            href: props.currentTeam ? dashboard(props.currentTeam.slug) : '/',
        },
    ],
});
