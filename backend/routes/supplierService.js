import Supplier from '../models/Supplier.js';

export const findSuppliers = async (filters, user) => {
    const { 
        search, 
        category, 
        location, 
        verified, 
        minRating, 
        status = 'Active',
        page = 1, 
        limit = 12,
        sortBy = 'rating',
        sortOrder = 'desc'
    } = filters;

    const queryFilters = {
        category,
        location,
        verified: verified === 'true' ? true : verified === 'false' ? false : undefined,
        minRating: minRating ? parseFloat(minRating) : undefined
    };

    let query = Supplier.search(search, queryFilters);
    
    if (user?.role !== 'admin') {
        query = query.where({ status: 'Active' });
    } else if (status !== 'all') {
        query = query.where({ status });
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    query = query.sort(sortOptions);

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const suppliers = await query.skip(skip).limit(parseInt(limit, 10));
    
    const totalQuery = Supplier.search(search, queryFilters);
    if (user?.role !== 'admin') {
        totalQuery.where({ status: 'Active' });
    } else if (status !== 'all') {
        totalQuery.where({ status });
    }
    const total = await totalQuery.countDocuments();

    return { suppliers, total };
};

export const findSupplierById = async (id) => {
    const supplier = await Supplier.findById(id);
    if (supplier) {
        // Increment profile views (don't await to avoid slowing response)
        Supplier.findByIdAndUpdate(id, { 
            $inc: { profileViews: 1 },
            lastActive: new Date()
        }).exec();
    }
    return supplier;
};

export const createSupplier = async (supplierData) => {
    const existingSupplier = await Supplier.findOne({ email: supplierData.email });
    if (existingSupplier) {
        const error = new Error('A supplier with this email already exists');
        error.statusCode = 409;
        throw error;
    }

    const newSupplierData = {
        ...supplierData,
        status: 'Pending',
        verified: false,
        rating: 0,
        reviewCount: 0,
        totalRatings: 0,
        profileViews: 0
    };

    const supplier = new Supplier(newSupplierData);
    await supplier.save();
    return supplier;
};

export const updateSupplier = async (id, updateData, user) => {
    const supplier = await Supplier.findById(id);
    if (!supplier) {
        return null;
    }

    if (user.role !== 'admin' && supplier.email !== user.email) {
        const error = new Error('You can only update your own supplier profile');
        error.statusCode = 403;
        throw error;
    }

    const restrictedFields = ['status', 'verified', 'verificationDate', 'approvedBy', 'approvedAt', 'rating', 'reviewCount', 'totalRatings'];
    if (user.role !== 'admin') {
        restrictedFields.forEach(field => {
            if (updateData[field] !== undefined) {
                delete updateData[field];
            }
        });
    }

    return await Supplier.findByIdAndUpdate(
        id, 
        { ...updateData, lastActive: new Date() }, 
        { new: true, runValidators: true }
    );
};

export const updateSupplierStatus = async (id, status, rejectionReason, adminUserId) => {
    const updateData = { status, lastActive: new Date() };

    if (status === 'Active') {
        updateData.verified = true;
        updateData.verificationDate = new Date();
        updateData.approvedBy = adminUserId;
        updateData.approvedAt = new Date();
        updateData.rejectionReason = undefined;
    } else if (status === 'Inactive' && rejectionReason) {
        updateData.rejectionReason = rejectionReason;
        updateData.verified = false;
    }

    return await Supplier.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    );
};

export const deleteSupplier = async (id) => {
    return await Supplier.findByIdAndDelete(id);
};

export const getDashboardStats = async () => {
    const stats = await Promise.all([
        Supplier.countDocuments({ status: 'Pending' }),
        Supplier.countDocuments({ status: 'Active' }),
        Supplier.countDocuments({ status: 'Inactive' }),
        Supplier.countDocuments({ status: 'Suspended' }),
        Supplier.countDocuments({ verified: true }),
        Supplier.countDocuments({ verified: false }),
        Supplier.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]),
        Supplier.aggregate([
            { $group: { _id: '$city', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ])
    ]);

    return {
        statusCounts: {
            pending: stats[0], active: stats[1], inactive: stats[2], suspended: stats[3]
        },
        verificationCounts: {
            verified: stats[4], unverified: stats[5]
        },
        categoryDistribution: stats[6],
        topCities: stats[7]
    };
};
