import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'afs-cva-slide',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './cva-slide.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './cva-slide.component.scss'
})
export class CvaSlideComponent {}
