import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Container, IconButton, Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';

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
    // Inicializar con CECAVA (índice 2) como tarjeta activa central
    const [activeIndex, setActiveIndex] = useState(2);
    const [isHovered, setIsHovered] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number | null>(null);

    const brands = DEFAULT_BRANDS;
    const total = brands.length;

    const handlePrev = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + total) % total);
    }, [total]);

    const handleNext = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % total);
    }, [total]);

    // Detección de visibilidad con IntersectionObserver (evita timers y renders innecesarios fuera de pantalla)
    useEffect(() => {
        const el = sectionRef.current;
        if (!el || typeof IntersectionObserver === 'undefined') {
            setIsInView(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            { rootMargin: '100px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Autoplay suave cada 5 segundos SOLO cuando la sección es visible y no tiene hover
    useEffect(() => {
        if (!isInView || isHovered) return;
        const interval = setInterval(handleNext, 5000);
        return () => clearInterval(interval);
    }, [isInView, isHovered, handleNext]);

    // Soporte táctil optimizado para deslizamiento (swipe)
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        setIsHovered(true);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchEndX - touchStartX.current;
        if (Math.abs(diff) > 35) {
            if (diff > 0) {
                handlePrev();
            } else {
                handleNext();
            }
        }
        touchStartX.current = null;
        setIsHovered(false);
    };

    // Navegación rápida por teclado con flechas izquierda / derecha
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            handlePrev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            handleNext();
        }
    };

    return (
        <Box
            ref={sectionRef}
            component="section"
            id="marcas"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            aria-label="Carrusel interactivo de marcas e instituciones"
            sx={{
                position: 'relative',
                pt: { xs: 6, sm: 8, md: 9 },
                pb: { xs: 7, sm: 9, md: 10 },
                bgcolor: '#ffffff',
                overflow: 'hidden',
                scrollMarginTop: { xs: '65px', md: '75px' },
                outline: 'none',
                // Optimización de renderizado para no afectar el scroll general de la página
                contentVisibility: 'auto',
                containIntrinsicSize: '650px',
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
                    top: { xs: 20, sm: 30, md: 35 },
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
                        mb: { xs: 3.5, sm: 4.5, md: 5 },
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
                            mb: 1.4,
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

                {/* Escenario del Carrusel 3D Cover Flow Acelerado por GPU */}
                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        height: { xs: 330, sm: 380, md: 440 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        perspective: 1000,
                        contain: 'layout paint',
                        mt: { xs: 1, sm: 2 },
                        userSelect: 'none',
                    }}
                >
                    {/* Botón Flotante Anterior (Izquierda) */}
                    <IconButton
                        aria-label="Marca anterior"
                        onClick={handlePrev}
                        sx={{
                            position: 'absolute',
                            left: { xs: 6, sm: 16, md: 28, lg: 40 },
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 30,
                            bgcolor: '#ffffff',
                            color: '#0f172a',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                            width: { xs: 40, sm: 46 },
                            height: { xs: 40, sm: 46 },
                            transition: 'transform 0.18s ease, border-color 0.18s ease, color 0.18s ease',
                            '&:hover': {
                                bgcolor: '#ffffff',
                                color: '#0066ee',
                                borderColor: '#0066ee',
                                transform: 'translateY(-50%) scale(1.08)',
                                boxShadow: '0 6px 20px rgba(0, 102, 238, 0.22)',
                            },
                        }}
                    >
                        <ChevronLeftIcon sx={{ fontSize: { xs: 22, sm: 26 } }} />
                    </IconButton>

                    {/* Base de piso ambiental elegante (100% acelerada por hardware, sin costo en scroll) */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: { xs: 6, md: 10 },
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: { xs: '85%', sm: '75%', md: '65%' },
                            height: { xs: 36, md: 54 },
                            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0, 102, 238, 0.14) 0%, rgba(0, 102, 238, 0.03) 60%, transparent 80%)',
                            pointerEvents: 'none',
                            zIndex: 1,
                        }}
                    />

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

                            // Cálculo cinemático de transformación rápida por GPU (translate3d)
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
                                        width: { xs: 200, sm: 240, md: 280, lg: 300 },
                                        aspectRatio: '4 / 5',
                                        borderRadius: { xs: '14px', sm: '18px', md: '20px' },
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        userSelect: 'none',
                                        // Transición rápida y fluida: solo anima transform y opacity en el compositor
                                        transition: 'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.28s ease',
                                        willChange: 'transform, opacity',
                                        backfaceVisibility: 'hidden',
                                        WebkitBackfaceVisibility: 'hidden',

                                        // Distribución espacial según offset
                                        ...(isCenter
                                            ? {
                                                  transform: {
                                                      xs: 'translate3d(0, 0, 40px) scale(1.1)',
                                                      sm: 'translate3d(0, 0, 60px) scale(1.15)',
                                                      md: 'translate3d(0, 0, 80px) scale(1.18)',
                                                  },
                                                  zIndex: 20,
                                                  opacity: 1,
                                                  boxShadow:
                                                      '0 18px 38px -8px rgba(0, 40, 120, 0.38), 0 0 0 1px rgba(0, 102, 238, 0.22)',
                                              }
                                            : absOffset === 1
                                            ? {
                                                  transform: {
                                                      xs: `translate3d(${offset * 125}px, 0, 0) scale(0.9) rotateY(${offset * -14}deg)`,
                                                      sm: `translate3d(${offset * 165}px, 0, 0) scale(0.92) rotateY(${offset * -15}deg)`,
                                                      md: `translate3d(${offset * 210}px, 0, 0) scale(0.93) rotateY(${offset * -16}deg)`,
                                                  },
                                                  zIndex: 14,
                                                  opacity: 0.94,
                                                  boxShadow: '0 8px 22px -6px rgba(0, 20, 60, 0.22)',
                                                  '&:hover': {
                                                      opacity: 1,
                                                  },
                                              }
                                            : absOffset === 2
                                            ? {
                                                  transform: {
                                                      xs: `translate3d(${offset * 190}px, 0, 0) scale(0.76) rotateY(${offset * -24}deg)`,
                                                      sm: `translate3d(${offset * 270}px, 0, 0) scale(0.8) rotateY(${offset * -25}deg)`,
                                                      md: `translate3d(${offset * 350}px, 0, 0) scale(0.82) rotateY(${offset * -26}deg)`,
                                                  },
                                                  zIndex: 8,
                                                  opacity: 0.82,
                                                  boxShadow: '0 4px 14px -4px rgba(0, 10, 40, 0.16)',
                                                  '&:hover': {
                                                      opacity: 0.92,
                                                  },
                                              }
                                            : {
                                                  transform: {
                                                      xs: `translate3d(${offset * 230}px, 0, 0) scale(0.62) rotateY(${offset * -32}deg)`,
                                                      sm: `translate3d(${offset * 340}px, 0, 0) scale(0.68) rotateY(${offset * -32}deg)`,
                                                      md: `translate3d(${offset * 460}px, 0, 0) scale(0.72) rotateY(${offset * -32}deg)`,
                                                  },
                                                  zIndex: 4,
                                                  opacity: 0.55,
                                                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.12)',
                                              }),
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={brand.image}
                                        alt={brand.alt}
                                        loading="lazy"
                                        decoding="async"
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'center',
                                            display: 'block',
                                            pointerEvents: 'none',
                                            userSelect: 'none',
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
                            right: { xs: 6, sm: 16, md: 28, lg: 40 },
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 30,
                            bgcolor: '#ffffff',
                            color: '#0f172a',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                            width: { xs: 40, sm: 46 },
                            height: { xs: 40, sm: 46 },
                            transition: 'transform 0.18s ease, border-color 0.18s ease, color 0.18s ease',
                            '&:hover': {
                                bgcolor: '#ffffff',
                                color: '#0066ee',
                                borderColor: '#0066ee',
                                transform: 'translateY(-50%) scale(1.08)',
                                boxShadow: '0 6px 20px rgba(0, 102, 238, 0.22)',
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
                        mt: { xs: 3.5, sm: 4.5, md: 5 },
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
                                    transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease',
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
