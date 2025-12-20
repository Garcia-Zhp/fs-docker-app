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
      console.log('AdminDashboard - initialized:', initialized, 'user:', user);
      
      if (!initialized) {
        return;
      }
      
      this.isLoading = false;
      
      if (!user || !user.isAdmin) {
        console.log('Not authenticated or not admin, redirecting to /admin');
        this.router.navigate(['/admin']);
      } else {
        this.userEmail = user.email;
      }
      
      // Manually trigger change detection for zoneless mode
      this.cdr.detectChanges();
    });
  }

  testAuth(): void {
    console.log('Testing authentication...');
    this.blogService.getAllPosts().subscribe({
      next: (posts) => {
        console.log('✅ API call successful! Posts:', posts.length);
        this.testResult = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ API call failed:', err);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}