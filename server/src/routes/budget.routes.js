import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as budgetController from '../controllers/budget.controller.js';

const router = express.Router();

// Get budget overview for a trip
router.get('/trip/:tripId', authenticate, budgetController.getBudgetOverview);

// Update budget for a trip
router.put('/trip/:tripId', authenticate, budgetController.updateBudget);

export default router;
