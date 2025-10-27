import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivityService } from '../../services/activity.service';
import { Activity } from '../../models/activity.model';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <!-- Header -->
        <div class="text-center mb-12 animate-fade-up">
          <h1 class="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 bg-clip-text text-transparent mb-4">
            Discover Amazing Activities
          </h1>
          <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find exciting things to do at your destination - from thrilling adventures to cultural experiences
          </p>
        </div>

        <!-- Filters -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-up" style="animation-delay: 0.1s">
          <div class="grid md:grid-cols-4 gap-4">
            <!-- Search -->
            <div class="md:col-span-2">
              <div class="relative">
                <input type="text" 
                       [(ngModel)]="searchQuery"
                       (ngModelChange)="onSearchChange()"
                       placeholder="Search activities..."
                       class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
                <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>

            <!-- Type Filter -->
            <div>
              <select [(ngModel)]="selectedType"
                      (ngModelChange)="onTypeChange()"
                      class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none cursor-pointer">
                <option value="">All Types</option>
                <option *ngFor="let type of activityTypes" [value]="type">
                  {{ type | titlecase }}
                </option>
              </select>
            </div>

            <!-- Sort -->
            <div>
              <select class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none cursor-pointer">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: High to Low</option>
                <option>Duration: Shortest</option>
              </select>
            </div>
          </div>

          <!-- Active Filters -->
          <div *ngIf="searchQuery || selectedType" class="flex flex-wrap gap-2 mt-4">
            <span *ngIf="searchQuery" 
                  class="inline-flex items-center px-3 py-1.5 rounded-lg bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-sm font-medium">
              Search: {{searchQuery}}
              <button (click)="searchQuery = ''; onSearchChange()" class="ml-2 hover:text-primary-900 dark:hover:text-primary-100 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </span>
            <span *ngIf="selectedType" 
                  class="inline-flex items-center px-3 py-1.5 rounded-lg bg-secondary-100 dark:bg-secondary-900/40 text-secondary-700 dark:text-secondary-300 text-sm font-medium capitalize">
              {{selectedType}}
              <button (click)="selectedType = ''; onTypeChange()" class="ml-2 hover:text-secondary-900 dark:hover:text-secondary-100 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </span>
            <button (click)="clearFilters()" class="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium">
              Clear all
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <div *ngFor="let i of [1,2,3,4,5,6]" class="animate-pulse">
            <div class="bg-gray-200 dark:bg-gray-800 rounded-2xl h-80"></div>
            <div class="mt-4 space-y-3">
              <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <!-- Activities Grid -->
        <div *ngIf="!loading && filteredActivities.length > 0" 
             class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-fade-up" 
             style="animation-delay: 0.2s">
          <div *ngFor="let activity of filteredActivities; let i = index"
               class="group cursor-pointer"
               [style.animation-delay]="(i * 0.05) + 's'">
            <!-- Activity Card -->
            <div [routerLink]="['/activities', activity._id]">
              <div class="relative h-80 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl">
                <!-- Image -->
                <img [src]="activity.coverImage || activity.images[0]" 
                     [alt]="activity.name"
                     class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                     onerror="this.src='https://images.unsplash.com/photo-1469854523086-cc02fe5d8800'">
                
                <!-- Gradient Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                
                <!-- Top Badges -->
                <div class="absolute top-4 left-4 flex flex-col gap-2">
                  <span *ngIf="activity.featured" class="px-3 py-1.5 bg-yellow-400 text-yellow-900 rounded-lg text-xs font-bold flex items-center shadow-lg w-fit">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    Featured
                  </span>
                  <span *ngIf="activity.verified" class="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-bold flex items-center shadow-lg w-fit">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Verified
                  </span>
                </div>

                <!-- Type & Difficulty -->
                <div class="absolute top-4 right-4 flex flex-col gap-2">
                  <span class="px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white rounded-lg text-xs font-semibold capitalize border border-gray-200 dark:border-gray-700 shadow-lg">
                    {{ activity.type }}
                  </span>
                  <span [class]="getDifficultyColor(activity.difficulty)" class="px-3 py-1.5 text-xs font-bold rounded-lg capitalize shadow-lg backdrop-blur-sm">
                    {{ activity.difficulty }}
                  </span>
                </div>

                <!-- Content -->
                <div class="absolute bottom-0 left-0 right-0 p-6">
                  <!-- Rating & Duration -->
                  <div class="flex items-center mb-3 gap-4">
                    <div class="flex items-center">
                      <svg class="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <span class="text-white font-semibold drop-shadow-lg">{{ activity.rating.average }}</span>
                      <span class="text-white/90 ml-1 drop-shadow-md">({{ activity.rating.count }})</span>
                    </div>
                    <div class="flex items-center text-white/95">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span class="text-sm drop-shadow-md">{{ activity.duration }}</span>
                    </div>
                  </div>

                  <!-- Name -->
                  <h3 class="text-2xl font-bold text-white mb-3 group-hover:text-yellow-300 transition-colors drop-shadow-lg line-clamp-2">
                    {{ activity.name }}
                  </h3>

                  <!-- Tags -->
                  <div class="flex flex-wrap gap-2">
                    <span *ngFor="let tag of activity.tags.slice(0, 2)" 
                          class="px-2 py-1 bg-white/25 backdrop-blur-sm rounded-lg text-xs text-white font-medium">
                      {{ tag }}
                    </span>
                    <span *ngIf="activity.tags.length > 2"
                          class="px-2 py-1 bg-white/25 backdrop-blur-sm rounded-lg text-xs text-white font-medium">
                      +{{ activity.tags.length - 2 }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Footer Info -->
              <div class="mt-4 flex items-center justify-between">
                <div class="text-sm text-gray-600 dark:text-gray-300">
                  <span class="font-semibold text-gray-900 dark:text-white">{{ activity.pricing.currency }} {{ activity.pricing.amount }}</span>
                  <span class="mx-1.5 text-gray-400">/{{ activity.pricing.priceType }}</span>
                </div>
                <button (click)="toggleFavorite($event, activity)" 
                        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group/fav">
                  <svg class="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover/fav:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && filteredActivities.length === 0" 
             class="text-center py-20">
          <svg class="w-24 h-24 mx-auto text-gray-300 dark:text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">No activities found</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">Try adjusting your filters or search query</p>
          <button (click)="clearFilters()" 
                  class="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:shadow-lg hover:shadow-primary-500/50 transition-all font-medium">
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  `
})
export class ActivitiesComponent implements OnInit {
  activities: Activity[] = [];
  filteredActivities: Activity[] = [];
  loading = false;
  searchQuery = '';
  selectedType = '';
  activityTypes = [
    'sightseeing', 'restaurant', 'adventure', 'cultural', 
    'shopping', 'nightlife', 'nature', 'sports', 
    'wellness', 'entertainment'
  ];

  constructor(private activityService: ActivityService) {}

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    this.loading = true;
    this.activityService.getActivities().subscribe({
      next: (response) => {
        this.activities = response.activities || response;
        this.filteredActivities = this.activities;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading activities:', error);
        this.loading = false;
      }
    });
  }

  filterActivities(): void {
    this.filteredActivities = this.activities.filter(activity => {
      const matchesSearch = activity.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                           activity.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesType = !this.selectedType || activity.type === this.selectedType;
      return matchesSearch && matchesType;
    });
  }

  onSearchChange(): void {
    this.filterActivities();
  }

  onTypeChange(): void {
    this.filterActivities();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedType = '';
    this.filteredActivities = this.activities;
  }

  getDifficultyColor(difficulty: string): string {
    const colors: any = {
      'easy': 'bg-green-500/90 text-white',
      'moderate': 'bg-yellow-500/90 text-white',
      'challenging': 'bg-orange-500/90 text-white',
      'hard': 'bg-orange-500/90 text-white',
      'extreme': 'bg-red-500/90 text-white'
    };
    return colors[difficulty?.toLowerCase()] || 'bg-gray-500/90 text-white';
  }

  toggleFavorite(event: Event, activity: Activity): void {
    event.preventDefault();
    event.stopPropagation();
    console.log('Toggle favorite for:', activity.name);
    // TODO: Implement favorite functionality
  }
}
