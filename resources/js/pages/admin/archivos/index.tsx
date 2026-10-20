import { Head, router } from '@inertiajs/react';
import { Box, Card, CardActionArea, CardContent, Grid, Typography } from '@mui/material';
import { WindowsFolderIcon } from '@/components/windows-folder-icon';

type Area = { id: number; name: string; slug: string; color: string; files_count: number };

export default function AdminFilesIndex({ areas = [] }: { areas?: Area[] }) {
    return (
        <>
            <Head title="Archivos" />
            <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }} gutterBottom>Archivos</Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Abre un área para administrar sus carpetas y archivos.
                </Typography>
                <Grid container spacing={2}>
                    {areas.map((area) => (
                        <Grid key={area.id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Card>
                                <CardActionArea
                                    href={`/admin/archivos/${area.slug}`}
                                    onClick={(event) => {
                                        if (event.detail < 2) event.preventDefault();
                                    }}
                                    onDoubleClick={() => router.visit(`/admin/archivos/${area.slug}`)}
                                    sx={{ p: 1 }}
                                >
                                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <WindowsFolderIcon sx={{ fontSize: 48, color: area.color }} />
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 700 }}>{area.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {area.files_count ?? 0} elementos en la raíz
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    );
}
