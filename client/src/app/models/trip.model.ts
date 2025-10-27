import { Destination } from './destination.model';

export interface Trip {
  _id: string;
  title: string;
  description?: string;
  coverImage?: string;
  images: string[];
  owner: TripUser | string;
  collaborators: Collaborator[];
  destination?: Destination | string;
  customDestination?: CustomDestination;
  startDate: Date;
  endDate: Date;
  travelers: number;
  tripType: 'beach' | 'city' | 'adventure' | 'cultural' | 'business' | 'relaxation' | 'family' | 'solo' | 'group';
  days: Day[];
  budget: Budget;
  status: 'planning' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled';
  visibility: 'private' | 'public' | 'friends';
  sharedLink?: string;
  isPublic: boolean;
  tags: string[];
  notes?: string;
  packingList: PackingItem[];
  documents: Document[];
  bookings: Booking[];
  transportation: Transportation[];
  accommodation: Accommodation[];
  reminders: Reminder[];
  likes: string[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TripUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Day {
  date: Date;
  dayNumber: number;
  title?: string;
  activities: Activity[];
  notes?: string;
  weather?: Weather;
  totalCost: number;
}

export interface Activity {
  _id?: string;
  name: string;
  type: 'sightseeing' | 'restaurant' | 'event' | 'hotel' | 'transport' | 'shopping' | 'entertainment' | 'other';
  location?: Location;
  startTime?: string;
  endTime?: string;
  duration?: string;
  cost: number;
  currency: string;
  notes?: string;
  completed: boolean;
  bookingUrl?: string;
  bookingReference?: string;
  rating?: number;
  photos: string[];
  createdAt?: Date;
}

export interface Location {
  name: string;
  coordinates?: Coordinates;
  address?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Budget {
  total: number;
  spent: number;
  currency: string;
  breakdown: BudgetBreakdown;
}

export interface BudgetBreakdown {
  accommodation: number;
  food: number;
  transport: number;
  activities: number;
  shopping: number;
  other: number;
}

export interface Collaborator {
  user: TripUser | string;
  permission: 'view' | 'edit';
  addedAt: Date;
}

export interface CustomDestination {
  name: string;
  country: string;
  coordinates: Coordinates;
}

export interface PackingItem {
  item: string;
  packed: boolean;
  category: string;
}

export interface Document {
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
}

export interface Booking {
  type: 'flight' | 'hotel' | 'car' | 'activity' | 'other';
  name: string;
  confirmationNumber: string;
  date: Date;
  cost: number;
  notes?: string;
}

export interface Transportation {
  type: 'flight' | 'train' | 'bus' | 'car' | 'boat' | 'other';
  from: string;
  to: string;
  departureDate: Date;
  arrivalDate: Date;
  bookingReference?: string;
  cost: number;
}

export interface Accommodation {
  name: string;
  type: 'hotel' | 'hostel' | 'apartment' | 'resort' | 'other';
  checkIn: Date;
  checkOut: Date;
  address: string;
  coordinates?: Coordinates;
  bookingReference?: string;
  cost: number;
  rating?: number;
}

export interface Reminder {
  title: string;
  description: string;
  date: Date;
  sent: boolean;
}

export interface Weather {
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}
