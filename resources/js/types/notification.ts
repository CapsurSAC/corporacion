export type NotificationStatus = 'success' | 'error' | 'info' | 'warning';

export interface NotificationAction {
    label: string;
    onClick: () => void;
}

export interface NotificationOptions {
    title?: string;
    status?: NotificationStatus;
    duration?: number;
    action?: NotificationAction;
}

export interface NotificationItem {
    id: string;
    message: string;
    title?: string;
    status: NotificationStatus;
    duration: number;
    createdAt: number;
    action?: NotificationAction;
}

export interface NotificationContextType {
    notifications: NotificationItem[];
    notify: {
        (message: string, options?: NotificationOptions): string;
        success: (message: string, titleOrDuration?: string | number, duration?: number) => string;
        error: (message: string, titleOrDuration?: string | number, duration?: number) => string;
        warning: (message: string, titleOrDuration?: string | number, duration?: number) => string;
        info: (message: string, titleOrDuration?: string | number, duration?: number) => string;
        dismiss: (id: string) => void;
        clear: () => void;
    };
}
