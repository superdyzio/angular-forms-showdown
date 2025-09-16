import { Directive, Input } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Observable, map, catchError, of } from 'rxjs';
import { EmailCheckService } from '../../services/email-check.service';

@Directive({
  selector: '[afsEmailExists]',
  standalone: true,
  providers: [
    { provide: NG_ASYNC_VALIDATORS, useExisting: TemplateEmailAsyncValidatorDirective, multi: true }
  ]
})
export class TemplateEmailAsyncValidatorDirective implements AsyncValidator {
  @Input('afsEmailExists') enabled: boolean | string = true;

  constructor(private emailCheck: EmailCheckService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (this.enabled === false || this.enabled === 'false') {
      return of(null);
    }
    const email = control.value as string;
    if (!email || !email.includes('@')) {
      return of(null);
    }
    return this.emailCheck.checkEmailExists(email).pipe(
      map(exists => (exists ? { emailExists: true } : null)),
      catchError(() => of(null))
    );
  }
}


