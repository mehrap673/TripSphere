import express from 'express';
import { authenticate, optionalAuth, isAdmin } from '../middleware/auth.js';
import * as destinationController from '../controllers/destination.Controller.js';

const router = express.Router();

// ✅ SPECIFIC ROUTES FIRST (before /:id wildcard)
router.get('/featured', destinationController.getFeaturedDestinations);

// ✅ Search route (if you add it later)
// router.get('/search', destinationController.searchDestinations);

// ✅ THEN general routes
router.get('/', optionalAuth, destinationController.getAllDestinations);

// ✅ Dynamic :id route LAST (acts as wildcard)
router.get('/:id', destinationController.getDestinationById);

// Admin routes
router.post('/', authenticate, isAdmin, destinationController.createDestination);
router.put('/:id', authenticate, isAdmin, destinationController.updateDestination);
router.delete('/:id', authenticate, isAdmin, destinationController.deleteDestination);

// Reviews
router.post('/:id/reviews', authenticate, destinationController.addReview);

export default router;
