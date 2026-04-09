import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { EmailCheckService } from '../../services/email-check.service';
import { SignalComponent } from './signal.component';

describe('SignalComponent', () => {
  let component: SignalComponent;
  let fixture: ComponentFixture<SignalComponent>;

  /** Current UserForm value: calls the Form as a signal, then reads the value signal */
  const formValue = () => (component as any).form().value();

  /** Set a scalar field value directly via the FormField's WritableSignal */
  function setField<K extends string>(field: K, value: unknown): void {
    (component as any).form[field]().value.set(value);
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTranslateService({ fallbackLang: 'en' }),
        // Zoneless avoids the recursive ApplicationRef.tick() issue that occurs
        // when signal writes happen inside fakeAsync's tick() with zone.js CD.
        provideZonelessChangeDetection()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('starts with one address', () => {
      expect(formValue().addresses.length).toBe(1);
    });

    it('starts with no submitted data', () => {
      expect(component.submittedData()).toBeNull();
    });

    it('emailCheckInProgress is false', () => {
      expect(component.emailCheckInProgress()).toBe(false);
    });

    it('emailExists is false', () => {
      expect(component.emailExists()).toBe(false);
    });

    it('profileCompletion starts at 0', () => {
      expect(component.profileCompletion()).toBe(0);
    });
  });

  describe('address management', () => {
    it('addAddress() appends a new address signal', () => {
      component.addAddress();
      expect(formValue().addresses.length).toBe(2);
    });

    it('removeAddress() removes the address at the given index', () => {
      component.addAddress();
      component.removeAddress(0);
      expect(formValue().addresses.length).toBe(1);
    });

    it('removeAllAddresses() resets to exactly one empty address', () => {
      component.addAddress();
      component.addAddress();
      component.removeAllAddresses();
      expect(formValue().addresses.length).toBe(1);
      expect(formValue().addresses[0]().street).toBe('');
    });

    it('new address defaults to type home', () => {
      component.addAddress();
      expect(formValue().addresses[1]().type).toBe('home');
    });
  });

  describe('isUSA()', () => {
    it('returns false when country is empty', () => {
      expect(component.isUSA()).toBe(false);
    });

    it('returns false for a non-US country', () => {
      setField('country', 'uk');
      expect(component.isUSA()).toBe(false);
    });

    it('returns true when country is usa', () => {
      setField('country', 'usa');
      expect(component.isUSA()).toBe(true);
    });
  });

  describe('isNewsletterSubscribed()', () => {
    it('returns false by default', () => {
      expect(component.isNewsletterSubscribed()).toBe(false);
    });

    it('returns true after enabling newsletter', () => {
      setField('newsletter', true);
      expect(component.isNewsletterSubscribed()).toBe(true);
    });
  });

  describe('passwordsMatch (computed)', () => {
    it('is true when both password fields are empty', () => {
      expect(component.passwordsMatch()).toBe(true);
    });

    it('is true when both passwords are the same', () => {
      setField('password', 'Test@1234');
      setField('confirmPassword', 'Test@1234');
      expect(component.passwordsMatch()).toBe(true);
    });

    it('is false when passwords differ', () => {
      setField('password', 'Test@1234');
      setField('confirmPassword', 'Different1!');
      expect(component.passwordsMatch()).toBe(false);
    });
  });

  describe('passwordsStrength (computed)', () => {
    it('returns score 0 for an empty password', () => {
      expect(component.passwordsStrength().score).toBe(0);
    });

    it('returns score 5 for a password meeting all criteria', () => {
      setField('password', 'StrongP@ss1');
      expect(component.passwordsStrength().score).toBe(5);
    });

    it('returns score ≤ 2 for a weak password', () => {
      setField('password', 'weak');
      expect(component.passwordsStrength().score).toBeLessThanOrEqual(2);
    });
  });

  describe('profileCompletion (computed)', () => {
    it('increases as required fields are filled', () => {
      setField('name', 'Jane');
      setField('email', 'jane@example.com');
      expect(component.profileCompletion()).toBeGreaterThan(0);
    });
  });

  describe('emailValue (computed)', () => {
    // Note: the full async pipeline (toObservable + debounceTime + switchMap → emailExists)
    // is not tested here because Angular 21's zoneless effect scheduler does not flush
    // reliably inside fakeAsync in the current test setup. That behaviour is covered in:
    //   - email-check.service.spec.ts  (service logic + debounce-free results)
    //   - template-email-async.validator.spec.ts  (directive with debounce + network delay)

    it('starts empty', () => {
      expect((component as any).emailValue()).toBe('');
    });

    it('reflects changes to the email field', () => {
      setField('email', 'changed@example.com');
      expect((component as any).emailValue()).toBe('changed@example.com');
    });
  });

  describe('toggleEmailErrorSimulation()', () => {
    afterEach(() => {
      const emailCheck = TestBed.inject(EmailCheckService);
      if (emailCheck.simulateError()) emailCheck.toggleSimulateError();
    });

    it('enables the service error flag', () => {
      const emailCheck = TestBed.inject(EmailCheckService);
      component.toggleEmailErrorSimulation();
      expect(emailCheck.simulateError()).toBe(true);
    });
  });

  describe('onSubmit()', () => {
    it('does not set submittedData when the form is invalid', () => {
      component.onSubmit();
      expect(component.submittedData()).toBeNull();
    });

    it('sets submittedData when required fields are filled', () => {
      setField('name', 'Jane Doe');
      setField('email', 'available@example.com');
      setField('password', 'StrongP@ss1');
      setField('confirmPassword', 'StrongP@ss1');
      setField('country', 'uk');

      component.onSubmit();

      expect(component.submittedData()).toBeTruthy();
      expect(component.submittedData()?.name).toBe('Jane Doe');
    });
  });
});
