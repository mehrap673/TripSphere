import express from 'express';
import { authenticate, isAdmin } from '../middleware/auth.js';
import * as activityController from '../controllers/activity.js';

const router = express.Router();

// Public routes
router.get('/', activityController.getAllActivities);
router.get('/featured', activityController.getFeaturedActivities);
router.get('/search', activityController.searchActivitiesController);  // ← Changed
router.get('/type/:type', activityController.getActivitiesByType);
router.get('/destination/:destinationId', activityController.getActivitiesByDestination);
router.get('/:id', activityController.getActivityById);

// Protected routes (admin only)
router.post('/', authenticate, isAdmin, activityController.createActivity);
router.put('/:id', authenticate, isAdmin, activityController.updateActivity);
router.delete('/:id', authenticate, isAdmin, activityController.deleteActivity);

export default router;
