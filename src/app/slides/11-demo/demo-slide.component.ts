import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'afs-demo-slide',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './demo-slide.component.html',
  styleUrl: './demo-slide.component.scss'
})
export class DemoSlideComponent {}
