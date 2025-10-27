import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as tripController from '../controllers/trip.js';

const router = express.Router();

// Create trip
router.post('/', authenticate, tripController.createTrip);

// Get user trips
router.get('/my-trips', authenticate, tripController.getUserTrips);

// Get single trip
router.get('/:id', authenticate, tripController.getTripById);

// Update trip
router.put('/:id', authenticate, tripController.updateTrip);

// Delete trip
router.delete('/:id', authenticate, tripController.deleteTrip);

// Generate shareable link
router.post('/:id/share', authenticate, tripController.shareTrip);

// Add collaborator
router.post('/:id/collaborators', authenticate, tripController.addCollaborator);

// Complete trip
router.post('/:id/complete', authenticate, tripController.completeTrip);

export default router;
