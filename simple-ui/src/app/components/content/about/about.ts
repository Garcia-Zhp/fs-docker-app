import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BlogService } from '../../../services/blog-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About implements OnInit {
  // Dynamic content from database
  heading: string = 'About<br><span class="highlight">Me</span>';
  description: string = `I'm a Software Engineer with 4+ years of 
  experience building enterprise-scale solutions using Java, Spring Boot, Angular, and SQL. 

  <br>
  <br>
  I'm passionate about writing clean, scalable code and designing solutions that make complex processes simple. 
  I enjoy collaborating across teams, turning ideas into reliable products, and continuously learning new technologies to sharpen my craft.
  `
  profileImageUrl: string = 'profile.jpg';
  
  // Stats (could be moved to database if needed)
  stats = [
    { number: 'B.S.', label: 'CompSci' },
    { number: '15+', label: 'Projects Delivered' },
    { number: '2', label: 'Companies' }
  ];


  // Tech stack (could be moved to database if needed)
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
  tsdf: boolean = false;

  constructor(
    private blogService: BlogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadContent();
  }

  loadContent(): void {
    this.isLoading = true;

    // Load heading from database
    this.blogService.getSiteContent('about_heading').subscribe({
      next: (content) => {
        if (content && content.content) {
          this.heading = content.content;
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading heading:', error);
      }
    });

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
