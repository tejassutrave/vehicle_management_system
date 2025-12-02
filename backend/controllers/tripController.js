const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');

// @desc    Get all trips
// @route   GET /api/trips
// @access  Private
exports.getAllTrips = async (req, res) => {
    try {
        let query = {};

        // If driver, only show their trips
        if (req.user.role === 'driver') {
            query.driver = req.user.id;
        }

        const trips = await Trip.find(query)
            .populate('vehicle', 'vehicleNumber model type')
            .populate('driver', 'name email')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: trips.length,
            data: trips
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single trip
// @route   GET /api/trips/:id
// @access  Private
exports.getTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id)
            .populate('vehicle', 'vehicleNumber model type')
            .populate('driver', 'name email');

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found'
            });
        }

        res.status(200).json({
            success: true,
            data: trip
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create trip
// @route   POST /api/trips
// @access  Private (Driver)
exports.createTrip = async (req, res) => {
    try {
        const { vehicle, startLocation, purpose, notes } = req.body;

        // Check if vehicle exists
        const vehicleDoc = await Vehicle.findById(vehicle);
        if (!vehicleDoc) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        // Check if driver is assigned to this vehicle
        if (req.user.role === 'driver' && vehicleDoc.driver.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You are not assigned to this vehicle'
            });
        }

        const trip = await Trip.create({
            vehicle,
            driver: req.user.id,
            startLocation,
            purpose,
            notes
        });

        res.status(201).json({
            success: true,
            data: trip
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update trip
// @route   PUT /api/trips/:id
// @access  Private
exports.updateTrip = async (req, res) => {
    try {
        let trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found'
            });
        }

        // Check authorization
        if (req.user.role === 'driver' && trip.driver.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this trip'
            });
        }

        trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: trip
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Add location to trip route
// @route   POST /api/trips/:id/location
// @access  Private (Driver)
exports.addTripLocation = async (req, res) => {
    try {
        const { latitude, longitude, speed } = req.body;

        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found'
            });
        }

        // Check if user is the driver of this trip
        if (trip.driver.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        trip.route.push({
            coordinates: [longitude, latitude],
            timestamp: Date.now(),
            speed: speed || 0
        });

        await trip.save();

        res.status(200).json({
            success: true,
            data: trip
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Complete trip
// @route   PUT /api/trips/:id/complete
// @access  Private (Driver)
exports.completeTrip = async (req, res) => {
    try {
        const { endLocation, distance } = req.body;

        let trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found'
            });
        }

        if (trip.driver.toString() !== req.user.id && req.user.role !== 'owner') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        trip.endLocation = endLocation;
        trip.endTime = Date.now();
        trip.status = 'completed';
        trip.distance = distance || trip.distance;

        await trip.save();

        res.status(200).json({
            success: true,
            data: trip
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Private (Owner)
exports.deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found'
            });
        }

        await trip.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Trip deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
