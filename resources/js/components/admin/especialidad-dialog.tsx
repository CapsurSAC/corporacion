import { useForm } from '@inertiajs/react';
import CategoryIcon from '@mui/icons-material/Category';
import LabelIcon from '@mui/icons-material/Label';
import SchoolIcon from '@mui/icons-material/School';
import StoreIcon from '@mui/icons-material/Store';
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
    CircularProgress,
    FormHelperText,
    Typography,
    Chip,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNotification } from '@/hooks/use-notification';
import { isMinLength } from '@/lib/validation';
import type { Especialidad, Carrera, Comercio, Rubro, Estado } from '@/types';

interface EspecialidadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    especialidad?: Especialidad | null;
    comercios: Comercio[];
    carreras?: (Carrera & { comercio?: { id: number; nombre: string; codigo?: string | null; color_hex?: string | null } })[];
    rubros: Rubro[];
    estados?: Estado[];
    defaultComercioId?: number | null;
    defaultCarreraId?: number | null;
    defaultRubroId?: number | null;
}

export function EspecialidadDialog({
    open,
    onOpenChange,
    especialidad,
    comercios = [],
    carreras = [],
    rubros = [],
    estados = [],
    defaultComercioId,
    defaultCarreraId,
    defaultRubroId,
}: EspecialidadDialogProps) {
    const isEditing = !!especialidad;
    const { notify } = useNotification();
    const [clientErrors, setClientErrors] = useState<{ comercio_id?: string; rubro_id?: string; nombre?: string }>({});

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm<{
            comercio_id: string;
            carrera_id: string;
            rubro_id: string;
            estado_id: string;
            nombre: string;
            flyer: string;
            brochure: string;
            youtube: string;
            precio: string;
            actualizado_drive: string;
        }>({
            comercio_id: defaultComercioId ? String(defaultComercioId) : (comercios[0]?.id ? String(comercios[0].id) : ''),
            carrera_id: defaultCarreraId ? String(defaultCarreraId) : '',
            rubro_id: defaultRubroId ? String(defaultRubroId) : (rubros[0]?.id ? String(rubros[0].id) : ''),
            estado_id: '',
            nombre: '',
            flyer: '',
            brochure: '',
            youtube: '',
            precio: '',
            actualizado_drive: '',
        });

    useEffect(() => {
        if (especialidad) {
            setData({
                comercio_id: String(especialidad.comercio_id || especialidad.carrera?.comercio_id || comercios[0]?.id || ''),
                carrera_id: especialidad.carrera_id ? String(especialidad.carrera_id) : '',
                rubro_id: String(especialidad.rubro_id || ''),
                estado_id: especialidad.estado_id ? String(especialidad.estado_id) : '',
                nombre: especialidad.nombre || '',
                flyer: especialidad.flyer || '',
                brochure: especialidad.brochure || '',
                youtube: especialidad.youtube || '',
                precio: especialidad.precio || '',
                actualizado_drive: especialidad.actualizado_drive || '',
            });
        } else {
            reset();

            const targetComercioId = defaultComercioId || comercios[0]?.id;
            const targetCarreraId = defaultCarreraId || '';
            const targetRubroId = defaultRubroId || rubros[0]?.id;

            setData((prev) => ({
                ...prev,
                comercio_id: targetComercioId ? String(targetComercioId) : '',
                carrera_id: targetCarreraId ? String(targetCarreraId) : '',
                rubro_id: targetRubroId ? String(targetRubroId) : '',
            }));
        }

        setClientErrors({});
        clearErrors();
    }, [especialidad, open, defaultComercioId, defaultCarreraId, defaultRubroId, comercios, carreras, rubros]);

    // Filtrar carreras que pertenezcan al comercio seleccionado actualmente
    const availableCarreras = carreras.filter((c) => String(c.comercio_id) === String(data.comercio_id));

    const validate = (): boolean => {
        const newErrors: { comercio_id?: string; rubro_id?: string; nombre?: string } = {};

        if (!data.comercio_id) {
            newErrors.comercio_id = 'Debes seleccionar el comercio o sede responsable.';
        }
        if (!data.rubro_id) {
            newErrors.rubro_id = 'Debes seleccionar obligatoriamente un rubro para esta especialidad.';
        }
        if (!isMinLength(data.nombre, 3)) {
            newErrors.nombre = 'El nombre de la especialidad debe tener al menos 3 caracteres.';
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

        if (isEditing && especialidad) {
            put(`/admin/especialidades/${especialidad.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    notify.success('Especialidad actualizada correctamente.');
                    onOpenChange(false);
                },
                onError: (serverErrors) => {
                    const firstError = Object.values(serverErrors)[0];
                    notify.error(firstError || 'Error al actualizar la especialidad.');
                },
            });
        } else {
            post(`/admin/especialidades`, {
                preserveScroll: true,
                onSuccess: () => {
                    notify.success('Especialidad registrada con éxito.');
                    onOpenChange(false);
                },
                onError: (serverErrors) => {
                    const firstError = Object.values(serverErrors)[0];
                    notify.error(firstError || 'Error al registrar la especialidad.');
                },
            });
        }
    };

    return (
        <Dialog
            open={open}
            onClose={() => !processing && onOpenChange(false)}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    pb: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Box
                    sx={{
                        p: 1,
                        borderRadius: 1,
                        bgcolor: 'primary.main',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(12, 67, 163, 0.25)',
                    }}
                >
                    <SchoolIcon fontSize="small" />
                </Box>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2, color: 'text.primary' }}>
                        {isEditing ? 'Editar Especialidad' : 'Nueva Especialidad'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3, fontSize: '0.82rem' }}>
                        {isEditing
                            ? 'Actualiza los datos, comercio responsable, carrera y rubro de la especialidad.'
                            : 'Registra una especialidad para un comercio, vinculada opcionalmente a una carrera técnica.'}
                    </Typography>
                </Box>
            </DialogTitle>

            <form onSubmit={handleSubmit} noValidate>
                <DialogContent sx={{ pt: 3, pb: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        {/* Fila 1: Comercio Responsable y Carrera Matriz (Opcional) */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                            {/* Comercio / Instituto Responsable */}
                            <FormControl
                                fullWidth
                                size="small"
                                required
                                error={!!clientErrors.comercio_id || !!errors.comercio_id}
                            >
                                <InputLabel id="comercio-select-label">Comercio / Sede Responsable *</InputLabel>
                                <Select
                                    labelId="comercio-select-label"
                                    value={data.comercio_id}
                                    label="Comercio / Sede Responsable *"
                                    onChange={(e) => {
                                        const newComercioId = e.target.value;
                                        setData((prev) => ({
                                            ...prev,
                                            comercio_id: newComercioId,
                                            carrera_id: '',
                                        }));
                                        if (clientErrors.comercio_id) {
                                            setClientErrors((prev) => ({ ...prev, comercio_id: undefined }));
                                        }
                                    }}
                                    disabled={processing}
                                >
                                    {comercios.map((comercio) => (
                                        <MenuItem key={comercio.id} value={String(comercio.id)}>
                                            <ComercioBadge comercio={comercio} size={22} showName />
                                        </MenuItem>
                                    ))}
                                </Select>
                                {(clientErrors.comercio_id || errors.comercio_id) && (
                                    <FormHelperText>
                                        {clientErrors.comercio_id || errors.comercio_id}
                                    </FormHelperText>
                                )}
                            </FormControl>

                            {/* Carrera Técnica Asociada (Opcional) */}
                            <FormControl
                                fullWidth
                                size="small"
                                error={!!errors.carrera_id}
                            >
                                <InputLabel id="carrera-select-label">Carrera Perteneciente (Opcional)</InputLabel>
                                <Select
                                    labelId="carrera-select-label"
                                    value={data.carrera_id}
                                    label="Carrera Perteneciente (Opcional)"
                                    onChange={(e) => setData('carrera_id', e.target.value)}
                                    disabled={processing || availableCarreras.length === 0}
                                >
                                    <MenuItem value="">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <StoreIcon sx={{ fontSize: '1.1rem', color: 'text.secondary' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {availableCarreras.length === 0
                                                    ? 'Sin carreras disponibles (Directo al comercio)'
                                                    : 'General / Sin Carrera Específica'}
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                    {availableCarreras.map((carrera) => (
                                        <MenuItem key={carrera.id} value={String(carrera.id)}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <SchoolIcon sx={{ fontSize: '1rem', color: 'primary.main' }} />
                                                <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                                                    {carrera.nombre} {carrera.codigo ? `(${carrera.codigo})` : ''}
                                                </Typography>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                                {availableCarreras.length === 0 ? (
                                    <FormHelperText sx={{ color: 'text.secondary' }}>
                                        Este comercio no tiene carreras registradas (se asignará directo al comercio).
                                    </FormHelperText>
                                ) : errors.carrera_id ? (
                                    <FormHelperText>{errors.carrera_id}</FormHelperText>
                                ) : null}
                            </FormControl>
                        </Box>

                        {/* Fila 2: Nombre de Especialidad y Rubro Asignado */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1.2fr 0.8fr' }, gap: 2 }}>
                            <TextField
                                label="Nombre de la Especialidad *"
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                fullWidth
                                size="small"
                                required
                                disabled={processing}
                                error={!!clientErrors.nombre || !!errors.nombre}
                                helperText={clientErrors.nombre || errors.nombre || 'Ej: Especialidad en Full Stack Cloud & DevOps'}
                                placeholder="Especialidad en ..."
                            />

                            {/* Rubro (Mínimo 1 y Máximo 1) */}
                            <FormControl
                                fullWidth
                                size="small"
                                required
                                error={!!clientErrors.rubro_id || !!errors.rubro_id}
                            >
                                <InputLabel id="rubro-select-label">Rubro Asignado *</InputLabel>
                                <Select
                                    labelId="rubro-select-label"
                                    value={data.rubro_id}
                                    label="Rubro Asignado *"
                                    onChange={(e) => setData('rubro_id', e.target.value)}
                                    disabled={processing}
                                >
                                    {rubros.map((rubro) => (
                                        <MenuItem key={rubro.id} value={String(rubro.id)}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LabelIcon sx={{ fontSize: '1.1rem', color: rubro.color_hex || '#0284c7', flexShrink: 0 }} />
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {rubro.nombre}
                                                </Typography>
                                                {rubro.categoria && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        ({rubro.categoria})
                                                    </Typography>
                                                )}
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                                {(clientErrors.rubro_id || errors.rubro_id) && (
                                    <FormHelperText>
                                        {clientErrors.rubro_id || errors.rubro_id}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Box>

                        {/* Fila 3: Estado y Precio */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                            <FormControl fullWidth size="small" error={!!errors.estado_id}>
                                <InputLabel id="estado-select-label">Estado</InputLabel>
                                <Select
                                    labelId="estado-select-label"
                                    value={data.estado_id}
                                    label="Estado"
                                    onChange={(e) => setData('estado_id', e.target.value)}
                                    disabled={processing}
                                >
                                    <MenuItem value="">
                                        <Typography variant="body2" color="text.secondary">
                                            Sin estado asignado
                                        </Typography>
                                    </MenuItem>
                                    {estados.map((est) => (
                                        <MenuItem key={est.id} value={String(est.id)}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box
                                                    sx={{
                                                        width: 10,
                                                        height: 10,
                                                        borderRadius: '50%',
                                                        bgcolor: est.color_hex || '#94a3b8',
                                                        flexShrink: 0,
                                                    }}
                                                />
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {est.nombre}
                                                </Typography>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.estado_id && (
                                    <FormHelperText>{errors.estado_id}</FormHelperText>
                                )}
                            </FormControl>

                            <TextField
                                label="Precio / Inversión"
                                value={data.precio}
                                onChange={(e) => setData('precio', e.target.value)}
                                fullWidth
                                size="small"
                                disabled={processing}
                                error={!!errors.precio}
                                helperText={errors.precio || 'Ej: S/ 480'}
                                placeholder="S/ 0.00"
                            />
                        </Box>

                        {/* Subtítulo Recursos */}
                        <Box sx={{ pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}>
                                Recursos Digitales y Materiales (Opcional)
                            </Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                                <TextField
                                    label="URL del Flyer / Afiche"
                                    value={data.flyer}
                                    onChange={(e) => setData('flyer', e.target.value)}
                                    fullWidth
                                    size="small"
                                    disabled={processing}
                                    error={!!errors.flyer}
                                    helperText={errors.flyer || 'Enlace directo a la imagen afiche (JPG/PNG)'}
                                    placeholder="https://..."
                                />

                                <TextField
                                    label="URL del Brochure (PDF)"
                                    value={data.brochure}
                                    onChange={(e) => setData('brochure', e.target.value)}
                                    fullWidth
                                    size="small"
                                    disabled={processing}
                                    error={!!errors.brochure}
                                    helperText={errors.brochure || 'Enlace al documento informativo PDF'}
                                    placeholder="https://..."
                                />

                                <TextField
                                    label="Video Promocional (YouTube)"
                                    value={data.youtube}
                                    onChange={(e) => setData('youtube', e.target.value)}
                                    fullWidth
                                    size="small"
                                    disabled={processing}
                                    error={!!errors.youtube}
                                    helperText={errors.youtube || 'Enlace al video explicativo en YouTube'}
                                    placeholder="https://youtube.com/watch?v=..."
                                />

                                <TextField
                                    label="Carpeta Google Drive Actualizada"
                                    value={data.actualizado_drive}
                                    onChange={(e) => setData('actualizado_drive', e.target.value)}
                                    fullWidth
                                    size="small"
                                    disabled={processing}
                                    error={!!errors.actualizado_drive}
                                    helperText={errors.actualizado_drive || 'Enlace Drive para capacitadores y asesores'}
                                    placeholder="https://drive.google.com/drive/folders/..."
                                />
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button
                        onClick={() => onOpenChange(false)}
                        disabled={processing}
                        variant="outlined"
                        color="inherit"
                        sx={{ textTransform: 'none', borderRadius: 1 }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={processing}
                        startIcon={processing ? <CircularProgress size={16} color="inherit" /> : <SchoolIcon />}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: 1,
                            px: 3,
                            boxShadow: '0 2px 8px rgba(12, 67, 163, 0.25)',
                        }}
                    >
                        {processing
                            ? 'Guardando...'
                            : isEditing
                            ? 'Actualizar Especialidad'
                            : 'Crear Especialidad'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
