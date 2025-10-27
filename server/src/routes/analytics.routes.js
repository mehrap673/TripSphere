import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getUserAnalytics,
  getDashboardSummary,
  getTripAnalytics,
  getSpendingTrends
} from '../controllers/analytics.Controller.js';

const router = express.Router();

// Get user analytics
router.get('/user', authenticate, getUserAnalytics);

// Get dashboard summary
router.get('/dashboard', authenticate, getDashboardSummary);

// Get trip analytics
router.get('/trip/:tripId', authenticate, getTripAnalytics);

// Get spending trends
router.get('/spending-trends', authenticate, getSpendingTrends);

export default router;
