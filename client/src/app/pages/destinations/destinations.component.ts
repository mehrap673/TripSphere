import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DestinationService } from '../../services/destination.service';
import { Destination } from '../../models/destination.model';

@Component({
    selector: 'app-destinations',
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-12 animate-fade-up">
          <h1 class="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 bg-clip-text text-transparent mb-4">
            Discover Amazing Destinations
          </h1>
          <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore the world's most beautiful places and plan your next adventure
          </p>
        </div>

        <!-- Error Alert -->
        <div *ngIf="error" class="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-600 dark:text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-red-800 dark:text-red-200">{{ error }}</span>
          </div>
          <button (click)="error = null" class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Filters -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-up" style="animation-delay: 0.1s">
          <div class="grid md:grid-cols-4 gap-4">
            <!-- Search -->
            <div class="md:col-span-2">
              <div class="relative">
                <input type="text" 
                       [(ngModel)]="searchQuery"
                       (ngModelChange)="onSearch()"
                       placeholder="Search destinations..."
                       class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
                <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>

            <!-- Category -->
            <div>
              <select [(ngModel)]="selectedCategory"
                      (ngModelChange)="onFilterChange()"
                      class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none cursor-pointer">
                <option value="">All Categories</option>
                <option value="beach">Beach</option>
                <option value="mountain">Mountain</option>
                <option value="city">City</option>
                <option value="cultural">Cultural</option>
                <option value="adventure">Adventure</option>
                <option value="historical">Historical</option>
                <option value="nature">Nature</option>
                <option value="island">Island</option>
              </select>
            </div>

            <!-- Sort -->
            <div>
              <select [(ngModel)]="sortBy"
                      (ngModelChange)="onFilterChange()"
                      class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none cursor-pointer">
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>

          <!-- Amadeus Toggle -->
          <div class="mt-4 flex items-center justify-between flex-wrap gap-3">
            <label class="flex items-center cursor-pointer group">
              <input type="checkbox" 
                     [(ngModel)]="useAmadeus"
                     (ngModelChange)="onAmadeusToggle()"
                     class="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer">
              <span class="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                🔄 Use Live Amadeus Data
              </span>
            </label>
            
            <!-- Data Source Badge -->
            <span *ngIf="dataSource" 
                  class="px-3 py-1.5 text-xs font-semibold rounded-lg"
                  [ngClass]="getDataSourceBadge().color">
              {{ getDataSourceBadge().text }}
            </span>
          </div>

          <!-- Active Filters -->
          <div *ngIf="hasActiveFilters()" class="flex flex-wrap gap-2 mt-4">
            <span *ngIf="searchQuery" 
                  class="inline-flex items-center px-3 py-1.5 rounded-lg bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-sm font-medium">
              Search: {{searchQuery}}
              <button (click)="clearSearch()" class="ml-2 hover:text-primary-900 dark:hover:text-primary-100 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </span>
            <span *ngIf="selectedCategory" 
                  class="inline-flex items-center px-3 py-1.5 rounded-lg bg-secondary-100 dark:bg-secondary-900/40 text-secondary-700 dark:text-secondary-300 text-sm font-medium capitalize">
              {{selectedCategory}}
              <button (click)="clearCategory()" class="ml-2 hover:text-secondary-900 dark:hover:text-secondary-100 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </span>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <div *ngFor="let i of getLoadingArray()" class="animate-pulse">
            <div class="bg-gray-200 dark:bg-gray-800 rounded-2xl h-80"></div>
            <div class="mt-4 space-y-3">
              <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <!-- Destinations Grid -->
        <div *ngIf="!loading && destinations.length > 0" 
             class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-fade-up" 
             style="animation-delay: 0.2s">
          <div *ngFor="let destination of destinations; let i = index" 
               [routerLink]="['/destinations', destination._id]"
               class="group cursor-pointer"
               [style.animation-delay]="getAnimationDelay(i)">
            <div class="relative h-80 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl">
              <!-- Image -->
              <img [src]="getDestinationImage(destination)" 
                   [alt]="destination.name"
                   class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
              
              <!-- Gradient Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              
              <!-- Featured Badge -->
              <div *ngIf="destination.featured" 
                   class="absolute top-4 right-4 px-3 py-1.5 bg-yellow-400 text-yellow-900 rounded-lg text-xs font-bold flex items-center shadow-lg">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                Featured
              </div>

              <!-- Trending Badge -->
              <div *ngIf="destination.trending" 
                   class="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold flex items-center shadow-lg animate-pulse">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"></path>
                </svg>
                Trending
              </div>

              <!-- Amadeus Badge -->
              <div *ngIf="isAmadeusDestination(destination)" 
                   class="absolute top-4 left-4 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center shadow-lg">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                </svg>
                Live
              </div>

              <!-- Content -->
              <div class="absolute bottom-0 left-0 right-0 p-6">
                <!-- Rating -->
                <div class="flex items-center mb-3">
                  <div class="flex items-center">
                    <svg *ngFor="let star of getStarsArray()" 
                         class="w-4 h-4"
                         [class.text-yellow-400]="star <= (destination.rating?.average || 0)"
                         [class.text-gray-500]="star > (destination.rating?.average || 0)"
                         fill="currentColor" 
                         viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                  <span class="text-white font-semibold ml-2 drop-shadow-lg">{{getRatingFixed(destination)}}</span>
                  <span class="text-white/90 ml-2 drop-shadow-md">({{destination.rating?.count || 0}})</span>
                </div>

                <!-- Name & Location -->
                <h3 class="text-2xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors drop-shadow-lg">
                  {{destination.name}}
                </h3>
                <p class="text-white/95 flex items-center mb-3 drop-shadow-md">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  {{destination.country}}
                </p>

                <!-- Tags -->
                <div class="flex flex-wrap gap-2">
                  <span class="px-2 py-1 bg-white/25 backdrop-blur-sm rounded-lg text-xs text-white font-medium capitalize">
                    {{destination.category}}
                  </span>
                  <span *ngIf="destination.climate" 
                        class="px-2 py-1 bg-white/25 backdrop-blur-sm rounded-lg text-xs text-white font-medium capitalize">
                    {{destination.climate}}
                  </span>
                </div>
              </div>
            </div>

            <!-- Footer Info -->
            <div class="mt-4 flex items-center justify-between">
              <div class="text-sm text-gray-600 dark:text-gray-300">
                <span class="font-semibold text-gray-900 dark:text-white">
                  From \${{destination.averageCost?.budget || 0}}
                </span>
                <span class="mx-1.5 text-gray-400">•</span>
                <span>{{destination.views || 0}} views</span>
              </div>
              <button (click)="toggleFavorite($event, destination)" 
                      class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group/fav">
                <svg class="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover/fav:text-red-500 transition-colors" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && destinations.length === 0" 
             class="text-center py-20">
          <svg class="w-24 h-24 mx-auto text-gray-300 dark:text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">No destinations found</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">Try adjusting your filters or search query</p>
          <button (click)="resetFilters()" 
                  class="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:shadow-lg hover:shadow-primary-500/50 transition-all font-medium">
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    @keyframes fade-up {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fade-up {
      animation: fade-up 0.6s ease-out forwards;
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background: rgba(156, 163, 175, 0.5);
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: rgba(156, 163, 175, 0.7);
    }

    /* Dark mode scrollbar */
    .dark ::-webkit-scrollbar-thumb {
      background: rgba(75, 85, 99, 0.5);
    }

    .dark ::-webkit-scrollbar-thumb:hover {
      background: rgba(75, 85, 99, 0.7);
    }
  `]
})
export class DestinationsComponent implements OnInit {
  destinations: Destination[] = [];
  searchQuery = '';
  selectedCategory = '';
  sortBy = 'popular';
  loading = false;
  useAmadeus = false;
  dataSource = '';
  error: string | null = null;

  constructor(private destinationService: DestinationService) { }

  ngOnInit(): void {
    this.loadDestinations();
  }

  loadDestinations(): void {
    this.loading = true;
    this.error = null;
    
    this.destinationService.getDestinations({
      category: this.selectedCategory,
      search: this.searchQuery,
      sort: this.sortBy,
      useAmadeus: this.useAmadeus,
      limit: 50
    }).subscribe({
      next: (response) => {
        this.destinations = response.destinations || [];
        this.dataSource = response.source || 'database';
        this.loading = false;
        console.log('✅ Loaded destinations:', {
          count: this.destinations.length,
          source: this.dataSource
        });
      },
      error: (err) => {
        console.error('❌ Error loading destinations:', err);
        this.error = 'Failed to load destinations. Please try again.';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.loadDestinations();
  }

  onFilterChange(): void {
    this.loadDestinations();
  }

  onAmadeusToggle(): void {
    this.loadDestinations();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.loadDestinations();
  }

  clearCategory(): void {
    this.selectedCategory = '';
    this.loadDestinations();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.sortBy = 'popular';
    this.useAmadeus = false;
    this.loadDestinations();
  }

  hasActiveFilters(): boolean {
    return !!(this.selectedCategory || this.searchQuery);
  }

  getLoadingArray(): number[] {
    return [1, 2, 3, 4, 5, 6];
  }

  getStarsArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  getDestinationImage(destination: Destination): string {
    return destination.coverImage || 
           (destination.images && destination.images[0]) || 
           'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800';
  }

  getRatingFixed(destination: Destination): string {
    return (destination.rating?.average || 0).toFixed(1);
  }

  getAnimationDelay(index: number): string {
    return `${index * 0.05}s`;
  }

  toggleFavorite(event: Event, destination: Destination): void {
    event.preventDefault();
    event.stopPropagation();
    console.log('Toggle favorite for:', destination.name);
    // TODO: Implement favorite functionality with backend
  }

  isAmadeusDestination(destination: any): boolean {
    return destination.dataSource === 'amadeus' || 
           destination.dataSource === 'hybrid';
  }

  getDataSourceBadge(): { text: string; color: string } {
    switch (this.dataSource) {
      case 'hybrid':
      case 'amadeus_enriched':
        return { 
          text: '🌐 Live Data', 
          color: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' 
        };
      case 'amadeus':
        return { 
          text: '🌍 Amadeus', 
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' 
        };
      default:
        return { 
          text: '💾 Database', 
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300' 
        };
    }
  }
}
