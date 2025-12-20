import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css'
})
export class AdminLogin implements OnInit {
  isAuthenticating = false;
  isAuthenticated = false;
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if already authenticated and admin
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.isAdmin = user.isAdmin;
        
        if (user.isAdmin) {
          this.router.navigate(['/admin/dashboard']);
        }
      }
    });
  }

  login(): void {
    this.isAuthenticating = true;
    this.authService.login();
  }
}