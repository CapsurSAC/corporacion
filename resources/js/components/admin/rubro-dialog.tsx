import { useForm } from '@inertiajs/react';
import CheckIcon from '@mui/icons-material/Check';
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
    Tooltip,
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
            color_hex: '#7c3aed',
            categoria: '',
            descripcion: '',
            activo: true,
            orden: 0,
        });

    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (rubro) {
            setData({
                nombre: rubro.nombre || '',
                color_hex: rubro.color_hex || '#7c3aed',
                categoria: rubro.categoria || '',
                descripcion: rubro.descripcion || '',
                activo: rubro.activo ?? true,
                orden: rubro.orden ?? 0,
            });
        } else {
            reset();
        }
        setClientErrors({});
        clearErrors();
    }, [rubro, open]);

    const handleNombreChange = (val: string) => {
        setData('nombre', val);
        if (clientErrors.nombre) {
            setClientErrors((prev) => ({ ...prev, nombre: undefined as any }));
        }
    };

    const validate = (): boolean => {
        const errs: Record<string, string> = {};

        if (!isMinLength(data.nombre.trim(), 2)) {
            errs.nombre = 'El nombre del rubro debe tener al menos 2 caracteres.';
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

                <DialogContent dividers sx={{ px: 3, py: 2 }}>
                    <Grid container spacing={1.8}>
                        {/* Fila 1: Nombre del Rubro (8 cols) y Orden (4 cols) */}
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <TextField
                                label="Nombre del Rubro *"
                                placeholder="Ej: Salud Ocupacional, Mineros..."
                                fullWidth
                                size="small"
                                value={data.nombre}
                                onChange={(e) => handleNombreChange(e.target.value)}
                                error={!!(clientErrors.nombre || errors.nombre)}
                                helperText={clientErrors.nombre || errors.nombre}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                label="Orden"
                                type="number"
                                fullWidth
                                size="small"
                                placeholder="0"
                                value={data.orden}
                                onChange={(e) => setData('orden', parseInt(e.target.value) || 0)}
                                slotProps={{ htmlInput: { min: 0 } }}
                            />
                        </Grid>

                        {/* Fila 2: Categoría / Agrupador */}
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
                                        placeholder="Ej: CECAVA (Rubros Técnicos), MAGISTER..."
                                        size="small"
                                    />
                                )}
                            />
                        </Grid>

                        {/* Fila 3: Color Hex y Selector (Compacto y Elegante) */}
                        <Grid size={{ xs: 12 }}>
                            <Box
                                sx={{
                                    p: 1.5,
                                    borderRadius: 1.8,
                                    bgcolor: (theme) =>
                                        theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'grey.50',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                        <PaletteIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.84rem' }}>
                                            Color del Rubro
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' }, fontSize: '0.72rem' }}>
                                        Identificador visual en catálogo y tablas
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: { xs: '1fr', sm: '1.2fr 0.8fr' },
                                        gap: 1.5,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                        <Tooltip title="Haz clic para abrir el selector de color" arrow placement="top">
                                            <Box
                                                component="label"
                                                sx={{
                                                    position: 'relative',
                                                    width: 40,
                                                    height: 38,
                                                    borderRadius: 1.2,
                                                    bgcolor: isValidHexColor(data.color_hex) ? data.color_hex : '#7c3aed',
                                                    border: '2px solid',
                                                    borderColor: 'divider',
                                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                    overflow: 'hidden',
                                                    transition: 'transform 0.15s ease',
                                                    '&:hover': {
                                                        transform: 'scale(1.06)',
                                                        boxShadow: '0 3px 8px rgba(0,0,0,0.18)',
                                                    },
                                                }}
                                            >
                                                <input
                                                    type="color"
                                                    value={isValidHexColor(data.color_hex) ? data.color_hex : '#7c3aed'}
                                                    onChange={(e) => setData('color_hex', e.target.value)}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '-50%',
                                                        left: '-50%',
                                                        width: '200%',
                                                        height: '200%',
                                                        opacity: 0,
                                                        cursor: 'pointer',
                                                    }}
                                                />
                                            </Box>
                                        </Tooltip>
                                        <TextField
                                            size="small"
                                            label="Código Hex"
                                            placeholder="#7c3aed"
                                            value={data.color_hex}
                                            onChange={(e) => setData('color_hex', e.target.value)}
                                            error={!!(clientErrors.color_hex || errors.color_hex)}
                                            helperText={clientErrors.color_hex || errors.color_hex}
                                            fullWidth
                                            slotProps={{
                                                htmlInput: {
                                                    style: {
                                                        fontFamily: 'monospace',
                                                        fontWeight: 700,
                                                        letterSpacing: '0.04em',
                                                    },
                                                },
                                            }}
                                        />
                                    </Box>

                                    <Box
                                        sx={{
                                            p: 0.8,
                                            borderRadius: 1.2,
                                            bgcolor: 'background.paper',
                                            border: '1px dashed',
                                            borderColor: 'divider',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 0.4,
                                            minHeight: 46,
                                            boxSizing: 'border-box',
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontSize: '0.62rem',
                                                color: 'text.secondary',
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.04em',
                                            }}
                                        >
                                            Vista previa
                                        </Typography>
                                        <Chip
                                            label={data.nombre?.trim() || 'Rubro de Ejemplo'}
                                            size="small"
                                            sx={{
                                                bgcolor: `${data.color_hex}18`,
                                                color: data.color_hex,
                                                fontWeight: 800,
                                                fontSize: '0.72rem',
                                                border: `1.5px solid ${data.color_hex}50`,
                                                px: 0.6,
                                                height: 22,
                                                maxWidth: '100%',
                                            }}
                                        />
                                    </Box>
                                </Box>

                                <Box sx={{ mt: 1.2, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.7rem' }}>
                                            Colores recomendados:
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.disabled' }}>
                                            Selección rápida
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                                        {COLOR_PRESETS.map((preset) => {
                                            const isSelected = data.color_hex.toLowerCase() === preset.hex.toLowerCase();
                                            return (
                                                <Tooltip key={preset.hex} title={preset.name} arrow placement="top">
                                                    <Box
                                                        onClick={() => setData('color_hex', preset.hex)}
                                                        sx={{
                                                            width: 24,
                                                            height: 24,
                                                            borderRadius: '50%',
                                                            bgcolor: preset.hex,
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            boxShadow: isSelected
                                                                ? (theme) => `0 0 0 2px ${theme.palette.background.paper}, 0 0 0 3.5px ${preset.hex}`
                                                                : '0 1px 3px rgba(0,0,0,0.15)',
                                                            transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                                                            transition: 'all 0.15s ease',
                                                            '&:hover': {
                                                                transform: 'scale(1.25)',
                                                                boxShadow: (theme) => `0 0 0 2px ${theme.palette.background.paper}, 0 0 0 3px ${preset.hex}`,
                                                            },
                                                        }}
                                                    >
                                                        {isSelected && (
                                                            <CheckIcon
                                                                sx={{
                                                                    color: '#ffffff',
                                                                    fontSize: 14,
                                                                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))',
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                </Tooltip>
                                            );
                                        })}
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Fila 4: Descripción */}
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Descripción o Alcance (Opcional)"
                                placeholder="Describe el perfil, temas o carreras a las que aplica este rubro..."
                                fullWidth
                                multiline
                                rows={2}
                                size="small"
                                value={data.descripcion}
                                onChange={(e) => setData('descripcion', e.target.value)}
                            />
                        </Grid>

                        {/* Fila 5: Estado Activo (Compacto) */}
                        <Grid size={{ xs: 12 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={data.activo}
                                        onChange={(e) => setData('activo', e.target.checked)}
                                        color="primary"
                                        size="small"
                                    />
                                }
                                label={
                                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.84rem' }}>
                                        Rubro Activo y Disponible en el catálogo
                                    </Typography>
                                }
                                sx={{ m: 0 }}
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
