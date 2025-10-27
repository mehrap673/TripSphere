import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen relative overflow-hidden bg-gradient-to-br from-secondary-600 via-primary-600 to-pink-600 dark:from-secondary-900 dark:via-primary-900 dark:to-pink-900">
      <!-- Animated Background Shapes -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full filter blur-3xl animate-float"></div>
        <div class="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full filter blur-3xl animate-float" style="animation-delay: 2s"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 rounded-full filter blur-3xl animate-float" style="animation-delay: 4s"></div>
      </div>

      <!-- Grid Pattern Overlay -->
      <div class="absolute inset-0" style="background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px); background-size: 50px 50px;"></div>

      <!-- Main Content -->
      <div class="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div class="w-full max-w-md">
          <!-- Logo & Title with Animation -->
          <div class="text-center mb-8 animate-scale-in">
            <div class="inline-block relative mb-6">
              <div class="absolute inset-0 bg-white/30 rounded-3xl blur-2xl animate-pulse"></div>
              <div class="relative w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center border-2 border-white/30 shadow-2xl">
                <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
              </div>
            </div>
            <h1 class="text-4xl font-bold text-white mb-3 drop-shadow-lg animate-fade-up">Create Account</h1>
            <p class="text-lg text-white/90 drop-shadow-md animate-fade-up" style="animation-delay: 0.1s">Join us and start exploring</p>
          </div>

          <!-- Glassmorphism Register Card -->
          <div class="backdrop-blur-2xl bg-white/10 dark:bg-white/5 rounded-3xl shadow-2xl border-2 border-white/20 p-8 animate-slide-up" style="animation-delay: 0.2s">
            <!-- Error Message -->
            <div *ngIf="error" class="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-300/30 rounded-xl animate-shake">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-white mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-white text-sm font-medium">{{error}}</span>
              </div>
            </div>

            <!-- Google Sign Up Button with Glass Effect -->
            <button (click)="signUpWithGoogle()" 
                    type="button"
                    class="w-full flex items-center justify-center px-4 py-3.5 bg-white/20 backdrop-blur-xl hover:bg-white/30 border-2 border-white/30 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl mb-6 group">
              <svg class="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <!-- Divider with Animation -->
            <div class="relative my-6">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t-2 border-white/30"></div>
              </div>
              <div class="relative flex justify-center">
                <span class="px-4 bg-white/10 backdrop-blur-xl text-white font-medium rounded-full">Or sign up with</span>
              </div>
            </div>

            <!-- Register Form -->
            <form (ngSubmit)="onSubmit()" class="space-y-5">
              <!-- Name Field with Glass Effect -->
              <div class="group">
                <label class="block text-white font-semibold mb-2 text-sm">Full Name</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-white/60 group-hover:text-white/80 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <input id="name" 
                         name="name" 
                         type="text" 
                         [(ngModel)]="userData.name"
                         required 
                         class="w-full pl-12 pr-4 py-3.5 bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all hover:bg-white/25"
                         placeholder="John Doe">
                </div>
              </div>

              <!-- Email Field with Glass Effect -->
              <div class="group">
                <label class="block text-white font-semibold mb-2 text-sm">Email Address</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-white/60 group-hover:text-white/80 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <input id="email" 
                         name="email" 
                         type="email" 
                         [(ngModel)]="userData.email"
                         required 
                         class="w-full pl-12 pr-4 py-3.5 bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all hover:bg-white/25"
                         placeholder="you@example.com">
                </div>
              </div>

              <!-- Password Field with Glass Effect -->
              <div class="group">
                <label class="block text-white font-semibold mb-2 text-sm">Password</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-white/60 group-hover:text-white/80 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <input id="password" 
                         name="password" 
                         [type]="showPassword ? 'text' : 'password'" 
                         [(ngModel)]="userData.password"
                         required 
                         minlength="6"
                         class="w-full pl-12 pr-12 py-3.5 bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all hover:bg-white/25"
                         placeholder="Minimum 6 characters">
                  <button type="button" 
                          (click)="showPassword = !showPassword"
                          class="absolute inset-y-0 right-0 pr-4 flex items-center text-white/60 hover:text-white transition-colors">
                    <svg *ngIf="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    <svg *ngIf="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Terms & Conditions -->
              <div class="flex items-start">
                <input id="terms" 
                       name="terms" 
                       type="checkbox"
                       [(ngModel)]="acceptTerms"
                       required
                       class="h-4 w-4 mt-1 rounded border-white/30 bg-white/20 text-white focus:ring-white/50">
                <label for="terms" class="ml-3 text-sm text-white/90 leading-relaxed">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>

              <!-- Submit Button with Animation -->
              <button type="submit" 
                      [disabled]="loading || !acceptTerms"
                      class="w-full py-4 bg-white hover:bg-white/90 text-primary-600 font-bold rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group">
                <span *ngIf="!loading" class="flex items-center justify-center">
                  Create Account
                  <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </span>
                <span *ngIf="loading" class="flex items-center justify-center">
                  <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              </button>
            </form>
          </div>

          <!-- Sign In Link -->
          <p class="mt-6 text-center text-white/90 backdrop-blur-sm bg-white/10 rounded-full py-3 px-6 inline-block animate-fade-up" style="animation-delay: 0.4s">
            Already have an account? 
            <a routerLink="/login" class="font-bold hover:underline ml-1">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      33% { transform: translateY(-20px) rotate(5deg); }
      66% { transform: translateY(10px) rotate(-5deg); }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    @keyframes scale-in {
      0% { transform: scale(0.8); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes slide-up {
      0% { transform: translateY(30px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    @keyframes fade-up {
      0% { transform: translateY(10px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    .animate-float {
      animation: float 8s ease-in-out infinite;
    }
    .animate-shake {
      animation: shake 0.5s;
    }
    .animate-scale-in {
      animation: scale-in 0.5s ease-out;
    }
    .animate-slide-up {
      animation: slide-up 0.6s ease-out;
    }
    .animate-fade-up {
      animation: fade-up 0.6s ease-out;
    }
  `]
})
export class RegisterComponent {
  userData = {
    name: '',
    email: '',
    password: ''
  };
  acceptTerms = false;
  showPassword = false;
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';

    this.authService.register(this.userData).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }

  signUpWithGoogle(): void {
    this.authService.loginWithGoogle();
  }
}
