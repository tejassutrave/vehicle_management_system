const express = require('express');
const router = express.Router();
const {
    getAllTrips,
    getTrip,
    createTrip,
    updateTrip,
    addTripLocation,
    completeTrip,
    deleteTrip
} = require('../controllers/tripController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router
    .route('/')
    .get(getAllTrips)
    .post(authorize('driver', 'owner', 'manager'), createTrip);

router
    .route('/:id')
    .get(getTrip)
    .put(updateTrip)
    .delete(authorize('owner'), deleteTrip);

router.post('/:id/location', authorize('driver'), addTripLocation);
router.put('/:id/complete', authorize('driver', 'owner'), completeTrip);

module.exports = router;
