import { useForm } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DeleteIcon from '@mui/icons-material/Delete';
import DomainIcon from '@mui/icons-material/Domain';
import LanguageIcon from '@mui/icons-material/Language';
import StorefrontIcon from '@mui/icons-material/Storefront';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormControlLabel,
    Checkbox,
    Button,
    IconButton,
    Box,
    Grid,
    Typography,
    CircularProgress,
    Chip,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { Comercio, Grupo } from '@/types';

const COLOR_PRESETS = [
    { name: 'Azul (SIS)', hex: '#1d4ed8' },
    { name: 'Rojo (AVANTI)', hex: '#dc2626' },
    { name: 'Borgoña (NEXT)', hex: '#78350f' },
    { name: 'Azul Claro (MAGISTER)', hex: '#3b82f6' },
    { name: 'Verde (CECAVA)', hex: '#16a34a' },
    { name: 'Dorado (CECAVA-MIN)', hex: '#ca8a04' },
    { name: 'Naranja (MATPEL)', hex: '#ea580c' },
    { name: 'Celeste (GLOBALEX)', hex: '#0284c7' },
    { name: 'Ámbar (IGE)', hex: '#d97706' },
    { name: 'Púrpura', hex: '#7c3aed' },
];

interface ComercioDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    comercio?: Comercio | null;
    grupos: Grupo[];
    defaultGrupoId?: number | null;
    currentTeamSlug: string;
}

