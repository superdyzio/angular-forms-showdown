import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'afs-learning-curve-slide',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './learning-curve-slide.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './learning-curve-slide.component.scss'
})
export class LearningCurveSlideComponent {}
