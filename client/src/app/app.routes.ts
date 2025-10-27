import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'auth/google/callback',
    loadComponent: () => import('./pages/auth/google-callback/google-callback.component').then(m => m.GoogleCallbackComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'destinations',
    loadComponent: () => import('./pages/destinations/destinations.component').then(m => m.DestinationsComponent)
  },
  {
    path: 'destinations/:id',
    loadComponent: () => import('./pages/destination-detail/destination-detail.component').then(m => m.DestinationDetailComponent)
  },
  {
    path: 'hotels',
    loadComponent: () => import('./pages/hotels/hotels.component').then(m => m.HotelsComponent)
  },
  {
    path: 'hotels/:id',
    loadComponent: () => import('./pages/hotel-detail/hotel-detail.component').then(m => m.HotelDetailComponent)
  },
  {
    path: 'activities',
    loadComponent: () => import('./pages/activities/activities.component').then(m => m.ActivitiesComponent)
  },
  {
    path: 'activities/:id',
    loadComponent: () => import('./pages/activity-detail/activity-detail.component').then(m => m.ActivityDetailComponent)
  },
  {
    path: 'trips',
    loadComponent: () => import('./pages/trips/trips.component').then(m => m.TripsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'trips/create',
    loadComponent: () => import('./pages/trip-create/trip-create.component').then(m => m.TripCreateComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'trips/:id',
    loadComponent: () => import('./pages/trip-detail/trip-detail.component').then(m => m.TripDetailComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'trips/:id/edit',
    loadComponent: () => import('./pages/trip-edit/trip-edit.component').then(m => m.TripEditComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'analytics',
    loadComponent: () => import('./pages/analytics/analytics.component').then(m => m.AnalyticsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'ai-recommendations',
    loadComponent: () => import('./pages/ai-recommendations/ai-recommendations.component').then(m => m.AiRecommendationsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
