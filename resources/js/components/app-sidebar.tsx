import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Building2,
    CheckCircle2,
    HardDrive,
    Image,
    LayoutGrid,
    Store,
    Tags,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const dashboardUrl = '/dashboard';

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboardUrl,
            icon: LayoutGrid,
        },
        {
            title: 'Comercios',
            href: '/admin/comercios',
            icon: Store,
        },
        {
            title: 'Grupos Comerciales',
            href: '/admin/grupos',
            icon: Building2,
        },
        {
            title: 'Rubros',
            href: '/admin/rubros',
            icon: Tags,
        },
        {
            title: 'Estados',
            href: '/admin/estados',
            icon: CheckCircle2,
        },
        {
            title: 'Drive Capacitaciones',
            href: '/admin/drive-capacitaciones',
            icon: HardDrive,
        },
        {
            title: 'Logos',
            href: '/admin/logos',
            icon: Image,
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Portal Capsur',
            href: '/',
            icon: Building2,
        },
        {
            title: 'Soporte Institucional',
            href: '#',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
