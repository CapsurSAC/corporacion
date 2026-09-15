import { Avatar, Box, Typography } from '@mui/material';
import type { Comercio } from '@/types';

interface ComercioBadgeProps {
    comercio?: Partial<Comercio> | null;
    size?: number;
    showName?: boolean;
}

export function ComercioBadge({ comercio, size = 22, showName = false }: ComercioBadgeProps) {
    if (!comercio) return null;

    const logoSrc = comercio.logo_modo_claro || comercio.logo_modo_oscuro || undefined;
    const siglaText = (comercio.sigla || comercio.codigo || comercio.nombre?.substring(0, 3) || '').toUpperCase();
    const color = comercio.color_hex || '#0284c7';

    const iconElement = logoSrc ? (
        <Avatar
            src={logoSrc}
            alt={comercio.nombre || 'Logo'}
            variant="rounded"
            sx={{
                width: size,
                height: size,
                bgcolor: '#ffffff',
                border: '1px solid',
                borderColor: 'divider',
                p: '2px',
                flexShrink: 0,
                boxSizing: 'border-box',
                '& img': {
                    objectFit: 'contain',
                    width: '100%',
                    height: '100%',
                },
            }}
        >
            <Typography
                component="span"
                sx={{
                    fontSize: `${Math.max(8, Math.round(size * 0.38))}px`,
                    fontWeight: 800,
                    color,
                    lineHeight: 1,
                }}
            >
                {siglaText.substring(0, 3)}
            </Typography>
        </Avatar>
    ) : (
        <Box
            sx={{
                minWidth: size,
                height: size,
                px: 0.6,
                borderRadius: '4px',
                bgcolor: `${color}15`,
                color,
                border: '1px solid',
                borderColor: `${color}40`,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: `${Math.max(9, Math.round(size * 0.42))}px`,
                fontWeight: 800,
                letterSpacing: '0.02em',
                lineHeight: 1,
                boxSizing: 'border-box',
                flexShrink: 0,
            }}
        >
            {siglaText}
        </Box>
    );

    if (!showName) {
        return iconElement;
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {iconElement}
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {comercio.nombre}
            </Typography>
        </Box>
    );
}

export function ComercioAllBadge({ size = 22, label = 'ALL' }: { size?: number; label?: string }) {
    return (
        <Box
            sx={{
                minWidth: size,
                height: size,
                px: 0.6,
                borderRadius: '4px',
                bgcolor: 'action.hover',
                color: 'text.secondary',
                border: '1px solid',
                borderColor: 'divider',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: `${Math.max(8, Math.round(size * 0.38))}px`,
                fontWeight: 800,
                letterSpacing: '0.02em',
                lineHeight: 1,
                boxSizing: 'border-box',
                flexShrink: 0,
            }}
        >
            {label}
        </Box>
    );
}
