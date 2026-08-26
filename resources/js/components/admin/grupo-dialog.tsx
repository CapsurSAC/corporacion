import { useForm } from '@inertiajs/react';
import BusinessIcon from '@mui/icons-material/Business';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    FormControlLabel,
    Checkbox,
    Button,
    CircularProgress,
    Box,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNotification } from '@/hooks/use-notification';
import { isMinLength } from '@/lib/validation';
import type { Grupo } from '@/types';

interface GrupoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    grupo?: Grupo | null;
    currentTeamSlug: string;
}

export function GrupoDialog({
    open,
    onOpenChange,
    grupo,
    currentTeamSlug,
}: GrupoDialogProps) {
    const isEditing = !!grupo;
    const { notify } = useNotification();
    const [clientErrors, setClientErrors] = useState<{ nombre?: string }>({});

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            nombre: '',
            descripcion: '',
            activo: true,
        });

    useEffect(() => {
        if (grupo) {
            setData({
                nombre: grupo.nombre,
                descripcion: grupo.descripcion || '',
                activo: grupo.activo,
            });
        } else {
            reset();
        }

        setClientErrors({});
        clearErrors();
    }, [grupo, open]);

    const validate = (): boolean => {
        const newErrors: { nombre?: string } = {};

        if (!isMinLength(data.nombre, 3)) {
            newErrors.nombre = 'El nombre del grupo debe tener al menos 3 caracteres.';
            notify.warning('Verifica el nombre del grupo comercial antes de continuar.');
        } else if (data.nombre.trim().length > 255) {
            newErrors.nombre = 'El nombre no puede superar los 255 caracteres.';
        }

        setClientErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        if (isEditing && grupo) {
            put(`/${currentTeamSlug}/admin/grupos/${grupo.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    notify.success(`Grupo "${data.nombre}" actualizado correctamente.`);
                    onOpenChange(false);
                    reset();
                },
                onError: () => {
                    notify.error('Ocurrió un error al actualizar el grupo.');
                },
            });
        } else {
            post(`/${currentTeamSlug}/admin/grupos`, {
                preserveScroll: true,
                onSuccess: () => {
                    notify.success(`Grupo "${data.nombre}" creado exitosamente.`);
                    onOpenChange(false);
                    reset();
                },
                onError: () => {
                    notify.error('Ocurrió un error al registrar el grupo.');
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
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 0.5 }}>
                    <BusinessIcon color="primary" />
                    <span>{isEditing ? 'Editar Grupo Comercial' : 'Nuevo Grupo Comercial'}</span>
                </DialogTitle>
                <DialogContent sx={{ pt: 1 }}>
                    <DialogContentText sx={{ fontSize: '0.875rem', mb: 3 }}>
                        {isEditing
                            ? 'Actualiza los datos del grupo y sus propiedades en el catálogo.'
                            : 'Registra un nuevo grupo comercial para organizar los comercios y marcas.'}
                    </DialogContentText>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField
                            label="Nombre del Grupo *"
                            value={data.nombre}
                            onChange={(e) => {
                                setData('nombre', e.target.value);
                                if (clientErrors.nombre) {
                                    setClientErrors((prev) => ({ ...prev, nombre: undefined }));
                                }
                            }}
                            placeholder="Ej. ESCIFOR, MULTIMARCA, GLOBALEX..."
                            error={!!(clientErrors.nombre || errors.nombre)}
                            helperText={clientErrors.nombre || errors.nombre || 'Mínimo 3 caracteres requeridos'}
                            fullWidth
                            autoFocus
                            required
                            size="small"
                        />

                        <TextField
                            label="Descripción"
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            placeholder="Describe el enfoque o rubro de este grupo..."
                            error={!!errors.descripcion}
                            helperText={errors.descripcion}
                            fullWidth
                            multiline
                            rows={3}
                            size="small"
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={data.activo}
                                    onChange={(e) => setData('activo', e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Grupo activo y visible en el catálogo"
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
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
                        {isEditing ? 'Guardar Cambios' : 'Crear Grupo'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
