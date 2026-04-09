/**
 * Reactive Forms validator isolation tests.
 *
 * Key differentiator: Reactive Form validators are plain functions that accept
 * AbstractControl and return ValidationErrors | null. They can be tested without
 * a DOM, a TestBed, or any Angular infrastructure — just a mock control object.
 */
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ReactiveComponent } from './reactive.component';

// These methods don't reference `this`, so they work as standalone functions.
const passwordComplexityValidator = ReactiveComponent.prototype.passwordComplexityValidator;
const passwordMatchValidator = ReactiveComponent.prototype.passwordMatchValidator;

describe('passwordComplexityValidator (Reactive Forms — no TestBed needed)', () => {
  function ctrl(value: string): AbstractControl {
    return { value } as AbstractControl;
  }

  it('returns null for a password meeting all requirements', () => {
    expect(passwordComplexityValidator(ctrl('StrongP@ss1'))).toBeNull();
  });

  it('returns null for an empty value', () => {
    expect(passwordComplexityValidator(ctrl(''))).toBeNull();
  });

  it('flags a password missing uppercase', () => {
    expect(passwordComplexityValidator(ctrl('weakpass1!'))).toEqual({ passwordComplexity: true });
  });

  it('flags a password missing lowercase', () => {
    expect(passwordComplexityValidator(ctrl('WEAKPASS1!'))).toEqual({ passwordComplexity: true });
  });

  it('flags a password missing a number', () => {
    expect(passwordComplexityValidator(ctrl('WeakPass!'))).toEqual({ passwordComplexity: true });
  });

  it('flags a password missing a special character', () => {
    expect(passwordComplexityValidator(ctrl('WeakPass1'))).toEqual({ passwordComplexity: true });
  });
});

describe('passwordMatchValidator (Reactive Forms — no TestBed needed)', () => {
  function makeGroup(password: string, confirmPassword: string): AbstractControl {
    return new FormGroup({
      password: new FormControl(password),
      confirmPassword: new FormControl(confirmPassword)
    });
  }

  it('returns null when passwords match', () => {
    expect(passwordMatchValidator(makeGroup('MyP@ss1!', 'MyP@ss1!'))).toBeNull();
  });

  it('returns passwordMismatch error when passwords differ', () => {
    const group = makeGroup('MyP@ss1!', 'Different1!');
    expect(passwordMatchValidator(group)).toEqual({ passwordMismatch: true });
  });

  it('sets the error on the confirmPassword control', () => {
    const group = makeGroup('MyP@ss1!', 'Different1!');
    passwordMatchValidator(group);
    expect(group.get('confirmPassword')?.errors).toEqual({ passwordMismatch: true });
  });

  it('clears the error on confirmPassword when passwords match again', () => {
    const group = makeGroup('MyP@ss1!', 'Different1!');
    passwordMatchValidator(group); // sets error
    (group.get('confirmPassword') as FormControl).setValue('MyP@ss1!');
    passwordMatchValidator(group); // should clear error
    expect(group.get('confirmPassword')?.errors).toBeNull();
  });
});
