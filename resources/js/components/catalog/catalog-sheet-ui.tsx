import LaunchIcon from '@mui/icons-material/Launch';
import { Box, Button, IconButton, Paper, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { catalogActionButtonStyles } from '@/components/catalog/catalog-action-button-styles';

export const sheetPaperSx = {
    '--catalog-background': '#f5f7fa',
    '--catalog-surface': '#ffffff',
    '--catalog-text': '#1c2b3e',
    '--catalog-muted': '#647389',
    '--catalog-border': '#dfe5ed',
    '--catalog-subtle': '#edf2f7',
    '--catalog-control': '#29445f',
    '--catalog-control-hover': '#1d344c',
    '--catalog-focus': '#7894af',
    'html.dark &': {
        '--catalog-background': '#101b2b',
        '--catalog-surface': '#172638',
        '--catalog-text': '#e8eef6',
        '--catalog-muted': '#a7b6c9',
        '--catalog-border': '#2d3e52',
        '--catalog-subtle': '#22344a',
        '--catalog-control': '#385672',
        '--catalog-control-hover': '#466785',
        '--catalog-focus': '#93adc6',
    },
    bgcolor: 'var(--catalog-surface) !important',
    color: 'var(--catalog-text) !important',
    border: '1px solid var(--catalog-border) !important',
    backgroundImage: 'none',
    borderRadius: '16px',
    boxShadow: '0 24px 80px rgb(8 20 38 / 24%)',
    overflow: 'hidden',
    width: { xs: 'calc(100% - 24px)', sm: 'calc(100% - 48px)' },
    m: { xs: 1.5, sm: 3 },
    maxHeight: { xs: 'calc(100dvh - 24px)', sm: 'min(900px, calc(100dvh - 48px))' },
    '& .MuiTypography-root': { overflowWrap: 'anywhere' },
} satisfies SxProps<Theme>;

export const actionRowSx = {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 0.75,
} satisfies SxProps<Theme>;

export const bodyTextSx = {
    fontSize: '0.82rem',
    lineHeight: 1.65,
    color: 'var(--catalog-muted)',
    whiteSpace: 'pre-line',
} satisfies SxProps<Theme>;

export const metadataSx = {
    height: 24,
    bgcolor: 'var(--catalog-subtle)',
    color: 'var(--catalog-muted)',
    border: '1px solid var(--catalog-border)',
    borderRadius: '6px',
    fontSize: '0.68rem',
    fontWeight: 600,
    '& .MuiChip-label': { px: 1 },
} satisfies SxProps<Theme>;

export function SheetAction({
    children,
    href,
    onClick,
    icon,
    color,
    variant = 'primary',
}: {
    children: ReactNode;
    href?: string | null;
    onClick?: () => void;
    icon?: ReactNode;
    color?: string | null;
    variant?: 'primary' | 'secondary' | 'outline';
}) {
    return (
        <Button
            component={href ? 'a' : 'button'}
            href={href ? externalUrl(href) : undefined}
            target={href ? '_blank' : undefined}
            rel={href ? 'noopener noreferrer' : undefined}
            onClick={onClick}
            variant="contained"
            size="small"
            disableElevation
            endIcon={icon || (href ? <LaunchIcon sx={{ fontSize: '15px !important' }} /> : undefined)}
            sx={catalogActionButtonStyles(color, variant)}
        >
            {children}
        </Button>
    );
}

export function SheetIconAction({
    label,
    children,
    onClick,
    href,
    color,
    variant = 'primary',
}: {
    label: string;
    children: ReactNode;
    onClick?: () => void;
    href?: string;
    color?: string | null;
    variant?: 'primary' | 'secondary' | 'outline';
}) {
    return (
        <IconButton
            aria-label={label}
            title={label}
            onClick={onClick}
            component={href ? 'a' : 'button'}
            href={href ? externalUrl(href) : undefined}
            target={href ? '_blank' : undefined}
            rel={href ? 'noopener noreferrer' : undefined}
            size="small"
            sx={[catalogActionButtonStyles(color, variant), { width: 34, height: 34, minWidth: 34, p: 0.75 }]}
        >
            {children}
        </IconButton>
    );
}

export function SheetGrid({ children, columns = 2 }: { children: ReactNode; columns?: 2 | 3 }) {
    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))', md: `repeat(${columns}, minmax(0, 1fr))` },
            gap: 2,
            alignItems: 'stretch',
            '& > *': { minWidth: 0 },
        }}>
            {children}
        </Box>
    );
}

