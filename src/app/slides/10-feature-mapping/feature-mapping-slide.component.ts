import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'afs-feature-mapping-slide',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './feature-mapping-slide.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './feature-mapping-slide.component.scss'
})
export class FeatureMappingSlideComponent {}
