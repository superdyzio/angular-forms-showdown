import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'afs-reactive-forms-slide',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './reactive-forms-slide.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './reactive-forms-slide.component.scss'
})
export class ReactiveFormsSlideComponent {}
