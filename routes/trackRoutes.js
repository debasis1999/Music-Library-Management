const express = require('express');
const trackController = require('../controllers/trackController');  // Import your controller
const router = express.Router();

// Define routes
router.post('/create', trackController.createTrack);
router.get('/', trackController.getAllTracks);
router.get('/:track_id', trackController.getTrackById);
router.put('/:track_id', trackController.updateTrack);
router.delete('/:track_id', trackController.deleteTrack);

module.exports = router;

