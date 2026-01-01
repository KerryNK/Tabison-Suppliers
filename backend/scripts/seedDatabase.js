import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const products = [
    {
        name: 'Military Combat Boots - Long (22cm, 8 Inches)',
        sku: 'MIL-LONG-PVC-10',
        description: 'High-quality military combat boots with PVC material and 10 eyelets. Perfect for military applications and professional use.',
        category: 'Military Footwear',
        brand: 'Tabison Suppliers',
        image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500',
        images: [
            'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500',
            'https://images.unsplash.com/photo-1542840410-3092f99611a3?w=500'
        ],
        pricing: {
            wholesale: 1800,
            retail: 2000,
            factoryPrice: '1700-1800'
        },
        countInStock: 150,
        features: [
            'PVC Material',
            '10 Eyelets',
            '22cm Height (8 Inches)',
            'Durable Construction',
            'Professional Grade'
        ]
    },
    {
        name: 'Military Combat Boots - Long Rubber (22cm, 8 Inches)',
        sku: 'MIL-LONG-RUB-10',
        description: 'Premium military combat boots with rubber material and 10 eyelets. Enhanced durability and comfort for extended use.',
        category: 'Military Footwear',
        brand: 'Tabison Suppliers',
        image: 'https://images.unsplash.com/photo-1542840410-3092f99611a3?w=500',
        images: [
            'https://images.unsplash.com/photo-1542840410-3092f99611a3?w=500',
            'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500'
        ],
        pricing: {
            wholesale: 2000,
            retail: 2200,
            factoryPrice: '1900-2000'
        },
        countInStock: 120,
        features: [
            'Rubber Material',
            '10 Eyelets',
            '22cm Height (8 Inches)',
            'Water Resistant',
            'Anti-Slip Sole'
        ]
    },
    {
        name: 'Safety Work Boots - Industrial Grade',
        sku: 'SAFE-IND-001',
        description: 'Industrial safety boots with steel toe protection. Ideal for construction, manufacturing, and industrial environments.',
        category: 'Safety Footwear',
        brand: 'Tabison Suppliers',
        image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500',
        images: [
            'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500',
            'https://images.unsplash.com/photo-1605408499391-6368c628ef42?w=500'
        ],
        pricing: {
            wholesale: 2100,
            retail: 2500,
            factoryPrice: '1500-1800'
        },
        countInStock: 200,
        features: [
            'Steel Toe Cap',
            'Oil Resistant Sole',
            'Electrical Hazard Protection',
            'Comfortable Fit',
            'CE Certified'
        ]
    },
    {
        name: 'Official Men Permanent Shine Shoes',
        sku: 'OFF-PERM-SHINE',
        description: 'Professional formal shoes with permanent shine finish. Perfect for official and formal occasions.',
        category: 'Official Footwear',
        brand: 'Tabison Suppliers',
        image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500',
        images: [
            'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500',
            'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500'
        ],
        pricing: {
            wholesale: 1800,
            retail: 2000,
            factoryPrice: '1250-1600'
        },
        countInStock: 180,
        features: [
            'Permanent Shine Finish',
            'Genuine Leather',
            'Comfortable Insole',
            'Professional Look',
            'Durable Construction'
        ]
    },
    {
        name: 'Military Boots - Short (14cm, 6 Inches) PVC',
        sku: 'MIL-SHORT-PVC-7',
        description: 'Short military boots with PVC material and 7 eyelets. Lightweight and durable for everyday military use.',
        category: 'Military Footwear',
        brand: 'Tabison Suppliers',
        image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500',
        images: [
            'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500'
        ],
        pricing: {
            wholesale: 1200,
            retail: 1300,
            factoryPrice: '1100-1200'
        },
        countInStock: 250,
        features: [
            'PVC Material',
            '7 Eyelets',
            '14cm Height (6 Inches)',
            'Lightweight',
            'Quick Dry'
        ]
    },
    {
        name: 'Military Boots - Short Rubber with Thread (14cm, 6 Inches)',
        sku: 'MIL-SHORT-RUB-THR-7',
        description: 'Short military boots with rubber material, thread reinforcement, and 7 eyelets. Enhanced durability and support.',
        category: 'Military Footwear',
        brand: 'Tabison Suppliers',
        image: 'https://images.unsplash.com/photo-1542840410-3092f99611a3?w=500',
        images: [
            'https://images.unsplash.com/photo-1542840410-3092f99611a3?w=500'
        ],
        pricing: {
            wholesale: 1450,
            retail: 1500,
            factoryPrice: '1400-1450'
        },
        countInStock: 200,
        features: [
            'Rubber Material',
            '7 Eyelets with Thread',
            '14cm Height (6 Inches)',
            'Reinforced Construction',
            'Extra Support'
        ]
    },
    {
        name: 'Military Boots - Folded Long PVC with Hooks (22cm)',
        sku: 'MIL-FOLD-PVC-HOOK',
        description: 'Folded long military boots with PVC material and hook closure system. Quick on/off design for convenience.',
        category: 'Military Footwear',
        brand: 'Tabison Suppliers',
        image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500',
        images: [
            'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500'
        ],
        pricing: {
            wholesale: 2200,
            retail: 2400,
            factoryPrice: '2100-2200'
        },
        countInStock: 100,
        features: [
            'PVC Material',
            'Hook Closure System',
            '22cm Folded Design',
            'Quick On/Off',
            'Adjustable Fit'
        ]
    },
    {
        name: 'Military Boots - Folded Long Rubber with Eyelets (22cm)',
        sku: 'MIL-FOLD-RUB-EYE',
        description: 'Folded long military boots with rubber material and eyelet system. Premium quality for professional use.',
        category: 'Military Footwear',
        brand: 'Tabison Suppliers',
        image: 'https://images.unsplash.com/photo-1542840410-3092f99611a3?w=500',
        images: [
            'https://images.unsplash.com/photo-1542840410-3092f99611a3?w=500'
        ],
        pricing: {
            wholesale: 2300,
            retail: 2500,
            factoryPrice: '2200-2300'
        },
        countInStock: 90,
        features: [
            'Rubber Material',
            'Eyelet System',
            '22cm Folded Design',
            'Premium Quality',
            'Professional Grade'
        ]
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected');

        // Clear existing products
        await Product.deleteMany({});
        console.log('🗑️  Cleared existing products');

        // Create admin user if doesn't exist
        let adminUser = await User.findOne({ email: 'admin@tabisonsuppliers.com' });

        if (!adminUser) {
            const hashedPassword = await bcrypt.hash('Admin@123', 12);
            adminUser = await User.create({
                name: 'Admin User',
                email: 'admin@tabisonsuppliers.com',
                phone: '+254700000000',
                password: hashedPassword,
                role: 'admin',
                isEmailVerified: true,
                isPhoneVerified: true
            });
            console.log('👤 Created admin user');
        }

        // Add user reference to products
        const productsWithUser = products.map(product => ({
            ...product,
            user: adminUser._id
        }));

        // Insert products
        await Product.insertMany(productsWithUser);
        console.log(`✅ Inserted ${products.length} products`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📋 Admin Credentials:');
        console.log('Email: admin@tabisonsuppliers.com');
        console.log('Password: Admin@123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
