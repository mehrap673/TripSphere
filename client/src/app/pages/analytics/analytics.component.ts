import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8 animate-fade-up">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Travel Analytics
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Track your travel statistics and spending patterns
          </p>
        </div>

        <!-- Stats Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Total Trips Card -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-up">
            <div class="flex items-center justify-between mb-4">
              <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
            </div>
            <div class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {{ getTotalTrips() }}
            </div>
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Trips</div>
            <div class="mt-3 flex items-center text-xs">
              <span class="text-green-600 dark:text-green-400 font-semibold">✈️ Active</span>
            </div>
          </div>

          <!-- Completed Trips Card -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-up" style="animation-delay: 0.1s">
            <div class="flex items-center justify-between mb-4">
              <div class="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {{ getCompletedTrips() }}
            </div>
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</div>
            <div class="mt-3 flex items-center text-xs">
              <span class="text-green-600 dark:text-green-400 font-semibold">🎉 Finished</span>
            </div>
          </div>

          <!-- Destinations Card -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-up" style="animation-delay: 0.2s">
            <div class="flex items-center justify-between mb-4">
              <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {{ getDestinationsVisited() }}
            </div>
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400">Destinations</div>
            <div class="mt-3 flex items-center text-xs">
              <span class="text-purple-600 dark:text-purple-400 font-semibold">🌍 Explored</span>
            </div>
          </div>

          <!-- Total Spent Card -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-up" style="animation-delay: 0.3s">
            <div class="flex items-center justify-between mb-4">
              <div class="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              \${{ getTotalSpent() }}
            </div>
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</div>
            <div class="mt-3 flex items-center text-xs">
              <span class="text-orange-600 dark:text-orange-400 font-semibold">💰 Invested</span>
            </div>
          </div>
        </div>

        <div class="grid lg:grid-cols-2 gap-8">
          <!-- Spending Overview -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 animate-fade-up" style="animation-delay: 0.4s">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Spending Overview</h2>
            </div>
            
            <div class="space-y-6">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Budget</span>
                  <span class="text-lg font-bold text-gray-900 dark:text-white">\${{ getTotalBudget() }}</span>
                </div>
                <div class="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg" 
                       style="width: 100%"></div>
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between mb-3">
                  <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Spent</span>
                  <span class="text-lg font-bold text-gray-900 dark:text-white">\${{ getTotalSpent() }}</span>
                </div>
                <div class="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg" 
                       [style.width.%]="getSpentPercentage()"></div>
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between mb-3">
                  <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Savings Rate</span>
                  <span class="text-lg font-bold text-primary-600 dark:text-primary-400">{{ getSavingsRate() }}%</span>
                </div>
                <div class="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full shadow-lg" 
                       [style.width.%]="getSavingsRateValue()"></div>
                </div>
              </div>

              <div class="pt-4 border-t border-gray-200 dark:border-gray-800">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Average per Trip</span>
                  <span class="text-2xl font-bold text-gray-900 dark:text-white">\${{ getAverageSpent() }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Budget Performance -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 animate-fade-up" style="animation-delay: 0.5s">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Budget Performance</h2>
            </div>
            
            <div class="space-y-4">
              <div class="p-5 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 hover:scale-105 transition-transform">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                      <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="font-bold text-gray-900 dark:text-white">Under Budget</div>
                      <div class="text-sm text-gray-600 dark:text-gray-400">Saving money</div>
                    </div>
                  </div>
                  <span class="text-3xl font-bold text-green-600 dark:text-green-400">
                    {{ getUnderBudget() }}
                  </span>
                </div>
              </div>

              <div class="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800 hover:scale-105 transition-transform">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                      <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="font-bold text-gray-900 dark:text-white">On Budget</div>
                      <div class="text-sm text-gray-600 dark:text-gray-400">Perfect balance</div>
                    </div>
                  </div>
                  <span class="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {{ getOnBudget() }}
                  </span>
                </div>
              </div>

              <div class="p-5 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-200 dark:border-red-800 hover:scale-105 transition-transform">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shadow-lg">
                      <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="font-bold text-gray-900 dark:text-white">Over Budget</div>
                      <div class="text-sm text-gray-600 dark:text-gray-400">Exceeded limit</div>
                    </div>
                  </div>
                  <span class="text-3xl font-bold text-red-600 dark:text-red-400">
                    {{ getOverBudget() }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Top Destinations -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 animate-fade-up" style="animation-delay: 0.6s">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Top Destinations</h2>
            </div>
            
            <div class="space-y-3">
              <div *ngFor="let destination of getTopDestinations(); let i = index" 
                   class="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all border border-gray-200 dark:border-gray-800 hover:shadow-lg group">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    #{{i + 1}}
                  </div>
                  <div>
                    <div class="font-bold text-gray-900 dark:text-white">{{ destination.name }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                      <span class="font-semibold text-primary-600 dark:text-primary-400">\${{ destination.totalSpent }}</span> spent • 
                      <span class="font-semibold">{{ destination.count }}</span> trips
                    </div>
                  </div>
                </div>
                <svg class="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Trip Types -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 animate-fade-up" style="animation-delay: 0.7s">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Trip Types</h2>
            </div>
            
            <div class="space-y-4">
              <div *ngFor="let type of getTripTypes()" 
                   class="group">
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-3xl">{{ getTypeIcon(type.name) }}</span>
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <span class="font-bold text-gray-900 dark:text-white capitalize">{{ type.name }}</span>
                      <span class="text-sm font-bold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 px-3 py-1 rounded-full">
                        {{ type.count }} trips
                      </span>
                    </div>
                    <div class="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div class="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full shadow-lg transition-all group-hover:shadow-xl" 
                           [style.width.%]="getTypePercentage(type.count)"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AnalyticsComponent implements OnInit {
  analytics: any = null;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.analyticsService.getUserAnalytics().subscribe({
      next: (response) => {
        this.analytics = response.analytics;
      },
      error: (err) => {
        console.error('Error loading analytics:', err);
      }
    });
  }

  getTotalTrips(): number {
    return this.analytics?.totalTrips || 0;
  }

  getCompletedTrips(): number {
    return this.analytics?.completedTrips || 0;
  }

  getDestinationsVisited(): number {
    return this.analytics?.destinationsVisited || 0;
  }

  getTotalSpent(): number {
    return this.analytics?.totalSpent || 0;
  }

  getTotalBudget(): number {
    return this.analytics?.totalBudget || 0;
  }

  getSavingsRate(): string {
    if (!this.analytics?.savingsRate) return '0';
    return this.analytics.savingsRate.toFixed(1);
  }

  getSavingsRateValue(): number {
    return this.analytics?.savingsRate || 0;
  }

  getAverageSpent(): string {
    if (!this.analytics?.averageSpent) return '0';
    return this.analytics.averageSpent.toFixed(2);
  }

  getUnderBudget(): number {
    return this.analytics?.budgetPerformance?.underBudget || 0;
  }

  getOnBudget(): number {
    return this.analytics?.budgetPerformance?.onBudget || 0;
  }

  getOverBudget(): number {
    return this.analytics?.budgetPerformance?.overBudget || 0;
  }

  getTopDestinations(): any[] {
    return this.analytics?.topDestinations || [];
  }

  getSpentPercentage(): number {
    if (!this.analytics?.totalBudget) return 0;
    return Math.min((this.analytics.totalSpent / this.analytics.totalBudget) * 100, 100);
  }

  getTripTypes(): any[] {
    if (!this.analytics?.tripsByType) return [];
    const entries = Object.entries(this.analytics.tripsByType);
    return entries.map((entry) => {
      return { 
        name: entry[0], 
        count: entry[1] 
      };
    });
  }

  getTypePercentage(count: any): number {
    if (!this.analytics?.totalTrips) return 0;
    return (count / this.analytics.totalTrips) * 100;
  }

  getTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'beach': '🏖️',
      'city': '🏙️',
      'adventure': '🏔️',
      'cultural': '🏛️',
      'business': '💼',
      'relaxation': '🧘',
      'family': '👨‍👩‍👧‍👦',
      'solo': '🚶',
      'group': '👥'
    };
    return icons[type] || '✈️';
  }
}
