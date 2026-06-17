import { Component, signal, computed, OnInit, OnDestroy, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

/** An item in the compacted slide-indicator strip: a clickable slide or an ellipsis gap. */
type IndicatorItem = { kind: 'slide'; n: number; id: string } | { kind: 'gap'; id: string };

@Component({
  selector: 'afs-slideshow',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, TranslateModule],
  templateUrl: './slideshow.component.html',
  styleUrl: './slideshow.component.scss'
})
export class SlideshowComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

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
    { id: 7, title: 'Signal Forms' },
    { id: 8, title: 'Signal Forms API' },
    { id: 9, title: 'Control Value Accessor' },
    { id: 10, title: 'Feature Mapping' },
    { id: 11, title: 'Demo' },
    { id: 12, title: 'Performance' },
    { id: 13, title: 'Performance' },
    { id: 14, title: 'Performance' },
    { id: 15, title: 'Performance' },
    { id: 16, title: 'Bundle Size' },
    { id: 17, title: 'Developer Experience' },
    { id: 18, title: 'Community & Ecosystem' },
    { id: 19, title: 'When to Use What?' },
    { id: 20, title: 'Zoneless Angular' },
    { id: 21, title: 'Same Field, Three Approaches' },
    { id: 22, title: 'Incremental Migration — compatForm' },
    { id: 23, title: 'Thank You' }
  ]);
  
  // Computed values
  totalSlides = computed(() => this.slides().length);
  
  progressPercentage = computed(() =>
    (this.currentSlide() / this.totalSlides()) * 100
  );

  // Compacted indicator strip: always show the first five slides, the last five, and the
  // selected slide ±2. Any remaining gap of more than one hidden slide collapses to an
  // ellipsis (a lone hidden slide is shown as-is, since "…" would take the same space).
  visibleIndicators = computed<IndicatorItem[]>(() => {
    const total = this.totalSlides();
    const current = this.currentSlide();

    const keep = new Set<number>([
      1, 2, 3, 4, 5,
      total - 4, total - 3, total - 2, total - 1, total,
      current - 2, current - 1, current, current + 1, current + 2,
    ]);
    const nums = [...keep].filter(n => n >= 1 && n <= total).sort((a, b) => a - b);

    const items: IndicatorItem[] = [];
    let prev = 0;
    for (const n of nums) {
      if (prev) {
        const gap = n - prev;
        if (gap === 2) {
          items.push({ kind: 'slide', n: prev + 1, id: `s${prev + 1}` });
        } else if (gap > 2) {
          items.push({ kind: 'gap', id: `g${prev}` });
        }
      }
      items.push({ kind: 'slide', n, id: `s${n}` });
      prev = n;
    }
    return items;
  });

  private destroy$ = new Subject<void>();
  
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
