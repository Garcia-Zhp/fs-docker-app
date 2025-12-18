import { Component, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements AfterViewInit {

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    setTimeout(() => this.updateIndicator(false), 100);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      setTimeout(() => this.updateIndicator(true), 50);
    });
  }

  updateIndicator(animate: boolean = true) {
    const indicator = document.querySelector('.nav-indicator') as HTMLElement;
    const activeLink = document.querySelector('.nav-link.active') as HTMLElement;
    const parent = document.querySelector('.navbar-routers') as HTMLElement;
    
    if (!indicator || !activeLink || !parent) {
      return;
    }
    
    const parentRect = parent.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    
    const targetLeft = linkRect.left - parentRect.left + (linkRect.width / 2) - 5; // Center the dot
    const currentLeft = parseInt(indicator.style.left || '0');
    
    // Add stretching effect during movement
    if (animate && Math.abs(targetLeft - currentLeft) > 5) {
      indicator.classList.add('moving');
      
      // Calculate stretch based on distance
      const distance = Math.abs(targetLeft - currentLeft);
      const stretchWidth = Math.min(distance * 0.5, 60); // Max stretch of 60px
      
      indicator.style.width = `${stretchWidth}px`;
      indicator.style.borderRadius = '50% 50% 50% 50% / 60% 60% 40% 40%';
      
      // Snap to final position and reform into circle
      setTimeout(() => {
        indicator.style.left = `${targetLeft}px`;
        indicator.style.width = '10px';
        indicator.style.borderRadius = '50%';
        
        setTimeout(() => {
          indicator.classList.remove('moving');
        }, 100);
      }, 50);
    } else {
      // Initial positioning without animation
      indicator.style.left = `${targetLeft}px`;
      indicator.style.width = '10px';
      indicator.style.borderRadius = '50%';
    }
  }

  moveIndicator(event: Event) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    const target = event.target as HTMLElement;
    const indicator = document.querySelector('.nav-indicator') as HTMLElement;
    const parent = document.querySelector('.navbar-routers') as HTMLElement;
    
    if (!indicator || !parent) return;
    
    const parentRect = parent.getBoundingClientRect();
    const linkRect = target.getBoundingClientRect();
    
    const targetLeft = linkRect.left - parentRect.left + (linkRect.width / 2) - 5;
    const currentLeft = parseInt(indicator.style.left || '0');
    const distance = Math.abs(targetLeft - currentLeft);
    const stretchWidth = Math.min(distance * 0.5, 60);
    
    indicator.classList.add('moving');
    indicator.style.width = `${stretchWidth}px`;
    indicator.style.borderRadius = '50% 50% 50% 50% / 60% 60% 40% 40%';
    
    setTimeout(() => {
      indicator.style.left = `${targetLeft}px`;
      indicator.style.width = '10px';
      indicator.style.borderRadius = '50%';
      
      setTimeout(() => {
        indicator.classList.remove('moving');
      }, 100);
    }, 50);
  }
}