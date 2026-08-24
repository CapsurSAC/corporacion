import { Head, usePage, router, Link } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import StorefrontIcon from '@mui/icons-material/Storefront';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    IconButton,
    Chip,
    TextField,
    InputAdornment,
    Paper,
} from '@mui/material';
import { useState } from 'react';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { GrupoDialog } from '@/components/admin/grupo-dialog';
import { dashboard } from '@/routes';
import type { Grupo } from '@/types';

interface Props {
    grupos: Grupo[];
}

export default function GruposIndex({ grupos = [] }: Props) {
    const page = usePage();
    const currentTeam = page.props.currentTeam as { slug: string } | undefined;
    const currentTeamSlug = currentTeam?.slug || 'default';

    const [search, setSearch] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedGrupo, setSelectedGrupo] = useState<Grupo | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [grupoToDelete, setGrupoToDelete] = useState<Grupo | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const filteredGrupos = grupos.filter((g) =>
        g.nombre.toLowerCase().includes(search.toLowerCase()) ||
        (g.descripcion && g.descripcion.toLowerCase().includes(search.toLowerCase()))
    );

    const handleCreate = () => {
        setSelectedGrupo(null);
        setDialogOpen(true);
    };

    const handleEdit = (grupo: Grupo) => {
        setSelectedGrupo(grupo);
        setDialogOpen(true);
    };

    const handleDeletePrompt = (grupo: Grupo) => {
        setGrupoToDelete(grupo);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!grupoToDelete) {
            return;
        }

        setIsDeleting(true);

        router.delete(`/${currentTeamSlug}/admin/grupos/${grupoToDelete.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setDeleteDialogOpen(false);
                setGrupoToDelete(null);
            },
        });
    };

    const totalComercios = grupos.reduce((acc, g) => acc + (g.comercios_count || 0), 0);
    const totalCarreras = grupos.reduce((acc, g) => acc + (g.carreras_count || 0), 0);

    return (
        <>
            <Head title="Grupos Comerciales - Grupo Capsur" />

            <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 500 }}>
                            <BusinessIcon fontSize="small" />
                            <span>Catálogo Capsur</span>
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                            Grupos Comerciales
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Gestiona las divisiones y conglomerados educativos de Grupo Capsur.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleCreate}
                        sx={{ px: 2.5, py: 1 }}
                    >
                        Nuevo Grupo
                    </Button>
                </Box>

                {/* KPI Cards */}
                <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                                        Total de Grupos
                                    </Typography>
                                    <BusinessIcon color="primary" fontSize="small" />
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {grupos.length}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {grupos.filter((g) => g.activo).length} activos actualmente
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                                        Comercios Asignados
                                    </Typography>
                                    <StorefrontIcon color="success" fontSize="small" />
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {totalComercios}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Unidades e institutos distribuidos
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                                        Programas Académicos
                                    </Typography>
                                    <SchoolIcon color="info" fontSize="small" />
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {totalCarreras}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Carreras, diplomados y cursos
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Search Bar */}
                <Box sx={{ maxWidth: 400 }}>
                    <TextField
                        placeholder="Buscar grupo por nombre o descripción..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        fullWidth
                        size="small"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" color="action" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </Box>

                {/* List of Grupos */}
                <Grid container spacing={2.5}>
                    {filteredGrupos.length === 0 ? (
                        <Grid size={{ xs: 12 }}>
                            <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderStyle: 'dashed' }}>
                                <BusinessIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    No se encontraron grupos
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {search
                                        ? 'No hay resultados que coincidan con tu búsqueda.'
                                        : 'Aún no has registrado ningún grupo comercial.'}
                                </Typography>
                                {!search && (
                                    <Button variant="outlined" startIcon={<AddIcon />} onClick={handleCreate}>
                                        Crear primer grupo
                                    </Button>
                                )}
                            </Paper>
                        </Grid>
                    ) : (
                        filteredGrupos.map((grupo) => (
                            <Grid size={{ xs: 12, md: 6 }} key={grupo.id}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            boxShadow: 3,
                                            borderColor: 'primary.main',
                                        },
                                    }}
                                >
                                    <CardContent sx={{ pb: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 1.5 }}>
                                            <Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                        {grupo.nombre}
                                                    </Typography>
                                                    {grupo.activo ? (
                                                        <Chip
                                                            icon={<CheckCircleIcon fontSize="small" />}
                                                            label="Activo"
                                                            color="success"
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ height: 22, fontSize: '0.75rem' }}
                                                        />
                                                    ) : (
                                                        <Chip
                                                            icon={<HighlightOffIcon fontSize="small" />}
                                                            label="Inactivo"
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ height: 22, fontSize: '0.75rem' }}
                                                        />
                                                    )}
                                                </Box>
                                                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                                                    slug: {grupo.slug}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                <IconButton size="small" onClick={() => handleEdit(grupo)} title="Editar grupo">
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" color="error" onClick={() => handleDeletePrompt(grupo)} title="Eliminar grupo">
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Box>

                                        <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40, fontSize: '0.8125rem' }}>
                                            {grupo.descripcion || 'Sin descripción asignada.'}
                                        </Typography>
                                    </CardContent>

                                    <Box sx={{ p: 2, pt: 1.5, borderTop: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
                                                <StorefrontIcon fontSize="inherit" color="primary" />
                                                <span>{grupo.comercios_count || 0} Comercios</span>
                                            </Typography>
                                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
                                                <SchoolIcon fontSize="inherit" color="info" />
                                                <span>{grupo.carreras_count || 0} Programas</span>
                                            </Typography>
                                        </Box>

                                        <Link
                                            href={`/${currentTeamSlug}/admin/comercios?grupo_id=${grupo.id}`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <Button
                                                size="small"
                                                endIcon={<ArrowForwardIcon />}
                                                sx={{ fontSize: '0.75rem', p: 0.5 }}
                                            >
                                                Ver comercios
                                            </Button>
                                        </Link>
                                    </Box>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            </Box>

            {/* Dialogs */}
            <GrupoDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                grupo={selectedGrupo}
                currentTeamSlug={currentTeamSlug}
            />

            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title={`¿Eliminar grupo "${grupoToDelete?.nombre}"?`}
                description="Esta acción eliminará el grupo y todos los comercios y programas asociados a él de forma permanente. ¿Estás seguro de continuar?"
                onConfirm={confirmDelete}
                processing={isDeleting}
            />
        </>
    );
}

GruposIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: props.currentTeam ? dashboard(props.currentTeam.slug) : '/',
        },
        {
            title: 'Grupos Comerciales',
            href: props.currentTeam ? `/${props.currentTeam.slug}/admin/grupos` : '#',
        },
    ],
});
