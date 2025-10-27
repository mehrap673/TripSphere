import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as aiController from '../controllers/ai.js';

const router = express.Router();

// Get AI recommendations for destinations
router.post('/recommend-destinations', authenticate, aiController.recommendDestinations);

// Get AI itinerary suggestions
router.post('/suggest-itinerary', authenticate, aiController.suggestItinerary);

// Get AI hotel recommendations
router.post('/recommend-hotels', authenticate, aiController.recommendHotels);

// Get AI activity recommendations
router.post('/recommend-activities', authenticate, aiController.recommendActivities);

// Get AI travel tips
router.post('/travel-tips', authenticate, aiController.getTravelTips);

export default router;
