import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-trip-edit',
    imports: [CommonModule, RouterModule],
    template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12 flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Trip Edit Page</h1>
        <p class="text-gray-600 dark:text-gray-400 mb-8">This feature is coming soon!</p>
        <a routerLink="/trips" class="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors">
          Back to Trips
        </a>
      </div>
    </div>
  `
})
export class TripEditComponent {}
