import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

/**
 * Convierte un enlace de foto compartida de Google Drive a una URL directa de imagen
 * para que pueda ser renderizada directamente en etiquetas <img> del navegador.
 */
export function getDriveDirectImageUrl(url: string | null | undefined): string {
    if (!url) return '';
    const trimmed = url.trim();

    // Pattern 1: https://drive.google.com/file/d/FILE_ID/...
    const matchFile = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (matchFile && matchFile[1]) {
        return `https://lh3.googleusercontent.com/d/${matchFile[1]}`;
    }

    // Pattern 2: id=FILE_ID (open?id=..., uc?id=..., etc.)
    const matchId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (matchId && matchId[1]) {
        return `https://lh3.googleusercontent.com/d/${matchId[1]}`;
    }

    return trimmed;
}

/**
 * Determina si una URL es de Google Drive
 */
export function isGoogleDriveUrl(url: string | null | undefined): boolean {
    if (!url) return false;
    return url.includes('drive.google.com') || url.includes('docs.google.com') || url.includes('googleusercontent.com');
}

