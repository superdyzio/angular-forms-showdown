import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { type BenchmarkRun } from '../../data/benchmarks';
import { compareRun } from '../../data/benchmark-compare';

const RUN3: { template: BenchmarkRun; reactive: BenchmarkRun; signal: BenchmarkRun } = {
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

/** Run 4 — Angular 22.0.0 (generated 2026-05-27, INP not remeasured). */
const RUN4: typeof RUN3 = {
  template: {
    add1kJs: 10.22,
    update1kJs: 2.76,
    add1kInp: 5662,
    update1kInp: 4211,
    memoryStart: 15.86,
    memoryPeak: 135,
    memoryEnd: 18.8,
  },
  reactive: {
    add1kJs: 125.02,
    update1kJs: 139.54,
    add1kInp: 1459,
    update1kInp: 341,
    memoryStart: 15.94,
    memoryPeak: 134,
    memoryEnd: 18.88,
  },
  signal: {
    add1kJs: 0.9,
    update1kJs: 2.72,
    add1kInp: 453,
    update1kInp: 166,
    memoryStart: 16.46,
    memoryPeak: 100,
    memoryEnd: 18.7,
  },
};

@Component({
  selector: 'afs-ng22-performance-slide',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './ng22-performance-slide.component.html',
  styleUrl: './ng22-performance-slide.component.scss',
})
export class Ng22PerformanceSlideComponent {
  readonly template = compareRun(RUN3.template, RUN4.template);
  readonly reactive = compareRun(RUN3.reactive, RUN4.reactive);
  readonly signal = compareRun(RUN3.signal, RUN4.signal);
}
