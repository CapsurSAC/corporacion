import LaunchIcon from '@mui/icons-material/Launch';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {
    Avatar,
    Box,
    Button,
    Card,
    Chip,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { useState, useMemo } from 'react';
import type { Comercio, Grupo } from '@/types';

interface AcademicOfferExplorerProps {
    grupos: Grupo[];
    onSelectComercio: (comercio: Comercio) => void;
}

interface FlattenedProgram {
    id: string;
    nombre: string;
    categoria: 'carrera' | 'diplomado' | 'curso' | 'especialidad';
    tipoLabel?: string;
    modalidad?: string;
    duracion?: string;
    precio?: string;
    brochure?: string;
    flyer?: string;
    youtube?: string;
    comercio: Comercio;
}

export default function AcademicOfferExplorer({
    grupos,
    onSelectComercio,
}: AcademicOfferExplorerProps) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'carrera' | 'diplomado' | 'curso' | 'especialidad'>('all');
    const [selectedComercioId, setSelectedComercioId] = useState<string>('all');

    // Extraer todos los comercios activos
    const allComercios = useMemo(() => {
        const list: Comercio[] = [];
        grupos.forEach((g) => {
            if (g.comercios) {
                g.comercios.forEach((c) => {
                    list.push({ ...c, grupo: g });
                });
            }
        });
        return list;
    }, [grupos]);

    // Aplanar todos los programas (carreras, diplomados, cursos) en una sola lista consultable
    const allPrograms = useMemo(() => {
        const programs: FlattenedProgram[] = [];

        allComercios.forEach((com) => {
            // Carreras
            if (com.carreras) {
                com.carreras.forEach((carr) => {
                    programs.push({
                        id: `carrera_${carr.id}`,
                        nombre: carr.nombre,
                        categoria: 'carrera',
                        tipoLabel: carr.tipo || 'Carrera Profesional',
                        modalidad: carr.modalidad || 'Virtual / Semipresencial',
                        duracion: carr.duracion || '3 años',
                        brochure: carr.brochure || carr.url_malla_curricular || undefined,
                        flyer: carr.flyer || undefined,
                        comercio: com,
                    });
                });
            }

            // Diplomados
            if (com.diplomados) {
                com.diplomados.forEach((dip) => {
                    programs.push({
                        id: `dip_${dip.id}`,
                        nombre: dip.nombre,
                        categoria: 'diplomado',
                        tipoLabel: dip.tipo ? `Diplomado: ${dip.tipo.replace('_', ' ')}` : 'Diplomado',
                        precio: dip.precio ? `S/. ${dip.precio}` : undefined,
                        brochure: dip.brochure || undefined,
                        flyer: dip.flyer || undefined,
                        youtube: dip.youtube || undefined,
                        comercio: com,
                    });
                });
            }

            // Cursos
            if (com.cursos) {
                com.cursos.forEach((cur) => {
                    programs.push({
                        id: `curso_${cur.id}`,
                        nombre: cur.nombre,
                        categoria: 'curso',
                        tipoLabel: cur.tipo ? `Curso: ${cur.tipo}` : 'Curso de Capacitación',
                        precio: cur.precio ? `S/. ${cur.precio}` : undefined,
                        brochure: cur.brochure || undefined,
                        flyer: cur.flyer || undefined,
                        youtube: cur.youtube || undefined,
                        comercio: com,
                    });
                });
            }

            // Especialidades
            if (com.especialidades) {
                com.especialidades.forEach((esp) => {
                    programs.push({
                        id: `esp_${esp.id}`,
                        nombre: esp.nombre,
                        categoria: 'especialidad',
                        tipoLabel: esp.rubro?.nombre ? `Especialidad: ${esp.rubro.nombre}` : 'Especialidad',
                        precio: esp.precio ? `S/. ${esp.precio}` : undefined,
                        brochure: esp.brochure || undefined,
                        flyer: esp.flyer || undefined,
                        youtube: esp.youtube || undefined,
                        comercio: com,
                    });
                });
            }
        });

        return programs;
    }, [allComercios]);

    // Filtrado interactivo
    const filteredPrograms = useMemo(() => {
        return allPrograms.filter((item) => {
            // Filtro por término
            if (search) {
                const term = search.toLowerCase();
                const matchesName = item.nombre.toLowerCase().includes(term);
                const matchesComercio = item.comercio.nombre.toLowerCase().includes(term) || (item.comercio.sigla && item.comercio.sigla.toLowerCase().includes(term));
                const matchesTipo = item.tipoLabel?.toLowerCase().includes(term);
                if (!matchesName && !matchesComercio && !matchesTipo) return false;
            }

            // Filtro por categoría
            if (selectedCategory !== 'all' && item.categoria !== selectedCategory) {
                return false;
            }

            // Filtro por comercio
            if (selectedComercioId !== 'all' && String(item.comercio.id) !== selectedComercioId) {
                return false;
            }

            return true;
        });
    }, [allPrograms, search, selectedCategory, selectedComercioId]);

    const totalCarreras = allPrograms.filter((p) => p.categoria === 'carrera').length;
    const totalEspecialidades = allPrograms.filter((p) => p.categoria === 'especialidad').length;
    const totalDiplomados = allPrograms.filter((p) => p.categoria === 'diplomado').length;
    const totalCursos = allPrograms.filter((p) => p.categoria === 'curso').length;

    return (
        <Box sx={{ width: '100%' }}>
            {/* Barra de Filtros */}
            <Paper
                variant="outlined"
                sx={{
                    p: 2.5,
                    borderRadius: 2.5,
                    mb: 3,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'stretch', md: 'center' },
                    justifyContent: 'space-between',
                    gap: 2,
                }}
            >
                <TextField
                    size="small"
                    placeholder="Buscar programa formativo, especialidad, diplomado o curso..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ flex: 1, minWidth: { xs: '100%', sm: 300 } }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel id="select-comercio-label">Marca / Comercio</InputLabel>
                        <Select
                            labelId="select-comercio-label"
                            label="Marca / Comercio"
                            value={selectedComercioId}
                            onChange={(e) => setSelectedComercioId(e.target.value)}
                        >
                            <MenuItem value="all">Todas las Marcas</MenuItem>
                            {allComercios.map((com) => (
                                <MenuItem key={com.id} value={String(com.id)}>
                                    {com.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                        <Chip
                            label={`Todos (${allPrograms.length})`}
                            size="small"
                            clickable
                            color={selectedCategory === 'all' ? 'primary' : 'default'}
                            onClick={() => setSelectedCategory('all')}
                            sx={{ fontWeight: 700 }}
                        />
                        {totalCarreras > 0 && (
                            <Chip
                                label={`Carreras (${totalCarreras})`}
                                size="small"
                                clickable
                                color={selectedCategory === 'carrera' ? 'primary' : 'default'}
                                onClick={() => setSelectedCategory('carrera')}
                                sx={{ fontWeight: 700 }}
                            />
                        )}
                        {totalEspecialidades > 0 && (
                            <Chip
                                label={`Especialidades (${totalEspecialidades})`}
                                size="small"
                                clickable
                                color={selectedCategory === 'especialidad' ? 'info' : 'default'}
                                onClick={() => setSelectedCategory('especialidad')}
                                sx={{ fontWeight: 700 }}
                            />
                        )}
                        {totalDiplomados > 0 && (
                            <Chip
                                label={`Diplomados (${totalDiplomados})`}
                                size="small"
                                clickable
                                color={selectedCategory === 'diplomado' ? 'secondary' : 'default'}
                                onClick={() => setSelectedCategory('diplomado')}
                                sx={{ fontWeight: 700 }}
                            />
                        )}
                        {totalCursos > 0 && (
                            <Chip
                                label={`Cursos (${totalCursos})`}
                                size="small"
                                clickable
                                color={selectedCategory === 'curso' ? 'success' : 'default'}
                                onClick={() => setSelectedCategory('curso')}
                                sx={{ fontWeight: 700 }}
                            />
                        )}
                    </Box>
                </Box>
            </Paper>

            {/* Resultados */}
            {filteredPrograms.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 2.5 }}>
                    <SchoolIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 1.5 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        No se encontraron programas formativos
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Prueba ajustando los términos de búsqueda o los filtros seleccionados.
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={2}>
                    {filteredPrograms.map((item) => {
                        const brandColor = item.comercio.color_hex || '#0c43a3';

                        const getCategoryBadgeColor = () => {
                            switch (item.categoria) {
                                case 'carrera':
                                    return { color: 'primary' as const, label: 'CARRERA' };
                                case 'especialidad':
                                    return { color: 'info' as const, label: 'ESPECIALIDAD' };
                                case 'diplomado':
                                    return { color: 'secondary' as const, label: 'DIPLOMADO' };
                                case 'curso':
                                    return { color: 'success' as const, label: 'CURSO' };
                            }
                        };

                        const badge = getCategoryBadgeColor();

                        return (
                            <Grid size={{ xs: 12, md: 6 }} key={item.id}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        p: 2.5,
                                        borderRadius: 2,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        transition: 'all 0.2s',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            boxShadow: 3,
                                            borderColor: brandColor,
                                        },
                                    }}
                                >
                                    {/* Barra de acento con el color del comercio */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: 4,
                                            bgcolor: brandColor,
                                        }}
                                    />

                                    <Box>
                                        {/* Fila superior con Comercio y Categoría */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, gap: 1 }}>
                                            <Box
                                                onClick={() => onSelectComercio(item.comercio)}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    cursor: 'pointer',
                                                    '&:hover opacity': 0.8,
                                                }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 26,
                                                        height: 26,
                                                        bgcolor: brandColor,
                                                        color: '#ffffff',
                                                        fontSize: '0.7rem',
                                                        fontWeight: 800,
                                                    }}
                                                >
                                                    {(item.comercio.sigla || item.comercio.nombre).substring(0, 2).toUpperCase()}
                                                </Avatar>
                                                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary' }}>
                                                    {item.comercio.nombre}
                                                </Typography>
                                            </Box>

                                            <Chip
                                                label={badge.label}
                                                size="small"
                                                color={badge.color}
                                                sx={{ fontWeight: 800, fontSize: '0.68rem', height: 20 }}
                                            />
                                        </Box>

                                        {/* Nombre del Programa */}
                                        <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.3, mb: 1 }}>
                                            {item.nombre}
                                        </Typography>

                                        {/* Metadatos */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                                            {item.tipoLabel && (
                                                <Typography variant="caption" color="text.secondary">
                                                    {item.tipoLabel}
                                                </Typography>
                                            )}
                                            {item.modalidad && (
                                                <Chip label={item.modalidad} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                                            )}
                                            {item.duracion && (
                                                <Chip label={item.duracion} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                                            )}
                                            {item.precio && (
                                                <Chip label={item.precio} size="small" color="success" sx={{ fontWeight: 800, fontSize: '0.75rem' }} />
                                            )}
                                        </Box>
                                    </Box>

                                    {/* Botones de acción */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, pt: 1.5, borderTop: 1, borderColor: 'divider' }}>
                                        <Button
                                            size="small"
                                            variant="text"
                                            onClick={() => onSelectComercio(item.comercio)}
                                            endIcon={<LaunchIcon fontSize="small" />}
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 700,
                                                fontSize: '0.8rem',
                                                color: brandColor,
                                                '&:hover': { bgcolor: `${brandColor}10` },
                                            }}
                                        >
                                            Ver Ficha de la Marca
                                        </Button>

                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            {item.brochure && (
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    component="a"
                                                    href={item.brochure}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    startIcon={<PictureAsPdfIcon fontSize="small" />}
                                                    sx={{
                                                        textTransform: 'none',
                                                        fontSize: '0.75rem',
                                                        borderRadius: 1.5,
                                                        color: brandColor,
                                                        borderColor: brandColor,
                                                        '&:hover': {
                                                            borderColor: brandColor,
                                                            bgcolor: `${brandColor}10`,
                                                        },
                                                    }}
                                                >
                                                    Brochure
                                                </Button>
                                            )}
                                            {item.youtube && (
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="error"
                                                    component="a"
                                                    href={item.youtube}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    startIcon={<YouTubeIcon fontSize="small" />}
                                                    sx={{ textTransform: 'none', fontSize: '0.75rem', borderRadius: 1.5 }}
                                                >
                                                    Video
                                                </Button>
                                            )}
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </Box>
    );
}
