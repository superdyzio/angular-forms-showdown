import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BENCHMARKS } from '../../data/benchmarks';
import { compareRun } from '../../data/benchmark-compare';

/**
 * Second benchmark run — hard-coded from a separate recording session.
 * Update by running: npm run benchmark
 * then copy the BENCHMARKS values here as a second snapshot.
 */
const RUN2: typeof BENCHMARKS = {
  template: {
    add1kJs: 8.74,
    update1kJs: 2.26,
    add1kInp: 5584,
    update1kInp: 4803,
    memoryStart: 14.7,
    memoryPeak: 134.1,
    memoryEnd: 19.9,
  },
  reactive: {
    add1kJs: 127.07,
    update1kJs: 156.13,
    add1kInp: 1338,
    update1kInp: 270,
    memoryStart: 15.3,
    memoryPeak: 133,
    memoryEnd: 20.9,
  },
  signal: {
    add1kJs: 0.78,
    update1kJs: 2.55,
    add1kInp: 1919,
    update1kInp: 3394,
    memoryStart: 15.5,
    memoryPeak: 124.2,
    memoryEnd: 63.3,
  },
};

@Component({
  selector: 'afs-performance-comparison-slide',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './performance-comparison-slide.component.html',
  styleUrl: './performance-comparison-slide.component.scss',
})
export class PerformanceComparisonSlideComponent {
  readonly template = compareRun(BENCHMARKS.template, RUN2.template);
  readonly reactive = compareRun(BENCHMARKS.reactive, RUN2.reactive);
  readonly signal = compareRun(BENCHMARKS.signal, RUN2.signal);
}
