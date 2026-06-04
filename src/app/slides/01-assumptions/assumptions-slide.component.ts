import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'afs-assumptions-slide',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './assumptions-slide.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './assumptions-slide.component.scss'
})
export class AssumptionsSlideComponent {}
