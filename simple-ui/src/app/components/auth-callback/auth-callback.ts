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
  this.route.queryParams.subscribe(params => {
    const token = params['token'];
    
    if (token) {
      this.authService.setToken(token);
      
      // Validate token and redirect based on admin status
      this.authService.validateToken(token).subscribe({
        next: (response) => {
          if (response.valid && response.email) {
            this.authService.setCurrentUser({
              email: response.email,
              isAdmin: response.isAdmin || false
            });
            
            
            // Redirect based on admin status
            if (response.isAdmin) {
              this.router.navigate(['/admin/dashboard']);
            } else {
              this.router.navigate(['/blog']);
            }
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          this.router.navigate(['/']);
        }
      });
    } else {
      this.router.navigate(['/']);
    }
  });
}
}