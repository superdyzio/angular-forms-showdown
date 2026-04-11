import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { FormControl, ValidationErrors } from '@angular/forms';
import { ReactiveComponent } from './reactive.component';
import { EmailCheckService } from '../../services/email-check.service';

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

  describe('addOrUpdateHundredAddresses()', () => {
    it('adds 1000 addresses on first call and sets bulkAddressesAdded', () => {
      expect(component.bulkAddressesAdded).toBe(false);
      component.addOrUpdateHundredAddresses();
      expect(component.addresses.length).toBe(1001); // 1 initial + 1000
      expect(component.bulkAddressesAdded).toBe(true);
    });

    it('updates all addresses with bulk data on second call', () => {
      component.addOrUpdateHundredAddresses(); // add
      component.addOrUpdateHundredAddresses(); // update
      const first = component.addresses.at(0);
      expect(first.get('type')?.value).toBe('work');
      expect(first.get('street')?.value).toBe('Bulk Street 1');
      expect(first.get('city')?.value).toBe('Bulk City 1');
      expect(first.get('zipCode')?.value).toBe('10001');
      const last = component.addresses.at(1000);
      expect(last.get('street')?.value).toBe('Bulk Street 1001');
      expect(last.get('zipCode')?.value).toBe('11001');
    });

    it('does not add more addresses on a second call', () => {
      component.addOrUpdateHundredAddresses();
      const countAfterAdd = component.addresses.length;
      component.addOrUpdateHundredAddresses();
      expect(component.addresses.length).toBe(countAfterAdd);
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

  describe('emailExistsValidator()', () => {
    // timer(300) inside the validator + 800 ms simulated network delay
    const TIMER_MS = 300;
    const NETWORK_DELAY_MS = 800;
    let emailCheck: EmailCheckService;

    beforeEach(() => {
      emailCheck = TestBed.inject(EmailCheckService);
    });

    afterEach(() => {
      if (emailCheck.simulateError()) emailCheck.toggleSimulateError();
    });

    it('returns emailExists error for a taken email', fakeAsync(() => {
      const ctrl = new FormControl('test@example.com');
      let result: ValidationErrors | null | undefined;
      component.emailExistsValidator(ctrl).subscribe(r => (result = r));
      tick(TIMER_MS + NETWORK_DELAY_MS);
      expect(result).toEqual({ emailExists: true });
    }));

    it('returns null for an available email', fakeAsync(() => {
      const ctrl = new FormControl('available@example.com');
      let result: ValidationErrors | null | undefined;
      component.emailExistsValidator(ctrl).subscribe(r => (result = r));
      tick(TIMER_MS + NETWORK_DELAY_MS);
      expect(result).toBeNull();
    }));

    it('returns null immediately for an invalid email format', fakeAsync(() => {
      const ctrl = new FormControl('not-an-email');
      let result: ValidationErrors | null | undefined;
      component.emailExistsValidator(ctrl).subscribe(r => (result = r));
      tick(0);
      expect(result).toBeNull();
    }));

    it('returns null immediately for an empty value', fakeAsync(() => {
      const ctrl = new FormControl('');
      let result: ValidationErrors | null | undefined;
      component.emailExistsValidator(ctrl).subscribe(r => (result = r));
      tick(0);
      expect(result).toBeNull();
    }));

    it('returns emailCheckError when the service errors', fakeAsync(() => {
      emailCheck.toggleSimulateError();
      const ctrl = new FormControl('test@example.com');
      let result: ValidationErrors | null | undefined;
      component.emailExistsValidator(ctrl).subscribe(r => (result = r));
      tick(TIMER_MS + NETWORK_DELAY_MS);
      expect(result).toEqual({ emailCheckError: true });
    }));
  });

  describe('email control getters', () => {
    const TIMER_MS = 300;
    const NETWORK_DELAY_MS = 800;
    let emailCheck: EmailCheckService;

    beforeEach(() => {
      emailCheck = TestBed.inject(EmailCheckService);
    });

    afterEach(() => {
      if (emailCheck.simulateError()) emailCheck.toggleSimulateError();
    });

    it('emailCheckInProgress is true while the async validator is pending', fakeAsync(() => {
      component.userForm.get('email')!.setValue('available@example.com');
      tick(TIMER_MS); // debounce fires, network call in flight
      expect(component.emailCheckInProgress).toBe(true);
      tick(NETWORK_DELAY_MS);
      expect(component.emailCheckInProgress).toBe(false);
    }));

    it('emailExists is true when a taken email passes sync validation', fakeAsync(() => {
      component.userForm.get('email')!.setValue('test@example.com');
      tick(TIMER_MS + NETWORK_DELAY_MS);
      expect(component.emailExists).toBe(true);
    }));

    it('emailCheckError is true when the service errors', fakeAsync(() => {
      emailCheck.toggleSimulateError();
      component.userForm.get('email')!.setValue('test@example.com');
      tick(TIMER_MS + NETWORK_DELAY_MS);
      expect(component.emailCheckError).toBe(true);
    }));
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
