import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthResponse, UserInfo } from '../models/auth.models';
import { environment } from '../../../environments/environment';

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
    console.log('🔷 AuthService constructor called');
    if (isPlatformBrowser(this.platformId)) {
      console.log('✅ Is browser, calling checkStoredToken');
      this.checkStoredToken();
    } else {
      console.log('❌ Not browser, skipping checkStoredToken');
      this.initializedSubject.next(true);
    }
  }
  
  private checkStoredToken(): void {
    const token = this.getToken();
    console.log('🔍 checkStoredToken - token:', token ? token.substring(0, 30) + '...' : 'NO TOKEN');
    
    if (token) {
      this.validateToken(token).subscribe({
        next: (response) => {
          console.log('✅ checkStoredToken - validation response:', response);
          if (response.valid && response.email) {
            console.log('👤 checkStoredToken - setting user');
            this.setCurrentUserInternal({
              email: response.email,
              isAdmin: response.isAdmin || false
            }, 'checkStoredToken');
          } else {
            console.log('❌ checkStoredToken - invalid response, logging out');
            this.logout();
          }
          this.initializedSubject.next(true);
        },
        error: (err) => {
          console.error('❌ checkStoredToken - validation error:', err);
          this.logout();
          this.initializedSubject.next(true);
        }
      });
    } else {
      console.log('ℹ️ checkStoredToken - no token found, skipping validation');
      this.initializedSubject.next(true);
    }
  }
  
  validateToken(token: string): Observable<AuthResponse> {
    console.log('🔐 validateToken called');
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/validate`, { token });
  }
  
  handleAuthCallback(token: string): void {
    console.log('📞 handleAuthCallback called');
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
    console.log('🔓 login() called');
    if (isPlatformBrowser(this.platformId)) {

      // Get backend URL from environment (remove /api if present)
      const backendUrl = environment.apiUrl.replace('/api', '');
      
      // Redirect to backend OAuth endpoint
      window.location.href = `${backendUrl}/oauth2/authorization/google`;
      //window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    }
  }
  
  logout(): void {
    console.log('🔒 logout() called');
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
    console.log('💾 setToken called');
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
    console.log('👤 setCurrentUser called (public method)');
    this.setCurrentUserInternal(user, 'setCurrentUser (public)');
  }
  
  private setCurrentUserInternal(user: UserInfo | null, source: string): void {
    console.log(`🎯 setCurrentUserInternal called from: ${source}, setting user to:`, user);
    this.currentUserSubject.next(user);
  }
}