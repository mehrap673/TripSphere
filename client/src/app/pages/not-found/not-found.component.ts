import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div class="text-center">
        <div class="mb-8 animate-bounce">
          <svg class="w-32 h-32 mx-auto text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h1 class="text-9xl font-bold gradient-text mb-4 animate-fade-up">404</h1>
        <h2 class="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4 animate-fade-up" style="animation-delay: 0.1s">
          Page Not Found
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-8 animate-fade-up" style="animation-delay: 0.2s">
          Oops! The page you're looking for doesn't exist.
        </p>
        <a routerLink="/" 
           class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/50 transition-all duration-300 btn-glow animate-fade-up"
           style="animation-delay: 0.3s">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          Go Home
        </a>
      </div>
    </div>
  `
})
export class NotFoundComponent {}
