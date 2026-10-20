import { Head } from '@inertiajs/react';
import AwardIcon from '@mui/icons-material/EmojiEvents';
import BusinessIcon from '@mui/icons-material/Business';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import LaunchIcon from '@mui/icons-material/Launch';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import StorefrontIcon from '@mui/icons-material/Storefront';
import VerifiedIcon from '@mui/icons-material/Verified';
import {
    Avatar,
    Box,
    Button,
    Card,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    Tab,
    Tabs,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import type { Comercio, Grupo } from '@/types';

type Props = {
    grupos?: Grupo[];
    stats?: {
        totalGrupos: number;
        totalComercios: number;
        totalCarreras: number;
        totalDiplomados: number;
        totalCursos: number;
        totalEspecialidades: number;
    };
    initialTab?: 'todos' | 'cursos' | 'diplomados' | 'especialidades';
};

const getGrupoColor = (slug: string): string => {
    switch (slug) {
        case 'escifor':
            return '#0c43a3';
        case 'multimarca':
            return '#059669';
        case 'globalex':
            return '#0284c7';
        default:
            return '#4f46e5';
    }
};

export default function CapacitadoIndex({
    grupos = [],
    stats = {
        totalGrupos: 0,
        totalComercios: 0,
        totalCarreras: 0,
        totalDiplomados: 0,
        totalCursos: 0,
        totalEspecialidades: 0,
    },
    initialTab = 'todos',
}: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTab, setSelectedTab] = useState<'todos' | 'cursos' | 'diplomados' | 'especialidades'>(initialTab);
    const [selectedComercio, setSelectedComercio] = useState<Comercio | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    React.useEffect(() => {
        if (initialTab) {
            setSelectedTab(initialTab);
        }
    }, [initialTab]);

    const handleOpenComercio = (comercio: Comercio) => {
        setSelectedComercio(comercio);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedComercio(null);
    };

    // Filtrar grupos y comercios según búsqueda y tab activo
    const filteredGrupos = useMemo(() => {
        const term = searchQuery.toLowerCase().trim();

        return grupos.map((grupo) => {
            const comerciosFiltrados = (grupo.comercios || []).filter((com) => {
                if (term) {
                    const matchNombre = com.nombre?.toLowerCase().includes(term);
                    const matchSigla = com.sigla?.toLowerCase().includes(term);
                    const matchCarreras = com.carreras?.some((c) => c.nombre?.toLowerCase().includes(term));
                    const matchCursos = com.cursos?.some((c) => c.nombre?.toLowerCase().includes(term));
                    const matchDiplomados = com.diplomados?.some((d) => d.nombre?.toLowerCase().includes(term));
                    const matchEspecialidades = com.especialidades?.some((e) => e.nombre?.toLowerCase().includes(term));

                    if (!matchNombre && !matchSigla && !matchCarreras && !matchCursos && !matchDiplomados && !matchEspecialidades) {
                        return false;
                    }
                }

                if (selectedTab === 'cursos') {
                    return (com.cursos_count || (com.cursos?.length ?? 0)) > 0;
                }
                if (selectedTab === 'diplomados') {
                    return (com.diplomados_count || (com.diplomados?.length ?? 0)) > 0;
                }
                if (selectedTab === 'especialidades') {
                    return (com.especialidades_count || (com.especialidades?.length ?? 0)) > 0;
                }

                return true;
            });

            return {
                ...grupo,
                comerciosFiltrados,
            };
        });
    }, [grupos, searchQuery, selectedTab]);

    return (
        <>
            <Head title="Portal de Capacitación - Grupo Capsur" />

            <Box
                sx={{
                    p: { xs: 2, sm: 2.5, md: 3 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 2.5,
                    width: '100%',
                    flex: 1,
                    minHeight: 'calc(100vh - 4.5rem)',
                    boxSizing: 'border-box',
                }}
            >
                {/* CABECERA CON MISMO LAYOUT Y ESTILO QUE DASHBOARD */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 1.5, sm: 1.8 },
                        px: { xs: 2, sm: 2.5 },
                        borderRadius: 1.5,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: (theme) =>
                            theme.palette.mode === 'dark'
                                ? '0 2px 10px rgba(0,0,0,0.3)'
                                : '0 2px 10px rgba(0,0,0,0.03)',
                        width: '100%',
                        boxSizing: 'border-box',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 1.5,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar
                                sx={{
                                    bgcolor: 'primary.main',
                                    color: '#ffffff',
                                    width: 38,
                                    height: 38,
                                    borderRadius: 1,
                                    boxShadow: '0 2px 8px rgba(12, 67, 163, 0.25)',
                                }}
                            >
                                <SchoolIcon fontSize="small" />
                            </Avatar>
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 800,
                                            color: 'text.primary',
                                            letterSpacing: '-0.02em',
                                            fontSize: '1.05rem',
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        Portal de Capacitación
                                    </Typography>
                                    <Chip
                                        label="GRUPO CAPSUR"
                                        size="small"
                                        sx={{
                                            bgcolor: (theme) =>
                                                theme.palette.mode === 'dark'
                                                    ? 'rgba(12, 67, 163, 0.25)'
                                                    : 'rgba(12, 67, 163, 0.08)',
                                            color: 'primary.main',
                                            fontWeight: 800,
                                            fontSize: '0.65rem',
                                            height: 20,
                                            borderRadius: 1,
                                            border: '1px solid',
                                            borderColor: (theme) =>
                                                theme.palette.mode === 'dark'
                                                    ? 'rgba(12, 67, 163, 0.4)'
                                                    : 'rgba(12, 67, 163, 0.2)',
                                        }}
                                    />
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.78rem' }}>
                                    Consulta la oferta académica, diplomados, cursos y accesos a plataformas educativas de cada instituto.
                                </Typography>
                            </Box>
                        </Box>

                        {/* ESTADÍSTICAS RÁPIDAS DE CAPACITACIÓN */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            <Chip
                                icon={<StorefrontIcon fontSize="small" />}
                                label={`${stats.totalComercios} Comercios`}
                                variant="outlined"
                                size="small"
                                sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                            />
                            <Chip
                                icon={<MenuBookIcon fontSize="small" />}
                                label={`${stats.totalCursos} Cursos`}
                                variant="outlined"
                                size="small"
                                sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                            />
                            <Chip
                                icon={<AwardIcon fontSize="small" />}
                                label={`${stats.totalDiplomados} Diplomados`}
                                variant="outlined"
                                size="small"
                                sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                            />
                            <Chip
                                icon={<VerifiedIcon fontSize="small" />}
                                label={`${stats.totalEspecialidades} Especialidades`}
                                variant="outlined"
                                size="small"
                                sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                            />
                        </Box>
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    {/* FILTROS POR TIPO Y BÚSQUEDA */}
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, justifyContent: 'space-between', gap: 1.5 }}>
                        <Tabs
                            value={selectedTab}
                            onChange={(_, val) => setSelectedTab(val)}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                minHeight: 34,
                                '& .MuiTab-root': {
                                    minHeight: 34,
                                    py: 0.4,
                                    px: 1.8,
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    fontSize: '0.82rem',
                                },
                            }}
                        >
                            <Tab value="todos" label="Todos los Institutos" />
                            <Tab value="cursos" label={`Cursos (${stats.totalCursos})`} />
                            <Tab value="diplomados" label={`Diplomados (${stats.totalDiplomados})`} />
                            <Tab value="especialidades" label={`Especialidades (${stats.totalEspecialidades})`} />
                        </Tabs>

                        <TextField
                            size="small"
                            placeholder="Buscar comercio o programa..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={{ minWidth: { xs: '100%', md: 280 } }}
                        />
                    </Box>
                </Paper>

                {/* CUADRÍCULA DE DIVISIONES (MISMO LAYOUT QUE ADMINISTRADOR) */}
                <Grid
                    container
                    spacing={2.5}
                    sx={{
                        width: '100%',
                        m: 0,
                    }}
                >
                    {filteredGrupos.map((grupo) => {
                        const brandColor = getGrupoColor(grupo.slug);
                        const comercios = grupo.comerciosFiltrados || [];

                        return (
                            <Grid
                                size={{ xs: 12, md: 4 }}
                                key={grupo.id}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        height: '100%',
                                        p: { xs: 2, sm: 2.5 },
                                        borderRadius: 1.5,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        bgcolor: 'background.paper',
                                        boxShadow: (theme) =>
                                            theme.palette.mode === 'dark'
                                                ? '0 2px 10px rgba(0,0,0,0.3)'
                                                : '0 2px 10px rgba(0,0,0,0.02)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        boxSizing: 'border-box',
                                        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                                        '&:hover': {
                                            borderColor: brandColor,
                                            boxShadow: (theme) =>
                                                theme.palette.mode === 'dark'
                                                    ? '0 4px 20px rgba(0,0,0,0.4)'
                                                    : '0 4px 16px rgba(0,0,0,0.06)',
                                        },
                                    }}
                                >
                                    {/* Acento superior de color institucional */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: 3,
                                            bgcolor: brandColor,
                                        }}
                                    />

                                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        {/* Cabecera del Grupo */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                pb: 1.5,
                                                mb: 2,
                                                borderBottom: '1px solid',
                                                borderColor: 'divider',
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: `${brandColor}15`,
                                                        color: brandColor,
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: 1,
                                                        fontSize: '0.8rem',
                                                        fontWeight: 800,
                                                    }}
                                                >
                                                    <BusinessIcon fontSize="small" />
                                                </Avatar>
                                                <Box>
                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{
                                                            fontWeight: 800,
                                                            letterSpacing: 0.5,
                                                            fontSize: '0.95rem',
                                                            lineHeight: 1.2,
                                                        }}
                                                    >
                                                        {grupo.nombre}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                                                        {comercios.length} {comercios.length === 1 ? 'comercio' : 'comercios'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>

                                        {/* Botones de Comercios y Programas */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1.2,
                                                mb: 2,
                                            }}
                                        >
                                            {comercios.length > 0 ? (
                                                comercios.map((comercio) => {
                                                    const comColor = comercio.color_hex || brandColor;
                                                    const cursosCount = comercio.cursos_count ?? (comercio.cursos?.length || 0);
                                                    const diplomadosCount = comercio.diplomados_count ?? (comercio.diplomados?.length || 0);
                                                    const especialidadesCount = comercio.especialidades_count ?? (comercio.especialidades?.length || 0);

                                                    return (
                                                        <Box
                                                            key={comercio.id}
                                                            sx={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                gap: 0.8,
                                                            }}
                                                        >
                                                            <Button
                                                                fullWidth
                                                                variant="contained"
                                                                onClick={() => handleOpenComercio(comercio)}
                                                                sx={{
                                                                    height: 50,
                                                                    bgcolor: comColor,
                                                                    color: '#ffffff',
                                                                    fontWeight: 800,
                                                                    fontSize: '0.84rem',
                                                                    px: 1.8,
                                                                    borderRadius: 1,
                                                                    textTransform: 'uppercase',
                                                                    letterSpacing: 0.5,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between',
                                                                    boxShadow: `0 2px 8px ${comColor}25`,
                                                                    transition: 'all 0.15s ease-in-out',
                                                                    '&:hover': {
                                                                        bgcolor: comColor,
                                                                        filter: 'brightness(1.1)',
                                                                        transform: 'translateY(-1px)',
                                                                        boxShadow: `0 4px 12px ${comColor}40`,
                                                                    },
                                                                }}
                                                            >
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, minWidth: 0 }}>
                                                                    <Avatar
                                                                        sx={{
                                                                            bgcolor: 'rgba(255, 255, 255, 0.22)',
                                                                            color: '#ffffff',
                                                                            width: 28,
                                                                            height: 28,
                                                                            fontWeight: 900,
                                                                            fontSize: '0.68rem',
                                                                            borderRadius: 0.8,
                                                                            flexShrink: 0,
                                                                        }}
                                                                    >
                                                                        {(comercio.sigla || comercio.nombre.substring(0, 3)).substring(0, 3).toUpperCase()}
                                                                    </Avatar>
                                                                    <Typography
                                                                        sx={{
                                                                            fontWeight: 800,
                                                                            fontSize: '0.84rem',
                                                                            letterSpacing: 0.4,
                                                                            color: '#ffffff',
                                                                            textOverflow: 'ellipsis',
                                                                            overflow: 'hidden',
                                                                            whiteSpace: 'nowrap',
                                                                        }}
                                                                    >
                                                                        {comercio.nombre}
                                                                    </Typography>
                                                                </Box>
                                                                <LaunchIcon sx={{ fontSize: 14, opacity: 0.85, flexShrink: 0 }} />
                                                            </Button>

                                                            {/* Micro-chips con conteo de programas de formación */}
                                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, px: 0.5 }}>
                                                                {cursosCount > 0 && (
                                                                    <Chip
                                                                        label={`${cursosCount} Cursos`}
                                                                        size="small"
                                                                        variant="outlined"
                                                                        sx={{ fontSize: '0.68rem', height: 18 }}
                                                                    />
                                                                )}
                                                                {diplomadosCount > 0 && (
                                                                    <Chip
                                                                        label={`${diplomadosCount} Diplomados`}
                                                                        size="small"
                                                                        variant="outlined"
                                                                        sx={{ fontSize: '0.68rem', height: 18 }}
                                                                    />
                                                                )}
                                                                {especialidadesCount > 0 && (
                                                                    <Chip
                                                                        label={`${especialidadesCount} Especialidades`}
                                                                        size="small"
                                                                        variant="outlined"
                                                                        sx={{ fontSize: '0.68rem', height: 18 }}
                                                                    />
                                                                )}
                                                            </Box>
                                                        </Box>
                                                    );
                                                })
                                            ) : (
                                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', py: 2, textAlign: 'center' }}>
                                                    Sin institutos para este filtro.
                                                </Typography>
                                            )}
                                        </Box>

                                        {/* Descripción Corporativa al Pie */}
                                        {grupo.descripcion && (
                                            <Box
                                                sx={{
                                                    mt: 'auto',
                                                    pt: 1.5,
                                                    borderTop: '1px solid',
                                                    borderColor: 'divider',
                                                }}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{
                                                        fontSize: '0.75rem',
                                                        lineHeight: 1.4,
                                                        display: 'block',
                                                    }}
                                                >
                                                    {grupo.descripcion}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>

            {/* MODAL DETALLE DE OFERTA ACADÉMICA PARA CAPACITADOS */}
            <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
                {selectedComercio && (
                    <>
                        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Chip
                                    label={selectedComercio.sigla || 'CAP'}
                                    sx={{
                                        bgcolor: selectedComercio.color_hex || '#0c43a3',
                                        color: '#ffffff',
                                        fontWeight: 800,
                                    }}
                                />
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                        {selectedComercio.nombre}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Oferta de Formación y Enlaces de Acceso
                                    </Typography>
                                </Box>
                            </Box>
                            <IconButton onClick={handleCloseModal} size="small">
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>

                        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            {/* Enlaces de interés directo */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                                {selectedComercio.plataforma_carrera && (
                                    <Button
                                        variant="contained"
                                        size="small"
                                        component="a"
                                        href={selectedComercio.plataforma_carrera}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        startIcon={<LaunchIcon />}
                                        sx={{ textTransform: 'none', fontWeight: 700 }}
                                    >
                                        Acceder al Aula Virtual
                                    </Button>
                                )}
                                {selectedComercio.malla_curricular_url && (
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        component="a"
                                        href={selectedComercio.malla_curricular_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        startIcon={<DescriptionIcon />}
                                        sx={{ textTransform: 'none', fontWeight: 600 }}
                                    >
                                        Ver Malla Curricular
                                    </Button>
                                )}
                                {selectedComercio.certificado_url && (
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        component="a"
                                        href={selectedComercio.certificado_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        startIcon={<VerifiedIcon />}
                                        sx={{ textTransform: 'none', fontWeight: 600 }}
                                    >
                                        Verificar Certificado
                                    </Button>
                                )}
                                {selectedComercio.pagina_web && (
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        component="a"
                                        href={selectedComercio.pagina_web}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{ textTransform: 'none', fontWeight: 600 }}
                                    >
                                        Sitio Web Institucional
                                    </Button>
                                )}
                            </Box>

                            {/* Cursos */}
                            {selectedComercio.cursos && selectedComercio.cursos.length > 0 && (
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <MenuBookIcon fontSize="small" color="primary" /> Cursos de Actualización ({selectedComercio.cursos.length})
                                    </Typography>
                                    <Grid container spacing={1.5}>
                                        {selectedComercio.cursos.map((c) => (
                                            <Grid size={{ xs: 12, sm: 6 }} key={c.id}>
                                                <Card variant="outlined" sx={{ p: 1.5 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                        {c.nombre}
                                                    </Typography>
                                                    {c.tipo && (
                                                        <Chip label={c.tipo} size="small" sx={{ mt: 0.8, fontSize: '0.68rem', height: 18 }} />
                                                    )}
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}

                            {/* Diplomados */}
                            {selectedComercio.diplomados && selectedComercio.diplomados.length > 0 && (
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AwardIcon fontSize="small" color="secondary" /> Diplomados de Especialización ({selectedComercio.diplomados.length})
                                    </Typography>
                                    <Grid container spacing={1.5}>
                                        {selectedComercio.diplomados.map((d) => (
                                            <Grid size={{ xs: 12, sm: 6 }} key={d.id}>
                                                <Card variant="outlined" sx={{ p: 1.5 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                        {d.nombre}
                                                    </Typography>
                                                    {d.tipo && (
                                                        <Chip label={d.tipo} size="small" color="secondary" variant="outlined" sx={{ mt: 0.8, fontSize: '0.68rem', height: 18 }} />
                                                    )}
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}

                            {/* Especialidades */}
                            {selectedComercio.especialidades && selectedComercio.especialidades.length > 0 && (
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <SchoolIcon fontSize="small" color="success" /> Especialidades Técnicas ({selectedComercio.especialidades.length})
                                    </Typography>
                                    <Grid container spacing={1.5}>
                                        {selectedComercio.especialidades.map((e) => (
                                            <Grid size={{ xs: 12, sm: 6 }} key={e.id}>
                                                <Card variant="outlined" sx={{ p: 1.5 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                        {e.nombre}
                                                    </Typography>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}
                        </DialogContent>

                        <DialogActions sx={{ p: 2 }}>
                            <Button onClick={handleCloseModal} variant="outlined" sx={{ textTransform: 'none', fontWeight: 600 }}>
                                Cerrar
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </>
    );
}

// Configuración de Layout para que use idéntico AppLayout y Sidebar Header
CapacitadoIndex.layout = () => ({
    breadcrumbs: [
        {
            title: 'Portal de Capacitaciones',
            href: '/capacitado',
        },
    ],
});
