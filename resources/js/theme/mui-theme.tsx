import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import type { ReactNode } from 'react';

export const capsurTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'class',
    },
    colorSchemes: {
        light: {
            palette: {
                primary: {
                    main: '#0c43a3',
                    light: '#54d8ee',
                    dark: '#152844',
                    contrastText: '#ffffff',
                },
                secondary: {
                    main: '#152844',
                    light: '#cbd5e1',
                    dark: '#0a1526',
                    contrastText: '#ffffff',
                },
                background: {
                    default: '#f7f7f7',
                    paper: '#ffffff',
                },
                text: {
                    primary: '#0f172a',
                    secondary: '#64748b',
                },
                divider: '#e2e8f0',
                action: {
                    hover: 'rgba(0, 0, 0, 0.03)',
                    selected: 'rgba(12, 67, 163, 0.08)',
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
        },
        dark: {
            palette: {
                primary: {
                    main: '#38bdf8',
                    light: '#54d8ee',
                    dark: '#0284c7',
                    contrastText: '#ffffff',
                },
                secondary: {
                    main: '#94a3b8',
                    light: '#cbd5e1',
                    dark: '#0a1526',
                    contrastText: '#ffffff',
                },
                background: {
                    default: '#0b1626',
                    paper: '#152844',
                },
                text: {
                    primary: '#f8fafc',
                    secondary: '#94a3b8',
                },
                divider: 'rgba(255, 255, 255, 0.08)',
                action: {
                    hover: 'rgba(255, 255, 255, 0.04)',
                    selected: 'rgba(56, 189, 248, 0.15)',
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
                root: ({ theme }) => ({
                    borderRadius: 6,
                    backgroundColor: theme.vars.palette.background.paper,
                    borderColor: theme.vars.palette.divider,
                    color: theme.vars.palette.text.primary,
                }),
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: theme.vars.palette.background.paper,
                    color: theme.vars.palette.text.primary,
                }),
                rounded: {
                    borderRadius: 6,
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: theme.vars.palette.background.paper,
                    '& .MuiTab-root': {
                        color: theme.vars.palette.text.secondary,
                        '&.Mui-selected': {
                            color: theme.vars.palette.primary.main,
                        },
                    },
                }),
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: 'var(--mui-palette-action-hover) !important',
                },
            },
        },
        MuiTableContainer: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: `${theme.vars.palette.background.paper} !important`,
                    color: theme.vars.palette.text.primary,
                }),
            },
        },
        MuiTable: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: `${theme.vars.palette.background.paper} !important`,
                }),
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: ({ theme }) => ({
                    color: theme.vars.palette.text.primary,
                    borderColor: theme.vars.palette.divider,
                }),
                head: ({ theme }) => ({
                    color: theme.vars.palette.text.primary,
                    fontWeight: 800,
                }),
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: ({ theme }) => ({
                    color: theme.vars.palette.text.primary,
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.vars.palette.divider,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.vars.palette.text.secondary,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.vars.palette.primary.main,
                    },
                }),
                input: ({ theme }) => ({
                    color: theme.vars.palette.text.primary,
                }),
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: ({ theme }) => ({
                    color: theme.vars.palette.text.secondary,
                    '&.Mui-focused': {
                        color: theme.vars.palette.primary.main,
                    },
                }),
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: ({ theme }) => ({
                    color: theme.vars.palette.text.primary,
                }),
                icon: ({ theme }) => ({
                    color: theme.vars.palette.text.secondary,
                }),
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: ({ theme }) => ({
                    backgroundColor: `${theme.vars.palette.background.paper} !important`,
                    color: `${theme.vars.palette.text.primary} !important`,
                    border: `1px solid ${theme.vars.palette.divider}`,
                }),
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: ({ theme }) => ({
                    color: theme.vars.palette.text.primary,
                    '&:hover': {
                        backgroundColor: theme.vars.palette.action.hover,
                    },
                    '&.Mui-selected': {
                        backgroundColor: theme.vars.palette.action.selected,
                    },
                }),
            },
        },
        MuiPopover: {
            styleOverrides: {
                paper: ({ theme }) => ({
                    backgroundColor: `${theme.vars.palette.background.paper} !important`,
                    color: `${theme.vars.palette.text.primary} !important`,
                    border: `1px solid ${theme.vars.palette.divider}`,
                }),
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
                paper: ({ theme }) => ({
                    borderRadius: 8,
                    backgroundColor: `${theme.vars.palette.background.paper} !important`,
                    color: `${theme.vars.palette.text.primary} !important`,
                    border: `1px solid ${theme.vars.palette.divider}`,
                }),
            },
        },
    },
});

export function CapsurMuiThemeProvider({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider theme={capsurTheme} defaultMode="light" modeStorageKey="appearance">
            <CssBaseline enableColorScheme />
            {children}
        </ThemeProvider>
    );
}
