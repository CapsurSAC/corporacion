import { useForm } from '@inertiajs/react';
import LabelIcon from '@mui/icons-material/Label';
import MenuBookIcon from '@mui/icons-material/MenuBook';
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
    ListSubheader,
    FormControl,
    InputLabel,
    Button,
    Box,
    Grid,
    CircularProgress,
    FormHelperText,
    Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useNotification } from '@/hooks/use-notification';
import { isMinLength } from '@/lib/validation';
import type { Curso, Comercio, Rubro, Estado } from '@/types';

interface CursoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    curso?: Curso | null;
    comercios: Comercio[];
    carreras?: { id: number; comercio_id: number; nombre: string; codigo?: string | null }[];
    rubros?: Rubro[];
    estados?: Estado[];
    defaultComercioId?: number | null;
    defaultCarreraId?: number | null;
}

export function CursoDialog({
    open,
    onOpenChange,
    curso,
    comercios,
    carreras = [],
    rubros = [],
    estados = [],
    defaultComercioId,
    defaultCarreraId,
    
}: CursoDialogProps) {
    const isEditing = !!curso;
    const { notify } = useNotification();
    const [clientErrors, setClientErrors] = useState<{ comercio_id?: string; nombre?: string }>({});

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm<{
            comercio_id: string;
            carrera_id: string;
            estado_id: string;
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
            estado_id: '',
            tipo: 'tradicional',
            nombre: '',
            flyer: '',
            brochure: '',
            youtube: '',
            precio: '',
            actualizado_drive: '',
        });

    useEffect(() => {
        if (curso) {
            setData({
                comercio_id: String(curso.comercio_id),
                carrera_id: curso.carrera_id ? String(curso.carrera_id) : '',
                estado_id: curso.estado_id ? String(curso.estado_id) : '',
                tipo: curso.tipo || '',
                nombre: curso.nombre,
                flyer: curso.flyer || '',
                brochure: curso.brochure || '',
                youtube: curso.youtube || '',
                precio: curso.precio || '',
                actualizado_drive: curso.actualizado_drive || '',
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
                if (targetComercio?.slug === 'matpel' || targetComercio?.codigo === 'MATPEL') {
                    setData('tipo', '');
                } else if (targetComercio?.slug === 'next-online' || targetComercio?.codigo === 'NEXT') {
                    setData('tipo', 'tradicional');
                } else {
                    setData('tipo', '');
                }
            }
        }

        setClientErrors({});
        clearErrors();
    }, [curso, open, defaultComercioId, defaultCarreraId, comercios]);

    const selectedComercioObj = comercios.find(c => String(c.id) === String(data.comercio_id));
    const isMatpel = selectedComercioObj?.slug === 'matpel' || selectedComercioObj?.codigo === 'MATPEL';

    const validate = (): boolean => {
        const newErrors: { comercio_id?: string; nombre?: string } = {};

        if (!data.comercio_id) {
            newErrors.comercio_id = 'Debes seleccionar un comercio o sede responsable.';
        }
        if (!isMinLength(data.nombre, 3)) {
            newErrors.nombre = 'El nombre del curso debe tener al menos 3 caracteres.';
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

        if (isEditing && curso) {
            put(`/admin/cursos/${curso.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    notify.success(`Curso "${data.nombre}" actualizado con éxito.`);
                    onOpenChange(false);
                    reset();
                },
                onError: () => {
                    notify.error('Ocurrió un error al actualizar el curso.');
                },
            });
        } else {
            post(`/admin/cursos`, {
                preserveScroll: true,
                onSuccess: () => {
                    notify.success(`Curso "${data.nombre}" registrado exitosamente.`);
                    onOpenChange(false);
                    reset();
                },
                onError: () => {
                    notify.error('Ocurrió un error al registrar el curso.');
                },
            });
        }
    };

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

    return (
        <Dialog
            open={open}
            onClose={() => onOpenChange(false)}
            maxWidth="sm"
            fullWidth
        >
            <form onSubmit={handleSubmit} noValidate>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
                    <MenuBookIcon color="primary" />
                    <span>{isEditing ? 'Editar Curso' : 'Nuevo Curso'}</span>
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 7 }}>
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
                                            if (cObj?.slug === 'matpel' || cObj?.codigo === 'MATPEL') {
                                                setData('tipo', '');
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

                            <Grid size={{ xs: 12, sm: 5 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="select-tipo-label">Rubro / Categoría</InputLabel>
                                    <Select
                                        labelId="select-tipo-label"
                                        value={data.tipo}
                                        label="Rubro / Categoría"
                                        onChange={(e) => setData('tipo', e.target.value)}
                                    >
                                        <MenuItem value="">
                                            <Typography variant="body2" color="text.secondary">Sin Categoría / Curso Libre</Typography>
                                        </MenuItem>

                                        {groupedRubros ? (
                                            groupedRubros.map(([catName, items]) => [
                                                <ListSubheader key={catName} sx={{ fontWeight: 800, color: 'text.primary', bgcolor: 'action.hover' }}>
                                                    {catName}
                                                </ListSubheader>,
                                                ...items.map((r) => (
                                                    <MenuItem key={r.clave} value={r.clave}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <LabelIcon sx={{ fontSize: '1.1rem', color: r.color_hex || '#0284c7', flexShrink: 0 }} />
                                                            <Typography variant="body2">{r.nombre}</Typography>
                                                        </Box>
                                                    </MenuItem>
                                                )),
                                            ])
                                        ) : (
                                            <>
                                                <ListSubheader sx={{ fontWeight: 800, color: 'text.primary', bgcolor: 'action.hover' }}>
                                                    Modalidad de Formación
                                                </ListSubheader>
                                                <MenuItem value="tradicional">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LabelIcon sx={{ fontSize: '1.1rem', color: '#0284c7' }} />
                                                        <Typography variant="body2">Curso Tradicional</Typography>
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem value="especializado">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LabelIcon sx={{ fontSize: '1.1rem', color: '#f59e0b' }} />
                                                        <Typography variant="body2">Curso Especializado</Typography>
                                                    </Box>
                                                </MenuItem>

                                                <ListSubheader sx={{ fontWeight: 800, color: 'text.primary', bgcolor: 'action.hover' }}>
                                                    CECAVA (Rubros Técnicos)
                                                </ListSubheader>
                                                <MenuItem value="ambientales">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LabelIcon sx={{ fontSize: '1.1rem', color: '#059669' }} />
                                                        <Typography variant="body2">Rubro Ambiental</Typography>
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem value="calidad_isos">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LabelIcon sx={{ fontSize: '1.1rem', color: '#0284c7' }} />
                                                        <Typography variant="body2">Rubro Calidad e ISOs</Typography>
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem value="mineros">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LabelIcon sx={{ fontSize: '1.1rem', color: '#d97706' }} />
                                                        <Typography variant="body2">Rubro Minero</Typography>
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem value="administracion">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LabelIcon sx={{ fontSize: '1.1rem', color: '#0d9488' }} />
                                                        <Typography variant="body2">Rubro Administración</Typography>
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem value="arquitectura_ingenieria">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LabelIcon sx={{ fontSize: '1.1rem', color: '#6366f1' }} />
                                                        <Typography variant="body2">Rubro Arquitectura e Ingeniería</Typography>
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem value="osha">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LabelIcon sx={{ fontSize: '1.1rem', color: '#dc2626' }} />
                                                        <Typography variant="body2">Rubro OSHA</Typography>
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem value="comercio_exterior">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LabelIcon sx={{ fontSize: '1.1rem', color: '#0891b2' }} />
                                                        <Typography variant="body2">Rubro Comercio Exterior</Typography>
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem value="rubro_legal">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LabelIcon sx={{ fontSize: '1.1rem', color: '#7c3aed' }} />
                                                        <Typography variant="body2">Rubro Legal</Typography>
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem value="no_actualizados">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LabelIcon sx={{ fontSize: '1.1rem', color: '#64748b' }} />
                                                        <Typography variant="body2">No Actualizados</Typography>
                                                    </Box>
                                                </MenuItem>

                                                <ListSubheader sx={{ fontWeight: 800, color: 'text.primary', bgcolor: 'action.hover' }}>
                                                    MAGISTER (Educación)
                                                </ListSubheader>
                                                <MenuItem value="nombramiento">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LabelIcon sx={{ fontSize: '1.1rem', color: '#7c3aed' }} />
                                                        <Typography variant="body2">Nombramiento Docente</Typography>
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem value="secundaria">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LabelIcon sx={{ fontSize: '1.1rem', color: '#059669' }} />
                                                        <Typography variant="body2">Secundaria</Typography>
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem value="generico">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LabelIcon sx={{ fontSize: '1.1rem', color: '#0284c7' }} />
                                                        <Typography variant="body2">Genérico / Otros</Typography>
                                                    </Box>
                                                </MenuItem>
                                            </>
                                        )}
                                    </Select>
                                    {isMatpel && (
                                        <FormHelperText sx={{ color: 'text.secondary' }}>
                                            En Matpel los cursos son libres (sin rubro/categoría específica).
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            {/* Carrera Asociada (si el comercio posee carreras como AVANTI o SIS) */}
                            {carreras.filter(c => String(c.comercio_id) === String(data.comercio_id)).length > 0 && (
                                <Grid size={{ xs: 12 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="select-carrera-curso-label">Carrera Perteneciente (Opcional)</InputLabel>
                                        <Select
                                            labelId="select-carrera-curso-label"
                                            value={data.carrera_id}
                                            label="Carrera Perteneciente (Opcional)"
                                            onChange={(e) => setData('carrera_id', e.target.value)}
                                        >
                                            <MenuItem value="">
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <SchoolIcon sx={{ fontSize: '1.1rem', color: 'text.secondary' }} />
                                                    <Typography variant="body2">General / Sin Carrera Específica</Typography>
                                                </Box>
                                            </MenuItem>
                                            {carreras
                                                .filter(c => String(c.comercio_id) === String(data.comercio_id))
                                                .map((c) => (
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
                                            Asocia este curso a una carrera técnica específica (ej. Cosmetología en Avanti)
                                        </FormHelperText>
                                    </FormControl>
                                </Grid>
                            )}
                        </Grid>

                        <TextField
                            label="Nombre del Curso *"
                            value={data.nombre}
                            onChange={(e) => {
                                setData('nombre', e.target.value);
                                if (clientErrors.nombre) {
                                    setClientErrors(prev => ({ ...prev, nombre: undefined }));
                                }
                            }}
                            placeholder="Ej. Manejo de Materiales Peligrosos - MATPEL..."
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
                                    placeholder="https://.../flyer-curso.jpg"
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
                                    placeholder="https://.../brochure-curso.pdf"
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
                                    <InputLabel id="select-estado-curso-label">Estado</InputLabel>
                                    <Select
                                        labelId="select-estado-curso-label"
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
                                    placeholder="Ej. S/ 220, S/ 280"
                                    error={!!errors.precio}
                                    helperText={errors.precio}
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
                        {isEditing ? 'Guardar Cambios' : 'Registrar Curso'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
