import { Head, useForm } from '@inertiajs/react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import DirectionsIcon from '@mui/icons-material/Directions';
import EmailIcon from '@mui/icons-material/Email';
import HelpOutlineIcon from '@mui/icons-material/InfoOutlined';
import LaunchIcon from '@mui/icons-material/Launch';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MapIcon from '@mui/icons-material/Map';
import CloseIcon from '@mui/icons-material/Close';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import PhoneIcon from '@mui/icons-material/Phone';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
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
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNotification } from '@/hooks/use-notification';

interface Props {
    contact: {
        address: string;
        address_detail: string;
        phone: string;
        phone_detail: string;
        whatsapp: string;
        whatsapp_message: string;
        email: string;
        email_detail: string;
        schedule: string;
        schedule_detail: string;
        maps_url: string;
        maps_embed_url: string;
        banner_title: string;
        banner_subtitle: string;
    };
}

export default function ContactoIndex({ contact }: Props) {
    const { notify } = useNotification();
    const [previewTab, setPreviewTab] = useState<'form' | 'preview'>('form');
    const [previewMapOpen, setPreviewMapOpen] = useState<boolean>(false);

    const { data, setData, put, processing, errors } = useForm({
        address: contact.address || '',
        address_detail: contact.address_detail || '',
        phone: contact.phone || '',
        phone_detail: contact.phone_detail || '',
        whatsapp: contact.whatsapp || '',
        whatsapp_message: contact.whatsapp_message || '',
        email: contact.email || '',
        email_detail: contact.email_detail || '',
        schedule: contact.schedule || '',
        schedule_detail: contact.schedule_detail || '',
        maps_url: contact.maps_url || '',
        maps_embed_url: contact.maps_embed_url || '',
        banner_title: contact.banner_title || '',
        banner_subtitle: contact.banner_subtitle || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/admin/contacto', {
            preserveScroll: true,
            onError: () => {
                notify.error('Ocurrió un error al guardar la información de contacto. Verifica los campos requeridos.');
            },
        });
    };

    const handleEmbedChange = (val: string) => {
        // Si el usuario pegó el código iframe completo desde Google Maps, extraer solo el src
        const match = val.match(/src=["']([^"']+)["']/);
        if (match && match[1]) {
            setData('maps_embed_url', match[1]);
            notify.info('Se extrajo automáticamente la dirección de inserción desde el código iframe.');
        } else {
            setData('maps_embed_url', val);
        }
    };

    const handleTestUrl = (url: string) => {
        if (!url) {
            notify.warning('Primero ingresa una URL de Google Maps para poder probarla.');
            return;
        }
        const fullUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
        window.open(fullUrl, '_blank', 'noopener,noreferrer');
    };

    const handleTestWhatsapp = () => {
        const rawPhone = (data.whatsapp || data.phone || '').replace(/\D+/g, '');
        if (!rawPhone) {
            notify.warning('Ingresa un número de WhatsApp para probar el enlace.');
            return;
        }
        const formatted = rawPhone.length === 9 && rawPhone.startsWith('9') ? `51${rawPhone}` : rawPhone;
        const msg = encodeURIComponent(data.whatsapp_message || '');
        const waUrl = `https://wa.me/${formatted}${msg ? `?text=${msg}` : ''}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <>
            <Head title="Información de Contacto - Administración Grupo Capsur" />

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
                        display: 'flex',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

                        <Avatar
                            sx={{
                                bgcolor: 'primary.main',
                                color: '#ffffff',
                                width: 42,
                                height: 42,
                                borderRadius: 1,
                                boxShadow: '0 2px 8px rgba(12, 67, 163, 0.25)',
                            }}
                        >
                            <ContactPhoneIcon fontSize='small' />
                        </Avatar>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: 'text.primary' }}>
                                Información de Contacto
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                                Actualiza los canales oficiales, horarios de atención, teléfonos y mapa que se muestran en el portal público.
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                        <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            startIcon={<LaunchIcon fontSize="small" />}
                            href="/#contacto"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 700 }}
                        >
                            Ver en la Web Pública
                        </Button>
                    </Box>
                </Paper>

                {/* Nota informativa */}
                <Alert
                    severity="info"
                    icon={<HelpOutlineIcon />}
                    sx={{ borderRadius: 2, fontSize: '0.88rem', alignItems: 'center' }}
                >
                    Los cambios que guardes aquí se reflejan de inmediato en la sección <strong>"Contacto"</strong> del portal público institucional.
                </Alert>

                {/* Alternador entre Formulario y Vista Previa */}
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        px: 2,
                    }}
                >
                    <Tabs
                        value={previewTab}
                        onChange={(_, val) => setPreviewTab(val)}
                        textColor="primary"
                        indicatorColor="primary"
                    >
                        <Tab
                            value="form"
                            label="Formulario de Edición"
                            icon={<ContactPhoneIcon sx={{ fontSize: 18 }} />}
                            iconPosition="start"
                            sx={{ textTransform: 'none', fontWeight: 700, minHeight: 48 }}
                        />
                        <Tab
                            value="preview"
                            label="Vista Previa en Vivo"
                            icon={<VisibilityIcon sx={{ fontSize: 18 }} />}
                            iconPosition="start"
                            sx={{ textTransform: 'none', fontWeight: 700, minHeight: 48 }}
                        />
                    </Tabs>
                </Paper>

                {previewTab === 'form' ? (
                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* BLOQUE 1: ATENCIÓN E INFORMES (TELÉFONO Y WHATSAPP) */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 2.5,
                                        height: '100%',
                                        borderTop: '4px solid',
                                        borderColor: 'primary.main',
                                    }}
                                >
                                    <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                                                <PhoneIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                                                <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
                                                    1. Canales de Teléfono y WhatsApp
                                                </Typography>
                                            </Box>
                                            <CheckCircleIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Líneas telefónicas principales para llamadas directas y chats instantáneos de orientación.
                                        </Typography>

                                        <Divider />

                                        <TextField
                                            label="Teléfono Principal Visible"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            error={Boolean(errors.phone)}
                                            helperText={errors.phone || 'Ej: +51 963 147 270 (visible en la tarjeta de contacto)'}
                                            fullWidth
                                            slotProps={{
                                                input: {
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <PhoneIcon fontSize="small" sx={{ color: 'primary.main' }} />
                                                        </InputAdornment>
                                                    ),
                                                },
                                            }}
                                        />

                                        <TextField
                                            label="Detalle / Subtítulo del Teléfono"
                                            value={data.phone_detail}
                                            onChange={(e) => setData('phone_detail', e.target.value)}
                                            error={Boolean(errors.phone_detail)}
                                            helperText={errors.phone_detail || 'Ej: Matrículas, carreras y certificaciones técnicas'}
                                            fullWidth
                                        />

                                        <TextField
                                            label="Número para WhatsApp Directo"
                                            value={data.whatsapp}
                                            onChange={(e) => setData('whatsapp', e.target.value)}
                                            error={Boolean(errors.whatsapp)}
                                            helperText={errors.whatsapp || 'Ej: +51 963 147 270 o 963147270 (utilizado para el enlace wa.me)'}
                                            fullWidth
                                            slotProps={{
                                                input: {
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <WhatsAppIcon fontSize="small" sx={{ color: 'primary.main' }} />
                                                        </InputAdornment>
                                                    ),
                                                },
                                            }}
                                        />

                                        <TextField
                                            label="Mensaje Predeterminado de WhatsApp"
                                            value={data.whatsapp_message}
                                            onChange={(e) => setData('whatsapp_message', e.target.value)}
                                            error={Boolean(errors.whatsapp_message)}
                                            helperText={errors.whatsapp_message || 'Mensaje que se abrirá precargado al pulsar el botón de WhatsApp.'}
                                            fullWidth
                                            multiline
                                            rows={2}
                                        />

                                        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                color="primary"
                                                startIcon={<WhatsAppIcon fontSize="small" />}
                                                onClick={handleTestWhatsapp}
                                                sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 700 }}
                                            >
                                                Probar Chat de WhatsApp
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* BLOQUE 2: CORREO ELECTRÓNICO Y HORARIOS */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 2.5,
                                        height: '100%',
                                        borderTop: '4px solid',
                                        borderColor: 'primary.main',
                                    }}
                                >
                                    <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                                                <EmailIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                                                <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
                                                    2. Correo y Horarios de Atención
                                                </Typography>
                                            </Box>
                                            <CheckCircleIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Buzón oficial de correspondencia corporativa y franja horaria de atención al público.
                                        </Typography>

                                        <Divider />

                                        <TextField
                                            label="Correo Electrónico Institucional"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            error={Boolean(errors.email)}
                                            helperText={errors.email || 'Ej: contacto@grupocapsur.edu.pe'}
                                            fullWidth
                                            slotProps={{
                                                input: {
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <EmailIcon fontSize="small" sx={{ color: 'primary.main' }} />
                                                        </InputAdornment>
                                                    ),
                                                },
                                            }}
                                        />

                                        <TextField
                                            label="Detalle / Subtítulo del Correo"
                                            value={data.email_detail}
                                            onChange={(e) => setData('email_detail', e.target.value)}
                                            error={Boolean(errors.email_detail)}
                                            helperText={errors.email_detail || 'Ej: Consultas corporativas'}
                                            fullWidth
                                        />

                                        <TextField
                                            label="Horario de Atención"
                                            value={data.schedule}
                                            onChange={(e) => setData('schedule', e.target.value)}
                                            error={Boolean(errors.schedule)}
                                            helperText={errors.schedule || 'Ej: Lun - Sáb · 8:00 AM – 7:00 PM'}
                                            fullWidth
                                            slotProps={{
                                                input: {
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <AccessTimeIcon fontSize="small" sx={{ color: 'primary.main' }} />
                                                        </InputAdornment>
                                                    ),
                                                },
                                            }}
                                        />

                                        <TextField
                                            label="Detalle / Subtítulo del Horario"
                                            value={data.schedule_detail}
                                            onChange={(e) => setData('schedule_detail', e.target.value)}
                                            error={Boolean(errors.schedule_detail)}
                                            helperText={errors.schedule_detail || 'Ej: Atención continua'}
                                            fullWidth
                                        />

                                        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                color="primary"
                                                startIcon={<EmailIcon fontSize="small" />}
                                                href={`mailto:${data.email}`}
                                                sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 700 }}
                                            >
                                                Probar Envío de Correo
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* BLOQUE 3: SEDE CENTRAL Y GEOLOCALIZACIÓN */}
                            <Grid size={{ xs: 12 }}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 2.5,
                                        borderTop: '4px solid',
                                        borderColor: 'primary.main',
                                    }}
                                >
                                    <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                                                <LocationOnIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                                                <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
                                                    3. Sede Central y Geolocalización (Google Maps)
                                                </Typography>
                                            </Box>
                                            <CheckCircleIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Dirección física, referencias para visitantes, enlace a Google Maps y visualización interactiva en mapa.
                                        </Typography>

                                        <Divider />

                                        <Grid container spacing={2.5}>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    label="Dirección de la Sede Central"
                                                    value={data.address}
                                                    onChange={(e) => setData('address', e.target.value)}
                                                    error={Boolean(errors.address)}
                                                    helperText={errors.address || 'Ej: Av. Coronel Justo Arias Aragüez N° 1111'}
                                                    fullWidth
                                                    slotProps={{
                                                        input: {
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <LocationOnIcon fontSize="small" sx={{ color: 'primary.main' }} />
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    }}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    label="Ciudad / Referencia de Ubicación"
                                                    value={data.address_detail}
                                                    onChange={(e) => setData('address_detail', e.target.value)}
                                                    error={Boolean(errors.address_detail)}
                                                    helperText={errors.address_detail || 'Ej: Tacna, Perú — Edificio Corporativo Grupo CAPSUR'}
                                                    fullWidth
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    label="Enlace de Google Maps (Botón 'Cómo llegar')"
                                                    value={data.maps_url}
                                                    onChange={(e) => setData('maps_url', e.target.value)}
                                                    error={Boolean(errors.maps_url)}
                                                    helperText={errors.maps_url || 'URL para abrir en Google Maps en una pestaña nueva.'}
                                                    fullWidth
                                                    slotProps={{
                                                        input: {
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <DirectionsIcon fontSize="small" sx={{ color: 'primary.main' }} />
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    }}
                                                />
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    color="primary"
                                                    startIcon={<DirectionsIcon fontSize="small" />}
                                                    onClick={() => handleTestUrl(data.maps_url)}
                                                    sx={{ mt: 1, borderRadius: 1.5, textTransform: 'none', fontWeight: 700 }}
                                                >
                                                    Probar Enlace en Google Maps
                                                </Button>
                                            </Grid>

                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    label="URL o Código Embed del Mapa (Iframe)"
                                                    value={data.maps_embed_url}
                                                    onChange={(e) => handleEmbedChange(e.target.value)}
                                                    error={Boolean(errors.maps_embed_url)}
                                                    helperText={errors.maps_embed_url || 'Pega la URL de inserción o el código <iframe> completo copiado de Google Maps.'}
                                                    fullWidth
                                                    slotProps={{
                                                        input: {
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <MapIcon fontSize="small" sx={{ color: 'primary.main' }} />
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>

                                        {/* Vista previa embebida del mapa */}
                                        {data.maps_embed_url && (
                                            <Box sx={{ mt: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                                                        Vista previa del mapa que se abrirá en el modal interactivo:
                                                    </Typography>
                                                    <Button
                                                        size="small"
                                                        variant="text"
                                                        color="primary"
                                                        startIcon={<VisibilityIcon sx={{ fontSize: 16 }} />}
                                                        onClick={() => setPreviewMapOpen(true)}
                                                        sx={{ textTransform: 'none', fontWeight: 750, fontSize: '0.75rem', p: 0 }}
                                                    >
                                                        Probar cómo se ve en el modal
                                                    </Button>
                                                </Box>
                                                <Paper
                                                    variant="outlined"
                                                    sx={{
                                                        height: 260,
                                                        width: '100%',
                                                        overflow: 'hidden',
                                                        borderRadius: 2,
                                                        position: 'relative',
                                                    }}
                                                >
                                                    <iframe
                                                        title="Vista previa de Google Maps"
                                                        src={data.maps_embed_url}
                                                        width="100%"
                                                        height="100%"
                                                        style={{ border: 0 }}
                                                        allowFullScreen
                                                        loading="lazy"
                                                    />
                                                </Paper>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* BLOQUE 4: TITULARES DEL BANNER EDITORIAL DE SEDE */}
                            <Grid size={{ xs: 12 }}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 2.5,
                                        borderTop: '4px solid',
                                        borderColor: 'primary.main',
                                    }}
                                >
                                    <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                                                <BusinessIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                                                <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
                                                    4. Portada y Lema Institucional de la Sede
                                                </Typography>
                                            </Box>
                                            <CheckCircleIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Textos destacados sobreimpresos sobre la fotografía de atención y recepción institucional.
                                        </Typography>

                                        <Divider />

                                        <Grid container spacing={2.5}>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    label="Lema Principal sobre la Fotografía"
                                                    value={data.banner_title}
                                                    onChange={(e) => setData('banner_title', e.target.value)}
                                                    error={Boolean(errors.banner_title)}
                                                    helperText={errors.banner_title || 'Ej: Educación que genera oportunidades'}
                                                    fullWidth
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    label="Pie de Foto Institucional"
                                                    value={data.banner_subtitle}
                                                    onChange={(e) => setData('banner_subtitle', e.target.value)}
                                                    error={Boolean(errors.banner_subtitle)}
                                                    helperText={errors.banner_subtitle || 'Ej: Sede Central Institucional · Tacna, Perú'}
                                                    fullWidth
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* BARRA DE ACCIÓN INFERIOR */}
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
                                        Al guardar, la información se actualizará instantáneamente para todos los visitantes del catálogo web.
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
                                        {processing ? 'Guardando Contacto...' : 'Guardar Información de Contacto'}
                                    </Button>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                ) : (
                    /* PESTAÑA DE VISTA PREVIA EN VIVO */
                    <Paper
                        variant="outlined"
                        sx={{
                            p: { xs: 2.5, md: 4 },
                            borderRadius: 2.5,
                            bgcolor: '#f8fbff',
                            border: '1px solid #dbe4ef',
                        }}
                    >
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#09152a' }}>
                                Vista previa exacta de la sección "Contacto" pública
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Así verán tus visitantes los datos que estás ingresando en este momento:
                            </Typography>
                        </Box>

                        {/* Composición en miniatura */}
                        <Grid container spacing={{ xs: 2, md: 0 }} sx={{ mb: 3 }}>
                            <Grid size={{ xs: 12, md: 5 }}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: { xs: 280, md: 440 },
                                        background: 'radial-gradient(ellipse at 85% 20%, #1754b5 0%, #0c43a3 50%, #051d4d 100%)',
                                        borderRadius: { xs: '4px', md: '4px 0 0 4px' },
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src="/images/secretaria-capsur.png"
                                        alt="Atención institucional"
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: { xs: '-6%', md: '0%' },
                                            width: { xs: '100%', md: '92%' },
                                            maxHeight: { xs: '84%', md: '90%' },
                                            objectFit: 'contain',
                                            objectPosition: 'bottom right',
                                            display: 'block',
                                            zIndex: 1,
                                            filter: 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.4))',
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            inset: 0,
                                            zIndex: 2,
                                            background: 'linear-gradient(105deg, rgba(5, 29, 77, 0.92) 0%, rgba(5, 29, 77, 0.65) 45%, rgba(5, 29, 77, 0.1) 75%)',
                                        }}
                                    />
                                    <Box sx={{ position: 'absolute', top: 24, left: 24, right: 24, color: '#fff', zIndex: 3 }}>
                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.9 }}>
                                            Grupo CAPSUR
                                        </Typography>
                                        <Box sx={{ width: 48, height: 2, bgcolor: '#38bdf8', my: 1.5 }} />
                                        <Typography sx={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.15 }}>
                                            {data.banner_title || 'Educación que genera oportunidades'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ position: 'absolute', bottom: 20, left: 24, right: 24, color: '#fff', zIndex: 3 }}>
                                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.85 }}>
                                            {data.banner_subtitle || 'Sede Central Institucional · Tacna, Perú'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12, md: 7 }}>
                                <Box
                                    sx={{
                                        bgcolor: '#ffffff',
                                        border: '1px solid #dbe4ef',
                                        borderLeft: { md: 'none' },
                                        borderRadius: { xs: '4px', md: '0 4px 4px 0' },
                                        p: { xs: 2.5, md: 4 },
                                        height: { md: 440 },
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        boxSizing: 'border-box',
                                    }}
                                >
                                    <Typography sx={{ color: 'primary.main', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', mb: 0.5 }}>
                                        Canales oficiales
                                    </Typography>
                                    <Typography variant="h5" sx={{ color: '#09152a', fontWeight: 800, mb: 2.5 }}>
                                        Conecta con Grupo CAPSUR
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Box sx={{ borderTop: '2px solid', borderColor: 'primary.main', pt: 1.2 }}>
                                                <Typography sx={{ color: '#64748b', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                                                    Sede central
                                                </Typography>
                                                <Typography sx={{ color: '#0f172a', fontWeight: 750, fontSize: '0.92rem', mt: 0.3 }}>
                                                    {data.address || 'Av. Coronel Justo Arias Aragüez N° 1111'}
                                                </Typography>
                                                <Typography sx={{ color: '#64748b', fontSize: '0.75rem', mt: 0.2 }}>
                                                    {data.address_detail || 'Tacna, Perú — Edificio Corporativo Grupo CAPSUR'}
                                                </Typography>
                                                <Button
                                                    size="small"
                                                    startIcon={<LocationOnIcon sx={{ fontSize: 13 }} />}
                                                    onClick={() => setPreviewMapOpen(true)}
                                                    sx={{
                                                        mt: 0.6,
                                                        p: 0,
                                                        textTransform: 'none',
                                                        fontWeight: 750,
                                                        fontSize: '0.72rem',
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
                                            <Box sx={{ borderTop: '2px solid', borderColor: 'primary.main', pt: 1.2 }}>
                                                <Typography sx={{ color: '#64748b', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                                                    Atención e informes
                                                </Typography>
                                                <Typography sx={{ color: '#0f172a', fontWeight: 800, fontSize: '0.95rem', mt: 0.3 }}>
                                                    {data.phone || '+51 963 147 270'}
                                                </Typography>
                                                <Typography sx={{ color: '#64748b', fontSize: '0.75rem', mt: 0.2 }}>
                                                    {data.phone_detail || 'Matrículas, carreras y certificaciones técnicas'}
                                                </Typography>
                                            </Box>
                                        </Grid>

                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Box sx={{ borderTop: '1px solid #e2e8f0', pt: 1.2 }}>
                                                <Typography sx={{ color: '#64748b', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                                                    Correo institucional
                                                </Typography>
                                                <Typography sx={{ color: '#0f172a', fontWeight: 700, fontSize: '0.85rem', mt: 0.3 }}>
                                                    {data.email || 'contacto@grupocapsur.edu.pe'}
                                                </Typography>
                                                <Typography sx={{ color: '#64748b', fontSize: '0.75rem', mt: 0.2 }}>
                                                    {data.email_detail || 'Consultas corporativas'}
                                                </Typography>
                                            </Box>
                                        </Grid>

                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Box sx={{ borderTop: '1px solid #e2e8f0', pt: 1.2 }}>
                                                <Typography sx={{ color: '#64748b', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                                                    Horario de atención
                                                </Typography>
                                                <Typography sx={{ color: '#0f172a', fontWeight: 700, fontSize: '0.85rem', mt: 0.3 }}>
                                                    {data.schedule || 'Lun - Sáb · 8:00 AM – 7:00 PM'}
                                                </Typography>
                                                <Typography sx={{ color: '#64748b', fontSize: '0.75rem', mt: 0.2 }}>
                                                    {data.schedule_detail || 'Atención continua'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            startIcon={<WhatsAppIcon sx={{ fontSize: 16 }} />}
                                            sx={{ textTransform: 'none', fontWeight: 750 }}
                                        >
                                            Escribir a WhatsApp
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            startIcon={<MapIcon sx={{ fontSize: 16 }} />}
                                            onClick={() => setPreviewMapOpen(true)}
                                            sx={{ textTransform: 'none', fontWeight: 700 }}
                                        >
                                            Ver Mapa de Ubicación
                                        </Button>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setPreviewTab('form')}
                            sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 700 }}
                        >
                            Volver al Formulario de Edición
                        </Button>
                    </Paper>
                )}

                {/* Modal Interactivo con Mapa de Ubicación (Vista Previa) */}
                <Dialog
                    open={previewMapOpen}
                    onClose={() => setPreviewMapOpen(false)}
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
                                    {data.address || 'Av. Coronel Justo Arias Aragüez N° 1111'}{data.address_detail ? ` · ${data.address_detail}` : ''}
                                </Typography>
                            </Box>
                        </Box>
                        <IconButton
                            aria-label="Cerrar modal de mapa"
                            onClick={() => setPreviewMapOpen(false)}
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
                        {data.maps_embed_url ? (
                            <iframe
                                title="Vista previa de Google Maps"
                                src={data.maps_embed_url}
                                width="100%"
                                height="100%"
                                style={{ border: 0, position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                                allowFullScreen
                                loading="lazy"
                            />
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', p: 3 }}>
                                <Typography color="text.secondary">No has configurado aún la URL del mapa interactivo.</Typography>
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
                            href={data.maps_url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            disabled={!data.maps_url}
                            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 1 }}
                        >
                            Abrir en la aplicación de Google Maps
                        </Button>
                        <Button
                            onClick={() => setPreviewMapOpen(false)}
                            color="inherit"
                            variant="text"
                            sx={{ textTransform: 'none', fontWeight: 700 }}
                        >
                            Cerrar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
}
