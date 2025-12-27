import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthResponse, UserInfo } from '../models/auth.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
    private apiUrl = environment.apiUrl; 
  
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable().pipe(
    tap(user => console.log('currentUser$ emitted:', user))
  );
  
  private initializedSubject = new BehaviorSubject<boolean>(false);
  public initialized$ = this.initializedSubject.asObservable();
  
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkStoredToken();
    } else {
      this.initializedSubject.next(true);
    }
  }
  
  private checkStoredToken(): void {
    const token = this.getToken();
    
    if (token) {
      this.validateToken(token).subscribe({
        next: (response) => {
          if (response.valid && response.email) {
            this.setCurrentUserInternal({
              email: response.email,
              isAdmin: response.isAdmin || false
            }, 'checkStoredToken');
          } else {
            this.logout();
          }
          this.initializedSubject.next(true);
        },
        error: (err) => {
          this.logout();
          this.initializedSubject.next(true);
        }
      });
    } else {
      this.initializedSubject.next(true);
    }
  }
  
  validateToken(token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/validate`, { token });
  }
  
  handleAuthCallback(token: string): void {
    this.setToken(token);
    this.validateToken(token).subscribe({
      next: (response) => {
        if (response.valid && response.email) {
          this.setCurrentUserInternal({
            email: response.email,
            isAdmin: response.isAdmin || false
          }, 'handleAuthCallback');
        }
      }
    });
  }
  
  login(): void {
    if (isPlatformBrowser(this.platformId)) {

      // Get backend URL from environment (remove /api if present)
      const backendUrl = environment.apiUrl.replace('/api', '');
      
      // Redirect to backend OAuth endpoint
      window.location.href = `${backendUrl}/oauth2/authorization/google`;
    }
  }
  
  logout(): void {
    console.trace();
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth_token');
    }
    this.setCurrentUserInternal(null, 'logout');
  }
  
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('auth_token');
    }
    return null;
  }
  
  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('auth_token', token);
    }
  }
  
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }
  
  isAdmin(): boolean {
    return this.currentUserSubject.value?.isAdmin || false;
  }
  
  getCurrentUser(): UserInfo | null {
    return this.currentUserSubject.value;
  }
  
  setCurrentUser(user: UserInfo): void {
    this.setCurrentUserInternal(user, 'setCurrentUser (public)');
  }
  
  private setCurrentUserInternal(user: UserInfo | null, source: string): void {
    this.currentUserSubject.next(user);
  }
}