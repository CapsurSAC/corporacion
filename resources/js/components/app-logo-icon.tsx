import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export default function AppLogoIcon({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('flex items-center justify-center', className)} {...props}>
            <img
                src="/images/logo-light.png"
                alt="Grupo Capsur"
                className="h-8 w-auto object-contain dark:hidden"
            />
            <img
                src="/images/logo-dark.png"
                alt="Grupo Capsur"
                className="hidden h-8 w-auto object-contain dark:block"
            />
        </div>
    );
}
