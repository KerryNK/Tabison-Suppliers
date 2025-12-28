import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
    Alert,
    Tabs,
    Tab,
    Menu,
    MenuItem,
} from '@mui/material';
import { Visibility, MoreVert, Email, Delete, Refresh } from '@mui/icons-material';
import { useApi } from '../../api/client';

interface Message {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'responded';
    createdAt: string;
}

const MessagesPage: React.FC = () => {
    const api = useApi();
    const [messages, setMessages] = useState<Message[]>([]);
    const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuMessageId, setMenuMessageId] = useState<string | null>(null);

    const fetchMessages = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/contact');
            const messagesData = response.data || response;
            setMessages(messagesData);
            setFilteredMessages(messagesData);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch messages');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {
        if (statusFilter === 'All') {
            setFilteredMessages(messages);
        } else {
            setFilteredMessages(messages.filter(m => m.status === statusFilter));
        }
    }, [statusFilter, messages]);

    const handleStatusChange = async (messageId: string, newStatus: string) => {
        try {
            await api.patch(`/contact/${messageId}`, { status: newStatus });
            setMessages(messages.map(m =>
                m._id === messageId ? { ...m, status: newStatus as Message['status'] } : m
            ));
        } catch (err: any) {
            alert('Failed to update status: ' + err.message);
        }
    };

    const handleDelete = async (messageId: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            await api.delete(`/contact/${messageId}`);
            setMessages(messages.filter(m => m._id !== messageId));
            handleCloseMenu();
        } catch (err: any) {
            alert('Failed to delete message: ' + err.message);
        }
    };

    const handleViewDetails = (message: Message) => {
        setSelectedMessage(message);
        setDetailsOpen(true);
        // Mark as read when viewing
        if (message.status === 'new') {
            handleStatusChange(message._id, 'read');
        }
    };

    const handleReply = (email: string, subject: string) => {
        window.location.href = `mailto:${email}?subject=Re: ${encodeURIComponent(subject)}`;
    };

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, messageId: string) => {
        setAnchorEl(event.currentTarget);
        setMenuMessageId(messageId);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setMenuMessageId(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'error';
            case 'read': return 'warning';
            case 'responded': return 'success';
            default: return 'default';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">
                    Contact Messages
                </Typography>
                <IconButton onClick={fetchMessages} color="primary">
                    <Refresh />
                </IconButton>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={statusFilter}
                    onChange={(_, newValue) => setStatusFilter(newValue)}
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label={`All (${messages.length})`} value="All" />
                    <Tab label={`New (${messages.filter(m => m.status === 'new').length})`} value="new" />
                    <Tab label={`Read (${messages.filter(m => m.status === 'read').length})`} value="read" />
                    <Tab label={`Responded (${messages.filter(m => m.status === 'responded').length})`} value="responded" />
                </Tabs>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Date</strong></TableCell>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Subject</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredMessages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Typography color="text.secondary" py={4}>
                                        No messages found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredMessages.map((message) => (
                                <TableRow
                                    key={message._id}
                                    hover
                                    sx={{
                                        backgroundColor: message.status === 'new' ? 'action.hover' : 'inherit',
                                        fontWeight: message.status === 'new' ? 'bold' : 'normal'
                                    }}
                                >
                                    <TableCell>{formatDate(message.createdAt)}</TableCell>
                                    <TableCell>{message.name}</TableCell>
                                    <TableCell>{message.email}</TableCell>
                                    <TableCell>{message.subject}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={message.status.toUpperCase()}
                                            color={getStatusColor(message.status) as any}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => handleViewDetails(message)}
                                        >
                                            <Visibility />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleOpenMenu(e, message._id)}
                                        >
                                            <MoreVert />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
            >
                <MenuItem onClick={() => {
                    const msg = messages.find(m => m._id === menuMessageId);
                    if (msg) {
                        handleStatusChange(menuMessageId!, 'read');
                        handleCloseMenu();
                    }
                }}>
                    Mark as Read
                </MenuItem>
                <MenuItem onClick={() => {
                    const msg = messages.find(m => m._id === menuMessageId);
                    if (msg) {
                        handleStatusChange(menuMessageId!, 'responded');
                        handleCloseMenu();
                    }
                }}>
                    Mark as Responded
                </MenuItem>
                <MenuItem onClick={() => {
                    const msg = messages.find(m => m._id === menuMessageId);
                    if (msg) {
                        handleReply(msg.email, msg.subject);
                        handleCloseMenu();
                    }
                }}>
                    <Email sx={{ mr: 1 }} fontSize="small" />
                    Reply via Email
                </MenuItem>
                <MenuItem
                    onClick={() => menuMessageId && handleDelete(menuMessageId)}
                    sx={{ color: 'error.main' }}
                >
                    <Delete sx={{ mr: 1 }} fontSize="small" />
                    Delete
                </MenuItem>
            </Menu>

            {/* Details Dialog */}
            <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Message Details</DialogTitle>
                <DialogContent>
                    {selectedMessage && (
                        <Box sx={{ pt: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                            <Typography variant="body1" mb={2}>{formatDate(selectedMessage.createdAt)}</Typography>

                            <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                            <Typography variant="body1" mb={2}>{selectedMessage.name}</Typography>

                            <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                            <Typography variant="body1" mb={2}>{selectedMessage.email}</Typography>

                            {selectedMessage.phone && (
                                <>
                                    <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                                    <Typography variant="body1" mb={2}>{selectedMessage.phone}</Typography>
                                </>
                            )}

                            <Typography variant="subtitle2" color="text.secondary">Subject</Typography>
                            <Typography variant="body1" mb={2}>{selectedMessage.subject}</Typography>

                            <Typography variant="subtitle2" color="text.secondary">Message</Typography>
                            <Paper variant="outlined" sx={{ p: 2, mb: 2, backgroundColor: 'grey.50' }}>
                                <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                                    {selectedMessage.message}
                                </Typography>
                            </Paper>

                            <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                            <Chip
                                label={selectedMessage.status.toUpperCase()}
                                color={getStatusColor(selectedMessage.status) as any}
                                size="small"
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailsOpen(false)}>Close</Button>
                    {selectedMessage && (
                        <Button
                            variant="contained"
                            startIcon={<Email />}
                            onClick={() => handleReply(selectedMessage.email, selectedMessage.subject)}
                        >
                            Reply
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MessagesPage;
