const mongoose = require('mongoose');
require('dotenv').config();

async function fixDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Drop the vehicles collection completely
        try {
            await mongoose.connection.db.dropCollection('vehicles');
            console.log('✅ Dropped vehicles collection (with old index)');
        } catch (err) {
            console.log('⚠️  Vehicles collection does not exist (OK)');
        }

        // Drop users collection
        try {
            await mongoose.connection.db.dropCollection('users');
            console.log('✅ Dropped users collection');
        } catch (err) {
            console.log('⚠️  Users collection does not exist (OK)');
        }

        // Drop trips collection
        try {
            await mongoose.connection.db.dropCollection('trips');
            console.log('✅ Dropped trips collection');
        } catch (err) {
            console.log('⚠️  Trips collection does not exist (OK)');
        }

        console.log('');
        console.log('✨ Database cleaned successfully!');
        console.log('Now run: node seed.js');

        await mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

fixDatabase();
