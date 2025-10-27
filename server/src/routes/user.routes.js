import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as userController from '../controllers/user.js';

const router = express.Router();

// Update user profile
router.put('/profile', authenticate, userController.updateProfile);

// Toggle favorite destination
router.post('/favorites/:destinationId', authenticate, userController.toggleFavorite);

// Get user notifications
router.get('/notifications', authenticate, userController.getNotifications);

// Mark notification as read
router.put('/notifications/:notificationId/read', authenticate, userController.markNotificationRead);

// Get user gamification stats
router.get('/gamification', authenticate, userController.getGamification);

export default router;
