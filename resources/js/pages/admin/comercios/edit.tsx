import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { dashboard } from '@/routes';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import DomainIcon from '@mui/icons-material/Domain';
import ImageIcon from '@mui/icons-material/Image';
import LanguageIcon from '@mui/icons-material/Language';
import LaunchIcon from '@mui/icons-material/Launch';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SaveIcon from '@mui/icons-material/Save';
import SchoolIcon from '@mui/icons-material/School';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    CircularProgress,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import type { Comercio, Grupo, Carrera, Curso, Diplomado } from '@/types';

interface EditComercioPageProps {
    comercio: Comercio & { carreras?: Carrera[]; cursos?: Curso[]; diplomados?: Diplomado[] };
    grupos: Grupo[];
}

const COLOR_PRESETS = [
    '#0c43a3',
    '#1d4ed8',
    '#0284c7',
    '#059669',
    '#16a34a',
    '#d97706',
    '#ea580c',
    '#dc2626',
    '#7c3aed',
    '#4b5563',
];

export default function EditComercioPage({ comercio, grupos }: EditComercioPageProps) {
    const { currentTeam } = usePage<{ currentTeam?: { slug: string; name: string } }>().props;
    const currentTeamSlug = currentTeam?.slug || 'default';

    const [nuevoYoutube, setNuevoYoutube] = useState('');
    const [nuevaFoto, setNuevaFoto] = useState('');

    const { data, setData, put, processing, errors } = useForm({
        grupo_id: String(comercio.grupo_id),
        nombre: comercio.nombre || '',
        sigla: comercio.sigla || comercio.codigo || '',
        color_hex: comercio.color_hex || '#0c43a3',
        pagina_web: comercio.pagina_web || '',
        plataforma_carrera: comercio.plataforma_carrera || '',
        certificado_url: comercio.certificado_url || '',
        resolucion_revalidacion: comercio.resolucion_revalidacion || '',
        resolucion_creacion: comercio.resolucion_creacion || '',
        escale_minedu: comercio.escale_minedu || '',
        link_directo_escale: comercio.link_directo_escale || '',
        malla_curricular_url: comercio.malla_curricular_url || '',
        catalogo_url: comercio.catalogo_url || '',
        como_ingresar_plataforma: comercio.como_ingresar_plataforma || '',
        reconocimiento_director: comercio.reconocimiento_director || '',
        seminario: comercio.seminario || '',
        convenio: comercio.convenio || '',
        promocion_vigente: comercio.promocion_vigente || '',
        canales_youtube: comercio.canales_youtube || [],
        fotos: comercio.fotos || [],
        descripcion: comercio.descripcion || '',
        activo: Boolean(comercio.activo),
    });

    const isAcademic =
        comercio.slug === 'istp-avanti' ||
        comercio.slug === 'istp-sis' ||
        comercio.codigo === 'AVANTI' ||
        comercio.codigo === 'SIS' ||
        (comercio.carreras && comercio.carreras.length > 0);

    const hasCursos =
        comercio.slug === 'next-online' ||
        comercio.codigo === 'NEXT' ||
        comercio.slug === 'cecava' ||
        comercio.codigo === 'CECAVA' ||
        comercio.slug === 'cecava-min' ||
        comercio.codigo === 'CECAVA-MIN' ||
        comercio.slug === 'matpel' ||
        comercio.codigo === 'MATPEL' ||
        (comercio.cursos && comercio.cursos.length > 0);

    const hasDiplomados =
        comercio.slug === 'magister' ||
        comercio.codigo === 'MAGISTER' ||
        comercio.slug === 'cecava' ||
        comercio.codigo === 'CECAVA' ||
        comercio.slug === 'cecava-min' ||
        comercio.codigo === 'CECAVA-MIN' ||
        comercio.slug === 'matpel' ||
        comercio.codigo === 'MATPEL' ||
        (comercio.diplomados && comercio.diplomados.length > 0);

    const isCecavaMin =
        comercio.slug === 'cecava-min' ||
        comercio.codigo === 'CECAVA-MIN';

    const isMatpel =
        comercio.slug === 'matpel' ||
        comercio.codigo === 'MATPEL';

    const isAvanti =
        comercio.slug === 'istp-avanti' ||
        comercio.codigo === 'AVANTI';

    const isDiplomadoLibre = isCecavaMin || isMatpel;

    const standaloneDiplomados = comercio.diplomados?.filter((d) => !d.carrera_id) || [];
    const standaloneCursos = comercio.cursos?.filter((c) => !c.carrera_id) || [];

    const showStandaloneDiplomados =
        (hasDiplomados && !isAcademic) || (isAcademic && standaloneDiplomados.length > 0);

    const showStandaloneCursos =
        (hasCursos && !isAcademic) || (isAcademic && standaloneCursos.length > 0);

    const getDiplomadoChip = (tipo?: string | null) => {
        if (!tipo || tipo === 'general' || tipo === 'libre' || tipo === 'sin_categoria') {
            return (
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '0.72rem' }}>
                    Sin categoría
                </Typography>
            );
        }

        switch (tipo) {
            case 'ambientales':
                return (
                    <Chip
                        label="Ambientales"
                        size="small"
                        sx={{ bgcolor: '#ecfdf5', color: '#065f46', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #a7f3d0' }}
                    />
                );
            case 'calidad_isos':
                return (
                    <Chip
                        label="Calidad ISOs"
                        size="small"
                        sx={{ bgcolor: '#eff6ff', color: '#1e40af', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #bfdbfe' }}
                    />
                );
            case 'mineros':
                return (
                    <Chip
                        label="Mineros"
                        size="small"
                        sx={{ bgcolor: '#fff7ed', color: '#9a3412', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #fed7aa' }}
                    />
                );
            case 'administracion':
                return (
                    <Chip
                        label="Administración"
                        size="small"
                        sx={{ bgcolor: '#f0fdfa', color: '#115e59', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #99f6e4' }}
                    />
                );
            case 'arquitectura_ingenieria':
                return (
                    <Chip
                        label="Arq. e Ingeniería"
                        size="small"
                        sx={{ bgcolor: '#eef2ff', color: '#3730a3', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #c7d2fe' }}
                    />
                );
            case 'osha':
                return (
                    <Chip
                        label="OSHA"
                        size="small"
                        sx={{ bgcolor: '#fef2f2', color: '#991b1b', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #fecaca' }}
                    />
                );
            case 'comercio_exterior':
                return (
                    <Chip
                        label="Comex"
                        size="small"
                        sx={{ bgcolor: '#ecfeff', color: '#155e75', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #a5f3fc' }}
                    />
                );
            case 'rubro_legal':
                return (
                    <Chip
                        label="Rubro Legal"
                        size="small"
                        sx={{ bgcolor: '#f5f3ff', color: '#5b21b6', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #ddd6fe' }}
                    />
                );
            case 'no_actualizados':
                return (
                    <Chip
                        label="No Actualizado"
                        size="small"
                        sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #cbd5e1' }}
                    />
                );
            case 'nombramiento':
                return (
                    <Chip
                        label="Nombramiento"
                        size="small"
                        sx={{ bgcolor: '#ede9fe', color: '#5b21b6', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #c4b5fd' }}
                    />
                );
            case 'secundaria':
                return (
                    <Chip
                        label="Secundaria"
                        size="small"
                        sx={{ bgcolor: '#ecfdf5', color: '#065f46', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #a7f3d0' }}
                    />
                );
            case 'generico':
            default:
                return (
                    <Chip
                        label="Genérico"
                        size="small"
                        sx={{ bgcolor: '#f0f9ff', color: '#0369a1', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #bae6fd' }}
                    />
                );
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/${currentTeamSlug}/admin/comercios/${comercio.id}`);
    };

    const handleAddYoutube = () => {
        if (!nuevoYoutube.trim()) return;
        setData('canales_youtube', [...data.canales_youtube, nuevoYoutube.trim()]);
        setNuevoYoutube('');
    };

    const handleRemoveYoutube = (index: number) => {
        setData(
            'canales_youtube',
            data.canales_youtube.filter((_, i) => i !== index)
        );
    };

    const handleAddFoto = () => {
        if (!nuevaFoto.trim()) return;
        setData('fotos', [...data.fotos, nuevaFoto.trim()]);
        setNuevaFoto('');
    };

    const handleRemoveFoto = (index: number) => {
        setData(
            'fotos',
            data.fotos.filter((_, i) => i !== index)
        );
    };

    return (
        <>
            <Head title={`Editar ${comercio.nombre} - Catálogo Capsur`} />

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3.5,
                    maxWidth: 1400,
                    mx: 'auto',
                }}
            >
                {/* Cabecera Principal */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Link href={`/${currentTeamSlug}/admin/comercios`} style={{ textDecoration: 'none' }}>
                            <Button
                                variant="outlined"
                                color="inherit"
                                size="small"
                                startIcon={<ArrowBackIcon />}
                                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                            >
                                Volver al Listado
                            </Button>
                        </Link>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                                <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
                                    {data.nombre || comercio.nombre}
                                </Typography>
                                <Chip
                                    label={data.sigla || comercio.codigo || 'COMERCIO'}
                                    sx={{
                                        bgcolor: data.color_hex || '#0c43a3',
                                        color: '#ffffff',
                                        fontWeight: 'bold',
                                        fontSize: '0.75rem',
                                    }}
                                />
                                {isAcademic && (
                                    <Chip
                                        icon={<SchoolIcon sx={{ fontSize: '14px !important' }} />}
                                        label="Instituto Oficial"
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                )}
                                {hasCursos && (
                                    <Chip
                                        icon={<MenuBookIcon sx={{ fontSize: '14px !important' }} />}
                                        label="Cursos Online"
                                        size="small"
                                        color="secondary"
                                        variant="outlined"
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                )}
                                {hasDiplomados && (
                                    <Chip
                                        icon={<WorkspacePremiumIcon sx={{ fontSize: '14px !important' }} />}
                                        label="Diplomados y Posgrados"
                                        size="small"
                                        color="info"
                                        variant="outlined"
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                )}
                                <Chip
                                    label={data.activo ? 'ACTIVO' : 'INACTIVO'}
                                    color={data.activo ? 'success' : 'default'}
                                    size="small"
                                    sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
                                />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Edición de información general, enlaces institucionales, acreditación MINEDU y oferta formativa.
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* BLOQUE 1: INFORMACIÓN GENERAL E IDENTIDAD */}
                <Card variant="outlined" sx={{ borderRadius: 3 }}>
                    <CardHeader
                        avatar={<BusinessIcon color="primary" />}
                        title="1. Información General e Identidad Institucional"
                        subheader="Configuración de nombres, marcas, siglas y estado operativo en el catálogo"
                        titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
                    />
                    <Divider />
                    <CardContent sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 8, md: 5 }}>
                                <TextField
                                    label="Nombre Institucional *"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    placeholder="Ej. ISTP SIS, ISTP AVANTI, NEXT-ONLINE..."
                                    error={!!errors.nombre}
                                    helperText={errors.nombre}
                                    fullWidth
                                    required
                                    size="small"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                                <TextField
                                    label="Sigla / Código Corto"
                                    value={data.sigla}
                                    onChange={(e) => setData('sigla', e.target.value)}
                                    placeholder="Ej. SIS, CEI, NXT"
                                    error={!!errors.sigla}
                                    helperText={errors.sigla}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <FormControl fullWidth size="small" error={!!errors.grupo_id}>
                                    <InputLabel id="grupo-select-label">Grupo Comercial *</InputLabel>
                                    <Select
                                        labelId="grupo-select-label"
                                        value={data.grupo_id}
                                        label="Grupo Comercial *"
                                        onChange={(e) => setData('grupo_id', e.target.value)}
                                    >
                                        {grupos.map((g) => (
                                            <MenuItem key={g.id} value={String(g.id)}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <DomainIcon fontSize="small" color="action" />
                                                    <span>{g.nombre}</span>
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={data.activo}
                                            onChange={(e) => setData('activo', e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label={data.activo ? 'Comercio Activo' : 'Inactivo'}
                                    sx={{ mt: 0.5 }}
                                />
                            </Grid>

                            {/* Selector de Color de Marca */}
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>
                                    COLOR DISTINTIVO DE MARCA (HEX)
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <input
                                            type="color"
                                            value={data.color_hex}
                                            onChange={(e) => setData('color_hex', e.target.value)}
                                            style={{
                                                width: 38,
                                                height: 38,
                                                padding: 0,
                                                border: '1px solid #d1d5db',
                                                borderRadius: 6,
                                                cursor: 'pointer',
                                            }}
                                        />
                                        <TextField
                                            size="small"
                                            value={data.color_hex}
                                            onChange={(e) => setData('color_hex', e.target.value)}
                                            sx={{ width: 120 }}
                                            placeholder="#0c43a3"
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, flexWrap: 'wrap' }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
                                            Predefinidos:
                                        </Typography>
                                        {COLOR_PRESETS.map((color) => (
                                            <Box
                                                key={color}
                                                onClick={() => setData('color_hex', color)}
                                                sx={{
                                                    width: 26,
                                                    height: 26,
                                                    borderRadius: '50%',
                                                    bgcolor: color,
                                                    cursor: 'pointer',
                                                    border: data.color_hex === color ? '2px solid #000000' : '1px solid rgba(0,0,0,0.1)',
                                                    transform: data.color_hex === color ? 'scale(1.15)' : 'scale(1)',
                                                    transition: 'all 0.15s ease-in-out',
                                                    '&:hover': { transform: 'scale(1.2)' },
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Descripción Institucional / Resumen"
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    placeholder="Breve reseña sobre el comercio o instituto..."
                                    error={!!errors.descripcion}
                                    helperText={errors.descripcion}
                                    fullWidth
                                    multiline
                                    rows={2}
                                    size="small"
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* BLOQUE 2: ENLACES Y PRESENCIA DIGITAL */}
                <Card variant="outlined" sx={{ borderRadius: 3 }}>
                    <CardHeader
                        avatar={<LanguageIcon color="primary" />}
                        title="2. Enlaces y Presencia Digital"
                        subheader="Accesos web oficiales, portales de consulta y recursos multimedia"
                        titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
                    />
                    <Divider />
                    <CardContent sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <TextField
                                    label="Página Web Oficial (URL)"
                                    value={data.pagina_web}
                                    onChange={(e) => setData('pagina_web', e.target.value)}
                                    placeholder="https://..."
                                    error={!!errors.pagina_web}
                                    helperText={errors.pagina_web}
                                    fullWidth
                                    size="small"
                                    slotProps={{
                                        input: {
                                            endAdornment: data.pagina_web ? (
                                                <InputAdornment position="end">
                                                    <IconButton href={data.pagina_web} target="_blank" size="small">
                                                        <LaunchIcon fontSize="inherit" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ) : null,
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <TextField
                                    label="Certificado Digital (URL PDF)"
                                    value={data.certificado_url}
                                    onChange={(e) => setData('certificado_url', e.target.value)}
                                    placeholder="https://.../certificado.pdf"
                                    error={!!errors.certificado_url}
                                    helperText={errors.certificado_url}
                                    fullWidth
                                    size="small"
                                    slotProps={{
                                        input: {
                                            endAdornment: data.certificado_url ? (
                                                <InputAdornment position="end">
                                                    <IconButton href={data.certificado_url} target="_blank" size="small">
                                                        <PictureAsPdfIcon fontSize="inherit" color="primary" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ) : null,
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <TextField
                                    label="Catálogo Institucional (URL PDF / Enlace)"
                                    value={data.catalogo_url}
                                    onChange={(e) => setData('catalogo_url', e.target.value)}
                                    placeholder="https://.../catalogo.pdf"
                                    error={!!errors.catalogo_url}
                                    helperText={errors.catalogo_url}
                                    fullWidth
                                    size="small"
                                    slotProps={{
                                        input: {
                                            endAdornment: data.catalogo_url ? (
                                                <InputAdornment position="end">
                                                    <IconButton href={data.catalogo_url} target="_blank" size="small">
                                                        <LaunchIcon fontSize="inherit" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ) : null,
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                <TextField
                                    label="Promoción Vigente (Texto o Enlace Informativo)"
                                    value={data.promocion_vigente}
                                    onChange={(e) => setData('promocion_vigente', e.target.value)}
                                    placeholder="Ej. Beca 50% de descuento en matrícula de verano"
                                    error={!!errors.promocion_vigente}
                                    helperText={errors.promocion_vigente}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                <TextField
                                    label="Tutorial / ¿Cómo ingresar a la plataforma? (Video o Guía)"
                                    value={data.como_ingresar_plataforma}
                                    onChange={(e) => setData('como_ingresar_plataforma', e.target.value)}
                                    placeholder="https://youtube.com/watch?v=..."
                                    error={!!errors.como_ingresar_plataforma}
                                    helperText={errors.como_ingresar_plataforma}
                                    fullWidth
                                    size="small"
                                    slotProps={{
                                        input: {
                                            endAdornment: data.como_ingresar_plataforma ? (
                                                <InputAdornment position="end">
                                                    <IconButton href={data.como_ingresar_plataforma} target="_blank" size="small">
                                                        <YouTubeIcon fontSize="inherit" color="error" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ) : null,
                                        },
                                    }}
                                />
                            </Grid>

                            {/* Canales y Videos de YouTube */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <YouTubeIcon color="error" fontSize="small" />
                                    <span>Videos y Canales de YouTube</span>
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                                    <TextField
                                        size="small"
                                        placeholder="Pegar URL de YouTube..."
                                        value={nuevoYoutube}
                                        onChange={(e) => setNuevoYoutube(e.target.value)}
                                        fullWidth
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddYoutube();
                                            }
                                        }}
                                    />
                                    <Button variant="contained" size="small" onClick={handleAddYoutube} sx={{ minWidth: 40, px: 2 }}>
                                        <AddIcon fontSize="small" />
                                    </Button>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {data.canales_youtube.map((url, index) => (
                                        <Paper key={index} variant="outlined" sx={{ p: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                                            <Typography variant="body2" sx={{ fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {url}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                                                <IconButton href={url} target="_blank" size="small">
                                                    <LaunchIcon fontSize="inherit" />
                                                </IconButton>
                                                <IconButton size="small" color="error" onClick={() => handleRemoveYoutube(index)}>
                                                    <DeleteIcon fontSize="inherit" />
                                                </IconButton>
                                            </Box>
                                        </Paper>
                                    ))}
                                    {data.canales_youtube.length === 0 && (
                                        <Typography variant="caption" color="text.secondary">
                                            No se han agregado canales ni videos de YouTube aún.
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>

                            {/* Galería de Fotos / Sedes */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ImageIcon color="primary" fontSize="small" />
                                    <span>Galería de Fotos Institucionales / Sedes</span>
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                                    <TextField
                                        size="small"
                                        placeholder="Pegar URL de Imagen / Foto..."
                                        value={nuevaFoto}
                                        onChange={(e) => setNuevaFoto(e.target.value)}
                                        fullWidth
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddFoto();
                                            }
                                        }}
                                    />
                                    <Button variant="contained" size="small" onClick={handleAddFoto} sx={{ minWidth: 40, px: 2 }}>
                                        <AddIcon fontSize="small" />
                                    </Button>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {data.fotos.map((url, index) => (
                                        <Paper key={index} variant="outlined" sx={{ p: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                                            <Typography variant="body2" sx={{ fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {url}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                                                <IconButton href={url} target="_blank" size="small">
                                                    <LaunchIcon fontSize="inherit" />
                                                </IconButton>
                                                <IconButton size="small" color="error" onClick={() => handleRemoveFoto(index)}>
                                                    <DeleteIcon fontSize="inherit" />
                                                </IconButton>
                                            </Box>
                                        </Paper>
                                    ))}
                                    {data.fotos.length === 0 && (
                                        <Typography variant="caption" color="text.secondary">
                                            No se han registrado fotografías aún.
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* BLOQUE 3: ACREDITACIÓN INSTITUCIONAL Y REGISTRO MINEDU */}
                <Card variant="outlined" sx={{ borderRadius: 3 }}>
                    <CardHeader
                        avatar={<VerifiedUserIcon color="primary" />}
                        title="3. Acreditación Institucional y Registro MINEDU"
                        subheader="Resoluciones oficiales, registros ESCALE, plataforma educativa y reconocimientos"
                        titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
                    />
                    <Divider />
                    <CardContent sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                <TextField
                                    label="Resolución de Creación (PDF / Documento)"
                                    value={data.resolucion_creacion}
                                    onChange={(e) => setData('resolucion_creacion', e.target.value)}
                                    placeholder="https://.../resolucion-creacion.pdf"
                                    error={!!errors.resolucion_creacion}
                                    helperText={errors.resolucion_creacion}
                                    fullWidth
                                    size="small"
                                    slotProps={{
                                        input: {
                                            endAdornment: data.resolucion_creacion ? (
                                                <InputAdornment position="end">
                                                    <IconButton href={data.resolucion_creacion} target="_blank" size="small">
                                                        <PictureAsPdfIcon fontSize="inherit" color="primary" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ) : null,
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                <TextField
                                    label="Resolución de Revalidación (PDF / Documento)"
                                    value={data.resolucion_revalidacion}
                                    onChange={(e) => setData('resolucion_revalidacion', e.target.value)}
                                    placeholder="https://.../resolucion-revalidacion.pdf"
                                    error={!!errors.resolucion_revalidacion}
                                    helperText={errors.resolucion_revalidacion}
                                    fullWidth
                                    size="small"
                                    slotProps={{
                                        input: {
                                            endAdornment: data.resolucion_revalidacion ? (
                                                <InputAdornment position="end">
                                                    <IconButton href={data.resolucion_revalidacion} target="_blank" size="small">
                                                        <PictureAsPdfIcon fontSize="inherit" color="secondary" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ) : null,
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <TextField
                                    label="Código / Padrón ESCALE - MINEDU"
                                    value={data.escale_minedu}
                                    onChange={(e) => setData('escale_minedu', e.target.value)}
                                    placeholder="https://escale.minedu.gob.pe/... o Código modular"
                                    error={!!errors.escale_minedu}
                                    helperText={errors.escale_minedu}
                                    fullWidth
                                    size="small"
                                    slotProps={{
                                        input: {
                                            endAdornment: data.escale_minedu ? (
                                                <InputAdornment position="end">
                                                    <IconButton href={data.escale_minedu} target="_blank" size="small">
                                                        <LaunchIcon fontSize="inherit" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ) : null,
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <TextField
                                    label="Link Directo Consulta ESCALE"
                                    value={data.link_directo_escale}
                                    onChange={(e) => setData('link_directo_escale', e.target.value)}
                                    placeholder="https://escale.minedu.gob.pe/padron-ce?..."
                                    error={!!errors.link_directo_escale}
                                    helperText={errors.link_directo_escale}
                                    fullWidth
                                    size="small"
                                    slotProps={{
                                        input: {
                                            endAdornment: data.link_directo_escale ? (
                                                <InputAdornment position="end">
                                                    <IconButton href={data.link_directo_escale} target="_blank" size="small">
                                                        <LaunchIcon fontSize="inherit" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ) : null,
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <TextField
                                    label="Brochure Malla Curricular General"
                                    value={data.malla_curricular_url}
                                    onChange={(e) => setData('malla_curricular_url', e.target.value)}
                                    placeholder="https://.../malla-curricular.pdf"
                                    error={!!errors.malla_curricular_url}
                                    helperText={errors.malla_curricular_url}
                                    fullWidth
                                    size="small"
                                    slotProps={{
                                        input: {
                                            endAdornment: data.malla_curricular_url ? (
                                                <InputAdornment position="end">
                                                    <IconButton href={data.malla_curricular_url} target="_blank" size="small">
                                                        <PictureAsPdfIcon fontSize="inherit" color="primary" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ) : null,
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                <TextField
                                    label="Plataforma Virtual / Aula Virtual de Carrera"
                                    value={data.plataforma_carrera}
                                    onChange={(e) => setData('plataforma_carrera', e.target.value)}
                                    placeholder="https://aula.comercio.edu.pe"
                                    error={!!errors.plataforma_carrera}
                                    helperText={errors.plataforma_carrera}
                                    fullWidth
                                    size="small"
                                    slotProps={{
                                        input: {
                                            endAdornment: data.plataforma_carrera ? (
                                                <InputAdornment position="end">
                                                    <IconButton href={data.plataforma_carrera} target="_blank" size="small">
                                                        <LaunchIcon fontSize="inherit" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ) : null,
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                <TextField
                                    label="Reconocimiento de Director (PDF / Documento)"
                                    value={data.reconocimiento_director}
                                    onChange={(e) => setData('reconocimiento_director', e.target.value)}
                                    placeholder="https://.../reconocimiento-director.pdf"
                                    error={!!errors.reconocimiento_director}
                                    helperText={errors.reconocimiento_director}
                                    fullWidth
                                    size="small"
                                    slotProps={{
                                        input: {
                                            endAdornment: data.reconocimiento_director ? (
                                                <InputAdornment position="end">
                                                    <IconButton href={data.reconocimiento_director} target="_blank" size="small">
                                                        <WorkspacePremiumIcon fontSize="inherit" color="primary" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ) : null,
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                <TextField
                                    label="Seminarios / Talleres Especiales (Enlace)"
                                    value={data.seminario}
                                    onChange={(e) => setData('seminario', e.target.value)}
                                    placeholder="https://.../seminarios"
                                    error={!!errors.seminario}
                                    helperText={errors.seminario}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                <TextField
                                    label="Convenios Institucionales (Alianzas / Redes)"
                                    value={data.convenio}
                                    onChange={(e) => setData('convenio', e.target.value)}
                                    placeholder="Convenios con universidades, empresas, colegios profesionales..."
                                    error={!!errors.convenio}
                                    helperText={errors.convenio}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* BLOQUE: OFERTA FORMATIVA */}
                {/* 1. CARRERAS PROFESIONALES CON DIPLOMADOS Y CURSOS ASOCIADOS (AVANTI / SIS) */}
                {isAcademic && (
                    <Card variant="outlined" sx={{ borderRadius: 3 }}>
                        <CardHeader
                            avatar={<SchoolIcon color="primary" />}
                            title="4. Carreras Profesionales, Diplomados y Cursos Registrados"
                            subheader={`Planes de estudio oficiales registrados para ${comercio.nombre}, junto con sus diplomados y cursos especializados.`}
                            titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
                            action={
                                <Link
                                    href={`/${currentTeamSlug}/admin/carreras?comercio_id=${comercio.id}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<SchoolIcon />}
                                        endIcon={<LaunchIcon sx={{ fontSize: '12px !important' }} />}
                                        sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                                    >
                                        Administrar Carreras
                                    </Button>
                                </Link>
                            }
                        />
                        <Divider />
                        <CardContent sx={{ p: 3 }}>
                            {comercio.carreras && comercio.carreras.length > 0 ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    {comercio.carreras.map((carrera) => (
                                        <Paper
                                            key={carrera.id}
                                            variant="outlined"
                                            sx={{
                                                p: 2.5,
                                                borderRadius: 2.5,
                                                borderColor: '#cbd5e1',
                                                bgcolor: '#f8fafc',
                                            }}
                                        >
                                            {/* Carrera Header & Document Buttons */}
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: { xs: 'column', md: 'row' },
                                                    justifyContent: 'space-between',
                                                    alignItems: { xs: 'flex-start', md: 'center' },
                                                    gap: 1.5,
                                                    mb: 2,
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <SchoolIcon color="primary" sx={{ fontSize: 28 }} />
                                                    <Box>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                                            {carrera.nombre}
                                                        </Typography>
                                                        {carrera.codigo && (
                                                            <Chip
                                                                label={carrera.codigo}
                                                                size="small"
                                                                sx={{ fontSize: '0.7rem', height: 20, bgcolor: '#e2e8f0', fontWeight: 700, mt: 0.3 }}
                                                            />
                                                        )}
                                                    </Box>
                                                </Box>

                                                {/* Action Buttons for Carrera Docs */}
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                    {carrera.url_malla_curricular ? (
                                                        <Button
                                                            href={carrera.url_malla_curricular}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            size="small"
                                                            startIcon={<PictureAsPdfIcon fontSize="small" color="primary" />}
                                                            endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                            sx={{ textTransform: 'none', fontSize: '0.75rem', bgcolor: '#ffffff', border: '1px solid #cbd5e1', fontWeight: 600 }}
                                                        >
                                                            Malla Curricular
                                                        </Button>
                                                    ) : null}
                                                    {carrera.url_declaracion_jurada ? (
                                                        <Button
                                                            href={carrera.url_declaracion_jurada}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            size="small"
                                                            startIcon={<DescriptionIcon fontSize="small" color="secondary" />}
                                                            endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                            sx={{ textTransform: 'none', fontSize: '0.75rem', bgcolor: '#ffffff', border: '1px solid #cbd5e1', fontWeight: 600 }}
                                                        >
                                                            Declaración Jurada
                                                        </Button>
                                                    ) : null}
                                                    {carrera.modelo_certificado ? (
                                                        <Button
                                                            href={carrera.modelo_certificado}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            size="small"
                                                            startIcon={<WorkspacePremiumIcon fontSize="small" color="success" />}
                                                            endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                            sx={{ textTransform: 'none', fontSize: '0.75rem', bgcolor: '#ffffff', border: '1px solid #cbd5e1', fontWeight: 600 }}
                                                        >
                                                            Modelo Certificado
                                                        </Button>
                                                    ) : null}
                                                </Box>
                                            </Box>

                                            <Divider sx={{ my: 2 }} />

                                            {/* DIPLOMADOS DE LA CARRERA */}
                                            <Box sx={{ mb: 3 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.2 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e40af', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                        <WorkspacePremiumIcon fontSize="small" sx={{ color: '#1e40af' }} />
                                                        Diplomados de {carrera.nombre} ({carrera.diplomados?.length || 0})
                                                    </Typography>
                                                    <Link
                                                        href={`/${currentTeamSlug}/admin/diplomados?comercio_id=${comercio.id}`}
                                                        style={{ textDecoration: 'none' }}
                                                    >
                                                        <Button size="small" sx={{ fontSize: '0.72rem', textTransform: 'none', py: 0.2 }}>
                                                            + Administrar Diplomados
                                                        </Button>
                                                    </Link>
                                                </Box>

                                                {carrera.diplomados && carrera.diplomados.length > 0 ? (
                                                    <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: '#ffffff', borderRadius: 1.5 }}>
                                                        <Table size="small">
                                                            <TableHead>
                                                                <TableRow sx={{ bgcolor: '#1e3a8a' }}>
                                                                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                                                                        Nombre del Diplomado
                                                                    </TableCell>
                                                                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.72rem', textTransform: 'uppercase', width: 90 }}>
                                                                        Flyer
                                                                    </TableCell>
                                                                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.72rem', textTransform: 'uppercase', width: 90 }}>
                                                                        Brochure
                                                                    </TableCell>
                                                                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.72rem', textTransform: 'uppercase', width: 90 }}>
                                                                        YouTube
                                                                    </TableCell>
                                                                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.72rem', textTransform: 'uppercase', width: 85 }}>
                                                                        Precio
                                                                    </TableCell>
                                                                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.72rem', textTransform: 'uppercase', width: 100 }}>
                                                                        Actualizado Drive
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {carrera.diplomados.map((dip) => (
                                                                    <TableRow key={dip.id} hover>
                                                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                                                                            {dip.nombre}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {dip.flyer ? (
                                                                                <Button
                                                                                    href={dip.flyer}
                                                                                    target="_blank"
                                                                                    rel="noreferrer"
                                                                                    size="small"
                                                                                    startIcon={<ImageIcon fontSize="small" sx={{ color: '#ea580c' }} />}
                                                                                    endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                                                    sx={{ textTransform: 'none', fontSize: '0.72rem', p: 0.2, fontWeight: 600 }}
                                                                                >
                                                                                    Flyer
                                                                                </Button>
                                                                            ) : (
                                                                                <Typography variant="caption" color="text.disabled">-</Typography>
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {dip.brochure ? (
                                                                                <Button
                                                                                    href={dip.brochure}
                                                                                    target="_blank"
                                                                                    rel="noreferrer"
                                                                                    size="small"
                                                                                    startIcon={<DescriptionIcon fontSize="small" sx={{ color: '#2563eb' }} />}
                                                                                    endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                                                    sx={{ textTransform: 'none', fontSize: '0.72rem', p: 0.2, fontWeight: 600 }}
                                                                                >
                                                                                    Brochure
                                                                                </Button>
                                                                            ) : (
                                                                                <Typography variant="caption" color="text.disabled">-</Typography>
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {dip.youtube ? (
                                                                                <Button
                                                                                    href={dip.youtube}
                                                                                    target="_blank"
                                                                                    rel="noreferrer"
                                                                                    size="small"
                                                                                    startIcon={<YouTubeIcon fontSize="small" color="error" />}
                                                                                    endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                                                    sx={{ textTransform: 'none', fontSize: '0.72rem', p: 0.2, fontWeight: 600 }}
                                                                                >
                                                                                    YouTube
                                                                                </Button>
                                                                            ) : (
                                                                                <Typography variant="caption" color="text.disabled">-</Typography>
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {dip.precio ? (
                                                                                <Chip
                                                                                    label={dip.precio}
                                                                                    size="small"
                                                                                    variant="outlined"
                                                                                    color="primary"
                                                                                    sx={{ fontWeight: 'bold', fontSize: '0.72rem', height: 22 }}
                                                                                />
                                                                            ) : (
                                                                                <Typography variant="caption" color="text.disabled">-</Typography>
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {dip.actualizado_drive ? (
                                                                                <Button
                                                                                    href={dip.actualizado_drive}
                                                                                    target="_blank"
                                                                                    rel="noreferrer"
                                                                                    size="small"
                                                                                    startIcon={<CloudDoneIcon fontSize="small" sx={{ color: '#059669' }} />}
                                                                                    endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                                                    sx={{ textTransform: 'none', fontSize: '0.72rem', p: 0.2, fontWeight: 600, color: '#059669' }}
                                                                                >
                                                                                    Drive
                                                                                </Button>
                                                                            ) : (
                                                                                <Typography variant="caption" color="text.disabled">-</Typography>
                                                                            )}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                ) : (
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', display: 'block', pl: 1 }}>
                                                        Sin diplomados registrados para esta carrera.
                                                    </Typography>
                                                )}
                                            </Box>

                                            {/* CURSOS DE LA CARRERA */}
                                            <Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.2 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f766e', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                        <MenuBookIcon fontSize="small" sx={{ color: '#0f766e' }} />
                                                        Cursos de {carrera.nombre} ({carrera.cursos?.length || 0})
                                                    </Typography>
                                                    <Link
                                                        href={`/${currentTeamSlug}/admin/cursos?comercio_id=${comercio.id}`}
                                                        style={{ textDecoration: 'none' }}
                                                    >
                                                        <Button size="small" sx={{ fontSize: '0.72rem', textTransform: 'none', py: 0.2, color: '#0f766e' }}>
                                                            + Administrar Cursos
                                                        </Button>
                                                    </Link>
                                                </Box>

                                                {carrera.cursos && carrera.cursos.length > 0 ? (
                                                    <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: '#ffffff', borderRadius: 1.5 }}>
                                                        <Table size="small">
                                                            <TableHead>
                                                                <TableRow sx={{ bgcolor: '#0f766e' }}>
                                                                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                                                                        Nombre del Curso
                                                                    </TableCell>
                                                                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.72rem', textTransform: 'uppercase', width: 90 }}>
                                                                        Flyer
                                                                    </TableCell>
                                                                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.72rem', textTransform: 'uppercase', width: 90 }}>
                                                                        Brochure
                                                                    </TableCell>
                                                                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.72rem', textTransform: 'uppercase', width: 90 }}>
                                                                        YouTube
                                                                    </TableCell>
                                                                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.72rem', textTransform: 'uppercase', width: 85 }}>
                                                                        Precio
                                                                    </TableCell>
                                                                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.72rem', textTransform: 'uppercase', width: 100 }}>
                                                                        Actualizado Drive
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {carrera.cursos.map((cur) => (
                                                                    <TableRow key={cur.id} hover>
                                                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                                                                            {cur.nombre}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {cur.flyer ? (
                                                                                <Button
                                                                                    href={cur.flyer}
                                                                                    target="_blank"
                                                                                    rel="noreferrer"
                                                                                    size="small"
                                                                                    startIcon={<ImageIcon fontSize="small" sx={{ color: '#ea580c' }} />}
                                                                                    endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                                                    sx={{ textTransform: 'none', fontSize: '0.72rem', p: 0.2, fontWeight: 600 }}
                                                                                >
                                                                                    Flyer
                                                                                </Button>
                                                                            ) : (
                                                                                <Typography variant="caption" color="text.disabled">-</Typography>
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {cur.brochure ? (
                                                                                <Button
                                                                                    href={cur.brochure}
                                                                                    target="_blank"
                                                                                    rel="noreferrer"
                                                                                    size="small"
                                                                                    startIcon={<DescriptionIcon fontSize="small" sx={{ color: '#2563eb' }} />}
                                                                                    endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                                                    sx={{ textTransform: 'none', fontSize: '0.72rem', p: 0.2, fontWeight: 600 }}
                                                                                >
                                                                                    Brochure
                                                                                </Button>
                                                                            ) : (
                                                                                <Typography variant="caption" color="text.disabled">-</Typography>
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {cur.youtube ? (
                                                                                <Button
                                                                                    href={cur.youtube}
                                                                                    target="_blank"
                                                                                    rel="noreferrer"
                                                                                    size="small"
                                                                                    startIcon={<YouTubeIcon fontSize="small" color="error" />}
                                                                                    endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                                                    sx={{ textTransform: 'none', fontSize: '0.72rem', p: 0.2, fontWeight: 600 }}
                                                                                >
                                                                                    YouTube
                                                                                </Button>
                                                                            ) : (
                                                                                <Typography variant="caption" color="text.disabled">-</Typography>
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {cur.precio ? (
                                                                                <Chip
                                                                                    label={cur.precio}
                                                                                    size="small"
                                                                                    variant="outlined"
                                                                                    color="primary"
                                                                                    sx={{ fontWeight: 'bold', fontSize: '0.72rem', height: 22 }}
                                                                                />
                                                                            ) : (
                                                                                <Typography variant="caption" color="text.disabled">-</Typography>
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {cur.actualizado_drive ? (
                                                                                <Button
                                                                                    href={cur.actualizado_drive}
                                                                                    target="_blank"
                                                                                    rel="noreferrer"
                                                                                    size="small"
                                                                                    startIcon={<CloudDoneIcon fontSize="small" sx={{ color: '#059669' }} />}
                                                                                    endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                                                    sx={{ textTransform: 'none', fontSize: '0.72rem', p: 0.2, fontWeight: 600, color: '#059669' }}
                                                                                >
                                                                                    Drive
                                                                                </Button>
                                                                            ) : (
                                                                                <Typography variant="caption" color="text.disabled">-</Typography>
                                                                            )}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                ) : (
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', display: 'block', pl: 1 }}>
                                                        Sin cursos registrados para esta carrera.
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Paper>
                                    ))}
                                </Box>
                            ) : (
                                <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 2 }}>
                                    <SchoolIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        Este instituto oficial aún no tiene carreras registradas.
                                    </Typography>
                                    <Link
                                        href={`/${currentTeamSlug}/admin/carreras?comercio_id=${comercio.id}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Button
                                            variant="contained"
                                            size="small"
                                            startIcon={<AddIcon />}
                                            sx={{ mt: 1.5, bgcolor: '#0c43a3', textTransform: 'none', fontWeight: 700 }}
                                        >
                                            Registrar Primera Carrera
                                        </Button>
                                    </Link>
                                </Paper>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* 2. DIPLOMADOS Y ESPECIALIZACIONES GENERALES / LIBRES */}
                {showStandaloneDiplomados && (
                    <Card variant="outlined" sx={{ borderRadius: 3 }}>
                        <CardHeader
                            avatar={<WorkspacePremiumIcon color="primary" />}
                            title={isDiplomadoLibre ? "Diplomados Registrados (Libres / Sin Categoría)" : "Diplomados y Especializaciones Registrados"}
                            subheader={isDiplomadoLibre ? `Oferta de diplomados libres para ${comercio.nombre} con Brochure, Flyer, YouTube, Precio y Drive` : `Oferta de diplomados por rubros técnicos para ${comercio.nombre} con Brochure, Flyer, YouTube, Precio y Drive`}
                            titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
                            action={
                                <Link
                                    href={`/${currentTeamSlug}/admin/diplomados?comercio_id=${comercio.id}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<WorkspacePremiumIcon />}
                                        endIcon={<LaunchIcon sx={{ fontSize: '12px !important' }} />}
                                        sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                                    >
                                        Administrar Diplomados
                                    </Button>
                                </Link>
                            }
                        />
                        <Divider />
                        <CardContent sx={{ p: 3 }}>
                            {comercio.diplomados && comercio.diplomados.length > 0 ? (
                                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: '#152844' }}>
                                                {!isDiplomadoLibre && (
                                                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: 120 }}>
                                                        Rubro / Categoría
                                                    </TableCell>
                                                )}
                                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: 200 }}>
                                                    Nombre del Diplomado
                                                </TableCell>
                                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: 100 }}>
                                                    Flyer
                                                </TableCell>
                                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: 100 }}>
                                                    Brochure
                                                </TableCell>
                                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: 100 }}>
                                                    YouTube
                                                </TableCell>
                                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: 90 }}>
                                                    Precio
                                                </TableCell>
                                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: 120 }}>
                                                    Actualizado Drive
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {comercio.diplomados.map((diplomado) => (
                                                <TableRow key={diplomado.id} hover>
                                                    {!isDiplomadoLibre && (
                                                        <TableCell>
                                                            {getDiplomadoChip(diplomado.tipo)}
                                                        </TableCell>
                                                    )}
                                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
                                                        {diplomado.nombre}
                                                    </TableCell>
                                                    <TableCell>
                                                        {diplomado.flyer ? (
                                                            <Button
                                                                href={diplomado.flyer}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                size="small"
                                                                startIcon={<ImageIcon fontSize="small" sx={{ color: '#ea580c' }} />}
                                                                endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                                sx={{ textTransform: 'none', fontSize: '0.75rem', p: 0.2, fontWeight: 600 }}
                                                            >
                                                                Flyer
                                                            </Button>
                                                        ) : (
                                                            <Typography variant="caption" color="text.disabled">-</Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {diplomado.brochure ? (
                                                            <Button
                                                                href={diplomado.brochure}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                size="small"
                                                                startIcon={<DescriptionIcon fontSize="small" sx={{ color: '#2563eb' }} />}
                                                                endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                                sx={{ textTransform: 'none', fontSize: '0.75rem', p: 0.2, fontWeight: 600 }}
                                                            >
                                                                Brochure
                                                            </Button>
                                                        ) : (
                                                            <Typography variant="caption" color="text.disabled">-</Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {diplomado.youtube ? (
                                                            <Button
                                                                href={diplomado.youtube}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                size="small"
                                                                startIcon={<YouTubeIcon fontSize="small" color="error" />}
                                                                endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                                sx={{ textTransform: 'none', fontSize: '0.75rem', p: 0.2, fontWeight: 600 }}
                                                            >
                                                                YouTube
                                                            </Button>
                                                        ) : (
                                                            <Typography variant="caption" color="text.disabled">-</Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {diplomado.precio ? (
                                                            <Chip
                                                                label={diplomado.precio}
                                                                size="small"
                                                                variant="outlined"
                                                                color="primary"
                                                                sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
                                                            />
                                                        ) : (
                                                            <Typography variant="caption" color="text.disabled">-</Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {diplomado.actualizado_drive ? (
                                                            <Button
                                                                href={diplomado.actualizado_drive}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                size="small"
                                                                startIcon={<CloudDoneIcon fontSize="small" sx={{ color: '#059669' }} />}
                                                                endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                                sx={{ textTransform: 'none', fontSize: '0.75rem', p: 0.2, fontWeight: 600, color: '#059669' }}
                                                            >
                                                                Drive
                                                            </Button>
                                                        ) : (
                                                            <Typography variant="caption" color="text.disabled">-</Typography>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 2 }}>
                                    <WorkspacePremiumIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        Este comercio aún no tiene diplomados registrados.
                                    </Typography>
                                    <Link
                                        href={`/${currentTeamSlug}/admin/diplomados?comercio_id=${comercio.id}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Button
                                            variant="contained"
                                            size="small"
                                            startIcon={<AddIcon />}
                                            sx={{ mt: 1.5, bgcolor: '#0c43a3', textTransform: 'none', fontWeight: 700 }}
                                        >
                                            Registrar Primer Diplomado
                                        </Button>
                                    </Link>
                                </Paper>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* 3. CURSOS Y TALLERES GENERALES / LIBRES */}
                {showStandaloneCursos && (
                    <Card variant="outlined" sx={{ borderRadius: 3 }}>
                        <CardHeader
                            avatar={<MenuBookIcon color="primary" />}
                            title={isMatpel ? "Cursos Registrados (Libres / Sin Categoría)" : "Cursos y Talleres Registrados"}
                            subheader={isMatpel ? `Oferta de cursos libres para ${comercio.nombre} con Brochure, Flyer, YouTube, Precio y Drive` : `Oferta de cursos para ${comercio.nombre} con Brochure, Flyer, YouTube, Precio y Drive`}
                            titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
                            action={
                                <Link
                                    href={`/${currentTeamSlug}/admin/cursos?comercio_id=${comercio.id}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<MenuBookIcon />}
                                        endIcon={<LaunchIcon sx={{ fontSize: '12px !important' }} />}
                                        sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                                    >
                                        Administrar Cursos
                                    </Button>
                                </Link>
                            }
                        />
                        <Divider />
                        <CardContent sx={{ p: 3 }}>
                            {comercio.cursos && comercio.cursos.length > 0 ? (
                                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: '#152844' }}>
                                                {!isMatpel && (
                                                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: 120 }}>
                                                        Tipo
                                                    </TableCell>
                                                )}
                                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: 200 }}>
                                                    Nombre del Curso
                                                </TableCell>
                                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: 100 }}>
                                                    Flyer
                                                </TableCell>
                                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: 100 }}>
                                                    Brochure
                                                </TableCell>
                                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: 100 }}>
                                                    YouTube
                                                </TableCell>
                                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: 90 }}>
                                                    Precio
                                                </TableCell>
                                                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', minWidth: 120 }}>
                                                    Actualizado Drive
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {comercio.cursos.map((curso) => {
                                                const isEsp = curso.tipo === 'especializado';
                                                return (
                                                    <TableRow key={curso.id} hover>
                                                        {!isMatpel && (
                                                            <TableCell>
                                                                {!curso.tipo ? (
                                                                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '0.72rem' }}>
                                                                        Sin tipo
                                                                    </Typography>
                                                                ) : (
                                                                    <Chip
                                                                        label={isEsp ? 'Especializado' : 'Tradicional'}
                                                                        size="small"
                                                                        sx={{
                                                                            bgcolor: isEsp ? '#f3e8ff' : '#e0f2fe',
                                                                            color: isEsp ? '#6b21a8' : '#0369a1',
                                                                            fontWeight: 700,
                                                                            fontSize: '0.72rem',
                                                                            border: `1px solid ${isEsp ? '#d8b4fe' : '#bae6fd'}`,
                                                                        }}
                                                                    />
                                                                )}
                                                            </TableCell>
                                                        )}
                                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
                                                            {curso.nombre}
                                                        </TableCell>
                                                        <TableCell>
                                                            {curso.flyer ? (
                                                                <Button
                                                                    href={curso.flyer}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    size="small"
                                                                    startIcon={<ImageIcon fontSize="small" sx={{ color: '#ea580c' }} />}
                                                                    endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                                    sx={{ textTransform: 'none', fontSize: '0.75rem', p: 0.2, fontWeight: 600 }}
                                                                >
                                                                    Flyer
                                                                </Button>
                                                            ) : (
                                                                <Typography variant="caption" color="text.disabled">-</Typography>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {curso.brochure ? (
                                                                <Button
                                                                    href={curso.brochure}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    size="small"
                                                                    startIcon={<DescriptionIcon fontSize="small" sx={{ color: '#2563eb' }} />}
                                                                    endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                                    sx={{ textTransform: 'none', fontSize: '0.75rem', p: 0.2, fontWeight: 600 }}
                                                                >
                                                                    Brochure
                                                                </Button>
                                                            ) : (
                                                                <Typography variant="caption" color="text.disabled">-</Typography>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {curso.youtube ? (
                                                                <Button
                                                                    href={curso.youtube}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    size="small"
                                                                    startIcon={<YouTubeIcon fontSize="small" color="error" />}
                                                                    endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                                    sx={{ textTransform: 'none', fontSize: '0.75rem', p: 0.2, fontWeight: 600 }}
                                                                >
                                                                    YouTube
                                                                </Button>
                                                            ) : (
                                                                <Typography variant="caption" color="text.disabled">-</Typography>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {curso.precio ? (
                                                                <Chip
                                                                    label={curso.precio}
                                                                    size="small"
                                                                    variant="outlined"
                                                                    color="primary"
                                                                    sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
                                                                />
                                                            ) : (
                                                                <Typography variant="caption" color="text.disabled">-</Typography>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {curso.actualizado_drive ? (
                                                                <Button
                                                                    href={curso.actualizado_drive}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    size="small"
                                                                    startIcon={<CloudDoneIcon fontSize="small" sx={{ color: '#059669' }} />}
                                                                    endIcon={<LaunchIcon sx={{ fontSize: '10px !important' }} />}
                                                                    sx={{ textTransform: 'none', fontSize: '0.75rem', p: 0.2, fontWeight: 600, color: '#059669' }}
                                                                >
                                                                    Drive
                                                                </Button>
                                                            ) : (
                                                                <Typography variant="caption" color="text.disabled">-</Typography>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 2 }}>
                                    <MenuBookIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        Este comercio aún no tiene cursos registrados.
                                    </Typography>
                                    <Link
                                        href={`/${currentTeamSlug}/admin/cursos?comercio_id=${comercio.id}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Button
                                            variant="contained"
                                            size="small"
                                            startIcon={<AddIcon />}
                                            sx={{ mt: 1.5, bgcolor: '#0c43a3', textTransform: 'none', fontWeight: 700 }}
                                        >
                                            Registrar Primer Curso
                                        </Button>
                                    </Link>
                                </Paper>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* 4. SIN OFERTA EDUCATIVA/CURSOS (COMERCIOS CORPORATIVOS DIRECTOS) */}
                {!isAcademic && !hasDiplomados && !hasCursos && (
                    <Card variant="outlined" sx={{ borderRadius: 3 }}>
                        <CardHeader
                            avatar={<CheckCircleIcon color="primary" />}
                            title="4. Oferta Formativa y Servicios"
                            subheader="Información sobre la actividad comercial directa del comercio"
                            titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
                        />
                        <Divider />
                        <CardContent sx={{ p: 3 }}>
                            <Paper variant="outlined" sx={{ p: 2.5, bgcolor: 'action.hover', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <CheckCircleIcon color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    Este comercio pertenece al rubro corporativo o de servicios comerciales directos y no cuenta con carreras ni cursos técnicos registrados.
                                </Typography>
                            </Paper>
                        </CardContent>
                    </Card>
                )}

                {/* Barra Inferior de Guardado */}
                <Paper
                    variant="outlined"
                    sx={{
                        p: 2.5,
                        borderRadius: 3,
                        bgcolor: 'background.paper',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: 2,
                        position: 'sticky',
                        bottom: 16,
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                        zIndex: 10,
                    }}
                >
                    <Link href={`/${currentTeamSlug}/admin/comercios`} style={{ textDecoration: 'none' }}>
                        <Button variant="outlined" color="inherit" sx={{ textTransform: 'none', fontWeight: 600, px: 2.5 }}>
                            Cancelar
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={processing}
                        startIcon={processing ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                        sx={{
                            bgcolor: '#0c43a3',
                            textTransform: 'none',
                            fontWeight: 700,
                            px: 3.5,
                            py: 1,
                            borderRadius: 2,
                            '&:hover': { bgcolor: '#152844' },
                        }}
                    >
                        Guardar Cambios
                    </Button>
                </Paper>
            </Box>
        </>
    );
}

EditComercioPage.layout = (props: { currentTeam?: { slug: string } | null; comercio?: Comercio }) => {
    const teamSlug = props?.currentTeam?.slug || 'default';
    const comercioNombre = props?.comercio?.nombre ? `Editar ${props.comercio.nombre}` : 'Editar Comercio';
    const editHref = props?.comercio?.id ? `/${teamSlug}/admin/comercios/${props.comercio.id}/edit` : '#';

    return {
        breadcrumbs: [
            {
                title: 'Dashboard',
                href: dashboard(teamSlug),
            },
            {
                title: 'Comercios e Institutos',
                href: `/${teamSlug}/admin/comercios`,
            },
            {
                title: comercioNombre,
                href: editHref,
            },
        ],
    };
};
