import { useForm } from '@inertiajs/react';
import CategoryIcon from '@mui/icons-material/Category';
import LabelIcon from '@mui/icons-material/Label';
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
    CircularProgress,
    FormHelperText,
    Typography,
    Chip,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNotification } from '@/hooks/use-notification';
import { isMinLength } from '@/lib/validation';
import type { Especialidad, Carrera, Rubro, Estado } from '@/types';

interface EspecialidadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    especialidad?: Especialidad | null;
    carreras: (Carrera & { comercio?: { id: number; nombre: string; codigo?: string | null; color_hex?: string | null } })[];
    rubros: Rubro[];
    estados?: Estado[];
    defaultCarreraId?: number | null;
    defaultRubroId?: number | null;
}

export function EspecialidadDialog({
    open,
    onOpenChange,
    especialidad,
    carreras = [],
    rubros = [],
    estados = [],
    defaultCarreraId,
    defaultRubroId,
}: EspecialidadDialogProps) {
    const isEditing = !!especialidad;
    const { notify } = useNotification();
    const [clientErrors, setClientErrors] = useState<{ carrera_id?: string; rubro_id?: string; nombre?: string }>({});

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm<{
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
            carrera_id: defaultCarreraId ? String(defaultCarreraId) : (carreras[0]?.id ? String(carreras[0].id) : ''),
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
                carrera_id: String(especialidad.carrera_id),
                rubro_id: String(especialidad.rubro_id),
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

            const targetCarreraId = defaultCarreraId || carreras[0]?.id;
            const targetRubroId = defaultRubroId || rubros[0]?.id;

            if (targetCarreraId) {
                setData((prev) => ({ ...prev, carrera_id: String(targetCarreraId) }));
            }
            if (targetRubroId) {
                setData((prev) => ({ ...prev, rubro_id: String(targetRubroId) }));
            }
        }

        setClientErrors({});
        clearErrors();
    }, [especialidad, open, defaultCarreraId, defaultRubroId, carreras, rubros]);

    const validate = (): boolean => {
        const newErrors: { carrera_id?: string; rubro_id?: string; nombre?: string } = {};

        if (!data.carrera_id) {
            newErrors.carrera_id = 'Debes seleccionar la carrera a la que pertenece esta especialidad.';
        }
        if (!data.rubro_id) {
            newErrors.rubro_id = 'Debes seleccionar exactamente un rubro para esta especialidad.';
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
                            ? 'Actualiza los datos, carrera matriz y rubro de la especialidad.'
                            : 'Asocia una nueva especialidad académica a una carrera y a su rubro.'}
                    </Typography>
                </Box>
            </DialogTitle>

            <form onSubmit={handleSubmit} noValidate>
                <DialogContent sx={{ pt: 3, pb: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        {/* Fila 1: Carrera y Rubro */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                            {/* Carrera Técnica Asociada */}
                            <FormControl
                                fullWidth
                                size="small"
                                required
                                error={!!clientErrors.carrera_id || !!errors.carrera_id}
                            >
                                <InputLabel id="carrera-select-label">Carrera Profesional Matriz</InputLabel>
                                <Select
                                    labelId="carrera-select-label"
                                    value={data.carrera_id}
                                    label="Carrera Profesional Matriz"
                                    onChange={(e) => setData('carrera_id', e.target.value)}
                                    disabled={processing}
                                >
                                    {carreras.map((carrera) => (
                                        <MenuItem key={carrera.id} value={String(carrera.id)}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {carrera.comercio && (
                                                    <ComercioBadge comercio={carrera.comercio} size={20} />
                                                )}
                                                <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                                                    {carrera.nombre}
                                                </Typography>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                                {(clientErrors.carrera_id || errors.carrera_id) && (
                                    <FormHelperText>
                                        {clientErrors.carrera_id || errors.carrera_id}
                                    </FormHelperText>
                                )}
                            </FormControl>

                            {/* Rubro (Mínimo 1 y Máximo 1) */}
                            <FormControl
                                fullWidth
                                size="small"
                                required
                                error={!!clientErrors.rubro_id || !!errors.rubro_id}
                            >
                                <InputLabel id="rubro-select-label">Rubro Asignado</InputLabel>
                                <Select
                                    labelId="rubro-select-label"
                                    value={data.rubro_id}
                                    label="Rubro Asignado"
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

                        {/* Fila 2: Nombre de Especialidad */}
                        <TextField
                            label="Nombre de la Especialidad"
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
