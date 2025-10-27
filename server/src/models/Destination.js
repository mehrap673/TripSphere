import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true
  },
  continent: {
    type: String,
    enum: ['Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania', 'Antarctica']
  },
  description: String,
  shortDescription: String,
  images: [String],
  coverImage: String,
  coordinates: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  category: {
    type: String,
    enum: ['beach', 'mountain', 'city', 'cultural', 'adventure', 'historical', 'nature', 'island'],
    default: 'city'
  },
  bestTimeToVisit: {
    months: [String],
    description: String
  },
  averageCost: {
    budget: Number,
    moderate: Number,
    luxury: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  popularActivities: [String],
  mustVisit: [String],
  localCuisine: [String],
  transportation: {
    airport: String,
    airportCode: String,
    publicTransport: [String],
    tips: String
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    title: String,
    comment: String,
    helpful: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    photos: [String],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [String],
  climate: String,
  languages: [String],
  currency: String,
  timezone: String,
  visaRequired: {
    type: Boolean,
    default: false
  },
  visaInfo: String,
  safetyRating: {
    type: Number,
    min: 0,
    max: 5
  },
  safetyTips: [String],
  emergencyNumbers: {
    police: String,
    ambulance: String,
    fire: String
  },
  internetConnectivity: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor']
  },
  population: Number,
  area: Number,
  famousFor: [String],
  culturalEvents: [{
    name: String,
    description: String,
    month: String
  }],
  nearbyDestinations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  featured: {
    type: Boolean,
    default: false
  },
  trending: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
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
destinationSchema.index({ name: 'text', country: 'text', description: 'text', tags: 'text' });
destinationSchema.index({ category: 1 });
destinationSchema.index({ 'rating.average': -1 });
destinationSchema.index({ featured: 1 });

// Update timestamp before saving
destinationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate average rating
destinationSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
    return;
  }
  
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating.average = totalRating / this.reviews.length;
  this.rating.count = this.reviews.length;
};

export default mongoose.model('Destination', destinationSchema);
