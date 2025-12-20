import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [],
  template: '<div class="loading">Logging you in...</div>',
  styles: [`
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      font-size: 1.5rem;
      font-family: 'Be Vietnam Pro', sans-serif;
      color: #526665;
    }
  `]
})
export class AuthCallback implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

ngOnInit(): void {
  console.log('AuthCallback component loaded');
  this.route.queryParams.subscribe(params => {
    console.log('Query params:', params);
    const token = params['token'];
    console.log('Token received:', token);
    
    if (token) {
      this.authService.setToken(token);
      
      // Validate token and redirect based on admin status
      this.authService.validateToken(token).subscribe({
        next: (response) => {
          console.log('Validation response:', response);
          if (response.valid && response.email) {
            this.authService.setCurrentUser({
              email: response.email,
              isAdmin: response.isAdmin || false
            });
            
            console.log('Redirecting to:', response.isAdmin ? '/admin/dashboard' : '/blog');
            
            // Redirect based on admin status
            if (response.isAdmin) {
              this.router.navigate(['/admin/dashboard']);
            } else {
              this.router.navigate(['/blog']);
            }
          } else {
            console.log('Invalid token, redirecting to home');
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          console.error('Validation error:', err);
          this.router.navigate(['/']);
        }
      });
    } else {
      console.log('No token found, redirecting to home');
      this.router.navigate(['/']);
    }
  });
}
}