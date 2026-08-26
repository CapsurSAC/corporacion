import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    CircularProgress,
    Box,
} from '@mui/material';

interface DeleteConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    onConfirm: () => void;
    processing?: boolean;
}

export function DeleteConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    onConfirm,
    processing = false,
}: DeleteConfirmDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={() => onOpenChange(false)}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 38,
                        height: 38,
                        borderRadius: 1,
                        bgcolor: 'error.main',
                        color: 'white',
                    }}
                >
                    <WarningAmberIcon fontSize="small" />
                </Box>
                <span>{title}</span>
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ fontSize: '0.875rem' }}>
                    {description}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
                <Button
                    onClick={() => onOpenChange(false)}
                    disabled={processing}
                    variant="outlined"
                    color="inherit"
                >
                    Cancelar
                </Button>
                <Button
                    onClick={onConfirm}
                    disabled={processing}
                    variant="contained"
                    color="error"
                    startIcon={processing ? <CircularProgress size={16} color="inherit" /> : null}
                >
                    Confirmar Eliminación
                </Button>
            </DialogActions>
        </Dialog>
    );
}
