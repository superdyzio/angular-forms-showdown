import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'afs-migration-slide',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './migration-slide.component.html',
  styleUrl: './migration-slide.component.scss'
})
export class MigrationSlideComponent {
  readonly templateSnippet =
`<!-- template.component.html -->
<input type="email"
  name="email"
  [(ngModel)]="user.email"
  #email="ngModel"
  required />
<span *ngIf="email.invalid && email.touched">
  {{ email.errors?.['required'] ? 'Required' : 'Invalid' }}
</span>`;

  readonly reactiveSnippet =
`// reactive.component.ts
email = new FormControl('', [
  Validators.required,
  Validators.email
]);

// reactive.component.html
<input [formControl]="email" />
<span *ngIf="email.invalid && email.touched">
  {{ email.errors?.['required'] ? 'Required' : 'Invalid' }}
</span>`;

  readonly signalSnippet =
`// signal.component.ts
form = form(signal({ email: '' }), d => {
  required(d.email);
  email(d.email);
});

// signal.component.html
<input [formField]="form.email" />
<span *ngIf="form.email().invalid()">
  {{ form.email().errors()[0].message }}
</span>`;
}
