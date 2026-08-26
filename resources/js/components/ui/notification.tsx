import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, Button, IconButton, Typography, keyframes } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import type { NotificationItem, NotificationStatus } from '@/types/notification';

const slideIn = keyframes`
    from {
        opacity: 0;
        transform: translateX(120%) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateX(0) scale(1);
    }
`;

const getStatusConfig = (status: NotificationStatus) => {
    switch (status) {
        case 'success':
            return {
                icon: <CheckCircleIcon sx={{ fontSize: 22, color: '#16a34a' }} />,
                defaultTitle: 'Operación Exitosa',
                color: '#16a34a',
                bgDark: 'rgba(22, 163, 74, 0.12)',
                bgLight: 'rgba(22, 163, 74, 0.08)',
                borderColor: 'rgba(22, 163, 74, 0.3)',
            };
        case 'error':
            return {
                icon: <ErrorIcon sx={{ fontSize: 22, color: '#dc2626' }} />,
                defaultTitle: 'Error en la Operación',
                color: '#dc2626',
                bgDark: 'rgba(220, 38, 38, 0.12)',
                bgLight: 'rgba(220, 38, 38, 0.08)',
                borderColor: 'rgba(220, 38, 38, 0.3)',
            };
        case 'warning':
            return {
                icon: <WarningAmberIcon sx={{ fontSize: 22, color: '#d97706' }} />,
                defaultTitle: 'Advertencia',
                color: '#d97706',
                bgDark: 'rgba(217, 119, 6, 0.12)',
                bgLight: 'rgba(217, 119, 6, 0.08)',
                borderColor: 'rgba(217, 119, 6, 0.3)',
            };
        case 'info':
        default:
            return {
                icon: <InfoOutlinedIcon sx={{ fontSize: 22, color: '#0284c7' }} />,
                defaultTitle: 'Información del Sistema',
                color: '#0284c7',
                bgDark: 'rgba(2, 132, 199, 0.12)',
                bgLight: 'rgba(2, 132, 199, 0.08)',
                borderColor: 'rgba(2, 132, 199, 0.3)',
            };
    }
};

interface NotificationCardProps {
    notification: NotificationItem;
    onDismiss: (id: string) => void;
}

export function NotificationCard({ notification, onDismiss }: NotificationCardProps) {
    const { id, message, title, status, duration, action } = notification;
    const config = getStatusConfig(status);

    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(100);
    const startTimeRef = useRef<number>(Date.now());
    const remainingTimeRef = useRef<number>(duration);

    useEffect(() => {
        if (duration <= 0) return;

        const interval = 30; // ms
        const timer = setInterval(() => {
            if (!isPaused) {
                const elapsed = Date.now() - startTimeRef.current;
                const newRemaining = Math.max(0, duration - elapsed);
                remainingTimeRef.current = newRemaining;
                const pct = (newRemaining / duration) * 100;
                setProgress(pct);

                if (newRemaining <= 0) {
                    clearInterval(timer);
                    onDismiss(id);
                }
            } else {
                startTimeRef.current = Date.now() - (duration - remainingTimeRef.current);
            }
        }, interval);

        return () => clearInterval(timer);
    }, [id, duration, isPaused, onDismiss]);

    return (
        <Box
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            sx={{
                width: { xs: 'calc(100vw - 32px)', sm: 380 },
                pointerEvents: 'auto',
                animation: `${slideIn} 0.28s cubic-bezier(0.16, 1, 0.3, 1)`,
                position: 'relative',
                borderRadius: 1.5,
                overflow: 'hidden',
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#152844' : '#ffffff'),
                color: (theme) => (theme.palette.mode === 'dark' ? '#f8fafc' : '#0f172a'),
                border: '1px solid',
                borderColor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0',
                boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                        ? '0 8px 30px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4)'
                        : '0 8px 30px rgba(15, 23, 42, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
                p: 2,
                pr: 4.5,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.5,
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                },
            }}
        >
            {/* Ícono de Estado con Halo */}
            <Box
                sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    bgcolor: (theme) =>
                        theme.palette.mode === 'dark' ? config.bgDark : config.bgLight,
                    border: '1px solid',
                    borderColor: config.borderColor,
                }}
            >
                {config.icon}
            </Box>

            {/* Contenido Textual */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                    variant="subtitle2"
                    sx={{
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        lineHeight: 1.25,
                        color: (theme) => (theme.palette.mode === 'dark' ? '#f8fafc' : '#0f172a'),
                        mb: 0.3,
                    }}
                >
                    {title || config.defaultTitle}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        fontSize: '0.81rem',
                        lineHeight: 1.4,
                        color: (theme) => (theme.palette.mode === 'dark' ? '#cbd5e1' : '#475569'),
                        wordBreak: 'break-word',
                    }}
                >
                    {message}
                </Typography>

                {action && (
                    <Button
                        size="small"
                        onClick={action.onClick}
                        sx={{
                            mt: 1,
                            px: 1.2,
                            py: 0.3,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'none',
                            color: config.color,
                            bgcolor: (theme) =>
                                theme.palette.mode === 'dark' ? config.bgDark : config.bgLight,
                            '&:hover': {
                                bgcolor: (theme) =>
                                    theme.palette.mode === 'dark'
                                        ? 'rgba(255, 255, 255, 0.1)'
                                        : 'rgba(0, 0, 0, 0.05)',
                            },
                        }}
                    >
                        {action.label}
                    </Button>
                )}
            </Box>

            {/* Botón de Cerrar */}
            <IconButton
                size="small"
                onClick={() => onDismiss(id)}
                sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: 'text.secondary',
                    p: 0.5,
                    '&:hover': {
                        bgcolor: 'action.hover',
                        color: 'text.primary',
                    },
                }}
            >
                <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>

            {/* Barra de Progreso Temporizada */}
            {duration > 0 && (
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        height: 3,
                        width: `${progress}%`,
                        bgcolor: config.color,
                        opacity: 0.85,
                        transition: isPaused ? 'none' : 'width 30ms linear',
                    }}
                />
            )}
        </Box>
    );
}

interface NotificationContainerProps {
    notifications: NotificationItem[];
    onDismiss: (id: string) => void;
}

export function NotificationContainer({ notifications, onDismiss }: NotificationContainerProps) {
    if (notifications.length === 0) return null;

    return (
        <Box
            sx={{
                position: 'fixed',
                top: { xs: 12, sm: 20 },
                right: { xs: 12, sm: 20 },
                zIndex: 99999,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                pointerEvents: 'none',
                alignItems: 'flex-end',
            }}
        >
            {notifications.map((item) => (
                <NotificationCard key={item.id} notification={item} onDismiss={onDismiss} />
            ))}
        </Box>
    );
}
