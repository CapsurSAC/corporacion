import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { actionRowSx, bodyTextSx, SheetAction } from '@/components/catalog/catalog-sheet-ui';

interface InstitutionalContentProps {
    content: string;
    linkLabel: string;
    actions?: ReactNode;
    color?: string | null;
    variant?: 'primary' | 'secondary' | 'outline';
}

export default function InstitutionalContent({
    content,
    linkLabel,
    actions,
    color,
    variant = 'primary',
}: InstitutionalContentProps) {
    const parts = content.split(/(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+)/gi);
    const links = parts.filter((part) => /^(https?:\/\/|www\.)/i.test(part));
    const text = parts.filter((part) => !/^(https?:\/\/|www\.)/i.test(part)).map((part) => part.trim()).filter(Boolean).join('\n');

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, minWidth: 0 }}>
            {text && <Typography sx={bodyTextSx}>{text}</Typography>}
            {(links.length > 0 || actions) && (
                <Box sx={actionRowSx}>
                    {links.map((href, index) => (
                        <SheetAction key={`${href}-${index}`} href={href} color={color} variant={variant}>
                            {linkLabel}{links.length > 1 ? ` (${index + 1})` : ''}
                        </SheetAction>
                    ))}
                    {actions}
                </Box>
            )}
        </Box>
    );
}
