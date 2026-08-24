import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useMemo  } from 'react';
import type {ReactNode} from 'react';
import { useAppearance } from '@/hooks/use-appearance';

export function CapsurMuiThemeProvider({ children }: { children: ReactNode }) {
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    const theme = useMemo(() => {
        return createTheme({
            palette: {
                mode: isDark ? 'dark' : 'light',
                primary: {
                    main: '#0c43a3',
                    light: '#54d8ee',
                    dark: '#152844',
                    contrastText: '#ffffff',
                },
                secondary: {
                    main: '#152844',
                    light: '#0c43a3',
                    dark: '#0a1526',
                    contrastText: '#ffffff',
                },
                background: {
                    default: isDark ? '#0b1626' : '#f7f7f7',
                    paper: isDark ? '#152844' : '#ffffff',
                },
                text: {
                    primary: isDark ? '#f7f7f7' : '#152844',
                    secondary: isDark ? '#9ca3af' : '#7f7f7f',
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
                borderRadius: 10,
            },
            components: {
                MuiButton: {
                    styleOverrides: {
                        root: {
                            borderRadius: 8,
                            padding: '6px 16px',
                            boxShadow: 'none',
                            '&:hover': {
                                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                            },
                        },
                    },
                },
                MuiCard: {
                    styleOverrides: {
                        root: {
                            borderRadius: 12,
                            boxShadow: isDark
                                ? '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)'
                                : '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
                        },
                    },
                },
                MuiDialog: {
                    styleOverrides: {
                        paper: {
                            borderRadius: 16,
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
