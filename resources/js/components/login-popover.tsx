import { Link, useForm } from '@inertiajs/react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoginIcon from '@mui/icons-material/Login';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Popover,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

interface LoginPopoverProps {
    open: boolean;
    anchorEl: HTMLElement | null;
    onClose: () => void;
}

export default function LoginPopover({ open, anchorEl, onClose }: LoginPopoverProps) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        if (!open) {
            clearErrors();
            setShowPassword(false);
        }
    }, [open, clearErrors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
            onSuccess: () => {
                onClose();
            },
        });
    };

    // Determina la alineación horizontal óptima según la posición del botón activador
    const isNearRightEdge = anchorEl
        ? anchorEl.getBoundingClientRect().right > window.innerWidth - 220
        : false;

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: isNearRightEdge ? 'right' : 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: isNearRightEdge ? 'right' : 'center',
            }}
            slotProps={{
                paper: {
                    elevation: 12,
                    sx: {
                        mt: 1.5,
                        p: 3,
                        width: 360,
                        maxWidth: 'calc(100vw - 32px)',
                        borderRadius: 2.5,
                        bgcolor: 'background.paper',
                        boxShadow: (theme) =>
                            theme.palette.mode === 'dark'
                                ? '0 20px 45px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                                : '0 20px 45px -10px rgba(12, 67, 163, 0.22), 0 4px 16px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(226, 232, 240, 0.9)',
                        overflow: 'hidden',
                    },
                },
            }}
        >
            {/* Cabecera del Popover */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 2,
                            bgcolor: (theme) =>
                                theme.palette.mode === 'dark'
                                    ? 'rgba(56, 189, 248, 0.15)'
                                    : 'rgba(12, 67, 163, 0.1)',
                            color: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <LoginIcon fontSize="small" />
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                            Acceder al Sistema
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Catálogo Corporativo Capsur
                        </Typography>
                    </Box>
                </Box>
                <IconButton
                    size="small"
                    onClick={onClose}
                    sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
                    aria-label="Cerrar"
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* Mensaje de error general si las credenciales fallan */}
            {(errors.email || errors.password) && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 2,
                        py: 0.5,
                        px: 1.5,
                        fontSize: '0.8rem',
                        borderRadius: 1.5,
                        alignItems: 'center',
                    }}
                >
                    {errors.email || errors.password}
                </Alert>
            )}

            {/* Formulario de Inicio de Sesión */}
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    id="popover-login-email"
                    label="Correo Electrónico"
                    type="email"
                    size="small"
                    fullWidth
                    required
                    autoFocus
                    autoComplete="email"
                    placeholder="admin@correo.com"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={Boolean(errors.email)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                <TextField
                    id="popover-login-password"
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    size="small"
                    fullWidth
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={Boolean(errors.password)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        edge="end"
                                        tabIndex={-1}
                                        aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                                    >
                                        {showPassword ? (
                                            <VisibilityOffIcon fontSize="small" />
                                        ) : (
                                            <VisibilityIcon fontSize="small" />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: -0.5 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                size="small"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                sx={{ p: 0.5 }}
                            />
                        }
                        label={
                            <Typography variant="caption" sx={{ userSelect: 'none', color: 'text.secondary' }}>
                                Recordar mi sesión
                            </Typography>
                        }
                    />
                    <Link href="/forgot-password" style={{ textDecoration: 'none' }}>
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'primary.main',
                                fontWeight: 600,
                                cursor: 'pointer',
                                '&:hover': { textDecoration: 'underline' },
                            }}
                        >
                            ¿Olvidaste tu contraseña?
                        </Typography>
                    </Link>
                </Box>

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={processing}
                    endIcon={!processing && <ArrowForwardIcon fontSize="small" />}
                    sx={{
                        py: 1.2,
                        mt: 0.5,
                        fontWeight: 'bold',
                        borderRadius: 1.5,
                        bgcolor: '#2563eb',
                        '&:hover': { bgcolor: '#1d4ed8' },
                    }}
                >
                    {processing ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={18} color="inherit" />
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Iniciando sesión...
                            </Typography>
                        </Box>
                    ) : (
                        'Iniciar Sesión'
                    )}
                </Button>
            </Box>
        </Popover>
    );
}
