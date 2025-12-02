const Vehicle = require('../models/Vehicle');

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Private
exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find()
            .populate('driver', 'name email')
            .populate('createdBy', 'name email')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: vehicles.length,
            data: vehicles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Private
exports.getVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id)
            .populate('driver', 'name email')
            .populate('createdBy', 'name email');

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        res.status(200).json({
            success: true,
            data: vehicle
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create vehicle
// @route   POST /api/vehicles
// @access  Private (Driver, Manager, Owner)
exports.createVehicle = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;

        const vehicle = await Vehicle.create(req.body);

        res.status(201).json({
            success: true,
            data: vehicle
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private (Owner, Manager)
exports.updateVehicle = async (req, res) => {
    try {
        let vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: vehicle
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private (Owner)
exports.deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        await vehicle.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Vehicle deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update vehicle location
// @route   PUT /api/vehicles/:id/location
// @access  Private (Driver of that vehicle)
exports.updateLocation = async (req, res) => {
    try {
        const { latitude, longitude, speed, address } = req.body;

        let vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        // Check if user is the driver of this vehicle
        if (req.user.role === 'driver' && vehicle.driver.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this vehicle location'
            });
        }

        vehicle.currentLocation = {
            type: 'Point',
            coordinates: [longitude, latitude],
            address: address || vehicle.currentLocation.address,
            speed: speed || 0,
            lastUpdated: Date.now()
        };

        await vehicle.save();

        res.status(200).json({
            success: true,
            data: vehicle
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get vehicles by driver
// @route   GET /api/vehicles/driver/:driverId
// @access  Private
exports.getVehiclesByDriver = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ driver: req.params.driverId })
            .populate('driver', 'name email')
            .populate('createdBy', 'name email');

        res.status(200).json({
            success: true,
            count: vehicles.length,
            data: vehicles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
