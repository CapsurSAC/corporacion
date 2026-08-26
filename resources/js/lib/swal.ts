import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2';

/**
 * Detecta si el tema activo actualmente en la aplicación es Modo Oscuro
 */
export const isDarkMode = (): boolean => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
};

/**
 * Modal de Confirmación de Eliminación formal con SweetAlert2
 */
export const confirmDeleteAlert = async ({
    title = '¿Eliminar registro?',
    text = 'Esta acción no se puede deshacer de forma segura. ¿Deseas continuar?',
    confirmButtonText = 'Sí, eliminar',
    cancelButtonText = 'Cancelar',
}: {
    title?: string;
    text?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
} = {}): Promise<boolean> => {
    const isDark = isDarkMode();

    const options: SweetAlertOptions = {
        title,
        text,
        icon: 'warning',
        iconColor: '#dc2626',
        showCancelButton: true,
        focusCancel: true,
        reverseButtons: true,
        confirmButtonText,
        cancelButtonText,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: isDark ? '#475569' : '#94a3b8',
        background: isDark ? '#152844' : '#ffffff',
        color: isDark ? '#f7f7f7' : '#0f172a',
        customClass: {
            popup: 'capsur-swal-popup',
            title: 'capsur-swal-title',
            htmlContainer: 'capsur-swal-content',
            confirmButton: 'capsur-swal-confirm-btn',
            cancelButton: 'capsur-swal-cancel-btn',
        },
    };

    const result = await Swal.fire(options);
    return result.isConfirmed;
};

/**
 * Modal de Confirmación Genérico
 */
export const showConfirmAlert = async ({
    title,
    text,
    icon = 'question',
    confirmButtonText = 'Confirmar',
    cancelButtonText = 'Cancelar',
    confirmButtonColor = '#0c43a3',
}: {
    title: string;
    text?: string;
    icon?: SweetAlertIcon;
    confirmButtonText?: string;
    cancelButtonText?: string;
    confirmButtonColor?: string;
}): Promise<boolean> => {
    const isDark = isDarkMode();

    const options: SweetAlertOptions = {
        title,
        text,
        icon,
        showCancelButton: true,
        focusCancel: true,
        reverseButtons: true,
        confirmButtonText,
        cancelButtonText,
        confirmButtonColor,
        cancelButtonColor: isDark ? '#475569' : '#94a3b8',
        background: isDark ? '#152844' : '#ffffff',
        color: isDark ? '#f7f7f7' : '#0f172a',
        customClass: {
            popup: 'capsur-swal-popup',
            title: 'capsur-swal-title',
            htmlContainer: 'capsur-swal-content',
            confirmButton: 'capsur-swal-confirm-btn',
            cancelButton: 'capsur-swal-cancel-btn',
        },
    };

    const result = await Swal.fire(options);
    return result.isConfirmed;
};

/**
 * Notificación Flotante (Toast) de Éxito
 */
export const showSuccessToast = (title: string, timer: number = 3000) => {
    const isDark = isDarkMode();

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer,
        timerProgressBar: true,
        background: isDark ? '#152844' : '#ffffff',
        color: isDark ? '#f7f7f7' : '#0f172a',
        customClass: {
            popup: 'capsur-swal-popup-toast',
        },
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        },
    });

    Toast.fire({
        icon: 'success',
        iconColor: '#16a34a',
        title,
    });
};

/**
 * Notificación Flotante (Toast) de Error
 */
export const showErrorToast = (title: string, timer: number = 3500) => {
    const isDark = isDarkMode();

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer,
        timerProgressBar: true,
        background: isDark ? '#152844' : '#ffffff',
        color: isDark ? '#f7f7f7' : '#0f172a',
        customClass: {
            popup: 'capsur-swal-popup-toast',
        },
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        },
    });

    Toast.fire({
        icon: 'error',
        iconColor: '#dc2626',
        title,
    });
};

/**
 * Notificación Flotante (Toast) de Advertencia
 */
export const showWarningToast = (title: string, timer: number = 3500) => {
    const isDark = isDarkMode();

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer,
        timerProgressBar: true,
        background: isDark ? '#152844' : '#ffffff',
        color: isDark ? '#f7f7f7' : '#0f172a',
        customClass: {
            popup: 'capsur-swal-popup-toast',
        },
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        },
    });

    Toast.fire({
        icon: 'warning',
        iconColor: '#ca8a04',
        title,
    });
};

/**
 * Notificación Flotante (Toast) de Información
 */
export const showInfoToast = (title: string, timer: number = 3000) => {
    const isDark = isDarkMode();

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer,
        timerProgressBar: true,
        background: isDark ? '#152844' : '#ffffff',
        color: isDark ? '#f7f7f7' : '#0f172a',
        customClass: {
            popup: 'capsur-swal-popup-toast',
        },
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        },
    });

    Toast.fire({
        icon: 'info',
        iconColor: '#0284c7',
        title,
    });
};

/**
 * Alerta Modal de Éxito
 */
export const showSuccessAlert = (title: string, text?: string) => {
    const isDark = isDarkMode();

    const options: SweetAlertOptions = {
        showCancelButton: false,
        title,
        text,
        icon: 'success',
        iconColor: '#16a34a',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#0c43a3',
        background: isDark ? '#152844' : '#ffffff',
        color: isDark ? '#f7f7f7' : '#0f172a',
        customClass: {
            popup: 'capsur-swal-popup',
            title: 'capsur-swal-title',
            htmlContainer: 'capsur-swal-content',
            confirmButton: 'capsur-swal-confirm-btn',
        },
    };

    Swal.fire(options);
};

/**
 * Alerta Modal de Error
 */
export const showErrorAlert = (title: string, text?: string) => {
    const isDark = isDarkMode();

    const options: SweetAlertOptions = {
        showCancelButton: false,
        title,
        text,
        icon: 'error',
        iconColor: '#dc2626',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#0c43a3',
        background: isDark ? '#152844' : '#ffffff',
        color: isDark ? '#f7f7f7' : '#0f172a',
        customClass: {
            popup: 'capsur-swal-popup',
            title: 'capsur-swal-title',
            htmlContainer: 'capsur-swal-content',
            confirmButton: 'capsur-swal-confirm-btn',
        },
    };

    Swal.fire(options);
};

/**
 * Alerta Modal de Información
 */
export const showInfoAlert = (title: string, text?: string) => {
    const isDark = isDarkMode();

    const options: SweetAlertOptions = {
        showCancelButton: false,
        title,
        text,
        icon: 'info',
        iconColor: '#0284c7',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#0c43a3',
        background: isDark ? '#152844' : '#ffffff',
        color: isDark ? '#f7f7f7' : '#0f172a',
        customClass: {
            popup: 'capsur-swal-popup',
            title: 'capsur-swal-title',
            htmlContainer: 'capsur-swal-content',
            confirmButton: 'capsur-swal-confirm-btn',
        },
    };

    Swal.fire(options);
};

export default Swal;
