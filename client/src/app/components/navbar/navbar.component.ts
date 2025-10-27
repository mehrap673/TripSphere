import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { User } from '../../models/user.model';



@Component({
    selector: 'app-navbar',
    imports: [CommonModule, RouterModule],
    template: `
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center space-x-3 cursor-pointer" routerLink="/home">
         <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/50 ">
              <img src="assets/smart-travel.png"  alt="TripSphere Logo" class="w-10 rounded-xl h-10 object-cover">
          </div>



            <span class="text-xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 bg-clip-text text-transparent">
              TripSphere
            </span>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden lg:flex items-center space-x-1">
            <a routerLink="/home" routerLinkActive="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300" 
               [routerLinkActiveOptions]="{exact: true}"
               class="px-3 py-2 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
              Home
            </a>
            <a routerLink="/destinations" routerLinkActive="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
               class="px-3 py-2 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
              Destinations
            </a>
            <a routerLink="/hotels" routerLinkActive="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
               class="px-3 py-2 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
              Hotels
            </a>
            <a routerLink="/activities" routerLinkActive="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
               class="px-3 py-2 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
              Activities
            </a>
            <a *ngIf="isAuthenticated" routerLink="/trips" routerLinkActive="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
               class="px-3 py-2 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
              My Trips
            </a>
            <a *ngIf="isAuthenticated" routerLink="/dashboard" routerLinkActive="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
               class="px-3 py-2 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
              Dashboard
            </a>
            <a *ngIf="isAuthenticated" routerLink="/analytics" routerLinkActive="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
               class="px-3 py-2 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
              Analytics
            </a>
            <a *ngIf="isAuthenticated" routerLink="/ai-recommendations" routerLinkActive="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
               class="px-3 py-2 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
              AI
            </a>
          </div>

          <!-- Right Side Actions -->
          <div class="flex items-center space-x-2">
            <!-- Theme Toggle -->
            <button (click)="toggleTheme()" 
                    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
              <svg *ngIf="!isDarkMode" class="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>
              <svg *ngIf="isDarkMode" class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </button>

            <!-- User Menu (Desktop) -->
            <div *ngIf="currentUser" class="hidden lg:block relative">
              <button (click)="toggleDropdown()" 
                      class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
                <img [src]="currentUser.avatar || 'https://i.pravatar.cc/150'" 
                     [alt]="currentUser.name"
                     class="w-8 h-8 rounded-full ring-2 ring-primary-500 object-cover">
                <span class="hidden xl:block font-medium text-sm text-gray-700 dark:text-gray-200">
                  {{currentUser.name}}
                </span>
                <svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div *ngIf="dropdownOpen" 
                   class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div class="p-3 border-b border-gray-200 dark:border-gray-700">
                  <p class="font-semibold text-sm text-gray-900 dark:text-white truncate">{{currentUser.name}}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{currentUser.email}}</p>
                </div>

                <div class="py-2">
                  <a routerLink="/profile" (click)="closeDropdown()"
                     class="flex items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-200">
                    <svg class="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span>Profile</span>
                  </a>

                  <button (click)="logout()" 
                          class="w-full flex items-center px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm text-red-600 dark:text-red-400">
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Auth Buttons (Desktop) -->
            <div *ngIf="!isAuthenticated" class="hidden lg:flex items-center space-x-2">
              <a routerLink="/login" 
                 class="px-4 py-2 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
                Login
              </a>
              <a routerLink="/register"
                 class="px-4 py-2 rounded-lg font-medium text-sm bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-lg hover:shadow-primary-500/50 transition-all duration-300">
                Sign Up
              </a>
            </div>

            <!-- Mobile Menu Button -->
            <button (click)="toggleMobileMenu()" class="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg *ngIf="!mobileMenuOpen" class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
              <svg *ngIf="mobileMenuOpen" class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div *ngIf="mobileMenuOpen" class="lg:hidden border-t border-gray-200 dark:border-gray-700 py-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <!-- User Info (Mobile) -->
          <div *ngIf="currentUser" class="px-4 py-3 mb-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="flex items-center space-x-3">
              <img [src]="currentUser.avatar || 'https://i.pravatar.cc/150'" 
                   [alt]="currentUser.name"
                   class="w-10 h-10 rounded-full object-cover">
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-sm text-gray-900 dark:text-white truncate">{{currentUser.name}}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{currentUser.email}}</p>
              </div>
            </div>
          </div>

          <!-- Mobile Navigation Links -->
          <div class="space-y-1">
            <a routerLink="/home" (click)="closeMobileMenu()"
               routerLinkActive="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
               [routerLinkActiveOptions]="{exact: true}"
               class="flex items-center px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Home
            </a>
            
            <a routerLink="/destinations" (click)="closeMobileMenu()"
               routerLinkActive="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
               class="flex items-center px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Destinations
            </a>
            
            <a routerLink="/hotels" (click)="closeMobileMenu()"
               routerLinkActive="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
               class="flex items-center px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              Hotels
            </a>
            
            <a routerLink="/activities" (click)="closeMobileMenu()"
               routerLinkActive="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
               class="flex items-center px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Activities
            </a>

            <!-- Authenticated Links (Mobile) -->
            <div *ngIf="isAuthenticated" class="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
              <a routerLink="/trips" (click)="closeMobileMenu()"
                 routerLinkActive="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                 class="flex items-center px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                My Trips
              </a>

              <a routerLink="/dashboard" (click)="closeMobileMenu()"
                 routerLinkActive="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                 class="flex items-center px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 13a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z"></path>
                </svg>
                Dashboard
              </a>

              <a routerLink="/analytics" (click)="closeMobileMenu()"
                 routerLinkActive="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                 class="flex items-center px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                Analytics
              </a>

              <a routerLink="/ai-recommendations" (click)="closeMobileMenu()"
                 routerLinkActive="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                 class="flex items-center px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                AI Recommendations
              </a>

              <a routerLink="/profile" (click)="closeMobileMenu()"
                 routerLinkActive="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                 class="flex items-center px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Profile
              </a>

              <button (click)="logout()" 
                      class="w-full flex items-center px-4 py-3 rounded-lg font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Logout
              </button>
            </div>

            <!-- Auth Buttons (Mobile) -->
            <div *ngIf="!isAuthenticated" class="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <a routerLink="/login" (click)="closeMobileMenu()"
                 class="block w-full px-4 py-3 text-center rounded-lg font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
                Login
              </a>
              <a routerLink="/register" (click)="closeMobileMenu()"
                 class="block w-full px-4 py-3 text-center rounded-lg font-medium text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg">
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  isAuthenticated = false;
  dropdownOpen = false;
  mobileMenuOpen = false;
  isDarkMode = false;
   logoPath = 'assets/smart-travel.png';  // ✅ Use absolute path
  appName = 'TripSphere';

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
    });

    this.themeService.isDark$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.closeDropdown();
    this.closeMobileMenu();
    this.router.navigate(['/']);
  }
}
