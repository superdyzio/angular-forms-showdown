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
  templateUrl: './slideshow.component.html',
  styleUrl: './slideshow.component.scss'
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
