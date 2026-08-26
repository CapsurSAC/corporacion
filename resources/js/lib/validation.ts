/**
 * Utilidades de Validación Uniforme para Formularios de Grupo Capsur
 */

/**
 * Valida si una cadena tiene formato de URL web válida (http o https)
 */
export const isValidUrl = (url: string): boolean => {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim();
    if (trimmed.length === 0) return false;
    try {
        const parsed = new URL(trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
};

/**
 * Normaliza una URL agregando 'https://' si el usuario la escribió sin protocolo
 */
export const normalizeUrl = (url: string): string => {
    if (!url) return '';
    const trimmed = url.trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
};

/**
 * Valida formato de código de color hexadecimal (#FFF o #FFFFFF)
 */
export const isValidHexColor = (hex: string): boolean => {
    if (!hex) return false;
    return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex.trim());
};

/**
 * Valida si una cadena es una URL de YouTube válida
 */
export const isValidYouTubeUrl = (url: string): boolean => {
    if (!isValidUrl(url)) return false;
    const trimmed = url.trim().toLowerCase();
    return (
        trimmed.includes('youtube.com') ||
        trimmed.includes('youtu.be') ||
        trimmed.includes('youtube-nocookie.com')
    );
};

/**
 * Valida si un número telefónico tiene formato numérico razonable (6 a 15 dígitos)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
    if (!phone) return false;
    const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
    return /^\d{6,15}$/.test(cleaned);
};

/**
 * Valida formato de correo electrónico
 */
export const isValidEmail = (email: string): boolean => {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

/**
 * Valida que un texto tenga una longitud mínima requerida
 */
export const isMinLength = (text: string, min: number): boolean => {
    if (!text || typeof text !== 'string') return false;
    return text.trim().length >= min;
};

/**
 * Valida formato de precio simple (ej. "S/ 350", "350", "Gratis", "$100")
 */
export const isValidPrice = (price: string): boolean => {
    if (!price) return true; // es opcional
    const trimmed = price.trim();
    if (trimmed.length === 0) return true;
    return /^(\$?|S\/?\s*|\€?)?\s*\d+(\.\d{1,2})?\s*([A-Za-z]+)?$/i.test(trimmed) || /^(gratis|libre|beca|sin costo)$/i.test(trimmed);
};
