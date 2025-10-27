import User from '../models/User.js';

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, avatar, preferences } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
};

// Toggle favorite destination
export const toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const destinationId = req.params.destinationId;

    const index = user.favoriteDestinations.indexOf(destinationId);
    
    if (index > -1) {
      user.favoriteDestinations.splice(index, 1);
    } else {
      user.favoriteDestinations.push(destinationId);
    }

    await user.save();
    await user.populate('favoriteDestinations');

    res.json({
      success: true,
      message: index > -1 ? 'Removed from favorites' : 'Added to favorites',
      favoriteDestinations: user.favoriteDestinations
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating favorites'
    });
  }
};

// Get user notifications
export const getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('notifications');
    
    res.json({
      success: true,
      notifications: user.notifications.sort((a, b) => b.createdAt - a.createdAt)
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications'
    });
  }
};

// Mark notification as read
export const markNotificationRead = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const notification = user.notifications.id(req.params.notificationId);
    
    if (notification) {
      notification.read = true;
      await user.save();
    }

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating notification'
    });
  }
};

// Get user gamification stats
export const getGamification = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('gamification');
    
    res.json({
      success: true,
      gamification: user.gamification
    });
  } catch (error) {
    console.error('Get gamification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching gamification data'
    });
  }
};
