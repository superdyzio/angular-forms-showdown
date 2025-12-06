import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'afs-signal-forms-api-slide',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './signal-forms-api-slide.component.html',
  styleUrl: './signal-forms-api-slide.component.scss'
})
export class SignalFormsApiSlideComponent {
  protected formSnippet = `
<form>
  <label>First Name: <input [control]="f.firstName" /></label>
  <label>Last Name: <input [control]="f.lastName" /></label>
</form>
  `

  protected errorSnippet = `
@if (f().errors().length) {
  <div>{{ f().errors()[0].message }}</div>
}`
}
