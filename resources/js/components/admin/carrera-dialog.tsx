import { useForm } from '@inertiajs/react';
import SchoolIcon from '@mui/icons-material/School';
import { ComercioBadge } from '@/components/admin/comercio-badge';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Box,
    Grid,
    CircularProgress,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNotification } from '@/hooks/use-notification';
import { isMinLength } from '@/lib/validation';
import type { Carrera, Comercio } from '@/types';

interface CarreraDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    carrera?: Carrera | null;
    comercios: Comercio[];
    defaultComercioId?: number | null;
}

export function CarreraDialog({
    open,
    onOpenChange,
    carrera,
    comercios,
    defaultComercioId,
    
}: CarreraDialogProps) {
    const isEditing = !!carrera;
    const { notify } = useNotification();
    const [clientErrors, setClientErrors] = useState<{ comercio_id?: string; nombre?: string }>({});

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm<{
            comercio_id: string;
            nombre: string;
            url_malla_curricular: string;
            url_declaracion_jurada: string;
            modelo_certificado: string;
        }>({
            comercio_id: defaultComercioId ? String(defaultComercioId) : (comercios[0]?.id ? String(comercios[0].id) : ''),
            nombre: '',
            url_malla_curricular: '',
            url_declaracion_jurada: '',
            modelo_certificado: '',
        });

    useEffect(() => {
        if (carrera) {
            setData({
                comercio_id: String(carrera.comercio_id),
                nombre: carrera.nombre,
                url_malla_curricular: carrera.url_malla_curricular || '',
                url_declaracion_jurada: carrera.url_declaracion_jurada || '',
                modelo_certificado: carrera.modelo_certificado || '',
            });
        } else {
            const targetComercioId = defaultComercioId ? String(defaultComercioId) : (comercios[0]?.id ? String(comercios[0].id) : '');
            setData({
                comercio_id: targetComercioId,
                nombre: '',
                url_malla_curricular: '',
                url_declaracion_jurada: '',
                modelo_certificado: '',
            });
        }

        setClientErrors({});
        clearErrors();
    }, [carrera, open, defaultComercioId, comercios]);

    const validate = (): boolean => {
        const newErrors: { comercio_id?: string; nombre?: string } = {};

        if (!data.comercio_id) {
            newErrors.comercio_id = 'Debes seleccionar un instituto o comercio asignado.';
        }
        if (!isMinLength(data.nombre, 3)) {
            newErrors.nombre = 'El nombre de la carrera debe tener al menos 3 caracteres.';
        } else if (data.nombre.trim().length > 255) {
            newErrors.nombre = 'El nombre no puede superar los 255 caracteres.';
        }

        setClientErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            notify.warning('Corrige los campos obligatorios antes de guardar.');
            return;
        }

        if (isEditing && carrera) {
            put(`/admin/carreras/${carrera.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
                onError: () => {
                    notify.error('Ocurrió un error al actualizar la carrera.');
                },
            });
        } else {
            post(`/admin/carreras`, {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
                onError: () => {
                    notify.error('Ocurrió un error al registrar la carrera.');
                },
            });
        }
    };

    return (
        <Dialog
            open={open}
            onClose={() => onOpenChange(false)}
            maxWidth="sm"
            fullWidth
        >
            <form onSubmit={handleSubmit} noValidate>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
                    <SchoolIcon color="primary" />
                    <span>{isEditing ? 'Editar Carrera' : 'Nueva Carrera'}</span>
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
                        <FormControl fullWidth size="small" error={!!(clientErrors.comercio_id || errors.comercio_id)}>
                            <InputLabel id="select-comercio-label">Comercio / Instituto Asignado *</InputLabel>
                            <Select
                                labelId="select-comercio-label"
                                value={data.comercio_id}
                                label="Comercio / Instituto Asignado *"
                                onChange={(e) => {
                                    setData('comercio_id', e.target.value);
                                    if (clientErrors.comercio_id) {
                                        setClientErrors((prev) => ({ ...prev, comercio_id: undefined }));
                                    }
                                }}
                            >
                                {comercios.map((c) => {
                                    const isAcademic =
                                        c.slug === 'istp-avanti' ||
                                        c.slug === 'istp-sis' ||
                                        c.codigo === 'AVANTI' ||
                                        c.codigo === 'SIS' ||
                                        c.nombre?.toUpperCase().includes('AVANTI') ||
                                        c.nombre?.toUpperCase().includes('SIS');

                                    return (
                                        <MenuItem key={c.id} value={String(c.id)}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 1.5 }}>
                                                <ComercioBadge comercio={c} size={22} showName />
                                                 {isAcademic && (
                                                     <Box
                                                         component="span"
                                                         sx={{
                                                             fontSize: '0.68rem',
                                                             bgcolor: 'rgba(12, 67, 163, 0.1)',
                                                             color: '#0c43a3',
                                                             px: 0.8,
                                                             py: 0.2,
                                                             borderRadius: 1,
                                                             fontWeight: 'bold',
                                                         }}
                                                     >
                                                         Instituto Oficial
                                                     </Box>
                                                 )}
                                             </Box>
                                         </MenuItem>
                                     );
                                 })}
                             </Select>
                             {(clientErrors.comercio_id || errors.comercio_id) && (
                                 <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                     {clientErrors.comercio_id || errors.comercio_id}
                                 </Typography>
                             )}
                         </FormControl>

                        <TextField
                            label="Nombre de la Carrera *"
                            value={data.nombre}
                            onChange={(e) => {
                                setData('nombre', e.target.value);
                                if (clientErrors.nombre) {
                                    setClientErrors((prev) => ({ ...prev, nombre: undefined }));
                                }
                            }}
                            placeholder="Ej. GUIA OFICIAL DE TURISMO, COSMETOLOGIA..."
                            error={!!(clientErrors.nombre || errors.nombre)}
                            helperText={clientErrors.nombre || errors.nombre || 'Mínimo 3 caracteres requeridos'}
                            fullWidth
                            required
                            size="small"
                        />

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="URL Malla Curricular (PDF / Enlace)"
                                    value={data.url_malla_curricular}
                                    onChange={(e) => setData('url_malla_curricular', e.target.value)}
                                    placeholder="https://.../malla-curricular.pdf"
                                    error={!!errors.url_malla_curricular}
                                    helperText={errors.url_malla_curricular}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="URL Declaración Jurada (PDF / Enlace)"
                                    value={data.url_declaracion_jurada}
                                    onChange={(e) => setData('url_declaracion_jurada', e.target.value)}
                                    placeholder="https://.../declaracion-jurada.pdf"
                                    error={!!errors.url_declaracion_jurada}
                                    helperText={errors.url_declaracion_jurada}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Modelo de Certificado (PDF / Imagen / Enlace)"
                                    value={data.modelo_certificado}
                                    onChange={(e) => setData('modelo_certificado', e.target.value)}
                                    placeholder="https://.../modelo-certificado.pdf"
                                    error={!!errors.modelo_certificado}
                                    helperText={errors.modelo_certificado}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5, borderTop: 1, borderColor: 'divider' }}>
                    <Button
                        onClick={() => onOpenChange(false)}
                        disabled={processing}
                        variant="outlined"
                        color="inherit"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={processing}
                        variant="contained"
                        color="primary"
                        startIcon={processing ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                        {isEditing ? 'Guardar Cambios' : 'Registrar Carrera'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
