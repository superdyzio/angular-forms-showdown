import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'afs-compat-migration-slide',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './compat-migration-slide.component.html',
  styleUrl: './compat-migration-slide.component.scss'
})
export class CompatMigrationSlideComponent {
  readonly step1Snippet =
`// controls can stay reactive on day one
model = signal({
  name: '',
  email: new FormControl('', [Validators.email]),
  addresses: this.fb.array([]),  // bridged as-is
});

form = compatForm(this.model, p => {
  required(p.name);  // migrate field by field
});`;

  readonly step2Snippet =
`form = compatForm(this.model, p => {
  required(p.name);
  email(p.email);
  // was: valueChanges + setValidators
  required(p.state, {
    when: ({ valueOf }) =>
      valueOf(p.country) === 'usa',
  });
});`;

  readonly step3Snippet =
`// FormArray stays reactive, bridged,
// until everything else is migrated
get addresses() {
  return this.model().addresses;  // FormArray
}
// add/remove still call .push() / .removeAt()`;

  readonly step4Snippet =
`// submit: unwraps any remaining controls
const value = extractValue(this.form);

// template — uniform binding, even bridged
<input [formField]="form.name" />`;

  readonly step5Snippet =
`// no reactive controls left? drop compat:
form = form(this.model, schema);

// delete the @angular/forms/signals
// /compat import — migration done`;
}
