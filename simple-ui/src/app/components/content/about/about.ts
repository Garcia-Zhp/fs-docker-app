import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BlogService } from '../../../services/blog-service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About implements OnInit {
  heading: string = 'Hello world';
  description: string = '';
  profileImageUrl: string = 'images/profile.jpg';
  isLoading: boolean = true;

  constructor(
    private blogService: BlogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadContent();
  }

  loadContent(): void {
    this.isLoading = true;

    // Load heading
    this.blogService.getSiteContent('about_heading').subscribe({
      next: (content) => {
        if (content) {
          this.heading = content.content;
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading heading:', error);
      }
    });

    // Load description
    this.blogService.getSiteContent('about_description').subscribe({
      next: (content) => {
        if (content) {
          this.description = content.content;
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading description:', error);
      }
    });

    // Load profile image URL
    this.blogService.getSiteContent('profile_image_url').subscribe({
      next: (content) => {
        if (content) {
          this.profileImageUrl = content.content;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading profile image:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}