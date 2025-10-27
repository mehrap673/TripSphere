import mongoose from 'mongoose';

const roomTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    default: 2
  },
  beds: String,
  size: String,
  features: [String],
  images: [String],
  available: {
    type: Boolean,
    default: true
  }
});

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  },
  address: String,
  coordinates: {
    lat: Number,
    lng: Number
  },
  images: [String],
  coverImage: String,
  description: String,
  rating: {
    stars: {
      type: Number,
      min: 1,
      max: 5
    },
    reviews: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    }
  },
  priceRange: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  amenities: [String],
  roomTypes: [roomTypeSchema],
  policies: {
    checkIn: String,
    checkOut: String,
    cancellation: String,
    children: String,
    pets: String
  },
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
    pros: [String],
    cons: [String],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  category: {
    type: String,
    enum: ['hotel', 'resort', 'hostel', 'apartment', 'villa', 'guesthouse'],
    default: 'hotel'
  },
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
hotelSchema.index({ destination: 1 });
hotelSchema.index({ 'rating.averageScore': -1 });
hotelSchema.index({ 'priceRange.min': 1 });

// Update timestamp before saving
hotelSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate average rating
hotelSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating.averageScore = 0;
    this.rating.reviews = 0;
    return;
  }
  
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating.averageScore = totalRating / this.reviews.length;
  this.rating.reviews = this.reviews.length;
};

export default mongoose.model('Hotel', hotelSchema);
