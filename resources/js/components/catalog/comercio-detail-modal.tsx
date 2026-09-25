import AssignmentIcon from '@mui/icons-material/Assignment';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DescriptionIcon from '@mui/icons-material/Description';
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
import GoogleDriveIcon from '@/components/google-drive-icon';
import { getDriveDirectImageUrl, isGoogleDriveUrl } from '@/lib/utils';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
import { useState, useMemo } from 'react';
import type { Comercio } from '@/types';

interface ComercioDetailModalProps {
    open: boolean;
    comercio: Comercio | null;
    onClose: () => void;
}

export default function ComercioDetailModal({
    open,
    comercio,
    onClose,
}: ComercioDetailModalProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [currentTab, setCurrentTab] = useState(0);
    const [offerSearch, setOfferSearch] = useState('');
    const [offerTypeFilter, setOfferTypeFilter] = useState<'all' | 'carreras' | 'especialidades' | 'diplomados' | 'cursos'>('all');
    const [copiedText, setCopiedText] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    if (!comercio) return null;

    const brandColor = comercio.color_hex || '#0c43a3';
    const carreras = comercio.carreras || [];
    const especialidades = comercio.especialidades || [];
    const diplomados = comercio.diplomados || [];
    const cursos = comercio.cursos || [];

    const handleCopy = (text: string, label: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedText(label);
        setTimeout(() => {
            setCopiedText(null);
        }, 2000);
    };

    // Resumen institucional para copiar rápidamente al portapapeles
    const handleCopyQuickSummary = () => {
        const ofertaParts: string[] = [];
        if (carreras.length > 0) ofertaParts.push(`${carreras.length} ${carreras.length === 1 ? 'Carrera' : 'Carreras'}`);
        if (especialidades.length > 0) ofertaParts.push(`${especialidades.length} ${especialidades.length === 1 ? 'Especialidad' : 'Especialidades'}`);
        if (diplomados.length > 0) ofertaParts.push(`${diplomados.length} ${diplomados.length === 1 ? 'Diplomado' : 'Diplomados'}`);
        if (cursos.length > 0) ofertaParts.push(`${cursos.length} ${cursos.length === 1 ? 'Curso' : 'Cursos'}`);

        const lines = [
            `📌 *${comercio.nombre}* (${comercio.sigla || comercio.codigo || ''})`,
            `🏛️ Grupo: ${comercio.grupo?.nombre || 'Grupo Capsur'}`,
            comercio.pagina_web ? `🌐 Web Oficial: ${comercio.pagina_web}` : '',
            comercio.plataforma_carrera ? `💻 Aula Virtual: ${comercio.plataforma_carrera}` : '',
            comercio.resolucion_creacion ? `📜 Resolución de Creación: ${comercio.resolucion_creacion}` : '',
            comercio.resolucion_revalidacion ? `✅ Resolución de Revalidación: ${comercio.resolucion_revalidacion}` : '',
            comercio.escale_minedu ? `🎓 Código ESCALE MINEDU: ${comercio.escale_minedu}` : '',
            comercio.link_directo_escale ? `🔗 Verificación ESCALE: ${comercio.link_directo_escale}` : '',
            ofertaParts.length > 0 ? `📚 Oferta Académica: ${ofertaParts.join(' | ')}` : '',
        ].filter(Boolean);

        handleCopy(lines.join('\n'), 'Resumen Copiado');
    };

    // Filtro de oferta formativa
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
                            borderRadius: 3,
                            overflow: 'hidden',
                            position: 'relative',
                            maxHeight: '90vh',
                            bgcolor: 'background.paper',
                        },
                    },
                }}
            >
                {/* Acento superior de color institucional */}
                <Box
                    sx={{
                        height: 6,
                        bgcolor: brandColor,
                        width: '100%',
                    }}
                />

                {/* Encabezado Principal */}
                <DialogTitle
                    sx={{
                        p: { xs: 2, sm: 3 },
                        pb: 1.5,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        justifyContent: 'space-between',
                        gap: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
                        {(() => {
                            const logoSrc = isDark
                                ? (comercio.logo_modo_oscuro || comercio.logo_modo_claro)
                                : (comercio.logo_modo_claro || comercio.logo_modo_oscuro);

                            if (logoSrc) {
                                return (
                                    <Box
                                        sx={{
                                            height: 56,
                                            width: 95,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            p: 0.8,
                                            bgcolor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#ffffff',
                                            borderRadius: 2,
                                            border: '1px solid',
                                            borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
                                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={logoSrc}
                                            alt={`Logo ${comercio.nombre}`}
                                            sx={{
                                                maxHeight: 46,
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
                                        width: 54,
                                        height: 54,
                                        bgcolor: brandColor,
                                        color: '#ffffff',
                                        fontWeight: 900,
                                        fontSize: '1.2rem',
                                        boxShadow: `0 4px 14px ${brandColor}40`,
                                        border: '2px solid rgba(255, 255, 255, 0.4)',
                                    }}
                                >
                                    {(comercio.sigla || comercio.nombre || 'C').substring(0, 3).toUpperCase()}
                                </Avatar>
                            );
                        })()}

                        <Box sx={{ minWidth: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                                    {comercio.nombre}
                                </Typography>
                                {comercio.sigla && (
                                    <Chip
                                        label={comercio.sigla}
                                        size="small"
                                        sx={{
                                            bgcolor: `${brandColor}18`,
                                            color: brandColor,
                                            fontWeight: 800,
                                            fontSize: '0.75rem',
                                        }}
                                    />
                                )}
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                {comercio.grupo?.nombre ? `División ${comercio.grupo.nombre}` : 'Grupo Capsur'} • Ficha de Consulta Interna
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, alignSelf: { xs: 'flex-end', sm: 'center' } }}>
                        <Tooltip title="Copiar resumen para WhatsApp / cliente" arrow>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<ContentCopyIcon fontSize="small" />}
                                onClick={handleCopyQuickSummary}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                    color: brandColor,
                                    borderColor: brandColor,
                                    '&:hover': {
                                        borderColor: brandColor,
                                        bgcolor: `${brandColor}12`,
                                    },
                                }}
                            >
                                {copiedText === 'Resumen Copiado' ? '¡Copiado!' : 'Copiar Resumen'}
                            </Button>
                        </Tooltip>
                        <IconButton onClick={onClose} size="small" aria-label="Cerrar">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                {/* Navegación por pestañas */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', px: { xs: 1.5, sm: 3 } }}>
                    <Tabs
                        value={currentTab}
                        onChange={(_, val) => setCurrentTab(val)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            '& .MuiTabs-indicator': {
                                bgcolor: brandColor,
                                height: 3,
                            },
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.88rem',
                                minHeight: 48,
                                gap: 1,
                                '&.Mui-selected': {
                                    color: `${brandColor} !important`,
                                },
                            },
                        }}
                    >
                        <Tab icon={<BusinessIcon fontSize="small" />} iconPosition="start" label="Identidad & Medios" />
                        <Tab icon={<VerifiedUserIcon fontSize="small" />} iconPosition="start" label="Acreditación MINEDU" />
                        <Tab
                            icon={<SchoolIcon fontSize="small" />}
                            iconPosition="start"
                            label={`Oferta Formativa (${carreras.length + especialidades.length + diplomados.length + cursos.length})`}
                        />
                        <Tab icon={<MenuBookIcon fontSize="small" />} iconPosition="start" label="Enlaces & Descargas" />
                    </Tabs>
                </Box>

                {/* Contenido scrolleable */}
                <DialogContent sx={{ p: { xs: 2, sm: 3 }, minHeight: 340 }}>
                    {/* ========================================================================= */}
                    {/* PESTAÑA 0: IDENTIDAD & MEDIOS */}
                    {/* ========================================================================= */}
                    {currentTab === 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {/* Descripción */}
                            {comercio.descripcion && (
                                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, bgcolor: 'action.hover' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.8, color: brandColor }}>
                                        Sobre la Institución
                                    </Typography>
                                    <Typography variant="body2" sx={{ lineHeight: 1.6, color: 'text.secondary' }}>
                                        {comercio.descripcion}
                                    </Typography>
                                </Paper>
                            )}

                            {/* Enlaces Oficiales */}
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                    Portales y Aulas Digitales
                                </Typography>
                                <Grid container spacing={2}>
                                    {comercio.pagina_web && (
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Card variant="outlined" sx={{ borderRadius: 2, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{ bgcolor: `${brandColor}15`, color: brandColor, width: 38, height: 38 }}>
                                                        <LanguageIcon fontSize="small" />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                            Página Web Oficial
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {comercio.pagina_web}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    component="a"
                                                    href={comercio.pagina_web}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    endIcon={<LaunchIcon fontSize="small" />}
                                                    sx={{ borderRadius: 1.5, textTransform: 'none', bgcolor: brandColor, fontWeight: 700 }}
                                                >
                                                    Visitar
                                                </Button>
                                            </Card>
                                        </Grid>
                                    )}

                                    {comercio.plataforma_carrera && (
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Card variant="outlined" sx={{ borderRadius: 2, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{ bgcolor: isGoogleDriveUrl(comercio.plataforma_carrera) ? 'rgba(38, 132, 252, 0.12)' : `${brandColor}18`, color: brandColor, width: 38, height: 38 }}>
                                                        {isGoogleDriveUrl(comercio.plataforma_carrera) ? <GoogleDriveIcon size={20} /> : <SchoolIcon fontSize="small" />}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                            Plataforma / Aula Virtual
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {isGoogleDriveUrl(comercio.plataforma_carrera) ? 'Google Drive' : comercio.plataforma_carrera}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    component="a"
                                                    href={comercio.plataforma_carrera}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    startIcon={isGoogleDriveUrl(comercio.plataforma_carrera) ? <GoogleDriveIcon size={15} /> : undefined}
                                                    endIcon={<LaunchIcon fontSize="small" />}
                                                    sx={{
                                                        borderRadius: 1.5,
                                                        textTransform: 'none',
                                                        fontWeight: 700,
                                                        bgcolor: brandColor,
                                                        color: '#ffffff',
                                                        '&:hover': {
                                                            bgcolor: brandColor,
                                                            filter: 'brightness(0.9)',
                                                        },
                                                    }}
                                                >
                                                    Ingresar
                                                </Button>
                                            </Card>
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>

                            {/* Instructivo para Ingresar a la Plataforma */}
                            {comercio.como_ingresar_plataforma && (
                                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, bgcolor: 'background.paper', borderColor: brandColor }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <InfoOutlinedIcon sx={{ color: brandColor }} fontSize="small" />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: brandColor }}>
                                            ¿Cómo ingresar al Aula Virtual? (Guía para el Alumno)
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ color: 'text.primary', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                                        {comercio.como_ingresar_plataforma}
                                    </Typography>
                                    <Button
                                        size="small"
                                        startIcon={<ContentCopyIcon fontSize="small" />}
                                        onClick={() => handleCopy(comercio.como_ingresar_plataforma || '', 'Instructivo')}
                                        sx={{
                                            mt: 1.5,
                                            textTransform: 'none',
                                            fontSize: '0.78rem',
                                            color: brandColor,
                                            '&:hover': {
                                                bgcolor: `${brandColor}10`,
                                            },
                                        }}
                                    >
                                        {copiedText === 'Instructivo' ? '¡Instructivo Copiado!' : 'Copiar Instructivo para Alumno'}
                                    </Button>
                                </Paper>
                            )}

                            {/* Director, Convenios y Promociones */}
                            <Grid container spacing={2}>
                                {comercio.reconocimiento_director && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                                                Director / Reconocimiento
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                                                {comercio.reconocimiento_director}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                )}

                                {comercio.promocion_vigente && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(234, 88, 12, 0.08)' : '#fff7ed',
                                                borderColor: '#ea580c',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                gap: 1.5,
                                            }}
                                        >
                                            <Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 0.5 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LocalOfferIcon sx={{ fontSize: 18, color: '#ea580c' }} />
                                                        <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: '#ea580c' }}>
                                                            Promoción Vigente
                                                        </Typography>
                                                    </Box>
                                                    <Chip
                                                        label="Link Oficial"
                                                        size="small"
                                                        sx={{ bgcolor: 'rgba(234, 88, 12, 0.15)', color: '#ea580c', fontWeight: 800, height: 20, fontSize: '0.65rem' }}
                                                    />
                                                </Box>
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                                    Campaña de Beneficios y Descuentos
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                    Enlace oficial a promociones y becas activas del comercio.
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    component="a"
                                                    href={comercio.promocion_vigente.startsWith('http') ? comercio.promocion_vigente : `https://${comercio.promocion_vigente}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    startIcon={<LocalOfferIcon fontSize="small" />}
                                                    endIcon={<LaunchIcon sx={{ fontSize: '14px !important' }} />}
                                                    sx={{
                                                        bgcolor: '#ea580c',
                                                        color: '#ffffff',
                                                        '&:hover': { bgcolor: '#c2410c' },
                                                        borderRadius: 1.5,
                                                        textTransform: 'none',
                                                        fontWeight: 700,
                                                        fontSize: '0.8rem',
                                                    }}
                                                >
                                                    Ver Promoción
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<ContentCopyIcon fontSize="small" />}
                                                    onClick={() => handleCopy(comercio.promocion_vigente || '', 'Promoción')}
                                                    sx={{
                                                        borderRadius: 1.5,
                                                        textTransform: 'none',
                                                        fontSize: '0.78rem',
                                                        color: '#ea580c',
                                                        borderColor: '#ea580c',
                                                        '&:hover': { borderColor: '#c2410c', bgcolor: 'rgba(234, 88, 12, 0.04)' },
                                                    }}
                                                >
                                                    {copiedText === 'Promoción' ? '¡Enlace Copiado!' : 'Copiar enlace'}
                                                </Button>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                )}

                                {comercio.convenio && (
                                    <Grid size={{ xs: 12 }}>
                                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                                                Convenios Interinstitucionales
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.5 }}>
                                                {comercio.convenio}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                )}
                            </Grid>

                            {/* Galería de Fotografías */}
                            {comercio.fotos && comercio.fotos.length > 0 && (
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                        <PhotoLibraryIcon fontSize="small" sx={{ color: brandColor }} />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                            Galería Fotográfica ({comercio.fotos.length})
                                        </Typography>
                                    </Box>
                                    <Grid container spacing={1.5}>
                                        {comercio.fotos.map((foto, idx) => (
                                            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={idx}>
                                                <Box
                                                    onClick={() => setPreviewImage(foto)}
                                                    sx={{
                                                        height: 110,
                                                        borderRadius: 2,
                                                        overflow: 'hidden',
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                        '&:hover': { transform: 'scale(1.03)', boxShadow: 3 },
                                                    }}
                                                >
                                                    <Box
                                                        component="img"
                                                        src={foto}
                                                        alt={`Foto ${idx + 1}`}
                                                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        onError={(e: any) => {
                                                            e.target.src = 'https://via.placeholder.com/300x200?text=Capsur';
                                                        }}
                                                    />
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}

                            {/* Canales y Videos de YouTube */}
                            {comercio.canales_youtube && comercio.canales_youtube.length > 0 && (
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                        <YouTubeIcon fontSize="small" sx={{ color: '#dc2626' }} />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                            Canales y Videos de YouTube
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        {comercio.canales_youtube.map((yt, idx) => (
                                            <Paper
                                                key={idx}
                                                variant="outlined"
                                                sx={{
                                                    p: 1.5,
                                                    borderRadius: 1.5,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    gap: 2,
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ wordBreak: 'break-all', fontWeight: 500 }}>
                                                    {yt}
                                                </Typography>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="error"
                                                    component="a"
                                                    href={yt}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    endIcon={<LaunchIcon fontSize="small" />}
                                                    sx={{ borderRadius: 1.5, textTransform: 'none', flexShrink: 0 }}
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
                            <Paper
                                sx={{
                                    p: 2.5,
                                    borderRadius: 2,
                                    bgcolor: brandColor,
                                    color: '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                }}
                            >
                                <VerifiedUserIcon sx={{ fontSize: 40, color: '#ffffff' }} />
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                                        Acreditación y Cumplimiento Normativo MINEDU
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Resoluciones ministeriales y códigos de validación oficial para respaldar la validez de los certificados y títulos otorgados.
                                    </Typography>
                                </Box>
                            </Paper>

                            <Grid container spacing={2.5}>
                                {/* Resolución de Creación */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            borderRadius: 2.5,
                                            height: '100%',
                                            p: 2.5,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            gap: 2,
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                borderColor: brandColor,
                                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                                            },
                                        }}
                                    >
                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <WorkspacePremiumIcon sx={{ color: brandColor }} fontSize="small" />
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                                        Resolución de Creación
                                                    </Typography>
                                                </Box>
                                                {comercio.resolucion_creacion && (
                                                    <Chip
                                                        label="Documento Oficial"
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ fontWeight: 700, height: 22, fontSize: '0.7rem', color: brandColor, borderColor: brandColor }}
                                                    />
                                                )}
                                            </Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                                                Acto resolutivo oficial emitido por el Ministerio de Educación / DRE.
                                            </Typography>

                                            {comercio.resolucion_creacion ? (
                                                <Box
                                                    sx={{
                                                        p: 1.5,
                                                        borderRadius: 2,
                                                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#f8fafc',
                                                        border: '1px dashed',
                                                        borderColor: 'divider',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1.5,
                                                    }}
                                                >
                                                    <Avatar sx={{ bgcolor: brandColor, color: '#ffffff', width: 38, height: 38 }}>
                                                        <PictureAsPdfIcon fontSize="small" />
                                                    </Avatar>
                                                    <Box sx={{ minWidth: 0, flex: 1 }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                                            Documento Oficial de Creación
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                            Archivo digital normativo oficial
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            ) : (
                                                <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic', py: 1 }}>
                                                    En trámite / No especificada
                                                </Typography>
                                            )}
                                        </Box>

                                        {comercio.resolucion_creacion && (
                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    component="a"
                                                    href={comercio.resolucion_creacion.startsWith('http') ? comercio.resolucion_creacion : `https://${comercio.resolucion_creacion}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    startIcon={<PictureAsPdfIcon fontSize="small" />}
                                                    endIcon={<LaunchIcon sx={{ fontSize: '15px !important' }} />}
                                                    sx={{
                                                        borderRadius: 1.5,
                                                        textTransform: 'none',
                                                        fontWeight: 700,
                                                        bgcolor: brandColor,
                                                        color: '#ffffff',
                                                        '&:hover': {
                                                            bgcolor: brandColor,
                                                            filter: 'brightness(0.9)',
                                                        },
                                                    }}
                                                >
                                                    Ver documento
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<ContentCopyIcon fontSize="small" />}
                                                    onClick={() => handleCopy(comercio.resolucion_creacion || '', 'R. Creación')}
                                                    sx={{
                                                        borderRadius: 1.5,
                                                        textTransform: 'none',
                                                        fontSize: '0.78rem',
                                                        color: brandColor,
                                                        borderColor: brandColor,
                                                        '&:hover': {
                                                            borderColor: brandColor,
                                                            bgcolor: `${brandColor}10`,
                                                        },
                                                    }}
                                                >
                                                    {copiedText === 'R. Creación' ? '¡Enlace Copiado!' : 'Copiar enlace'}
                                                </Button>
                                            </Box>
                                        )}
                                    </Card>
                                </Grid>

                                {/* Resolución de Revalidación */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            borderRadius: 2.5,
                                            height: '100%',
                                            p: 2.5,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            gap: 2,
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                borderColor: brandColor,
                                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                                            },
                                        }}
                                    >
                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <CheckCircleIcon sx={{ color: brandColor }} fontSize="small" />
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                                        Resolución de Revalidación
                                                    </Typography>
                                                </Box>
                                                {comercio.resolucion_revalidacion && (
                                                    <Chip
                                                        label="Documento Oficial"
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ fontWeight: 700, height: 22, fontSize: '0.7rem', color: brandColor, borderColor: brandColor }}
                                                    />
                                                )}
                                            </Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                                                Actualización de condiciones básicas de calidad pedagógica e institucional.
                                            </Typography>

                                            {comercio.resolucion_revalidacion ? (
                                                <Box
                                                    sx={{
                                                        p: 1.5,
                                                        borderRadius: 2,
                                                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#f8fafc',
                                                        border: '1px dashed',
                                                        borderColor: 'divider',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1.5,
                                                    }}
                                                >
                                                    <Avatar sx={{ bgcolor: brandColor, color: '#ffffff', width: 38, height: 38 }}>
                                                        <PictureAsPdfIcon fontSize="small" />
                                                    </Avatar>
                                                    <Box sx={{ minWidth: 0, flex: 1 }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                                            Documento Oficial de Revalidación
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                            Archivo digital normativo oficial
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            ) : (
                                                <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic', py: 1 }}>
                                                    En proceso de revalidación / No registrada
                                                </Typography>
                                            )}
                                        </Box>

                                        {comercio.resolucion_revalidacion && (
                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    component="a"
                                                    href={comercio.resolucion_revalidacion.startsWith('http') ? comercio.resolucion_revalidacion : `https://${comercio.resolucion_revalidacion}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    startIcon={<PictureAsPdfIcon fontSize="small" />}
                                                    endIcon={<LaunchIcon sx={{ fontSize: '15px !important' }} />}
                                                    sx={{
                                                        borderRadius: 1.5,
                                                        textTransform: 'none',
                                                        fontWeight: 700,
                                                        bgcolor: brandColor,
                                                        color: '#ffffff',
                                                        '&:hover': {
                                                            bgcolor: brandColor,
                                                            filter: 'brightness(0.9)',
                                                        },
                                                    }}
                                                >
                                                    Ver documento
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<ContentCopyIcon fontSize="small" />}
                                                    onClick={() => handleCopy(comercio.resolucion_revalidacion || '', 'R. Revalidación')}
                                                    sx={{
                                                        borderRadius: 1.5,
                                                        textTransform: 'none',
                                                        fontSize: '0.78rem',
                                                        color: brandColor,
                                                        borderColor: brandColor,
                                                        '&:hover': {
                                                            borderColor: brandColor,
                                                            bgcolor: `${brandColor}10`,
                                                        },
                                                    }}
                                                >
                                                    {copiedText === 'R. Revalidación' ? '¡Enlace Copiado!' : 'Copiar enlace'}
                                                </Button>
                                            </Box>
                                        )}
                                    </Card>
                                </Grid>

                                {/* Código ESCALE MINEDU */}
                                <Grid size={{ xs: 12 }}>
                                    <Card variant="outlined" sx={{ borderRadius: 2.5, p: 2.5, bgcolor: 'action.hover' }}>
                                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: brandColor }}>
                                                    Registro Oficial ESCALE MINEDU
                                                </Typography>
                                                <Typography variant="h5" sx={{ fontWeight: 900, mt: 0.5, letterSpacing: '0.05em' }}>
                                                    {comercio.escale_minedu || 'Sin código registrado'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Padrón oficial de instituciones educativas de la Unidad de Estadística del MINEDU.
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                                                {comercio.escale_minedu && (
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        startIcon={<ContentCopyIcon fontSize="small" />}
                                                        onClick={() => handleCopy(comercio.escale_minedu || '', 'ESCALE')}
                                                        sx={{
                                                            borderRadius: 1.5,
                                                            textTransform: 'none',
                                                            fontWeight: 600,
                                                            color: brandColor,
                                                            borderColor: brandColor,
                                                            '&:hover': {
                                                                borderColor: brandColor,
                                                                bgcolor: `${brandColor}10`,
                                                            },
                                                        }}
                                                    >
                                                        {copiedText === 'ESCALE' ? '¡Código Copiado!' : 'Copiar Código'}
                                                    </Button>
                                                )}
                                                {comercio.link_directo_escale && (
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        component="a"
                                                        href={comercio.link_directo_escale}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        endIcon={<LaunchIcon fontSize="small" />}
                                                        sx={{
                                                            borderRadius: 1.5,
                                                            textTransform: 'none',
                                                            fontWeight: 700,
                                                            bgcolor: brandColor,
                                                            color: '#ffffff',
                                                            '&:hover': {
                                                                bgcolor: brandColor,
                                                                filter: 'brightness(0.9)',
                                                            },
                                                        }}
                                                    >
                                                        Verificar en ESCALE
                                                    </Button>
                                                )}
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>

                                {/* Seminario */}
                                {comercio.seminario && (
                                    <Grid size={{ xs: 12 }}>
                                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                                                Seminarios & Capacitaciones Acreditadas
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.5 }}>
                                                {comercio.seminario}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    )}

                    {/* ========================================================================= */}
                    {/* PESTAÑA 2: OFERTA FORMATIVA */}
                    {/* ========================================================================= */}
                    {currentTab === 2 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            {/* Barra de Búsqueda y Filtro de Oferta */}
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, alignItems: 'center', justifyContent: 'space-between' }}>
                                <TextField
                                    size="small"
                                    placeholder="Buscar por carrera, especialidad, diplomado o curso..."
                                    value={offerSearch}
                                    onChange={(e) => setOfferSearch(e.target.value)}
                                    sx={{ flex: 1, minWidth: { xs: '100%', sm: 260 } }}
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />

                                <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
                                    <Chip
                                        label={`Todos (${carreras.length + especialidades.length + diplomados.length + cursos.length})`}
                                        size="small"
                                        clickable
                                        onClick={() => setOfferTypeFilter('all')}
                                        sx={{
                                            fontWeight: 700,
                                            ...(offerTypeFilter === 'all'
                                                ? { bgcolor: brandColor, color: '#ffffff', borderColor: brandColor, '&:hover': { bgcolor: brandColor, filter: 'brightness(0.9)' } }
                                                : {}),
                                        }}
                                    />
                                    {carreras.length > 0 && (
                                        <Chip
                                            label={`Carreras (${carreras.length})`}
                                            size="small"
                                            clickable
                                            onClick={() => setOfferTypeFilter('carreras')}
                                            sx={{
                                                fontWeight: 700,
                                                ...(offerTypeFilter === 'carreras'
                                                    ? { bgcolor: brandColor, color: '#ffffff', borderColor: brandColor, '&:hover': { bgcolor: brandColor, filter: 'brightness(0.9)' } }
                                                    : {}),
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
                                                fontWeight: 700,
                                                ...(offerTypeFilter === 'especialidades'
                                                    ? { bgcolor: brandColor, color: '#ffffff', borderColor: brandColor, '&:hover': { bgcolor: brandColor, filter: 'brightness(0.9)' } }
                                                    : {}),
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
                                                fontWeight: 700,
                                                ...(offerTypeFilter === 'diplomados'
                                                    ? { bgcolor: brandColor, color: '#ffffff', borderColor: brandColor, '&:hover': { bgcolor: brandColor, filter: 'brightness(0.9)' } }
                                                    : {}),
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
                                                fontWeight: 700,
                                                ...(offerTypeFilter === 'cursos'
                                                    ? { bgcolor: brandColor, color: '#ffffff', borderColor: brandColor, '&:hover': { bgcolor: brandColor, filter: 'brightness(0.9)' } }
                                                    : {}),
                                            }}
                                        />
                                    )}
                                </Box>
                            </Box>

                            {totalFiltered === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 6 }}>
                                    <SchoolIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                                    <Typography variant="body1" color="text.secondary">
                                        No se encontraron programas con el criterio de búsqueda.
                                    </Typography>
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    {/* Carreras */}
                                    {filteredCarreras.length > 0 && (
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: brandColor, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                Carreras Profesionales & Técnicas ({filteredCarreras.length})
                                            </Typography>
                                            <Grid container spacing={1.5}>
                                                {filteredCarreras.map((carr) => (
                                                    <Grid size={{ xs: 12 }} key={carr.id}>
                                                        <Card variant="outlined" sx={{ p: 2, borderRadius: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1.5 }}>
                                                            <Box>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                                                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                                                                        {carr.nombre}
                                                                    </Typography>
                                                                    {carr.codigo && <Chip label={carr.codigo} size="small" variant="outlined" sx={{ fontWeight: 700 }} />}
                                                                    {carr.modalidad && <Chip label={carr.modalidad.toUpperCase()} size="small" sx={{ fontWeight: 700, bgcolor: `${brandColor}15`, color: brandColor }} />}
                                                                </Box>
                                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                                    Duración: {carr.duracion || '3 años (Modular)'} • {carr.resolucion ? `Resolución: ${carr.resolucion}` : 'Acreditado MINEDU'}
                                                                </Typography>
                                                            </Box>

                                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                                {carr.brochure && (
                                                                    <Button
                                                                        size="small"
                                                                        variant="outlined"
                                                                        component="a"
                                                                        href={carr.brochure}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        startIcon={<PictureAsPdfIcon fontSize="small" />}
                                                                        sx={{
                                                                            textTransform: 'none',
                                                                            borderRadius: 1.5,
                                                                            color: brandColor,
                                                                            borderColor: brandColor,
                                                                            '&:hover': {
                                                                                borderColor: brandColor,
                                                                                bgcolor: `${brandColor}10`,
                                                                            },
                                                                        }}
                                                                    >
                                                                        Brochure
                                                                    </Button>
                                                                )}
                                                                {carr.url_malla_curricular && (
                                                                    <Button
                                                                        size="small"
                                                                        variant="outlined"
                                                                        component="a"
                                                                        href={carr.url_malla_curricular}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        startIcon={<MenuBookIcon fontSize="small" />}
                                                                        sx={{
                                                                            textTransform: 'none',
                                                                            borderRadius: 1.5,
                                                                            color: brandColor,
                                                                            borderColor: brandColor,
                                                                            '&:hover': {
                                                                                borderColor: brandColor,
                                                                                bgcolor: `${brandColor}10`,
                                                                            },
                                                                        }}
                                                                    >
                                                                        Malla
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
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: brandColor, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                Especialidades ({filteredEspecialidades.length})
                                            </Typography>
                                            <Grid container spacing={1.5}>
                                                {filteredEspecialidades.map((esp) => (
                                                    <Grid size={{ xs: 12, sm: 6 }} key={esp.id}>
                                                        <Card variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                            <Box>
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.3 }}>
                                                                    {esp.nombre}
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                                                                    {esp.rubro?.nombre && (
                                                                        <Chip label={esp.rubro.nombre} size="small" sx={{ fontSize: '0.7rem' }} />
                                                                    )}
                                                                    {esp.precio && (
                                                                        <Chip label={`S/. ${esp.precio}`} size="small" color="success" variant="outlined" sx={{ fontWeight: 700 }} />
                                                                    )}
                                                                </Box>
                                                            </Box>

                                                            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                                                                {esp.brochure && (
                                                                    <Button
                                                                        size="small"
                                                                        variant="text"
                                                                        component="a"
                                                                        href={esp.brochure}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        startIcon={<PictureAsPdfIcon fontSize="small" />}
                                                                        sx={{
                                                                            textTransform: 'none',
                                                                            fontSize: '0.78rem',
                                                                            color: brandColor,
                                                                            '&:hover': {
                                                                                bgcolor: `${brandColor}10`,
                                                                            },
                                                                        }}
                                                                    >
                                                                        Brochure
                                                                    </Button>
                                                                )}
                                                                {esp.youtube && (
                                                                    <Button
                                                                        size="small"
                                                                        variant="text"
                                                                        color="error"
                                                                        component="a"
                                                                        href={esp.youtube}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        startIcon={<YouTubeIcon fontSize="small" />}
                                                                        sx={{ textTransform: 'none', fontSize: '0.78rem' }}
                                                                    >
                                                                        Video
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
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: brandColor, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                Diplomados de Especialización ({filteredDiplomados.length})
                                            </Typography>
                                            <Grid container spacing={1.5}>
                                                {filteredDiplomados.map((dip) => (
                                                    <Grid size={{ xs: 12, sm: 6 }} key={dip.id}>
                                                        <Card variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                            <Box>
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.3 }}>
                                                                    {dip.nombre}
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                                                                    {dip.tipo && <Chip label={dip.tipo.replace('_', ' ').toUpperCase()} size="small" sx={{ fontSize: '0.7rem' }} />}
                                                                    {dip.precio && <Chip label={`S/. ${dip.precio}`} size="small" color="success" variant="outlined" sx={{ fontWeight: 700 }} />}
                                                                </Box>
                                                            </Box>

                                                            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                                                                {dip.brochure && (
                                                                    <Button
                                                                        size="small"
                                                                        variant="text"
                                                                        component="a"
                                                                        href={dip.brochure}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        startIcon={<PictureAsPdfIcon fontSize="small" />}
                                                                        sx={{
                                                                            textTransform: 'none',
                                                                            fontSize: '0.78rem',
                                                                            color: brandColor,
                                                                            '&:hover': {
                                                                                bgcolor: `${brandColor}10`,
                                                                            },
                                                                        }}
                                                                    >
                                                                        Brochure
                                                                    </Button>
                                                                )}
                                                                {dip.youtube && (
                                                                    <Button
                                                                        size="small"
                                                                        variant="text"
                                                                        color="error"
                                                                        component="a"
                                                                        href={dip.youtube}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        startIcon={<YouTubeIcon fontSize="small" />}
                                                                        sx={{ textTransform: 'none', fontSize: '0.78rem' }}
                                                                    >
                                                                        Video
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
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: brandColor, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                Cursos & Certificaciones Técnicas ({filteredCursos.length})
                                            </Typography>
                                            <Grid container spacing={1.5}>
                                                {filteredCursos.map((cur) => (
                                                    <Grid size={{ xs: 12, sm: 6 }} key={cur.id}>
                                                        <Card variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                            <Box>
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.3 }}>
                                                                    {cur.nombre}
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                                                                    {cur.tipo && <Chip label={cur.tipo.toUpperCase()} size="small" sx={{ fontSize: '0.7rem' }} />}
                                                                    {cur.precio && <Chip label={`S/. ${cur.precio}`} size="small" color="success" variant="outlined" sx={{ fontWeight: 700 }} />}
                                                                </Box>
                                                            </Box>

                                                            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                                                                {cur.brochure && (
                                                                    <Button
                                                                        size="small"
                                                                        variant="text"
                                                                        component="a"
                                                                        href={cur.brochure}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        startIcon={<PictureAsPdfIcon fontSize="small" />}
                                                                        sx={{
                                                                            textTransform: 'none',
                                                                            fontSize: '0.78rem',
                                                                            color: brandColor,
                                                                            '&:hover': {
                                                                                bgcolor: `${brandColor}10`,
                                                                            },
                                                                        }}
                                                                    >
                                                                        Brochure
                                                                    </Button>
                                                                )}
                                                                {cur.youtube && (
                                                                    <Button
                                                                        size="small"
                                                                        variant="text"
                                                                        color="error"
                                                                        component="a"
                                                                        href={cur.youtube}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        startIcon={<YouTubeIcon fontSize="small" />}
                                                                        sx={{ textTransform: 'none', fontSize: '0.78rem' }}
                                                                    >
                                                                        Video
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
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                Documentación y Archivos Oficiales
                            </Typography>

                            <Grid container spacing={2}>
                                {comercio.catalogo_url && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <PictureAsPdfIcon color="error" />
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                        Catálogo Institucional (PDF)
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Brochure general de la marca
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                component="a"
                                                href={comercio.catalogo_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                endIcon={<LaunchIcon fontSize="small" />}
                                                sx={{
                                                    borderRadius: 1.5,
                                                    textTransform: 'none',
                                                    color: brandColor,
                                                    borderColor: brandColor,
                                                    '&:hover': {
                                                        borderColor: brandColor,
                                                        bgcolor: `${brandColor}10`,
                                                    },
                                                }}
                                            >
                                                Abrir
                                            </Button>
                                        </Paper>
                                    </Grid>
                                )}
                                {comercio.brochure_vacaciones_utiles && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <PictureAsPdfIcon sx={{ color: brandColor }} />
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                        Brochure Vacaciones Útiles
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Programa de vacaciones útiles
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                component="a"
                                                href={comercio.brochure_vacaciones_utiles.startsWith('http') ? comercio.brochure_vacaciones_utiles : `https://${comercio.brochure_vacaciones_utiles}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                startIcon={<PictureAsPdfIcon fontSize="small" />}
                                                endIcon={<LaunchIcon fontSize="small" />}
                                                sx={{
                                                    borderRadius: 1.5,
                                                    textTransform: 'none',
                                                    fontWeight: 700,
                                                    bgcolor: brandColor,
                                                    color: '#ffffff',
                                                    '&:hover': {
                                                        bgcolor: brandColor,
                                                        filter: 'brightness(0.9)',
                                                    },
                                                }}
                                            >
                                                Ver documento
                                            </Button>
                                        </Paper>
                                    </Grid>
                                )}

                                {comercio.malla_curricular_url && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <MenuBookIcon sx={{ color: brandColor }} />
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                        Malla Curricular General
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Planes de estudio
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                component="a"
                                                href={comercio.malla_curricular_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                endIcon={<LaunchIcon fontSize="small" />}
                                                sx={{
                                                    borderRadius: 1.5,
                                                    textTransform: 'none',
                                                    color: brandColor,
                                                    borderColor: brandColor,
                                                    '&:hover': {
                                                        borderColor: brandColor,
                                                        bgcolor: `${brandColor}10`,
                                                    },
                                                }}
                                            >
                                                Abrir
                                            </Button>
                                        </Paper>
                                    </Grid>
                                )}

                                {comercio.certificado_url && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <WorkspacePremiumIcon sx={{ color: brandColor }} />
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                        Modelo de Certificado
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Formato de certificación oficial
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                component="a"
                                                href={comercio.certificado_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                endIcon={<LaunchIcon fontSize="small" />}
                                                sx={{
                                                    borderRadius: 1.5,
                                                    textTransform: 'none',
                                                    color: brandColor,
                                                    borderColor: brandColor,
                                                    '&:hover': {
                                                        borderColor: brandColor,
                                                        bgcolor: `${brandColor}10`,
                                                    },
                                                }}
                                            >
                                                Abrir
                                            </Button>
                                        </Paper>
                                    </Grid>
                                )}

                                {comercio.link_directo_escale && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <VerifiedUserIcon sx={{ color: brandColor }} />
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                        Enlace Directo ESCALE
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Consulta en padrón MINEDU
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                component="a"
                                                href={comercio.link_directo_escale}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                endIcon={<LaunchIcon fontSize="small" />}
                                                sx={{
                                                    borderRadius: 1.5,
                                                    textTransform: 'none',
                                                    color: brandColor,
                                                    borderColor: brandColor,
                                                    '&:hover': {
                                                        borderColor: brandColor,
                                                        bgcolor: `${brandColor}10`,
                                                    },
                                                }}
                                            >
                                                Consultar
                                            </Button>
                                        </Paper>
                                    </Grid>
                                )}
                                {comercio.resolucion_creacion && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <WorkspacePremiumIcon sx={{ color: brandColor }} />
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                        Resolución de Creación
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Acto normativo oficial MINEDU
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                component="a"
                                                href={comercio.resolucion_creacion.startsWith('http') ? comercio.resolucion_creacion : `https://${comercio.resolucion_creacion}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                startIcon={<PictureAsPdfIcon fontSize="small" />}
                                                endIcon={<LaunchIcon sx={{ fontSize: '15px !important' }} />}
                                                sx={{
                                                    borderRadius: 1.5,
                                                    textTransform: 'none',
                                                    fontWeight: 700,
                                                    bgcolor: brandColor,
                                                    color: '#ffffff',
                                                    '&:hover': {
                                                        bgcolor: brandColor,
                                                        filter: 'brightness(0.9)',
                                                    },
                                                }}
                                            >
                                                Ver documento
                                            </Button>
                                        </Paper>
                                    </Grid>
                                )}

                                {comercio.resolucion_revalidacion && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <CheckCircleIcon sx={{ color: brandColor }} />
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                        Resolución de Revalidación
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Actualización de calidad MINEDU
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                component="a"
                                                href={comercio.resolucion_revalidacion.startsWith('http') ? comercio.resolucion_revalidacion : `https://${comercio.resolucion_revalidacion}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                startIcon={<PictureAsPdfIcon fontSize="small" />}
                                                endIcon={<LaunchIcon sx={{ fontSize: '15px !important' }} />}
                                                sx={{
                                                    borderRadius: 1.5,
                                                    textTransform: 'none',
                                                    fontWeight: 700,
                                                    bgcolor: brandColor,
                                                    color: '#ffffff',
                                                    '&:hover': {
                                                        bgcolor: brandColor,
                                                        filter: 'brightness(0.9)',
                                                    },
                                                }}
                                            >
                                                Ver documento
                                            </Button>
                                        </Paper>
                                    </Grid>
                                )}
                                {comercio.promocion_vigente && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                borderColor: '#ea580c',
                                                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(234, 88, 12, 0.05)' : '#fffaf5',
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <LocalOfferIcon sx={{ color: '#ea580c' }} />
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#ea580c' }}>
                                                        Promoción Vigente
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Campaña y descuentos activos
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                component="a"
                                                href={comercio.promocion_vigente.startsWith('http') ? comercio.promocion_vigente : `https://${comercio.promocion_vigente}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                startIcon={<LocalOfferIcon fontSize="small" />}
                                                endIcon={<LaunchIcon fontSize="small" />}
                                                sx={{
                                                    borderRadius: 1.5,
                                                    textTransform: 'none',
                                                    fontWeight: 700,
                                                    bgcolor: '#ea580c',
                                                    color: '#fff',
                                                    '&:hover': { bgcolor: '#c2410c' },
                                                }}
                                            >
                                                Ver Promoción
                                            </Button>
                                        </Paper>
                                    </Grid>
                                )}
                            </Grid>

                            {comercio.fotos && comercio.fotos.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                        <PhotoLibraryIcon sx={{ fontSize: 20, color: brandColor }} />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                            Galería Fotográfica y Sedes ({comercio.fotos.length})
                                        </Typography>
                                    </Box>
                                    <Grid container spacing={2}>
                                        {comercio.fotos.map((fotoUrl, idx) => (
                                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                                                <Card
                                                    variant="outlined"
                                                    sx={{
                                                        borderRadius: 2.5,
                                                        overflow: 'hidden',
                                                        transition: 'all 0.2s',
                                                        '&:hover': {
                                                            transform: 'translateY(-3px)',
                                                            boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                                                        },
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            position: 'relative',
                                                            height: 160,
                                                            width: '100%',
                                                            overflow: 'hidden',
                                                            bgcolor: 'action.hover',
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={() => setPreviewImage(getDriveDirectImageUrl(fotoUrl))}
                                                    >
                                                        <Box
                                                            component="img"
                                                            src={getDriveDirectImageUrl(fotoUrl)}
                                                            alt={`Sede o foto ${idx + 1}`}
                                                            sx={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',
                                                                display: 'block',
                                                                transition: 'transform 0.3s',
                                                                '&:hover': { transform: 'scale(1.05)' },
                                                            }}
                                                        />
                                                        {isGoogleDriveUrl(fotoUrl) && (
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
                                                                    fontSize: '0.65rem',
                                                                    height: 22,
                                                                    '& .MuiChip-icon': { ml: 0.5 },
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                                                        <Box sx={{ minWidth: 0, flex: 1 }}>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem' }} noWrap>
                                                                Foto / Sede {idx + 1}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                                                                {isGoogleDriveUrl(fotoUrl) ? 'Google Drive' : 'Foto institucional'}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                                                            <Tooltip title="Ampliar foto" arrow>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => setPreviewImage(getDriveDirectImageUrl(fotoUrl))}
                                                                    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}
                                                                >
                                                                    <VisibilityIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Abrir en Google Drive" arrow>
                                                                <IconButton
                                                                    size="small"
                                                                    component="a"
                                                                    href={fotoUrl.startsWith('http') ? fotoUrl : `https://${fotoUrl}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    sx={{
                                                                        border: '1px solid',
                                                                        borderColor: 'divider',
                                                                        borderRadius: 1.5,
                                                                        color: brandColor,
                                                                        '&:hover': {
                                                                            borderColor: brandColor,
                                                                            bgcolor: `${brandColor}10`,
                                                                        },
                                                                    }}
                                                                >
                                                                    <LaunchIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>

                {/* Pie del modal */}
                <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 2, borderTop: 1, borderColor: 'divider', justifyContent: 'flex-end' }}>
                    <Button
                        onClick={onClose}
                        variant="contained"
                        sx={{
                            borderRadius: 1.5,
                            px: 3,
                            fontWeight: 700,
                            bgcolor: brandColor,
                            color: '#ffffff',
                            '&:hover': {
                                bgcolor: brandColor,
                                filter: 'brightness(0.9)',
                            },
                        }}
                    >
                        Cerrar Ficha
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal para previsualizar foto en tamaño grande */}
            <Dialog
                open={Boolean(previewImage)}
                onClose={() => setPreviewImage(null)}
                maxWidth="md"
                slotProps={{ paper: { sx: { bgcolor: 'transparent', boxShadow: 'none', overflow: 'hidden' } } }}
            >
                {previewImage && (
                    <Box sx={{ position: 'relative', textAlign: 'center' }}>
                        <IconButton
                            onClick={() => setPreviewImage(null)}
                            sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0, 0, 0, 0.6)', color: '#fff', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' } }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Box
                            component="img"
                            src={previewImage}
                            alt="Previsualización"
                            sx={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 2, objectFit: 'contain' }}
                        />
                    </Box>
                )}
            </Dialog>
        </>
    );
}
