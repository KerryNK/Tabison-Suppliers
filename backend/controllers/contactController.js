import Contact from '../models/contactModel.js';

// Submit contact form
export const submitContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields (name, email, subject, message)',
            });
        }

        // Create contact message
        const contact = await Contact.create({
            name,
            email,
            phone,
            subject,
            message,
            status: 'new',
        });

        res.status(201).json({
            success: true,
            message: 'Contact message sent successfully',
            data: contact,
        });
    } catch (error) {
        console.error('Submit contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message',
            error: error.message,
        });
    }
};

// Get all contact messages (admin only)
export const listContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({}).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch messages',
            error: error.message,
        });
    }
};

// Update contact status
export const updateContactStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['new', 'read', 'responded'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be: new, read, or responded',
            });
        }

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found',
            });
        }

        res.json({
            success: true,
            data: contact,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update status',
            error: error.message,
        });
    }
};

// Delete contact message
export const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found',
            });
        }

        res.json({
            success: true,
            message: 'Contact message deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete message',
            error: error.message,
        });
    }
};
