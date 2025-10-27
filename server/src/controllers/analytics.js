import Trip from '../models/Trip.js';
import User from '../models/User.js';

// Get user analytics
export const getUserAnalytics = async (req, res) => {
  try {
    const trips = await Trip.find({
      $or: [
        { owner: req.user._id },
        { 'collaborators.user': req.user._id }
      ]
    }).populate('destination');

    const analytics = {
      totalTrips: trips.length,
      completedTrips: trips.filter(t => t.status === 'completed').length,
      upcomingTrips: trips.filter(t => t.status === 'confirmed' || t.status === 'planning').length,
      ongoingTrips: trips.filter(t => t.status === 'ongoing').length,
      totalSpent: trips.reduce((sum, t) => sum + (t.budget.spent || 0), 0),
      totalBudget: trips.reduce((sum, t) => sum + (t.budget.total || 0), 0),
      averageSpent: trips.length > 0 
        ? trips.reduce((sum, t) => sum + (t.budget.spent || 0), 0) / trips.length 
        : 0,
      averageBudget: trips.length > 0 
        ? trips.reduce((sum, t) => sum + (t.budget.total || 0), 0) / trips.length 
        : 0,
      destinationsVisited: [...new Set(trips.filter(t => t.destination).map(t => t.destination._id.toString()))].length,
      savingsRate: 0,
      topDestinations: [],
      tripsByType: {},
      monthlySpending: {},
      budgetPerformance: {
        underBudget: 0,
        onBudget: 0,
        overBudget: 0
      }
    };

    // Calculate savings rate
    if (analytics.totalBudget > 0) {
      analytics.savingsRate = ((analytics.totalBudget - analytics.totalSpent) / analytics.totalBudget) * 100;
    }

    // Calculate top destinations
    const destinationCounts = {};
    trips.forEach(trip => {
      if (trip.destination) {
        const destId = trip.destination._id.toString();
        if (!destinationCounts[destId]) {
          destinationCounts[destId] = {
            name: trip.destination.name,
            count: 0,
            totalSpent: 0
          };
        }
        destinationCounts[destId].count++;
        destinationCounts[destId].totalSpent += trip.budget.spent || 0;
      }
    });

    analytics.topDestinations = Object.values(destinationCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate trips by type
    trips.forEach(trip => {
      analytics.tripsByType[trip.tripType] = (analytics.tripsByType[trip.tripType] || 0) + 1;
    });

    // Calculate monthly spending
    trips.forEach(trip => {
      const month = new Date(trip.startDate).toISOString().slice(0, 7);
      analytics.monthlySpending[month] = (analytics.monthlySpending[month] || 0) + (trip.budget.spent || 0);
    });

    // Calculate budget performance
    trips.forEach(trip => {
      const spentPercentage = (trip.budget.spent / trip.budget.total) * 100;
      if (spentPercentage < 95) {
        analytics.budgetPerformance.underBudget++;
      } else if (spentPercentage <= 100) {
        analytics.budgetPerformance.onBudget++;
      } else {
        analytics.budgetPerformance.overBudget++;
      }
    });

    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};

// Get dashboard summary
export const getDashboardSummary = async (req, res) => {
  try {
    const trips = await Trip.find({
      $or: [
        { owner: req.user._id },
        { 'collaborators.user': req.user._id }
      ]
    })
    .populate('destination')
    .sort({ createdAt: -1 });

    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const upcomingTrips = trips
      .filter(t => new Date(t.startDate) > now && new Date(t.startDate) <= thirtyDaysFromNow)
      .slice(0, 3)
      .map(trip => ({
        id: trip._id,
        title: trip.title,
        destination: trip.destination?.name || trip.customDestination?.name || 'Unknown',
        startDate: trip.startDate,
        daysUntil: Math.ceil((new Date(trip.startDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      }));

    const recentTrips = trips
      .filter(t => t.status === 'completed')
      .slice(0, 5)
      .map(trip => ({
        id: trip._id,
        title: trip.title,
        destination: trip.destination?.name || trip.customDestination?.name || 'Unknown',
        endDate: trip.endDate
      }));

    const summary = {
      quickStats: {
        totalTrips: trips.length,
        completedTrips: trips.filter(t => t.status === 'completed').length,
        upcomingTrips: upcomingTrips.length,
        totalSpent: trips.reduce((sum, t) => sum + (t.budget.spent || 0), 0)
      },
      upcomingTrips,
      recentTrips
    };

    res.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error('Get dashboard summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard summary',
      error: error.message
    });
  }
};

// Get trip analytics
export const getTripAnalytics = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId).populate('destination');

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

    const totalDays = Math.ceil(
      (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    const analytics = {
      totalDays: trip.days?.length || totalDays,
      totalActivities: trip.days?.reduce((sum, d) => sum + (d.activities?.length || 0), 0) || 0,
      completedActivities: trip.days?.reduce(
        (sum, d) => sum + (d.activities?.filter(a => a.completed).length || 0), 
        0
      ) || 0,
      activitiesByType: {},
      dailyBudget: trip.budget.total / (totalDays || 1),
      actualDailySpending: trip.budget.spent / (totalDays || 1),
      costBreakdown: trip.budget.breakdown,
      budgetUtilization: trip.budget.total > 0 
        ? (trip.budget.spent / trip.budget.total) * 100 
        : 0,
      remainingBudget: trip.budget.total - trip.budget.spent
    };

    // Calculate activities by type
    if (trip.days) {
      trip.days.forEach(day => {
        day.activities?.forEach(activity => {
          const type = activity.type || 'other';
          analytics.activitiesByType[type] = (analytics.activitiesByType[type] || 0) + 1;
        });
      });
    }

    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error('Get trip analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trip analytics',
      error: error.message
    });
  }
};

// Get spending trends
export const getSpendingTrends = async (req, res) => {
  try {
    const { period = '6months' } = req.query;
    
    let startDate = new Date();
    if (period === '6months') {
      startDate.setMonth(startDate.getMonth() - 6);
    } else if (period === '1year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    } else if (period === '3months') {
      startDate.setMonth(startDate.getMonth() - 3);
    }

    const trips = await Trip.find({
      $or: [
        { owner: req.user._id },
        { 'collaborators.user': req.user._id }
      ],
      startDate: { $gte: startDate }
    }).sort({ startDate: 1 });

    const monthlyData = {};
    trips.forEach(trip => {
      const month = new Date(trip.startDate).toISOString().slice(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = {
          month,
          spent: 0,
          budgeted: 0,
          trips: 0
        };
      }
      monthlyData[month].spent += trip.budget.spent || 0;
      monthlyData[month].budgeted += trip.budget.total || 0;
      monthlyData[month].trips++;
    });

    const trends = Object.values(monthlyData).sort((a, b) => 
      a.month.localeCompare(b.month)
    );

    res.json({
      success: true,
      trends
    });
  } catch (error) {
    console.error('Get spending trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching spending trends',
      error: error.message
    });
  }
};

// ADD these functions to your existing activity controller

// Get all activities
export const getAllActivities = async (req, res) => {
  try {
    const { type, difficulty, featured, limit = 50 } = req.query;
    
    const filter = {};
    if (type) filter.type = type;
    if (difficulty) filter.difficulty = difficulty;
    if (featured) filter.featured = true;

    const activities = await Activity.find(filter)
      .populate('destination', 'name country')
      .sort({ 'rating.average': -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: activities.length,
      activities
    });
  } catch (error) {
    console.error('Get all activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activities'
    });
  }
};

// Get featured activities
export const getFeaturedActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const activities = await Activity.find({ featured: true })
      .populate('destination', 'name country')
      .sort({ 'rating.average': -1 })
      .limit(limit);

    res.json({
      success: true,
      count: activities.length,
      activities
    });
  } catch (error) {
    console.error('Get featured activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured activities'
    });
  }
};

// Search activities
export const searchActivities = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const activities = await Activity.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    }).populate('destination', 'name country');

    res.json({
      success: true,
      count: activities.length,
      activities
    });
  } catch (error) {
    console.error('Search activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching activities'
    });
  }
};

// Get activities by type
export const getActivitiesByType = async (req, res) => {
  try {
    const { type } = req.params;

    const activities = await Activity.find({ type })
      .populate('destination', 'name country')
      .sort({ 'rating.average': -1 });

    res.json({
      success: true,
      count: activities.length,
      activities
    });
  } catch (error) {
    console.error('Get activities by type error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activities by type'
    });
  }
};

