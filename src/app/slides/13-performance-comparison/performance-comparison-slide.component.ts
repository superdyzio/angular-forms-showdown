import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BENCHMARKS, type BenchmarkRun } from '../../data/benchmarks';

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

interface ComparisonCell {
  value: number;
  diff: number;
  better: boolean;
  unit: string;
}

function compare(
  run1: number,
  run2: number,
  lowerIsBetter: boolean,
  unit: string,
): ComparisonCell {
  const diff = run1 === 0 ? 0 : ((run2 - run1) / run1) * 100;
  return {
    value: run2,
    diff: Math.round(diff * 10) / 10,
    better: lowerIsBetter ? diff < 0 : diff > 0,
    unit,
  };
}

function compareRun(r1: BenchmarkRun, r2: BenchmarkRun) {
  return {
    add1kJs: compare(r1.add1kJs, r2.add1kJs, true, 'ms'),
    update1kJs: compare(r1.update1kJs, r2.update1kJs, true, 'ms'),
    add1kInp: compare(r1.add1kInp, r2.add1kInp, true, 'ms'),
    update1kInp: compare(r1.update1kInp, r2.update1kInp, true, 'ms'),
    memoryStart: compare(r1.memoryStart, r2.memoryStart, true, 'mb'),
    memoryPeak: compare(r1.memoryPeak, r2.memoryPeak, true, 'mb'),
    memoryEnd: compare(r1.memoryEnd, r2.memoryEnd, true, 'mb'),
  };
}

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
