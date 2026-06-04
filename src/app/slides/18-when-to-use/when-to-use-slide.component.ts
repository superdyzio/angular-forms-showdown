import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'afs-when-to-use-slide',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './when-to-use-slide.component.html',
  styleUrl: './when-to-use-slide.component.scss'
})
export class WhenToUseSlideComponent {}
