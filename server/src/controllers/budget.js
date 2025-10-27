import Trip from '../models/Trip.js';
import User from '../models/User.js';

// Get budget overview
export const getBudgetOverview = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    const hasAccess = trip.owner.toString() === req.user._id.toString() ||
                     trip.collaborators.some(c => c.user.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    trip.calculateTotalSpent();
    await trip.save();

    const budgetData = {
      total: trip.budget.total,
      spent: trip.budget.spent,
      remaining: trip.budget.total - trip.budget.spent,
      percentage: (trip.budget.spent / trip.budget.total) * 100,
      breakdown: trip.budget.breakdown,
      currency: trip.budget.currency,
      isOverBudget: trip.budget.spent > trip.budget.total
    };

    if (budgetData.isOverBudget && trip.owner.toString() === req.user._id.toString()) {
      const user = await User.findById(req.user._id);
      const overBudgetNotification = user.notifications.find(
        n => n.message.includes(`Trip "${trip.title}"`) && n.type === 'budget-alert'
      );

      if (!overBudgetNotification) {
        user.notifications.push({
          type: 'budget-alert',
          message: `Trip "${trip.title}" has exceeded its budget!`,
          read: false
        });
        await user.save();
      }
    }

    res.json({
      success: true,
      budget: budgetData
    });
  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching budget data'
    });
  }
};

// Update budget
export const updateBudget = async (req, res) => {
  try {
    const { total, breakdown } = req.body;
    const trip = await Trip.findById(req.params.tripId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    if (trip.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the trip owner can update the budget'
      });
    }

    if (total) trip.budget.total = total;
    if (breakdown) trip.budget.breakdown = { ...trip.budget.breakdown, ...breakdown };

    await trip.save();

    res.json({
      success: true,
      message: 'Budget updated successfully',
      budget: trip.budget
    });
  } catch (error) {
    console.error('Update budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating budget'
    });
  }
};
