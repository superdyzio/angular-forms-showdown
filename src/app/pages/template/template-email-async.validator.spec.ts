/**
 * Template-Driven async validator integration tests.
 *
 * Contrast with reactive.validators.spec.ts: because the validator lives inside
 * a directive, testing it requires a host component, a compiled template, and
 * fakeAsync to manage both the debounce timer and the simulated network delay.
 */
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TemplateEmailAsyncValidatorDirective } from './template-email-async.validator';

const DEBOUNCE_MS = 300;
const NETWORK_DELAY_MS = 800;

@Component({
  standalone: true,
  imports: [FormsModule, TemplateEmailAsyncValidatorDirective],
  template: `
    <form #f="ngForm">
      <input name="email" ngModel [afsEmailExists]="true" />
    </form>
  `
})
class HostComponent {}

describe('TemplateEmailAsyncValidatorDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let form: NgForm;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);
  });

  it('marks a taken email as invalid', fakeAsync(() => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'test@example.com';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    tick(DEBOUNCE_MS + NETWORK_DELAY_MS);
    fixture.detectChanges();

    expect(form.controls['email'].errors).toEqual({ emailExists: true });
  }));

  it('marks an available email as valid', fakeAsync(() => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'available@example.com';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    tick(DEBOUNCE_MS + NETWORK_DELAY_MS);
    fixture.detectChanges();

    expect(form.controls['email'].errors).toBeNull();
  }));

  it('skips validation for an invalid email format', fakeAsync(() => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'not-an-email';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    tick(DEBOUNCE_MS + NETWORK_DELAY_MS);
    fixture.detectChanges();

    expect(form.controls['email'].errors).toBeNull();
  }));

  it('debounces — does not fire before 300 ms', fakeAsync(() => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'test@example.com';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    tick(DEBOUNCE_MS - 1); // just before debounce fires
    fixture.detectChanges();

    // Still pending — no result yet
    expect(form.controls['email'].pending).toBe(true);

    tick(1 + NETWORK_DELAY_MS); // finish
    fixture.detectChanges();
  }));
});
