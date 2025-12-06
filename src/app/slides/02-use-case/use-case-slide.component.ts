import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'afs-use-case-slide',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './use-case-slide.component.html',
  styleUrl: './use-case-slide.component.scss'
})
export class UseCaseSlideComponent {
  protected translationService = inject(TranslationService);
  protected t = this.translationService.t;
}
