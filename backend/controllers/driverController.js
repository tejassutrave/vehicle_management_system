const User = require('../models/User');

// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Private (Manager, Owner)
exports.getAllDrivers = async (req, res) => {
    try {
        const drivers = await User.find({ role: 'driver' }).select('-password');

        res.status(200).json({
            success: true,
            count: drivers.length,
            data: drivers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single driver
// @route   GET /api/drivers/:id
// @access  Private (Manager, Owner)
exports.getDriver = async (req, res) => {
    try {
        const driver = await User.findById(req.params.id).select('-password');

        if (!driver || driver.role !== 'driver') {
            return res.status(404).json({
                success: false,
                message: 'Driver not found'
            });
        }

        res.status(200).json({
            success: true,
            data: driver
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create driver
// @route   POST /api/drivers
// @access  Private (Owner, Manager)
exports.createDriver = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create driver
        const driver = await User.create({
            name,
            email,
            password,
            role: 'driver'
        });

        // Remove password from response
        driver.password = undefined;

        res.status(201).json({
            success: true,
            data: driver
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update driver
// @route   PUT /api/drivers/:id
// @access  Private (Owner)
exports.updateDriver = async (req, res) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            email: req.body.email
        };

        const driver = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        }).select('-password');

        if (!driver) {
            return res.status(404).json({
                success: false,
                message: 'Driver not found'
            });
        }

        res.status(200).json({
            success: true,
            data: driver
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete driver
// @route   DELETE /api/drivers/:id
// @access  Private (Owner)
exports.deleteDriver = async (req, res) => {
    try {
        const driver = await User.findById(req.params.id);

        if (!driver || driver.role !== 'driver') {
            return res.status(404).json({
                success: false,
                message: 'Driver not found'
            });
        }

        await driver.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Driver deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
