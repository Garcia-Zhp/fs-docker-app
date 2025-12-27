import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { BlogService } from '../../services/blog-service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  userEmail: string = '';
  isLoading: boolean = true;
  testResult: boolean = false;

  constructor(
    private authService: AuthService,
    private blogService: BlogService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.authService.initialized$,
      this.authService.currentUser$
    ]).subscribe(([initialized, user]) => {
      
      if (!initialized) {
        return;
      }
      
      this.isLoading = false;
      
      if (!user || !user.isAdmin) {
        this.router.navigate(['/admin']);
      } else {
        this.userEmail = user.email;
      }
      
      // Manually trigger change detection for zoneless mode
      this.cdr.detectChanges();
    });
  }

  testAuth(): void {
    this.blogService.getAllPosts().subscribe({
      next: (posts) => {
        this.testResult = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getUserInitials(email: string): string {
  if (!email) return '?';
  
  const parts = email.split('@')[0].split('.');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  
  return email.substring(0, 2).toUpperCase();
}
}