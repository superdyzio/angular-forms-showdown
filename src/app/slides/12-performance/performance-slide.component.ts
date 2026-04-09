import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BENCHMARKS } from '../../data/benchmarks';

@Component({
  selector: 'afs-performance-slide',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './performance-slide.component.html',
  styleUrl: './performance-slide.component.scss',
})
export class PerformanceSlideComponent {
  readonly b = BENCHMARKS;
}
