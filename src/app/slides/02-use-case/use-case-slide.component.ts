import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'afs-use-case-slide',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './use-case-slide.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './use-case-slide.component.scss'
})
export class UseCaseSlideComponent {}
