import { useForm } from '@inertiajs/react';
import MenuBookIcon from '@mui/icons-material/MenuBook';
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
    FormHelperText,
} from '@mui/material';
import { useEffect } from 'react';
import type { Curso, Comercio } from '@/types';

interface CursoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    curso?: Curso | null;
    comercios: Comercio[];
    carreras?: { id: number; comercio_id: number; nombre: string; codigo?: string | null }[];
    defaultComercioId?: number | null;
    defaultCarreraId?: number | null;
    currentTeamSlug: string;
}

export function CursoDialog({
    open,
    onOpenChange,
    curso,
    comercios,
    carreras = [],
    defaultComercioId,
    defaultCarreraId,
    currentTeamSlug,
}: CursoDialogProps) {
    const isEditing = !!curso;

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

        clearErrors();
    }, [curso, open, defaultComercioId, defaultCarreraId, comercios]);

    const selectedComercioObj = comercios.find(c => String(c.id) === String(data.comercio_id));
    const isMatpel = selectedComercioObj?.slug === 'matpel' || selectedComercioObj?.codigo === 'MATPEL';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && curso) {
            put(`/${currentTeamSlug}/admin/cursos/${curso.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        } else {
            post(`/${currentTeamSlug}/admin/cursos`, {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
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
            <form onSubmit={handleSubmit}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
                    <MenuBookIcon color="primary" />
                    <span>{isEditing ? 'Editar Curso' : 'Nuevo Curso'}</span>
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 7 }}>
                                <FormControl fullWidth size="small" error={!!errors.comercio_id}>
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
                                            const cObj = comercios.find(c => String(c.id) === String(newId));
                                            if (cObj?.slug === 'matpel' || cObj?.codigo === 'MATPEL') {
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
                                                            bgcolor: c.color_hex || '#3b82f6',
                                                        }}
                                                    />
                                                    <span>{c.nombre}</span>
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 5 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="select-tipo-label">Tipo de Curso</InputLabel>
                                    <Select
                                        labelId="select-tipo-label"
                                        value={data.tipo}
                                        label="Tipo de Curso"
                                        onChange={(e) => setData('tipo', e.target.value)}
                                    >
                                        <MenuItem value="">Sin Tipo / Curso Libre</MenuItem>
                                        <MenuItem value="tradicional">Tradicional</MenuItem>
                                        <MenuItem value="especializado">Especializado</MenuItem>
                                    </Select>
                                    {isMatpel && (
                                        <FormHelperText sx={{ color: 'text.secondary' }}>
                                            En Matpel los cursos son libres (sin tipo específico).
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
                                            <MenuItem value="">📖 General / Sin Carrera Específica</MenuItem>
                                            {carreras
                                                .filter(c => String(c.comercio_id) === String(data.comercio_id))
                                                .map((c) => (
                                                    <MenuItem key={c.id} value={String(c.id)}>
                                                        📚 {c.nombre} {c.codigo ? `(${c.codigo})` : ''}
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
                            onChange={(e) => setData('nombre', e.target.value)}
                            placeholder="Ej. Manejo de Materiales Peligrosos - MATPEL..."
                            error={!!errors.nombre}
                            helperText={errors.nombre}
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
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Precio (Monto o Inversión)"
                                    value={data.precio}
                                    onChange={(e) => setData('precio', e.target.value)}
                                    placeholder="Ej. S/ 220, S/ 280"
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
                                    fullWidth
                                    size="small"
                                    helperText="Enlace a la carpeta o archivo actualizado en Google Drive"
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
