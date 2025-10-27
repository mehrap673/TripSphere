import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AnalyticsService } from '../../services/analytics.service';
import { User } from '../../models/user.model';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, RouterModule],
    template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
      <!-- Header Section -->
      <div class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pt-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <!-- Welcome Header -->
          <div class="flex items-center justify-between flex-wrap gap-6 mb-8">
            <div class="flex items-center gap-4">
              <div class="relative">
                <img [src]="getUserAvatar()" 
                     [alt]="getUserName()"
                     class="w-20 h-20 rounded-2xl object-cover border-4 border-primary-500 dark:border-primary-600 shadow-lg">
                <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span class="text-white font-bold text-sm">{{getLevel()}}</span>
                </div>
              </div>
              <div>
                <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  Welcome back, {{getUserName()}}! 👋
                </h1>
                <p class="text-gray-600 dark:text-gray-400 text-lg">
                  Ready to plan your next adventure?
                </p>
              </div>
            </div>
            <a routerLink="/trips/create" 
               class="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/50 transition-all duration-300 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Create New Trip
            </a>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Level Card -->
            <div class="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 hover:scale-105 transition-transform">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <span class="text-3xl">🏆</span>
              </div>
              <div class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Level {{getLevel()}}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400 mb-3">Current Level</div>
              <div class="text-amber-600 dark:text-amber-400 text-sm font-semibold">
                {{getPoints()}} XP Points
              </div>
            </div>

            <!-- Total Trips Card -->
            <div class="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800 hover:scale-105 transition-transform">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <span class="text-3xl">✈️</span>
              </div>
              <div class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {{getTotalTrips()}}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400 mb-3">Total Trips</div>
              <div class="text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                {{getCompletedTrips()}} completed
              </div>
            </div>

            <!-- Upcoming Trips Card -->
            <div class="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800 hover:scale-105 transition-transform">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <span class="text-3xl">🗓️</span>
              </div>
              <div class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {{getUpcomingTrips()}}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400 mb-3">Upcoming Trips</div>
              <div class="text-blue-600 dark:text-blue-400 text-sm font-semibold">
                Next 30 days
              </div>
            </div>

            <!-- Badges Card -->
            <div class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800 hover:scale-105 transition-transform">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                  </svg>
                </div>
                <span class="text-3xl">🎖️</span>
              </div>
              <div class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {{getBadgesCount()}}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400 mb-3">Badges Earned</div>
              <div class="text-purple-600 dark:text-purple-400 text-sm font-semibold">
                Keep exploring!
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Left Column -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Upcoming Trips -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
              <div class="p-6 border-b border-gray-200 dark:border-gray-800">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Upcoming Trips</h2>
                  </div>
                  <a routerLink="/trips" class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-semibold flex items-center group">
                    View All
                    <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>

              <div class="p-6">
                <div *ngIf="getUpcomingTripsList().length > 0" class="space-y-4">
                  <div *ngFor="let trip of getUpcomingTripsList()" 
                       [routerLink]="['/trips', trip.id]"
                       class="group cursor-pointer bg-gray-50 dark:bg-gray-800 rounded-xl p-5 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-2 border-transparent hover:border-primary-500">
                    <div class="flex items-start justify-between">
                      <div class="flex-1">
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                          {{trip.title}}
                        </h3>
                        <div class="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span class="flex items-center">
                            <svg class="w-4 h-4 mr-1.5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            {{trip.destination}}
                          </span>
                          <span class="flex items-center">
                            <svg class="w-4 h-4 mr-1.5 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            {{trip.startDate | date:'MMM d, yyyy'}}
                          </span>
                        </div>
                      </div>
                      <div class="ml-4 text-center">
                        <div class="text-3xl font-bold text-primary-600 dark:text-primary-400">
                          {{trip.daysUntil}}
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">days</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div *ngIf="getUpcomingTripsList().length === 0" class="text-center py-16">
                  <div class="inline-block p-6 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                    <svg class="w-16 h-16 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">No upcoming trips</h3>
                  <p class="text-gray-600 dark:text-gray-400 mb-6">Start planning your next adventure!</p>
                  <a routerLink="/trips/create" 
                     class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Create Your First Trip
                  </a>
                </div>
              </div>
            </div>

            <!-- Recent Trips -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span class="w-1 h-8 bg-gradient-to-b from-primary-600 to-secondary-600 rounded-full mr-3"></span>
                Recent Trips
              </h2>
              
              <div *ngIf="getRecentTripsList().length > 0" class="space-y-3">
                <div *ngFor="let trip of getRecentTripsList()" 
                     [routerLink]="['/trips', trip.id]"
                     class="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer group transition-all border border-transparent hover:border-gray-300 dark:hover:border-gray-700">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                        {{trip.title}}
                      </div>
                      <div class="text-sm text-gray-600 dark:text-gray-400">
                        {{trip.destination}} • {{trip.endDate | date:'MMM yyyy'}}
                      </div>
                    </div>
                  </div>
                  <svg class="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Sidebar -->
          <div class="space-y-8">
            <!-- Quick Actions -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-5">Quick Actions</h2>
              <div class="space-y-3">
                <a routerLink="/trips/create" 
                   class="flex items-center p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all group">
                  <div class="w-11 h-11 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                  </div>
                  <span class="font-semibold text-gray-900 dark:text-white">New Trip</span>
                </a>

                <a routerLink="/ai-recommendations" 
                   class="flex items-center p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-secondary-500 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-all group">
                  <div class="w-11 h-11 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-secondary-600 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                  </div>
                  <span class="font-semibold text-gray-900 dark:text-white">AI Suggestions</span>
                </a>

                <a routerLink="/destinations" 
                   class="flex items-center p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group">
                  <div class="w-11 h-11 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span class="font-semibold text-gray-900 dark:text-white">Explore</span>
                </a>

                <a routerLink="/analytics" 
                   class="flex items-center p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group">
                  <div class="w-11 h-11 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  <span class="font-semibold text-gray-900 dark:text-white">Analytics</span>
                </a>
              </div>
            </div>

            <!-- Badges -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-5">Recent Badges</h2>
              <div *ngIf="hasBadges()" class="grid grid-cols-3 gap-3">
                <div *ngFor="let badge of getBadges().slice(0, 6)" 
                     class="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all group cursor-pointer"
                     [title]="badge.description">
                  <div class="text-3xl mb-2 group-hover:scale-125 transition-transform">{{badge.icon}}</div>
                  <div class="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">{{badge.name}}</div>
                </div>
              </div>
              <div *ngIf="!hasBadges()" class="text-center py-12">
                <div class="inline-block p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-3">
                  <svg class="w-12 h-12 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                  </svg>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Complete trips to earn badges!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  summary: any = null;
  loading = false;

  constructor(
    private authService: AuthService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.analyticsService.getDashboardSummary().subscribe({
      next: (response) => {
        this.summary = response.summary;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.loading = false;
      }
    });
  }

  getUserAvatar(): string {
    return this.currentUser?.avatar || '/assets/default-avatar.png';
  }

  getUserName(): string {
    return this.currentUser?.name || 'Traveler';
  }

  getLevel(): number {
    return this.currentUser?.gamification?.level || 1;
  }

  getPoints(): number {
    return this.currentUser?.gamification?.points || 0;
  }

  getTotalTrips(): number {
    return this.summary?.quickStats?.totalTrips || 0;
  }

  getCompletedTrips(): number {
    return this.summary?.quickStats?.completedTrips || 0;
  }

  getUpcomingTrips(): number {
    return this.summary?.quickStats?.upcomingTrips || 0;
  }

  getBadgesCount(): number {
    return this.currentUser?.gamification?.badges?.length || 0;
  }

  getBadges(): any[] {
    return this.currentUser?.gamification?.badges || [];
  }

  hasBadges(): boolean {
    return this.getBadges().length > 0;
  }

  getUpcomingTripsList(): any[] {
    return this.summary?.upcomingTrips || [];
  }

  getRecentTripsList(): any[] {
    return this.summary?.recentTrips || [];
  }
}
