import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { ReactiveComponent } from './reactive.component';

const DEBOUNCE_MS = 300;
const NETWORK_DELAY_MS = 800;

describe('ReactiveComponent', () => {
  let component: ReactiveComponent;
  let fixture: ComponentFixture<ReactiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTranslateService({ fallbackLang: 'en' })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit → addAddress() + valueChanges subscription
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('form is invalid with empty required fields', () => {
      expect(component.userForm.valid).toBe(false);
    });

    it('starts with one empty address in the FormArray', () => {
      expect(component.addresses.length).toBe(1);
    });

    it('starts with no submitted data', () => {
      expect(component.submittedData).toBeNull();
    });

    it('email async validation is not in progress initially', () => {
      expect(component.emailCheckInProgress).toBe(false);
    });
  });

  describe('address management', () => {
    it('addAddress() appends a new address group', () => {
      component.addAddress();
      expect(component.addresses.length).toBe(2);
    });

    it('removeAddress() removes the group at the given index', () => {
      component.addAddress();
      component.removeAddress(0);
      expect(component.addresses.length).toBe(1);
    });

    it('removeAllAddresses() resets to one empty address group', () => {
      component.addAddress();
      component.addAddress();
      component.removeAllAddresses();
      expect(component.addresses.length).toBe(1);
      expect(component.addresses.at(0).get('street')?.value).toBe('');
    });

    it('new address group defaults type to home', () => {
      component.addAddress();
      expect(component.addresses.at(1).get('type')?.value).toBe('home');
    });
  });

  describe('isUSA()', () => {
    it('returns false when no country is selected', () => {
      expect(component.isUSA()).toBe(false);
    });

    it('returns false for a non-US country', () => {
      component.userForm.get('country')?.setValue('uk');
      expect(component.isUSA()).toBe(false);
    });

    it('returns true when country is usa', () => {
      component.userForm.get('country')?.setValue('usa');
      expect(component.isUSA()).toBe(true);
    });
  });

  describe('isNewsletterSubscribed()', () => {
    it('returns false by default', () => {
      expect(component.isNewsletterSubscribed()).toBe(false);
    });

    it('returns true when newsletter control is checked', () => {
      component.userForm.get('newsletter')?.setValue(true);
      expect(component.isNewsletterSubscribed()).toBe(true);
    });
  });

  describe('getPasswordStrength()', () => {
    it('returns score 0 for an empty password', () => {
      expect(component.getPasswordStrength().score).toBe(0);
    });

    it('returns score 5 for a password meeting all criteria', () => {
      component.userForm.get('password')?.setValue('StrongP@ss1');
      expect(component.getPasswordStrength().score).toBe(5);
    });

    it('returns score ≤ 2 for a weak password', () => {
      component.userForm.get('password')?.setValue('weak');
      expect(component.getPasswordStrength().score).toBeLessThanOrEqual(2);
    });
  });

  describe('form control validation', () => {
    it('name is invalid when empty', () => {
      expect(component.userForm.get('name')?.valid).toBe(false);
    });

    it('name is valid with at least 2 characters', () => {
      component.userForm.get('name')?.setValue('Jo');
      expect(component.userForm.get('name')?.valid).toBe(true);
    });

    it('password fails complexity when missing a special character', () => {
      component.userForm.get('password')?.setValue('WeakPass1');
      expect(component.userForm.get('password')?.errors?.['passwordComplexity']).toBeTruthy();
    });

    it('password passes validation when all complexity rules are met', () => {
      component.userForm.get('password')?.setValue('StrongP@ss1');
      expect(component.userForm.get('password')?.valid).toBe(true);
    });

    it('confirmPassword gets mismatch error when passwords differ', () => {
      component.userForm.patchValue({ password: 'StrongP@ss1', confirmPassword: 'Different1!' });
      expect(component.userForm.get('confirmPassword')?.errors?.['passwordMismatch']).toBeTruthy();
    });

    it('confirmPassword error clears when passwords match', () => {
      component.userForm.patchValue({ password: 'StrongP@ss1', confirmPassword: 'StrongP@ss1' });
      expect(component.userForm.get('confirmPassword')?.errors?.['passwordMismatch']).toBeFalsy();
    });
  });

  describe('onSubmit()', () => {
    it('does not set submittedData when form is invalid', () => {
      component.onSubmit();
      expect(component.submittedData).toBeNull();
    });

    it('sets submittedData when form is fully valid', fakeAsync(() => {
      component.userForm.patchValue({
        name: 'Jane Doe',
        email: 'available@example.com',
        password: 'StrongP@ss1',
        confirmPassword: 'StrongP@ss1',
        country: 'uk'
      });
      tick(DEBOUNCE_MS + NETWORK_DELAY_MS);

      component.onSubmit();

      expect(component.submittedData).toBeTruthy();
      expect(component.submittedData?.name).toBe('Jane Doe');
    }));

    it('does not submit when email is taken', fakeAsync(() => {
      component.userForm.patchValue({
        name: 'Jane Doe',
        email: 'test@example.com', // seeded as taken
        password: 'StrongP@ss1',
        confirmPassword: 'StrongP@ss1',
        country: 'uk'
      });
      tick(DEBOUNCE_MS + NETWORK_DELAY_MS);

      component.onSubmit();

      expect(component.submittedData).toBeNull();
    }));
  });
});
