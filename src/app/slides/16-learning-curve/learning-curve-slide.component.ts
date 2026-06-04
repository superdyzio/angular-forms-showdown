import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'afs-learning-curve-slide',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './learning-curve-slide.component.html',
  styleUrl: './learning-curve-slide.component.scss'
})
export class LearningCurveSlideComponent {}
