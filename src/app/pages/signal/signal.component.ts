import { Component, signal, inject, computed, WritableSignal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { form, Field, required, minLength, email, validate, requiredError, customError } from '@angular/forms/signals';
import { EmailCheckService } from '../../services/email-check.service';
import { Address } from '../../types/address';
import { User, UserForm } from '../../types/user';
import { catchError, map, take } from 'rxjs/operators';
import { of } from 'rxjs';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'afs-signal',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, Field, TranslateModule],
  templateUrl: './signal.component.html',
  styleUrl: './signal.component.scss'
})
export class SignalComponent {
  private emailCheck = inject(EmailCheckService);
  private translate = inject(TranslateService);

  protected form = form<UserForm>(signal({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    state: '',
    newsletter: false,
    newsletterFrequency: '',
    addresses: []
  }), data => {
    required(data.name, { message: () => this.translate.instant('validation.name.required') }),
    minLength(data.name, 2, { message: () => this.translate.instant('validation.name.minlength') }),
    required(data.email, { message: () => this.translate.instant('validation.email.required') }),
    email(data.email, { message: () => this.translate.instant('validation.email.invalid') }),
    required(data.password, { message: () => this.translate.instant('validation.password.required') }),
    minLength(data.password, 8, { message: () => this.translate.instant('validation.password.minlength') }),
    // @ts-ignore
    validate(data.password, ({ valueOf }) => {
      const password = valueOf(data.password);
      if (!password) return null;

      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumeric = /\d/.test(password);
      const hasSpecialChar = /[@$!%*?&]/.test(password);

      if (!hasUpperCase || !hasLowerCase || !hasNumeric || !hasSpecialChar) {
    // @ts-ignore
        return customError({ message: () => this.translate.instant('validation.password.complexity') })
      }
      return null;
    }),
    required(data.confirmPassword, { message: () => this.translate.instant('validation.confirmPassword.required') }),
    required(data.country, { message: () => this.translate.instant('validation.country.required') }),
    // @ts-ignore
    validate(data.state, ({ valueOf }) => this.isUSA() && !valueOf(data.state) ? requiredError({ message: () => this.translate.instant('validation.state.required') }) : null)
  });

  // Signal-based state
  submittedData = signal<User | null>(null);
  emailCheckInProgress = signal(false);
  emailExists = signal(false);

  // Calculate profile completion percentage
  profileCompletion = computed(() => {
    const formValue = this.form().value();
    const fields = [
      formValue.name,
      formValue.email,
      formValue.password,
      formValue.confirmPassword,
      formValue.country
    ];
    if (formValue.country.toString().trim() !== '') {
      fields.push(formValue.state);
    }

    const filledFields = fields.filter(field => field && field.toString().trim() !== '').length;

    const addresses = formValue.addresses;
    // Add address completion
    const addressCompletion = addresses && addresses.length > 0 ? 
      addresses.reduce((acc: number, addrSignal: WritableSignal<Address>) => {
        const addr = addrSignal();
        const addrFields = [addr.street, addr.city, addr.zipCode];
        const filledAddrFields = addrFields.filter(field => field && field.trim() !== '').length;
        return acc + (filledAddrFields / addrFields.length);
      }, 0) / addresses.length : 0;

    return Math.round(((filledFields + addressCompletion) / (fields.length + 1)) * 100);
  });

  // Custom password confirmation validator
  passwordsMatch = computed(() => {
    return this.form.password().value() === this.form.confirmPassword().value();
  });

  // Calculate password strength
  passwordsStrength = computed((): { score: number; label: string; color: string } => {
    const password = this.form.password().value();
    if (!password) {
      return { score: 0, label: '', color: '' };
    }

    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password)
    };

    score = Object.values(checks).filter(Boolean).length;

