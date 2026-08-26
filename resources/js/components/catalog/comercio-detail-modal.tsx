import AssignmentIcon from '@mui/icons-material/Assignment';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DescriptionIcon from '@mui/icons-material/Description';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LanguageIcon from '@mui/icons-material/Language';
import LaunchIcon from '@mui/icons-material/Launch';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import YouTubeIcon from '@mui/icons-material/YouTube';
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
    const [currentTab, setCurrentTab] = useState(0);
    const [offerSearch, setOfferSearch] = useState('');
    const [offerTypeFilter, setOfferTypeFilter] = useState<'all' | 'carreras' | 'diplomados' | 'cursos'>('all');
    const [copiedText, setCopiedText] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    if (!comercio) return null;

    const brandColor = comercio.color_hex || '#0c43a3';
    const carreras = comercio.carreras || [];
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
        const lines = [
            `📌 *${comercio.nombre}* (${comercio.sigla || comercio.codigo || ''})`,
            `🏛️ Grupo: ${comercio.grupo?.nombre || 'Grupo Capsur'}`,
            comercio.pagina_web ? `🌐 Web Oficial: ${comercio.pagina_web}` : '',
            comercio.plataforma_carrera ? `💻 Aula Virtual: ${comercio.plataforma_carrera}` : '',
            comercio.resolucion_creacion ? `📜 Resolución de Creación: ${comercio.resolucion_creacion}` : '',
            comercio.resolucion_revalidacion ? `✅ Resolución de Revalidación: ${comercio.resolucion_revalidacion}` : '',
            comercio.escale_minedu ? `🎓 Código ESCALE MINEDU: ${comercio.escale_minedu}` : '',
            comercio.link_directo_escale ? `🔗 Verificación ESCALE: ${comercio.link_directo_escale}` : '',
            `📚 Oferta Académica: ${carreras.length} Carreras | ${diplomados.length} Diplomados | ${cursos.length} Cursos`,
        ].filter(Boolean);

        handleCopy(lines.join('\n'), 'Resumen Copiado');
    };

    // Filtro de oferta formativa
    const filteredCarreras = useMemo(() => {
        if (offerTypeFilter === 'diplomados' || offerTypeFilter === 'cursos') return [];
        return carreras.filter((c) =>
            c.nombre.toLowerCase().includes(offerSearch.toLowerCase()) ||
            (c.codigo && c.codigo.toLowerCase().includes(offerSearch.toLowerCase())) ||
            (c.modalidad && c.modalidad.toLowerCase().includes(offerSearch.toLowerCase()))
        );
    }, [carreras, offerSearch, offerTypeFilter]);

    const filteredDiplomados = useMemo(() => {
        if (offerTypeFilter === 'carreras' || offerTypeFilter === 'cursos') return [];
        return diplomados.filter((d) =>
            d.nombre.toLowerCase().includes(offerSearch.toLowerCase()) ||
            (d.tipo && d.tipo.toLowerCase().includes(offerSearch.toLowerCase()))
        );
    }, [diplomados, offerSearch, offerTypeFilter]);

    const filteredCursos = useMemo(() => {
        if (offerTypeFilter === 'carreras' || offerTypeFilter === 'diplomados') return [];
        return cursos.filter((c) =>
            c.nombre.toLowerCase().includes(offerSearch.toLowerCase()) ||
            (c.tipo && c.tipo.toLowerCase().includes(offerSearch.toLowerCase()))
        );
    }, [cursos, offerSearch, offerTypeFilter]);

    const totalFiltered = filteredCarreras.length + filteredDiplomados.length + filteredCursos.length;

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
                                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}
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
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.88rem',
                                minHeight: 48,
                                gap: 1,
                            },
                        }}
                    >
                        <Tab icon={<BusinessIcon fontSize="small" />} iconPosition="start" label="Identidad & Medios" />
                        <Tab icon={<VerifiedUserIcon fontSize="small" />} iconPosition="start" label="Acreditación MINEDU" />
                        <Tab
                            icon={<SchoolIcon fontSize="small" />}
                            iconPosition="start"
                            label={`Oferta Formativa (${carreras.length + diplomados.length + cursos.length})`}
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
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.8, color: 'primary.main' }}>
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
                                                    <Avatar sx={{ bgcolor: 'info.light', color: 'info.dark', width: 38, height: 38 }}>
                                                        <SchoolIcon fontSize="small" />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                            Plataforma / Aula Virtual
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {comercio.plataforma_carrera}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="info"
                                                    component="a"
                                                    href={comercio.plataforma_carrera}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    endIcon={<LaunchIcon fontSize="small" />}
                                                    sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 700 }}
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
                                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, bgcolor: 'background.paper', borderColor: 'info.main' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <InfoOutlinedIcon color="info" fontSize="small" />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'info.main' }}>
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
                                        sx={{ mt: 1.5, textTransform: 'none', fontSize: '0.78rem' }}
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
                                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: 'success.light', color: 'success.dark', borderColor: 'success.main' }}>
                                            <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>
                                                Promoción Vigente
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>
                                                {comercio.promocion_vigente}
                                            </Typography>
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
                                        <PhotoLibraryIcon fontSize="small" color="primary" />
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
                                    bgcolor: 'primary.main',
                                    color: '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                }}
                            >
                                <VerifiedUserIcon sx={{ fontSize: 40, color: '#54d8ee' }} />
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
                                    <Card variant="outlined" sx={{ borderRadius: 2.5, height: '100%', p: 2.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <WorkspacePremiumIcon color="primary" fontSize="small" />
                                                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                                    Resolución de Creación
                                                </Typography>
                                            </Box>
                                            <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', mt: 1 }}>
                                                {comercio.resolucion_creacion || 'En trámite / No especificada'}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                Acto resolutivo oficial emitido por el Ministerio de Educación / DRE.
                                            </Typography>
                                        </Box>
                                        {comercio.resolucion_creacion && (
                                            <Button
                                                size="small"
                                                startIcon={<ContentCopyIcon fontSize="small" />}
                                                onClick={() => handleCopy(comercio.resolucion_creacion || '', 'R. Creación')}
                                                sx={{ mt: 2, alignSelf: 'flex-start', textTransform: 'none' }}
                                            >
                                                {copiedText === 'R. Creación' ? '¡Resolución Copiada!' : 'Copiar Resolución'}
                                            </Button>
                                        )}
                                    </Card>
                                </Grid>

                                {/* Resolución de Revalidación */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Card variant="outlined" sx={{ borderRadius: 2.5, height: '100%', p: 2.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <CheckCircleIcon color="success" fontSize="small" />
                                                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                                    Resolución de Revalidación
                                                </Typography>
                                            </Box>
                                            <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', mt: 1 }}>
                                                {comercio.resolucion_revalidacion || 'En proceso de revalidación'}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                Actualización de condiciones básicas de calidad pedagógica e institucional.
                                            </Typography>
                                        </Box>
                                        {comercio.resolucion_revalidacion && (
                                            <Button
                                                size="small"
                                                startIcon={<ContentCopyIcon fontSize="small" />}
                                                onClick={() => handleCopy(comercio.resolucion_revalidacion || '', 'R. Revalidación')}
                                                sx={{ mt: 2, alignSelf: 'flex-start', textTransform: 'none' }}
                                            >
                                                {copiedText === 'R. Revalidación' ? '¡Resolución Copiada!' : 'Copiar Resolución'}
                                            </Button>
                                        )}
                                    </Card>
                                </Grid>

                                {/* Código ESCALE MINEDU */}
                                <Grid size={{ xs: 12 }}>
                                    <Card variant="outlined" sx={{ borderRadius: 2.5, p: 2.5, bgcolor: 'action.hover' }}>
                                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>
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
                                                        sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600 }}
                                                    >
                                                        {copiedText === 'ESCALE' ? '¡Código Copiado!' : 'Copiar Código'}
                                                    </Button>
                                                )}
                                                {comercio.link_directo_escale && (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        component="a"
                                                        href={comercio.link_directo_escale}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        endIcon={<LaunchIcon fontSize="small" />}
                                                        sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 700 }}
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
                                    placeholder="Buscar por carrera, diplomado o curso..."
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
                                        label={`Todos (${carreras.length + diplomados.length + cursos.length})`}
                                        size="small"
                                        clickable
                                        color={offerTypeFilter === 'all' ? 'primary' : 'default'}
                                        onClick={() => setOfferTypeFilter('all')}
                                        sx={{ fontWeight: 700 }}
                                    />
                                    {carreras.length > 0 && (
                                        <Chip
                                            label={`Carreras (${carreras.length})`}
                                            size="small"
                                            clickable
                                            color={offerTypeFilter === 'carreras' ? 'primary' : 'default'}
                                            onClick={() => setOfferTypeFilter('carreras')}
                                            sx={{ fontWeight: 700 }}
                                        />
                                    )}
                                    {diplomados.length > 0 && (
                                        <Chip
                                            label={`Diplomados (${diplomados.length})`}
                                            size="small"
                                            clickable
                                            color={offerTypeFilter === 'diplomados' ? 'primary' : 'default'}
                                            onClick={() => setOfferTypeFilter('diplomados')}
                                            sx={{ fontWeight: 700 }}
                                        />
                                    )}
                                    {cursos.length > 0 && (
                                        <Chip
                                            label={`Cursos (${cursos.length})`}
                                            size="small"
                                            clickable
                                            color={offerTypeFilter === 'cursos' ? 'primary' : 'default'}
                                            onClick={() => setOfferTypeFilter('cursos')}
                                            sx={{ fontWeight: 700 }}
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
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: 'primary.main', textTransform: 'uppercase', letterSpacing: 0.5 }}>
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
                                                                    {carr.modalidad && <Chip label={carr.modalidad.toUpperCase()} size="small" color="info" sx={{ fontWeight: 700 }} />}
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
                                                                        sx={{ textTransform: 'none', borderRadius: 1.5 }}
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
                                                                        sx={{ textTransform: 'none', borderRadius: 1.5 }}
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

                                    {/* Diplomados */}
                                    {filteredDiplomados.length > 0 && (
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: 'secondary.main', textTransform: 'uppercase', letterSpacing: 0.5 }}>
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
                                                                        sx={{ textTransform: 'none', fontSize: '0.78rem' }}
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
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: 'success.main', textTransform: 'uppercase', letterSpacing: 0.5 }}>
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
                                                                        sx={{ textTransform: 'none', fontSize: '0.78rem' }}
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
                                                sx={{ borderRadius: 1.5, textTransform: 'none' }}
                                            >
                                                Abrir
                                            </Button>
                                        </Paper>
                                    </Grid>
                                )}

                                {comercio.malla_curricular_url && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <MenuBookIcon color="primary" />
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
                                                sx={{ borderRadius: 1.5, textTransform: 'none' }}
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
                                                <WorkspacePremiumIcon color="secondary" />
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
                                                sx={{ borderRadius: 1.5, textTransform: 'none' }}
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
                                                <VerifiedUserIcon color="success" />
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
                                                sx={{ borderRadius: 1.5, textTransform: 'none' }}
                                            >
                                                Consultar
                                            </Button>
                                        </Paper>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    )}
                </DialogContent>

                {/* Pie del modal */}
                <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 2, borderTop: 1, borderColor: 'divider', justifyContent: 'space-between' }}>
                    <Chip
                        label="MODO CONSULTA • SOLO LECTURA"
                        size="small"
                        sx={{ bgcolor: 'action.hover', fontWeight: 800, fontSize: '0.7rem', letterSpacing: 0.5 }}
                    />
                    <Button onClick={onClose} variant="contained" color="primary" sx={{ borderRadius: 1.5, px: 3, fontWeight: 700 }}>
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
