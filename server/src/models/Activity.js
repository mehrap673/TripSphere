import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  },
  type: {
    type: String,
    enum: ['sightseeing', 'restaurant', 'adventure', 'cultural', 'shopping', 'nightlife', 'nature', 'sports', 'wellness', 'entertainment', 'other'],
    required: true
  },
  description: String,
  shortDescription: String,
  images: [String],
  coverImage: String,
  location: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    area: String
  },
  pricing: {
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    priceType: {
      type: String,
      enum: ['per person', 'per group', 'per hour', 'per day', 'free']
    }
  },
  duration: String,
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  openingHours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String
  },
  bestTimeToVisit: String,
  seasonality: {
    type: String,
    enum: ['year-round', 'seasonal', 'summer', 'winter', 'spring', 'fall']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'challenging', 'extreme']
  },
  ageRestriction: {
    minimum: Number,
    maximum: Number
  },
  groupSize: {
    minimum: Number,
    maximum: Number
  },
  tags: [String],
  includes: [String],
  excludes: [String],
  requirements: [String],
  whatToBring: [String],
  bookingRequired: {
    type: Boolean,
    default: false
  },
  bookingUrl: String,
  cancellationPolicy: String,
  contactInfo: {
    phone: String,
    email: String,
    website: String
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    title: String,
    comment: String,
    visitDate: Date,
    photos: [String],
    helpful: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  featured: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  bookings: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

// Indexes
activitySchema.index({ destination: 1, type: 1 });
activitySchema.index({ 'rating.average': -1 });
activitySchema.index({ tags: 1 });

// Update timestamp before saving
activitySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate average rating
activitySchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
    return;
  }
  
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating.average = totalRating / this.reviews.length;
  this.rating.count = this.reviews.length;
};

export default mongoose.model('Activity', activitySchema);
