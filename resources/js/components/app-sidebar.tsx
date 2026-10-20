import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Building2,
    CheckCircle2,
    FileText,
    FolderOpen,
    Image,
    LayoutGrid,
    Phone,
    Store,
    Tags,
    Users,
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

interface SharedTrainingArea {
    name: string;
    slug: string;
    color: string;
}

export function AppSidebar() {
    const { auth, trainingAreas = [] } = usePage().props as { auth?: { user?: any }; trainingAreas?: SharedTrainingArea[] };
    const user = auth?.user;
    const esAdmin = Boolean(
        user?.es_admin ||
        user?.rol?.slug === 'admin' ||
        user?.rol?.nombre?.toUpperCase() === 'ADMIN'
    );
    const esCapacitado = Boolean(
        user?.es_capacitado ||
        user?.rol?.slug === 'capacitado' ||
        user?.rol?.nombre?.toUpperCase() === 'CAPACITADO'
    );

    const dashboardUrl = '/dashboard';
    const capacitadoUrl = trainingAreas[0]?.slug
        ? `/capacitado/area/${trainingAreas[0].slug}`
        : '/capacitado';

    const adminNavItems: NavItem[] = [
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
            title: 'Logos',
            href: '/admin/logos',
            icon: Image,
        },
        {
            title: 'Contacto',
            href: '/admin/contacto',
            icon: Phone,
        },
        {
            title: 'Capacitación',
            href: '/admin/capacitacion',
            icon: FileText,
        },
        {
            title: 'Archivos',
            href: '/admin/archivos',
            icon: FolderOpen,
        },
        {
            title: 'Usuarios',
            href: '/admin/usuarios',
            icon: Users,
        },
    ];

    const capacitadoNavItems: NavItem[] = trainingAreas.map((area) => ({
        title: area.name,
        href: `/capacitado/area/${area.slug}`,
        icon: BookOpen,
    }));

    const currentNavItems: NavItem[] = esAdmin
        ? adminNavItems
        : esCapacitado
          ? capacitadoNavItems
          : [];

    const navLabel = esAdmin
        ? 'Administración'
        : esCapacitado
          ? 'Capacitación'
          : 'Platform';

    const homeUrl = esAdmin ? dashboardUrl : esCapacitado ? capacitadoUrl : '/';

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
                            <Link href={homeUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={currentNavItems} label={navLabel} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
