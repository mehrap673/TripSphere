import { nanoid } from 'nanoid';
import Trip from '../models/Trip.js';
import User from '../models/User.js';

// Create trip
export const createTrip = async (req, res) => {
  try {
    const trip = new Trip({
      ...req.body,
      owner: req.user._id
    });

    await trip.save();
    await trip.populate('owner', 'name email avatar');
    await trip.populate('destination');

    // Award points for creating a trip
    const user = await User.findById(req.user._id);
    user.gamification.points += 10;
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      trip
    });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating trip'
    });
  }
};

// Get user trips
export const getUserTrips = async (req, res) => {
  try {
    const { status, sort } = req.query;
    let query = {
      $or: [
        { owner: req.user._id },
        { 'collaborators.user': req.user._id }
      ]
    };

    if (status) {
      query.status = status;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'startDate') {
      sortOption = { startDate: 1 };
    } else if (sort === 'endDate') {
      sortOption = { endDate: 1 };
    }

    const trips = await Trip.find(query)
      .populate('owner', 'name email avatar')
      .populate('destination')
      .populate('collaborators.user', 'name email avatar')
      .sort(sortOption);

    res.json({
      success: true,
      trips
    });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trips'
    });
  }
};

// Get single trip
export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('destination')
      .populate('collaborators.user', 'name email avatar');

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    const hasAccess = trip.owner._id.toString() === req.user._id.toString() ||
                     trip.collaborators.some(c => c.user._id.toString() === req.user._id.toString()) ||
                     trip.isPublic;

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      trip
    });
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trip'
    });
  }
};

// Update trip
export const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    const canEdit = trip.owner.toString() === req.user._id.toString() ||
                   trip.collaborators.some(c => 
                     c.user.toString() === req.user._id.toString() && c.permission === 'edit'
                   );

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to edit this trip'
      });
    }

    Object.assign(trip, req.body);
    trip.calculateTotalSpent();
    await trip.save();
    await trip.populate('owner', 'name email avatar');
    await trip.populate('destination');

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    io.to(trip._id.toString()).emit('trip-updated', { trip });

    res.json({
      success: true,
      message: 'Trip updated successfully',
      trip
    });
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating trip'
    });
  }
};

// Delete trip
export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    if (trip.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the trip owner can delete this trip'
      });
    }

    await trip.deleteOne();

    res.json({
      success: true,
      message: 'Trip deleted successfully'
    });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting trip'
    });
  }
};

// Generate shareable link
export const shareTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    if (trip.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the trip owner can share this trip'
      });
    }

    if (!trip.sharedLink) {
      trip.sharedLink = nanoid(10);
      trip.isPublic = true;
      await trip.save();
    }

    res.json({
      success: true,
      sharedLink: `${process.env.CLIENT_URL}/shared-trip/${trip.sharedLink}`,
      trip
    });
  } catch (error) {
    console.error('Share trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sharing trip'
    });
  }
};

// Add collaborator
export const addCollaborator = async (req, res) => {
  try {
    const { email, permission } = req.body;
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    if (trip.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the trip owner can add collaborators'
      });
    }

    const collaborator = await User.findOne({ email });

    if (!collaborator) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (trip.collaborators.some(c => c.user.toString() === collaborator._id.toString())) {
      return res.status(400).json({
        success: false,
        message: 'User is already a collaborator'
      });
    }

    trip.collaborators.push({
      user: collaborator._id,
      permission: permission || 'view'
    });

    await trip.save();
    await trip.populate('collaborators.user', 'name email avatar');

    // Send notification to collaborator
    collaborator.notifications.push({
      type: 'collaboration',
      message: `${req.user.name} invited you to collaborate on trip "${trip.title}"`,
      read: false
    });
    await collaborator.save();

    res.json({
      success: true,
      message: 'Collaborator added successfully',
      trip
    });
  } catch (error) {
    console.error('Add collaborator error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding collaborator'
    });
  }
};

// Complete trip
export const completeTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    if (trip.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the trip owner can complete this trip'
      });
    }

    trip.status = 'completed';
    await trip.save();

    // Update user gamification
    const user = await User.findById(req.user._id);
    user.gamification.tripsCompleted += 1;
    user.gamification.points += 50;

    // Award badges
    if (user.gamification.tripsCompleted === 1) {
      user.gamification.badges.push({
        name: 'First Trip',
        icon: '🎉',
        earnedAt: new Date(),
        description: 'Completed your first trip!'
      });
      user.gamification.points += 100;
    }

    if (trip.budget.spent <= trip.budget.total) {
      user.gamification.badges.push({
        name: 'Budget Master',
        icon: '💰',
        earnedAt: new Date(),
        description: 'Stayed within budget!'
      });
      user.gamification.points += 25;
    }

    // Level up calculation
    const newLevel = Math.floor(user.gamification.points / 500) + 1;
    if (newLevel > user.gamification.level) {
      user.gamification.level = newLevel;
      user.notifications.push({
        type: 'badge-earned',
        message: `Congratulations! You've reached Level ${newLevel}!`,
        read: false
      });
    }

    await user.save();

    res.json({
      success: true,
      message: 'Trip completed successfully',
      trip,
      gamification: user.gamification
    });
  } catch (error) {
    console.error('Complete trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing trip'
    });
  }
};
