import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'afs-slideshow',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './slideshow.component.html',
  styleUrl: './slideshow.component.scss'
})
export class SlideshowComponent implements OnInit {
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
  
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}
  
  ngOnInit() {
    // Read slide number from child route
    this.route.firstChild?.params.subscribe(params => {
      const slideNumber = params[''] || '1'; // Empty string for root child route
      const slideNum = parseInt(slideNumber, 10);
      if (slideNum >= 1 && slideNum <= this.totalSlides()) {
        this.currentSlide.set(slideNum);
      } else {
        // Redirect to first slide if invalid slide number
        this.router.navigate(['/slideshow/1']);
      }
    });
  }
  
  // Navigation methods
  nextSlide() {
    if (this.currentSlide() < this.totalSlides()) {
      const nextSlideNumber = this.currentSlide() + 1;
      this.router.navigate(['/slideshow', nextSlideNumber.toString()]);
    }
  }
  
  previousSlide() {
    if (this.currentSlide() > 1) {
      const prevSlideNumber = this.currentSlide() - 1;
      this.router.navigate(['/slideshow', prevSlideNumber.toString()]);
    }
  }
  
  goToSlide(slideNumber: number) {
    if (slideNumber >= 1 && slideNumber <= this.totalSlides()) {
      this.router.navigate(['/slideshow', slideNumber.toString()]);
    }
  }
}
