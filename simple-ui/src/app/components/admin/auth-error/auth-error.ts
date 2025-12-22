import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-auth-error',
  imports: [],
  templateUrl: './auth-error.html',
  styleUrl: './auth-error.css',
})
export class AuthError implements OnInit {
///auth/error?message=

  errorMessage: string = 'Access denied';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['message']) {
        this.errorMessage = params['message'];
      }
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }
}