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
    MenuItem,
    Select,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    CircularProgress,
    Alert,
    Tabs,
    Tab,
} from '@mui/material';
import { Visibility, Refresh } from '@mui/icons-material';
import { useApi } from '../../api/client';

interface Quote {
    _id: string;
    name: string;
    email: string;
    phone: string;
    company?: string;
    productType?: string;
    quantity?: number;
    message?: string;
    status: 'Pending' | 'Responded' | 'Closed';
    createdAt: string;
}

const QuotesPage: React.FC = () => {
    const api = useApi();
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('All');

    const fetchQuotes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/quotes');
            const quotesData = response.data || response;
            setQuotes(quotesData);
            setFilteredQuotes(quotesData);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch quotes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuotes();
    }, []);

    useEffect(() => {
        if (statusFilter === 'All') {
            setFilteredQuotes(quotes);
        } else {
            setFilteredQuotes(quotes.filter(q => q.status === statusFilter));
        }
    }, [statusFilter, quotes]);

    const handleStatusChange = async (quoteId: string, newStatus: string) => {
        try {
            await api.patch(`/quotes/${quoteId}`, { status: newStatus });
            // Update local state
            setQuotes(quotes.map(q =>
                q._id === quoteId ? { ...q, status: newStatus as Quote['status'] } : q
            ));
        } catch (err: any) {
            alert('Failed to update status: ' + err.message);
        }
    };

    const handleViewDetails = (quote: Quote) => {
        setSelectedQuote(quote);
        setDetailsOpen(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'warning';
            case 'Responded': return 'info';
            case 'Closed': return 'success';
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
                    Quote Requests
                </Typography>
                <IconButton onClick={fetchQuotes} color="primary">
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
                    <Tab label={`All (${quotes.length})`} value="All" />
                    <Tab label={`Pending (${quotes.filter(q => q.status === 'Pending').length})`} value="Pending" />
                    <Tab label={`Responded (${quotes.filter(q => q.status === 'Responded').length})`} value="Responded" />
                    <Tab label={`Closed (${quotes.filter(q => q.status === 'Closed').length})`} value="Closed" />
                </Tabs>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Date</strong></TableCell>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Phone</strong></TableCell>
                            <TableCell><strong>Product Type</strong></TableCell>
                            <TableCell><strong>Quantity</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredQuotes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography color="text.secondary" py={4}>
                                        No quote requests found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredQuotes.map((quote) => (
                                <TableRow key={quote._id} hover>
                                    <TableCell>{formatDate(quote.createdAt)}</TableCell>
                                    <TableCell>{quote.name}</TableCell>
                                    <TableCell>{quote.email}</TableCell>
                                    <TableCell>{quote.phone}</TableCell>
                                    <TableCell>{quote.productType || 'N/A'}</TableCell>
                                    <TableCell>{quote.quantity || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={quote.status}
                                            onChange={(e) => handleStatusChange(quote._id, e.target.value)}
                                            size="small"
                                            sx={{ minWidth: 120 }}
                                        >
                                            <MenuItem value="Pending">Pending</MenuItem>
                                            <MenuItem value="Responded">Responded</MenuItem>
                                            <MenuItem value="Closed">Closed</MenuItem>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => handleViewDetails(quote)}
                                        >
                                            <Visibility />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Details Dialog */}
            <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Quote Request Details</DialogTitle>
                <DialogContent>
                    {selectedQuote && (
                        <Box sx={{ pt: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                            <Typography variant="body1" mb={2}>{formatDate(selectedQuote.createdAt)}</Typography>

                            <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                            <Typography variant="body1" mb={2}>{selectedQuote.name}</Typography>

                            <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                            <Typography variant="body1" mb={2}>{selectedQuote.email}</Typography>

                            <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                            <Typography variant="body1" mb={2}>{selectedQuote.phone}</Typography>

                            {selectedQuote.company && (
                                <>
                                    <Typography variant="subtitle2" color="text.secondary">Company</Typography>
                                    <Typography variant="body1" mb={2}>{selectedQuote.company}</Typography>
                                </>
                            )}

                            <Typography variant="subtitle2" color="text.secondary">Product Type</Typography>
                            <Typography variant="body1" mb={2}>{selectedQuote.productType || 'N/A'}</Typography>

                            <Typography variant="subtitle2" color="text.secondary">Quantity</Typography>
                            <Typography variant="body1" mb={2}>{selectedQuote.quantity || 'N/A'}</Typography>

                            {selectedQuote.message && (
                                <>
                                    <Typography variant="subtitle2" color="text.secondary">Message</Typography>
                                    <Typography variant="body1" mb={2}>{selectedQuote.message}</Typography>
                                </>
                            )}

                            <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                            <Chip
                                label={selectedQuote.status}
                                color={getStatusColor(selectedQuote.status) as any}
                                size="small"
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailsOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default QuotesPage;
