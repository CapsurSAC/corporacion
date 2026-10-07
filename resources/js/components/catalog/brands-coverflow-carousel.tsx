import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Container, IconButton, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

export interface CoverflowBrandItem {
    id: string;
    name: string;
    sigla: string;
    image: string;
    alt: string;
}

const DEFAULT_BRANDS: CoverflowBrandItem[] = [
    {
        id: 'sis',
        name: 'SIS Instituto Sistemas del Sur',
        sigla: 'SIS',
        image: '/images/sis.png',
        alt: 'SIS Instituto Sistemas del Sur',
    },
    {
        id: 'avanti',
        name: 'AVANTI Instituto de Turismo y Hostelería',
        sigla: 'AVANTI',
        image: '/images/avanti.png',
        alt: 'Avanti Emprendedores - Instituto de Turismo y Hostelería',
    },
    {
        id: 'cecava',
        name: 'CECAVA Capacitaciones Especializadas',
        sigla: 'CECAVA',
        image: '/images/cecava.png',
        alt: 'CECAVA Capacitaciones Especializadas',
    },
    {
        id: 'matpel',
        name: 'MATPEL Materiales Peligrosos',
        sigla: 'MATPEL',
        image: '/images/matpel.png',
        alt: 'MATPEL Materiales Peligrosos',
    },
    {
        id: 'next-online',
        name: 'Next Online Idiomas',
        sigla: 'Next Online',
        image: '/images/next-online.png',
        alt: 'Next Online Idiomas',
    },
    {
        id: 'globalex',
        name: 'Globalex Instituto Superior',
        sigla: 'Globalex',
        image: '/images/globalex.png',
        alt: 'IES Privado Globalex',
    },
    {
        id: 'cecava-min',
        name: 'CECAVA MIN',
        sigla: 'CECAVA MIN',
        image: '/images/cecava-min.png',
        alt: 'CECAVA MIN - Capacitación para el Sector Minero',
    },
];

interface Props {
    onSelectBrand?: (brand: CoverflowBrandItem) => void;
}

