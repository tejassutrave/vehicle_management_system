const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
const Trip = require('./models/Trip');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

const seedDatabase = async () => {
    try {
        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Vehicle.deleteMany({});
        await Trip.deleteMany({});

        // Create users
        console.log('👤 Creating users...');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const users = await User.create([
            {
                name: 'Fleet Owner',
                email: 'owner@fleet.com',
                password: hashedPassword,
                role: 'owner'
            },
            {
                name: 'Fleet Manager',
                email: 'manager@fleet.com',
                password: hashedPassword,
                role: 'manager'
            },
            {
                name: 'John Driver',
                email: 'driver@fleet.com',
                password: hashedPassword,
                role: 'driver'
            },
            {
                name: 'Sarah Driver',
                email: 'driver2@fleet.com',
                password: hashedPassword,
                role: 'driver'
            }
        ]);

        console.log(`✅ Created ${users.length} users`);

        const owner = users[0];
        const driver1 = users[2];
        const driver2 = users[3];

        // Create vehicles
        console.log('🚗 Creating vehicles...');

        const vehicles = await Vehicle.create([
            {
                vehicleNumber: 'MH-12-AB-1234',
                model: 'Toyota Fortuner',
                type: 'car',
                year: 2023,
                color: 'White',
                driver: driver1._id,
                status: 'active',
                currentLocation: {
                    type: 'Point',
                    coordinates: [77.5946, 12.9716], // Bangalore
                    address: 'Bangalore, Karnataka',
                    speed: 0,
                    lastUpdated: new Date()
                },
                createdBy: owner._id
            },
            {
                vehicleNumber: 'MH-12-CD-5678',
                model: 'Tata Ace',
                type: 'truck',
                year: 2022,
                color: 'Blue',
                driver: driver2._id,
                status: 'active',
                currentLocation: {
                    type: 'Point',
                    coordinates: [72.8777, 19.0760], // Mumbai
                    address: 'Mumbai, Maharashtra',
                    speed: 0,
                    lastUpdated: new Date()
                },
                createdBy: owner._id
            },
            {
                vehicleNumber: 'DL-01-EF-9012',
                model: 'Maruti Ertiga',
                type: 'van',
                year: 2021,
                color: 'Silver',
                status: 'inactive',
                currentLocation: {
                    type: 'Point',
                    coordinates: [77.2090, 28.6139], // Delhi
                    address: 'New Delhi',
                    speed: 0,
                    lastUpdated: new Date()
                },
                createdBy: owner._id
            },
            {
                vehicleNumber: 'KA-05-GH-3456',
                model: 'Ashok Leyland',
                type: 'truck',
                year: 2020,
                color: 'Red',
                status: 'maintenance',
                currentLocation: {
                    type: 'Point',
                    coordinates: [77.5946, 12.9716],
                    address: 'Bangalore, Karnataka',
                    speed: 0,
                    lastUpdated: new Date()
                },
                createdBy: owner._id
            },
            {
                vehicleNumber: 'TN-09-IJ-7890',
                model: 'Honda City',
                type: 'car',
                year: 2023,
                color: 'Black',
                status: 'active',
                currentLocation: {
                    type: 'Point',
                    coordinates: [80.2707, 13.0827], // Chennai
                    address: 'Chennai, Tamil Nadu',
                    speed: 0,
                    lastUpdated: new Date()
                },
                createdBy: owner._id
            }
        ]);

        console.log(`✅ Created ${vehicles.length} vehicles`);

        // Create trips
        console.log('🗺️  Creating trips...');

        const trips = await Trip.create([
            {
                vehicle: vehicles[0]._id,
                driver: driver1._id,
                startLocation: {
                    type: 'Point',
                    coordinates: [77.5946, 12.9716],
                    address: 'Bangalore Central'
                },
                endLocation: {
                    type: 'Point',
                    coordinates: [77.6033, 12.9698],
                    address: 'Whitefield, Bangalore'
                },
                startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
                status: 'completed',
                distance: 15.5,
                purpose: 'Customer delivery',
                notes: 'Delivered successfully'
            },
            {
                vehicle: vehicles[1]._id,
                driver: driver2._id,
                startLocation: {
                    type: 'Point',
                    coordinates: [72.8777, 19.0760],
                    address: 'Mumbai Central'
                },
                startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                status: 'ongoing',
                purpose: 'Warehouse pickup',
                notes: 'In transit'
            },
            {
                vehicle: vehicles[0]._id,
                driver: driver1._id,
                startLocation: {
                    type: 'Point',
                    coordinates: [77.5946, 12.9716],
                    address: 'Bangalore'
                },
                endLocation: {
                    type: 'Point',
                    coordinates: [77.7172, 13.3615],
                    address: 'Kolar'
                },
                startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                endTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
                status: 'completed',
                distance: 68.2,
                purpose: 'Inter-city delivery',
                notes: 'Long distance trip completed'
            }
        ]);

        console.log(`✅ Created ${trips.length} trips`);

        console.log('\n✨ Database seeded successfully!');
        console.log('\n📝 Demo Accounts:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Owner:    owner@fleet.com / password123');
        console.log('Manager:  manager@fleet.com / password123');
        console.log('Driver 1: driver@fleet.com / password123');
        console.log('Driver 2: driver2@fleet.com / password123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
