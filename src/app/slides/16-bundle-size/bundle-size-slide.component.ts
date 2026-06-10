import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'afs-bundle-size-slide',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './bundle-size-slide.component.html',
  styleUrl: './bundle-size-slide.component.scss'
})
export class BundleSizeSlideComponent {}