export default function BrandsCoverflowCarousel({ onSelectBrand }: Props) {
    // Inicializar con CECAVA (índice 2) como tarjeta activa central, tal como en el diseño de referencia
    const [activeIndex, setActiveIndex] = useState(2);
    const [isHovered, setIsHovered] = useState(false);
    const touchStartX = useRef<number | null>(null);

    const brands = DEFAULT_BRANDS;
    const total = brands.length;

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + total) % total);
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % total);
    };

    // Autoplay suave cada 5 segundos si el usuario no tiene el cursor encima
    useEffect(() => {
        if (isHovered) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % total);
        }, 5000);
        return () => clearInterval(interval);
    }, [isHovered, total]);

    // Soporte táctil para deslizar con el dedo
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        setIsHovered(true);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchEndX - touchStartX.current;
        if (Math.abs(diff) > 40) {
            if (diff > 0) {
                handlePrev();
            } else {
                handleNext();
            }
        }
        touchStartX.current = null;
        setIsHovered(false);
    };

    return (
        <Box
            component="section"
            id="marcas"
            sx={{
                position: 'relative',
                pt: { xs: 8, sm: 9, md: 10 },
                pb: { xs: 9, sm: 11, md: 13 },
                bgcolor: '#ffffff',
                overflow: 'hidden',
                scrollMarginTop: { xs: '65px', md: '75px' },
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Marca de agua de fondo gigante "GRUPO CAPSUR" */}
            <Typography
                aria-hidden="true"
                sx={{
                    position: 'absolute',
                    top: { xs: 30, sm: 40, md: 45 },
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    textAlign: 'center',
                    fontSize: { xs: '3.6rem', sm: '6.2rem', md: '9rem', lg: '11.5rem' },
                    fontWeight: 950,
                    letterSpacing: { xs: '0.04em', md: '0.08em' },
                    color: 'rgba(12, 67, 163, 0.038)',
                    textTransform: 'uppercase',
                    userSelect: 'none',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    zIndex: 0,
                    lineHeight: 1,
                }}
            >
                GRUPO CAPSUR
            </Typography>

            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                {/* Cabecera del bloque */}
                <Box
                    sx={{
                        textAlign: 'center',
                        maxWidth: 780,
                        mx: 'auto',
                        mb: { xs: 4, sm: 5, md: 6 },
                        px: 2,
                    }}
                >
                    {/* Eyebrow con líneas divisorias laterales */}
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1.8,
                            mb: 1.4,
                        }}
                    >
                        <Box
                            sx={{
                                width: { xs: 28, sm: 36, md: 44 },
                                height: '2px',
                                bgcolor: '#0066ee',
                                borderRadius: 1,
                            }}
                        />
                        <Typography
                            sx={{
                                fontSize: { xs: '0.72rem', sm: '0.78rem' },
                                fontWeight: 800,
                                letterSpacing: '0.18em',
                                color: '#0066ee',
                                textTransform: 'uppercase',
                                lineHeight: 1,
                            }}
                        >
                            NUESTRAS MARCAS
                        </Typography>
                        <Box
                            sx={{
                                width: { xs: 28, sm: 36, md: 44 },
                                height: '2px',
                                bgcolor: '#0066ee',
                                borderRadius: 1,
                            }}
                        />
                    </Box>

                    {/* Título Principal */}
                    <Typography
                        component="h2"
                        sx={{
                            fontSize: { xs: '1.9rem', sm: '2.5rem', md: '3.1rem' },
                            fontWeight: 900,
                            letterSpacing: '-0.035em',
                            lineHeight: 1.15,
                            mb: 1.6,
                            color: '#09152a',
                        }}
                    >
                        Una corporación,{' '}
                        <Box
                            component="span"
                            sx={{
                                color: '#0066ee',
                                display: 'inline',
                            }}
                        >
                            múltiples oportunidades
                        </Box>
                    </Typography>

                    {/* Subtítulo descriptivo */}
                    <Typography
                        sx={{
                            color: '#64748b',
                            fontSize: { xs: '0.88rem', sm: '0.96rem', md: '1.02rem' },
                            lineHeight: 1.6,
                            maxWidth: 680,
                            mx: 'auto',
                        }}
                    >
                        Instituciones y negocios especializados en educación, capacitación e idiomas, impulsando el desarrollo profesional en el sur del país.
                    </Typography>
                </Box>

                {/* Escenario del Carrusel 3D Cover Flow */}
                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        height: { xs: 340, sm: 400, md: 470 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        perspective: { xs: 800, md: 1100 },
                        transformStyle: 'preserve-3d',
                        mt: { xs: 1, sm: 2 },
                    }}
                >
                    {/* Botón Flotante Anterior (Izquierda) */}
                    <IconButton
                        aria-label="Marca anterior"
                        onClick={handlePrev}
                        sx={{
                            position: 'absolute',
                            left: { xs: 4, sm: 16, md: 36, lg: 50 },
                            top: '46%',
                            transform: 'translateY(-50%)',
                            zIndex: 30,
                            bgcolor: '#ffffff',
                            color: '#0f172a',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 18px rgba(0, 0, 0, 0.12)',
                            width: { xs: 40, sm: 46 },
                            height: { xs: 40, sm: 46 },
                            transition: 'all 0.22s ease',
                            '&:hover': {
                                bgcolor: '#ffffff',
                                color: '#0066ee',
                                borderColor: '#0066ee',
                                transform: 'translateY(-50%) scale(1.08)',
                                boxShadow: '0 6px 22px rgba(0, 102, 238, 0.25)',
                            },
                        }}
                    >
                        <ChevronLeftIcon sx={{ fontSize: { xs: 22, sm: 26 } }} />
                    </IconButton>

                    {/* Pista de Tarjetas en Perspectiva */}
                    <Box
                        sx={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {brands.map((brand, idx) => {
                            // Calcular distancia con respecto a la tarjeta activa con wrap-around
                            let offset = idx - activeIndex;
                            if (offset > total / 2) offset -= total;
                            if (offset < -total / 2) offset += total;

                            const isCenter = offset === 0;
                            const absOffset = Math.abs(offset);

                            // Ocultar tarjetas más allá del rango visible de 3 a cada lado
                            if (absOffset > 3) {
                                return null;
                            }

                            return (
                                <Box
                                    key={brand.id}
                                    onClick={() => {
                                        if (isCenter) {
                                            onSelectBrand?.(brand);
                                        } else {
                                            setActiveIndex(idx);
                                        }
                                    }}
                                    sx={{
                                        position: 'absolute',
                                        width: { xs: 210, sm: 250, md: 290, lg: 310 },
                                        aspectRatio: '4 / 5',
                                        borderRadius: { xs: '14px', sm: '18px', md: '20px' },
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        userSelect: 'none',
                                        transition: 'all 0.45s cubic-bezier(0.25, 1, 0.5, 1)',
                                        transformStyle: 'preserve-3d',
                                        willChange: 'transform, opacity',
                                        // Efecto de reflejo en el suelo
                                        WebkitBoxReflect:
                                            'below 4px linear-gradient(to bottom, transparent 65%, rgba(0, 0, 0, 0.18) 100%)',

                                        // Distribución espacial según offset
                                        ...(isCenter
                                            ? {
                                                  transform: {
                                                      xs: 'translateX(0px) scale(1.1) translateZ(50px)',
                                                      sm: 'translateX(0px) scale(1.15) translateZ(80px)',
                                                      md: 'translateX(0px) scale(1.18) translateZ(100px)',
                                                  },
                                                  zIndex: 20,
                                                  opacity: 1,
                                                  boxShadow:
                                                      '0 20px 40px -10px rgba(0, 40, 120, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.25) inset',
                                                  filter: 'brightness(1.02)',
                                              }
                                            : absOffset === 1
                                            ? {
                                                  transform: {
                                                      xs: `translateX(${offset * 125}px) scale(0.9) perspective(700px) rotateY(${offset * -14}deg)`,
                                                      sm: `translateX(${offset * 165}px) scale(0.92) perspective(900px) rotateY(${offset * -15}deg)`,
                                                      md: `translateX(${offset * 210}px) scale(0.93) perspective(1100px) rotateY(${offset * -16}deg)`,
                                                  },
                                                  zIndex: 14,
                                                  opacity: 0.94,
                                                  boxShadow: '0 12px 28px -6px rgba(0, 20, 60, 0.28)',
                                                  filter: 'brightness(0.93)',
                                                  '&:hover': {
                                                      filter: 'brightness(1)',
                                                  },
                                              }
                                            : absOffset === 2
                                            ? {
                                                  transform: {
                                                      xs: `translateX(${offset * 190}px) scale(0.76) perspective(700px) rotateY(${offset * -24}deg)`,
                                                      sm: `translateX(${offset * 270}px) scale(0.8) perspective(900px) rotateY(${offset * -25}deg)`,
                                                      md: `translateX(${offset * 350}px) scale(0.82) perspective(1100px) rotateY(${offset * -26}deg)`,
                                                  },
                                                  zIndex: 8,
                                                  opacity: 0.85,
                                                  boxShadow: '0 8px 20px -4px rgba(0, 10, 40, 0.22)',
                                                  filter: 'brightness(0.85)',
                                                  '&:hover': {
                                                      filter: 'brightness(0.95)',
                                                  },
                                              }
                                            : {
                                                  transform: {
                                                      xs: `translateX(${offset * 230}px) scale(0.62) perspective(700px) rotateY(${offset * -32}deg)`,
                                                      sm: `translateX(${offset * 340}px) scale(0.68) perspective(900px) rotateY(${offset * -32}deg)`,
                                                      md: `translateX(${offset * 460}px) scale(0.72) perspective(1100px) rotateY(${offset * -32}deg)`,
                                                  },
                                                  zIndex: 4,
                                                  opacity: 0.6,
                                                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.18)',
                                                  filter: 'brightness(0.78)',
                                              }),
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={brand.image}
                                        alt={brand.alt}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'center',
                                            display: 'block',
                                            pointerEvents: 'none',
                                        }}
                                    />
                                </Box>
                            );
                        })}
                    </Box>

                    {/* Botón Flotante Siguiente (Derecha) */}
                    <IconButton
                        aria-label="Marca siguiente"
                        onClick={handleNext}
                        sx={{
                            position: 'absolute',
                            right: { xs: 4, sm: 16, md: 36, lg: 50 },
                            top: '46%',
                            transform: 'translateY(-50%)',
                            zIndex: 30,
                            bgcolor: '#ffffff',
                            color: '#0f172a',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 18px rgba(0, 0, 0, 0.12)',
                            width: { xs: 40, sm: 46 },
                            height: { xs: 40, sm: 46 },
                            transition: 'all 0.22s ease',
                            '&:hover': {
                                bgcolor: '#ffffff',
                                color: '#0066ee',
                                borderColor: '#0066ee',
                                transform: 'translateY(-50%) scale(1.08)',
                                boxShadow: '0 6px 22px rgba(0, 102, 238, 0.25)',
                            },
                        }}
                    >
                        <ChevronRightIcon sx={{ fontSize: { xs: 22, sm: 26 } }} />
                    </IconButton>
                </Box>

                {/* Barra de Indicadores y Puntos Inferiores */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1.1,
                        mt: { xs: 4, sm: 5, md: 6 },
                        position: 'relative',
                    }}
                >
                    {/* Línea de pista de fondo sutil */}
                    <Box
                        sx={{
                            position: 'absolute',
                            width: { xs: 150, sm: 200 },
                            height: '2px',
                            bgcolor: 'rgba(226, 232, 240, 0.85)',
                            zIndex: 0,
                        }}
                    />

                    {brands.map((brand, idx) => {
                        const isActive = idx === activeIndex;
                        return (
                            <Box
                                key={brand.id}
                                onClick={() => setActiveIndex(idx)}
                                role="button"
                                tabIndex={0}
                                aria-label={`Ver marca ${brand.name}`}
                                sx={{
                                    position: 'relative',
                                    zIndex: 1,
                                    cursor: 'pointer',
                                    height: 8,
                                    width: isActive ? 28 : 8,
                                    borderRadius: 4,
                                    bgcolor: isActive ? '#0066ee' : '#cbd5e1',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: isActive ? '0 2px 8px rgba(0, 102, 238, 0.4)' : 'none',
                                    '&:hover': {
                                        bgcolor: isActive ? '#0066ee' : '#94a3b8',
                                    },
                                }}
                            />
                        );
                    })}
                </Box>
            </Container>
        </Box>
    );
}
