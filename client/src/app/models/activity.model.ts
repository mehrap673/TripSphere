export interface Activity {
  _id: string;
  name: string;
  destination: any;
  type: string;
  description: string;
  shortDescription: string;
  images: string[];
  coverImage: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    area: string;
  };
  pricing: {
    amount: number;
    currency: string;
    priceType: string;
  };
  duration: string;
  rating: {
    average: number;
    count: number;
  };
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  bestTimeToVisit: string;
  seasonality: string;
  difficulty: string;
  ageRestriction: {
    minimum: number;
    maximum: number;
  };
  groupSize: {
    minimum: number;
    maximum: number;
  };
  tags: string[];
  includes: string[];
  excludes: string[];
  requirements: string[];
  whatToBring: string[];
  bookingRequired: boolean;
  bookingUrl: string;
  cancellationPolicy: string;
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
  featured: boolean;
  verified: boolean;
  views: number;
  bookings: number;
}
