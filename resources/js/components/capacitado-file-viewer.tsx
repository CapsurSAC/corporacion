import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { FileTree, type FileNode } from '@/components/file-tree';

export function CapacitadoFileViewer({
    area,
    nodes,
}: {
    area: { name: string; description?: string | null; color: string };
    nodes: FileNode[];
}) {
    return (
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, width: '100%', boxSizing: 'border-box' }}>
            <Card elevation={0} sx={{ border: 0, boxShadow: 'none', bgcolor: 'background.paper' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.75 }}>
                        <FolderOpenRoundedIcon sx={{ color: area.color, fontSize: 30 }} />
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>Archivos de {area.name}</Typography>
                    </Box>
                    <Typography color="text.secondary" sx={{ mb: 2.5 }}>
                        {area.description || 'Explora las carpetas y consulta los archivos disponibles en modo lectura.'}
                    </Typography>
                    <FileTree nodes={nodes} readOnly />
                </CardContent>
            </Card>
        </Box>
    );
}
