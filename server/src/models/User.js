import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['guest', 'user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  location: {
    city: String,
    country: String
  },
  // Google OAuth fields
  googleAuth: {
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    email: String,
    displayName: String,
    firstName: String,
    lastName: String,
    photo: String,
    verified: Boolean
  },
  preferences: {
    travelStyle: {
      type: String,
      enum: ['adventure', 'relaxation', 'cultural', 'foodie', 'luxury', 'budget'],
      default: 'cultural'
    },
    budget: {
      type: String,
      enum: ['budget', 'moderate', 'luxury'],
      default: 'moderate'
    },
    interests: {
      type: [String],
      default: []
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    currency: {
      type: String,
      default: 'USD'
    },
    language: {
      type: String,
      default: 'en'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      tripReminders: {
        type: Boolean,
        default: true
      },
      budgetAlerts: {
        type: Boolean,
        default: true
      }
    }
  },
  favoriteDestinations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  }],
  savedTrips: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
  }],
  gamification: {
    points: {
      type: Number,
      default: 0
    },
    badges: [{
      name: String,
      icon: String,
      earnedAt: Date,
      description: String
    }],
    tripsCompleted: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    achievements: [{
      name: String,
      description: String,
      unlockedAt: Date
    }]
  },
  notifications: [{
    type: {
      type: String,
      enum: ['trip-reminder', 'budget-alert', 'collaboration', 'badge-earned', 'system']
    },
    title: String,
    message: String,
    read: {
      type: Boolean,
      default: false
    },
    link: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  socialLinks: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update timestamp before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get public profile
userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    name: this.name,
    avatar: this.avatar,
    bio: this.bio,
    location: this.location,
    gamification: {
      level: this.gamification.level,
      badges: this.gamification.badges,
      tripsCompleted: this.gamification.tripsCompleted
    }
  };
};

export default mongoose.model('User', userSchema);
