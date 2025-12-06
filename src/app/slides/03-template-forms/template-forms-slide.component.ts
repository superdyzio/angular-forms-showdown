import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'afs-template-forms-slide',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './template-forms-slide.component.html',
  styleUrl: './template-forms-slide.component.scss'
})
export class TemplateFormsSlideComponent {}
