import { ChangeDetectionStrategy, Component, signal, inject, computed, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

// Define the DataService locally. It is provided globally via providedIn: 'root'.
interface Post {
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService { 
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/quote/random';

  fetchPost(): Observable<string | null> {
    return this.http.get<string>(this.apiUrl, { 
        responseType: 'text' as 'json' 
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('API Error in DataService:', error);
          // Return null to signify error handling is complete, allowing component to update state
          return of(null); 
        })
      );
  }
}