import { Coordinates } from './trip.model';

export interface Destination {
  _id: string;
  name: string;
  country: string;
  continent: string;
  description: string;
  shortDescription: string;
  images: string[];
  coverImage: string;
  coordinates: Coordinates;
  category: 'beach' | 'mountain' | 'city' | 'cultural' | 'adventure' | 'historical' | 'nature' | 'island';
  bestTimeToVisit: BestTime;
  averageCost: AverageCost;
  popularActivities: string[];
  mustVisit: string[];
  localCuisine: string[];
  transportation: TransportationInfo;
  rating: Rating;
  reviews: DestinationReview[];
  tags: string[];
  climate: string;
  language: string[];
  currency: string;
  timezone: string;
  visaRequired: boolean;
  visaInfo?: string;
  safetyRating: number;
  safetyTips: string[];
  emergencyNumbers: EmergencyNumbers;
  internetConnectivity: 'excellent' | 'good' | 'fair' | 'poor';
  population?: number;
  area?: number;
  famousFor: string[];
  culturalEvents: CulturalEvent[];
  nearbyDestinations: string[];
  createdBy?: string;
  featured: boolean;
  trending: boolean;
  views: number;
  likes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BestTime {
  months: string[];
  description: string;
}

export interface AverageCost {
  budget: number;
  moderate: number;
  luxury: number;
  currency: string;
}

export interface TransportationInfo {
  airport: string;
  airportCode: string;
  publicTransport: string[];
  tips: string;
}

export interface Rating {
  average: number;
  count: number;
}

export interface DestinationReview {
  user: {
    _id: string;
    name: string;
    avatar?: string;
  } | string;
  rating: number;
  title?: string;
  comment: string;
  helpful: string[];
  photos: string[];
  createdAt: Date;
}

export interface EmergencyNumbers {
  police: string;
  ambulance: string;
  fire: string;
}

export interface CulturalEvent {
  name: string;
  description: string;
  month: string;
}
