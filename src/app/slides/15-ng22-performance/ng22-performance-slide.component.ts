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
    add1kJs: 8.93,
    update1kJs: 1.07,
    add1kInp: 4466,
    update1kInp: 2902,
    memoryStart: 19.41,
    memoryPeak: 74.94,
    memoryEnd: 87.58,
  },
  reactive: {
    add1kJs: 65.1,
    update1kJs: 119.63,
    add1kInp: 979,
    update1kInp: 228,
    memoryStart: 19.35,
    memoryPeak: 71.19,
    memoryEnd: 60.56,
  },
  signal: {
    add1kJs: 0.63,
    update1kJs: 2.13,
    add1kInp: 459,
    update1kInp: 120,
    memoryStart: 20.04,
    memoryPeak: 32.61,
    memoryEnd: 36.54,
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
