import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export default function AppLogo({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('flex items-center', className)} {...props}>
            {/* Logo oficial para Modo Claro */}
            <img
                src="/images/logo-light.png"
                alt="Grupo Capsur"
                className="h-8 w-auto max-w-[165px] object-contain dark:hidden"
            />
            {/* Logo oficial para Modo Oscuro */}
            <img
                src="/images/logo-dark.png"
                alt="Grupo Capsur"
                className="hidden h-8 w-auto max-w-[165px] object-contain dark:block"
            />
        </div>
    );
}
