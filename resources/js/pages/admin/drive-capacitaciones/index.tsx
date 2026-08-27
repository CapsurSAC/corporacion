import { Head, useForm, usePage } from '@inertiajs/react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import HelpOutlineIcon from '@mui/icons-material/InfoOutlined';
import LaunchIcon from '@mui/icons-material/Launch';
import LinkIcon from '@mui/icons-material/Link';
import SaveIcon from '@mui/icons-material/Save';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    InputAdornment,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { useNotification } from '@/hooks/use-notification';

interface Props {
    driveEscifor: string;
    driveMultimarca: string;
}

export default function DriveCapacitacionesIndex({
    driveEscifor = '',
    driveMultimarca = '',
}: Props) {
    const page = usePage();
    
    const { notify } = useNotification();

    const { data, setData, put, processing, errors } = useForm({
        drive_escifor: driveEscifor,
        drive_multimarca: driveMultimarca,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/drive-capacitaciones`, {
            preserveScroll: true,
            onSuccess: () => {
                notify.success('Enlaces de redirección guardados exitosamente.');
            },
            onError: () => {
                notify.error('Ocurrió un error al guardar los enlaces. Revisa las URLs ingresadas.');
            },
        });
    };

    const handleTestUrl = (url: string) => {
        if (!url) {
            notify.warning('Primero ingresa una URL válida para poder probarla.');
            return;
        }
        const fullUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
        window.open(fullUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <>
            <Head title="Drive Capacitaciones - Administración Grupo Capsur" />

            <Box
                sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    width: '100%',
                    boxSizing: 'border-box',
                }}
            >
                {/* Cabecera Principal */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, sm: 2.5 },
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: (theme) =>
                            theme.palette.mode === 'dark'
                                ? '0 2px 10px rgba(0,0,0,0.3)'
                                : '0 2px 10px rgba(0,0,0,0.03)',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                bgcolor: 'primary.main',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(12, 67, 163, 0.25)',
                            }}
                        >
                            <CloudDoneIcon sx={{ fontSize: 28 }} />
                        </Box>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                                Drive Capacitaciones
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                                Administra los enlaces de redirección para los botones públicos de capacitación en la pantalla principal.
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                {/* Nota informativa */}
                <Alert
                    severity="info"
                    icon={<HelpOutlineIcon />}
                    sx={{ borderRadius: 2, fontSize: '0.88rem', alignItems: 'center' }}
                >
                    Los enlaces que configures aquí se vincularán automáticamente a los dos botones centrales visibles por todos los colaboradores en la página principal pública.
                </Alert>

                {/* Formulario de Configuración de Enlaces */}
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* BOTÓN 1: ESCIFOR */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card
                                variant="outlined"
                                sx={{
                                    borderRadius: 2.5,
                                    height: '100%',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    borderTop: '5px solid #1d4ed8',
                                }}
                            >
                                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#1d4ed8' }}>
                                            1. Botón Capacitación ESCIFOR
                                        </Typography>
                                        <CheckCircleIcon sx={{ color: '#1d4ed8', fontSize: 22 }} />
                                    </Box>

                                    <Typography variant="body2" color="text.secondary">
                                        URL externa (carpeta de Google Drive, OneDrive o portal) a la que se redirigirá al presionar el botón azul institucional.
                                    </Typography>

                                    {/* Vista previa de la tarjeta */}
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            borderRadius: 2.5,
                                            bgcolor: 'action.hover',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1.5,
                                            borderTop: '4px solid #1d4ed8',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Avatar sx={{ width: 36, height: 36, bgcolor: '#1d4ed8', color: '#fff' }}>
                                                <FolderSharedIcon sx={{ fontSize: 20 }} />
                                            </Avatar>
                                            <Chip label="DIVISIÓN ESCIFOR" size="small" sx={{ fontSize: '0.68rem', fontWeight: 800, bgcolor: 'rgba(29, 78, 216, 0.12)', color: '#1d4ed8' }} />
                                        </Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'text.primary', lineHeight: 1.2 }}>
                                            CAPACITACIÓN ESCIFOR
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                                            Repositorio oficial de sesiones grabadas, manuales pedagógicos y normativas para la división ESCIFOR.
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            endIcon={<LaunchIcon fontSize="small" />}
                                            sx={{
                                                background: 'linear-gradient(135deg, #1d4ed8 0%, #0c43a3 100%)',
                                                fontWeight: 800,
                                                fontSize: '0.82rem',
                                                py: 0.8,
                                                borderRadius: 1.5,
                                                pointerEvents: 'none',
                                            }}
                                        >
                                            INGRESAR AL DRIVE ESCIFOR
                                        </Button>
                                    </Paper>

                                    <TextField
                                        label="Enlace de Redirección (URL) *"
                                        placeholder="https://drive.google.com/drive/folders/..."
                                        value={data.drive_escifor}
                                        onChange={(e) => setData('drive_escifor', e.target.value)}
                                        error={Boolean(errors.drive_escifor)}
                                        helperText={errors.drive_escifor || 'Copia y pega el enlace para compartir de la carpeta de Drive.'}
                                        fullWidth
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LinkIcon fontSize="small" sx={{ color: '#1d4ed8' }} />
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                    />

                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<LaunchIcon fontSize="small" />}
                                        onClick={() => handleTestUrl(data.drive_escifor)}
                                        sx={{ alignSelf: 'flex-start', borderRadius: 1.5, textTransform: 'none', fontWeight: 700 }}
                                    >
                                        Probar Enlace en Nueva Pestaña
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* BOTÓN 2: MULTIMARCA */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card
                                variant="outlined"
                                sx={{
                                    borderRadius: 2.5,
                                    height: '100%',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    borderTop: '5px solid #16a34a',
                                }}
                            >
                                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#16a34a' }}>
                                            2. Botón Capacitación MULTIMARCA
                                        </Typography>
                                        <CheckCircleIcon sx={{ color: '#16a34a', fontSize: 22 }} />
                                    </Box>

                                    <Typography variant="body2" color="text.secondary">
                                        URL externa (carpeta de Google Drive, OneDrive o portal) a la que se redirigirá al presionar el botón verde institucional.
                                    </Typography>

                                    {/* Vista previa de la tarjeta */}
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            borderRadius: 2.5,
                                            bgcolor: 'action.hover',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1.5,
                                            borderTop: '4px solid #16a34a',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Avatar sx={{ width: 36, height: 36, bgcolor: '#16a34a', color: '#fff' }}>
                                                <FolderSharedIcon sx={{ fontSize: 20 }} />
                                            </Avatar>
                                            <Chip label="DIVISIÓN MULTIMARCA" size="small" sx={{ fontSize: '0.68rem', fontWeight: 800, bgcolor: 'rgba(22, 163, 74, 0.12)', color: '#16a34a' }} />
                                        </Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'text.primary', lineHeight: 1.2 }}>
                                            CAPACITACIÓN MULTIMARCA
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                                            Carpetas compartidas de inducción en seguridad técnica, operaciones mineras y protocolos MATPEL.
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            endIcon={<LaunchIcon fontSize="small" />}
                                            sx={{
                                                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                                                fontWeight: 800,
                                                fontSize: '0.82rem',
                                                py: 0.8,
                                                borderRadius: 1.5,
                                                pointerEvents: 'none',
                                            }}
                                        >
                                            INGRESAR AL DRIVE MULTIMARCA
                                        </Button>
                                    </Paper>

                                    <TextField
                                        label="Enlace de Redirección (URL) *"
                                        placeholder="https://drive.google.com/drive/folders/..."
                                        value={data.drive_multimarca}
                                        onChange={(e) => setData('drive_multimarca', e.target.value)}
                                        error={Boolean(errors.drive_multimarca)}
                                        helperText={errors.drive_multimarca || 'Copia y pega el enlace para compartir de la carpeta de Drive.'}
                                        fullWidth
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LinkIcon fontSize="small" sx={{ color: '#16a34a' }} />
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                    />

                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color="success"
                                        startIcon={<LaunchIcon fontSize="small" />}
                                        onClick={() => handleTestUrl(data.drive_multimarca)}
                                        sx={{ alignSelf: 'flex-start', borderRadius: 1.5, textTransform: 'none', fontWeight: 700 }}
                                    >
                                        Probar Enlace en Nueva Pestaña
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Barra de Guardado Inferior */}
                        <Grid size={{ xs: 12 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2.5,
                                    borderRadius: 2,
                                    bgcolor: 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    gap: 2,
                                }}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    Los cambios tendrán efecto inmediato para todos los visitantes del catálogo público.
                                </Typography>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    disabled={processing}
                                    startIcon={processing ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                    sx={{
                                        px: 4,
                                        py: 1.2,
                                        borderRadius: 2,
                                        fontWeight: 800,
                                        boxShadow: '0 4px 14px rgba(12, 67, 163, 0.3)',
                                    }}
                                >
                                    {processing ? 'Guardando Enlaces...' : 'Guardar Enlaces de Capacitación'}
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    );
}
