import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'afs-community-slide',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './community-slide.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './community-slide.component.scss'
})
export class CommunitySlideComponent {
  // Update this date when refreshing SO/GitHub figures
  readonly dataDate = '2026-04-09';
}
