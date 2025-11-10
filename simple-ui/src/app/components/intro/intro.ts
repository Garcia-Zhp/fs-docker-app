import { ChangeDetectionStrategy, Component, signal, inject, computed, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Only importing HttpClient
import { DataService } from '../../services/data-service';
import { response } from 'express';
// --- 1. INTRO COMPONENT (Contains Logic, Template, and Styles) ---
@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [], 
  templateUrl: './intro.html',
  styleUrl: './intro.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Intro { 
  // Dependency Injection using the modern inject function
  private dataService = inject(DataService);

  // State: Frontend message
  message = signal("Hello World!");

  // State: API call status and message
  backendMessage = signal<{ status: 'PENDING' | 'LOADING' | 'SUCCESS' | 'ERROR', message: string }>({
    status: 'PENDING',
    message: "Waiting for API call..."
  });

  // Derived State: Computed property for button loading state
  isLoading = computed(() => this.backendMessage().status === 'LOADING');

  doSomethingCool(): void {
    // Prevent multiple calls while loading
    if (this.isLoading()) return;

    // 1. Update frontend message
    this.message.set("Checking connectivity...");
    
    // 2. Update status to loading
    this.backendMessage.set({ status: 'LOADING', message: "Sending request to public API..." });

    // 3. Make the HTTP GET request via the service using the modern observer object
    this.dataService.fetchPost()
      .subscribe({
        next: (response) => {
          if (response) {
            alert(response);
            // Success case
            this.message.set("API Call Successful!");
            this.backendMessage.set({
              status: 'SUCCESS',
              message: `API Success: ${response}`
            });
          } else {
            // Error case (Handled by service's catchError returning null)
            this.message.set("API Call Failed!");
            this.backendMessage.set({
              status: 'ERROR',
              message: "Public API Failed: Check console for service-level error."
            });
          }
        },
        error: (err) => {
          console.error("Unexpected error in component subscription:", err);
          this.message.set("Subscription Error!");
          this.backendMessage.set({
            status: 'ERROR',
            message: "An unexpected error occurred during subscription."
          });
        }
      });
  }
}