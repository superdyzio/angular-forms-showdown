import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'afs-comparison-slide',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './comparison-slide.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './comparison-slide.component.scss'
})
export class ComparisonSlideComponent {}
