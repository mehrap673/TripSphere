import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['sightseeing', 'restaurant', 'event', 'hotel', 'transport', 'shopping', 'entertainment', 'other'],
    default: 'other'
  },
  location: {
    name: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    address: String
  },
  startTime: String,
  endTime: String,
  duration: String,
  cost: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  notes: String,
  completed: {
    type: Boolean,
    default: false
  },
  bookingUrl: String,
  bookingReference: String,
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  photos: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const daySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  dayNumber: {
    type: Number,
    required: true
  },
  title: String,
  activities: [activitySchema],
  notes: String,
  weather: {
    temperature: Number,
    feelsLike: Number,
    condition: String,
    description: String,
    icon: String,
    humidity: Number,
    windSpeed: Number
  },
  totalCost: {
    type: Number,
    default: 0
  }
});

const tripSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  coverImage: String,
  images: [String],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permission: {
      type: String,
      enum: ['view', 'edit'],
      default: 'view'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  },
  customDestination: {
    name: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  travelers: {
    type: Number,
    default: 1,
    min: 1
  },
  tripType: {
    type: String,
    enum: ['beach', 'city', 'adventure', 'cultural', 'business', 'relaxation', 'family', 'solo', 'group'],
    default: 'city'
  },
  days: [daySchema],
  budget: {
    total: {
      type: Number,
      default: 0
    },
    spent: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    breakdown: {
      accommodation: { type: Number, default: 0 },
      food: { type: Number, default: 0 },
      transport: { type: Number, default: 0 },
      activities: { type: Number, default: 0 },
      shopping: { type: Number, default: 0 },
      other: { type: Number, default: 0 }
    }
  },
  status: {
    type: String,
    enum: ['planning', 'confirmed', 'ongoing', 'completed', 'cancelled'],
    default: 'planning'
  },
  visibility: {
    type: String,
    enum: ['private', 'public', 'friends'],
    default: 'private'
  },
  sharedLink: {
    type: String,
    unique: true,
    sparse: true  // ✅ This allows multiple null values
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [String],
  notes: String,
  packingList: [{
    item: String,
    packed: {
      type: Boolean,
      default: false
    },
    category: String
  }],
  documents: [{
    name: String,
    type: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  bookings: [{
    type: {
      type: String,
      enum: ['flight', 'hotel', 'car', 'activity', 'other']
    },
    name: String,
    confirmationNumber: String,
    date: Date,
    cost: Number,
    notes: String
  }],
  transportation: [{
    type: {
      type: String,
      enum: ['flight', 'train', 'bus', 'car', 'boat', 'other']
    },
    from: String,
    to: String,
    departureDate: Date,
    arrivalDate: Date,
    bookingReference: String,
    cost: Number
  }],
  accommodation: [{
    name: String,
    type: {
      type: String,
      enum: ['hotel', 'hostel', 'apartment', 'resort', 'other']
    },
    checkIn: Date,
    checkOut: Date,
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    bookingReference: String,
    cost: Number,
    rating: Number
  }],
  reminders: [{
    title: String,
    description: String,
    date: Date,
    sent: {
      type: Boolean,
      default: false
    }
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ Remove duplicate indexes - only define once
tripSchema.index({ owner: 1, status: 1 });
tripSchema.index({ startDate: 1 });
tripSchema.index({ 'destination': 1 });
// ✅ REMOVED: tripSchema.index({ sharedLink: 1 }); - Already defined with unique: true

// Rest of your methods remain the same...
tripSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

tripSchema.methods.calculateTotalSpent = function() {
  let total = 0;
  this.days.forEach(day => {
    day.activities.forEach(activity => {
      total += activity.cost || 0;
    });
  });
  this.budget.spent = total;
  return total;
};

tripSchema.methods.calculateDailyCosts = function() {
  this.days.forEach(day => {
    day.totalCost = day.activities.reduce((sum, activity) => sum + (activity.cost || 0), 0);
  });
};

tripSchema.methods.getDuration = function() {
  return Math.ceil((new Date(this.endDate) - new Date(this.startDate)) / (1000 * 60 * 60 * 24));
};

tripSchema.methods.isActive = function() {
  const now = new Date();
  return new Date(this.startDate) <= now && new Date(this.endDate) >= now;
};

tripSchema.methods.getProgress = function() {
  const now = new Date();
  const start = new Date(this.startDate);
  const end = new Date(this.endDate);
  
  if (now < start) return 0;
  if (now > end) return 100;
  
  const total = end - start;
  const elapsed = now - start;
  return (elapsed / total) * 100;
};

export default mongoose.model('Trip', tripSchema);
