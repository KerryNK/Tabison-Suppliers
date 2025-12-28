import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import User from '../models/User.js';

export const getDashboardStats = async (req, res) => {
    try {
        // Get total products count
        const totalProducts = await Product.countDocuments();

        // Get total orders count
        const totalOrders = await Order.countDocuments();

        // Get total users count
        const totalUsers = await User.countDocuments();

        // Calculate total revenue from completed orders
        const revenueData = await Order.aggregate([
            { $match: { status: { $in: ['delivered', 'completed'] } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

        // Get recent orders for activity feed
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name email')
            .select('orderNumber status totalAmount createdAt');

        // Calculate percentage changes (mock data for now - would need historical data)
        const stats = {
            totalProducts: {
                value: totalProducts,
                change: '+12%', // Mock percentage
                icon: '📦'
            },
            totalOrders: {
                value: totalOrders,
                change: '+8%', // Mock percentage
                icon: '📋'
            },
            totalUsers: {
                value: totalUsers,
                change: '+15%', // Mock percentage
                icon: '👥'
            },
            revenue: {
                value: `KES ${totalRevenue.toLocaleString()}`,
                change: '+23%', // Mock percentage
                icon: '💰'
            }
        };

        res.json({
            stats,
            recentActivity: recentOrders.map(order => ({
                type: 'order',
                message: `New order #${order.orderNumber} - KES ${order.totalAmount}`,
                time: getRelativeTime(order.createdAt),
                status: order.status
            }))
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
    }
};

// Helper function to get relative time
function getRelativeTime(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
}