export function ComercioDialog({
    open,
    onOpenChange,
    comercio,
    grupos,
    defaultGrupoId,
    currentTeamSlug,
}: ComercioDialogProps) {
    const isEditing = !!comercio;
    const [currentTab, setCurrentTab] = useState(0);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm<{
            grupo_id: string;
            nombre: string;
            codigo: string;
            sigla: string;
            color_hex: string;
            pagina_web: string;
            plataforma_carrera: string;
            como_ingresar_plataforma: string;
            certificado_url: string;
            resolucion_revalidacion: string;
            resolucion_creacion: string;
            escale_minedu: string;
            link_directo_escale: string;
            malla_curricular_url: string;
            catalogo_url: string;
            reconocimiento_director: string;
            seminario: string;
            convenio: string;
            promocion_vigente: string;
            canales_youtube: string[];
            fotos: string[];
            descripcion: string;
            activo: boolean;
        }>({
            grupo_id: defaultGrupoId ? String(defaultGrupoId) : (grupos[0]?.id ? String(grupos[0].id) : ''),
            nombre: '',
            codigo: '',
            sigla: '',
            color_hex: '#1d4ed8',
            pagina_web: '',
            plataforma_carrera: '',
            como_ingresar_plataforma: '',
            certificado_url: '',
            resolucion_revalidacion: '',
            resolucion_creacion: '',
            escale_minedu: '',
            link_directo_escale: '',
            malla_curricular_url: '',
            catalogo_url: '',
            reconocimiento_director: '',
            seminario: '',
            convenio: '',
            promocion_vigente: '',
            canales_youtube: [''],
            fotos: [''],
            descripcion: '',
            activo: true,
        });

    useEffect(() => {
        if (comercio) {
            setData({
                grupo_id: String(comercio.grupo_id),
                nombre: comercio.nombre,
                codigo: comercio.codigo || '',
                sigla: comercio.sigla || '',
                color_hex: comercio.color_hex || '#1d4ed8',
                pagina_web: comercio.pagina_web || '',
                plataforma_carrera: comercio.plataforma_carrera || '',
                como_ingresar_plataforma: comercio.como_ingresar_plataforma || '',
                certificado_url: comercio.certificado_url || '',
                resolucion_revalidacion: comercio.resolucion_revalidacion || '',
                resolucion_creacion: comercio.resolucion_creacion || '',
                escale_minedu: comercio.escale_minedu || '',
                link_directo_escale: comercio.link_directo_escale || '',
                malla_curricular_url: comercio.malla_curricular_url || '',
                catalogo_url: comercio.catalogo_url || '',
                reconocimiento_director: comercio.reconocimiento_director || '',
                seminario: comercio.seminario || '',
                convenio: comercio.convenio || '',
                promocion_vigente: comercio.promocion_vigente || '',
                canales_youtube: comercio.canales_youtube && comercio.canales_youtube.length > 0 ? comercio.canales_youtube : [''],
                fotos: comercio.fotos && comercio.fotos.length > 0 ? comercio.fotos : [''],
                descripcion: comercio.descripcion || '',
                activo: comercio.activo,
            });
        } else {
            reset();

            if (defaultGrupoId) {
                setData('grupo_id', String(defaultGrupoId));
            } else if (grupos.length > 0) {
                setData('grupo_id', String(grupos[0].id));
            }
        }

        clearErrors();
    }, [comercio, open, defaultGrupoId, grupos]);

    const handleAddYoutube = () => {
        setData('canales_youtube', [...data.canales_youtube, '']);
    };

    const handleRemoveYoutube = (index: number) => {
        const list = [...data.canales_youtube];
        list.splice(index, 1);
        setData('canales_youtube', list.length ? list : ['']);
    };

    const handleYoutubeChange = (val: string, index: number) => {
        const list = [...data.canales_youtube];
        list[index] = val;
        setData('canales_youtube', list);
    };

    const handleAddFoto = () => {
        setData('fotos', [...data.fotos, '']);
    };

    const handleRemoveFoto = (index: number) => {
        const list = [...data.fotos];
        list.splice(index, 1);
        setData('fotos', list.length ? list : ['']);
    };

    const handleFotoChange = (val: string, index: number) => {
        const list = [...data.fotos];
        list[index] = val;
        setData('fotos', list);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && comercio) {
            put(`/${currentTeamSlug}/admin/comercios/${comercio.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        } else {
            post(`/${currentTeamSlug}/admin/comercios`, {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        }
    };

    return (
        <Dialog
            open={open}
            onClose={() => onOpenChange(false)}
            maxWidth="md"
            fullWidth
        >
            <form onSubmit={handleSubmit}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
                    <StorefrontIcon color="primary" />
                    <span>{isEditing ? 'Editar Ficha de Comercio' : 'Nuevo Comercio / Institución'}</span>
                </DialogTitle>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
                    <Tabs
                        value={currentTab}
                        onChange={(_, val) => setCurrentTab(val)}
                        textColor="primary"
                        indicatorColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab icon={<DomainIcon fontSize="small" />} iconPosition="start" label="1. General" />
                        <Tab icon={<AssignmentIcon fontSize="small" />} iconPosition="start" label="2. MINEDU & Catálogo" />
                        <Tab icon={<LanguageIcon fontSize="small" />} iconPosition="start" label="3. Plataformas & Promociones" />
                        <Tab icon={<YouTubeIcon fontSize="small" />} iconPosition="start" label="4. YouTube & Fotos" />
                    </Tabs>
                </Box>

                <DialogContent sx={{ pt: 3, pb: 3, minHeight: 380 }}>
                    {/* TAB 1: DATOS GENERALES */}
                    {currentTab === 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControl fullWidth size="small" error={!!errors.grupo_id}>
                                        <InputLabel id="select-grupo-label">Grupo Perteneciente *</InputLabel>
                                        <Select
                                            labelId="select-grupo-label"
                                            value={data.grupo_id}
                                            label="Grupo Perteneciente *"
                                            onChange={(e) => setData('grupo_id', e.target.value)}
                                        >
                                            {grupos.map((g) => (
                                                <MenuItem key={g.id} value={String(g.id)}>
                                                    {g.nombre}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <TextField
                                        label="Sigla (Ej. AVANTI, SIS)"
                                        value={data.sigla}
                                        onChange={(e) => setData('sigla', e.target.value.toUpperCase())}
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <TextField
                                        label="Código Corto"
                                        value={data.codigo}
                                        onChange={(e) => setData('codigo', e.target.value.toUpperCase())}
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                            </Grid>

                            <TextField
                                label="Nombre Comercial / Instituto *"
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                placeholder="Ej. ISTP AVANTI, ISTP SIS, NEXT-ONLINE..."
                                error={!!errors.nombre}
                                helperText={errors.nombre}
                                fullWidth
                                required
                                size="small"
                            />

                            {/* Color Selector */}
                            <Box sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                                        Color de Identidad Visual Corporativa
                                    </Typography>
                                    <Chip
                                        label={data.nombre || 'VISTA PREVIA'}
                                        size="small"
                                        sx={{
                                            bgcolor: data.color_hex || '#1d4ed8',
                                            color: '#ffffff',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                        }}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                                    <input
                                        type="color"
                                        value={data.color_hex}
                                        onChange={(e) => setData('color_hex', e.target.value)}
                                        style={{ width: 38, height: 38, border: 'none', cursor: 'pointer', background: 'transparent' }}
                                    />
                                    <TextField
                                        value={data.color_hex}
                                        onChange={(e) => setData('color_hex', e.target.value)}
                                        size="small"
                                        placeholder="#1d4ed8"
                                        sx={{ width: 140 }}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {COLOR_PRESETS.map((preset) => (
                                        <Box
                                            key={preset.hex}
                                            onClick={() => setData('color_hex', preset.hex)}
                                            title={preset.name}
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                borderRadius: 1,
                                                bgcolor: preset.hex,
                                                cursor: 'pointer',
                                                border: data.color_hex.toLowerCase() === preset.hex.toLowerCase() ? '2px solid' : '1px solid rgba(0,0,0,0.2)',
                                                borderColor: data.color_hex.toLowerCase() === preset.hex.toLowerCase() ? 'primary.main' : 'divider',
                                                transform: data.color_hex.toLowerCase() === preset.hex.toLowerCase() ? 'scale(1.15)' : 'none',
                                                transition: 'transform 0.15s',
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>

                            <TextField
                                label="Descripción"
                                value={data.descripcion}
                                onChange={(e) => setData('descripcion', e.target.value)}
                                placeholder="Breve reseña del comercio o unidad educativa..."
                                fullWidth
                                multiline
                                rows={2}
                                size="small"
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={data.activo}
                                        onChange={(e) => setData('activo', e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="Comercio activo y visible en el catálogo"
                            />
                        </Box>
                    )}

                    {/* TAB 2: RESOLUCIONES & MINEDU */}
                    {currentTab === 1 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="Catálogo Oficial (Ej. Catálogo AVANTI 2026)"
                                        value={data.catalogo_url}
                                        onChange={(e) => setData('catalogo_url', e.target.value)}
                                        placeholder="https://.../catalogo-2026.pdf"
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="Reconocimiento de Director"
                                        value={data.reconocimiento_director}
                                        onChange={(e) => setData('reconocimiento_director', e.target.value)}
                                        placeholder="Ej. R.D. o enlace de reconocimiento"
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="ESCALE MINEDU (Link a la página web)"
                                        value={data.escale_minedu}
                                        onChange={(e) => setData('escale_minedu', e.target.value)}
                                        placeholder="https://escale.minedu.gob.pe/padron-ce?..."
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="Validar Instituto en ESCALE (Link Directo)"
                                        value={data.link_directo_escale}
                                        onChange={(e) => setData('link_directo_escale', e.target.value)}
                                        placeholder="https://escale.minedu.gob.pe/..."
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="Resolución de Revalidación (Link al PDF)"
                                        value={data.resolucion_revalidacion}
                                        onChange={(e) => setData('resolucion_revalidacion', e.target.value)}
                                        placeholder="https://.../resolucion-revalidacion.pdf"
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="Resolución de Creación (Link al PDF / Texto)"
                                        value={data.resolucion_creacion}
                                        onChange={(e) => setData('resolucion_creacion', e.target.value)}
                                        placeholder="https://.../resolucion-creacion.pdf o R.M. 280-99-ED"
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="Certificado Oficial (URL)"
                                        value={data.certificado_url}
                                        onChange={(e) => setData('certificado_url', e.target.value)}
                                        placeholder="https://.../certificado.pdf"
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="Malla Curricular / Brochure"
                                        value={data.malla_curricular_url}
                                        onChange={(e) => setData('malla_curricular_url', e.target.value)}
                                        placeholder="https://.../malla.pdf"
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* TAB 3: PLATAFORMAS & PROMOCIONES */}
                    {currentTab === 2 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="Plataforma Carrera (PlataformaWeb)"
                                        value={data.plataforma_carrera}
                                        onChange={(e) => setData('plataforma_carrera', e.target.value)}
                                        placeholder="https://avanti.edu.pe/plataforma"
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="Página Web (PaginaWeb)"
                                        value={data.pagina_web}
                                        onChange={(e) => setData('pagina_web', e.target.value)}
                                        placeholder="https://avanti.edu.pe"
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                            </Grid>

                            <TextField
                                label="¿Cómo ingresar a mi plataforma? (Video Tutorial YouTube)"
                                value={data.como_ingresar_plataforma}
                                onChange={(e) => setData('como_ingresar_plataforma', e.target.value)}
                                placeholder="https://youtube.com/watch?v=..."
                                fullWidth
                                size="small"
                            />

                            <TextField
                                label="Promoción Vigente (Opcional)"
                                value={data.promocion_vigente}
                                onChange={(e) => setData('promocion_vigente', e.target.value)}
                                placeholder="Detalles de descuentos especiales, becas o promociones..."
                                fullWidth
                                multiline
                                rows={2}
                                size="small"
                            />

                            <TextField
                                label="Seminario / Eventos Académicos"
                                value={data.seminario}
                                onChange={(e) => setData('seminario', e.target.value)}
                                placeholder="https://.../seminarios o enlace"
                                fullWidth
                                size="small"
                            />

                            <TextField
                                label="Convenios y Alianzas Estratégicas"
                                value={data.convenio}
                                onChange={(e) => setData('convenio', e.target.value)}
                                placeholder="Detalles de convenios marco..."
                                fullWidth
                                multiline
                                rows={2}
                                size="small"
                            />
                        </Box>
                    )}

                    {/* TAB 4: YOUTUBE & FOTOS */}
                    {currentTab === 3 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <YouTubeIcon color="error" fontSize="small" />
                                        <span>Canales / Videos de YouTube</span>
                                    </Typography>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<AddIcon />}
                                        onClick={handleAddYoutube}
                                    >
                                        Agregar Enlace
                                    </Button>
                                </Box>
                                {data.canales_youtube.map((link, idx) => (
                                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <TextField
                                            value={link}
                                            onChange={(e) => handleYoutubeChange(e.target.value, idx)}
                                            placeholder={`Link_Youtube${idx + 1} (https://youtube.com/...)`}
                                            fullWidth
                                            size="small"
                                        />
                                        <IconButton
                                            onClick={() => handleRemoveYoutube(idx)}
                                            color="error"
                                            size="small"
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>

                            <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                        Galería de Fotos Institucionales
                                    </Typography>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<AddIcon />}
                                        onClick={handleAddFoto}
                                    >
                                        Agregar Foto
                                    </Button>
                                </Box>
                                {data.fotos.map((foto, idx) => (
                                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <TextField
                                            value={foto}
                                            onChange={(e) => handleFotoChange(e.target.value, idx)}
                                            placeholder={`Foto${idx + 1} URL (https://...)`}
                                            fullWidth
                                            size="small"
                                        />
                                        <IconButton
                                            onClick={() => handleRemoveFoto(idx)}
                                            color="error"
                                            size="small"
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2.5, borderTop: 1, borderColor: 'divider' }}>
                    <Button
                        onClick={() => onOpenChange(false)}
                        disabled={processing}
                        variant="outlined"
                        color="inherit"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={processing}
                        variant="contained"
                        color="primary"
                        startIcon={processing ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                        {isEditing ? 'Guardar Cambios' : 'Crear Comercio'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
