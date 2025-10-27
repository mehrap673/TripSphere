import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { DestinationService } from '../../services/destination.service';
import { Destination } from '../../models/destination.model';

@Component({
    selector: 'app-trip-create',
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Simple Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl mb-4">
            <svg class="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Create Your Dream Trip
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Plan your next adventure with our smart trip planner
          </p>
        </div>

        <!-- Pre-filled Destination Info Banner -->
        <div *ngIf="preselectedDestination" class="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-5 border border-blue-200 dark:border-blue-800 animate-fade-up">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 border-white dark:border-gray-700 shadow-md">
              <img [src]="preselectedDestination.coverImage || preselectedDestination.images[0]" 
                   [alt]="preselectedDestination.name"
                   class="w-full h-full object-cover">
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-base font-bold text-gray-900 dark:text-white mb-1">
                Planning trip to {{preselectedDestination.name}}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                We've pre-filled some details based on your destination
              </p>
            </div>
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>

        <!-- Form Container -->
        <form (ngSubmit)="createTrip()" class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          
          <!-- Progress Steps -->
          <div class="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 px-6 py-5">
            <div class="flex items-center justify-between max-w-2xl mx-auto">
              <div class="flex items-center gap-2" [class.opacity-100]="currentStep >= 1" [class.opacity-40]="currentStep < 1">
                <div class="w-9 h-9 rounded-full flex items-center justify-center transition-all" 
                     [ngClass]="{
                       'bg-primary-500 shadow-lg shadow-primary-500/30': currentStep >= 1,
                       'bg-gray-300 dark:bg-gray-600': currentStep < 1
                     }">
                  <span class="text-white font-bold text-sm">1</span>
                </div>
                <span class="font-semibold text-sm text-gray-900 dark:text-white hidden sm:inline">Basic Info</span>
              </div>
              
              <div class="flex-1 h-0.5 mx-3 rounded transition-all" 
                   [ngClass]="{
                     'bg-primary-500': currentStep >= 2,
                     'bg-gray-300 dark:bg-gray-600': currentStep < 2
                   }"></div>
              
              <div class="flex items-center gap-2" [class.opacity-100]="currentStep >= 2" [class.opacity-40]="currentStep < 2">
                <div class="w-9 h-9 rounded-full flex items-center justify-center transition-all" 
                     [ngClass]="{
                       'bg-primary-500 shadow-lg shadow-primary-500/30': currentStep >= 2,
                       'bg-gray-300 dark:bg-gray-600': currentStep < 2
                     }">
                  <span class="text-white font-bold text-sm">2</span>
                </div>
                <span class="font-semibold text-sm text-gray-900 dark:text-white hidden sm:inline">Budget</span>
              </div>
              
              <div class="flex-1 h-0.5 mx-3 rounded transition-all" 
                   [ngClass]="{
                     'bg-primary-500': currentStep >= 3,
                     'bg-gray-300 dark:bg-gray-600': currentStep < 3
                   }"></div>
              
              <div class="flex items-center gap-2" [class.opacity-100]="currentStep >= 3" [class.opacity-40]="currentStep < 3">
                <div class="w-9 h-9 rounded-full flex items-center justify-center transition-all" 
                     [ngClass]="{
                       'bg-primary-500 shadow-lg shadow-primary-500/30': currentStep >= 3,
                       'bg-gray-300 dark:bg-gray-600': currentStep < 3
                     }">
                  <span class="text-white font-bold text-sm">3</span>
                </div>
                <span class="font-semibold text-sm text-gray-900 dark:text-white hidden sm:inline">Privacy</span>
              </div>
            </div>
          </div>

          <div class="p-6 sm:p-8">
            <!-- Step 1: Basic Information -->
            <div *ngIf="currentStep === 1" class="space-y-6 animate-fade-up">
              <div class="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl p-5 border border-primary-200 dark:border-primary-800">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Basic Trip Information
                </h2>
                <p class="text-sm text-gray-600 dark:text-gray-400">Let's start with the essential details about your trip</p>
              </div>
              
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Trip Title <span class="text-red-500">*</span>
                </label>
                <input type="text" 
                       [(ngModel)]="tripData.title"
                       name="title"
                       required
                       class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                       placeholder="e.g., Summer Vacation in Paris">
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea rows="4"
                          [(ngModel)]="tripData.description"
                          name="description"
                          class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                          placeholder="Tell us about your trip plans and what you're looking forward to..."></textarea>
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Destination <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <select [(ngModel)]="tripData.destination"
                          name="destination"
                          required
                          class="w-full px-4 py-3 pl-11 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all appearance-none cursor-pointer">
                    <option value="">Select a destination</option>
                    <option *ngFor="let destination of destinations" [value]="destination._id">
                      {{destination.name}}, {{destination.country}}
                    </option>
                  </select>
                  <svg class="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <svg class="absolute right-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>

              <div class="grid md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Start Date <span class="text-red-500">*</span>
                  </label>
                  <input type="date" 
                         [(ngModel)]="tripData.startDate"
                         name="startDate"
                         required
                         class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all">
                </div>

                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    End Date <span class="text-red-500">*</span>
                  </label>
                  <input type="date" 
                         [(ngModel)]="tripData.endDate"
                         name="endDate"
                         required
                         class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all">
                </div>
              </div>

              <div class="grid md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Number of Travelers <span class="text-red-500">*</span>
                  </label>
                  <input type="number" 
                         [(ngModel)]="tripData.travelers"
                         name="travelers"
                         min="1"
                         required
                         class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all">
                </div>

                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Trip Type <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <select [(ngModel)]="tripData.tripType"
                            name="tripType"
                            required
                            class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all appearance-none cursor-pointer">
                      <option value="beach">🏖️ Beach</option>
                      <option value="city">🌆 City</option>
                      <option value="adventure">🏔️ Adventure</option>
                      <option value="cultural">🏛️ Cultural</option>
                      <option value="business">💼 Business</option>
                      <option value="relaxation">🧘 Relaxation</option>
                      <option value="family">👨‍👩‍👧 Family</option>
                      <option value="solo">🚶 Solo</option>
                      <option value="group">👥 Group</option>
                    </select>
                    <svg class="absolute right-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 2: Budget -->
            <div *ngIf="currentStep === 2" class="space-y-6 animate-fade-up">
              <div class="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl p-5 border border-emerald-200 dark:border-emerald-800">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Budget Planning
                </h2>
                <p class="text-sm text-gray-600 dark:text-gray-400">Set your budget and allocate funds for different categories</p>
              </div>
              
              <div class="grid md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Total Budget <span class="text-red-500">*</span>
                  </label>
                  <input type="number" 
                         [(ngModel)]="tripData.budget.total"
                         name="budgetTotal"
                         min="0"
                         required
                         class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                         placeholder="0">
                </div>

                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Currency
                  </label>
                  <div class="relative">
                    <select [(ngModel)]="tripData.budget.currency"
                            name="currency"
                            class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all appearance-none cursor-pointer">
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                    <svg class="absolute right-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <h3 class="text-base font-bold text-gray-900 dark:text-white mb-4">Budget Breakdown (Optional)</h3>
                <div class="grid md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      🏨 Accommodation
                    </label>
                    <input type="number" 
                           [(ngModel)]="tripData.budget.breakdown.accommodation"
                           name="accommodationBudget"
                           min="0"
                           class="w-full px-3 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm">
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      🍽️ Food
                    </label>
                    <input type="number" 
                           [(ngModel)]="tripData.budget.breakdown.food"
                           name="foodBudget"
                           min="0"
                           class="w-full px-3 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm">
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      🚗 Transport
                    </label>
                    <input type="number" 
                           [(ngModel)]="tripData.budget.breakdown.transport"
                           name="transportBudget"
                           min="0"
                           class="w-full px-3 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm">
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 3: Privacy -->
            <div *ngIf="currentStep === 3" class="space-y-5 animate-fade-up">
              <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  Privacy Settings
                </h2>
                <p class="text-sm text-gray-600 dark:text-gray-400">Choose who can see your trip details</p>
              </div>
              
              <div class="space-y-3">
                <div (click)="tripData.visibility = 'private'" 
                     class="p-5 rounded-xl border-2 cursor-pointer transition-all" 
                     [ngClass]="{
                       'border-primary-500 bg-primary-50 dark:bg-primary-900/20': tripData.visibility === 'private',
                       'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600': tripData.visibility !== 'private'
                     }">
                  <div class="flex items-start gap-3">
                    <div class="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0" 
                         [ngClass]="{
                           'bg-primary-500': tripData.visibility === 'private',
                           'bg-gray-200 dark:bg-gray-700': tripData.visibility !== 'private'
                         }">
                      <svg class="w-5 h-5" 
                           [ngClass]="{
                             'text-white': tripData.visibility === 'private',
                             'text-gray-600 dark:text-gray-400': tripData.visibility !== 'private'
                           }" 
                           fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3 class="text-base font-bold text-gray-900 dark:text-white mb-0.5">Private</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Only you can see this trip</p>
                    </div>
                    <div class="w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5" 
                         [ngClass]="{
                           'border-primary-500 bg-primary-500': tripData.visibility === 'private',
                           'border-gray-300 dark:border-gray-600': tripData.visibility !== 'private'
                         }">
                      <svg *ngIf="tripData.visibility === 'private'" class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div (click)="tripData.visibility = 'friends'" 
                     class="p-5 rounded-xl border-2 cursor-pointer transition-all" 
                     [ngClass]="{
                       'border-primary-500 bg-primary-50 dark:bg-primary-900/20': tripData.visibility === 'friends',
                       'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600': tripData.visibility !== 'friends'
                     }">
                  <div class="flex items-start gap-3">
                    <div class="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0" 
                         [ngClass]="{
                           'bg-primary-500': tripData.visibility === 'friends',
                           'bg-gray-200 dark:bg-gray-700': tripData.visibility !== 'friends'
                         }">
                      <svg class="w-5 h-5" 
                           [ngClass]="{
                             'text-white': tripData.visibility === 'friends',
                             'text-gray-600 dark:text-gray-400': tripData.visibility !== 'friends'
                           }" 
                           fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3 class="text-base font-bold text-gray-900 dark:text-white mb-0.5">Friends</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Share with your friends only</p>
                    </div>
                    <div class="w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5" 
                         [ngClass]="{
                           'border-primary-500 bg-primary-500': tripData.visibility === 'friends',
                           'border-gray-300 dark:border-gray-600': tripData.visibility !== 'friends'
                         }">
                      <svg *ngIf="tripData.visibility === 'friends'" class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div (click)="tripData.visibility = 'public'" 
                     class="p-5 rounded-xl border-2 cursor-pointer transition-all" 
                     [ngClass]="{
                       'border-primary-500 bg-primary-50 dark:bg-primary-900/20': tripData.visibility === 'public',
                       'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600': tripData.visibility !== 'public'
                     }">
                  <div class="flex items-start gap-3">
                    <div class="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0" 
                         [ngClass]="{
                           'bg-primary-500': tripData.visibility === 'public',
                           'bg-gray-200 dark:bg-gray-700': tripData.visibility !== 'public'
                         }">
                      <svg class="w-5 h-5" 
                           [ngClass]="{
                             'text-white': tripData.visibility === 'public',
                             'text-gray-600 dark:text-gray-400': tripData.visibility !== 'public'
                           }" 
                           fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3 class="text-base font-bold text-gray-900 dark:text-white mb-0.5">Public</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Anyone can discover your trip</p>
                    </div>
                    <div class="w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5" 
                         [ngClass]="{
                           'border-primary-500 bg-primary-500': tripData.visibility === 'public',
                           'border-gray-300 dark:border-gray-600': tripData.visibility !== 'public'
                         }">
                      <svg *ngIf="tripData.visibility === 'public'" class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button type="button"
                      *ngIf="currentStep > 1"
                      (click)="previousStep()"
                      class="px-5 py-2.5 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Previous
              </button>

              <button type="button"
                      *ngIf="currentStep === 1"
                      (click)="cancel()"
                      class="px-5 py-2.5 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                Cancel
              </button>

              <div class="flex gap-3 ml-auto">
                <button type="button"
                        *ngIf="currentStep < 3"
                        (click)="nextStep()"
                        class="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 flex items-center">
                  Next
                  <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>

                <button type="submit"
                        *ngIf="currentStep === 3"
                        [disabled]="loading"
                        class="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
                  <svg *ngIf="!loading" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <svg *ngIf="loading" class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{getButtonText()}}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  `
})


export class TripCreateComponent implements OnInit {
  destinations: Destination[] = [];
  loading = false;
  currentStep = 1;
  preselectedDestination: Destination | null = null;
  passedWeather: any = null;

  tripData = {
    title: '',
    description: '',
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    tripType: 'city',
    budget: {
      total: 0,
      currency: 'USD',
      breakdown: {
        accommodation: 0,
        food: 0,
        transport: 0,
        activities: 0,
        shopping: 0,
        other: 0
      }
    },
    visibility: 'private'
  };

  constructor(
    private tripService: TripService,
    private destinationService: DestinationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Get state from history.state instead of getCurrentNavigation
    const state = history.state;

    if (state && state.destination) {
      this.preselectedDestination = state.destination;
      this.passedWeather = state.weather;
      console.log('Received destination:', this.preselectedDestination);
      console.log('Received weather:', this.passedWeather);
    }

    this.loadDestinations();
    // prefillFormData will be called after destinations load
  }

  loadDestinations(): void {
    this.destinationService.getDestinations().subscribe({
      next: (response) => {
        this.destinations = response.destinations;
        console.log('Destinations loaded:', this.destinations.length);

        // After destinations load, prefill form if we have preselected destination
        if (this.preselectedDestination) {
          this.prefillFormData();
        }
      },
      error: (err) => {
        console.error('Error loading destinations:', err);
      }
    });
  }

  prefillFormData(): void {
    if (!this.preselectedDestination) {
      console.log('No preselected destination to prefill');
      return;
    }

    console.log('Prefilling form with:', this.preselectedDestination.name);

    // Pre-fill title with destination name
    this.tripData.title = `Trip to ${this.preselectedDestination.name}`;

    // Pre-fill description
    this.tripData.description = `Exciting ${this.preselectedDestination.name} adventure`;

    // Pre-fill destination ID
    this.tripData.destination = this.preselectedDestination._id;

    // Pre-fill currency based on destination
    this.tripData.budget.currency = this.getCurrencyCode(this.preselectedDestination.currency);

    // Pre-fill budget based on destination's average costs
    if (this.preselectedDestination.averageCost) {
      this.tripData.budget.total = this.preselectedDestination.averageCost.moderate || 0;

      // Set budget breakdown estimates
      const total = this.preselectedDestination.averageCost.moderate || 0;
      this.tripData.budget.breakdown.accommodation = Math.round(total * 0.4);
      this.tripData.budget.breakdown.food = Math.round(total * 0.25);
      this.tripData.budget.breakdown.transport = Math.round(total * 0.20);
      this.tripData.budget.breakdown.activities = Math.round(total * 0.15);
    }

    // Determine trip type based on destination activities
    if (this.preselectedDestination.popularActivities?.length > 0) {
      const activities = this.preselectedDestination.popularActivities.map(a => a.toLowerCase());

      if (activities.some(a => a.includes('beach') || a.includes('surf'))) {
        this.tripData.tripType = 'beach';
      } else if (activities.some(a => a.includes('hike') || a.includes('trek') || a.includes('climb'))) {
        this.tripData.tripType = 'adventure';
      } else if (activities.some(a => a.includes('museum') || a.includes('temple') || a.includes('historic'))) {
        this.tripData.tripType = 'cultural';
      } else {
        this.tripData.tripType = 'city';
      }
    }

    console.log('Form prefilled successfully:', this.tripData);
  }

  getCurrencyCode(currencyString: string): string {
    if (!currencyString) return 'USD';

    const currencyMap: { [key: string]: string } = {
      'USD': 'USD',
      'EUR': 'EUR',
      'GBP': 'GBP',
      'INR': 'INR',
      'Dollar': 'USD',
      'Euro': 'EUR',
      'Pound': 'GBP',
      'Rupee': 'INR',
      'Rupees': 'INR',
      '$': 'USD',
      '€': 'EUR',
      '£': 'GBP',
      '₹': 'INR'
    };

    for (const [key, value] of Object.entries(currencyMap)) {
      if (currencyString.includes(key)) {
        return value;
      }
    }

    return 'USD';
  }

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }


  createTrip(): void {
    this.loading = true;

    const tripPayload = {
      ...this.tripData,
      startDate: new Date(this.tripData.startDate),
      endDate: new Date(this.tripData.endDate)
    };

    this.tripService.createTrip(tripPayload as any).subscribe({
      next: (response) => {
        this.router.navigate(['/trips', response.trip._id]);
      },
      error: (err) => {
        console.error('Error creating trip:', err);
        alert('Failed to create trip');
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/trips']);
  }

  getButtonText(): string {
    return this.loading ? 'Creating Trip...' : 'Create Trip';
  }
}
