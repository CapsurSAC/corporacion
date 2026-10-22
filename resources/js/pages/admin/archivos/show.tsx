import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import { Head, router, usePage } from '@inertiajs/react';
import { Alert, Box, Button, Card, CardContent, Chip, Stack, TextField, Typography } from '@mui/material';
import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { FileTree, type FileNode } from '@/components/file-tree';

type Area = { id: number; name: string; slug: string; color: string };

export default function AdminFilesShow({ area, nodes = [] }: { area: Area; nodes?: FileNode[] }) {
    const { errors } = usePage<{ errors: Record<string, string> }>().props;
    const [folderName, setFolderName] = useState('');
    const [destination, setDestination] = useState<FileNode | null>(null);
    const parentId = destination?.id ?? null;
    const inputRef = useRef<HTMLInputElement>(null);
    const createFolder = (event: FormEvent) => {
        event.preventDefault();
        router.post(`/admin/archivos/${area.slug}/folders`, { name: folderName, parent_id: parentId }, {
            onSuccess: () => setFolderName(''),
        });
    };
    const uploadFile = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        router.post(`/admin/archivos/${area.slug}/files`, { file, parent_id: parentId }, { forceFormData: true });
        event.target.value = '';
    };
    const removeNode = (node: FileNode) => {
        if (window.confirm(`¿Eliminar "${node.name}"?`)) {
            router.delete(`/admin/archivos/nodes/${node.id}`, {
                onSuccess: () => {
                    if (destination?.id === node.id) {
                        setDestination(null);
                    }
                },
            });
        }
    };

    return (
        <>
            <Head title={`Archivos - ${area.name}`} />
            <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Button href="/admin/archivos" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>Áreas</Button>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>{area.name}</Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>Administrador de archivos del área</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }}>
                    <TextField size="small" label="Nueva carpeta" value={folderName} onChange={(e) => setFolderName(e.target.value)} />
                    <Button variant="contained" startIcon={<CreateNewFolderIcon />} onClick={createFolder} disabled={!folderName.trim()}>Crear carpeta</Button>
                    <input ref={inputRef} type="file" hidden onChange={uploadFile} />
                    <Button variant="outlined" startIcon={<DriveFolderUploadIcon />} onClick={() => inputRef.current?.click()}>Subir archivo</Button>
                </Stack>
                {(errors.name || errors.file) && (
                    <Alert severity="error" sx={{ mb: 2 }}>{errors.name ?? errors.file}</Alert>
                )}
                <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Typography variant="body2" color="text.secondary">Destino actual:</Typography>
                    <Chip
                        size="small"
                        color="primary"
                        variant={destination ? 'outlined' : 'filled'}
                        label={destination ? destination.name : 'Raíz del área'}
                    />
                    {destination && (
                        <Button size="small" startIcon={<HomeIcon />} onClick={() => setDestination(null)}>
                            Volver a la raíz
                        </Button>
                    )}
                </Stack>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Haz clic en una carpeta para crear subcarpetas o subir archivos dentro de ella.
                </Typography>
                <Card><CardContent><FileTree nodes={nodes} selectedId={parentId} onDelete={removeNode} onFolderSelect={setDestination} /></CardContent></Card>
            </Box>
        </>
    );
}
