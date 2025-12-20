import { HttpInterceptorFn } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  
  // Get token directly from localStorage, avoiding circular dependency
  let token: string | null = null;
  if (isPlatformBrowser(platformId)) {
    token = localStorage.getItem('auth_token');
  }

  // Only add token to API requests (not to external URLs)
  if (token && req.url.includes('/api/')) {
    console.log('🔐 Interceptor: Adding token to request:', req.url);
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};