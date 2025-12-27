import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../../services/blog-service';
import { BackToDashboard } from '../back-to-dashboard/back-to-dashboard';

interface ContentSection {
  section: string;
  content: string;
  label: string;
  description: string;
  isEditing: boolean;
}

@Component({
  selector: 'app-admin-site-content',
  standalone: true,
  imports: [CommonModule, FormsModule, BackToDashboard],
  templateUrl: './admin-site-content.html',
  styleUrl: './admin-site-content.css'
})
export class AdminSiteContent implements OnInit {
  isLoading: boolean = true;
  isSaving: { [key: string]: boolean } = {};
  
  contentSections: ContentSection[] = [
    {
      section: 'about_heading',
      content: '',
      label: 'About Page Heading',
      description: 'The main heading on the About page',
      isEditing: false
    },
    {
      section: 'about_description',
      content: '',
      label: 'About Page Description',
      description: 'The main description/bio text on the About page',
      isEditing: false
    },
    {
      section: 'profile_image_url',
      content: '',
      label: 'Profile Image URL',
      description: 'Path to your profile image (e.g., profile.jpg)',
      isEditing: false
    }
  ];

  constructor(
    private blogService: BlogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAllContent();
  }

  loadAllContent(): void {
    this.isLoading = true;
    
    this.blogService.getAllSiteContent().subscribe({
      next: (contents) => {
        
        // Update content sections with loaded data
        contents.forEach(content => {
          const section = this.contentSections.find(s => s.section === content.section);
          if (section) {
            section.content = content.content;
          }
        });
        
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading content:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  startEdit(section: ContentSection): void {
    section.isEditing = true;
  }

  cancelEdit(section: ContentSection): void {
    section.isEditing = false;
    // Reload to revert changes
    this.loadAllContent();
  }

  saveSection(section: ContentSection): void {
    if (!section.content.trim()) {
      alert('Content cannot be empty');
      return;
    }

    this.isSaving[section.section] = true;

    this.blogService.updateSiteContent(section.section, section.content).subscribe({
      next: (response) => {
        section.isEditing = false;
        this.isSaving[section.section] = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error saving content:', err);
        alert('Failed to save content. Please try again.');
        this.isSaving[section.section] = false;
        this.cdr.detectChanges();
      }
    });
  }
}