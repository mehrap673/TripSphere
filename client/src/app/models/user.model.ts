export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  role: 'guest' | 'user' | 'admin';
  location?: {
    city: string;
    country: string;
  };
  googleAuth?: {
    googleId: string;
    email: string;
    displayName: string;
    firstName: string;
    lastName: string;
    photo: string;
    verified: boolean;
  };
  preferences: UserPreferences;
  favoriteDestinations: string[];
  savedTrips: string[];
  gamification: Gamification;
  notifications: Notification[];
  socialLinks?: SocialLinks;
  isVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface UserPreferences {
  travelStyle: 'adventure' | 'relaxation' | 'cultural' | 'foodie' | 'luxury' | 'budget';
  budget: 'budget' | 'moderate' | 'luxury';
  interests: string[];
  theme: 'light' | 'dark';
  currency: string;
  language: string;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  tripReminders: boolean;
  budgetAlerts: boolean;
}

export interface Gamification {
  points: number;
  badges: Badge[];
  tripsCompleted: number;
  level: number;
  achievements: Achievement[];
}

export interface Badge {
  name: string;
  icon: string;
  earnedAt: Date;
  description: string;
}

export interface Achievement {
  name: string;
  description: string;
  unlockedAt: Date;
}

export interface Notification {
  type: 'trip-reminder' | 'budget-alert' | 'collaboration' | 'badge-earned' | 'system';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: Date;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}
