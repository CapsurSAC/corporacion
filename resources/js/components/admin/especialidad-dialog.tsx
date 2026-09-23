import { useForm } from '@inertiajs/react';
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
    Grid,
    CircularProgress,
    ListSubheader,
    FormHelperText,
    Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useNotification } from '@/hooks/use-notification';
import { isMinLength } from '@/lib/validation';
import type { Especialidad, Carrera, Comercio, Rubro, Estado } from '@/types';

interface EspecialidadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    especialidad?: Especialidad | null;
    comercios: Comercio[];
    carreras?: (Carrera & { comercio?: { id: number; nombre: string; codigo?: string | null; color_hex?: string | null } })[];
    rubros?: Rubro[];
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
    const [clientErrors, setClientErrors] = useState<{ comercio_id?: string; nombre?: string }>({});

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
            rubro_id: defaultRubroId ? String(defaultRubroId) : '',
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
                rubro_id: especialidad.rubro_id ? String(especialidad.rubro_id) : '',
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
            const targetRubroId = defaultRubroId ? String(defaultRubroId) : '';

            if (targetComercioId) {
                setData((prev) => ({
                    ...prev,
                    comercio_id: String(targetComercioId),
                    carrera_id: targetCarreraId ? String(targetCarreraId) : '',
                    rubro_id: targetRubroId,
                }));
            }
        }

        setClientErrors({});
        clearErrors();
    }, [especialidad, open, defaultComercioId, defaultCarreraId, defaultRubroId, comercios]);

    // Filtrar carreras que pertenezcan al comercio seleccionado actualmente
    const availableCarreras = useMemo(() => {
        return carreras.filter((c) => String(c.comercio_id) === String(data.comercio_id));
    }, [carreras, data.comercio_id]);

    const groupedRubros = useMemo(() => {
        if (!rubros || rubros.length === 0) return null;
        const groups: Record<string, Rubro[]> = {};
        for (const r of rubros) {
            const cat = r.categoria || 'Otros Rubros';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(r);
        }
        return Object.entries(groups);
    }, [rubros]);

    const validate = (): boolean => {
        const newErrors: { comercio_id?: string; nombre?: string } = {};

        if (!data.comercio_id) {
            newErrors.comercio_id = 'Debes seleccionar el comercio o sede responsable.';
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
                    notify.success(`Especialidad "${data.nombre}" actualizada con éxito.`);
                    onOpenChange(false);
                    reset();
                },
                onError: (serverErrors) => {
                    const firstError = Object.values(serverErrors)[0];
                    notify.error(firstError || 'Ocurrió un error al actualizar la especialidad.');
                },
            });
        } else {
            post(`/admin/especialidades`, {
                preserveScroll: true,
                onSuccess: () => {
                    notify.success(`Especialidad "${data.nombre}" registrada con éxito.`);
                    onOpenChange(false);
                    reset();
                },
                onError: (serverErrors) => {
                    const firstError = Object.values(serverErrors)[0];
                    notify.error(firstError || 'Ocurrió un error al registrar la especialidad.');
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
                    <span>{isEditing ? 'Editar Especialidad' : 'Nueva Especialidad'}</span>
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth size="small" error={!!(clientErrors.comercio_id || errors.comercio_id)}>
                                    <InputLabel id="select-comercio-label">Comercio / Instituto *</InputLabel>
                                    <Select
                                        labelId="select-comercio-label"
                                        value={data.comercio_id}
                                        label="Comercio / Instituto *"
                                        onChange={(e) => {
                                            const newId = e.target.value;
                                            setData((prev) => ({
                                                ...prev,
                                                comercio_id: newId,
                                                carrera_id: '',
                                            }));
                                            if (clientErrors.comercio_id) {
                                                setClientErrors((prev) => ({ ...prev, comercio_id: undefined }));
                                            }
                                        }}
                                    >
                                        {comercios.map((c) => (
                                            <MenuItem key={c.id} value={String(c.id)}>
                                                <ComercioBadge comercio={c} size={22} showName />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {(clientErrors.comercio_id || errors.comercio_id) && (
                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                            {clientErrors.comercio_id || errors.comercio_id}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth size="small" error={!!errors.rubro_id}>
                                    <InputLabel id="select-rubro-label">Rubro / Categoría</InputLabel>
                                    <Select
                                        labelId="select-rubro-label"
                                        value={data.rubro_id}
                                        label="Rubro / Categoría"
                                        onChange={(e) => setData('rubro_id', e.target.value)}
                                    >
                                        <MenuItem value="">
                                            <Typography variant="body2" color="text.secondary">
                                                Sin Categoría / Especialidad Libre
                                            </Typography>
                                        </MenuItem>

                                        {groupedRubros ? (
                                            groupedRubros.map(([catName, items]) => [
                                                <ListSubheader key={catName} sx={{ fontWeight: 800, color: 'text.primary', bgcolor: 'action.hover' }}>
                                                    {catName}
                                                </ListSubheader>,
                                                ...items.map((r) => (
                                                    <MenuItem key={r.id} value={String(r.id)}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <LabelIcon sx={{ fontSize: '1.1rem', color: r.color_hex || '#7c3aed', flexShrink: 0 }} />
                                                            {r.nombre}
                                                        </Box>
                                                    </MenuItem>
                                                )),
                                            ])
                                        ) : (
                                            rubros.map((r) => (
                                                <MenuItem key={r.id} value={String(r.id)}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LabelIcon sx={{ fontSize: '1.1rem', color: r.color_hex || '#7c3aed', flexShrink: 0 }} />
                                                        {r.nombre}
                                                    </Box>
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                    {errors.rubro_id && (
                                        <FormHelperText error>{errors.rubro_id}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            {/* Carrera Asociada (si el comercio posee carreras como AVANTI o SIS) */}
                            {availableCarreras.length > 0 && (
                                <Grid size={{ xs: 12 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="select-carrera-label" shrink>Carrera Perteneciente (Opcional)</InputLabel>
                                        <Select
                                            labelId="select-carrera-label"
                                            value={data.carrera_id}
                                            label="Carrera Perteneciente (Opcional)"
                                            displayEmpty
                                            notched
                                            onChange={(e) => setData('carrera_id', e.target.value)}
                                            renderValue={(selected) => {
                                                if (!selected) {
                                                    return (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <StoreIcon sx={{ fontSize: '1.1rem', color: 'text.secondary' }} />
                                                            <Typography variant="body2" color="text.secondary">General / Sin Carrera Específica</Typography>
                                                        </Box>
                                                    );
                                                }
                                                const carrera = availableCarreras.find((c) => String(c.id) === String(selected));
                                                return (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <SchoolIcon sx={{ fontSize: '1rem', color: 'primary.main' }} />
                                                        <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                                                            {carrera ? `${carrera.nombre} ${carrera.codigo ? `(${carrera.codigo})` : ''}` : selected}
                                                        </Typography>
                                                    </Box>
                                                );
                                            }}
                                        >
                                            <MenuItem value="">
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <StoreIcon sx={{ fontSize: '1.1rem', color: 'text.secondary' }} />
                                                    <Typography variant="body2">General / Sin Carrera Específica</Typography>
                                                </Box>
                                            </MenuItem>
                                            {availableCarreras.map((c) => (
                                                <MenuItem key={c.id} value={String(c.id)}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <SchoolIcon sx={{ fontSize: '1rem', color: 'primary.main' }} />
                                                        <Typography variant="body2">
                                                            {c.nombre} {c.codigo ? `(${c.codigo})` : ''}
                                                        </Typography>
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>
                                            Asocia esta especialidad como parte de una carrera técnica (ej. Cosmetología en Avanti)
                                        </FormHelperText>
                                    </FormControl>
                                </Grid>
                            )}
                        </Grid>

                        <TextField
                            label="Nombre de la Especialidad *"
                            value={data.nombre}
                            onChange={(e) => {
                                setData('nombre', e.target.value);
                                if (clientErrors.nombre) {
                                    setClientErrors((prev) => ({ ...prev, nombre: undefined }));
                                }
                            }}
                            placeholder="Ej. Especialidad en Full Stack Cloud & DevOps..."
                            error={!!(clientErrors.nombre || errors.nombre)}
                            helperText={clientErrors.nombre || errors.nombre || 'Mínimo 3 caracteres requeridos'}
                            fullWidth
                            required
                            size="small"
                        />

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Flyer (Link del Documento / Imagen)"
                                    value={data.flyer}
                                    onChange={(e) => setData('flyer', e.target.value)}
                                    placeholder="https://.../flyer-especialidad.jpg"
                                    error={!!errors.flyer}
                                    helperText={errors.flyer}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Brochure (Link del Documento PDF)"
                                    value={data.brochure}
                                    onChange={(e) => setData('brochure', e.target.value)}
                                    placeholder="https://.../brochure-especialidad.pdf"
                                    error={!!errors.brochure}
                                    helperText={errors.brochure}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="YouTube (Video / Tutorial)"
                                    value={data.youtube}
                                    onChange={(e) => setData('youtube', e.target.value)}
                                    placeholder="https://youtube.com/watch?v=..."
                                    error={!!errors.youtube}
                                    helperText={errors.youtube}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Actualizado Drive (Link de Google Drive)"
                                    value={data.actualizado_drive}
                                    onChange={(e) => setData('actualizado_drive', e.target.value)}
                                    placeholder="https://drive.google.com/drive/folders/..."
                                    error={!!errors.actualizado_drive}
                                    helperText={errors.actualizado_drive || 'Carpeta o archivo actualizado en Drive'}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth size="small" error={!!errors.estado_id}>
                                    <InputLabel id="select-estado-especialidad-label">Estado</InputLabel>
                                    <Select
                                        labelId="select-estado-especialidad-label"
                                        value={data.estado_id}
                                        label="Estado"
                                        onChange={(e) => setData('estado_id', e.target.value)}
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
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Precio (Monto o Inversión)"
                                    value={data.precio}
                                    onChange={(e) => setData('precio', e.target.value)}
                                    placeholder="Ej. S/ 480 o Gratuito"
                                    error={!!errors.precio}
                                    helperText={errors.precio}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={() => onOpenChange(false)}
                        sx={{ textTransform: 'none', borderRadius: 1 }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={processing}
                        sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 1, px: 2.5 }}
                    >
                        {processing ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : isEditing ? (
                            'Actualizar Especialidad'
                        ) : (
                            'Registrar Especialidad'
                        )}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
