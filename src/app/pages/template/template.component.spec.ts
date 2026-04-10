import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { NgForm } from '@angular/forms';
import { TemplateComponent } from './template.component';

describe('TemplateComponent', () => {
  let component: TemplateComponent;
  let fixture: ComponentFixture<TemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTranslateService({ fallbackLang: 'en' })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('starts with one empty address', () => {
      expect(component.user.addresses.length).toBe(1);
    });

    it('starts with zero profile completion', () => {
      expect(component.profileCompletion).toBe(0);
    });

    it('starts with no submitted data', () => {
      expect(component.submittedData).toBeNull();
    });
  });

  describe('address management', () => {
    it('addAddress() appends a new address', () => {
      component.addAddress();
      expect(component.user.addresses.length).toBe(2);
    });

    it('removeAddress() removes the address at the given index', () => {
      component.addAddress();
      component.removeAddress(0);
      expect(component.user.addresses.length).toBe(1);
    });

    it('removeAllAddresses() resets to exactly one empty address', () => {
      component.addAddress();
      component.addAddress();
      component.removeAllAddresses();
      expect(component.user.addresses.length).toBe(1);
      expect(component.user.addresses[0].street).toBe('');
    });

    it('new address has home as default type', () => {
      component.addAddress();
      expect(component.user.addresses[1].type).toBe('home');
    });
  });

  describe('addOrUpdateHundredAddresses()', () => {
    it('adds 1000 addresses on first call and sets bulkAddressesAdded', () => {
      expect(component.bulkAddressesAdded).toBe(false);
      component.addOrUpdateHundredAddresses();
      expect(component.user.addresses.length).toBe(1001); // 1 initial + 1000
      expect(component.bulkAddressesAdded).toBe(true);
    });

    it('updates all addresses with bulk data on second call', () => {
      component.addOrUpdateHundredAddresses(); // add
      component.addOrUpdateHundredAddresses(); // update
      const first = component.user.addresses[0];
      expect(first.type).toBe('work');
      expect(first.street).toBe('Bulk Street 1');
      expect(first.city).toBe('Bulk City 1');
      expect(first.zipCode).toBe('10001');
      const last = component.user.addresses[1000];
      expect(last.street).toBe('Bulk Street 1001');
      expect(last.zipCode).toBe('11001');
    });

    it('does not add more addresses on a second call', () => {
      component.addOrUpdateHundredAddresses();
      const countAfterAdd = component.user.addresses.length;
      component.addOrUpdateHundredAddresses();
      expect(component.user.addresses.length).toBe(countAfterAdd);
    });
  });

  describe('isUSA()', () => {
    it('returns false when no country is selected', () => {
      component.user.country = '';
      expect(component.isUSA()).toBe(false);
    });

    it('returns false for a non-US country', () => {
      component.user.country = 'uk';
      expect(component.isUSA()).toBe(false);
    });

    it('returns true when country is usa', () => {
      component.user.country = 'usa';
      expect(component.isUSA()).toBe(true);
    });
  });

  describe('isNewsletterSubscribed()', () => {
    it('returns false by default', () => {
      expect(component.isNewsletterSubscribed()).toBe(false);
    });

    it('returns true after subscribing', () => {
      component.user.newsletter = true;
      expect(component.isNewsletterSubscribed()).toBe(true);
    });
  });

  describe('passwordsMatch()', () => {
    it('returns true when both passwords are equal', () => {
      component.user.password = 'Test@1234';
      component.user.confirmPassword = 'Test@1234';
      expect(component.passwordsMatch()).toBe(true);
    });

    it('returns false when passwords differ', () => {
      component.user.password = 'Test@1234';
      component.user.confirmPassword = 'Different1!';
      expect(component.passwordsMatch()).toBe(false);
    });

    it('returns true when both are empty strings', () => {
      component.user.password = '';
      component.user.confirmPassword = '';
      expect(component.passwordsMatch()).toBe(true);
    });
  });

  describe('getPasswordStrength()', () => {
    it('returns score 0 for an empty password', () => {
      component.user.password = '';
      expect(component.getPasswordStrength().score).toBe(0);
    });

    it('returns score 5 for a password meeting all criteria', () => {
      component.user.password = 'StrongP@ss1';
      expect(component.getPasswordStrength().score).toBe(5);
    });

    it('returns score ≤ 2 for a weak password', () => {
      component.user.password = 'weak';
      expect(component.getPasswordStrength().score).toBeLessThanOrEqual(2);
    });

    it('returns score 3–4 for a fair/good password', () => {
      component.user.password = 'Passw0rd';
      const { score } = component.getPasswordStrength();
      expect(score).toBeGreaterThanOrEqual(3);
      expect(score).toBeLessThanOrEqual(4);
    });
  });

  describe('calculateProfileCompletion()', () => {
    it('stays at 0 with all fields empty', () => {
      component.calculateProfileCompletion();
      expect(component.profileCompletion).toBe(0);
    });

    it('increases when required fields are filled', () => {
      component.user.name = 'Jane';
      component.user.email = 'jane@example.com';
      component.calculateProfileCompletion();
      expect(component.profileCompletion).toBeGreaterThan(0);
    });

    it('reaches 100 when all fields including address are filled', () => {
      component.user.name = 'Jane';
      component.user.email = 'jane@example.com';
      component.user.password = 'Test@1234';
      component.user.confirmPassword = 'Test@1234';
      component.user.country = 'uk';
      component.user.addresses[0] = { type: 'home', street: '1 Main St', city: 'London', state: '', zipCode: 'W1A' };
      component.calculateProfileCompletion();
      expect(component.profileCompletion).toBe(100);
    });
  });

  describe('onSubmit()', () => {
    it('does not set submittedData when the form is invalid', () => {
      component.onSubmit({ valid: false } as NgForm);
      expect(component.submittedData).toBeNull();
    });

    it('does not set submittedData when passwords do not match', () => {
      component.user.password = 'Test@1234';
      component.user.confirmPassword = 'Different1!';
      component.onSubmit({ valid: true } as NgForm);
      expect(component.submittedData).toBeNull();
    });

    it('sets submittedData when form is valid and passwords match', () => {
      component.user.name = 'Jane';
      component.user.password = 'Test@1234';
      component.user.confirmPassword = 'Test@1234';
      component.onSubmit({ valid: true } as NgForm);
      expect(component.submittedData).toEqual({ ...component.user });
    });
  });
});
