import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { Trip } from '../../models/trip.model';

@Component({
    selector: 'app-trips',
    imports: [CommonModule, RouterModule],
    template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8 animate-fade-up">
          <div>
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              My Trips
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Manage and track all your adventures
            </p>
          </div>
          <a routerLink="/trips/create" 
             class="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-primary-500/50 transition-all duration-300 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Create New Trip
          </a>
        </div>

        <!-- Filters Card -->
        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 mb-8 animate-fade-up" style="animation-delay: 0.1s">
          <div class="flex items-center gap-3 mb-4">
            <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">Filter by Status</h2>
          </div>
          <div class="flex flex-wrap gap-3">
            <button *ngFor="let status of statuses"
                    (click)="filterByStatus(status.value)"
                    class="px-5 py-2.5 rounded-xl font-semibold transition-all hover:scale-105"
                    [ngClass]="{
                      'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg shadow-primary-500/50': selectedStatus === status.value,
                      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-700': selectedStatus !== status.value
                    }">
              <span class="mr-2">{{status.icon}}</span>
              {{status.label}}
            </button>
          </div>
        </div>

        <!-- Trips Grid -->
        <div *ngIf="!loading && trips.length > 0" 
             class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let trip of trips; let i = index" 
               [routerLink]="['/trips', trip._id]"
               class="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group animate-fade-up"
               [style.animation-delay]="getAnimationDelay(i)">
            <!-- Image -->
            <div class="relative h-56 overflow-hidden">
              <img [src]="getTripImage(trip)" 
                   [alt]="trip.title"
                   class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              
              <!-- Status & Type Badges -->
              <div class="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span class="px-4 py-2 backdrop-blur-sm rounded-xl text-sm font-bold shadow-lg border border-white/30"
                      [ngClass]="{
                        'bg-blue-500/90 text-white': trip.status === 'planning',
                        'bg-emerald-500/90 text-white': trip.status === 'confirmed',
                        'bg-amber-500/90 text-white': trip.status === 'ongoing',
                        'bg-gray-500/90 text-white': trip.status === 'completed',
                        'bg-red-500/90 text-white': trip.status === 'cancelled'
                      }">
                  {{trip.status | titlecase}}
                </span>
                <span class="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-sm text-white font-semibold capitalize border border-white/30">
                  {{trip.tripType}}
                </span>
              </div>

              <!-- Trip Info Overlay -->
              <div class="absolute bottom-4 left-4 right-4">
                <h3 class="text-2xl font-bold text-white mb-2 drop-shadow-lg line-clamp-1">
                  {{trip.title}}
                </h3>
                <div class="flex items-center text-white/90 text-sm drop-shadow-md">
                  <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  {{getDestinationName(trip)}}
                </div>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <!-- Trip Details -->
              <div class="space-y-3 mb-5">
                <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <div class="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="text-xs text-gray-500 dark:text-gray-500">Duration</div>
                    <div class="font-semibold text-gray-900 dark:text-white">{{trip.startDate | date:'MMM d'}} - {{trip.endDate | date:'MMM d, yyyy'}}</div>
                  </div>
                </div>

                <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <div class="w-10 h-10 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-secondary-600 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="text-xs text-gray-500 dark:text-gray-500">Travelers</div>
                    <div class="font-semibold text-gray-900 dark:text-white">{{trip.travelers}} {{trip.travelers > 1 ? 'people' : 'person'}}</div>
                  </div>
                </div>
              </div>

              <!-- Budget Progress -->
              <div class="mb-5 p-4 rounded-2xl" 
                   [ngClass]="{
                     'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20': trip.budget.spent <= trip.budget.total,
                     'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20': trip.budget.spent > trip.budget.total
                   }">
                <div class="flex items-center justify-between text-sm mb-2">
                  <span class="text-gray-700 dark:text-gray-300 font-semibold">Budget</span>
                  <span class="font-bold" 
                        [ngClass]="{
                          'text-green-600 dark:text-green-400': trip.budget.spent <= trip.budget.total,
                          'text-red-600 dark:text-red-400': trip.budget.spent > trip.budget.total
                        }">
                    {{trip.budget.currency}} {{trip.budget.spent}} / {{trip.budget.total}}
                  </span>
                </div>
                <div class="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-500"
                       [ngClass]="{
                         'bg-gradient-to-r from-green-400 to-emerald-500': trip.budget.spent <= trip.budget.total,
                         'bg-gradient-to-r from-red-400 to-orange-500': trip.budget.spent > trip.budget.total
                       }"
                       [style.width.%]="getBudgetPercentage(trip)">
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="flex items-center justify-between pt-5 border-t border-gray-200 dark:border-gray-800">
                <div class="flex items-center -space-x-3">
                  <img *ngIf="getOwnerAvatar(trip)" 
                       [src]="getOwnerAvatar(trip)" 
                       [alt]="getOwnerName(trip)"
                       class="w-10 h-10 rounded-xl ring-4 ring-white dark:ring-gray-900 object-cover shadow-lg"
                       [title]="getOwnerName(trip)">
                  <div *ngFor="let collab of getCollaborators(trip)" 
                       class="w-10 h-10 rounded-xl ring-4 ring-white dark:ring-gray-900 bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-sm font-bold shadow-lg"
                       [title]="getCollaboratorName(collab)">
                    {{getCollaboratorInitials(collab)}}
                  </div>
                  <div *ngIf="getCollaboratorsCount(trip) > 2" 
                       class="w-10 h-10 rounded-xl ring-4 ring-white dark:ring-gray-900 bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 text-sm font-bold shadow-lg">
                    +{{getCollaboratorsCount(trip) - 2}}
                  </div>
                </div>

                <div class="flex items-center text-primary-600 dark:text-primary-400 font-semibold group-hover:translate-x-2 transition-transform">
                  <span class="mr-1 text-sm">View</span>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && trips.length === 0" 
             class="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 animate-fade-up">
          <div class="inline-block p-8 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
            <svg class="w-20 h-20 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">No trips found</h3>
          <p class="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">
            {{selectedStatus ? 'No trips with this status. Try a different filter.' : 'Start planning your first adventure and create unforgettable memories!'}}
          </p>
          <a routerLink="/trips/create" 
             class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-primary-500/50 transition-all duration-300">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Create Your First Trip
          </a>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let i of [1,2,3,4,5,6]" class="animate-pulse">
            <div class="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800">
              <div class="h-56 bg-gray-300 dark:bg-gray-700"></div>
              <div class="p-6 space-y-4">
                <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                <div class="h-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TripsComponent implements OnInit {
  trips: Trip[] = [];
  selectedStatus = '';
  loading = false;

  statuses = [
    { value: '', label: 'All Trips', icon: '📋' },
    { value: 'planning', label: 'Planning', icon: '📝' },
    { value: 'confirmed', label: 'Confirmed', icon: '✅' },
    { value: 'ongoing', label: 'Ongoing', icon: '✈️' },
    { value: 'completed', label: 'Completed', icon: '🎉' },
    { value: 'cancelled', label: 'Cancelled', icon: '❌' }
  ];

  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    this.loadTrips();
  }

  loadTrips(): void {
    this.loading = true;
    this.tripService.getMyTrips(this.selectedStatus).subscribe({
      next: (response) => {
        this.trips = response.trips;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading trips:', err);
        this.loading = false;
      }
    });
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.loadTrips();
  }

  getDestinationName(trip: Trip): string {
    if (typeof trip.destination === 'object' && trip.destination) {
      return trip.destination.name;
    }
    if (trip.customDestination) {
      return trip.customDestination.name;
    }
    return 'Unknown Destination';
  }

  getTripImage(trip: Trip): string {
    if (trip.coverImage) return trip.coverImage;
    if (typeof trip.destination === 'object' && trip.destination?.coverImage) {
      return trip.destination.coverImage;
    }
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';
  }

  getOwnerAvatar(trip: Trip): string {
    if (typeof trip.owner === 'object' && trip.owner) {
      return trip.owner.avatar || '/assets/default-avatar.png';
    }
    return '/assets/default-avatar.png';
  }

  getOwnerName(trip: Trip): string {
    if (typeof trip.owner === 'object' && trip.owner) {
      return trip.owner.name;
    }
    return 'Unknown';
  }

  getCollaborators(trip: Trip): any[] {
    return trip.collaborators ? trip.collaborators.slice(0, 2) : [];
  }

  getCollaboratorsCount(trip: Trip): number {
    return trip.collaborators ? trip.collaborators.length : 0;
  }

  getCollaboratorName(collab: any): string {
    if (typeof collab.user === 'object' && collab.user) {
      return collab.user.name;
    }
    return 'Unknown';
  }

  getCollaboratorInitials(collab: any): string {
    if (typeof collab.user === 'object' && collab.user) {
      const name = collab.user.name;
      return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return '??';
  }

  getBudgetPercentage(trip: Trip): number {
    if (!trip.budget.total) return 0;
    return Math.min((trip.budget.spent / trip.budget.total) * 100, 100);
  }

  getAnimationDelay(index: number): string {
    return `${index * 0.1}s`;
  }
}
