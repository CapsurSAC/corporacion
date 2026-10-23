import AccountTreeIcon from '@mui/icons-material/AccountTree';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LanguageIcon from '@mui/icons-material/Language';
import LaunchIcon from '@mui/icons-material/Launch';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { catalogActionButtonStyles, hexToRgba } from '@/components/catalog/catalog-action-button-styles';
import GoogleDriveIcon from '@/components/google-drive-icon';
import { useAppearance } from '@/hooks/use-appearance';
import { getDriveDirectImageUrl, isGoogleDriveUrl, isHttpUrl } from '@/lib/utils';
import {
    Avatar,
    Box,
    Button,
    Card,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
import type { Comercio } from '@/types';

interface ComercioDetailModalProps {
    open: boolean;
    comercio: Comercio | null;
    onClose: () => void;
}

/**
 * Limpia el contenido para evitar mostrar URLs crudas al cliente,
 * devolviendo un texto amigable y profesional.
 */
function cleanTextOrFallback(value: string | null | undefined, fallback: string): string {
    if (!value) return fallback;
    const trimmed = value.trim();
    if (/^(https?:\/\/|www\.)/i.test(trimmed)) {
        return fallback;
    }
    const withoutUrls = trimmed.replace(/(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+)/gi, '').trim();
    return withoutUrls.length > 5 ? withoutUrls : fallback;
}

/**
 * Extrae la primera URL de una cadena de texto, si existe.
 */
function extractFirstUrl(value: string | null | undefined): string | null {
    if (!value) return null;
    const match = value.match(/(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+)/i);
    if (!match) return null;
    const url = match[0];
    return url.startsWith('http') ? url : `https://${url}`;
}

/**
 * Genera un título legible para un canal o video de YouTube sin mostrar el enlace crudo.
 */
function getYouTubeLabel(url: string, index: number): string {
    if (url.includes('@') || url.includes('/channel/') || url.includes('/c/')) {
        return 'Canal Oficial en YouTube';
    }
    return `Video Institucional Informativo ${index > 0 ? `#${index + 1}` : ''}`.trim();
}

export default function ComercioDetailModal({
    open,
    comercio,
    onClose,
}: ComercioDetailModalProps) {
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    const [currentTab, setCurrentTab] = useState(0);
    const [offerSearch, setOfferSearch] = useState('');
    const [offerTypeFilter, setOfferTypeFilter] = useState<'all' | 'carreras' | 'especialidades' | 'diplomados' | 'cursos'>('all');
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    if (!comercio) return null;

    // Paleta de colores adaptativa a modo oscuro y color institucional del comercio
    const brandColor = comercio.color_hex || '#dc2626';
    const primaryBtnSx = catalogActionButtonStyles(brandColor, 'primary');
    const secondaryBtnSx = catalogActionButtonStyles(brandColor, 'secondary');

    // Tokens de color para modo oscuro vs claro
    const dialogBg = isDark ? '#0b1320' : '#ffffff';
    const cardBg = isDark ? '#132235' : '#ffffff';
    const cardBorder = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';
    const textPrimary = isDark ? '#f8fafc' : '#0f172a';
    const textSecondary = isDark ? '#94a3b8' : '#64748b';
    const footerBg = isDark ? '#0d1726' : '#fafbfc';

    const cardBaseSx = {
        borderRadius: 3,
        bgcolor: cardBg,
        borderColor: cardBorder,
        color: textPrimary,
        transition: 'all 0.25s ease',
        'html.dark &': {
            backgroundColor: '#132235 !important',
            borderColor: 'rgba(255, 255, 255, 0.1) !important',
            color: '#f8fafc !important',
        },
    };

    const carreras = comercio.carreras || [];
    const especialidades = comercio.especialidades || [];
    const diplomados = comercio.diplomados || [];
    const cursos = comercio.cursos || [];
    const totalOffers = carreras.length + especialidades.length + diplomados.length + cursos.length;

    // Filtros de oferta formativa
    const filteredCarreras = useMemo(() => {
        if (offerTypeFilter !== 'all' && offerTypeFilter !== 'carreras') return [];
        return carreras.filter((c) =>
            c.nombre.toLowerCase().includes(offerSearch.toLowerCase()) ||
            (c.codigo && c.codigo.toLowerCase().includes(offerSearch.toLowerCase())) ||
            (c.modalidad && c.modalidad.toLowerCase().includes(offerSearch.toLowerCase()))
        );
    }, [carreras, offerSearch, offerTypeFilter]);

    const filteredEspecialidades = useMemo(() => {
        if (offerTypeFilter !== 'all' && offerTypeFilter !== 'especialidades') return [];
        return especialidades.filter((e) =>
            e.nombre.toLowerCase().includes(offerSearch.toLowerCase()) ||
            (e.rubro?.nombre && e.rubro.nombre.toLowerCase().includes(offerSearch.toLowerCase()))
        );
    }, [especialidades, offerSearch, offerTypeFilter]);

    const filteredDiplomados = useMemo(() => {
        if (offerTypeFilter !== 'all' && offerTypeFilter !== 'diplomados') return [];
        return diplomados.filter((d) =>
            d.nombre.toLowerCase().includes(offerSearch.toLowerCase()) ||
            (d.tipo && d.tipo.toLowerCase().includes(offerSearch.toLowerCase()))
        );
    }, [diplomados, offerSearch, offerTypeFilter]);

    const filteredCursos = useMemo(() => {
        if (offerTypeFilter !== 'all' && offerTypeFilter !== 'cursos') return [];
        return cursos.filter((c) =>
            c.nombre.toLowerCase().includes(offerSearch.toLowerCase()) ||
            (c.tipo && c.tipo.toLowerCase().includes(offerSearch.toLowerCase()))
        );
    }, [cursos, offerSearch, offerTypeFilter]);

    const totalFiltered = filteredCarreras.length + filteredEspecialidades.length + filteredDiplomados.length + filteredCursos.length;

    const logoSrc = isDark && comercio.logo_modo_oscuro ? comercio.logo_modo_oscuro : (comercio.logo_modo_claro || comercio.logo_modo_oscuro);

    // Detección de URLs para evitar links crudos
    const escaleIsUrl = isHttpUrl(comercio.escale_minedu);
    const escaleUrl = comercio.link_directo_escale || (escaleIsUrl ? comercio.escale_minedu : null);
    const escaleCode = !escaleIsUrl && comercio.escale_minedu ? comercio.escale_minedu.trim() : null;

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="md"
                fullWidth
                scroll="paper"
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: { xs: 2.5, sm: 3.5 },
                            overflow: 'hidden',
                            position: 'relative',
                            maxHeight: { xs: '94vh', sm: '90vh' },
                            bgcolor: dialogBg,
                            color: textPrimary,
                            boxShadow: '0 24px 64px -12px rgba(0, 0, 0, 0.45)',
                            border: '1px solid',
                            borderColor: cardBorder,
                            'html.dark &': {
                                backgroundColor: '#0b1320 !important',
                                color: '#f8fafc !important',
                                borderColor: 'rgba(255, 255, 255, 0.1) !important',
                            },
                        },
                    },
                }}
            >
                {/* Barra superior con color de marca */}
                <Box
                    sx={{
                        height: 5,
                        width: '100%',
                        bgcolor: brandColor,
                        boxShadow: `0 2px 10px ${hexToRgba(brandColor, 0.45)}`,
                    }}
                />

                {/* Encabezado Principal Institucional */}
                <DialogTitle
                    sx={{
                        p: { xs: 2.5, sm: 3.5 },
                        pb: { xs: 2, sm: 2.5 },
                        background: isDark
                            ? `linear-gradient(135deg, ${hexToRgba(brandColor, 0.22)} 0%, #0d1726 100%)`
                            : `linear-gradient(135deg, ${hexToRgba(brandColor, 0.08)} 0%, ${hexToRgba(brandColor, 0.02)} 60%, rgba(255, 255, 255, 0.7) 100%)`,
                        borderBottom: '1px solid',
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : hexToRgba(brandColor, 0.15),
                        display: 'flex',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        justifyContent: 'space-between',
                        gap: 2,
                        'html.dark &': {
                            background: `linear-gradient(135deg, ${hexToRgba(brandColor, 0.22)} 0%, #0d1726 100%) !important`,
                            borderColor: 'rgba(255, 255, 255, 0.1) !important',
                        },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2.2 }, minWidth: 0 }}>
                        {/* Logotipo de la Institución */}
                        {logoSrc ? (
                            <Box
                                sx={{
                                    height: { xs: 48, sm: 56 },
                                    width: { xs: 48, sm: 56 },
                                    p: 0.8,
                                    borderRadius: 2.5,
                                    bgcolor: isDark && comercio.logo_modo_oscuro ? 'rgba(255, 255, 255, 0.06)' : '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                                    border: '1px solid',
                                    borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)',
                                }}
                            >
                                <Box
                                    component="img"
                                    src={logoSrc}
                                    alt={comercio.nombre}
                                    sx={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain',
                                    }}
                                />
                            </Box>
                        ) : (
                            <Avatar
                                sx={{
                                    width: { xs: 48, sm: 56 },
                                    height: { xs: 48, sm: 56 },
                                    borderRadius: 2.5,
                                    bgcolor: brandColor,
                                    color: '#ffffff',
                                    fontWeight: 900,
                                    fontSize: '1.2rem',
                                    boxShadow: `0 4px 14px ${hexToRgba(brandColor, 0.35)}`,
                                    flexShrink: 0,
                                }}
                            >
                                {(comercio.sigla || comercio.nombre.substring(0, 2)).toUpperCase()}
                            </Avatar>
                        )}

                        <Box sx={{ minWidth: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 800,
                                        letterSpacing: '-0.02em',
                                        fontSize: { xs: '1.2rem', sm: '1.4rem' },
                                        lineHeight: 1.25,
                                        color: textPrimary,
                                        'html.dark &': { color: '#f8fafc !important' },
                                    }}
                                >
                                    {comercio.nombre}
                                </Typography>

                                {comercio.sigla && (
                                    <Chip
                                        label={comercio.sigla}
                                        size="small"
                                        sx={{
                                            bgcolor: brandColor,
                                            color: '#ffffff',
                                            fontWeight: 800,
                                            fontSize: '0.72rem',
                                            height: 22,
                                            boxShadow: `0 2px 8px ${hexToRgba(brandColor, 0.3)}`,
                                        }}
                                    />
                                )}
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mt: 0.6, flexWrap: 'wrap' }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontWeight: 700,
                                        color: brandColor,
                                        bgcolor: hexToRgba(brandColor, isDark ? 0.2 : 0.1),
                                        px: 1,
                                        py: 0.3,
                                        borderRadius: '6px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        fontSize: '0.74rem',
                                    }}
                                >
                                    {comercio.grupo?.nombre ? `División ${comercio.grupo.nombre}` : 'Grupo Capsur'}
                                </Typography>

                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.6,
                                        fontSize: '0.74rem',
                                        fontWeight: 600,
                                        color: textSecondary,
                                        'html.dark &': { color: '#94a3b8 !important' },
                                    }}
                                >
                                    <VerifiedUserIcon sx={{ fontSize: 14, color: brandColor }} />
                                    Portal Informativo Institucional
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Botón de Cerrar */}
                    <Tooltip title="Cerrar ventana" arrow>
                        <IconButton
                            onClick={onClose}
                            size="small"
                            aria-label="Cerrar información institucional"
                            sx={{
                                color: textSecondary,
                                bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                                '&:hover': {
                                    bgcolor: hexToRgba(brandColor, 0.2),
                                    color: brandColor,
                                    transform: 'rotate(90deg)',
                                },
                                transition: 'all 0.25s ease',
                                width: 36,
                                height: 36,
                                flexShrink: 0,
                                'html.dark &': {
                                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                                    color: '#cbd5e1',
                                },
                            }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </DialogTitle>

                {/* Navegación por Pestañas */}
                <Box
                    sx={{
                        borderBottom: '1px solid',
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'divider',
                        px: { xs: 1.5, sm: 3.5 },
                        bgcolor: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(0, 0, 0, 0.015)',
                        'html.dark &': {
                            backgroundColor: 'rgba(15, 23, 42, 0.7) !important',
                            borderColor: 'rgba(255, 255, 255, 0.08) !important',
                        },
                    }}
                >
                    <Tabs
                        value={currentTab}
                        onChange={(_, val) => setCurrentTab(val)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            minHeight: 50,
                            '& .MuiTabs-indicator': {
                                bgcolor: brandColor,
                                height: 3,
                                borderRadius: '3px 3px 0 0',
                                boxShadow: `0 2px 8px ${hexToRgba(brandColor, 0.45)}`,
                            },
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.88rem',
                                minHeight: 50,
                                px: { xs: 1.8, sm: 2.5 },
                                color: textSecondary,
                                transition: 'all 0.2s',
                                '&:hover': {
                                    color: brandColor,
                                    bgcolor: hexToRgba(brandColor, 0.08),
                                },
                                '&.Mui-selected': {
                                    color: `${brandColor} !important`,
                                    fontWeight: 800,
                                },
                                'html.dark &': {
                                    color: '#94a3b8',
                                    '&.Mui-selected': { color: `${brandColor} !important` },
                                },
                            },
                        }}
                    >
                        <Tab icon={<BusinessIcon sx={{ fontSize: 19 }} />} iconPosition="start" label="Identidad & Medios" />
                        <Tab icon={<VerifiedUserIcon sx={{ fontSize: 19 }} />} iconPosition="start" label="Acreditación MINEDU" />
                        <Tab
                            icon={<SchoolIcon sx={{ fontSize: 19 }} />}
                            iconPosition="start"
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                    <span>Oferta Formativa</span>
                                    <Chip
                                        label={totalOffers}
                                        size="small"
                                        sx={{
                                            height: 20,
                                            fontSize: '0.7rem',
                                            fontWeight: 800,
                                            bgcolor: currentTab === 2 ? brandColor : hexToRgba(brandColor, isDark ? 0.25 : 0.12),
                                            color: currentTab === 2 ? '#ffffff' : (isDark ? '#f87171' : brandColor),
                                            cursor: 'pointer',
                                        }}
                                    />
                                </Box>
                            }
                        />
                        <Tab icon={<MenuBookIcon sx={{ fontSize: 19 }} />} iconPosition="start" label="Enlaces & Descargas" />
                    </Tabs>
                </Box>

                {/* Contenido Principal con Espaciado Generoso y Soporte Total Modo Oscuro */}
                <DialogContent
                    sx={{
                        p: { xs: 2.5, sm: 3.5 },
                        py: { xs: 3, sm: 3.5 },
                        bgcolor: dialogBg,
                        color: textPrimary,
                        'html.dark &': {
                            backgroundColor: '#0b1320 !important',
                            color: '#f8fafc !important',
                        },
                        '&::-webkit-scrollbar': { width: 6 },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                            borderRadius: 3,
                        },
                    }}
                >
                    {/* ========================================================================= */}
                    {/* PESTAÑA 0: IDENTIDAD & MEDIOS */}
                    {/* ========================================================================= */}
                    {currentTab === 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                            {/* Presentación institucional y Guía de acceso al aula virtual */}
                            {(comercio.descripcion || comercio.como_ingresar_plataforma) && (
                                <Grid container spacing={2.5} sx={{ alignItems: 'stretch' }}>
                                    {comercio.descripcion && (
                                        <Grid size={{ xs: 12, sm: comercio.como_ingresar_plataforma ? 6 : 12 }}>
                                            <Paper
                                                variant="outlined"
                                                sx={{
                                                    ...cardBaseSx,
                                                    p: { xs: 2.5, sm: 3 },
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between',
                                                    boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.25)' : '0 2px 12px rgba(0, 0, 0, 0.03)',
                                                    '&:hover': {
                                                        borderColor: hexToRgba(brandColor, 0.45),
                                                        boxShadow: `0 6px 20px ${hexToRgba(brandColor, 0.12)}`,
                                                    },
                                                }}
                                            >
                                                <Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.4, mb: 2 }}>
                                                        <Avatar
                                                            sx={{
                                                                width: 36,
                                                                height: 36,
                                                                bgcolor: hexToRgba(brandColor, isDark ? 0.22 : 0.12),
                                                                color: isDark ? '#f87171' : brandColor,
                                                            }}
                                                        >
                                                            <BusinessIcon sx={{ fontSize: 20 }} />
                                                        </Avatar>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: '0.98rem', color: textPrimary, 'html.dark &': { color: '#f8fafc' } }}>
                                                            Sobre la Institución
                                                        </Typography>
                                                    </Box>

                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            lineHeight: 1.65,
                                                            fontSize: '0.86rem',
                                                            mb: 2.5,
                                                            color: textSecondary,
                                                            'html.dark &': { color: '#cbd5e1' },
                                                        }}
                                                    >
                                                        {cleanTextOrFallback(
                                                            comercio.descripcion,
                                                            'Conoce la propuesta formativa, misión y trayectoria educativa de nuestra institución orientada a la excelencia profesional y técnica.'
                                                        )}
                                                    </Typography>
                                                </Box>

                                                {extractFirstUrl(comercio.descripcion) && (
                                                    <Box sx={{ pt: 1.5, borderTop: '1px solid', borderColor: cardBorder }}>
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            disableElevation
                                                            component="a"
                                                            href={extractFirstUrl(comercio.descripcion)!}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            endIcon={<LaunchIcon sx={{ fontSize: '15px !important' }} />}
                                                            sx={primaryBtnSx}
                                                        >
                                                            Conocer la Institución
                                                        </Button>
                                                    </Box>
                                                )}
                                            </Paper>
                                        </Grid>
                                    )}

                                    {comercio.como_ingresar_plataforma && (
                                        <Grid size={{ xs: 12, sm: comercio.descripcion ? 6 : 12 }}>
                                            <Paper
                                                variant="outlined"
                                                sx={{
                                                    p: { xs: 2.5, sm: 3 },
                                                    borderRadius: 3,
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between',
                                                    bgcolor: isDark ? hexToRgba(brandColor, 0.12) : hexToRgba(brandColor, 0.03),
                                                    borderColor: hexToRgba(brandColor, 0.4),
                                                    boxShadow: `0 2px 12px ${hexToRgba(brandColor, 0.08)}`,
                                                    transition: 'all 0.25s ease',
                                                    'html.dark &': {
                                                        backgroundColor: `${hexToRgba(brandColor, 0.14)} !important`,
                                                        borderColor: `${hexToRgba(brandColor, 0.5)} !important`,
                                                    },
                                                    '&:hover': {
                                                        borderColor: brandColor,
                                                        boxShadow: `0 6px 20px ${hexToRgba(brandColor, 0.16)}`,
                                                    },
                                                }}
                                            >
                                                <Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 2 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.4 }}>
                                                            <Avatar
                                                                sx={{
                                                                    width: 36,
                                                                    height: 36,
                                                                    bgcolor: hexToRgba(brandColor, isDark ? 0.25 : 0.15),
                                                                    color: isDark ? '#f87171' : brandColor,
                                                                }}
                                                            >
                                                                <InfoOutlinedIcon sx={{ fontSize: 20 }} />
                                                            </Avatar>
                                                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: isDark ? '#f87171' : brandColor, fontSize: '0.98rem' }}>
                                                                ¿Cómo ingresar al Aula Virtual?
                                                            </Typography>
                                                        </Box>
                                                        <Chip
                                                            label="Guía del Alumno"
                                                            size="small"
                                                            sx={{
                                                                bgcolor: hexToRgba(brandColor, isDark ? 0.25 : 0.15),
                                                                color: isDark ? '#f87171' : brandColor,
                                                                fontWeight: 800,
                                                                fontSize: '0.68rem',
                                                                height: 22,
                                                            }}
                                                        />
                                                    </Box>

                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            lineHeight: 1.65,
                                                            fontSize: '0.86rem',
                                                            mb: 2.5,
                                                            color: isDark ? '#cbd5e1' : textSecondary,
                                                            'html.dark &': { color: '#cbd5e1' },
                                                        }}
                                                    >
                                                        {cleanTextOrFallback(
                                                            comercio.como_ingresar_plataforma,
                                                            'Consulta los pasos oficiales para ingresar con tu usuario y contraseña institucional a tus clases virtuales, recursos y evaluaciones.'
                                                        )}
                                                    </Typography>
                                                </Box>

                                                {extractFirstUrl(comercio.como_ingresar_plataforma) && (
                                                    <Box sx={{ pt: 1.5, borderTop: '1px solid', borderColor: hexToRgba(brandColor, 0.25) }}>
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            disableElevation
                                                            component="a"
                                                            href={extractFirstUrl(comercio.como_ingresar_plataforma)!}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            endIcon={<LaunchIcon sx={{ fontSize: '15px !important' }} />}
                                                            sx={primaryBtnSx}
                                                        >
                                                            Ver Guía de Acceso
                                                        </Button>
                                                    </Box>
                                                )}
                                            </Paper>
                                        </Grid>
                                    )}
                                </Grid>
                            )}

                            {/* Portales y Aulas Digitales */}
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
                                    <Box sx={{ width: 4, height: 18, bgcolor: brandColor, borderRadius: 2 }} />
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            fontWeight: 800,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.06em',
                                            fontSize: '0.8rem',
                                            color: textSecondary,
                                            'html.dark &': { color: '#94a3b8' },
                                        }}
                                    >
                                        Portales y Aulas Digitales
                                    </Typography>
                                </Box>

                                <Grid container spacing={2.5}>
                                    {comercio.pagina_web && (
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Card
                                                variant="outlined"
                                                sx={{
                                                    ...cardBaseSx,
                                                    p: { xs: 2.2, sm: 2.5 },
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    gap: 2,
                                                    boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.25)' : 'none',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: `0 6px 20px ${hexToRgba(brandColor, 0.15)}`,
                                                        borderColor: hexToRgba(brandColor, 0.45),
                                                    },
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8, minWidth: 0 }}>
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: hexToRgba(brandColor, isDark ? 0.2 : 0.12),
                                                            color: isDark ? '#f87171' : brandColor,
                                                            width: 46,
                                                            height: 46,
                                                            borderRadius: 2.5,
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        <LanguageIcon />
                                                    </Avatar>
                                                    <Box sx={{ minWidth: 0 }}>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.92rem', color: textPrimary, 'html.dark &': { color: '#f8fafc' } }} noWrap>
                                                            Página Web Oficial
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ display: 'block', mt: 0.2, color: textSecondary, 'html.dark &': { color: '#94a3b8' } }} noWrap>
                                                            Sitio institucional con información oficial
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    disableElevation
                                                    component="a"
                                                    href={comercio.pagina_web}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    endIcon={<LaunchIcon sx={{ fontSize: '15px !important' }} />}
                                                    sx={primaryBtnSx}
                                                >
                                                    Visitar Sitio
                                                </Button>
                                            </Card>
                                        </Grid>
                                    )}

                                    {comercio.plataforma_carrera && (
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Card
                                                variant="outlined"
                                                sx={{
                                                    ...cardBaseSx,
                                                    p: { xs: 2.2, sm: 2.5 },
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    gap: 2,
                                                    boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.25)' : 'none',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: `0 6px 20px ${hexToRgba(brandColor, 0.15)}`,
                                                        borderColor: hexToRgba(brandColor, 0.45),
                                                    },
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8, minWidth: 0 }}>
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: isGoogleDriveUrl(comercio.plataforma_carrera)
                                                                ? 'rgba(38, 132, 252, 0.18)'
                                                                : hexToRgba(brandColor, isDark ? 0.2 : 0.12),
                                                            color: isGoogleDriveUrl(comercio.plataforma_carrera)
                                                                ? '#38bdf8'
                                                                : (isDark ? '#f87171' : brandColor),
                                                            width: 46,
                                                            height: 46,
                                                            borderRadius: 2.5,
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        {isGoogleDriveUrl(comercio.plataforma_carrera) ? (
                                                            <GoogleDriveIcon size={24} />
                                                        ) : (
                                                            <SchoolIcon />
                                                        )}
                                                    </Avatar>
                                                    <Box sx={{ minWidth: 0 }}>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.92rem', color: textPrimary, 'html.dark &': { color: '#f8fafc' } }} noWrap>
                                                            Plataforma / Aula Virtual
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ display: 'block', mt: 0.2, color: textSecondary, 'html.dark &': { color: '#94a3b8' } }} noWrap>
                                                            {isGoogleDriveUrl(comercio.plataforma_carrera) ? 'Carpeta de recursos en Google Drive' : 'Entorno virtual de aprendizaje'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    disableElevation
                                                    component="a"
                                                    href={comercio.plataforma_carrera}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    startIcon={isGoogleDriveUrl(comercio.plataforma_carrera) ? <GoogleDriveIcon size={16} /> : undefined}
                                                    endIcon={<LaunchIcon sx={{ fontSize: '15px !important' }} />}
                                                    sx={primaryBtnSx}
                                                >
                                                    Ingresar al Aula
                                                </Button>
                                            </Card>
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>

                            {/* Reconocimientos, Convenios y Promoción Vigente */}
                            <Grid container spacing={2.5}>
                                {(comercio.reconocimiento_director || comercio.convenio) && (
                                    <Grid size={{ xs: 12, sm: comercio.promocion_vigente ? 6 : 12 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            {comercio.reconocimiento_director && (
                                                <Paper
                                                    variant="outlined"
                                                    sx={{
                                                        ...cardBaseSx,
                                                        p: 2.5,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'space-between',
                                                        gap: 1.5,
                                                        boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.25)' : 'none',
                                                        '&:hover': { borderColor: hexToRgba(brandColor, 0.45) },
                                                    }}
                                                >
                                                    <Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1 }}>
                                                            <Avatar sx={{ width: 32, height: 32, bgcolor: hexToRgba(brandColor, isDark ? 0.22 : 0.12), color: isDark ? '#f87171' : brandColor }}>
                                                                <WorkspacePremiumIcon fontSize="small" />
                                                            </Avatar>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: textPrimary, 'html.dark &': { color: '#f8fafc' } }}>
                                                                Director y Reconocimientos
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="body2" sx={{ fontSize: '0.84rem', lineHeight: 1.6, color: textSecondary, 'html.dark &': { color: '#cbd5e1' } }}>
                                                            {cleanTextOrFallback(
                                                                comercio.reconocimiento_director,
                                                                'Conoce el perfil, acreditación oficial y distinciones otorgadas a la dirección institucional.'
                                                            )}
                                                        </Typography>
                                                    </Box>

                                                    {extractFirstUrl(comercio.reconocimiento_director) && (
                                                        <Box sx={{ pt: 1, borderTop: '1px solid', borderColor: cardBorder }}>
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                disableElevation
                                                                component="a"
                                                                href={extractFirstUrl(comercio.reconocimiento_director)!}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                endIcon={<LaunchIcon sx={{ fontSize: '15px !important' }} />}
                                                                sx={secondaryBtnSx}
                                                            >
                                                                Ver Reconocimiento
                                                            </Button>
                                                        </Box>
                                                    )}
                                                </Paper>
                                            )}

                                            {comercio.convenio && (
                                                <Paper
                                                    variant="outlined"
                                                    sx={{
                                                        ...cardBaseSx,
                                                        p: 2.5,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'space-between',
                                                        gap: 1.5,
                                                        boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.25)' : 'none',
                                                        '&:hover': { borderColor: hexToRgba(brandColor, 0.45) },
                                                    }}
                                                >
                                                    <Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1 }}>
                                                            <Avatar sx={{ width: 32, height: 32, bgcolor: hexToRgba(brandColor, isDark ? 0.22 : 0.12), color: isDark ? '#f87171' : brandColor }}>
                                                                <AccountTreeIcon fontSize="small" />
                                                            </Avatar>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: textPrimary, 'html.dark &': { color: '#f8fafc' } }}>
                                                                Convenios Interinstitucionales
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="body2" sx={{ fontSize: '0.84rem', lineHeight: 1.6, color: textSecondary, 'html.dark &': { color: '#cbd5e1' } }}>
                                                            {cleanTextOrFallback(
                                                                comercio.convenio,
                                                                'Alianzas estratégicas vigentes con entidades públicas, privadas y gremios para prácticas y convalidaciones.'
                                                            )}
                                                        </Typography>
                                                    </Box>

                                                    {extractFirstUrl(comercio.convenio) && (
                                                        <Box sx={{ pt: 1, borderTop: '1px solid', borderColor: cardBorder }}>
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                disableElevation
                                                                component="a"
                                                                href={extractFirstUrl(comercio.convenio)!}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                endIcon={<LaunchIcon sx={{ fontSize: '15px !important' }} />}
                                                                sx={secondaryBtnSx}
                                                            >
                                                                Ver Convenios
                                                            </Button>
                                                        </Box>
                                                    )}
                                                </Paper>
                                            )}
                                        </Box>
                                    </Grid>
                                )}

                                {comercio.promocion_vigente && (
                                    <Grid size={{ xs: 12, sm: (comercio.reconocimiento_director || comercio.convenio) ? 6 : 12 }}>
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                p: { xs: 2.5, sm: 3 },
                                                borderRadius: 3,
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                background: isDark
                                                    ? `linear-gradient(135deg, ${hexToRgba(brandColor, 0.2)} 0%, #132235 100%)`
                                                    : `linear-gradient(135deg, ${hexToRgba(brandColor, 0.1)} 0%, ${hexToRgba(brandColor, 0.03)} 100%)`,
                                                border: '1px solid',
                                                borderColor: hexToRgba(brandColor, 0.45),
                                                borderLeft: `5px solid ${brandColor}`,
                                                boxShadow: `0 4px 18px ${hexToRgba(brandColor, 0.15)}`,
                                                transition: 'all 0.25s',
                                                'html.dark &': {
                                                    background: `linear-gradient(135deg, ${hexToRgba(brandColor, 0.2)} 0%, #132235 100%) !important`,
                                                    borderColor: `${hexToRgba(brandColor, 0.5)} !important`,
                                                },
                                                '&:hover': {
                                                    borderColor: brandColor,
                                                    boxShadow: `0 6px 24px ${hexToRgba(brandColor, 0.25)}`,
                                                },
                                            }}
                                        >
                                            <Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 1.5 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                                        <Avatar sx={{ width: 32, height: 32, bgcolor: brandColor, color: '#ffffff' }}>
                                                            <LocalOfferIcon sx={{ fontSize: 18 }} />
                                                        </Avatar>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', color: isDark ? '#f87171' : brandColor, letterSpacing: 0.5 }}>
                                                            Promoción Vigente
                                                        </Typography>
                                                    </Box>
                                                    <Chip
                                                        label="Campaña Oficial"
                                                        size="small"
                                                        sx={{
                                                            bgcolor: brandColor,
                                                            color: '#ffffff',
                                                            fontWeight: 800,
                                                            height: 22,
                                                            fontSize: '0.68rem',
                                                            boxShadow: `0 2px 6px ${hexToRgba(brandColor, 0.35)}`,
                                                        }}
                                                    />
                                                </Box>

                                                <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: '0.98rem', mt: 1, color: textPrimary, 'html.dark &': { color: '#f8fafc' } }}>
                                                    Campaña de Beneficios y Descuentos
                                                </Typography>
                                                <Typography variant="body2" sx={{ display: 'block', mt: 0.6, lineHeight: 1.6, fontSize: '0.86rem', color: textSecondary, 'html.dark &': { color: '#cbd5e1' } }}>
                                                    Aprovecha nuestras campañas activas de becas, descuentos por matrícula anticipada y promociones para nuevos estudiantes.
                                                </Typography>
                                            </Box>

                                            <Box sx={{ pt: 2, mt: 2, borderTop: '1px solid', borderColor: hexToRgba(brandColor, 0.25) }}>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    disableElevation
                                                    component="a"
                                                    href={comercio.promocion_vigente.startsWith('http') ? comercio.promocion_vigente : `https://${comercio.promocion_vigente}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    startIcon={<LocalOfferIcon sx={{ fontSize: '15px !important' }} />}
                                                    endIcon={<LaunchIcon sx={{ fontSize: '14px !important' }} />}
                                                    sx={primaryBtnSx}
                                                >
                                                    Ver Promociones y Descuentos
                                                </Button>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                )}
                            </Grid>

                            {/* Galería de Fotos Institucionales */}
                            {comercio.fotos && comercio.fotos.length > 0 && (
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
                                        <Box sx={{ width: 4, height: 18, bgcolor: brandColor, borderRadius: 2 }} />
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                fontWeight: 800,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.06em',
                                                fontSize: '0.8rem',
                                                color: textSecondary,
                                                'html.dark &': { color: '#94a3b8' },
                                            }}
                                        >
                                            Instalaciones y Vida Académica ({comercio.fotos.length})
                                        </Typography>
                                    </Box>

                                    <Grid container spacing={2}>
                                        {comercio.fotos.map((foto, idx) => (
                                            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={idx}>
                                                <Box
                                                    onClick={() => setPreviewImage(getDriveDirectImageUrl(foto))}
                                                    sx={{
                                                        height: 130,
                                                        borderRadius: 3,
                                                        overflow: 'hidden',
                                                        border: '1px solid',
                                                        borderColor: cardBorder,
                                                        cursor: 'pointer',
                                                        position: 'relative',
                                                        transition: 'all 0.25s ease',
                                                        '&:hover': {
                                                            transform: 'scale(1.03)',
                                                            borderColor: brandColor,
                                                            boxShadow: `0 8px 24px ${hexToRgba(brandColor, 0.25)}`,
                                                            '& .photo-overlay': { opacity: 1 },
                                                        },
                                                    }}
                                                >
                                                    <Box
                                                        component="img"
                                                        src={getDriveDirectImageUrl(foto)}
                                                        alt={`Foto ${idx + 1}`}
                                                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        onError={(e: any) => {
                                                            e.target.src = 'https://via.placeholder.com/300x200?text=Capsur';
                                                        }}
                                                    />
                                                    <Box
                                                        className="photo-overlay"
                                                        sx={{
                                                            position: 'absolute',
                                                            inset: 0,
                                                            bgcolor: 'rgba(0, 0, 0, 0.55)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            opacity: 0,
                                                            transition: 'opacity 0.2s ease',
                                                        }}
                                                    >
                                                        <Chip
                                                            icon={<VisibilityIcon sx={{ fontSize: '14px !important', color: '#fff !important' }} />}
                                                            label="Ver Foto"
                                                            size="small"
                                                            sx={{
                                                                bgcolor: brandColor,
                                                                color: '#fff',
                                                                fontWeight: 700,
                                                                fontSize: '0.72rem',
                                                                boxShadow: 2,
                                                            }}
                                                        />
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}

                            {/* Canales y Videos de YouTube */}
                            {comercio.canales_youtube && comercio.canales_youtube.length > 0 && (
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
                                        <Box sx={{ width: 4, height: 18, bgcolor: '#dc2626', borderRadius: 2 }} />
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                fontWeight: 800,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.06em',
                                                fontSize: '0.8rem',
                                                color: textSecondary,
                                                'html.dark &': { color: '#94a3b8' },
                                            }}
                                        >
                                            Videos y Canal Oficial ({comercio.canales_youtube.length})
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                        {comercio.canales_youtube.map((yt, idx) => (
                                            <Paper
                                                key={idx}
                                                variant="outlined"
                                                sx={{
                                                    ...cardBaseSx,
                                                    p: 2,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    gap: 2,
                                                    boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.25)' : 'none',
                                                    '&:hover': {
                                                        borderColor: '#dc2626',
                                                        boxShadow: '0 4px 14px rgba(220, 38, 38, 0.16)',
                                                    },
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.6, minWidth: 0 }}>
                                                    <Avatar sx={{ bgcolor: 'rgba(220, 38, 38, 0.16)', color: '#ef4444', width: 38, height: 38 }}>
                                                        <YouTubeIcon fontSize="small" />
                                                    </Avatar>
                                                    <Box sx={{ minWidth: 0 }}>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.9rem', color: textPrimary, 'html.dark &': { color: '#f8fafc' } }} noWrap>
                                                            {getYouTubeLabel(yt, idx)}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ display: 'block', color: textSecondary, 'html.dark &': { color: '#94a3b8' } }} noWrap>
                                                            Contenido audiovisual oficial en YouTube
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    disableElevation
                                                    component="a"
                                                    href={yt}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    endIcon={<LaunchIcon sx={{ fontSize: '15px !important' }} />}
                                                    sx={catalogActionButtonStyles('#dc2626', 'primary')}
                                                >
                                                    Ver en YouTube
                                                </Button>
                                            </Paper>
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* ========================================================================= */}
                    {/* PESTAÑA 1: ACREDITACIÓN & MINEDU */}
                    {/* ========================================================================= */}
                    {currentTab === 1 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {/* Banner Institucional Oficial MINEDU */}
                            <Paper
                                sx={{
                                    p: { xs: 2.5, sm: 3 },
                                    borderRadius: 3,
                                    background: `linear-gradient(135deg, ${brandColor} 0%, ${hexToRgba(brandColor, 0.88)} 100%)`,
                                    color: '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2.2,
                                    boxShadow: `0 8px 24px ${hexToRgba(brandColor, 0.28)}`,
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 52,
                                        height: 52,
                                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                                        color: '#ffffff',
                                        backdropFilter: 'blur(8px)',
                                        flexShrink: 0,
                                    }}
                                >
                                    <VerifiedUserIcon sx={{ fontSize: 30 }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.3 }}>
                                        Acreditación y Cumplimiento Normativo MINEDU
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.94, mt: 0.5, fontSize: '0.86rem', lineHeight: 1.55 }}>
                                        Nuestra institución cuenta con resoluciones ministeriales y registro oficial ante el Ministerio de Educación del Perú, garantizando la validez de los certificados y títulos otorgados.
                                    </Typography>
                                </Box>
                            </Paper>

                            {/* Resoluciones Oficiales */}
                            <Grid container spacing={2.5}>
                                {[
                                    {
                                        title: 'Resolución de Creación',
                                        badge: 'Documento Oficial',
                                        description: 'Acto resolutivo formal emitido por el Ministerio de Educación / DRE que autoriza el funcionamiento institucional.',
                                        url: comercio.resolucion_creacion,
                                        emptyMessage: 'En trámite de publicación oficial',
                                        icon: <PictureAsPdfIcon fontSize="small" sx={{ color: isDark ? '#f87171' : brandColor }} />,
                                    },
                                    {
                                        title: 'Resolución de Revalidación',
                                        badge: 'Calidad Verificada',
                                        description: 'Acreditación periódica del cumplimiento de las condiciones básicas de calidad pedagógica e institucional.',
                                        url: comercio.resolucion_revalidacion,
                                        emptyMessage: 'En proceso de actualización formal',
                                        icon: <CheckCircleIcon fontSize="small" sx={{ color: isDark ? '#f87171' : brandColor }} />,
                                    },
                                ].map((document) => (
                                    <Grid size={{ xs: 12, sm: 6 }} key={document.title}>
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                ...cardBaseSx,
                                                p: { xs: 2.5, sm: 2.8 },
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.25)' : 'none',
                                                '&:hover': {
                                                    borderColor: hexToRgba(brandColor, 0.45),
                                                    boxShadow: `0 4px 16px ${hexToRgba(brandColor, 0.12)}`,
                                                },
                                            }}
                                        >
                                            <Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 1.5 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                                        <Avatar sx={{ width: 34, height: 34, bgcolor: hexToRgba(brandColor, isDark ? 0.22 : 0.12) }}>
                                                            {document.icon}
                                                        </Avatar>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.94rem', color: textPrimary, 'html.dark &': { color: '#f8fafc' } }}>
                                                            {document.title}
                                                        </Typography>
                                                    </Box>
                                                    {document.url && (
                                                        <Chip
                                                            label={document.badge}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: hexToRgba(brandColor, isDark ? 0.25 : 0.12),
                                                                color: isDark ? '#f87171' : brandColor,
                                                                fontWeight: 800,
                                                                height: 22,
                                                                fontSize: '0.68rem',
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                                <Typography variant="body2" sx={{ display: 'block', lineHeight: 1.6, fontSize: '0.84rem', color: textSecondary, 'html.dark &': { color: '#cbd5e1' } }}>
                                                    {document.description}
                                                </Typography>
                                            </Box>

                                            {document.url ? (
                                                <Box sx={{ pt: 2, mt: 2, borderTop: '1px solid', borderColor: cardBorder }}>
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        disableElevation
                                                        component="a"
                                                        href={document.url.startsWith('http') ? document.url : `https://${document.url}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        startIcon={<PictureAsPdfIcon fontSize="small" />}
                                                        endIcon={<LaunchIcon sx={{ fontSize: '15px !important' }} />}
                                                        sx={primaryBtnSx}
                                                    >
                                                        Ver Resolución en PDF
                                                    </Button>
                                                </Box>
                                            ) : (
                                                <Typography variant="caption" sx={{ mt: 2, fontStyle: 'italic', display: 'block', color: textSecondary }}>
                                                    {document.emptyMessage}
                                                </Typography>
                                            )}
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* Padrón Oficial ESCALE MINEDU */}
                            <Card
                                variant="outlined"
                                sx={{
                                    borderRadius: 3,
                                    p: { xs: 2.5, sm: 3 },
                                    bgcolor: isDark ? hexToRgba(brandColor, 0.12) : hexToRgba(brandColor, 0.03),
                                    borderColor: hexToRgba(brandColor, 0.35),
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                    'html.dark &': {
                                        backgroundColor: `${hexToRgba(brandColor, 0.12)} !important`,
                                        borderColor: `${hexToRgba(brandColor, 0.4)} !important`,
                                    },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.4 }}>
                                        <Avatar sx={{ width: 38, height: 38, bgcolor: hexToRgba(brandColor, isDark ? 0.25 : 0.15), color: isDark ? '#f87171' : brandColor }}>
                                            <VerifiedUserIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: isDark ? '#f87171' : brandColor, fontSize: '0.98rem' }}>
                                                Padrón Oficial de Instituciones Educativas (ESCALE MINEDU)
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.84rem', mt: 0.2, color: textSecondary, 'html.dark &': { color: '#cbd5e1' } }}>
                                                Consulta oficial en el padrón de la Unidad de Estadística de la Calidad Educativa del Ministerio de Educación.
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {escaleCode && (
                                        <Chip
                                            label={`Código Modular: ${escaleCode}`}
                                            size="medium"
                                            sx={{
                                                fontWeight: 800,
                                                bgcolor: brandColor,
                                                color: '#fff',
                                                height: 28,
                                                fontSize: '0.78rem',
                                            }}
                                        />
                                    )}
                                </Box>

                                <Box sx={{ pt: 1.5, borderTop: '1px solid', borderColor: hexToRgba(brandColor, 0.2), display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
                                    {escaleUrl ? (
                                        <Button
                                            variant="contained"
                                            size="small"
                                            disableElevation
                                            component="a"
                                            href={escaleUrl.startsWith('http') ? escaleUrl : `https://${escaleUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            endIcon={<LaunchIcon sx={{ fontSize: '15px !important' }} />}
                                            sx={primaryBtnSx}
                                        >
                                            Verificar Registro en Portal ESCALE MINEDU
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            size="small"
                                            disableElevation
                                            component="a"
                                            href="https://escale.minedu.gob.pe/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            endIcon={<LaunchIcon sx={{ fontSize: '15px !important' }} />}
                                            sx={primaryBtnSx}
                                        >
                                            Consultar Portal ESCALE MINEDU
                                        </Button>
                                    )}
                                </Box>
                            </Card>

                            {/* Seminarios & Capacitaciones Acreditadas */}
                            {comercio.seminario && (
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        ...cardBaseSx,
                                        p: 2.5,
                                        boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.25)' : 'none',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.4 }}>
                                            <Avatar sx={{ width: 34, height: 34, bgcolor: hexToRgba(brandColor, isDark ? 0.22 : 0.12), color: isDark ? '#f87171' : brandColor }}>
                                                <SchoolIcon fontSize="small" />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: textPrimary, 'html.dark &': { color: '#f8fafc' } }}>
                                                    Seminarios y Capacitaciones Acreditadas
                                                </Typography>
                                                <Typography variant="caption" sx={{ display: 'block', mt: 0.2, color: textSecondary, 'html.dark &': { color: '#94a3b8' } }}>
                                                    Programas y talleres certificados de actualización continua
                                                </Typography>
                                            </Box>
                                        </Box>
                                        {extractFirstUrl(comercio.seminario) && (
                                            <Button
                                                size="small"
                                                variant="contained"
                                                disableElevation
                                                component="a"
                                                href={extractFirstUrl(comercio.seminario)!}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                endIcon={<LaunchIcon sx={{ fontSize: '15px !important' }} />}
                                                sx={primaryBtnSx}
                                            >
                                                Ver Seminarios
                                            </Button>
                                        )}
                                    </Box>
                                </Paper>
                            )}
                        </Box>
                    )}

                    {/* ========================================================================= */}
                    {/* PESTAÑA 2: OFERTA FORMATIVA */}
                    {/* ========================================================================= */}
                    {currentTab === 2 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {/* Barra de Búsqueda y Filtros */}
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                                <TextField
                                    size="small"
                                    placeholder="Buscar por carrera, especialidad, diplomado o curso..."
                                    value={offerSearch}
                                    onChange={(e) => setOfferSearch(e.target.value)}
                                    sx={{
                                        flex: 1,
                                        minWidth: { xs: '100%', sm: 260 },
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2.5,
                                            bgcolor: cardBg,
                                            color: textPrimary,
                                            '& fieldset': {
                                                borderColor: cardBorder,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: brandColor,
                                            },
                                            'html.dark &': {
                                                backgroundColor: '#132235 !important',
                                                color: '#f8fafc !important',
                                                borderColor: 'rgba(255, 255, 255, 0.12) !important',
                                            },
                                        },
                                    }}
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon fontSize="small" sx={{ color: isDark ? '#f87171' : brandColor }} />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />

                                <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
                                    <Chip
                                        label={`Todos (${totalOffers})`}
                                        size="small"
                                        clickable
                                        onClick={() => setOfferTypeFilter('all')}
                                        sx={{
                                            fontWeight: 800,
                                            borderRadius: 2,
                                            ...(offerTypeFilter === 'all'
                                                ? {
                                                      bgcolor: brandColor,
                                                      color: '#ffffff',
                                                      boxShadow: `0 2px 8px ${hexToRgba(brandColor, 0.4)}`,
                                                      '&:hover': { bgcolor: brandColor },
                                                  }
                                                : {
                                                      bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'action.hover',
                                                      color: textPrimary,
                                                      'html.dark &': { color: '#f8fafc' },
                                                  }),
                                        }}
                                    />
                                    {carreras.length > 0 && (
                                        <Chip
                                            label={`Carreras (${carreras.length})`}
                                            size="small"
                                            clickable
                                            onClick={() => setOfferTypeFilter('carreras')}
                                            sx={{
                                                fontWeight: 800,
                                                borderRadius: 2,
                                                ...(offerTypeFilter === 'carreras'
                                                    ? {
                                                          bgcolor: brandColor,
                                                          color: '#ffffff',
                                                          boxShadow: `0 2px 8px ${hexToRgba(brandColor, 0.4)}`,
                                                          '&:hover': { bgcolor: brandColor },
                                                      }
                                                    : {
                                                          bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'action.hover',
                                                          color: textPrimary,
                                                          'html.dark &': { color: '#f8fafc' },
                                                      }),
                                            }}
                                        />
                                    )}
                                    {especialidades.length > 0 && (
                                        <Chip
                                            label={`Especialidades (${especialidades.length})`}
                                            size="small"
                                            clickable
                                            onClick={() => setOfferTypeFilter('especialidades')}
                                            sx={{
                                                fontWeight: 800,
                                                borderRadius: 2,
                                                ...(offerTypeFilter === 'especialidades'
                                                    ? {
                                                          bgcolor: brandColor,
                                                          color: '#ffffff',
                                                          boxShadow: `0 2px 8px ${hexToRgba(brandColor, 0.4)}`,
                                                          '&:hover': { bgcolor: brandColor },
                                                      }
                                                    : {
                                                          bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'action.hover',
                                                          color: textPrimary,
                                                          'html.dark &': { color: '#f8fafc' },
                                                      }),
                                            }}
                                        />
                                    )}
                                    {diplomados.length > 0 && (
                                        <Chip
                                            label={`Diplomados (${diplomados.length})`}
                                            size="small"
                                            clickable
                                            onClick={() => setOfferTypeFilter('diplomados')}
                                            sx={{
                                                fontWeight: 800,
                                                borderRadius: 2,
                                                ...(offerTypeFilter === 'diplomados'
                                                    ? {
                                                          bgcolor: brandColor,
                                                          color: '#ffffff',
                                                          boxShadow: `0 2px 8px ${hexToRgba(brandColor, 0.4)}`,
                                                          '&:hover': { bgcolor: brandColor },
                                                      }
                                                    : {
                                                          bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'action.hover',
                                                          color: textPrimary,
                                                          'html.dark &': { color: '#f8fafc' },
                                                      }),
                                            }}
                                        />
                                    )}
                                    {cursos.length > 0 && (
                                        <Chip
                                            label={`Cursos (${cursos.length})`}
                                            size="small"
                                            clickable
                                            onClick={() => setOfferTypeFilter('cursos')}
                                            sx={{
                                                fontWeight: 800,
                                                borderRadius: 2,
                                                ...(offerTypeFilter === 'cursos'
                                                    ? {
                                                          bgcolor: brandColor,
                                                          color: '#ffffff',
                                                          boxShadow: `0 2px 8px ${hexToRgba(brandColor, 0.4)}`,
                                                          '&:hover': { bgcolor: brandColor },
                                                      }
                                                    : {
                                                          bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'action.hover',
                                                          color: textPrimary,
                                                          'html.dark &': { color: '#f8fafc' },
                                                      }),
                                            }}
                                        />
                                    )}
                                </Box>
                            </Box>

                            {totalFiltered === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 5, borderRadius: 3, border: '1px dashed', borderColor: cardBorder }}>
                                    <Avatar sx={{ width: 54, height: 54, bgcolor: hexToRgba(brandColor, isDark ? 0.22 : 0.1), color: isDark ? '#f87171' : brandColor, mx: 'auto', mb: 1.5 }}>
                                        <SchoolIcon fontSize="medium" />
                                    </Avatar>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: textPrimary, 'html.dark &': { color: '#f8fafc' } }}>
                                        No se encontraron programas
                                    </Typography>
                                    <Typography variant="body2" sx={{ maxWidth: 360, mx: 'auto', mt: 0.5, color: textSecondary, 'html.dark &': { color: '#94a3b8' } }}>
                                        Intenta con otro término de búsqueda o selecciona otra categoría de formación.
                                    </Typography>
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                                    {/* Carreras */}
                                    {filteredCarreras.length > 0 && (
                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
                                                <Box sx={{ width: 4, height: 18, bgcolor: brandColor, borderRadius: 2 }} />
                                                <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, color: isDark ? '#f87171' : brandColor }}>
                                                    Carreras Profesionales & Técnicas ({filteredCarreras.length})
                                                </Typography>
                                            </Box>
                                            <Grid container spacing={2.5}>
                                                {filteredCarreras.map((carr) => (
                                                    <Grid size={{ xs: 12, sm: 6 }} key={carr.id}>
                                                        <Card
                                                            variant="outlined"
                                                            sx={{
                                                                ...cardBaseSx,
                                                                p: 2.5,
                                                                height: '100%',
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                justifyContent: 'space-between',
                                                                gap: 2,
                                                                boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.25)' : 'none',
                                                                '&:hover': {
                                                                    borderColor: hexToRgba(brandColor, 0.45),
                                                                    boxShadow: `0 4px 16px ${hexToRgba(brandColor, 0.12)}`,
                                                                },
                                                            }}
                                                        >
                                                            <Box>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                                                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.96rem', color: textPrimary, 'html.dark &': { color: '#f8fafc' } }}>
                                                                        {carr.nombre}
                                                                    </Typography>
                                                                    {carr.codigo && <Chip label={carr.codigo} size="small" variant="outlined" sx={{ fontWeight: 700, height: 22, color: textPrimary, borderColor: cardBorder }} />}
                                                                    {carr.modalidad && (
                                                                        <Chip
                                                                            label={carr.modalidad.toUpperCase()}
                                                                            size="small"
                                                                            sx={{
                                                                                fontWeight: 800,
                                                                                bgcolor: hexToRgba(brandColor, isDark ? 0.22 : 0.12),
                                                                                color: isDark ? '#f87171' : brandColor,
                                                                                height: 22,
                                                                                fontSize: '0.68rem',
                                                                            }}
                                                                        />
                                                                    )}
                                                                </Box>
                                                                <Typography variant="body2" sx={{ display: 'block', lineHeight: 1.6, fontSize: '0.84rem', color: textSecondary, 'html.dark &': { color: '#cbd5e1' } }}>
                                                                    Duración: {carr.duracion || '3 años (Modular)'} • {carr.resolucion ? `Resolución: ${carr.resolucion}` : 'Acreditado MINEDU'}
                                                                </Typography>
                                                            </Box>

                                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', pt: 1.5, borderTop: '1px solid', borderColor: cardBorder }}>
                                                                {carr.brochure && (
                                                                    <Button
                                                                        size="small"
                                                                        variant="contained"
                                                                        disableElevation
                                                                        component="a"
                                                                        href={carr.brochure}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        startIcon={<PictureAsPdfIcon fontSize="small" />}
                                                                        sx={primaryBtnSx}
                                                                    >
                                                                        Descargar Brochure
                                                                    </Button>
                                                                )}
                                                                {carr.url_malla_curricular && (
                                                                    <Button
                                                                        size="small"
                                                                        variant="contained"
                                                                        disableElevation
                                                                        component="a"
                                                                        href={carr.url_malla_curricular}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        startIcon={<MenuBookIcon fontSize="small" />}
                                                                        sx={secondaryBtnSx}
                                                                    >
                                                                        Malla Curricular
                                                                    </Button>
                                                                )}
                                                            </Box>
                                                        </Card>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    )}

                                    {/* Especialidades */}
                                    {filteredEspecialidades.length > 0 && (
                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
                                                <Box sx={{ width: 4, height: 18, bgcolor: brandColor, borderRadius: 2 }} />
                                                <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, color: isDark ? '#f87171' : brandColor }}>
                                                    Especialidades ({filteredEspecialidades.length})
                                                </Typography>
                                            </Box>
                                            <Grid container spacing={2.5}>
                                                {filteredEspecialidades.map((esp) => (
                                                    <Grid size={{ xs: 12, sm: 6 }} key={esp.id}>
                                                        <Card
                                                            variant="outlined"
                                                            sx={{
                                                                ...cardBaseSx,
                                                                p: 2.5,
                                                                height: '100%',
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                justifyContent: 'space-between',
                                                                gap: 2,
                                                                boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.25)' : 'none',
                                                                '&:hover': {
                                                                    borderColor: hexToRgba(brandColor, 0.45),
                                                                    boxShadow: `0 4px 16px ${hexToRgba(brandColor, 0.12)}`,
                                                                },
                                                            }}
                                                        >
                                                            <Box>
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.35, fontSize: '0.94rem', color: textPrimary, 'html.dark &': { color: '#f8fafc' } }}>
                                                                    {esp.nombre}
                                                                </Typography>
                                                                <Box sx={{ display: esp.rubro?.nombre || esp.precio ? 'flex' : 'none', alignItems: 'center', gap: 1, mt: 1.2, flexWrap: 'wrap' }}>
                                                                    {esp.rubro?.nombre && (
                                                                        <Chip label={esp.rubro.nombre} size="small" sx={{ fontSize: '0.72rem', height: 22, color: textPrimary, bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'action.hover' }} />
                                                                    )}
                                                                    {esp.precio && (
                                                                        <Chip
                                                                            label={`Inversión: S/. ${esp.precio}`}
                                                                            size="small"
                                                                            sx={{
                                                                                fontWeight: 800,
                                                                                bgcolor: hexToRgba(brandColor, isDark ? 0.22 : 0.12),
                                                                                color: isDark ? '#f87171' : brandColor,
                                                                                height: 22,
                                                                            }}
                                                                        />
                                                                    )}
                                                                </Box>
                                                            </Box>

                                                            <Box sx={{ display: esp.brochure || esp.youtube ? 'flex' : 'none', gap: 1, flexWrap: 'wrap', pt: 1.5, borderTop: '1px solid', borderColor: cardBorder }}>
                                                                {esp.brochure && (
                                                                    <Button
                                                                        size="small"
                                                                        variant="contained"
                                                                        disableElevation
                                                                        component="a"
                                                                        href={esp.brochure}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        startIcon={<PictureAsPdfIcon fontSize="small" />}
                                                                        sx={primaryBtnSx}
                                                                    >
                                                                        Brochure PDF
                                                                    </Button>
                                                                )}
                                                                {esp.youtube && (
                                                                    <Button
                                                                        size="small"
                                                                        variant="contained"
                                                                        disableElevation
                                                                        component="a"
                                                                        href={esp.youtube}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        startIcon={<YouTubeIcon fontSize="small" />}
                                                                        sx={catalogActionButtonStyles('#dc2626', 'primary')}
                                                                    >
                                                                        Video Explicativo
                                                                    </Button>
                                                                )}
                                                            </Box>
                                                        </Card>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    )}

                                    {/* Diplomados */}
                                    {filteredDiplomados.length > 0 && (
                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
                                                <Box sx={{ width: 4, height: 18, bgcolor: brandColor, borderRadius: 2 }} />
                                                <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, color: isDark ? '#f87171' : brandColor }}>
                                                    Diplomados de Especialización ({filteredDiplomados.length})
                                                </Typography>
                                            </Box>
                                            <Grid container spacing={2.5}>
                                                {filteredDiplomados.map((dip) => (
                                                    <Grid size={{ xs: 12, sm: 6 }} key={dip.id}>
                                                        <Card
                                                            variant="outlined"
                                                            sx={{
                                                                ...cardBaseSx,
                                                                p: 2.5,
                                                                height: '100%',
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                justifyContent: 'space-between',
                                                                gap: 2,
                                                                boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.25)' : 'none',
                                                                '&:hover': {
                                                                    borderColor: hexToRgba(brandColor, 0.45),
                                                                    boxShadow: `0 4px 16px ${hexToRgba(brandColor, 0.12)}`,
                                                                },
                                                            }}
                                                        >
                                                            <Box>
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.35, fontSize: '0.94rem', color: textPrimary, 'html.dark &': { color: '#f8fafc' } }}>
                                                                    {dip.nombre}
                                                                </Typography>
                                                                <Box sx={{ display: dip.tipo || dip.precio ? 'flex' : 'none', alignItems: 'center', gap: 1, mt: 1.2, flexWrap: 'wrap' }}>
                                                                    {dip.tipo && (
                                                                        <Chip label={dip.tipo.replace('_', ' ').toUpperCase()} size="small" sx={{ fontSize: '0.72rem', height: 22, color: textPrimary, bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'action.hover' }} />
                                                                    )}
                                                                    {dip.precio && (
                                                                        <Chip
                                                                            label={`Inversión: S/. ${dip.precio}`}
                                                                            size="small"
                                                                            sx={{
                                                                                fontWeight: 800,
                                                                                bgcolor: hexToRgba(brandColor, isDark ? 0.22 : 0.12),
                                                                                color: isDark ? '#f87171' : brandColor,
                                                                                height: 22,
                                                                            }}
                                                                        />
                                                                    )}
                                                                </Box>
                                                            </Box>

                                                            <Box sx={{ display: dip.brochure || dip.youtube ? 'flex' : 'none', gap: 1, flexWrap: 'wrap', pt: 1.5, borderTop: '1px solid', borderColor: cardBorder }}>
                                                                {dip.brochure && (
                                                                    <Button
                                                                        size="small"
                                                                        variant="contained"
                                                                        disableElevation
                                                                        component="a"
                                                                        href={dip.brochure}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        startIcon={<PictureAsPdfIcon fontSize="small" />}
                                                                        sx={primaryBtnSx}
                                                                    >
                                                                        Brochure PDF
                                                                    </Button>
                                                                )}
                                                                {dip.youtube && (
                                                                    <Button
                                                                        size="small"
                                                                        variant="contained"
                                                                        disableElevation
                                                                        component="a"
                                                                        href={dip.youtube}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        startIcon={<YouTubeIcon fontSize="small" />}
                                                                        sx={catalogActionButtonStyles('#dc2626', 'primary')}
                                                                    >
                                                                        Video Explicativo
                                                                    </Button>
                                                                )}
                                                            </Box>
                                                        </Card>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    )}

                                    {/* Cursos */}
                                    {filteredCursos.length > 0 && (
                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
                                                <Box sx={{ width: 4, height: 18, bgcolor: brandColor, borderRadius: 2 }} />
                                                <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, color: isDark ? '#f87171' : brandColor }}>
                                                    Cursos & Certificaciones Técnicas ({filteredCursos.length})
                                                </Typography>
                                            </Box>
                                            <Grid container spacing={2.5}>
                                                {filteredCursos.map((cur) => (
                                                    <Grid size={{ xs: 12, sm: 6 }} key={cur.id}>
                                                        <Card
                                                            variant="outlined"
                                                            sx={{
                                                                ...cardBaseSx,
                                                                p: 2.5,
                                                                height: '100%',
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                justifyContent: 'space-between',
                                                                gap: 2,
                                                                boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.25)' : 'none',
                                                                '&:hover': {
                                                                    borderColor: hexToRgba(brandColor, 0.45),
                                                                    boxShadow: `0 4px 16px ${hexToRgba(brandColor, 0.12)}`,
                                                                },
                                                            }}
                                                        >
                                                            <Box>
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.35, fontSize: '0.94rem', color: textPrimary, 'html.dark &': { color: '#f8fafc' } }}>
                                                                    {cur.nombre}
                                                                </Typography>
                                                                <Box sx={{ display: cur.tipo || cur.precio ? 'flex' : 'none', alignItems: 'center', gap: 1, mt: 1.2, flexWrap: 'wrap' }}>
                                                                    {cur.tipo && <Chip label={cur.tipo.toUpperCase()} size="small" sx={{ fontSize: '0.72rem', height: 22, color: textPrimary, bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'action.hover' }} />}
                                                                    {cur.precio && (
                                                                        <Chip
                                                                            label={`Inversión: S/. ${cur.precio}`}
                                                                            size="small"
                                                                            sx={{
                                                                                fontWeight: 800,
                                                                                bgcolor: hexToRgba(brandColor, isDark ? 0.22 : 0.12),
                                                                                color: isDark ? '#f87171' : brandColor,
                                                                                height: 22,
                                                                            }}
                                                                        />
                                                                    )}
                                                                </Box>
                                                            </Box>

                                                            <Box sx={{ display: cur.brochure || cur.youtube ? 'flex' : 'none', gap: 1, flexWrap: 'wrap', pt: 1.5, borderTop: '1px solid', borderColor: cardBorder }}>
                                                                {cur.brochure && (
                                                                    <Button
                                                                        size="small"
                                                                        variant="contained"
                                                                        disableElevation
                                                                        component="a"
                                                                        href={cur.brochure}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        startIcon={<PictureAsPdfIcon fontSize="small" />}
                                                                        sx={primaryBtnSx}
                                                                    >
                                                                        Brochure PDF
                                                                    </Button>
                                                                )}
                                                                {cur.youtube && (
                                                                    <Button
                                                                        size="small"
                                                                        variant="contained"
                                                                        disableElevation
                                                                        component="a"
                                                                        href={cur.youtube}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        startIcon={<YouTubeIcon fontSize="small" />}
                                                                        sx={catalogActionButtonStyles('#dc2626', 'primary')}
                                                                    >
                                                                        Video Explicativo
                                                                    </Button>
                                                                )}
                                                            </Box>
                                                        </Card>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* ========================================================================= */}
                    {/* PESTAÑA 3: ENLACES & DESCARGAS */}
                    {/* ========================================================================= */}
                    {currentTab === 3 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                <Box sx={{ width: 4, height: 18, bgcolor: brandColor, borderRadius: 2 }} />
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.06em',
                                        fontSize: '0.8rem',
                                        color: textSecondary,
                                        'html.dark &': { color: '#94a3b8' },
                                    }}
                                >
                                    Documentación y Recursos Oficiales Descargables
                                </Typography>
                            </Box>

                            <Grid container spacing={2.5}>
                                {comercio.catalogo_url && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                ...cardBaseSx,
                                                p: 2.5,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: 2,
                                                boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.25)' : 'none',
                                                '&:hover': { borderColor: hexToRgba(brandColor, 0.45) },
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8, minWidth: 0 }}>
                                                <Avatar sx={{ bgcolor: hexToRgba(brandColor, isDark ? 0.22 : 0.12), color: isDark ? '#f87171' : brandColor, width: 42, height: 42 }}>
                                                    <PictureAsPdfIcon fontSize="small" />
                                                </Avatar>
                                                <Box sx={{ minWidth: 0 }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.92rem', color: textPrimary, 'html.dark &': { color: '#f8fafc' } }} noWrap>
                                                        Catálogo Institucional
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ display: 'block', mt: 0.2, color: textSecondary, 'html.dark &': { color: '#94a3b8' } }} noWrap>
                                                        Brochure general en formato PDF
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                disableElevation
                                                component="a"
                                                href={comercio.catalogo_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                endIcon={<LaunchIcon sx={{ fontSize: '15px !important' }} />}
                                                sx={primaryBtnSx}
                                            >
                                                Descargar
                                            </Button>
                                        </Card>
                                    </Grid>
                                )}

                                {comercio.brochure_vacaciones_utiles && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                ...cardBaseSx,
                                                p: 2.5,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: 2,
                                                boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.25)' : 'none',
                                                '&:hover': { borderColor: hexToRgba(brandColor, 0.45) },
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8, minWidth: 0 }}>
                                                <Avatar sx={{ bgcolor: hexToRgba(brandColor, isDark ? 0.22 : 0.12), color: isDark ? '#f87171' : brandColor, width: 42, height: 42 }}>
                                                    <PictureAsPdfIcon fontSize="small" />
                                                </Avatar>
                                                <Box sx={{ minWidth: 0 }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.92rem', color: textPrimary, 'html.dark &': { color: '#f8fafc' } }} noWrap>
                                                        Vacaciones Útiles
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ display: 'block', mt: 0.2, color: textSecondary, 'html.dark &': { color: '#94a3b8' } }} noWrap>
                                                        Talleres y cursos formativos
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                disableElevation
                                                component="a"
                                                href={comercio.brochure_vacaciones_utiles.startsWith('http') ? comercio.brochure_vacaciones_utiles : `https://${comercio.brochure_vacaciones_utiles}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                endIcon={<LaunchIcon sx={{ fontSize: '15px !important' }} />}
                                                sx={primaryBtnSx}
                                            >
                                                Ver PDF
                                            </Button>
                                        </Card>
                                    </Grid>
                                )}

                                {comercio.malla_curricular_url && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                ...cardBaseSx,
                                                p: 2.5,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: 2,
                                                boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.25)' : 'none',
                                                '&:hover': { borderColor: hexToRgba(brandColor, 0.45) },
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8, minWidth: 0 }}>
                                                <Avatar sx={{ bgcolor: hexToRgba(brandColor, isDark ? 0.22 : 0.12), color: isDark ? '#f87171' : brandColor, width: 42, height: 42 }}>
                                                    <MenuBookIcon fontSize="small" />
                                                </Avatar>
                                                <Box sx={{ minWidth: 0 }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.92rem', color: textPrimary, 'html.dark &': { color: '#f8fafc' } }} noWrap>
                                                        Malla Curricular General
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ display: 'block', mt: 0.2, color: textSecondary, 'html.dark &': { color: '#94a3b8' } }} noWrap>
                                                        Planes de estudio y contenidos
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                disableElevation
                                                component="a"
                                                href={comercio.malla_curricular_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                endIcon={<LaunchIcon sx={{ fontSize: '15px !important' }} />}
                                                sx={primaryBtnSx}
                                            >
                                                Ver Malla
                                            </Button>
                                        </Card>
                                    </Grid>
                                )}

                                {comercio.certificado_url && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                ...cardBaseSx,
                                                p: 2.5,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: 2,
                                                boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.25)' : 'none',
                                                '&:hover': { borderColor: hexToRgba(brandColor, 0.45) },
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8, minWidth: 0 }}>
                                                <Avatar sx={{ bgcolor: hexToRgba(brandColor, isDark ? 0.22 : 0.12), color: isDark ? '#f87171' : brandColor, width: 42, height: 42 }}>
                                                    <WorkspacePremiumIcon fontSize="small" />
                                                </Avatar>
                                                <Box sx={{ minWidth: 0 }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.92rem', color: textPrimary, 'html.dark &': { color: '#f8fafc' } }} noWrap>
                                                        Modelo de Certificado
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ display: 'block', mt: 0.2, color: textSecondary, 'html.dark &': { color: '#94a3b8' } }} noWrap>
                                                        Formato oficial de certificación
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                disableElevation
                                                component="a"
                                                href={comercio.certificado_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                endIcon={<LaunchIcon sx={{ fontSize: '15px !important' }} />}
                                                sx={primaryBtnSx}
                                            >
                                                Ver Modelo
                                            </Button>
                                        </Card>
                                    </Grid>
                                )}

                                {escaleUrl && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                ...cardBaseSx,
                                                p: 2.5,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: 2,
                                                boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.25)' : 'none',
                                                '&:hover': { borderColor: hexToRgba(brandColor, 0.45) },
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8, minWidth: 0 }}>
                                                <Avatar sx={{ bgcolor: hexToRgba(brandColor, isDark ? 0.22 : 0.12), color: isDark ? '#f87171' : brandColor, width: 42, height: 42 }}>
                                                    <VerifiedUserIcon fontSize="small" />
                                                </Avatar>
                                                <Box sx={{ minWidth: 0 }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.92rem', color: textPrimary, 'html.dark &': { color: '#f8fafc' } }} noWrap>
                                                        Padrón ESCALE MINEDU
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ display: 'block', mt: 0.2, color: textSecondary, 'html.dark &': { color: '#94a3b8' } }} noWrap>
                                                        Consulta en padrón de legalidad
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                disableElevation
                                                component="a"
                                                href={escaleUrl.startsWith('http') ? escaleUrl : `https://${escaleUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                endIcon={<LaunchIcon sx={{ fontSize: '15px !important' }} />}
                                                sx={primaryBtnSx}
                                            >
                                                Verificar
                                            </Button>
                                        </Card>
                                    </Grid>
                                )}

                                {comercio.resolucion_creacion && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                ...cardBaseSx,
                                                p: 2.5,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: 2,
                                                boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.25)' : 'none',
                                                '&:hover': { borderColor: hexToRgba(brandColor, 0.45) },
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8, minWidth: 0 }}>
                                                <Avatar sx={{ bgcolor: hexToRgba(brandColor, isDark ? 0.22 : 0.12), color: isDark ? '#f87171' : brandColor, width: 42, height: 42 }}>
                                                    <PictureAsPdfIcon fontSize="small" />
                                                </Avatar>
                                                <Box sx={{ minWidth: 0 }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.92rem', color: textPrimary, 'html.dark &': { color: '#f8fafc' } }} noWrap>
                                                        Resolución de Creación
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ display: 'block', mt: 0.2, color: textSecondary, 'html.dark &': { color: '#94a3b8' } }} noWrap>
                                                        Acto normativo de autorización
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                disableElevation
                                                component="a"
                                                href={comercio.resolucion_creacion.startsWith('http') ? comercio.resolucion_creacion : `https://${comercio.resolucion_creacion}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                endIcon={<LaunchIcon sx={{ fontSize: '15px !important' }} />}
                                                sx={primaryBtnSx}
                                            >
                                                Ver PDF
                                            </Button>
                                        </Card>
                                    </Grid>
                                )}

                                {comercio.resolucion_revalidacion && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                ...cardBaseSx,
                                                p: 2.5,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: 2,
                                                boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.25)' : 'none',
                                                '&:hover': { borderColor: hexToRgba(brandColor, 0.45) },
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8, minWidth: 0 }}>
                                                <Avatar sx={{ bgcolor: hexToRgba(brandColor, isDark ? 0.22 : 0.12), color: isDark ? '#f87171' : brandColor, width: 42, height: 42 }}>
                                                    <CheckCircleIcon fontSize="small" />
                                                </Avatar>
                                                <Box sx={{ minWidth: 0 }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.92rem', color: textPrimary, 'html.dark &': { color: '#f8fafc' } }} noWrap>
                                                        Resolución de Revalidación
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ display: 'block', mt: 0.2, color: textSecondary, 'html.dark &': { color: '#94a3b8' } }} noWrap>
                                                        Calidad acreditada por MINEDU
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                disableElevation
                                                component="a"
                                                href={comercio.resolucion_revalidacion.startsWith('http') ? comercio.resolucion_revalidacion : `https://${comercio.resolucion_revalidacion}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                endIcon={<LaunchIcon sx={{ fontSize: '15px !important' }} />}
                                                sx={primaryBtnSx}
                                            >
                                                Ver PDF
                                            </Button>
                                        </Card>
                                    </Grid>
                                )}

                                {comercio.promocion_vigente && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                p: 2.5,
                                                borderRadius: 3,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: 2,
                                                borderColor: hexToRgba(brandColor, 0.4),
                                                bgcolor: isDark ? hexToRgba(brandColor, 0.14) : hexToRgba(brandColor, 0.04),
                                                transition: 'all 0.2s',
                                                'html.dark &': {
                                                    backgroundColor: `${hexToRgba(brandColor, 0.14)} !important`,
                                                },
                                                '&:hover': { borderColor: brandColor },
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8, minWidth: 0 }}>
                                                <Avatar sx={{ bgcolor: brandColor, color: '#ffffff', width: 42, height: 42 }}>
                                                    <LocalOfferIcon fontSize="small" />
                                                </Avatar>
                                                <Box sx={{ minWidth: 0 }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: isDark ? '#f87171' : brandColor, fontSize: '0.92rem' }} noWrap>
                                                        Promoción Vigente
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ display: 'block', mt: 0.2, color: textSecondary, 'html.dark &': { color: '#cbd5e1' } }} noWrap>
                                                        Campaña y beneficios activos
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                disableElevation
                                                component="a"
                                                href={comercio.promocion_vigente.startsWith('http') ? comercio.promocion_vigente : `https://${comercio.promocion_vigente}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                endIcon={<LaunchIcon sx={{ fontSize: '15px !important' }} />}
                                                sx={primaryBtnSx}
                                            >
                                                Ver Promoción
                                            </Button>
                                        </Card>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    )}
                </DialogContent>

                {/* Pie de la Ficha Modal con Soporte Dark Mode */}
                <DialogActions
                    sx={{
                        px: { xs: 2.5, sm: 3.5 },
                        py: 2.2,
                        borderTop: '1px solid',
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'divider',
                        bgcolor: footerBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 2,
                        'html.dark &': {
                            backgroundColor: '#0d1726 !important',
                            borderColor: 'rgba(255, 255, 255, 0.08) !important',
                        },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                            variant="caption"
                            sx={{
                                fontWeight: 600,
                                fontSize: '0.78rem',
                                color: textSecondary,
                                'html.dark &': { color: '#94a3b8' },
                            }}
                        >
                            Corporación Educativa • Grupo CAPSUR • Información Oficial
                        </Typography>
                    </Box>

                    <Button
                        size="medium"
                        disableElevation
                        onClick={onClose}
                        variant="outlined"
                        sx={{
                            borderRadius: '9px',
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '0.84rem',
                            px: 3.5,
                            py: 0.8,
                            borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'divider',
                            color: textPrimary,
                            bgcolor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
                            transition: 'all 0.2s ease',
                            'html.dark &': {
                                color: '#f8fafc !important',
                                borderColor: 'rgba(255, 255, 255, 0.2) !important',
                            },
                            '&:hover': {
                                bgcolor: hexToRgba(brandColor, 0.15),
                                borderColor: brandColor,
                                color: brandColor,
                            },
                        }}
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal Lightbox para Previsualizar Fotos */}
            <Dialog
                open={Boolean(previewImage)}
                onClose={() => setPreviewImage(null)}
                maxWidth="md"
                slotProps={{
                    paper: {
                        sx: {
                            bgcolor: 'transparent',
                            boxShadow: 'none',
                            overflow: 'hidden',
                        },
                    },
                }}
            >
                {previewImage && (
                    <Box sx={{ position: 'relative', textAlign: 'center', p: 1 }}>
                        <IconButton
                            onClick={() => setPreviewImage(null)}
                            sx={{
                                position: 'absolute',
                                top: 16,
                                right: 16,
                                bgcolor: 'rgba(0, 0, 0, 0.65)',
                                color: '#ffffff',
                                backdropFilter: 'blur(4px)',
                                '&:hover': { bgcolor: brandColor },
                                zIndex: 10,
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Box
                            component="img"
                            src={previewImage}
                            alt="Previsualización de Foto Institucional"
                            sx={{
                                maxWidth: '90vw',
                                maxHeight: '82vh',
                                borderRadius: 3,
                                objectFit: 'contain',
                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                        />
                    </Box>
                )}
            </Dialog>
        </>
    );
}
