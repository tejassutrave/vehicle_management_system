const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    vehicleNumber: {
        type: String,
        required: [true, 'Please provide vehicle number'],
        unique: true,
        uppercase: true,
        trim: true
    },
    model: {
        type: String,
        required: [true, 'Please provide vehicle model']
    },
    type: {
        type: String,
        required: [true, 'Please provide vehicle type'],
        enum: ['car', 'truck', 'van', 'motorcycle', 'bus', 'other']
    },
    year: {
        type: Number,
        min: 1900,
        max: new Date().getFullYear() + 1
    },
    color: String,
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'maintenance'],
        default: 'active'
    },
    currentLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        },
        address: String,
        speed: {
            type: Number,
            default: 0
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create geospatial index for location-based queries
vehicleSchema.index({ 'currentLocation.coordinates': '2dsphere' });

module.exports = mongoose.model('Vehicle', vehicleSchema);
