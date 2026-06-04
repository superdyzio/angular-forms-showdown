import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'afs-signals-slide',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './signals-slide.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './signals-slide.component.scss'
})
export class SignalsSlideComponent {}
