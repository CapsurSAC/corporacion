import { useForm } from '@inertiajs/react';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PaletteIcon from '@mui/icons-material/Palette';
import {
    Box,
    Button,
    Checkbox,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNotification } from '@/hooks/use-notification';
import { isMinLength, isValidHexColor } from '@/lib/validation';
import type { Estado } from '@/types';

const COLOR_PRESETS = [
    { name: 'Naranja (No actualizado / Pendiente)', hex: '#d97706' },
    { name: 'Azul (Vendido / Cerrado)', hex: '#2563eb' },
    { name: 'Verde (Nuevo / Lanzamiento)', hex: '#16a34a' },
    { name: 'Púrpura (Especial / Premium)', hex: '#7c3aed' },
    { name: 'Rojo (Urgente / Concluido)', hex: '#dc2626' },
    { name: 'Cian (En Progreso)', hex: '#0891b2' },
    { name: 'Gris (Borrador / Archivo)', hex: '#64748b' },
    { name: 'Esmeralda (Vigente)', hex: '#059669' },
];

interface EstadoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    estado?: Estado | null;
}

export function EstadoDialog({
    open,
    onOpenChange,
    estado,
}: EstadoDialogProps) {
    const { notify } = useNotification();
    const isEditing = Boolean(estado);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            nombre: '',
            color_hex: '#16a34a',
            descripcion: '',
            activo: true,
            orden: 0,
        });

    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (estado) {
            setData({
                nombre: estado.nombre || '',
                color_hex: estado.color_hex || '#16a34a',
                descripcion: estado.descripcion || '',
                activo: estado.activo ?? true,
                orden: estado.orden ?? 0,
            });
        } else {
            reset();
        }
        setClientErrors({});
        clearErrors();
    }, [estado, open]);

    const handleNombreChange = (val: string) => {
        setData('nombre', val);
        if (clientErrors.nombre) {
            setClientErrors((prev) => ({ ...prev, nombre: undefined as any }));
        }
    };

    const validate = (): boolean => {
        const errs: Record<string, string> = {};

        if (!isMinLength(data.nombre.trim(), 2)) {
            errs.nombre = 'El nombre del estado debe tener al menos 2 caracteres.';
        }
        if (!isValidHexColor(data.color_hex)) {
            errs.color_hex = 'Debe ser un color hexadecimal válido (ej: #16a34a).';
        }

        setClientErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        if (isEditing && estado) {
            put(`/admin/estados/${estado.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                },
                onError: () => {
                    notify.error('Por favor corrige los errores en el formulario.');
                },
            });
        } else {
            post(`/admin/estados`, {
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
                        <CheckCircleIcon fontSize="small" />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {isEditing ? 'Editar Estado' : 'Nuevo Estado'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {isEditing
                                ? 'Modifica los atributos del estado seleccionado'
                                : 'Define un nuevo estado para los programas y cursos'}
                        </Typography>
                    </Box>
                </DialogTitle>

                <DialogContent dividers sx={{ pt: 2.5 }}>
                    <Grid container spacing={2.5}>
                        {/* Nombre */}
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Nombre del Estado"
                                placeholder="Ej: Nuevo, En revisión, Vendido, No actualizado"
                                value={data.nombre}
                                onChange={(e) => handleNombreChange(e.target.value)}
                                fullWidth
                                required
                                error={Boolean(errors.nombre || clientErrors.nombre)}
                                helperText={errors.nombre || clientErrors.nombre}
                                disabled={processing}
                            />
                        </Grid>

                        {/* Selector de Color y Previsualización */}
                        <Grid size={{ xs: 12 }}>
                            <Box
                                sx={{
                                    p: 2.2,
                                    borderRadius: 2,
                                    bgcolor: (theme) =>
                                        theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'grey.50',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                {/* Encabezado de la sección */}
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PaletteIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.88rem' }}>
                                            Color del Estado
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                                        Identificador visual en catálogo y tablas
                                    </Typography>
                                </Box>

                                {/* Distribución simétrica: Selector / Código Hex a la izquierda y Vista Previa a la derecha */}
                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: { xs: '1fr', sm: '1.2fr 0.8fr' },
                                        gap: 2,
                                        alignItems: 'center',
                                    }}
                                >
                                    {/* Columna Izquierda: Botón Picker y TextField Hex */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Tooltip title="Haz clic para abrir el selector de color" arrow placement="top">
                                            <Box
                                                component="label"
                                                sx={{
                                                    position: 'relative',
                                                    width: 44,
                                                    height: 40,
                                                    borderRadius: 1.5,
                                                    bgcolor: isValidHexColor(data.color_hex) ? data.color_hex : '#16a34a',
                                                    border: '2px solid',
                                                    borderColor: 'divider',
                                                    boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                    overflow: 'hidden',
                                                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                                    '&:hover': {
                                                        transform: 'scale(1.06)',
                                                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                                                    },
                                                }}
                                            >
                                                <input
                                                    type="color"
                                                    value={isValidHexColor(data.color_hex) ? data.color_hex : '#16a34a'}
                                                    onChange={(e) => setData('color_hex', e.target.value)}
                                                    disabled={processing}
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
                                            placeholder="#16a34a"
                                            value={data.color_hex}
                                            onChange={(e) => setData('color_hex', e.target.value)}
                                            error={Boolean(errors.color_hex || clientErrors.color_hex)}
                                            helperText={errors.color_hex || clientErrors.color_hex}
                                            disabled={processing}
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

                                    {/* Columna Derecha: Tarjeta de Vista Previa */}
                                    <Box
                                        sx={{
                                            p: 1.2,
                                            borderRadius: 1.5,
                                            bgcolor: 'background.paper',
                                            border: '1px dashed',
                                            borderColor: 'divider',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 0.6,
                                            minHeight: 56,
                                            boxSizing: 'border-box',
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontSize: '0.66rem',
                                                color: 'text.secondary',
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                            }}
                                        >
                                            Vista previa de etiqueta
                                        </Typography>
                                        <Chip
                                            label={data.nombre?.trim() || 'Estado de Ejemplo'}
                                            size="small"
                                            sx={{
                                                bgcolor: `${data.color_hex}18`,
                                                color: data.color_hex,
                                                fontWeight: 800,
                                                fontSize: '0.74rem',
                                                border: `1.5px solid ${data.color_hex}50`,
                                                px: 0.8,
                                                height: 24,
                                                maxWidth: '100%',
                                            }}
                                        />
                                    </Box>
                                </Box>

                                {/* Paleta rápida de colores sugeridos */}
                                <Box sx={{ mt: 2, pt: 1.8, borderTop: '1px solid', borderColor: 'divider' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.2 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.74rem' }}>
                                            Colores recomendados:
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontSize: '0.68rem', color: 'text.disabled' }}>
                                            Selección rápida
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2 }}>
                                        {COLOR_PRESETS.map((p) => {
                                            const isSelected = data.color_hex.toLowerCase() === p.hex.toLowerCase();
                                            return (
                                                <Tooltip key={p.hex} title={p.name} arrow placement="top">
                                                    <Box
                                                        onClick={() => !processing && setData('color_hex', p.hex)}
                                                        sx={{
                                                            width: 28,
                                                            height: 28,
                                                            borderRadius: '50%',
                                                            bgcolor: p.hex,
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            boxShadow: isSelected
                                                                ? (theme) => `0 0 0 2px ${theme.palette.background.paper}, 0 0 0 4px ${p.hex}`
                                                                : '0 1px 3px rgba(0,0,0,0.18)',
                                                            transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                                                            transition: 'all 0.15s ease',
                                                            '&:hover': {
                                                                transform: 'scale(1.25)',
                                                                boxShadow: (theme) => `0 0 0 2px ${theme.palette.background.paper}, 0 0 0 3.5px ${p.hex}`,
                                                            },
                                                        }}
                                                    >
                                                        {isSelected && (
                                                            <CheckIcon
                                                                sx={{
                                                                    color: '#ffffff',
                                                                    fontSize: 16,
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

                        {/* Descripción */}
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Descripción (Opcional)"
                                placeholder="Describe el propósito o significado de este estado..."
                                value={data.descripcion}
                                onChange={(e) => setData('descripcion', e.target.value)}
                                fullWidth
                                multiline
                                rows={2}
                                error={Boolean(errors.descripcion)}
                                helperText={errors.descripcion}
                                disabled={processing}
                            />
                        </Grid>

                        {/* Orden */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Orden de visualización"
                                type="number"
                                value={data.orden}
                                onChange={(e) => setData('orden', parseInt(e.target.value, 10) || 0)}
                                fullWidth
                                slotProps={{ htmlInput: { min: 0 } }}
                                error={Boolean(errors.orden)}
                                helperText={errors.orden || 'Orden numérico en listas'}
                                disabled={processing}
                            />
                        </Grid>

                        {/* Activo Switch */}
                        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', alignItems: 'center' }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={data.activo}
                                        onChange={(e) => setData('activo', e.target.checked)}
                                        color="primary"
                                        disabled={processing}
                                    />
                                }
                                label={
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            Estado Activo
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Habilita este estado para ser seleccionado
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
                        startIcon={processing ? <CircularProgress size={18} color="inherit" /> : null}
                    >
                        {isEditing ? 'Guardar Cambios' : 'Crear Estado'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
