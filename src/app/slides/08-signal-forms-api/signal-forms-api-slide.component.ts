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
  // Existing Signal Forms API snippets
  protected formSnippet =
`<form>
  <label>First Name:
    <input [formField]="f.firstName" />
  </label>
  <label>Last Name:
    <input [formField]="f.lastName" />
  </label>
</form>`;

  protected errorSnippet =
`@if (f().errors().length) {
  <div>{{ f().errors()[0].message }}</div>
}`;

  // Async email validator comparison
  protected templateAsyncSnippet =
`// Async validator directive
@Directive({ selector: '[afsEmailExists]' })
export class TemplateEmailAsyncValidator
  implements AsyncValidator {

  validate(control): Observable<ValidationErrors | null> {
    return emailCheck
      .checkEmailExists(control.value)
      .pipe(
        map(exists =>
          exists ? { emailExists: true } : null
        ),
        catchError(() =>
          of({ emailCheckError: true })
        )
      );
  }
}

// template.component.html
<input name="email"
  [(ngModel)]="user.email"
  afsEmailExists />`;

  protected reactiveAsyncSnippet =
`// reactive.component.ts
emailExistsValidator(
  control: AbstractControl
): Observable<ValidationErrors | null> {
  return emailCheck
    .checkEmailExists(control.value)
    .pipe(
      map(exists =>
        exists ? { emailExists: true } : null
      ),
      catchError(() =>
        of({ emailCheckError: true })
      )
    );
}

// form setup
email: ['', [Validators.email],
  [this.emailExistsValidator.bind(this)]]`;

  protected signalAsyncSnippet =
`// signal.component.ts — inside the form schema
validateAsync(data.email, {
  when: ({ valueOf }) =>
    isValidEmailFormat(valueOf(data.email) ?? ''),
  debounce: 300,
  factory: email => rxResource({
    params: () => email(),
    stream: ({ params }) =>
      emailCheck.checkEmailExists(params ?? '')
  }),
  onSuccess: exists => exists
    ? { kind: 'emailExists', message: '...' }
    : null,
  onError: () => ({ kind: 'emailCheckError' })
});

// template: declarative, framework-driven
@if (form.email().errors()
      .some(e => e.kind === 'emailExists')) { ... }`;
}
