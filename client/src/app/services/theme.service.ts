import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  public isDark$ = this.darkModeSubject.asObservable();

  constructor() {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || 
                   (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    this.setDarkMode(isDark);
  }

  toggleTheme(): void {
    const isDark = !this.darkModeSubject.value;
    this.setDarkMode(isDark);
  }

  setDarkMode(isDark: boolean): void {
    this.darkModeSubject.next(isDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  getCurrentTheme(): boolean {
    return this.darkModeSubject.value;
  }
}
