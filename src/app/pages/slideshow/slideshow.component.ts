import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Slide1Component } from '../../slides/slide1.component';
import { Slide2Component } from '../../slides/slide2.component';
import { Slide3Component } from '../../slides/slide3.component';

@Component({
  selector: 'afs-slideshow',
  standalone: true,
  imports: [CommonModule, RouterLink, Slide1Component, Slide2Component, Slide3Component],
  template: `
    <div class="slideshow-container">
      <!-- Header with navigation and progress -->
      <header class="slideshow-header">
        <div class="header-content">
          <a routerLink="/" class="back-button">← Back to Main</a>
          <h1>Angular Forms Presentation</h1>
          <div class="slide-counter">
            {{ currentSlide() }} / {{ totalSlides() }}
          </div>
        </div>
        
        <!-- Progress bar -->
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="progressPercentage()"></div>
          </div>
        </div>
      </header>

      <!-- Slide content -->
      <main class="slide-content">
        <div class="slide-wrapper" [style.transform]="'translateX(' + slideOffset() + 'px)'">
          @for (slide of slides(); track slide.id; let i = $index) {
            <div class="slide">
              @switch (i) {
                @case (0) {
                  <afs-slide1></afs-slide1>
                }
                @case (1) {
                  <afs-slide2></afs-slide2>
                }
                @case (2) {
                  <afs-slide3></afs-slide3>
                }
              }
            </div>
          }
        </div>
      </main>

      <!-- Navigation controls -->
      <footer class="slideshow-footer">
        <button 
          class="nav-button prev" 
          (click)="previousSlide()" 
          [disabled]="currentSlide() === 1">
          ← Previous
        </button>
        
        <div class="slide-indicators">
          @for (slide of slides(); track slide.id; let i = $index) {
            <button 
              class="indicator"
              [class.active]="currentSlide() === i + 1"
              (click)="goToSlide(i + 1)">
              {{ i + 1 }}
            </button>
          }
        </div>
        
        <button 
          class="nav-button next" 
          (click)="nextSlide()" 
          [disabled]="currentSlide() === totalSlides()">
          Next →
        </button>
      </footer>
    </div>
  `,
  styles: [`
    .slideshow-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      background: #1a1a1a;
      color: white;
    }

    .slideshow-header {
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid #333;
      z-index: 100;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
    }

    .back-button {
      color: #4facfe;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .back-button:hover {
      color: #00f2fe;
    }

    h1 {
      font-size: 1.5rem;
      margin: 0;
      color: #ffd700;
    }

    .slide-counter {
      background: rgba(255, 255, 255, 0.1);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 500;
    }

    .progress-container {
      padding: 0 2rem 1rem;
    }

    .progress-bar {
      width: 100%;
      height: 4px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
      transition: width 0.3s ease;
      border-radius: 2px;
    }

    .slide-content {
      flex: 1;
      overflow: hidden;
      position: relative;
    }

    .slide-wrapper {
      display: flex;
      height: 100%;
      transition: transform 0.5s ease-in-out;
    }

    .slide {
      min-width: 100%;
      height: 100%;
    }

    .slideshow-footer {
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      border-top: 1px solid #333;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 25px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 120px;
    }

    .nav-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .nav-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    .slide-indicators {
      display: flex;
      gap: 0.5rem;
    }

    .indicator {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid #4facfe;
      background: transparent;
      color: #4facfe;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .indicator:hover {
      background: rgba(79, 172, 254, 0.2);
    }

    .indicator.active {
      background: #4facfe;
      color: white;
    }

    @media (max-width: 768px) {
      .header-content {
        padding: 1rem;
        flex-direction: column;
        gap: 1rem;
      }

      .slideshow-footer {
        padding: 1rem;
        flex-direction: column;
        gap: 1rem;
      }

      .slide-indicators {
        order: -1;
      }
    }
  `]
})
export class SlideshowComponent {
  // Current slide index (1-based)
  currentSlide = signal(1);
  
  // All available slides
  slides = signal([
    { id: 1, title: 'Welcome to Angular Forms' },
    { id: 2, title: 'Template-Driven Forms' },
    { id: 3, title: 'Reactive Forms' }
  ]);
  
  // Computed values
  totalSlides = computed(() => this.slides().length);
  
  progressPercentage = computed(() => 
    (this.currentSlide() / this.totalSlides()) * 100
  );
  
  slideOffset = computed(() => 
    -(this.currentSlide() - 1) * window.innerWidth
  );
  
  // Navigation methods
  nextSlide() {
    if (this.currentSlide() < this.totalSlides()) {
      this.currentSlide.update(current => current + 1);
    }
  }
  
  previousSlide() {
    if (this.currentSlide() > 1) {
      this.currentSlide.update(current => current - 1);
    }
  }
  
  goToSlide(slideNumber: number) {
    if (slideNumber >= 1 && slideNumber <= this.totalSlides()) {
      this.currentSlide.set(slideNumber);
    }
  }
}
