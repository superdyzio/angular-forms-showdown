import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { type BenchmarkRun } from '../../data/benchmarks';

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
