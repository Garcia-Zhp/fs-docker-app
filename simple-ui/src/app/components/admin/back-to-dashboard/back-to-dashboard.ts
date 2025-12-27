import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-back-to-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './back-to-dashboard.html',
  styleUrl: './back-to-dashboard.css'
})
export class BackToDashboard {
  @Input() backLink: string = '/admin';
  @Input() backText: string = 'Back to Dashboard';
}