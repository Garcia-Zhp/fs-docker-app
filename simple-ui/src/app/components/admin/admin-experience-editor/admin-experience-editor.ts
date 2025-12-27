import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BackToDashboard } from '../back-to-dashboard/back-to-dashboard';
import { ExperienceService } from '../../../services/experience-service';
import { OrganizationService } from '../../../services/organization-service';
import { Organization } from '../../../models/organization.models';

type DateRangeType = 'present' | 'single' | 'range';

@Component({
  selector: 'app-admin-experience-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, BackToDashboard],
  templateUrl: './admin-experience-editor.html',
  styleUrl: './admin-experience-editor.css'
})
export class AdminExperienceEditor implements OnInit {
  // Services
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private experienceService = inject(ExperienceService);
  private organizationService = inject(OrganizationService);

  // State
  isLoading: boolean = true;
  isSaving: boolean = false;
  isEditMode: boolean = false;
  experienceId: number | null = null;
  
  // Organizations
  organizations: Organization[] = [];
  showNewOrgForm: boolean = false;
  isSavingOrg: boolean = false;
  
  // Date range type
  dateRangeType: DateRangeType = 'range';
  
  // Forms
  experienceForm: FormGroup;
  newOrgForm: FormGroup;

  constructor() {
    // Experience form
    this.experienceForm = this.fb.group({
      organizationId: [null, Validators.required],
      roleTitle: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      startDate: ['', Validators.required],
      endDate: [''],
      published: [false],
      sortOrder: [0, [Validators.required, Validators.min(0)]]
    });

    // New organization form
    this.newOrgForm = this.fb.group({
      orgName: ['', [Validators.required, Validators.minLength(2)]],
      type: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadOrganizations();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.experienceId = Number(id);
      this.loadExperience(this.experienceId);
    } else {
      this.isLoading = false;
    }
    
    this.updateDateValidators();
  }

  loadOrganizations(): void {
    this.organizationService.getAllOrganizations().subscribe({
      next: (orgs) => {
        this.organizations = orgs;
      },
      error: (error) => {
        console.error('Error loading organizations:', error);
        alert('Failed to load organizations');
      }
    });
  }

  loadExperience(id: number): void {
    this.isLoading = true;
    
    this.experienceService.getExperienceById(id).subscribe({
      next: (experience) => {
        // Determine date range type
        if (!experience.endDate) {
          this.dateRangeType = 'present';
        } else if (experience.startDate === experience.endDate) {
          this.dateRangeType = 'single';
        } else {
          this.dateRangeType = 'range';
        }
        
        // Populate form
        this.experienceForm.patchValue({
          organizationId: experience.organizationId,
          roleTitle: experience.roleTitle,
          description: experience.description,
          startDate: experience.startDate,
          endDate: experience.endDate || '',
          published: experience.published || false,
          sortOrder: experience.sortOrder || 0
        });
        
        this.updateDateValidators();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading experience:', error);
        alert('Failed to load experience');
        this.isLoading = false;
        this.cancel();
      }
    });
  }

  // ✅ Toggle new organization form
  onOrganizationChange(event: any): void {
    const value = event.target.value;
    
    if (value === 'new') {
      this.showNewOrgForm = true;
      this.experienceForm.patchValue({ organizationId: null });
    } else {
      this.showNewOrgForm = false;
    }
  }

  // ✅ Save new organization
  saveNewOrganization(): void {
    if (this.newOrgForm.invalid) {
      this.newOrgForm.markAllAsTouched();
      return;
    }

    this.isSavingOrg = true;

    this.organizationService.createOrganization(this.newOrgForm.value).subscribe({
      next: (newOrg) => {
        // Add to organizations list
        this.organizations.push(newOrg);
        
        // Select the new organization
        this.experienceForm.patchValue({ organizationId: newOrg.id });
        
        // Reset and hide form
        this.newOrgForm.reset();
        this.showNewOrgForm = false;
        this.isSavingOrg = false;
        
        alert('Organization created successfully!');
      },
      error: (error) => {
        console.error('Error creating organization:', error);
        alert('Failed to create organization. It may already exist.');
        this.isSavingOrg = false;
      }
    });
  }

  // ✅ Cancel new organization
  cancelNewOrganization(): void {
    this.newOrgForm.reset();
    this.showNewOrgForm = false;
    
    // Reset dropdown to empty
    this.experienceForm.patchValue({ organizationId: null });
  }

  onDateRangeTypeChange(type: DateRangeType): void {
    this.dateRangeType = type;
    this.updateDateValidators();
    
    const startDate = this.experienceForm.get('startDate')?.value;
    
    if (type === 'present') {
      this.experienceForm.patchValue({ endDate: '' });
    } else if (type === 'single' && startDate) {
      this.experienceForm.patchValue({ endDate: startDate });
    }
  }

  onStartDateChange(): void {
    if (this.dateRangeType === 'single') {
      const startDate = this.experienceForm.get('startDate')?.value;
      this.experienceForm.patchValue({ endDate: startDate });
    }
  }

  updateDateValidators(): void {
    const endDateControl = this.experienceForm.get('endDate');
    
    if (this.dateRangeType === 'present' || this.dateRangeType === 'single') {
      endDateControl?.clearValidators();
    } else {
      endDateControl?.setValidators([Validators.required]);
    }
    
    endDateControl?.updateValueAndValidity();
  }

  save(): void {
    if (this.experienceForm.invalid) {
      this.experienceForm.markAllAsTouched();
      alert('Please fill in all required fields');
      return;
    }

    this.isSaving = true;
    
    const formValue = this.experienceForm.value;
    const experienceData = {
      ...formValue,
      endDate: this.dateRangeType === 'present' ? null : formValue.endDate
    };

    const saveRequest = this.isEditMode && this.experienceId
      ? this.experienceService.updateExperience(this.experienceId, experienceData)
      : this.experienceService.createExperience(experienceData);

    saveRequest.subscribe({
      next: () => {
        alert(`Experience ${this.isEditMode ? 'updated' : 'created'} successfully!`);
        this.isSaving = false;
        this.cancel();
      },
      error: (error) => {
        console.error('Error saving experience:', error);
        alert('Failed to save experience');
        this.isSaving = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/experiences']);
  }

  hasError(field: string): boolean {
    const control = this.experienceForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  // ✅ Check if new org form field has error
  hasOrgError(field: string): boolean {
    const control = this.newOrgForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(field: string): string {
    const control = this.experienceForm.get(field);
    
    if (control?.hasError('required')) {
      return `${this.getFieldLabel(field)} is required`;
    }
    
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `${this.getFieldLabel(field)} must be at least ${minLength} characters`;
    }
    
    if (control?.hasError('min')) {
      return `${this.getFieldLabel(field)} must be 0 or greater`;
    }
    
    return '';
  }

  getFieldLabel(field: string): string {
    const labels: { [key: string]: string } = {
      organizationId: 'Organization',
      roleTitle: 'Role Title',
      description: 'Description',
      startDate: 'Start Date',
      endDate: 'End Date',
      published: 'Published',
      sortOrder: 'Display Order'
    };
    return labels[field] || field;
  }
}