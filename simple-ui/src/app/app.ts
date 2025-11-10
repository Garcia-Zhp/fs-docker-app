import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Intro } from "./components/intro/intro";
import { provideHttpClient } from '@angular/common/http'; // <-- New import for the fix

@Component({
  selector: 'app-root',
  imports: [Intro],  templateUrl: './app.html',
  styleUrl: './app.css'
  
})
export class App {
  protected readonly title = signal('simple-ui');
}
