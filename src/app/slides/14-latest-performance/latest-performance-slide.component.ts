import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { type BenchmarkRun } from '../../data/benchmarks';
import { compareRun } from '../../data/benchmark-compare';

/**
 * Run 2 — copy the RUN2 values from the 13-performance-comparison slide.
 * TODO: replace zeros with actual values
 */
const RUN2: { template: BenchmarkRun; reactive: BenchmarkRun; signal: BenchmarkRun } = {
  template: {
    add1kJs: 0,
    update1kJs: 0,
    add1kInp: 0,
    update1kInp: 0,
    memoryStart: 0,
    memoryPeak: 0,
    memoryEnd: 0,
  },
  reactive: {
    add1kJs: 0,
    update1kJs: 0,
    add1kInp: 0,
    update1kInp: 0,
    memoryStart: 0,
    memoryPeak: 0,
    memoryEnd: 0,
  },
  signal: {
    add1kJs: 0,
    update1kJs: 0,
    add1kInp: 0,
    update1kInp: 0,
    memoryStart: 0,
    memoryPeak: 0,
    memoryEnd: 0,
  },
};

/**
 * Run 3 — latest benchmark run.
 * TODO: fill in with actual Run 3 values after running: npm run benchmark
 */
const RUN3: typeof RUN2 = {
  template: {
    add1kJs: 8.48,
    update1kJs: 1.62,
    add1kInp: 4466,
    update1kInp: 2902,
    memoryStart: 13.6,
    memoryPeak: 126.4,
    memoryEnd: 15.8,
  },
  reactive: {
    add1kJs: 105.18,
    update1kJs: 153.94,
    add1kInp: 979,
    update1kInp: 228,
    memoryStart: 13.6,
    memoryPeak: 124,
    memoryEnd: 16.2,
  },
  signal: {
    add1kJs: 0.66,
    update1kJs: 2,
    add1kInp: 459,
    update1kInp: 120,
    memoryStart: 14.1,
    memoryPeak: 93,
    memoryEnd: 16,
  },
};

@Component({
  selector: 'afs-latest-performance-slide',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './latest-performance-slide.component.html',
  styleUrl: './latest-performance-slide.component.scss',
})
export class LatestPerformanceSlideComponent {
  readonly template = compareRun(RUN2.template, RUN3.template);
  readonly reactive = compareRun(RUN2.reactive, RUN3.reactive);
  readonly signal = compareRun(RUN2.signal, RUN3.signal);
}
