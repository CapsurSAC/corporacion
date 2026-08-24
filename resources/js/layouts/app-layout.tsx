import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';
import React from 'react';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    let activeBreadcrumbs = breadcrumbs;

    if ((!activeBreadcrumbs || activeBreadcrumbs.length === 0) && React.isValidElement(children)) {
        const childType = children.type as {
            layout?: ((props: any) => { breadcrumbs?: BreadcrumbItem[] }) | { breadcrumbs?: BreadcrumbItem[] };
        };
        const childProps = children.props as any;

        if (childType?.layout) {
            const layoutConfig =
                typeof childType.layout === 'function'
                    ? childType.layout(childProps)
                    : childType.layout;

            if (layoutConfig && 'breadcrumbs' in layoutConfig && Array.isArray(layoutConfig.breadcrumbs)) {
                activeBreadcrumbs = layoutConfig.breadcrumbs;
            }
        }
    }

    return (
        <AppLayoutTemplate breadcrumbs={activeBreadcrumbs}>
            {children}
        </AppLayoutTemplate>
    );
}
