import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AiService } from '../../services/ai.service';

@Component({
    selector: 'app-ai-recommendations',
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-12 animate-fade-up">
          <div class="inline-block relative mb-6">
            <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
            <div class="relative p-5 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl shadow-2xl">
              <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
          </div>
          <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            AI-Powered Recommendations
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Let our AI help you discover perfect destinations and create amazing itineraries
          </p>
        </div>

        <!-- Input Form -->
        <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 mb-12 animate-fade-up" style="animation-delay: 0.1s">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Tell Us Your Preferences</h2>
          </div>
          
          <div class="grid md:grid-cols-2 gap-6">
            <!-- Travel Style -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Travel Style
              </label>
              <div class="relative">
                <select [(ngModel)]="preferences.travelStyle"
                        class="w-full px-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all appearance-none cursor-pointer">
                  <option value="adventure">🏔️ Adventure</option>
                  <option value="relaxation">🧘 Relaxation</option>
                  <option value="cultural">🏛️ Cultural</option>
                  <option value="foodie">🍽️ Foodie</option>
                  <option value="luxury">💎 Luxury</option>
                  <option value="budget">💰 Budget</option>
                </select>
                <svg class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>

            <!-- Budget Range -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Budget Range
              </label>
              <div class="relative">
                <select [(ngModel)]="preferences.budget"
                        class="w-full px-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all appearance-none cursor-pointer">
                  <option value="budget">💵 Budget ($-$$)</option>
                  <option value="moderate">💳 Moderate ($$-$$$)</option>
                  <option value="luxury">💎 Luxury ($$$-$$$$)</option>
                </select>
                <svg class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>

            <!-- Trip Duration -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Trip Duration (days)
              </label>
              <input type="number" 
                     [(ngModel)]="preferences.duration"
                     min="1"
                     max="30"
                     class="w-full px-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all">
            </div>

            <!-- Interests -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Interests (comma-separated)
              </label>
              <input type="text" 
                     [(ngModel)]="interestsInput"
                     placeholder="e.g., hiking, food, museums"
                     class="w-full px-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all">
            </div>
          </div>

          <button (click)="getRecommendations()"
                  [disabled]="loading"
                  class="mt-8 w-full md:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
            <svg *ngIf="!loading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            <svg *ngIf="loading" class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{loading ? 'Generating Recommendations...' : 'Get AI Recommendations'}}
          </button>
        </div>

        <!-- Recommendations -->
        <div *ngIf="recommendations.length > 0" class="animate-fade-up" style="animation-delay: 0.2s">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
              </svg>
            </div>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Recommended Destinations</h2>
          </div>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let rec of recommendations; let i = index" 
                 class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-up"
                 [style.animation-delay]="(i * 0.1) + 's'">
              <!-- Header -->
              <div class="bg-gradient-to-br from-purple-600 to-pink-600 p-6 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                <div class="relative flex items-start justify-between">
                  <div>
                    <h3 class="text-2xl font-bold text-white mb-1">
                      {{rec.name}}
                    </h3>
                    <p class="text-white/80 text-sm">{{rec.country}}</p>
                  </div>
                  <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl border border-white/30">
                    🌍
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div class="p-6">
                <p class="text-gray-700 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                  {{rec.description}}
                </p>

                <!-- Info Cards -->
                <div class="space-y-3 mb-4">
                  <div class="flex items-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <div class="flex-1">
                      <div class="text-xs text-gray-600 dark:text-gray-400">Best Time</div>
                      <div class="font-semibold text-gray-900 dark:text-white">{{rec.bestTime}}</div>
                    </div>
                  </div>

                  <div class="flex items-center p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <svg class="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div class="flex-1">
                      <div class="text-xs text-gray-600 dark:text-gray-400">Budget Range</div>
                      <div class="font-semibold text-gray-900 dark:text-white">{{rec.budgetRange}}</div>
                    </div>
                  </div>
                </div>

                <!-- Activities -->
                <div class="border-t border-gray-200 dark:border-gray-800 pt-4">
                  <p class="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3">Top Activities:</p>
                  <div class="flex flex-wrap gap-2">
                    <span *ngFor="let activity of rec.activities" 
                          class="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-medium border border-purple-200 dark:border-purple-800">
                      {{activity}}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && recommendations.length === 0 && !showEmptyState" 
             class="text-center py-20 animate-fade-up">
          <div class="inline-block p-8 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full mb-6">
            <div class="text-7xl animate-bounce">🤖</div>
          </div>
          <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">Ready to discover your next adventure?</h3>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">Fill in your preferences above and let AI work its magic!</p>
        </div>

        <!-- No Results State -->
        <div *ngIf="showEmptyState && recommendations.length === 0 && !loading" 
             class="text-center py-20 animate-fade-up">
          <div class="inline-block p-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-full mb-6">
            <div class="text-7xl">😔</div>
          </div>
          <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">No recommendations found</h3>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">Try adjusting your preferences and search again</p>
          <button (click)="recommendations = []; showEmptyState = false"
                  class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all">
            Try Again
          </button>
        </div>
      </div>
    </div>
  `
})
export class AiRecommendationsComponent {
  preferences = {
    travelStyle: 'cultural',
    budget: 'moderate',
    duration: 7,
    interests: [] as string[]
  };
  interestsInput = '';
  recommendations: any[] = [];
  loading = false;
  showEmptyState = false;

  constructor(private aiService: AiService) {}

  getRecommendations(): void {
    this.loading = true;
    this.showEmptyState = false;
    this.preferences.interests = this.interestsInput.split(',').map(i => i.trim()).filter(i => i);

    this.aiService.recommendDestinations(this.preferences).subscribe({
      next: (response) => {
        this.recommendations = response.aiRecommendations || response.popularDestinations || [];
        this.loading = false;
        this.showEmptyState = this.recommendations.length === 0;
      },
      error: (err) => {
        console.error('Error getting recommendations:', err);
        this.loading = false;
        this.showEmptyState = true;
      }
    });
  }
}
