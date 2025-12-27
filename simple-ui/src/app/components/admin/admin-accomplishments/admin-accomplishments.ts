import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { BackToDashboard } from '../back-to-dashboard/back-to-dashboard';
import { ExperienceService } from '../../../services/experience-service';
import { ExperienceData } from '../../../models/experience-data.models';


@Component({
  selector: 'app-admin-accomplishments',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, BackToDashboard],
  templateUrl: './admin-accomplishments.html',
  styleUrl: './admin-accomplishments.css'
  // ✅ No animations property
})
export class AdminAccomplishments implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private experienceService = inject(ExperienceService);
  private cdr = inject(ChangeDetectorRef);

  isLoading: boolean = true;
  isSaving: boolean = false;
  experienceId: number | null = null;
  experienceTitle: string = '';
  
  // ✅ Counter for unique IDs
  private nextId: number = 0;
  
  accomplishmentsForm: FormGroup;

  constructor() {
    this.accomplishmentsForm = this.fb.group({
      accomplishments: this.fb.array([])
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.experienceId = Number(id);
      this.loadExperience(this.experienceId);
    } else {
      this.isLoading = false;
    }
  }

  get accomplishments(): FormArray {
    return this.accomplishmentsForm.get('accomplishments') as FormArray;
  }

  // ✅ TrackBy function for proper change detection
  trackByFn(index: number, item: AbstractControl): any {
    return (item as any)._uniqueId || index;
  }

  loadExperience(id: number): void {
    this.isLoading = true;
    
    this.experienceService.getExperienceById(id)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (experience: ExperienceData) => {
          try {
            this.experienceTitle = experience.roleTitle;
            
            while (this.accomplishments.length > 0) {
              this.accomplishments.removeAt(0);
            }
            
            if (experience.accomplishments && experience.accomplishments.length > 0) {
              experience.accomplishments.forEach((content, index) => {
                this.accomplishments.push(this.createAccomplishmentFormGroup(content, index));
              });
            } else {
              this.addAccomplishment();
            }
            
          } catch (error) {
            console.error('Error in next callback:', error);
            alert('Error processing accomplishments');
          }
        },
        error: (error) => {
          console.error('Error loading experience:', error);
          alert('Failed to load experience');
          this.cancel();
        }
      });
  }

  createAccomplishmentFormGroup(content: string = '', sortOrder: number = 0): FormGroup {
    const group = this.fb.group({
      content: [content, [Validators.required, Validators.minLength(10)]],
      sortOrder: [sortOrder, Validators.required],
      published: [true]
    });
    
    // ✅ Attach unique ID
    (group as any)._uniqueId = this.nextId++;
    
    return group;
  }

  addAccomplishment(): void {
    const newSortOrder = this.accomplishments.length;
    this.accomplishments.push(this.createAccomplishmentFormGroup('', newSortOrder));
    this.cdr.detectChanges();
  }

  removeAccomplishment(index: number): void {
    if (this.accomplishments.length > 1) {
      this.accomplishments.removeAt(index);
      this.updateSortOrders();
      this.cdr.detectChanges();
    } else {
      alert('You must have at least one accomplishment');
    }
  }

  moveUp(index: number): void {
    if (index > 0) {
      const accomplishment = this.accomplishments.at(index);
      this.accomplishments.removeAt(index);
      this.accomplishments.insert(index - 1, accomplishment);
      this.updateSortOrders();
      this.cdr.detectChanges();
    }
  }

  moveDown(index: number): void {
    if (index < this.accomplishments.length - 1) {
      const accomplishment = this.accomplishments.at(index);
      this.accomplishments.removeAt(index);
      this.accomplishments.insert(index + 1, accomplishment);
      this.updateSortOrders();
      this.cdr.detectChanges();
    }
  }

  updateSortOrders(): void {
    this.accomplishments.controls.forEach((control, index) => {
      control.get('sortOrder')?.setValue(index);
    });
  }

  save(): void {
    if (this.accomplishmentsForm.invalid) {
      this.accomplishmentsForm.markAllAsTouched();
      alert('Please fill in all required fields');
      return;
    }

    if (!this.experienceId) {
      alert('No experience ID found');
      return;
    }

    this.isSaving = true;

    const accomplishmentsData = this.accomplishments.controls.map(control => ({
      content: control.get('content')?.value,
      sortOrder: control.get('sortOrder')?.value,
      published: control.get('published')?.value
    }));

    this.experienceService.updateAccomplishments(this.experienceId, accomplishmentsData)
      .subscribe({
        next: () => {
          alert('Accomplishments saved successfully!');
          this.isSaving = false;
          this.cancel();
        },
        error: (error) => {
          console.error('Error saving accomplishments:', error);
          alert('Failed to save accomplishments');
          this.isSaving = false;
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/admin/experience']);
  }

  hasError(index: number, field: string): boolean {
    const control = this.accomplishments.at(index).get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(index: number, field: string): string {
    const control = this.accomplishments.at(index).get(field);
    
    if (control?.hasError('required')) {
      return `${field} is required`;
    }
    
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `${field} must be at least ${minLength} characters`;
    }
    
    return '';
  }
}