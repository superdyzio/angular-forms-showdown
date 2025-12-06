import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'afs-assumptions-slide',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assumptions-slide.component.html',
  styleUrl: './assumptions-slide.component.scss'
})
export class AssumptionsSlideComponent {
  protected translationService = inject(TranslationService);
  protected t = this.translationService.t;
}
