import { useForm } from '@inertiajs/react';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
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
import { useEffect, useState } from 'react';
import { useNotification } from '@/hooks/use-notification';
import { isMinLength } from '@/lib/validation';
import type { Diplomado, Comercio } from '@/types';

interface DiplomadoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    diplomado?: Diplomado | null;
    comercios: Comercio[];
    carreras?: { id: number; comercio_id: number; nombre: string; codigo?: string | null }[];
    defaultComercioId?: number | null;
    defaultCarreraId?: number | null;
    currentTeamSlug: string;
}

export function DiplomadoDialog({
    open,
    onOpenChange,
    diplomado,
    comercios,
    carreras = [],
    defaultComercioId,
    defaultCarreraId,
    currentTeamSlug,
}: DiplomadoDialogProps) {
    const isEditing = !!diplomado;
    const { notify } = useNotification();
    const [clientErrors, setClientErrors] = useState<{ comercio_id?: string; nombre?: string }>({});

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm<{
            comercio_id: string;
            carrera_id: string;
            tipo: string;
            nombre: string;
            flyer: string;
            brochure: string;
            youtube: string;
            precio: string;
            actualizado_drive: string;
        }>({
            comercio_id: defaultComercioId ? String(defaultComercioId) : (comercios[0]?.id ? String(comercios[0].id) : ''),
            carrera_id: defaultCarreraId ? String(defaultCarreraId) : '',
            tipo: '',
            nombre: '',
            flyer: '',
            brochure: '',
            youtube: '',
            precio: '',
            actualizado_drive: '',
        });

    useEffect(() => {
        if (diplomado) {
            setData({
                comercio_id: String(diplomado.comercio_id),
                carrera_id: diplomado.carrera_id ? String(diplomado.carrera_id) : '',
                tipo: diplomado.tipo || '',
                nombre: diplomado.nombre,
                flyer: diplomado.flyer || '',
                brochure: diplomado.brochure || '',
                youtube: diplomado.youtube || '',
                precio: diplomado.precio || '',
                actualizado_drive: diplomado.actualizado_drive || '',
            });
        } else {
            reset();

            const targetComercioId = defaultComercioId || comercios[0]?.id;
            if (targetComercioId) {
                setData(prev => ({
                    ...prev,
                    comercio_id: String(targetComercioId),
                    carrera_id: defaultCarreraId ? String(defaultCarreraId) : '',
                }));
                const targetComercio = comercios.find(c => String(c.id) === String(targetComercioId));
                if (targetComercio?.slug === 'cecava-min' || targetComercio?.codigo === 'CECAVA-MIN') {
                    setData('tipo', '');
                } else if (targetComercio?.slug === 'magister' || targetComercio?.codigo === 'MAGISTER') {
                    setData('tipo', 'generico');
                } else if (targetComercio?.slug === 'cecava' || targetComercio?.codigo === 'CECAVA') {
                    setData('tipo', 'ambientales');
                } else {
                    setData('tipo', '');
                }
            }
        }

        setClientErrors({});
        clearErrors();
    }, [diplomado, open, defaultComercioId, defaultCarreraId, comercios]);

    const selectedComercioObj = comercios.find(c => String(c.id) === String(data.comercio_id));
    const isCecavaMin = selectedComercioObj?.slug === 'cecava-min' || selectedComercioObj?.codigo === 'CECAVA-MIN';

    const validate = (): boolean => {
        const newErrors: { comercio_id?: string; nombre?: string } = {};

        if (!data.comercio_id) {
            newErrors.comercio_id = 'Debes seleccionar un comercio o sede responsable.';
        }
        if (!isMinLength(data.nombre, 3)) {
            newErrors.nombre = 'El nombre del diplomado debe tener al menos 3 caracteres.';
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

        if (isEditing && diplomado) {
            put(`/${currentTeamSlug}/admin/diplomados/${diplomado.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    notify.success(`Diplomado "${data.nombre}" actualizado con éxito.`);
                    onOpenChange(false);
                    reset();
                },
                onError: () => {
                    notify.error('Ocurrió un error al actualizar el diplomado.');
                },
            });
        } else {
            post(`/${currentTeamSlug}/admin/diplomados`, {
                preserveScroll: true,
                onSuccess: () => {
                    notify.success(`Diplomado "${data.nombre}" registrado exitosamente.`);
                    onOpenChange(false);
                    reset();
                },
                onError: () => {
                    notify.error('Ocurrió un error al registrar el diplomado.');
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
                    <WorkspacePremiumIcon color="primary" />
                    <span>{isEditing ? 'Editar Diplomado' : 'Nuevo Diplomado'}</span>
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
                                            setData(prev => ({
                                                ...prev,
                                                comercio_id: newId,
                                                carrera_id: '',
                                            }));
                                            if (clientErrors.comercio_id) {
                                                setClientErrors(prev => ({ ...prev, comercio_id: undefined }));
                                            }
                                            const cObj = comercios.find(c => String(c.id) === String(newId));
                                            if (cObj?.slug === 'cecava-min' || cObj?.codigo === 'CECAVA-MIN') {
                                                setData('tipo', '');
                                            }
                                        }}
                                    >
                                        {comercios.map((c) => (
                                            <MenuItem key={c.id} value={String(c.id)}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Box
                                                        sx={{
                                                            width: 10,
                                                            height: 10,
                                                            borderRadius: '50%',
                                                            bgcolor: c.color_hex || '#16a34a',
                                                        }}
                                                    />
                                                    <span>{c.nombre}</span>
                                                </Box>
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
                                <FormControl fullWidth size="small">
                                    <InputLabel id="select-tipo-label">Rubro / Categoría</InputLabel>
                                    <Select
                                        labelId="select-tipo-label"
                                        value={data.tipo}
                                        label="Rubro / Categoría"
                                        onChange={(e) => setData('tipo', e.target.value)}
                                    >
                                        <MenuItem value="">🎓 Sin Categoría / Diplomado Libre</MenuItem>

                                        <ListSubheader sx={{ fontWeight: 800, color: 'text.primary', bgcolor: 'action.hover' }}>
                                            CECAVA (Rubros Técnicos)
                                        </ListSubheader>
                                        <MenuItem value="ambientales">🌿 Diplomados Ambientales</MenuItem>
                                        <MenuItem value="calidad_isos">🏆 Diplomados Calidad e ISOs</MenuItem>
                                        <MenuItem value="mineros">⛏️ Diplomados Mineros</MenuItem>
                                        <MenuItem value="administracion">💼 Diplomados Administración</MenuItem>
                                        <MenuItem value="arquitectura_ingenieria">📐 Diplomados Arquitectura e Ingeniería</MenuItem>
                                        <MenuItem value="osha">🦺 Diplomados OSHA</MenuItem>
                                        <MenuItem value="comercio_exterior">🚢 Diplomados Comercio Exterior</MenuItem>
                                        <MenuItem value="rubro_legal">⚖️ Diplomados Rubro Legal</MenuItem>
                                        <MenuItem value="no_actualizados">📁 Diplomados No Actualizados</MenuItem>

                                        <ListSubheader sx={{ fontWeight: 800, color: 'text.primary', bgcolor: 'action.hover' }}>
                                            MAGISTER (Educación)
                                        </ListSubheader>
                                        <MenuItem value="nombramiento">📝 Nombramiento Docente</MenuItem>
                                        <MenuItem value="secundaria">🏫 Secundaria</MenuItem>
                                        <MenuItem value="generico">🎓 Genérico / Otros</MenuItem>
                                    </Select>
                                    {isCecavaMin && (
                                        <FormHelperText sx={{ color: 'text.secondary' }}>
                                            En Cecava-min los diplomados son libres (sin categoría asociada).
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            {/* Carrera Asociada (si el comercio posee carreras como AVANTI o SIS) */}
                            {carreras.filter(c => String(c.comercio_id) === String(data.comercio_id)).length > 0 && (
                                <Grid size={{ xs: 12 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="select-carrera-label">Carrera Perteneciente (Opcional)</InputLabel>
                                        <Select
                                            labelId="select-carrera-label"
                                            value={data.carrera_id}
                                            label="Carrera Perteneciente (Opcional)"
                                            onChange={(e) => setData('carrera_id', e.target.value)}
                                        >
                                            <MenuItem value="">🎓 General / Sin Carrera Específica</MenuItem>
                                            {carreras
                                                .filter(c => String(c.comercio_id) === String(data.comercio_id))
                                                .map((c) => (
                                                    <MenuItem key={c.id} value={String(c.id)}>
                                                        📚 {c.nombre} {c.codigo ? `(${c.codigo})` : ''}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                        <FormHelperText>
                                            Asocia este diplomado como especialidad de una carrera técnica (ej. Cosmetología en Avanti)
                                        </FormHelperText>
                                    </FormControl>
                                </Grid>
                            )}
                        </Grid>

                        <TextField
                            label="Nombre del Diplomado *"
                            value={data.nombre}
                            onChange={(e) => {
                                setData('nombre', e.target.value);
                                if (clientErrors.nombre) {
                                    setClientErrors(prev => ({ ...prev, nombre: undefined }));
                                }
                            }}
                            placeholder="Ej. Diplomado en Gestión Integral de Operaciones Mineras..."
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
                                    placeholder="https://.../flyer-diplomado.jpg"
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
                                    placeholder="https://.../brochure-diplomado.pdf"
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
                                    label="Precio (Monto o Inversión)"
                                    value={data.precio}
                                    onChange={(e) => setData('precio', e.target.value)}
                                    placeholder="Ej. S/ 390, S/ 450"
                                    error={!!errors.precio}
                                    helperText={errors.precio}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Actualizado Drive (Link de Google Drive / Carpeta de Materiales)"
                                    value={data.actualizado_drive}
                                    onChange={(e) => setData('actualizado_drive', e.target.value)}
                                    placeholder="https://drive.google.com/drive/folders/..."
                                    error={!!errors.actualizado_drive}
                                    helperText={errors.actualizado_drive || 'Enlace a la carpeta o archivo actualizado en Google Drive'}
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
                        {isEditing ? 'Guardar Cambios' : 'Registrar Diplomado'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
