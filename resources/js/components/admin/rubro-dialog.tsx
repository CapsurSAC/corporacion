import { useForm } from '@inertiajs/react';
import PaletteIcon from '@mui/icons-material/Palette';
import TagsIcon from '@mui/icons-material/Sell';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Grid,
    CircularProgress,
    FormControlLabel,
    Checkbox,
    Typography,
    Chip,
    Autocomplete,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNotification } from '@/hooks/use-notification';
import { isMinLength, isValidHexColor } from '@/lib/validation';
import type { Rubro } from '@/types';

const COLOR_PRESETS = [
    { name: 'Púrpura (Legal/Especializado)', hex: '#7c3aed' },
    { name: 'Azul (Calidad/Tradicional)', hex: '#0284c7' },
    { name: 'Verde (Ambientales)', hex: '#059669' },
    { name: 'Naranja (Mineros)', hex: '#d97706' },
    { name: 'Teal (Administración)', hex: '#0d9488' },
    { name: 'Índigo (Ingeniería)', hex: '#6366f1' },
    { name: 'Rojo (OSHA/Seguridad)', hex: '#dc2626' },
    { name: 'Cian (Comex)', hex: '#0891b2' },
    { name: 'Gris (Archivo)', hex: '#64748b' },
    { name: 'Rosa (Salud/Especial)', hex: '#e11d48' },
    { name: 'Esmeralda (Educación)', hex: '#10b981' },
];

const DEFAULT_CATEGORIAS = [
    'CECAVA (Rubros Técnicos)',
    'MAGISTER (Educación)',
    'Modalidad de Formación',
    'Salud y Seguridad',
    'Tecnología e Informática',
];

interface RubroDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    rubro?: Rubro | null;
    categorias?: string[];
}

