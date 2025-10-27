import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DestinationService } from '../../services/destination.service';
import { WeatherService } from '../../services/weather.service';
import { Destination } from '../../models/destination.model';

@Component({
    selector: 'app-destination-detail',
    imports: [CommonModule, RouterModule],
    template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950" *ngIf="destination">
      <!-- Hero Section -->
      <div class="relative h-[70vh] overflow-hidden">
        <img [src]="getCoverImage()" 
             [alt]="destination.name"
             class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <!-- Content -->
        <div class="absolute bottom-0 left-0 right-0 pb-12">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-end justify-between flex-wrap gap-4">
              <div>
                <div class="flex items-center mb-4">
                  <div *ngFor="let star of getStars()" class="text-yellow-400">
                    <svg class="w-6 h-6" [class.text-yellow-400]="star <= destination.rating.average" [class.text-gray-400]="star > destination.rating.average" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                  <span class="text-white font-bold ml-3 text-lg drop-shadow-lg">{{getRatingFixed()}}</span>
                  <span class="text-white/90 ml-2 drop-shadow-md">({{destination.rating.count}} reviews)</span>
                </div>
                <h1 class="text-5xl md:text-6xl font-display font-bold text-white mb-4 animate-fade-up drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                  {{destination.name}}
                </h1>
                <div class="flex items-center text-white/90 text-xl animate-fade-up drop-shadow-lg" style="animation-delay: 0.1s">
                  <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  {{destination.country}} • {{destination.continent}}
                </div>
              </div>
              <button (click)="planTrip()" class="px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-primary-500/50 dark:hover:shadow-primary-500/30 transition-all duration-300 btn-glow flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Plan Trip Here
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Left Column -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Description -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 animate-fade-up border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300">
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">About {{destination.name}}</h2>
              <p class="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                {{destination.description}}
              </p>
            </div>

            <!-- Weather -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 animate-fade-up border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300" style="animation-delay: 0.1s" *ngIf="currentWeather">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Current Weather</h2>
              <div class="flex items-center justify-between flex-wrap gap-6">
                <div class="flex items-center space-x-6">
                  <img [src]="getWeatherIcon()" 
                       [alt]="getWeatherCondition()"
                       class="w-24 h-24">
                  <div>
                    <div class="text-5xl font-bold text-gray-900 dark:text-white">
                      {{getWeatherTemp()}}°C
                    </div>
                    <div class="text-xl text-gray-600 dark:text-gray-300 capitalize">
                      {{getWeatherDescription()}}
                    </div>
                  </div>
                </div>
                <div class="text-right space-y-2">
                  <div class="text-gray-600 dark:text-gray-400">
                    Feels like: <span class="font-semibold text-gray-900 dark:text-white">{{getWeatherFeelsLike()}}°C</span>
                  </div>
                  <div class="text-gray-600 dark:text-gray-400">
                    Humidity: <span class="font-semibold text-gray-900 dark:text-white">{{getWeatherHumidity()}}%</span>
                  </div>
                  <div class="text-gray-600 dark:text-gray-400">
                    Wind: <span class="font-semibold text-gray-900 dark:text-white">{{getWeatherWind()}} m/s</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Must Visit Places -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 animate-fade-up border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300" style="animation-delay: 0.2s">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Must-Visit Places</h2>
              <div class="grid md:grid-cols-2 gap-4">
                <div *ngFor="let place of destination.mustVisit" 
                     class="flex items-start p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-lg transition-all">
                  <svg class="w-6 h-6 text-primary-500 dark:text-primary-400 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="text-gray-700 dark:text-gray-200">{{place}}</span>
                </div>
              </div>
            </div>

            <!-- Popular Activities -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 animate-fade-up border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300" style="animation-delay: 0.3s">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Popular Activities</h2>
              <div class="flex flex-wrap gap-3">
                <span *ngFor="let activity of destination.popularActivities" 
                      class="px-4 py-2 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/30 dark:to-secondary-900/30 border border-primary-200 dark:border-primary-700 rounded-xl text-primary-700 dark:text-primary-300 font-medium hover:scale-105 hover:shadow-lg hover:shadow-primary-500/50 transition-all cursor-pointer">
                  {{activity}}
                </span>
              </div>
            </div>

            <!-- Local Cuisine -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 animate-fade-up border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300" style="animation-delay: 0.4s">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span class="text-3xl mr-3">🍽️</span>
                Local Cuisine
              </h2>
              <div class="grid md:grid-cols-3 gap-4">
                <div *ngFor="let dish of destination.localCuisine" 
                     class="text-center p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-700 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/50 transition-all">
                  <div class="text-2xl mb-2">🍴</div>
                  <div class="font-medium text-gray-900 dark:text-gray-100">{{dish}}</div>
                </div>
              </div>
            </div>

            <!-- Gallery -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 animate-fade-up border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300" style="animation-delay: 0.5s">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Photo Gallery</h2>
              <div class="grid md:grid-cols-3 gap-4">
                <div *ngFor="let image of destination.images" 
                     class="relative h-48 rounded-xl overflow-hidden group cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-lg transition-all">
                  <img [src]="image" 
                       [alt]="destination.name"
                       class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                  <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column (Sidebar) -->
          <div class="space-y-6">
            <!-- Quick Info -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 sticky top-24 animate-fade-up border border-gray-100 dark:border-gray-700 shadow-lg">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Info</h3>
              
              <!-- Budget -->
              <div class="mb-6">
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Average Budget</div>
                <div class="space-y-2">
                  <div class="flex items-center justify-between p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
                    <span class="text-gray-700 dark:text-gray-300 font-medium">Budget</span>
                    <span class="font-semibold text-green-600 dark:text-green-400">\${{destination.averageCost.budget}}</span>
                  </div>
                  <div class="flex items-center justify-between p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                    <span class="text-gray-700 dark:text-gray-300 font-medium">Moderate</span>
                    <span class="font-semibold text-blue-600 dark:text-blue-400">\${{destination.averageCost.moderate}}</span>
                  </div>
                  <div class="flex items-center justify-between p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
                    <span class="text-gray-700 dark:text-gray-300 font-medium">Luxury</span>
                    <span class="font-semibold text-purple-600 dark:text-purple-400">\${{destination.averageCost.luxury}}</span>
                  </div>
                </div>
              </div>

              <div class="border-t border-gray-200 dark:border-gray-700 my-6"></div>

              <!-- Details -->
              <div class="space-y-4">
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                  </svg>
                  <div>
                    <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Climate</div>
                    <div class="font-medium text-gray-900 dark:text-gray-100">{{destination.climate}}</div>
                  </div>
                </div>

                <div class="flex items-start">
                  <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Currency</div>
                    <div class="font-medium text-gray-900 dark:text-gray-100">{{destination.currency}}</div>
                  </div>
                </div>

                <div class="flex items-start">
                  <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                  </svg>
                  <div>
                    <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Language</div>
                    <div class="font-medium text-gray-900 dark:text-gray-100">{{getLanguages()}}</div>
                  </div>
                </div>

                <div class="flex items-start">
                  <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Timezone</div>
                    <div class="font-medium text-gray-900 dark:text-gray-100">{{destination.timezone}}</div>
                  </div>
                </div>

                <div class="flex items-start">
                  <svg class="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" [class.text-green-500]="!destination.visaRequired" [class.text-red-500]="destination.visaRequired" [class.dark:text-green-400]="!destination.visaRequired" [class.dark:text-red-400]="destination.visaRequired" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Visa</div>
                    <div class="font-medium" [class.text-green-600]="!destination.visaRequired" [class.text-red-600]="destination.visaRequired" [class.dark:text-green-400]="!destination.visaRequired" [class.dark:text-red-400]="destination.visaRequired">
                      {{getVisaStatus()}}
                    </div>
                  </div>
                </div>

                <div class="flex items-start">
                  <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  <div>
                    <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Safety Rating</div>
                    <div class="flex items-center">
                      <div *ngFor="let star of getSafetyStars()" class="mr-1">
                        <svg class="w-4 h-4" [class.text-yellow-400]="star <= destination.safetyRating" [class.text-gray-300]="star > destination.safetyRating" [class.dark:text-gray-600]="star > destination.safetyRating" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="border-t border-gray-200 dark:border-gray-700 my-6"></div>

              <!-- Best Time to Visit -->
              <div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Best Time to Visit</div>
                <div class="flex flex-wrap gap-2 mb-3">
                  <span *ngFor="let month of destination.bestTimeToVisit.months" 
                        class="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-700 rounded-lg text-sm font-medium">
                    {{month}}
                  </span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-300">{{destination.bestTimeToVisit.description}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div *ngIf="!destination" class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div class="text-center">
        <div class="inline-block relative mb-8">
          <div class="w-20 h-20 border-4 border-primary-200 dark:border-primary-900 rounded-full"></div>
          <div class="w-20 h-20 border-4 border-primary-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p class="text-gray-600 dark:text-gray-400">Loading destination...</p>
      </div>
    </div>
  `
})
export class DestinationDetailComponent implements OnInit {
  destination: Destination | null = null;
  currentWeather: any = null;

  constructor(
    private route: ActivatedRoute,
    private destinationService: DestinationService,
    private weatherService: WeatherService,
    private router: Router  // Add Router injection
  ) { }

  // Add this method
  planTrip(): void {
    if (!this.destination) return;

    this.router.navigate(['/trips/create'], {
      state: {
        destination: this.destination,
        weather: this.currentWeather
      }
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadDestination(id);
    });
  }

  loadDestination(id: string): void {
    this.destinationService.getDestinationById(id).subscribe({
      next: (response) => {
        this.destination = response.destination;
        if (this.destination?.coordinates) {
          this.loadWeather();
        }
      },
      error: (err) => {
        console.error('Error loading destination:', err);
      }
    });
  }

  loadWeather(): void {
    if (!this.destination?.coordinates) return;

    this.weatherService.getCurrentWeather(
      this.destination.coordinates.lat,
      this.destination.coordinates.lng
    ).subscribe({
      next: (response) => {
        this.currentWeather = response;
      },
      error: (err) => {
        console.error('Error loading weather:', err);
      }
    });
  }

  getCoverImage(): string {
    if (!this.destination) return '';
    return this.destination.coverImage || (this.destination.images && this.destination.images[0]) || '';
  }

  getStars(): number[] {
    return [1, 2, 3, 4, 5];
  }

  getSafetyStars(): number[] {
    return [1, 2, 3, 4, 5];
  }

  getRatingFixed(): string {
    if (!this.destination) return '0.0';
    return this.destination.rating.average.toFixed(1);
  }

  getLanguages(): string {
    if (!this.destination) return '';
    return this.destination.language.join(', ');
  }

  getVisaStatus(): string {
    if (!this.destination) return '';
    return this.destination.visaRequired ? 'Required' : 'Not Required';
  }

  getWeatherIcon(): string {
    if (!this.currentWeather?.weather?.icon) return '';
    return `https://openweathermap.org/img/wn/${this.currentWeather.weather.icon}@4x.png`;
  }

  getWeatherCondition(): string {
    return this.currentWeather?.weather?.condition || '';
  }

  getWeatherTemp(): number {
    return this.currentWeather?.weather?.temperature || 0;
  }

  getWeatherDescription(): string {
    return this.currentWeather?.weather?.description || '';
  }

  getWeatherFeelsLike(): number {
    return this.currentWeather?.weather?.feelsLike || 0;
  }

  getWeatherHumidity(): number {
    return this.currentWeather?.weather?.humidity || 0;
  }

  getWeatherWind(): number {
    return this.currentWeather?.weather?.windSpeed || 0;
  }
}
