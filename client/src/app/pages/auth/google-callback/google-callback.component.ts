import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-google-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div class="text-center px-4">
        <!-- Loading Spinner -->
        <div *ngIf="status === 'loading'" class="inline-block relative mb-8">
          <div class="w-24 h-24 border-4 border-gray-200 dark:border-gray-800 rounded-full"></div>
          <div class="w-24 h-24 border-4 border-primary-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>

        <!-- Status Icon -->
        <div *ngIf="status === 'error'" class="inline-block p-6 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
          <svg class="w-16 h-16 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>

        <div *ngIf="status === 'success'" class="inline-block p-6 bg-green-100 dark:bg-green-900/20 rounded-full mb-6">
          <svg class="w-16 h-16 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <!-- Message -->
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {{message}}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto">
          {{description}}
        </p>

        <!-- Progress Bar -->
        <div *ngIf="status === 'loading'" class="mt-8 max-w-xs mx-auto">
          <div class="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class GoogleCallbackComponent implements OnInit {
  message = 'Authenticating with Google...';
  description = 'Please wait while we complete your authentication';
  status: 'loading' | 'success' | 'error' = 'loading';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const error = params['error'];

      if (error) {
        this.handleError('Unable to authenticate with Google. Please try again.');
        return;
      }

      if (token) {
        this.handleAuthentication(token);
      } else {
        this.handleError('No authentication token provided');
      }
    });
  }

  private handleAuthentication(token: string): void {
    this.status = 'loading';
    this.message = 'Authenticating...';
    this.description = 'Verifying your credentials with Google';

    try {
      // Call the auth service method (assuming it stores token and redirects)
      this.authService.handleGoogleCallback(token);
      
      // If handleGoogleCallback is synchronous and successful
      this.status = 'success';
      this.message = 'Authentication Successful!';
      this.description = 'Redirecting to your dashboard...';
      
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);
    } catch (error: any) {
      console.error('Google callback error:', error);
      this.handleError(error?.message || 'Something went wrong. Please try again.');
    }
  }

  private handleError(errorMessage: string): void {
    this.status = 'error';
    this.message = 'Authentication Failed';
    this.description = errorMessage;
    
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3000);
  }
}
