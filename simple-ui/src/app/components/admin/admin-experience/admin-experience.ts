import { ChangeDetectorRef,OnInit, Component } from '@angular/core';
import { ExperienceData } from '../../../models/experience-data.models';
import { ExperienceService } from '../../../services/experience-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BackToDashboard } from '../back-to-dashboard/back-to-dashboard';

@Component({
  selector: 'app-admin-experience',
  imports: [BackToDashboard,CommonModule],
  templateUrl: './admin-experience.html',
  styleUrl: './admin-experience.css',
})
export class AdminExperience implements OnInit {
  experiences: ExperienceData[] = [];
  isLoading: boolean = true;

  constructor(
    private experienceService: ExperienceService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadExperiences();
  }

  loadExperiences(): void {
    this.isLoading = true;
    this.experienceService.getAllExperiencesAdmin().subscribe({
      next: (exp) => {
        this.experiences = exp;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading experiences:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  editExperience(id: number): void {
    this.router.navigate(['/admin/experience/edit', id]);
  }

  deleteExperience(id: number, title: string): void {
    if (confirm(`Deleting this will cascade delete the list of accomplishments for this role. Are you sure you want to delete "${title}"?`)) {
      this.experienceService.deleteExperience(id).subscribe({
        next: () => {
          this.loadExperiences(); // Reload the list
        },
        error: (err) => {
          alert('Failed to delete experience');
        }
      });
    }
  }

  editAccomplishments(id: number): void {
    this.router.navigate(['/admin/experience', id, 'accomplishments']);
  }

  createNew(): void {
    this.router.navigate(['/admin/experience/create']);
  }

  formatDate(date: string | null): string {
    if (!date) return 'Present';
    
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  }
}
