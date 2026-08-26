import { router } from '@inertiajs/react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { NotificationContainer } from '@/components/ui/notification';
import type {
    NotificationContextType,
    NotificationItem,
    NotificationOptions,
    NotificationStatus,
} from '@/types/notification';

const NotificationContext = createContext<NotificationContextType | null>(null);

let idCounter = 0;
const generateId = (): string => {
    idCounter += 1;
    return `notif_${Date.now()}_${idCounter}`;
};

// Mapa para deduplicación de notificaciones duplicadas en un intervalo corto
const recentNotifications = new Map<string, number>();

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);

    const dismiss = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const clear = useCallback(() => {
        setNotifications([]);
    }, []);

    const notifyBase = useCallback(
        (message: string, options?: NotificationOptions): string => {
            const trimmedMessage = message.trim();
            if (!trimmedMessage) return '';

            const status = options?.status || 'info';
            const dedupeKey = `${status}_${trimmedMessage}`;
            const now = Date.now();
            const lastTime = recentNotifications.get(dedupeKey);

            // Si es idéntica en menos de 2 segundos, ignorar el duplicado
            if (lastTime && now - lastTime < 2000) {
                return '';
            }
            recentNotifications.set(dedupeKey, now);

            // Limpieza periódica de claves antiguas
            if (recentNotifications.size > 25) {
                for (const [k, time] of recentNotifications.entries()) {
                    if (now - time > 6000) {
                        recentNotifications.delete(k);
                    }
                }
            }

            const id = generateId();
            const newItem: NotificationItem = {
                id,
                message: trimmedMessage,
                title: options?.title,
                status,
                duration: options?.duration !== undefined ? options.duration : 4000,
                createdAt: now,
                action: options?.action,
            };

            setNotifications((prev) => [newItem, ...prev.slice(0, 4)]); // Máximo 5 notificaciones simultáneas
            return id;
        },
        []
    );

    const notify = useMemo(() => {
        const fn = (message: string, options?: NotificationOptions) => notifyBase(message, options);

        fn.success = (
            message: string,
            titleOrDuration?: string | number,
            duration?: number
        ): string => {
            const title = typeof titleOrDuration === 'string' ? titleOrDuration : undefined;
            const dur = typeof titleOrDuration === 'number' ? titleOrDuration : duration;
            return notifyBase(message, { status: 'success', title, duration: dur });
        };

        fn.error = (
            message: string,
            titleOrDuration?: string | number,
            duration?: number
        ): string => {
            const title = typeof titleOrDuration === 'string' ? titleOrDuration : undefined;
            const dur = typeof titleOrDuration === 'number' ? titleOrDuration : duration;
            return notifyBase(message, { status: 'error', title, duration: dur ?? 5000 });
        };

        fn.warning = (
            message: string,
            titleOrDuration?: string | number,
            duration?: number
        ): string => {
            const title = typeof titleOrDuration === 'string' ? titleOrDuration : undefined;
            const dur = typeof titleOrDuration === 'number' ? titleOrDuration : duration;
            return notifyBase(message, { status: 'warning', title, duration: dur });
        };

        fn.info = (
            message: string,
            titleOrDuration?: string | number,
            duration?: number
        ): string => {
            const title = typeof titleOrDuration === 'string' ? titleOrDuration : undefined;
            const dur = typeof titleOrDuration === 'number' ? titleOrDuration : duration;
            return notifyBase(message, { status: 'info', title, duration: dur });
        };

        fn.dismiss = dismiss;
        fn.clear = clear;

        return fn;
    }, [notifyBase, dismiss, clear]);

    // Procesar flashes de sesión de Inertia / Laravel
    const handleFlash = useCallback(
        (flashObj: Record<string, unknown> | undefined) => {
            if (!flashObj) return;

            if (flashObj.toast && typeof flashObj.toast === 'object') {
                const t = flashObj.toast as { message?: string; type?: NotificationStatus; title?: string };
                if (t.message) {
                    notifyBase(t.message, {
                        status: t.type || 'success',
                        title: t.title,
                    });
                }
            } else if (typeof flashObj.toast === 'string') {
                notifyBase(flashObj.toast, { status: 'success' });
            }

            if (flashObj.success && typeof flashObj.success === 'string') {
                notifyBase(flashObj.success, { status: 'success' });
            }

            if (flashObj.error && typeof flashObj.error === 'string') {
                notifyBase(flashObj.error, { status: 'error', duration: 5000 });
            }

            if (flashObj.warning && typeof flashObj.warning === 'string') {
                notifyBase(flashObj.warning, { status: 'warning' });
            }

            if (flashObj.info && typeof flashObj.info === 'string') {
                notifyBase(flashObj.info, { status: 'info' });
            }
        },
        [notifyBase]
    );

    // Escuchar navegación y respuestas globales de Inertia
    useEffect(() => {
        const unregister = router.on('navigate', (event) => {
            const pageProps = event.detail.page.props as { flash?: Record<string, unknown> };
            handleFlash(pageProps?.flash);
        });

        return () => {
            unregister();
        };
    }, [handleFlash]);

    return (
        <NotificationContext.Provider value={{ notifications, notify }}>
            {children}
            <NotificationContainer notifications={notifications} onDismiss={dismiss} />
        </NotificationContext.Provider>
    );
}

/**
 * Hook para disparar y gestionar notificaciones en la esquina superior derecha
 */
export function useNotification(): NotificationContextType {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification debe ser utilizado dentro de un NotificationProvider');
    }
    return context;
}
