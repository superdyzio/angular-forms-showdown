import { Directive, Input, inject } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Observable, map, catchError, of } from 'rxjs';
import { EmailCheckService } from '../../services/email-check.service';
import { isValidEmailFormat } from '../../validators/email.validator';

@Directive({
  selector: '[afsEmailExists]',
  standalone: true,
  providers: [
    { provide: NG_ASYNC_VALIDATORS, useExisting: TemplateEmailAsyncValidatorDirective, multi: true }
  ]
})
export class TemplateEmailAsyncValidatorDirective implements AsyncValidator {
  private emailCheck = inject(EmailCheckService);

  @Input('afsEmailExists') enabled: boolean | string = true;

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (this.enabled === false || this.enabled === 'false') {
      return of(null);
    }
    const email = control.value as string;
    if (!email || !isValidEmailFormat(email)) {
      return of(null);
    }
    return this.emailCheck.checkEmailExists(email).pipe(
      map(exists => (exists ? { emailExists: true } : null)),
      catchError(() => of({ emailCheckError: true }))
    );
  }
}


