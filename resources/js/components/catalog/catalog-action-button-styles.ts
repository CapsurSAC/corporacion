import type { SxProps, Theme } from '@mui/material/styles';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';

export function hexToRgba(hex?: string | null, alpha = 1): string {
    if (!hex) return `rgba(220, 38, 38, ${alpha})`;
    const clean = hex.replace('#', '').trim();
    if (clean.length === 3) {
        const r = parseInt(clean[0] + clean[0], 16);
        const g = parseInt(clean[1] + clean[1], 16);
        const b = parseInt(clean[2] + clean[2], 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    if (clean.length === 6) {
        const r = parseInt(clean.substring(0, 2), 16);
        const g = parseInt(clean.substring(2, 4), 16);
        const b = parseInt(clean.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return hex;
}

export function catalogActionButtonStyles(
    brandColor?: string | null,
    variant: ButtonVariant = 'primary'
) {
    // If no brand color is passed, fallback to red/crimson or brand default
    const color = brandColor || '#dc2626';

    const baseStyles = {
        borderRadius: '8px',
        textTransform: 'none',
        fontWeight: 700,
        fontSize: '0.8rem',
        lineHeight: 1.45,
        minHeight: 34,
        px: 1.6,
        py: 0.65,
        letterSpacing: '0.01em',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '& .MuiButton-startIcon, & .MuiButton-endIcon': {
            '& > *:first-of-type': { fontSize: 16 },
        },
    };

    if (variant === 'secondary') {
        return {
            ...baseStyles,
            bgcolor: hexToRgba(color, 0.08),
            color: color,
            border: `1px solid ${hexToRgba(color, 0.28)}`,
            boxShadow: 'none',
            'html.dark &': {
                bgcolor: `${hexToRgba(color, 0.18)} !important`,
                color: '#fca5a5 !important',
                borderColor: `${hexToRgba(color, 0.45)} !important`,
            },
            '&:hover': {
                bgcolor: hexToRgba(color, 0.16),
                borderColor: hexToRgba(color, 0.45),
                color: color,
                transform: 'translateY(-1px)',
                boxShadow: `0 4px 12px ${hexToRgba(color, 0.15)}`,
                'html.dark &': {
                    bgcolor: `${hexToRgba(color, 0.28)} !important`,
                },
            },
            '&:active': {
                transform: 'translateY(0)',
            },
        } satisfies SxProps<Theme>;
    }

    if (variant === 'outline') {
        return {
            ...baseStyles,
            bgcolor: 'transparent',
            color: color,
            border: `1px solid ${hexToRgba(color, 0.35)}`,
            boxShadow: 'none',
            '&:hover': {
                bgcolor: hexToRgba(color, 0.08),
                borderColor: color,
                color: color,
                transform: 'translateY(-1px)',
            },
            '&:active': {
                transform: 'translateY(0)',
            },
        } satisfies SxProps<Theme>;
    }

    // Default: 'primary' with brandColor
    return {
        ...baseStyles,
        bgcolor: color,
        color: '#ffffff',
        border: '1px solid transparent',
        boxShadow: `0 2px 8px ${hexToRgba(color, 0.28)}`,
        '&:hover': {
            bgcolor: color,
            filter: 'brightness(0.92)',
            color: '#ffffff',
            transform: 'translateY(-1px)',
            boxShadow: `0 4px 14px ${hexToRgba(color, 0.38)}`,
        },
        '&:active': {
            transform: 'translateY(0)',
        },
        '&:focus-visible': {
            outline: `2px solid ${color}`,
            outlineOffset: 2,
        },
    } satisfies SxProps<Theme>;
}
