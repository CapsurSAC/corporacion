import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { Box, Dialog, Fab, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import { ChatInterface, type ChatInterfaceProps } from '@/components/capacitado/chat-interface';

export function FloatingChat(props: ChatInterfaceProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Tooltip title="Abrir asistente virtual" placement="left">
                <Fab
                    color="primary"
                    aria-label={`Abrir asistente de ${props.areaTitle}`}
                    onClick={() => setOpen(true)}
                    sx={{
                        position: 'fixed',
                        right: { xs: 18, sm: 28 },
                        bottom: { xs: 18, sm: 28 },
                        zIndex: (theme) => theme.zIndex.fab,
                        bgcolor: props.color,
                        color: '#fff',
                        boxShadow: 'none',
                        '&:hover': { bgcolor: props.color, filter: 'brightness(0.92)' },
                    }}
                >
                    <SmartToyIcon />
                </Fab>
            </Tooltip>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="md"
                fullScreen={false}
                slotProps={{
                    paper: {
                        sx: {
                            m: { xs: 1, sm: 2 },
                            width: { xs: 'calc(100% - 16px)', sm: 'min(760px, calc(100% - 32px))' },
                            maxHeight: { xs: 'calc(100% - 16px)', sm: 'calc(100% - 32px)' },
                            overflow: 'hidden',
                            border: 0,
                            boxShadow: 'none',
                        },
                    },
                }}
            >
                <Box sx={{ position: 'relative', overflow: 'auto' }}>
                    <IconButton
                        aria-label="Cerrar asistente virtual"
                        onClick={() => setOpen(false)}
                        sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <ChatInterface {...props} />
                </Box>
            </Dialog>
        </>
    );
}
