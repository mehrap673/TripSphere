import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ActivityService } from '../../services/activity.service';
import { Activity } from '../../models/activity.model';

@Component({
  selector: 'app-activity-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-white dark:bg-gray-950" *ngIf="activity">
      <!-- Sticky Navigation Bar -->
      <div class="sticky top-16 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between py-4">
            <button routerLink="/activities" class="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Back to Activities
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
              <button *ngIf="activity.bookingRequired" class="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Hero Image Gallery -->
      <section class="relative">
        <div class="grid grid-cols-4 gap-2 h-[600px]">
          <div class="col-span-2 row-span-2 relative overflow-hidden group cursor-pointer">
            <img [src]="activity.coverImage" 
                 [alt]="activity.name"
                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                 onerror="this.src='https://images.unsplash.com/photo-1469854523086-cc02fe5d8800'">
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          
          <div *ngFor="let image of activity.images.slice(0, 4); let i = index" class="relative overflow-hidden group cursor-pointer">
            <img [src]="image" 
                 [alt]="activity.name + ' - Image ' + (i + 1)"
                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                 onerror="this.src='https://images.unsplash.com/photo-1469854523086-cc02fe5d8800'">
            <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
          </div>
        </div>
        
        <button class="absolute bottom-6 right-6 px-5 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-xl hover:shadow-2xl transition-all font-medium flex items-center border border-gray-200 dark:border-gray-700">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          View All {{ activity.images.length }} Photos
        </button>

        <div class="absolute top-6 left-6 flex flex-col gap-2">
          <span *ngIf="activity.featured" class="px-4 py-2 bg-amber-500 text-white text-sm font-bold rounded-lg shadow-lg backdrop-blur-sm flex items-center w-fit">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            Featured Activity
          </span>
          <span *ngIf="activity.verified" class="px-4 py-2 bg-emerald-500 text-white text-sm font-bold rounded-lg shadow-lg backdrop-blur-sm flex items-center w-fit">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
            Verified Activity
          </span>
          <span [class]="getDifficultyBadgeColor(activity.difficulty)" class="px-4 py-2 text-sm font-bold rounded-lg shadow-lg backdrop-blur-sm flex items-center w-fit capitalize">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            {{ activity.difficulty }} Level
          </span>
        </div>
      </section>

      <!-- Main Content Container -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-3 gap-8 py-12">
          <!-- Left Content -->
          <div class="lg:col-span-2 space-y-10">
            <!-- Header Section -->
            <div class="animate-fade-up">
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-3">
                    <span class="px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-semibold capitalize border border-indigo-200 dark:border-indigo-800">
                      {{ activity.type }}
                    </span>
                    <div class="flex items-center">
                      <svg class="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span class="text-gray-700 dark:text-gray-300 font-medium">{{ activity.duration }}</span>
                    </div>
                  </div>
                  <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                    {{ activity.name }}
                  </h1>
                  <div class="flex items-center text-gray-600 dark:text-gray-400">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span class="text-base">{{ activity.location.address }}</span>
                  </div>
                </div>
              </div>

              <!-- Rating Bar -->
              <div class="flex items-center gap-6 p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200 dark:border-amber-800">
                <div class="flex items-center">
                  <div class="flex items-center justify-center w-16 h-16 bg-amber-500 rounded-xl mr-4">
                    <span class="text-3xl font-bold text-white">{{ activity.rating.average }}</span>
                  </div>
                  <div>
                    <div class="text-xl font-bold text-gray-900 dark:text-white">Excellent</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">{{ activity.rating.count }} verified reviews</div>
                  </div>
                </div>
                <div class="flex-1 border-l border-amber-300 dark:border-amber-700 pl-6">
                  <div class="flex items-center gap-2 mb-1">
                    <div class="flex-1 h-2 bg-amber-200 dark:bg-amber-900 rounded-full overflow-hidden">
                      <div class="h-full bg-amber-500" [style.width.%]="(activity.rating.average / 5) * 100"></div>
                    </div>
                    <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ ((activity.rating.average / 5) * 100).toFixed(0) }}%</span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Guest satisfaction rate</p>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="animate-fade-up" style="animation-delay: 0.1s">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <span class="w-1 h-8 bg-gradient-to-b from-primary-600 to-secondary-600 rounded-full mr-3"></span>
                About This Activity
              </h2>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                {{ activity.description }}
              </p>
              
              <div class="flex flex-wrap gap-2 mt-4">
                <span *ngFor="let tag of activity.tags" 
                      class="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium border border-primary-200 dark:border-primary-800">
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- What's Included -->
            <div class="animate-fade-up" style="animation-delay: 0.2s">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span class="w-1 h-8 bg-gradient-to-b from-primary-600 to-secondary-600 rounded-full mr-3"></span>
                What's Included
              </h2>
              <div class="grid md:grid-cols-2 gap-4">
                <div *ngFor="let item of activity.includes" 
                     class="flex items-start p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-800 hover:border-green-500 dark:hover:border-green-500 transition-all group">
                  <div class="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform flex-shrink-0">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span class="text-gray-700 dark:text-gray-300 font-medium">{{ item }}</span>
                </div>
              </div>
            </div>

            <!-- What's Not Included -->
            <div class="animate-fade-up" style="animation-delay: 0.3s">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span class="w-1 h-8 bg-gradient-to-b from-primary-600 to-secondary-600 rounded-full mr-3"></span>
                What's Not Included
              </h2>
              <div class="grid md:grid-cols-2 gap-4">
                <div *ngFor="let item of activity.excludes" 
                     class="flex items-start p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800">
                  <div class="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center mr-4 flex-shrink-0">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                  <span class="text-gray-700 dark:text-gray-300 font-medium">{{ item }}</span>
                </div>
              </div>
            </div>

            <!-- Requirements -->
            <div class="animate-fade-up" style="animation-delay: 0.4s">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span class="w-1 h-8 bg-gradient-to-b from-primary-600 to-secondary-600 rounded-full mr-3"></span>
                Requirements & What to Bring
              </h2>
              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                  <h3 class="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg class="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Requirements
                  </h3>
                  <ul class="space-y-2">
                    <li *ngFor="let req of activity.requirements" class="flex items-start text-gray-700 dark:text-gray-300 text-sm">
                      <span class="text-blue-500 mr-2">•</span>
                      {{ req }}
                    </li>
                  </ul>
                </div>
                <div class="bg-purple-50 dark:bg-purple-900/10 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                  <h3 class="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg class="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                    What to Bring
                  </h3>
                  <div class="flex flex-wrap gap-2">
                    <span *ngFor="let item of activity.whatToBring" 
                          class="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium border border-purple-200 dark:border-purple-700">
                      {{ item }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Opening Hours -->
            <div class="animate-fade-up" style="animation-delay: 0.5s">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span class="w-1 h-8 bg-gradient-to-b from-primary-600 to-secondary-600 rounded-full mr-3"></span>
                Opening Hours
              </h2>
              <div class="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span class="text-gray-700 dark:text-gray-300 font-medium">Monday</span>
                    <span class="text-gray-600 dark:text-gray-400">{{ activity.openingHours.monday }}</span>
                  </div>
                  <div class="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span class="text-gray-700 dark:text-gray-300 font-medium">Tuesday</span>
                    <span class="text-gray-600 dark:text-gray-400">{{ activity.openingHours.tuesday }}</span>
                  </div>
                  <div class="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span class="text-gray-700 dark:text-gray-300 font-medium">Wednesday</span>
                    <span class="text-gray-600 dark:text-gray-400">{{ activity.openingHours.wednesday }}</span>
                  </div>
                  <div class="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span class="text-gray-700 dark:text-gray-300 font-medium">Thursday</span>
                    <span class="text-gray-600 dark:text-gray-400">{{ activity.openingHours.thursday }}</span>
                  </div>
                  <div class="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span class="text-gray-700 dark:text-gray-300 font-medium">Friday</span>
                    <span class="text-gray-600 dark:text-gray-400">{{ activity.openingHours.friday }}</span>
                  </div>
                  <div class="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span class="text-gray-700 dark:text-gray-300 font-medium">Saturday</span>
                    <span class="text-gray-600 dark:text-gray-400">{{ activity.openingHours.saturday }}</span>
                  </div>
                  <div class="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg md:col-span-2">
                    <span class="text-gray-700 dark:text-gray-300 font-medium">Sunday</span>
                    <span class="text-gray-600 dark:text-gray-400">{{ activity.openingHours.sunday }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Sidebar -->
          <div class="lg:col-span-1">
            <div class="sticky top-32 space-y-6">
              <!-- Price Card -->
              <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border-2 border-gray-200 dark:border-gray-800 animate-fade-up">
                <div class="text-center mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                  <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">Price</div>
                  <div class="text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-1">
                    \${{ activity.pricing.amount }}
                  </div>
                  <div class="text-gray-600 dark:text-gray-400">per {{ activity.pricing.priceType }}</div>
                </div>

                <!-- Quick Info -->
                <div class="space-y-4 mb-6">
                  <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div class="flex items-center text-gray-600 dark:text-gray-400">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Duration
                    </div>
                    <span class="font-semibold text-gray-900 dark:text-white">{{ activity.duration }}</span>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div class="flex items-center text-gray-600 dark:text-gray-400">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      Group Size
                    </div>
                    <span class="font-semibold text-gray-900 dark:text-white">{{ activity.groupSize.minimum }}-{{ activity.groupSize.maximum }}</span>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div class="flex items-center text-gray-600 dark:text-gray-400">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                      </svg>
                      Age Range
                    </div>
                    <span class="font-semibold text-gray-900 dark:text-white">{{ activity.ageRestriction.minimum }}-{{ activity.ageRestriction.maximum }} yrs</span>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div class="flex items-center text-gray-600 dark:text-gray-400">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                      </svg>
                      Best Time
                    </div>
                    <span class="font-semibold text-gray-900 dark:text-white capitalize">{{ activity.bestTimeToVisit }}</span>
                  </div>
                </div>

                <!-- CTA Buttons -->
                <div class="space-y-3 mb-6">
                  <button *ngIf="activity.bookingRequired" class="w-full py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl hover:shadow-2xl hover:shadow-primary-500/50 transition-all font-bold text-lg flex items-center justify-center group">
                    Book Now
                    <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </button>
                  <button class="w-full py-4 border-2 border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-400 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all font-semibold flex items-center justify-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    Contact Organizer
                  </button>
                </div>

                <!-- Cancellation Policy -->
                <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800 mb-6">
                  <div class="flex items-start">
                    <svg class="w-5 h-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                      <div class="text-sm font-semibold text-gray-900 dark:text-white mb-1">Cancellation Policy</div>
                      <p class="text-xs text-gray-600 dark:text-gray-400">{{ activity.cancellationPolicy }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Contact Information -->
              <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Contact Information</h3>
                <div class="space-y-4">
                  <a [href]="'tel:' + activity.contactInfo.phone" class="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group">
                    <div class="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">Phone</div>
                      <div class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">{{ activity.contactInfo.phone }}</div>
                    </div>
                  </a>
                  <a [href]="'mailto:' + activity.contactInfo.email" class="flex items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group">
                    <div class="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div class="overflow-hidden">
                      <div class="text-xs text-gray-500 dark:text-gray-400">Email</div>
                      <div class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 truncate">{{ activity.contactInfo.email }}</div>
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
        <p class="text-gray-600 dark:text-gray-400 text-lg font-medium">Loading activity details...</p>
      </div>
    </div>
  `
})
export class ActivityDetailComponent implements OnInit {
  activity: Activity | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadActivity(id);
    });
  }

  loadActivity(id: string): void {
    this.loading = true;
    this.activityService.getActivityById(id).subscribe({
      next: (response) => {
        this.activity = response.activity;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading activity:', err);
        this.loading = false;
      }
    });
  }

  getDifficultyBadgeColor(difficulty: string): string {
    const colors: { [key: string]: string } = {
      'easy': 'bg-green-500 text-white',
      'moderate': 'bg-yellow-500 text-white',
      'hard': 'bg-orange-500 text-white',
      'extreme': 'bg-red-500 text-white'
    };
    return colors[difficulty.toLowerCase()] || 'bg-gray-500 text-white';
  }
}
