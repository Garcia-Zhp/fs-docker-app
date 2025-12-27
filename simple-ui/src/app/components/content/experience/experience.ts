import { Component, OnInit, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { ExperienceData } from '../../../models/experience-data.models';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.html',
  styleUrl: './experience.css'
})
export class Experience implements OnInit {
  // ✅ Angular 20+ inject() instead of constructor
  private http = inject(HttpClient);
  
  // ✅ Angular 20+ signals
  experiences = signal<ExperienceData[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadExperiences();
  }

  loadExperiences() {
    const apiUrl = environment.production 
      ? environment.apiUrl 
      : 'http://localhost:8080/api';
    
    this.http.get<ExperienceData[]>(`${apiUrl}/experience/published`)
      .subscribe({
        next: (data) => {
          this.experiences.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error loading experiences:', err);
          this.error.set('Failed to load experiences');
          this.isLoading.set(false);
        }
      });
  }

  formatDate(startDate: string | null, endDate: string | null): string {
    if (!startDate && !endDate) {
      return 'N/A';
    }

    if(startDate && !endDate) {
      return `${this.formatSingleDate(startDate)} - Present`;
    }
    
    if(!startDate && endDate) {
      return `Until ${this.formatSingleDate(endDate)}`;
    }

    if(startDate === endDate) {
      return this.formatSingleDate(startDate!);
    }

    return `${this.formatSingleDate(startDate!)} - ${this.formatSingleDate(endDate!)}`;
  }

  private formatSingleDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  }
}