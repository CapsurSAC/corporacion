import { Link, usePage } from '@inertiajs/react';
import { useState, type MouseEvent } from 'react';
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
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
    const [unauthorizedArea, setUnauthorizedArea] = useState<string | null>(null);
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
    const assignedTrainingAreaSlug = user?.training_area?.slug || user?.trainingArea?.slug;
    const capacitadoUrl = assignedTrainingAreaSlug
        ? `/capacitado/area/${assignedTrainingAreaSlug}`
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

    const handleNavClick = (item: NavItem, event: MouseEvent<Element>) => {
        if (!esCapacitado || !item.href.toString().startsWith('/capacitado/area/')) {
            return;
        }

        const targetAreaSlug = item.href.toString().split('/').pop();
        if (targetAreaSlug !== assignedTrainingAreaSlug) {
            event.preventDefault();
            setUnauthorizedArea(item.title);
        }
    };

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
        <>
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
                <NavMain items={currentNavItems} label={navLabel} onItemClick={handleNavClick} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
            </Sidebar>

            <Dialog open={Boolean(unauthorizedArea)} onOpenChange={(open) => !open && setUnauthorizedArea(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Acceso no autorizado</DialogTitle>
                        <DialogDescription>
                            No tienes autorización para acceder al área de {unauthorizedArea || 'capacitación'}.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button>Entendido</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
