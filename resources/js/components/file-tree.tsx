import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { Box, IconButton, List, ListItem, ListItemIcon, ListItemText, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { WindowsFolderIcon } from '@/components/windows-folder-icon';

export type FileNode = {
    id: number;
    name: string;
    type: 'folder' | 'file';
    mime_type?: string | null;
    file_size?: number | null;
    download_url?: string | null;
    view_url?: string | null;
    children?: FileNode[];
};

const formatSize = (bytes?: number | null): string => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

function TreeNode({
    node,
    readOnly,
    selectedId,
    onDelete,
    onFolderSelect,
}: {
    node: FileNode;
    readOnly: boolean;
    selectedId?: number | null;
    onDelete?: (node: FileNode) => void;
    onFolderSelect?: (node: FileNode) => void;
}) {
    const [open, setOpen] = useState(false);
    const isFolder = node.type === 'folder';
    const isSelected = isFolder && selectedId === node.id;

    const handleClick = () => {
        if (!isFolder) {
            return;
        }

        onFolderSelect?.(node);
        // Un segundo clic sobre la carpeta ya seleccionada la pliega.
        setOpen(isSelected || !onFolderSelect ? !open : true);
    };

    return (
        <>
            <ListItem
                sx={{
                    pl: 1,
                    borderRadius: 1,
                    cursor: isFolder ? 'pointer' : 'default',
                    bgcolor: isSelected ? 'action.selected' : undefined,
                    outline: isSelected ? '1px solid' : undefined,
                    outlineColor: 'primary.main',
                    '&:hover': { bgcolor: isSelected ? 'action.selected' : 'action.hover' },
                }}
                secondaryAction={
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {!isFolder && node.download_url && (
                            <Tooltip title="Descargar">
                                <IconButton component="a" href={node.download_url} download size="small">
                                    <DownloadIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        {!isFolder && node.view_url && (
                            <Tooltip title="Abrir archivo">
                                <IconButton component="a" href={node.view_url} target="_blank" rel="noreferrer" size="small">
                                    <OpenInNewIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        {!readOnly && (
                            <Tooltip title="Eliminar">
                                <IconButton size="small" onClick={() => onDelete?.(node)} color="error">
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                }
                onClick={handleClick}
            >
                <ListItemIcon sx={{ minWidth: 38 }}>
                    {isFolder ? <WindowsFolderIcon color="primary" /> : <InsertDriveFileIcon color="action" />}
                </ListItemIcon>
                <ListItemText
                    primary={node.name}
                    secondary={isFolder ? `${node.children?.length ?? 0} elementos` : formatSize(node.file_size)}
                />
            </ListItem>
            {isFolder && open && (
                <List sx={{ pl: 4, pt: 0 }}>
                    {(node.children ?? []).map((child) => (
                        <TreeNode key={child.id} node={child} readOnly={readOnly} selectedId={selectedId} onDelete={onDelete} onFolderSelect={onFolderSelect} />
                    ))}
                    {node.children?.length === 0 && (
                        <Typography variant="caption" color="text.secondary" sx={{ pl: 2 }}>
                            Carpeta vacía
                        </Typography>
                    )}
                </List>
            )}
        </>
    );
}

export function FileTree({
    nodes,
    readOnly = false,
    selectedId,
    onDelete,
    onFolderSelect,
}: {
    nodes: FileNode[];
    readOnly?: boolean;
    selectedId?: number | null;
    onDelete?: (node: FileNode) => void;
    onFolderSelect?: (node: FileNode) => void;
}) {
    if (nodes.length === 0) {
        return <Typography color="text.secondary">Esta carpeta todavía no contiene archivos.</Typography>;
    }

    return (
        <List disablePadding>
            {nodes.map((node) => (
                <TreeNode key={node.id} node={node} readOnly={readOnly} selectedId={selectedId} onDelete={onDelete} onFolderSelect={onFolderSelect} />
            ))}
        </List>
    );
}
