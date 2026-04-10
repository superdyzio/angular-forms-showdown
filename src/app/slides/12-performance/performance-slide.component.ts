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

  /** Bar widths for JS Add 1k chart, normalised to the slowest value */
  readonly chartMax = Math.max(this.b.template.add1kJs, this.b.reactive.add1kJs, this.b.signal.add1kJs);
  readonly templateBar = (this.b.template.add1kJs / this.chartMax) * 100;
  readonly reactiveBar = (this.b.reactive.add1kJs / this.chartMax) * 100;
  readonly signalBar = (this.b.signal.add1kJs / this.chartMax) * 100;

  /** Percentage Signal is faster than Reactive for JS Add 1k */
  readonly signalVsReactivePct = Math.round(
    ((this.b.reactive.add1kJs - this.b.signal.add1kJs) / this.b.reactive.add1kJs) * 100,
  );

  /** Percentage Signal is faster than Template for JS Add 1k */
  readonly signalVsTemplatePct = Math.round(
    ((this.b.template.add1kJs - this.b.signal.add1kJs) / this.b.template.add1kJs) * 100,
  );
}
