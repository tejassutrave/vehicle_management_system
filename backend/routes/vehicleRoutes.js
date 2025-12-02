const express = require('express');
const router = express.Router();
const {
    getAllVehicles,
    getVehicle,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    updateLocation,
    getVehiclesByDriver
} = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router
    .route('/')
    .get(getAllVehicles)
    .post(createVehicle);

router
    .route('/:id')
    .get(getVehicle)
    .put(authorize('owner', 'manager'), updateVehicle)
    .delete(authorize('owner'), deleteVehicle);

router.put('/:id/location', updateLocation);
router.get('/driver/:driverId', getVehiclesByDriver);

module.exports = router;
