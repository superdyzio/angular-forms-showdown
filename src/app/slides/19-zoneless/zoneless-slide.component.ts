import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'afs-zoneless-slide',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './zoneless-slide.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './zoneless-slide.component.scss'
})
export class ZonelessSlideComponent {
  readonly configSnippet =
`// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    // remove provideZoneChangeDetection() and zone.js polyfill
    provideRouter(appRoutes),
    ...
  ]
};`;
}
