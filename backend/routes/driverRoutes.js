const express = require('express');
const router = express.Router();
const {
    getAllDrivers,
    getDriver,
    createDriver,
    updateDriver,
    deleteDriver
} = require('../controllers/driverController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('owner', 'manager'));

router
    .route('/')
    .get(getAllDrivers)
    .post(createDriver);

router
    .route('/:id')
    .get(getDriver)
    .put(authorize('owner'), updateDriver)
    .delete(authorize('owner'), deleteDriver);

module.exports = router;