export function RubroDialog({
    open,
    onOpenChange,
    rubro,
    categorias = [],
    
}: RubroDialogProps) {
    const { notify } = useNotification();
    const isEditing = Boolean(rubro);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            nombre: '',
            clave: '',
            color_hex: '#7c3aed',
            categoria: '',
            descripcion: '',
            activo: true,
            orden: 0,
        });

    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
    const [manualClave, setManualClave] = useState(false);

    useEffect(() => {
        if (rubro) {
            setData({
                nombre: rubro.nombre || '',
                clave: rubro.clave || '',
                color_hex: rubro.color_hex || '#7c3aed',
                categoria: rubro.categoria || '',
                descripcion: rubro.descripcion || '',
                activo: rubro.activo ?? true,
                orden: rubro.orden ?? 0,
            });
            setManualClave(true);
        } else {
            reset();
            setManualClave(false);
        }
        setClientErrors({});
        clearErrors();
    }, [rubro, open]);

    const handleNombreChange = (val: string) => {
        setData((prev) => {
            const next = { ...prev, nombre: val };
            if (!manualClave && !isEditing) {
                next.clave = val
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9]+/g, '_')
                    .replace(/^_+|_+$/g, '');
            }
            return next;
        });
        if (clientErrors.nombre) {
            setClientErrors((prev) => ({ ...prev, nombre: undefined as any }));
        }
    };

    const handleClaveChange = (val: string) => {
        setManualClave(true);
        const formatted = val
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9_]+/g, '_');
        setData('clave', formatted);
        if (clientErrors.clave) {
            setClientErrors((prev) => ({ ...prev, clave: undefined as any }));
        }
    };

    const validate = (): boolean => {
        const errs: Record<string, string> = {};

        if (!isMinLength(data.nombre.trim(), 2)) {
            errs.nombre = 'El nombre del rubro debe tener al menos 2 caracteres.';
        }
        if (isEditing && !isMinLength(data.clave.trim(), 2)) {
            errs.clave = 'La clave del rubro es obligatoria.';
        }
        if (!isValidHexColor(data.color_hex)) {
            errs.color_hex = 'Debe ser un color hexadecimal válido (ej: #7c3aed).';
        }

        setClientErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        if (isEditing && rubro) {
            put(`/admin/rubros/${rubro.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    notify.success('Rubro actualizado correctamente.');
                    onOpenChange(false);
                },
                onError: () => {
                    notify.error('Por favor corrige los errores en el formulario.');
                },
            });
        } else {
            post(`/admin/rubros`, {
                preserveScroll: true,
                onSuccess: () => {
                    notify.success('Rubro creado exitosamente.');
                    onOpenChange(false);
                },
                onError: () => {
                    notify.error('Por favor verifica los campos e intenta de nuevo.');
                },
            });
        }
    };

    const allCategories = Array.from(new Set([...DEFAULT_CATEGORIAS, ...categorias])).filter(Boolean);

    return (
        <Dialog
            open={open}
            onClose={() => !processing && onOpenChange(false)}
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: { sx: { borderRadius: 2.5 } },
            }}
        >
            <form onSubmit={handleSubmit}>
                <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 1.5,
                            bgcolor: `${data.color_hex}20`,
                            color: data.color_hex,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${data.color_hex}40`,
                        }}
                    >
                        <TagsIcon fontSize="small" />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.2 }}>
                            {isEditing ? 'Editar Rubro' : 'Nuevo Rubro'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Categorización para clasificar diplomados y cursos del catálogo
                        </Typography>
                    </Box>
                </DialogTitle>

                <DialogContent dividers sx={{ p: 3 }}>
                    <Grid container spacing={2.5}>
                        {/* Vista previa en vivo del Badge */}
                        <Grid size={{ xs: 12 }}>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
                                    border: '1px dashed',
                                    borderColor: 'divider',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                                    VISTA PREVIA EN TABLAS Y SELECTS:
                                </Typography>
                                <Chip
                                    label={data.nombre.trim() || 'Nombre del Rubro'}
                                    size="small"
                                    sx={{
                                        bgcolor: `${data.color_hex}18`,
                                        color: data.color_hex,
                                        border: `1px solid ${data.color_hex}45`,
                                        fontWeight: 800,
                                        fontSize: '0.78rem',
                                        height: 24,
                                        borderRadius: 1,
                                    }}
                                />
                            </Box>
                        </Grid>

                        {/* Nombre del Rubro */}
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Nombre del Rubro *"
                                placeholder="Ej: Salud Ocupacional, Mineros, Derecho Ambiental..."
                                fullWidth
                                size="small"
                                value={data.nombre}
                                onChange={(e) => handleNombreChange(e.target.value)}
                                error={!!(clientErrors.nombre || errors.nombre)}
                                helperText={clientErrors.nombre || errors.nombre}
                            />
                        </Grid>

                        {/* Clave interna / Slug */}
                        <Grid size={{ xs: 12, sm: 7 }}>
                            <TextField
                                label="Clave identificadora (Slug) *"
                                placeholder="ej: salud_ocupacional"
                                fullWidth
                                size="small"
                                value={data.clave}
                                onChange={(e) => handleClaveChange(e.target.value)}
                                error={!!(clientErrors.clave || errors.clave)}
                                helperText={
                                    clientErrors.clave ||
                                    errors.clave ||
                                    'Identificador único en minúsculas y guiones bajos'
                                }
                            />
                        </Grid>

                        {/* Orden */}
                        <Grid size={{ xs: 12, sm: 5 }}>
                            <TextField
                                label="Orden de visualización"
                                type="number"
                                fullWidth
                                size="small"
                                value={data.orden}
                                onChange={(e) => setData('orden', parseInt(e.target.value) || 0)}
                                helperText="Prioridad en menús (0 primero)"
                            />
                        </Grid>

                        {/* Categoría / Agrupador */}
                        <Grid size={{ xs: 12 }}>
                            <Autocomplete
                                freeSolo
                                options={allCategories}
                                value={data.categoria}
                                onInputChange={(_, newInputValue) => {
                                    setData('categoria', newInputValue);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Categoría o Agrupación (Opcional)"
                                        placeholder="Ej: CECAVA (Rubros Técnicos), MAGISTER (Educación)..."
                                        size="small"
                                        helperText="Agrupa los rubros en las listas desplegables"
                                    />
                                )}
                            />
                        </Grid>

                        {/* Color Hex y Selector */}
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                                <PaletteIcon sx={{ fontSize: 16 }} />
                                COLOR DISTINTIVO DEL RUBRO
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                <input
                                    type="color"
                                    value={data.color_hex}
                                    onChange={(e) => setData('color_hex', e.target.value)}
                                    style={{
                                        width: 44,
                                        height: 40,
                                        borderRadius: 8,
                                        border: '1px solid #ccc',
                                        cursor: 'pointer',
                                        padding: 2,
                                    }}
                                />
                                <TextField
                                    size="small"
                                    placeholder="#7c3aed"
                                    value={data.color_hex}
                                    onChange={(e) => setData('color_hex', e.target.value)}
                                    error={!!(clientErrors.color_hex || errors.color_hex)}
                                    helperText={clientErrors.color_hex || errors.color_hex}
                                    sx={{ width: 140 }}
                                />
                            </Box>
                            {/* Paleta de colores rápidos */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                                {COLOR_PRESETS.map((preset) => (
                                    <Chip
                                        key={preset.hex}
                                        label={preset.name.split(' ')[0]}
                                        size="small"
                                        onClick={() => setData('color_hex', preset.hex)}
                                        sx={{
                                            bgcolor: `${preset.hex}20`,
                                            color: preset.hex,
                                            border: data.color_hex === preset.hex ? `2px solid ${preset.hex}` : `1px solid ${preset.hex}40`,
                                            fontWeight: 700,
                                            fontSize: '0.72rem',
                                            cursor: 'pointer',
                                            '&:hover': { bgcolor: `${preset.hex}30` },
                                        }}
                                    />
                                ))}
                            </Box>
                        </Grid>

                        {/* Descripción */}
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Descripción o Alcance (Opcional)"
                                placeholder="Describe el perfil, temas o carreras a las que aplica este rubro..."
                                fullWidth
                                multiline
                                rows={2.5}
                                size="small"
                                value={data.descripcion}
                                onChange={(e) => setData('descripcion', e.target.value)}
                            />
                        </Grid>

                        {/* Estado Activo */}
                        <Grid size={{ xs: 12 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={data.activo}
                                        onChange={(e) => setData('activo', e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label={
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                            Rubro Activo y Disponible
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Si se desmarca, no aparecerá en nuevos formularios pero se conservará en los existentes.
                                        </Typography>
                                    </Box>
                                }
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={() => onOpenChange(false)} disabled={processing} color="inherit">
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={processing}
                        startIcon={processing ? <CircularProgress size={16} /> : null}
                        sx={{ px: 3, fontWeight: 700, borderRadius: 1.5 }}
                    >
                        {isEditing ? 'Guardar Cambios' : 'Crear Rubro'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
