import { Component, signal, computed, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'afs-slideshow',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './slideshow.component.html',
  styleUrl: './slideshow.component.scss'
})
export class SlideshowComponent implements OnInit, OnDestroy {
  // Current slide index (1-based)
  currentSlide = signal(1);
  
  // All available slides
  slides = signal([
    { id: 1, title: 'Assumptions' },
    { id: 2, title: 'UseCase'},
    { id: 3, title: 'Template-Driven Forms' },
    { id: 4, title: 'Reactive Forms' },
    { id: 5, title: 'Comparison' },
    { id: 6, title: 'Signals' },
    { id: 7, title: 'Signal Forms' }
  ]);
  
  // Computed values
  totalSlides = computed(() => this.slides().length);
  
  progressPercentage = computed(() => 
    (this.currentSlide() / this.totalSlides()) * 100
  );
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}
  
  ngOnInit() {
    // Listen to route changes to update current slide
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.updateCurrentSlideFromUrl(event.url);
      });
    
    // Initial slide update
    this.updateCurrentSlideFromUrl(this.router.url);
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.nextSlide();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.previousSlide();
    }
  }

  private updateCurrentSlideFromUrl(url: string) {
    const urlSegments = url.split('/');
    const slideNumber = urlSegments[urlSegments.length - 1] || '1';
    const slideNum = parseInt(slideNumber, 10);
    
    // Only update if we're on a slideshow route
    if (url.includes('/slideshow/')) {
      if (slideNum >= 1 && slideNum <= this.totalSlides()) {
        this.currentSlide.set(slideNum);
      } else {
        // Redirect to first slide if invalid slide number
        this.router.navigate(['/slideshow/1']);
      }
    }
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
