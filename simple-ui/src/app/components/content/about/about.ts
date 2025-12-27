import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BlogService } from '../../../services/blog-service';
import { CommonModule } from '@angular/common';
import { Experience } from '../experience/experience';
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, Experience],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About implements OnInit {
  // Dynamic content from database
  description: string = `No Content Loaded`;
  profileImageUrl: string = 'profile.jpg';

  // Tech stack
  techStack = [
    { 
      name: 'Java',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg'
    },
    { 
      name: 'Spring',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg'
    },
    { 
      name: 'Angular',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg'
    },
    { 
      name: 'PostgreSQL',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg'
    },
    { 
      name: 'Docker',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg'
    },
  ];

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

    // Load description from database
    this.blogService.getSiteContent('about_description').subscribe({
      next: (content) => {
        if (content && content.content) {
          this.description = content.content;
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading description:', error);
      }
    });

    // Load profile image URL from database
    this.blogService.getSiteContent('profile_image_url').subscribe({
      next: (content) => {
        if (content && content.content) {
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