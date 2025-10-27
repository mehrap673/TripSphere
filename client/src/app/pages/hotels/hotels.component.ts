import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HotelService } from '../../services/hotel.service';
import { Hotel } from '../../models/hotel.model';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
      <!-- Hero Search Section -->
      <section class="relative bg-gradient-to-br from-primary-600 via-secondary-600 to-pink-600 pt-24 pb-16">
        <div class="absolute inset-0 bg-black/20"></div>
        <div class="absolute inset-0">
          <div class="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full filter blur-3xl animate-float"></div>
          <div class="absolute bottom-10 right-20 w-96 h-96 bg-white/10 rounded-full filter blur-3xl animate-float" style="animation-delay: 2s"></div>
        </div>
        
        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-8 animate-fade-up">
            <h1 class="text-5xl md:text-6xl font-display font-bold text-white mb-4 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
              Find Your Perfect Stay
            </h1>
            <p class="text-xl text-white/90 drop-shadow-lg">
              Discover luxury hotels, boutique resorts, and exclusive accommodations worldwide
            </p>
          </div>

          <!-- Advanced Search Bar -->
          <div class="max-w-5xl mx-auto animate-fade-up" style="animation-delay: 0.1s">
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-gray-700">
              <div class="grid md:grid-cols-12 gap-4">
                <!-- Search Input -->
                <div class="md:col-span-6 relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    [(ngModel)]="searchQuery"
                    (ngModelChange)="onSearchChange()"
                    placeholder="Search by name, location, or amenity..."
                    class="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>

                <!-- Category Filter -->
                <div class="md:col-span-4 relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                  <select
                    [(ngModel)]="selectedCategory"
                    (ngModelChange)="onCategoryChange()"
                    class="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer transition-all"
                  >
                    <option value="">All Categories</option>
                    <option *ngFor="let category of categories" [value]="category">
                      {{ category | titlecase }}
                    </option>
                  </select>
                </div>

                <!-- Search Button -->
                <div class="md:col-span-2">
                  <button class="w-full h-full px-6 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-primary-500/50 transition-all duration-300 flex items-center justify-center">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Active Filters -->
              <div *ngIf="searchQuery || selectedCategory" class="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span class="text-sm text-gray-600 dark:text-gray-400 font-medium">Active filters:</span>
                <div class="flex flex-wrap gap-2">
                  <span *ngIf="searchQuery" class="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium flex items-center">
                    {{ searchQuery }}
                    <button (click)="searchQuery = ''; onSearchChange()" class="ml-2 hover:text-primary-900 dark:hover:text-primary-100">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </span>
                  <span *ngIf="selectedCategory" class="px-3 py-1 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 rounded-full text-sm font-medium flex items-center">
                    {{ selectedCategory | titlecase }}
                    <button (click)="selectedCategory = ''; onCategoryChange()" class="ml-2 hover:text-secondary-900 dark:hover:text-secondary-100">
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
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-6 max-w-3xl mx-auto mt-12 animate-fade-up" style="animation-delay: 0.2s">
            <div class="text-center">
              <div class="text-3xl font-bold text-white mb-1 drop-shadow-lg">{{ filteredHotels.length }}+</div>
              <div class="text-white/80 text-sm drop-shadow-md">Hotels Available</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-white mb-1 drop-shadow-lg">150+</div>
              <div class="text-white/80 text-sm drop-shadow-md">Destinations</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-white mb-1 drop-shadow-lg">98%</div>
              <div class="text-white/80 text-sm drop-shadow-md">Guest Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Hotels Section -->
      <section class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Section Header -->
          <div class="flex items-center justify-between mb-8">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {{ filteredHotels.length }} Hotels Found
              </h2>
              <p class="text-gray-600 dark:text-gray-400">
                Showing the best accommodations for your search
              </p>
            </div>
            
            <!-- Sort Dropdown -->
            <select class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating: High to Low</option>
              <option>Most Popular</option>
            </select>
          </div>

          <!-- Loading State -->
          <div *ngIf="loading" class="text-center py-20">
            <div class="inline-block relative mb-8">
              <div class="w-20 h-20 border-4 border-primary-200 dark:border-primary-900 rounded-full"></div>
              <div class="w-20 h-20 border-4 border-primary-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p class="text-gray-600 dark:text-gray-400 text-lg">Discovering perfect stays for you...</p>
          </div>

          <!-- Hotels Grid -->
          <div *ngIf="!loading && filteredHotels.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div *ngFor="let hotel of filteredHotels; let i = index"
                 class="group cursor-pointer animate-fade-up"
                 [style.animation-delay]="(i * 0.05) + 's'">
              <!-- Hotel Card -->
              <div [routerLink]="['/hotels', hotel._id]"
                   class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:scale-[1.02] hover:-translate-y-1">
                
                <!-- Image Section -->
                <div class="relative h-64 overflow-hidden">
                  <img [src]="hotel.coverImage || hotel.images[0]" 
                       [alt]="hotel.name"
                       class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                       onerror="this.src='https://images.unsplash.com/photo-1566073771259-6a8506099945'">
                  
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  <!-- Top Badges -->
                  <div class="absolute top-4 left-4 flex flex-col gap-2">
                    <span *ngIf="hotel.featured" class="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center w-fit">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      Featured
                    </span>
                    <span *ngIf="hotel.verified" class="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center w-fit">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Verified
                    </span>
                  </div>

                  <!-- Category Badge -->
                  <div class="absolute top-4 right-4">
                    <span class="px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white text-xs font-semibold rounded-full shadow-lg capitalize border border-gray-200 dark:border-gray-700">
                      {{ hotel.category }}
                    </span>
                  </div>

                  <!-- Star Rating Badge -->
                  <div class="absolute bottom-4 left-4">
                    <div class="flex items-center bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <span class="font-bold text-gray-900 dark:text-white text-sm">{{ hotel.rating.averageScore }}</span>
                        <span class="text-xs text-gray-600 dark:text-gray-400 ml-1">({{ hotel.rating.reviews }})</span>
                      </div>
                      <span class="mx-2 text-gray-300 dark:text-gray-600">|</span>
                      <div class="flex">
                        <span *ngFor="let star of [1,2,3,4,5].slice(0, hotel.rating.stars)" class="text-yellow-500 text-xs">★</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Content Section -->
                <div class="p-6">
                  <!-- Hotel Name -->
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {{ hotel.name }}
                  </h3>

                  <!-- Location -->
                  <div class="flex items-start text-gray-600 dark:text-gray-400 mb-4">
                    <svg class="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span class="text-sm line-clamp-2">{{ hotel.address }}</span>
                  </div>

                  <!-- Amenities Tags -->
                  <div class="flex flex-wrap gap-2 mb-5">
                    <span *ngFor="let amenity of hotel.amenities.slice(0, 4)"
                          class="px-3 py-1.5 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-xs rounded-lg font-medium border border-gray-200 dark:border-gray-700">
                      {{ amenity }}
                    </span>
                    <span *ngIf="hotel.amenities.length > 4"
                          class="px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-lg font-medium border border-primary-200 dark:border-primary-700">
                      +{{ hotel.amenities.length - 4 }}
                    </span>
                  </div>

                  <!-- Price & CTA -->
                  <div class="flex items-center justify-between pt-5 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Starting from</p>
                      <div class="flex items-baseline">
                        <span class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                          {{ hotel.priceRange.currency }} {{ hotel.priceRange.min }}
                        </span>
                        <span class="text-sm text-gray-600 dark:text-gray-400 ml-1">/night</span>
                      </div>
                    </div>
                    <button class="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:shadow-lg hover:shadow-primary-500/50 transition-all duration-300 text-sm font-semibold flex items-center group/btn">
                      View Details
                      <svg class="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No Results State -->
          <div *ngIf="!loading && filteredHotels.length === 0" class="text-center py-20">
            <div class="inline-block p-8 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
              <svg class="w-20 h-20 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Hotels Found</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              We couldn't find any hotels matching your criteria. Try adjusting your search filters or explore all available options.
            </p>
            <button (click)="clearFilters()" class="px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/50 transition-all duration-300 inline-flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Clear All Filters
            </button>
          </div>

          <!-- Pagination -->
          <div *ngIf="!loading && filteredHotels.length > 0" class="flex justify-center mt-12">
            <div class="flex items-center gap-2">
              <button class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <button class="px-4 py-2 rounded-lg bg-primary-500 text-white font-semibold">1</button>
              <button class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">2</button>
              <button class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">3</button>
              <button class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class HotelsComponent implements OnInit {
  hotels: Hotel[] = [];
  filteredHotels: Hotel[] = [];
  loading = false;
  searchQuery = '';
  selectedCategory = '';
  categories = ['hotel', 'resort', 'hostel', 'apartment', 'villa', 'guesthouse'];

  constructor(private hotelService: HotelService) {}

  ngOnInit(): void {
    this.loadHotels();
  }

  loadHotels(): void {
    this.loading = true;
    this.hotelService.getHotels().subscribe({
      next: (response) => {
        this.hotels = response.hotels || response;
        this.filteredHotels = this.hotels;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading hotels:', error);
        this.loading = false;
      }
    });
  }

  filterHotels(): void {
    this.filteredHotels = this.hotels.filter(hotel => {
      const matchesSearch = hotel.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                           hotel.address.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = !this.selectedCategory || hotel.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  onSearchChange(): void {
    this.filterHotels();
  }

  onCategoryChange(): void {
    this.filterHotels();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.filteredHotels = this.hotels;
  }
}
