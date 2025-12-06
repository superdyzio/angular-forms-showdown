import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'afs-thank-you-slide',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './thank-you-slide.component.html',
  styleUrl: './thank-you-slide.component.scss'
})
export class ThankYouSlideComponent {
  protected translationService = inject(TranslationService);
  protected t = this.translationService.t;
}
