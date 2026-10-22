import { Head, router } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileTextIcon from '@mui/icons-material/Description';
import KnowledgeIcon from '@mui/icons-material/MenuBook';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
    Avatar,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputLabel,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { FormEvent, useEffect, useState } from 'react';
import { confirmDeleteAlert } from '@/lib/swal';
import { useNotification } from '@/hooks/use-notification';

interface DocumentItem {
    id: number;
    title: string;
    original_filename: string;
    status: 'draft' | 'published' | 'archived';
    version: number;
    file_size: number;
    extraction_error?: string | null;
    created_at?: string;
}

interface Area {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    color: string;
    bot_name?: string | null;
    initial_message?: string | null;
    ai_instructions?: string | null;
    is_active: boolean;
    sort_order: number;
    published_documents_count: number;
    documents: DocumentItem[];
}

type AreaForm = {
    name: string;
    slug: string;
    description: string;
    color: string;
    bot_name: string;
    initial_message: string;
    ai_instructions: string;
    is_active: boolean;
    sort_order: number;
};

const emptyArea: AreaForm = {
    name: '',
    slug: '',
    description: '',
    color: '#0c43a3',
    bot_name: '',
    initial_message: '',
    ai_instructions: '',
    is_active: true,
    sort_order: 0,
};

const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const statusLabel: Record<DocumentItem['status'], string> = {
    draft: 'Borrador',
    published: 'Publicado',
    archived: 'Archivado',
};

