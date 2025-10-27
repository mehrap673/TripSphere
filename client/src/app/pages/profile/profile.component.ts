import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
      <!-- Cover Image Section -->
      <div class="relative h-64 bg-gradient-to-br from-primary-600 via-secondary-600 to-pink-600 dark:from-primary-700 dark:via-secondary-700 dark:to-pink-700">
        <div class="absolute inset-0">
          <div class="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full filter blur-3xl animate-float"></div>
          <div class="absolute bottom-10 right-20 w-96 h-96 bg-white/10 rounded-full filter blur-3xl animate-float" style="animation-delay: 2s"></div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Profile Header Card - Overlapping Cover -->
        <div class="-mt-32 relative z-10 mb-8">
          <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 p-8">
            <div class="flex flex-col md:flex-row items-center md:items-start gap-8">
              <!-- Avatar Section -->
              <div class="relative flex-shrink-0">
                <div class="relative">
                  <img [src]="getUserAvatar()" 
                       [alt]="getUserName()"
                       class="w-40 h-40 rounded-3xl object-cover border-4 border-white dark:border-gray-800 shadow-2xl">
                  <button class="absolute bottom-2 right-2 w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white hover:shadow-lg hover:scale-110 transition-all shadow-lg">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </button>
                </div>
                <!-- Level Badge -->
                <div class="absolute -bottom-3 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl shadow-lg">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <span class="text-white font-bold text-sm">Level {{getLevel()}}</span>
                  </div>
                </div>
              </div>

              <!-- User Info -->
              <div class="flex-1 text-center md:text-left">
                <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {{getUserName()}}
                </h1>
                <p class="text-gray-600 dark:text-gray-400 text-lg mb-4">{{getUserEmail()}}</p>
                
                <!-- Stats Pills -->
                <div class="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                  <div class="px-5 py-2.5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                    <div class="flex items-center gap-2">
                      <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <span class="text-sm font-bold text-amber-700 dark:text-amber-300">
                        {{getPoints()}} XP
                      </span>
                    </div>
                  </div>
                  
                  <div class="px-5 py-2.5 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <div class="flex items-center gap-2">
                      <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span class="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                        {{getTripsCompleted()}} Trips
                      </span>
                    </div>
                  </div>
                  
                  <div class="px-5 py-2.5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                    <div class="flex items-center gap-2">
                      <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                      </svg>
                      <span class="text-sm font-bold text-purple-700 dark:text-purple-300">
                        {{getBadgesCount()}} Badges
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Member Since -->
                <div class="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <svg class="w-4 h-4 text-gray-600 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span class="text-sm text-gray-700 dark:text-gray-300">
                    Member since {{getMemberSince()}}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid lg:grid-cols-3 gap-8 pb-12">
          <!-- Left Column - Forms -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Personal Information Card -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div class="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <svg class="w-6 h-6 mr-3 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Personal Information
                </h2>
              </div>
              
              <form class="p-6 space-y-5">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input type="text" 
                         [(ngModel)]="profileData.name"
                         name="name"
                         class="w-full px-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all">
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div class="relative">
                    <input type="email" 
                           [value]="getUserEmail()"
                           disabled
                           class="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed">
                    <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <span class="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md">Verified</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea rows="4"
                            [(ngModel)]="profileData.bio"
                            name="bio"
                            class="w-full px-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                            placeholder="Tell us about yourself and your travel experiences..."></textarea>
                  <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Brief description for your profile.</p>
                </div>

                <button type="button"
                        (click)="updateProfile()"
                        class="w-full px-6 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-primary-500/50 transition-all duration-300 flex items-center justify-center group">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Save Changes
                  <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </button>
              </form>
            </div>

            <!-- Travel Preferences Card -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div class="bg-gradient-to-r from-secondary-50 to-pink-50 dark:from-secondary-900/20 dark:to-pink-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <svg class="w-6 h-6 mr-3 text-secondary-600 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                  </svg>
                  Travel Preferences
                </h2>
              </div>
              
              <div class="p-6">
                <div class="grid md:grid-cols-2 gap-5">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Travel Style
                    </label>
                    <select [(ngModel)]="profileData.preferences.travelStyle"
                            class="w-full px-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all appearance-none cursor-pointer">
                      <option value="adventure">🏔️ Adventure</option>
                      <option value="relaxation">🏖️ Relaxation</option>
                      <option value="cultural">🏛️ Cultural</option>
                      <option value="foodie">🍜 Foodie</option>
                      <option value="luxury">💎 Luxury</option>
                      <option value="budget">💰 Budget</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Budget Preference
                    </label>
                    <select [(ngModel)]="profileData.preferences.budget"
                            class="w-full px-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all appearance-none cursor-pointer">
                      <option value="budget">Budget Friendly</option>
                      <option value="moderate">Moderate</option>
                      <option value="luxury">Luxury Experience</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Preferred Currency
                    </label>
                    <select [(ngModel)]="profileData.preferences.currency"
                            class="w-full px-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all appearance-none cursor-pointer">
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="AUD">AUD ($)</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Language
                    </label>
                    <select [(ngModel)]="profileData.preferences.language"
                            class="w-full px-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all appearance-none cursor-pointer">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="it">Italian</option>
                      <option value="pt">Portuguese</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Sidebar -->
          <div class="space-y-8">
            <!-- Badges Showcase -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-between">
                  <span class="flex items-center">
                    <svg class="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                    </svg>
                    Badges
                  </span>
                  <span class="px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">
                    {{getBadgesCount()}}
                  </span>
                </h2>
              </div>
              
              <div class="p-6">
                <div *ngIf="hasBadges()" class="grid grid-cols-3 gap-3">
                  <div *ngFor="let badge of getBadges()" 
                       class="group cursor-pointer">
                    <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-3 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all hover:scale-110 hover:shadow-lg"
                         [title]="badge.description">
                      <div class="text-4xl mb-2 text-center group-hover:scale-125 transition-transform">{{badge.icon}}</div>
                      <div class="text-xs font-bold text-gray-900 dark:text-white text-center line-clamp-1">{{badge.name}}</div>
                    </div>
                  </div>
                </div>
                
                <div *ngIf="!hasBadges()" class="text-center py-12">
                  <div class="inline-block p-6 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                    <svg class="w-12 h-12 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                    </svg>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">No badges earned yet</p>
                  <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">Complete trips to unlock badges!</p>
                </div>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <svg class="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  Activity Stats
                </h2>
              </div>
              
              <div class="p-6 space-y-4">
                <div class="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    </div>
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Total Points</span>
                  </div>
                  <span class="text-lg font-bold text-amber-700 dark:text-amber-300">
                    {{getPoints()}}
                  </span>
                </div>

                <div class="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Achievements</span>
                  </div>
                  <span class="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                    {{getAchievementsCount()}}
                  </span>
                </div>

                <div class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                    </div>
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Current Level</span>
                  </div>
                  <span class="text-lg font-bold text-blue-700 dark:text-blue-300">
                    Level {{getLevel()}}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  profileData: any = {
    name: '',
    bio: '',
    preferences: {
      travelStyle: 'cultural',
      budget: 'moderate',
      currency: 'USD',
      language: 'en'
    }
  };

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.profileData.name = user.name;
        this.profileData.bio = user.bio;
        this.profileData.preferences = { ...user.preferences };
      }
    });
  }

  updateProfile(): void {
    this.userService.updateProfile(this.profileData).subscribe({
      next: () => {
        alert('Profile updated successfully!');
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        alert('Failed to update profile');
      }
    });
  }

  // Helper methods to avoid template errors
  getUserAvatar(): string {
    return this.currentUser?.avatar || '/assets/default-avatar.png';
  }

  getUserName(): string {
    return this.currentUser?.name || 'Traveler';
  }

  getUserEmail(): string {
    return this.currentUser?.email || '';
  }

  getLevel(): number {
    return this.currentUser?.gamification?.level || 1;
  }

  getPoints(): number {
    return this.currentUser?.gamification?.points || 0;
  }

  getTripsCompleted(): number {
    return this.currentUser?.gamification?.tripsCompleted || 0;
  }

  getBadgesCount(): number {
    return this.currentUser?.gamification?.badges?.length || 0;
  }

  getBadges(): any[] {
    return this.currentUser?.gamification?.badges || [];
  }

  hasBadges(): boolean {
    return (this.currentUser?.gamification?.badges?.length ?? 0) > 0;
  }

  getAchievementsCount(): number {
    return this.currentUser?.gamification?.achievements?.length || 0;
  }

  getMemberSince(): string {
    if (!this.currentUser?.createdAt) return 'Recently';
    const date = new Date(this.currentUser.createdAt);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
}
