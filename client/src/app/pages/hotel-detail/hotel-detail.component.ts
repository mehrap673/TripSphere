import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HotelService } from '../../services/hotel.service';
import { Hotel } from '../../models/hotel.model';

@Component({
    selector: 'app-hotel-detail',
    imports: [CommonModule, RouterModule],
    template: `
    <div class="min-h-screen bg-white dark:bg-gray-950" *ngIf="hotel">
      <!-- Sticky Navigation Bar -->
      <div class="sticky top-16 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between py-4">
            <button routerLink="/hotels" class="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Back to Hotels
            </button>
            <div class="flex items-center gap-3">
              <button class="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                </svg>
              </button>
              <button class="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </button>
              <button class="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold">
                Reserve Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Full-Width Image Gallery -->
      <section class="relative">
        <div class="grid grid-cols-4 gap-2 h-[600px]">
          <!-- Main Large Image -->
          <div class="col-span-2 row-span-2 relative overflow-hidden group cursor-pointer">
            <img [src]="hotel.coverImage" 
                 [alt]="hotel.name"
                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                 onerror="this.src='https://images.unsplash.com/photo-1566073771259-6a8506099945'">
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          
          <!-- Smaller Images -->
          <div *ngFor="let image of hotel.images.slice(0, 4); let i = index" class="relative overflow-hidden group cursor-pointer">
            <img [src]="image" 
                 [alt]="hotel.name + ' - Image ' + (i + 1)"
                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                 onerror="this.src='https://images.unsplash.com/photo-1566073771259-6a8506099945'">
            <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
          </div>
        </div>
        
        <!-- View All Photos Button -->
        <button class="absolute bottom-6 right-6 px-5 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-xl hover:shadow-2xl transition-all font-medium flex items-center border border-gray-200 dark:border-gray-700">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          View All {{ hotel.images.length }} Photos
        </button>

        <!-- Status Badges -->
        <div class="absolute top-6 left-6 flex flex-col gap-2">
          <span *ngIf="hotel.featured" class="px-4 py-2 bg-amber-500 text-white text-sm font-bold rounded-lg shadow-lg backdrop-blur-sm flex items-center w-fit">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            Featured Property
          </span>
          <span *ngIf="hotel.verified" class="px-4 py-2 bg-emerald-500 text-white text-sm font-bold rounded-lg shadow-lg backdrop-blur-sm flex items-center w-fit">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
            Verified Hotel
          </span>
        </div>
      </section>

      <!-- Main Content Container -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-3 gap-8 py-12">
          <!-- Left Content - 2 Columns -->
          <div class="lg:col-span-2 space-y-10">
            <!-- Header Section -->
            <div class="animate-fade-up">
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-3">
                    <span class="px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-semibold capitalize border border-indigo-200 dark:border-indigo-800">
                      {{ hotel.category }}
                    </span>
                    <div class="flex">
                      <span *ngFor="let star of getStarArray(hotel.rating.stars)" class="text-amber-400 text-lg">★</span>
                    </div>
                  </div>
                  <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                    {{ hotel.name }}
                  </h1>
                  <div class="flex items-center text-gray-600 dark:text-gray-400">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span class="text-base">{{ hotel.address }}</span>
                  </div>
                </div>
              </div>

              <!-- Rating Bar -->
              <div class="flex items-center gap-6 p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200 dark:border-amber-800">
                <div class="flex items-center">
                  <div class="flex items-center justify-center w-16 h-16 bg-amber-500 rounded-xl mr-4">
                    <span class="text-3xl font-bold text-white">{{ hotel.rating.averageScore }}</span>
                  </div>
                  <div>
                    <div class="text-xl font-bold text-gray-900 dark:text-white">Excellent</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">{{ hotel.rating.reviews }} verified reviews</div>
                  </div>
                </div>
                <div class="flex-1 border-l border-amber-300 dark:border-amber-700 pl-6">
                  <div class="flex items-center gap-2 mb-1">
                    <div class="flex-1 h-2 bg-amber-200 dark:bg-amber-900 rounded-full overflow-hidden">
                      <div class="h-full bg-amber-500" [style.width.%]="(hotel.rating.averageScore / 5) * 100"></div>
                    </div>
                    <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ ((hotel.rating.averageScore / 5) * 100).toFixed(0) }}%</span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Guest satisfaction rate</p>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="animate-fade-up" style="animation-delay: 0.1s">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <span class="w-1 h-8 bg-gradient-to-b from-primary-600 to-secondary-600 rounded-full mr-3"></span>
                About This Property
              </h2>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                {{ hotel.description }}
              </p>
            </div>

            <!-- Amenities Grid -->
            <div class="animate-fade-up" style="animation-delay: 0.2s">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span class="w-1 h-8 bg-gradient-to-b from-primary-600 to-secondary-600 rounded-full mr-3"></span>
                Amenities & Services
              </h2>
              <div class="grid md:grid-cols-2 gap-4">
                <div *ngFor="let amenity of hotel.amenities" 
                     class="flex items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 transition-all group">
                  <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span class="text-gray-700 dark:text-gray-300 font-medium">{{ amenity }}</span>
                </div>
              </div>
            </div>

            <!-- Room Types Section -->
            <div class="animate-fade-up" style="animation-delay: 0.3s">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span class="w-1 h-8 bg-gradient-to-b from-primary-600 to-secondary-600 rounded-full mr-3"></span>
                Available Rooms
              </h2>
              <div class="space-y-6">
                <div *ngFor="let room of hotel.roomTypes; let i = index" 
                     class="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer"
                     [class.border-primary-500]="selectedRoomType === room"
                     [class.border-gray-200]="selectedRoomType !== room"
                     [class.dark:border-primary-500]="selectedRoomType === room"
                     [class.dark:border-gray-800]="selectedRoomType !== room"
                     (click)="selectRoomType(room)">
                  
                  <div class="grid md:grid-cols-5 gap-6 p-6">
                    <!-- Room Image -->
                    <div class="md:col-span-2">
                      <div class="relative h-48 rounded-xl overflow-hidden">
                        <img [src]="hotel.images[i % hotel.images.length]" 
                             [alt]="room.name"
                             class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                        <div class="absolute top-3 right-3 px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-xs font-bold text-gray-900 dark:text-white">
                          {{ room.capacity }} Guests
                        </div>
                      </div>
                    </div>

                    <!-- Room Details -->
                    <div class="md:col-span-3 flex flex-col justify-between">
                      <div>
                        <div class="flex items-start justify-between mb-3">
                          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ room.name }}</h3>
                          <div class="text-right">
                            <div class="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                              \${{ room.price }}
                            </div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">per night</div>
                          </div>
                        </div>
                        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ room.description }}</p>
                        
                        <!-- Room Specs -->
                        <div class="flex flex-wrap gap-3 mb-4">
                          <span class="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium border border-blue-200 dark:border-blue-800 flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                            </svg>
                            {{ room.size }}
                          </span>
                          <span class="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium border border-purple-200 dark:border-purple-800 flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
                            </svg>
                            {{ room.beds }}
                          </span>
                          <span class="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium border border-green-200 dark:border-green-800 flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            Sleeps {{ room.capacity }}
                          </span>
                        </div>

                        <!-- Features -->
                        <div class="flex flex-wrap gap-2">
                          <span *ngFor="let feature of room.features" 
                                class="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-700">
                            {{ feature }}
                          </span>
                        </div>
                      </div>

                      <!-- Select Button -->
                      <button class="mt-4 w-full py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center group/btn"
                              [class.ring-2]="selectedRoomType === room"
                              [class.ring-primary-500]="selectedRoomType === room">
                        <span *ngIf="selectedRoomType !== room">Select Room</span>
                        <span *ngIf="selectedRoomType === room" class="flex items-center">
                          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          Selected
                        </span>
                        <svg class="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Policies Section -->
            <div class="animate-fade-up" style="animation-delay: 0.4s">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span class="w-1 h-8 bg-gradient-to-b from-primary-600 to-secondary-600 rounded-full mr-3"></span>
                Hotel Policies
              </h2>
              <div class="grid md:grid-cols-2 gap-6">
                <div class="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                  <div class="flex items-center mb-3">
                    <div class="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center mr-4">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="font-bold text-gray-900 dark:text-white">Check-in</div>
                      <div class="text-gray-600 dark:text-gray-300">{{ hotel.policies.checkIn }}</div>
                    </div>
                  </div>
                </div>

                <div class="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-800">
                  <div class="flex items-center mb-3">
                    <div class="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center mr-4">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="font-bold text-gray-900 dark:text-white">Check-out</div>
                      <div class="text-gray-600 dark:text-gray-300">{{ hotel.policies.checkOut }}</div>
                    </div>
                  </div>
                </div>

                <div class="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800">
                  <div class="flex items-center mb-3">
                    <div class="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center mr-4">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="font-bold text-gray-900 dark:text-white">Cancellation</div>
                      <div class="text-gray-600 dark:text-gray-300">{{ hotel.policies.cancellation }}</div>
                    </div>
                  </div>
                </div>

                <div class="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-200 dark:border-orange-800">
                  <div class="flex items-center mb-3">
                    <div class="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center mr-4">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="font-bold text-gray-900 dark:text-white">Children & Pets</div>
                      <div class="text-gray-600 dark:text-gray-300 text-sm">{{ hotel.policies.children }} • {{ hotel.policies.pets }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Sidebar - Sticky Booking Card -->
          <div class="lg:col-span-1">
            <div class="sticky top-32 space-y-6">
              <!-- Price Card -->
              <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border-2 border-gray-200 dark:border-gray-800 animate-fade-up">
                <div class="text-center mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                  <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">Starting from</div>
                  <div class="text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-1">
                    \${{ hotel.priceRange.min }}
                  </div>
                  <div class="text-gray-600 dark:text-gray-400">per night</div>
                  <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Up to \${{ hotel.priceRange.max }} for premium rooms
                  </div>
                </div>

                <div class="space-y-4 mb-6">
                  <button class="w-full py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl hover:shadow-2xl hover:shadow-primary-500/50 transition-all font-bold text-lg flex items-center justify-center group">
                    Reserve Now
                    <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </button>
                  <button class="w-full py-4 border-2 border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-400 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all font-semibold flex items-center justify-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    Contact Hotel
                  </button>
                </div>

                <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                  <div class="flex items-center text-green-700 dark:text-green-400 mb-2">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="font-semibold">Free cancellation</span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Cancel up to 24 hours before check-in</p>
                </div>
              </div>

              <!-- Contact Information -->
              <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Contact Information</h3>
                <div class="space-y-4">
                  <a [href]="'tel:' + hotel.contactInfo.phone" class="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group">
                    <div class="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">Phone</div>
                      <div class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">{{ hotel.contactInfo.phone }}</div>
                    </div>
                  </a>
                  <a [href]="'mailto:' + hotel.contactInfo.email" class="flex items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group">
                    <div class="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">Email</div>
                      <div class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 break-all">{{ hotel.contactInfo.email }}</div>
                    </div>
                  </a>
                </div>
              </div>

              <!-- Trust Badges -->
              <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h4 class="font-bold text-gray-900 dark:text-white mb-4 text-center">Why Book With Us?</h4>
                <div class="space-y-3">
                  <div class="flex items-center text-gray-700 dark:text-gray-300">
                    <svg class="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="text-sm">Best price guarantee</span>
                  </div>
                  <div class="flex items-center text-gray-700 dark:text-gray-300">
                    <svg class="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="text-sm">Instant confirmation</span>
                  </div>
                  <div class="flex items-center text-gray-700 dark:text-gray-300">
                    <svg class="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="text-sm">24/7 customer support</span>
                  </div>
                  <div class="flex items-center text-gray-700 dark:text-gray-300">
                    <svg class="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="text-sm">Secure payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div *ngIf="loading" class="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <div class="text-center">
        <div class="inline-block relative mb-8">
          <div class="w-24 h-24 border-4 border-gray-200 dark:border-gray-800 rounded-full"></div>
          <div class="w-24 h-24 border-4 border-primary-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p class="text-gray-600 dark:text-gray-400 text-lg font-medium">Loading hotel details...</p>
      </div>
    </div>
  `
})
export class HotelDetailComponent implements OnInit {
  hotel: Hotel | null = null;
  loading = false;
  selectedRoomType: any = null;

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadHotel(id);
    });
  }

  loadHotel(id: string): void {
    this.loading = true;
    this.hotelService.getHotelById(id).subscribe({
      next: (response) => {
        this.hotel = response.hotel || response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading hotel:', error);
        this.loading = false;
      }
    });
  }

  selectRoomType(roomType: any): void {
    this.selectedRoomType = roomType;
  }

  getStarArray(stars: number): number[] {
    return Array(stars).fill(0);
  }
}
