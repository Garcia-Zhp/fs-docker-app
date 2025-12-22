// resume.component.ts
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resume.html',
  styleUrl: './resume.css'
})
export class Resume implements OnInit {
  resumeUrl: string = 'resume-jg-v1.pdf';
  safeResumeUrl!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    // Sanitize URL for iframe to prevent security errors
    this.safeResumeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.resumeUrl);
  }
}