    if (score <= 2) {
      return { score, label: this.translate.instant('password.weak'), color: '#ff4444' };
    } else if (score <= 3) {
      return { score, label: this.translate.instant('password.fair'), color: '#ffaa00' };
    } else if (score <= 4) {
      return { score, label: this.translate.instant('password.good'), color: '#00aa00' };
    } else {
      return { score, label: this.translate.instant('password.strong'), color: '#00aa00' };
    }
  });

  // Available options - computed to use translations
  countries = computed(() => [
    { value: '', label: this.translate.instant('option.selectCountry') },
    { value: 'usa', label: this.translate.instant('option.unitedStates') },
    { value: 'uk', label: this.translate.instant('option.unitedKingdom') },
    { value: 'ca', label: this.translate.instant('option.canada') },
    { value: 'au', label: this.translate.instant('option.australia') },
    { value: 'de', label: this.translate.instant('option.germany') }
  ]);

  states = computed(() => [
    { value: '', label: this.translate.instant('option.selectState') },
    { value: 'ca', label: this.translate.instant('option.california') },
    { value: 'ny', label: this.translate.instant('option.newYork') },
    { value: 'tx', label: this.translate.instant('option.texas') },
    { value: 'fl', label: this.translate.instant('option.florida') },
    { value: 'il', label: this.translate.instant('option.illinois') }
  ]);

  addressTypes = computed(() => [
    { value: 'home', label: this.translate.instant('option.home') },
    { value: 'work', label: this.translate.instant('option.work') },
    { value: 'other', label: this.translate.instant('option.other') }
  ]);

  newsletterFrequencies = computed(() => [
    { value: 'daily', label: this.translate.instant('option.daily') },
    { value: 'weekly', label: this.translate.instant('option.weekly') },
    { value: 'monthly', label: this.translate.instant('option.monthly') }
  ]);

  constructor() {
    // Add initial address
    this.addAddress();

    effect(() => {
      const email = this.form().value().email;
      if (!email || !email.includes('@')) {
        this.emailExists.set(false);
        return null;
      }
      this.emailCheckInProgress.set(true);

      return this.emailCheck.checkEmailExists(email).pipe(
        map(exists => {
          this.emailCheckInProgress.set(false);
          this.emailExists.set(exists);
          return exists ? { emailExists: true } : null;
        }),
        take(1),
        catchError(() => {
          this.emailCheckInProgress.set(false);
          return of(null);
        })
      ).subscribe();
    });
  
  }

  // Check if country is USA
  isUSA(): boolean {
    return this.form.country().value() === 'usa';
  }

  // Check if newsletter is subscribed
  isNewsletterSubscribed(): boolean {
    return this.form.newsletter().value();
  }

  // Add new address
  addAddress() {
    this.form().value().addresses.push(signal({
      type: 'home',
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }));
  }

  // Remove address
  removeAddress(index: number) {
    this.form().value().addresses.splice(index, 1);
  }

  // Remove all addresses and reset to single empty
  removeAllAddresses() {
    const addresses = this.form().value().addresses;
    addresses.splice(0, addresses.length);
    this.addAddress();
    this.bulkAddressesAdded = false;
  }

  onSubmit() {
    if (this.form().valid()) {
      const formValue = this.form().value();
      const userPayload: User = {
        ...formValue,
        addresses: formValue.addresses.map(adr => adr()),
      };
      this.submittedData.set(userPayload);
      console.log('Form submitted:', this.submittedData());
    }
    return false;
  }

  // Bulk add/update similar to template/reactive components for performance testing
  bulkAddressesAdded = false;

  addOrUpdateHundredAddresses() {
    const addresses = this.form().value().addresses as WritableSignal<Address>[];
    if (!this.bulkAddressesAdded) {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        this.addAddress();
      }
      const end = performance.now();
      console.log('add 1k address time: ', end - start);
      this.bulkAddressesAdded = true;
    } else {
      const total = addresses.length;
      const start = performance.now();
      for (let i = 0; i < total; i++) {
        const index = i + 1;
        const addrSignal = addresses[i];
        const current = addrSignal();
        addrSignal.set({
          ...current,
          type: 'work',
          street: `Bulk Street ${index}`,
          city: `Bulk City ${index}`,
          state: '',
          zipCode: `${10000 + index}`
        });
      }
      const end = performance.now();
      console.log('add 1k address time: ', end - start);
    }
  }
}