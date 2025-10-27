export interface RoomType {
  name: string;
  description: string;
  price: number;
  capacity: number;
  beds: string;
  size: string;
  features: string[];
  images: string[];
  available: boolean;
}

export interface Hotel {
  _id: string;
  name: string;
  destination: any;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  images: string[];
  coverImage: string;
  description: string;
  rating: {
    stars: number;
    reviews: number;
    averageScore: number;
  };
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  amenities: string[];
  roomTypes: RoomType[];
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
    children: string;
    pets: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
  category: string;
  featured: boolean;
  verified: boolean;
  views: number;
  bookings: number;
}