export default function TrainingAreasIndex({ areas = [] }: { areas: Area[] }) {
    const { notify } = useNotification();
    const [areaForm, setAreaForm] = useState<AreaForm>(emptyArea);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [areaDialogOpen, setAreaDialogOpen] = useState(false);
    const [documentsArea, setDocumentsArea] = useState<Area | null>(null);
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [documentTitle, setDocumentTitle] = useState('');

    const showFirstError = (errors: Record<string, unknown>, fallback: string) => {
        const firstError = Object.values(errors)[0];
        notify.error(typeof firstError === 'string' ? firstError : fallback);
    };

    useEffect(() => {
        if (documentsArea) {
            const refreshedArea = areas.find((area) => area.id === documentsArea.id);
            if (refreshedArea) setDocumentsArea(refreshedArea);
        }
    }, [areas, documentsArea]);

    const openCreateDialog = () => {
        setEditingId(null);
        setAreaForm(emptyArea);
        setAreaDialogOpen(true);
    };

    const openEditDialog = (area: Area) => {
        setEditingId(area.id);
        setAreaForm({
            name: area.name,
            slug: area.slug,
            description: area.description || '',
            color: area.color,
            bot_name: area.bot_name || '',
            initial_message: area.initial_message || '',
            ai_instructions: area.ai_instructions || '',
            is_active: area.is_active,
            sort_order: area.sort_order,
        });
        setAreaDialogOpen(true);
    };

    const closeAreaDialog = () => {
        setAreaDialogOpen(false);
        setEditingId(null);
        setAreaForm(emptyArea);
    };

    const submitArea = (event: FormEvent) => {
        event.preventDefault();
        const url = editingId ? `/admin/capacitacion/areas/${editingId}` : '/admin/capacitacion/areas';
        router[editingId ? 'put' : 'post'](url, areaForm, {
            preserveScroll: true,
            onSuccess: () => {
                closeAreaDialog();
                notify.success(editingId ? 'Área actualizada correctamente.' : 'Área creada correctamente.');
            },
            onError: (errors) => showFirstError(errors, 'No se pudo guardar el área.'),
        });
    };

    const deleteArea = async (area: Area) => {
        const confirmed = await confirmDeleteAlert({
            title: '¿Eliminar área?',
            text: `Se eliminará el área "${area.name}" y sus documentos indexados. Esta acción no se puede deshacer.`,
        });
        if (confirmed) {
            router.delete(`/admin/capacitacion/areas/${area.id}`, {
                preserveScroll: true,
                onSuccess: () => notify.success('Área eliminada correctamente.'),
                onError: (errors) => showFirstError(errors, 'No se pudo eliminar el área.'),
            });
        }
    };

    const openDocumentsDialog = (area: Area) => {
        setDocumentsArea(area);
        setDocumentFile(null);
        setDocumentTitle('');
    };

    const closeDocumentsDialog = () => {
        setDocumentsArea(null);
        setDocumentFile(null);
        setDocumentTitle('');
    };

    const uploadDocument = (event: FormEvent) => {
        event.preventDefault();
        if (!documentsArea || !documentFile) return;

        const data = new FormData();
        data.append('title', documentTitle.trim() || documentFile.name.replace(/\.[^.]+$/, ''));
        data.append('document', documentFile);
        router.post(`/admin/capacitacion/areas/${documentsArea.id}/documents`, data, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setDocumentFile(null);
                setDocumentTitle('');
                notify.success('Documento cargado e indexado correctamente.');
            },
            onError: (errors) => showFirstError(errors, 'No se pudo procesar el documento.'),
        });
    };

    const deleteDocument = async (document: DocumentItem) => {
        const confirmed = await confirmDeleteAlert({
            title: '¿Eliminar documento?',
            text: `Se eliminará "${document.title}" de la base de conocimiento.`,
        });
        if (confirmed) {
            router.delete(`/admin/capacitacion/documents/${document.id}`, {
                preserveScroll: true,
                onSuccess: () => notify.success('Documento eliminado correctamente.'),
                onError: (errors) => showFirstError(errors, 'No se pudo eliminar el documento.'),
            });
        }
    };

    const publishDocument = (document: DocumentItem) => {
        router.patch(`/admin/capacitacion/documents/${document.id}/status`, { status: 'published' }, {
            preserveScroll: true,
            onSuccess: () => notify.success('Documento publicado correctamente.'),
            onError: (errors) => showFirstError(errors, 'No se pudo publicar el documento.'),
        });
    };

    return (
        <>
            <Head title="Gestión de Capacitación - Grupo Capsur" />
            <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 2.5, width: '100%', boxSizing: 'border-box' }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, sm: 2.5 },
                        borderRadius: 1.5,
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: (theme) =>
                            theme.palette.mode === 'dark'
                                ? '0 2px 10px rgba(0,0,0,0.3)'
                                : '0 2px 10px rgba(0,0,0,0.03)',
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8 }}>
                            <Avatar sx={{ bgcolor: 'primary.main', color: '#fff', width: 42, height: 42, borderRadius: 1 }}>
                                <KnowledgeIcon fontSize="small" />
                            </Avatar>
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 800 }}>Base de conocimiento RAG</Typography>
                                    <Chip label={`${areas.length} ÁREAS`} size="small" sx={{ color: 'primary.main', fontWeight: 800, fontSize: '0.68rem', height: 20 }} />
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    Administra las áreas y los documentos oficiales que utilizará el chatbot.
                                </Typography>
                            </Box>
                        </Box>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>
                            Nueva área
                        </Button>
                    </Box>
                </Paper>

                <Paper elevation={0} sx={{ borderRadius: 1.5, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800 }}>Área</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Asistente</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Documentos</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Estado</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800 }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {areas.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} align="center">No hay áreas registradas.</TableCell></TableRow>
                                ) : areas.map((area) => (
                                    <TableRow key={area.id} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: area.color, flexShrink: 0 }} />
                                                <Box>
                                                    <Typography sx={{ fontWeight: 700 }}>{area.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">/{area.slug}</Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{area.bot_name || `Asistente de ${area.name}`}</TableCell>
                                        <TableCell>
                                            <Chip size="small" label={`${area.published_documents_count} publicados`} color={area.published_documents_count ? 'success' : 'default'} />
                                        </TableCell>
                                        <TableCell>
                                            <Chip size="small" label={area.is_active ? 'Activa' : 'Inactiva'} color={area.is_active ? 'success' : 'default'} />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                                                <Tooltip title="Subir Documento">
                                                    <IconButton color="primary" onClick={() => openDocumentsDialog(area)} aria-label={`Subir documento a ${area.name}`}>
                                                        <UploadFileIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Editar">
                                                    <IconButton onClick={() => openEditDialog(area)} aria-label={`Editar ${area.name}`}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Eliminar">
                                                    <IconButton color="error" onClick={() => deleteArea(area)} aria-label={`Eliminar ${area.name}`}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>

            <Dialog open={areaDialogOpen} onClose={closeAreaDialog} fullWidth maxWidth="md">
                <DialogTitle>{editingId ? 'Editar área de capacitación' : 'Crear área de capacitación'}</DialogTitle>
                <Box component="form" onSubmit={submitArea}>
                    <DialogContent dividers>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: 1.5 }}>
                            {[
                                ['name', 'Nombre', 4],
                                ['slug', 'Slug (opcional)', 4],
                                ['bot_name', 'Nombre del asistente', 4],
                                ['description', 'Descripción', 12],
                                ['initial_message', 'Mensaje inicial', 6],
                                ['ai_instructions', 'Instrucciones específicas para la IA', 6],
                            ].map(([key, label, columns]) => (
                                <Box key={key as string} sx={{ gridColumn: { xs: 'span 12', md: `span ${columns}` } }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label={label as string}
                                        multiline={['description', 'initial_message', 'ai_instructions'].includes(key as string)}
                                        minRows={['description', 'initial_message', 'ai_instructions'].includes(key as string) ? 2 : undefined}
                                        value={areaForm[key as keyof AreaForm] as string}
                                        onChange={(event) => setAreaForm({ ...areaForm, [key as string]: event.target.value })}
                                    />
                                </Box>
                            ))}
                            <Box sx={{ gridColumn: 'span 12', display: 'flex', alignItems: 'flex-end', gap: 1.5 }}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        height: 40,
                                        minWidth: 142,
                                        px: 1,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 1,
                                        bgcolor: 'background.paper',
                                        '&:focus-within': {
                                            borderColor: 'primary.main',
                                            boxShadow: (theme) => `0 0 0 1px ${theme.palette.primary.main}`,
                                        },
                                    }}
                                >
                                    <InputLabel
                                        shrink
                                        sx={{
                                            position: 'absolute',
                                            top: -8,
                                            left: 8,
                                            px: 0.5,
                                            bgcolor: 'background.paper',
                                            fontSize: '0.72rem',
                                        }}
                                    >
                                        Color
                                    </InputLabel>
                                    <Box
                                        component="input"
                                        type="color"
                                        aria-label="Color del área"
                                        value={areaForm.color}
                                        onChange={(event) => setAreaForm({ ...areaForm, color: event.target.value })}
                                        sx={{ width: 26, height: 26, p: 0, border: 0, cursor: 'pointer', bgcolor: 'transparent' }}
                                    />
                                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                                        {areaForm.color.toUpperCase()}
                                    </Typography>
                                </Box>
                                <TextField
                                    size="small"
                                    label="Orden"
                                    type="number"
                                    value={areaForm.sort_order}
                                    onChange={(event) => setAreaForm({ ...areaForm, sort_order: Number(event.target.value) })}
                                    sx={{ width: 120 }}
                                />
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button startIcon={<CancelIcon />} onClick={closeAreaDialog}>Cancelar</Button>
                        <Button type="submit" variant="contained" startIcon={editingId ? <EditIcon /> : <AddIcon />}>
                            {editingId ? 'Guardar cambios' : 'Crear área'}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

            <Dialog open={Boolean(documentsArea)} onClose={closeDocumentsDialog} fullWidth maxWidth="lg">
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FileTextIcon color="primary" />
                        Documentos de conocimiento · {documentsArea?.name}
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    <Box component="form" onSubmit={uploadDocument} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 1.5, alignItems: { md: 'center' }, mb: 2 }}>
                        <TextField size="small" label="Título del documento" value={documentTitle} onChange={(event) => setDocumentTitle(event.target.value)} sx={{ minWidth: 260 }} />
                        <Button component="label" variant="outlined" startIcon={<UploadFileIcon />}>
                            {documentFile?.name || 'Seleccionar PDF o Word'}
                            <input hidden type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => setDocumentFile(event.target.files?.[0] || null)} />
                        </Button>
                        <Button type="submit" variant="contained" disabled={!documentFile} startIcon={<UploadFileIcon />}>
                            Subir e indexar
                        </Button>
                    </Box>
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800 }}>Documento</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Versión</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Tamaño</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Estado</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800 }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(documentsArea?.documents || []).length === 0 ? (
                                    <TableRow><TableCell colSpan={5} align="center">No hay documentos asociados a esta área.</TableCell></TableRow>
                                ) : documentsArea?.documents.map((document) => (
                                    <TableRow key={document.id} hover>
                                        <TableCell>
                                            <Typography sx={{ fontWeight: 600 }}>{document.title}</Typography>
                                            <Typography variant="caption" color="text.secondary">{document.original_filename}</Typography>
                                        </TableCell>
                                        <TableCell>v{document.version}</TableCell>
                                        <TableCell>{formatFileSize(document.file_size)}</TableCell>
                                        <TableCell>
                                            <Chip size="small" label={document.extraction_error ? 'Error' : statusLabel[document.status]} color={document.extraction_error ? 'error' : document.status === 'published' ? 'success' : 'default'} />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                                                {document.status === 'draft' && !document.extraction_error && (
                                                    <Button size="small" onClick={() => publishDocument(document)}>Publicar</Button>
                                                )}
                                                <IconButton color="error" size="small" onClick={() => deleteDocument(document)} aria-label={`Eliminar ${document.title}`}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDocumentsDialog}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