export function SheetSection({ title, description, count, children }: {
    title: string;
    description?: string;
    count?: number;
    children: ReactNode;
}) {
    return (
        <Box component="section" aria-label={title} sx={{ display: 'flex', flexDirection: 'column', gap: 1.75, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography component="h3" sx={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--catalog-text)', letterSpacing: '-0.01em' }}>
                        {title}
                    </Typography>
                    {description && <Typography sx={{ ...bodyTextSx, fontSize: '0.76rem', mt: 0.25 }}>{description}</Typography>}
                </Box>
                {count !== undefined && <Typography sx={{ fontSize: '0.72rem', color: 'var(--catalog-muted)', fontVariantNumeric: 'tabular-nums' }}>{count} {count === 1 ? 'registro' : 'registros'}</Typography>}
            </Box>
            {children}
        </Box>
    );
}

export function SheetCard({ title, description, icon, badge, children }: {
    title: string;
    description?: string;
    icon: ReactNode;
    badge?: ReactNode;
    children?: ReactNode;
}) {
    return (
        <Paper component="article" elevation={0} variant="outlined" sx={{
            p: { xs: 2, sm: 2.25 },
            borderRadius: '12px',
            borderColor: 'var(--catalog-border)',
            bgcolor: 'var(--catalog-surface)',
            color: 'var(--catalog-text)',
            backgroundImage: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.75,
            boxShadow: '0 1px 2px rgb(15 30 50 / 3%)',
            minWidth: 0,
        }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, minWidth: 0 }}>
                <Box sx={{ width: 34, height: 34, borderRadius: '9px', bgcolor: 'var(--catalog-subtle)', color: 'var(--catalog-muted)', display: 'grid', placeItems: 'center', flexShrink: 0, '& .MuiSvgIcon-root': { fontSize: 19 } }}>
                    {icon}
                </Box>
                <Box sx={{ minWidth: 0, flex: 1, pt: 0.25 }}>
                    <Typography component="h4" sx={{ fontSize: '0.84rem', fontWeight: 650, lineHeight: 1.45, color: 'var(--catalog-text)' }}>{title}</Typography>
                    {description && <Typography sx={{ ...bodyTextSx, fontSize: '0.74rem', lineHeight: 1.5, mt: 0.35 }}>{description}</Typography>}
                </Box>
                {badge}
            </Box>
            {children && <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, mt: 'auto', minWidth: 0 }}>{children}</Box>}
        </Paper>
    );
}

export function SheetEmpty({ title, description, icon }: { title: string; description: string; icon: ReactNode }) {
    return (
        <Paper variant="outlined" sx={{ textAlign: 'center', p: { xs: 3, sm: 5 }, borderRadius: '12px', bgcolor: 'var(--catalog-surface)', borderColor: 'var(--catalog-border)', backgroundImage: 'none' }}>
            <Box sx={{ color: 'var(--catalog-muted)', mb: 1, '& .MuiSvgIcon-root': { fontSize: 30 } }}>{icon}</Box>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 650, color: 'var(--catalog-text)' }}>{title}</Typography>
            <Typography sx={{ ...bodyTextSx, mt: 0.5 }}>{description}</Typography>
        </Paper>
    );
}

export function externalUrl(value: string): string {
    const url = value.trim();

    return /^(https?:\/\/|\/|#|data:)/i.test(url) ? url : `https://${url}`;
}
