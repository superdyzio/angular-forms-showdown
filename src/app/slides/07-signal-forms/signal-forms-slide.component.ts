import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'afs-signal-forms-slide',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './signal-forms-slide.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './signal-forms-slide.component.scss'
})
export class SignalFormsSlideComponent {}
