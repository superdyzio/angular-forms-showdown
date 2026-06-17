import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'afs-thank-you-slide',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './thank-you-slide.component.html',
  styleUrl: './thank-you-slide.component.scss'
})
export class ThankYouSlideComponent {}
