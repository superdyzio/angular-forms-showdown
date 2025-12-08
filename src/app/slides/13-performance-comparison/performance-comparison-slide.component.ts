import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'afs-performance-comparison-slide',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './performance-comparison-slide.component.html',
  styleUrl: './performance-comparison-slide.component.scss'
})
export class PerformanceComparisonSlideComponent {}
