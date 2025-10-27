import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { Trip } from '../../models/trip.model';

@Component({
    selector: 'app-trip-detail',
    imports: [CommonModule, RouterModule],
    template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-12" *ngIf="trip">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Back Button -->
        <button routerLink="/trips" class="mb-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Trips
        </button>

        <!-- Header Card -->
        <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 mb-8 animate-fade-up">
          <div class="flex items-start justify-between gap-6">
            <div class="flex-1">
              <!-- Status Badges -->
              <div class="flex flex-wrap items-center gap-3 mb-4">
                <span class="px-4 py-2 rounded-xl text-sm font-bold shadow-lg"
                      [ngClass]="{
                        'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800': trip.status === 'planning',
                        'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800': trip.status === 'confirmed',
                        'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800': trip.status === 'ongoing',
                        'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700': trip.status === 'completed',
                        'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800': trip.status === 'cancelled'
                      }">
                  {{trip.status | titlecase}}
                </span>
                <span class="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold capitalize border border-gray-200 dark:border-gray-700">
                  {{trip.tripType}}
                </span>
              </div>
              
              <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {{trip.title}}
              </h1>
              
              <p class="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-3xl" *ngIf="trip.description">
                {{trip.description}}
              </p>

              <!-- Trip Meta Info -->
              <div class="flex flex-wrap gap-6">
                <div class="flex items-center" *ngIf="getDestinationName()">
                  <div class="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3">
                    <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">Destination</div>
                    <div class="font-bold text-gray-900 dark:text-white">{{getDestinationName()}}</div>
                  </div>
                </div>

                <div class="flex items-center">
                  <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                    <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">Duration</div>
                    <div class="font-bold text-gray-900 dark:text-white">{{trip.startDate | date:'MMM d'}} - {{trip.endDate | date:'MMM d, yyyy'}}</div>
                  </div>
                </div>

                <div class="flex items-center">
                  <div class="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                    <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">Travelers</div>
                    <div class="font-bold text-gray-900 dark:text-white">{{trip.travelers}} {{trip.travelers > 1 ? 'people' : 'person'}}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3">
              <button [routerLink]="['/trips', trip._id, 'edit']"
                      class="p-4 bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 rounded-xl font-semibold hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-all shadow-lg">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-750 transition-all shadow-lg">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Main Column -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Budget Overview Card -->
            <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-fade-up" style="animation-delay: 0.1s">
              <div class="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 px-8 py-6 border-b border-gray-200 dark:border-gray-800">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <svg class="w-7 h-7 mr-3 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Budget Overview
                </h2>
              </div>
              
              <div class="p-8">
                <!-- Budget Progress -->
                <div class="mb-8 p-6 rounded-2xl" 
                     [ngClass]="{
                       'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20': trip.budget.spent <= trip.budget.total,
                       'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20': trip.budget.spent > trip.budget.total
                     }">
                  <div class="flex items-center justify-between mb-4">
                    <span class="text-gray-700 dark:text-gray-300 font-semibold">Total Budget</span>
                    <div class="text-right">
                      <div class="text-3xl font-bold" 
                           [ngClass]="{
                             'text-green-600 dark:text-green-400': trip.budget.spent <= trip.budget.total,
                             'text-red-600 dark:text-red-400': trip.budget.spent > trip.budget.total
                           }">
                        {{trip.budget.currency}} {{trip.budget.spent}}
                      </div>
                      <div class="text-sm text-gray-600 dark:text-gray-400">of {{trip.budget.currency}} {{trip.budget.total}}</div>
                    </div>
                  </div>
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                    <div class="h-full rounded-full transition-all duration-500"
                         [ngClass]="{
                           'bg-gradient-to-r from-green-400 to-emerald-500': trip.budget.spent <= trip.budget.total,
                           'bg-gradient-to-r from-red-400 to-orange-500': trip.budget.spent > trip.budget.total
                         }"
                         [style.width.%]="getBudgetPercentage()">
                    </div>
                  </div>
                  <div class="mt-2 text-right text-sm font-semibold" 
                       [ngClass]="{
                         'text-green-600 dark:text-green-400': trip.budget.spent <= trip.budget.total,
                         'text-red-600 dark:text-red-400': trip.budget.spent > trip.budget.total
                       }">
                    {{getBudgetPercentage().toFixed(1)}}% {{trip.budget.spent > trip.budget.total ? 'over budget' : 'spent'}}
                  </div>
                </div>

                <!-- Budget Breakdown -->
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800 hover:scale-105 transition-transform">
                    <div class="flex items-center justify-between mb-2">
                      <div class="text-sm font-semibold text-blue-700 dark:text-blue-300">🏨 Accommodation</div>
                      <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                      </svg>
                    </div>
                    <div class="text-2xl font-bold text-gray-900 dark:text-white">
                      {{trip.budget.currency}} {{trip.budget.breakdown.accommodation}}
                    </div>
                  </div>

                  <div class="p-5 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 hover:scale-105 transition-transform">
                    <div class="flex items-center justify-between mb-2">
                      <div class="text-sm font-semibold text-green-700 dark:text-green-300">🍽️ Food & Dining</div>
                      <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                    </div>
                    <div class="text-2xl font-bold text-gray-900 dark:text-white">
                      {{trip.budget.currency}} {{trip.budget.breakdown.food}}
                    </div>
                  </div>

                  <div class="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 hover:scale-105 transition-transform">
                    <div class="flex items-center justify-between mb-2">
                      <div class="text-sm font-semibold text-purple-700 dark:text-purple-300">🚗 Transport</div>
                      <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                      </svg>
                    </div>
                    <div class="text-2xl font-bold text-gray-900 dark:text-white">
                      {{trip.budget.currency}} {{trip.budget.breakdown.transport}}
                    </div>
                  </div>

                  <div class="p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-2 border-orange-200 dark:border-orange-800 hover:scale-105 transition-transform">
                    <div class="flex items-center justify-between mb-2">
                      <div class="text-sm font-semibold text-orange-700 dark:text-orange-300">🎭 Activities</div>
                      <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div class="text-2xl font-bold text-gray-900 dark:text-white">
                      {{trip.budget.currency}} {{trip.budget.breakdown.activities}}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Itinerary Card -->
            <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-fade-up" style="animation-delay: 0.2s">
              <div class="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 px-8 py-6 border-b border-gray-200 dark:border-gray-800">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <svg class="w-7 h-7 mr-3 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                  Daily Itinerary
                </h2>
              </div>
              
              <div class="p-8">
                <div *ngIf="trip.days && trip.days.length > 0" class="space-y-6">
                  <div *ngFor="let day of trip.days; let i = index" 
                       class="border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-lg transition-all">
                    <div class="flex items-center justify-between mb-5">
                      <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {{day.dayNumber}}
                        </div>
                        <div>
                          <div class="text-lg font-bold text-gray-900 dark:text-white">Day {{day.dayNumber}}</div>
                          <div class="text-sm text-gray-600 dark:text-gray-400">{{day.date | date:'EEEE, MMMM d'}}</div>
                        </div>
                      </div>
                      <div class="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-xl text-sm font-bold">
                        {{day.activities.length}} {{day.activities.length === 1 ? 'activity' : 'activities'}}
                      </div>
                    </div>
                    
                    <div *ngIf="day.activities.length > 0" class="space-y-3">
                      <div *ngFor="let activity of day.activities" 
                           class="flex items-start p-4 rounded-xl transition-all"
                           [ngClass]="{
                             'bg-green-50 dark:bg-green-900/20': activity.completed,
                             'bg-gray-50 dark:bg-gray-800': !activity.completed
                           }">
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0"
                             [ngClass]="{
                               'bg-green-500': activity.completed,
                               'bg-gray-300 dark:bg-gray-700': !activity.completed
                             }">
                          <svg *ngIf="activity.completed" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <svg *ngIf="!activity.completed" class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <div class="flex-1">
                          <div class="font-bold text-gray-900 dark:text-white mb-1">{{activity.name}}</div>
                          <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span class="flex items-center">
                              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              {{activity.startTime}} - {{activity.endTime}}
                            </span>
                            <span *ngIf="activity.cost" class="flex items-center font-semibold">
                              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              {{trip.budget.currency}} {{activity.cost}}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div *ngIf="!trip.days || trip.days.length === 0" class="text-center py-16">
                  <div class="inline-block p-6 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                    <svg class="w-16 h-16 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">No itinerary yet</h3>
                  <p class="text-gray-600 dark:text-gray-400 mb-6">Start planning your daily activities</p>
                  <button [routerLink]="['/trips', trip._id, 'edit']"
                          class="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all">
                    Add Activities
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-8">
            <!-- Trip Details Card -->
            <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-fade-up" style="animation-delay: 0.3s">
              <div class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 px-6 py-5 border-b border-gray-200 dark:border-gray-800">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <svg class="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Trip Details
                </h3>
              </div>
              <div class="p-6 space-y-4">
                <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Duration</span>
                  <span class="font-bold text-gray-900 dark:text-white">{{getDuration()}} days</span>
                </div>
                <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Status</span>
                  <span class="font-bold text-gray-900 dark:text-white capitalize">{{trip.status}}</span>
                </div>
                <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Visibility</span>
                  <span class="font-bold text-gray-900 dark:text-white capitalize">{{trip.visibility}}</span>
                </div>
                <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Created</span>
                  <span class="font-bold text-gray-900 dark:text-white">{{trip.createdAt | date:'MMM d, yyyy'}}</span>
                </div>
              </div>
            </div>

            <!-- Collaborators Card -->
            <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-fade-up" style="animation-delay: 0.4s">
              <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 px-6 py-5 border-b border-gray-200 dark:border-gray-800">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <svg class="w-6 h-6 mr-2 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                  Collaborators
                </h3>
              </div>
              <div class="p-6 space-y-4">
                <div class="flex items-center p-4 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl border border-primary-200 dark:border-primary-800">
                  <img [src]="getOwnerAvatar()" 
                       [alt]="getOwnerName()"
                       class="w-12 h-12 rounded-xl ring-2 ring-primary-500 object-cover mr-4">
                  <div class="flex-1">
                    <div class="font-bold text-gray-900 dark:text-white">{{getOwnerName()}}</div>
                    <div class="text-xs font-semibold text-primary-600 dark:text-primary-400">Trip Owner</div>
                  </div>
                </div>

                <div *ngFor="let collab of trip.collaborators" class="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
                  <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg">
                    {{getCollaboratorInitials(collab)}}
                  </div>
                  <div class="flex-1">
                    <div class="font-bold text-gray-900 dark:text-white">{{getCollaboratorName(collab)}}</div>
                    <div class="text-xs font-semibold text-gray-600 dark:text-gray-400 capitalize">{{collab.permission}}</div>
                  </div>
                </div>

                <button class="w-full px-4 py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-xl hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all font-semibold flex items-center justify-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Add Collaborator
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div *ngIf="!trip" class="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block relative mb-8">
          <div class="w-24 h-24 border-4 border-gray-200 dark:border-gray-800 rounded-full"></div>
          <div class="w-24 h-24 border-4 border-primary-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p class="text-gray-600 dark:text-gray-400 text-lg font-medium">Loading trip details...</p>
      </div>
    </div>
  `
})
export class TripDetailComponent implements OnInit {
  trip: Trip | null = null;

  constructor(
    private route: ActivatedRoute,
    private tripService: TripService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadTrip(id);
    });
  }

  loadTrip(id: string): void {
    this.tripService.getTripById(id).subscribe({
      next: (response) => {
        this.trip = response.trip;
      },
      error: (err) => {
        console.error('Error loading trip:', err);
      }
    });
  }

  getDestinationName(): string {
    if (!this.trip) return '';
    if (typeof this.trip.destination === 'object' && this.trip.destination) {
      return this.trip.destination.name;
    }
    if (this.trip.customDestination) {
      return this.trip.customDestination.name;
    }
    return '';
  }

  getOwnerAvatar(): string {
    if (!this.trip) return '/assets/default-avatar.png';
    if (typeof this.trip.owner === 'object' && this.trip.owner) {
      return this.trip.owner.avatar || '/assets/default-avatar.png';
    }
    return '/assets/default-avatar.png';
  }

  getOwnerName(): string {
    if (!this.trip) return 'Unknown';
    if (typeof this.trip.owner === 'object' && this.trip.owner) {
      return this.trip.owner.name;
    }
    return 'Unknown';
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

  getBudgetPercentage(): number {
    if (!this.trip || !this.trip.budget.total) return 0;
    return Math.min((this.trip.budget.spent / this.trip.budget.total) * 100, 100);
  }

  getDuration(): number {
    if (!this.trip) return 0;
    return Math.ceil((new Date(this.trip.endDate).getTime() - new Date(this.trip.startDate).getTime()) / (1000 * 60 * 60 * 24));
  }
}
