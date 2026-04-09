import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'afs-zoneless-slide',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './zoneless-slide.component.html',
  styleUrl: './zoneless-slide.component.scss'
})
export class ZonelessSlideComponent {
  readonly configSnippet =
`// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    // remove provideZoneChangeDetection() / zone.js polyfill
    provideRouter(appRoutes),
    ...
  ]
};`;
}
