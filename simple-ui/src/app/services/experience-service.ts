import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BlogPost, Tag, SiteContent, PagedResponse } from '../models/blog.models';
import { environment } from '../../environments/environment';
import { ExperienceData } from '../models/experience-data.models';

@Injectable({
  providedIn: 'root',
})
export class ExperienceService {

    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl; 

    // GET published/unpublished experiences for admin
    getAllExperiencesAdmin(): Observable<ExperienceData[]> {
      return this.http.get<ExperienceData[]>(`${this.apiUrl}/experience/admin/all`).pipe(
        catchError(error => {
          console.error('Error fetching admin posts:', error);
          return of([]);
        })
      );
    }

    deleteExperience(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/experience/admin/${id}`);
    }

    // GET published experiences
    getPublishedExperiences(): Observable<ExperienceData[]> {
      return this.http.get<ExperienceData[]>(`${this.apiUrl}/experience/published`);
    }

    // GET single experience by ID
    getExperienceById(id: number): Observable<ExperienceData> {
      return this.http.get<ExperienceData>(`${this.apiUrl}/experience/admin/${id}`);
    }

    // POST create new experience
    createExperience(experience: ExperienceData): Observable<ExperienceData> {
      return this.http.post<ExperienceData>(`${this.apiUrl}/experience/admin`, experience);
    }

    // PUT update experience
    updateExperience(id: number, experience: ExperienceData): Observable<ExperienceData> {
      return this.http.put<ExperienceData>(`${this.apiUrl}/experience/admin/${id}`, experience);
    }

    // PUT update accomplishments for an experience
    updateAccomplishments(experienceId: number, accomplishments: any[]): Observable<any> {
      return this.http.put(`${this.apiUrl}/experience/admin/${experienceId}/accomplishments`, accomplishments);
    }


}
