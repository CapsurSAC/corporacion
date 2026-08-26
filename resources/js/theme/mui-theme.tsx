import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useAppearance } from '@/hooks/use-appearance';

export function CapsurMuiThemeProvider({ children }: { children: ReactNode }) {
    const { resolvedAppearance } = useAppearance();

    // Sincronización robusta en tiempo real con la clase del DOM y hook de apariencia
    const [isDark, setIsDark] = useState<boolean>(() => {
        if (typeof document !== 'undefined') {
            return document.documentElement.classList.contains('dark') || resolvedAppearance === 'dark';
        }
        return resolvedAppearance === 'dark';
    });

    useEffect(() => {
        if (typeof document === 'undefined') return;

        const checkDark = () => {
            const hasDarkClass = document.documentElement.classList.contains('dark');
            setIsDark(hasDarkClass);
        };

        // Verificación inicial
        checkDark();

        // Observador de mutaciones en <html class="...">
        const observer = new MutationObserver(checkDark);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        // Escuchar cambios de preferencia del sistema
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        media.addEventListener('change', checkDark);

        return () => {
            observer.disconnect();
            media.removeEventListener('change', checkDark);
        };
    }, []);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            setIsDark(document.documentElement.classList.contains('dark') || resolvedAppearance === 'dark');
        }
    }, [resolvedAppearance]);

    const theme = useMemo(() => {
        return createTheme({
            palette: {
                mode: isDark ? 'dark' : 'light',
                primary: {
                    main: isDark ? '#38bdf8' : '#0c43a3',
                    light: '#54d8ee',
                    dark: isDark ? '#0284c7' : '#152844',
                    contrastText: '#ffffff',
                },
                secondary: {
                    main: isDark ? '#94a3b8' : '#152844',
                    light: '#cbd5e1',
                    dark: '#0a1526',
                    contrastText: '#ffffff',
                },
                background: {
                    default: isDark ? '#0b1626' : '#f7f7f7',
                    paper: isDark ? '#152844' : '#ffffff',
                },
                text: {
                    primary: isDark ? '#f8fafc' : '#0f172a',
                    secondary: isDark ? '#94a3b8' : '#64748b',
                },
                divider: isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0',
                action: {
                    hover: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
                    selected: isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(12, 67, 163, 0.08)',
                },
                info: {
                    main: '#54d8ee',
                    contrastText: '#152844',
                },
                success: {
                    main: '#16a34a',
                },
                error: {
                    main: '#dc2626',
                },
                warning: {
                    main: '#ca8a04',
                },
            },
            typography: {
                fontFamily: [
                    'Inter',
                    'Roboto',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Segoe UI"',
                    'Arial',
                    'sans-serif',
                ].join(','),
                button: {
                    textTransform: 'none',
                    fontWeight: 600,
                },
            },
            shape: {
                borderRadius: 4,
            },
            components: {
                MuiButton: {
                    styleOverrides: {
                        root: {
                            borderRadius: 4,
                            padding: '6px 14px',
                            boxShadow: 'none',
                            '&:hover': {
                                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                            },
                        },
                    },
                },
                MuiCard: {
                    styleOverrides: {
                        root: {
                            borderRadius: 6,
                            backgroundColor: isDark ? '#152844 !important' : '#ffffff !important',
                            borderColor: isDark ? 'rgba(255, 255, 255, 0.08) !important' : '#e2e8f0 !important',
                            color: isDark ? '#f8fafc !important' : '#0f172a !important',
                            boxShadow: isDark
                                ? '0 2px 10px rgba(0, 0, 0, 0.4)'
                                : '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
                        },
                    },
                },
                MuiPaper: {
                    styleOverrides: {
                        root: {
                            backgroundColor: isDark ? '#152844' : '#ffffff',
                            color: isDark ? '#f8fafc' : '#0f172a',
                        },
                        rounded: {
                            borderRadius: 6,
                        },
                    },
                },
                MuiTabs: {
                    styleOverrides: {
                        root: {
                            backgroundColor: isDark ? '#152844' : '#ffffff',
                            '& .MuiTab-root': {
                                color: isDark ? '#94a3b8' : '#64748b',
                                '&.Mui-selected': {
                                    color: isDark ? '#38bdf8' : '#0c43a3',
                                },
                            },
                        },
                    },
                },
                MuiTableHead: {
                    styleOverrides: {
                        root: {
                            backgroundColor: isDark ? '#0f1f38 !important' : '#f8fafc !important',
                        },
                    },
                },
                MuiTableCell: {
                    styleOverrides: {
                        root: {
                            color: isDark ? '#f8fafc' : '#0f172a',
                            borderColor: isDark ? 'rgba(255, 255, 255, 0.07)' : '#e2e8f0',
                        },
                        head: {
                            color: isDark ? '#cbd5e1 !important' : '#334155 !important',
                            fontWeight: 800,
                        },
                    },
                },
                MuiOutlinedInput: {
                    styleOverrides: {
                        root: {
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#ffffff',
                            color: isDark ? '#f8fafc' : '#0f172a',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#cbd5e1',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: isDark ? 'rgba(255, 255, 255, 0.25)' : '#94a3b8',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: isDark ? '#38bdf8' : '#0c43a3',
                            },
                        },
                        input: {
                            color: isDark ? '#f8fafc' : '#0f172a',
                        },
                    },
                },
                MuiInputLabel: {
                    styleOverrides: {
                        root: {
                            color: isDark ? '#94a3b8' : '#64748b',
                            '&.Mui-focused': {
                                color: isDark ? '#38bdf8' : '#0c43a3',
                            },
                        },
                    },
                },
                MuiSelect: {
                    styleOverrides: {
                        select: {
                            color: isDark ? '#f8fafc' : '#0f172a',
                        },
                        icon: {
                            color: isDark ? '#94a3b8' : '#64748b',
                        },
                    },
                },
                MuiMenu: {
                    styleOverrides: {
                        paper: {
                            backgroundColor: isDark ? '#152844 !important' : '#ffffff !important',
                            color: isDark ? '#f8fafc !important' : '#0f172a !important',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
                        },
                    },
                },
                MuiMenuItem: {
                    styleOverrides: {
                        root: {
                            color: isDark ? '#f8fafc' : '#0f172a',
                            '&:hover': {
                                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
                            },
                            '&.Mui-selected': {
                                backgroundColor: isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(12, 67, 163, 0.08)',
                            },
                        },
                    },
                },
                MuiPopover: {
                    styleOverrides: {
                        paper: {
                            backgroundColor: isDark ? '#152844 !important' : '#ffffff !important',
                            color: isDark ? '#f8fafc !important' : '#0f172a !important',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
                        },
                    },
                },
                MuiChip: {
                    styleOverrides: {
                        root: {
                            borderRadius: 4,
                        },
                    },
                },
                MuiDialog: {
                    styleOverrides: {
                        paper: {
                            borderRadius: 8,
                            backgroundColor: isDark ? '#152844 !important' : '#ffffff !important',
                            color: isDark ? '#f8fafc !important' : '#0f172a !important',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
                        },
                    },
                },
            },
        });
    }, [isDark]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            {children}
        </ThemeProvider>
    );
}
