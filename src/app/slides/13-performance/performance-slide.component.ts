import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'afs-performance-second-slide',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './performance-slide.component.html',
  styleUrl: './performance-slide.component.scss'
})
export class PerformanceSecondSlideComponent {}
