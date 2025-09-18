import { Component, signal, inject, computed, WritableSignal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { form, Control, required, minLength, email, validate, requiredError, customError } from '@angular/forms/signals';
import { EmailCheckService } from '../../services/email-check.service';
import { Address } from '../../types/address';
import { User, UserForm } from '../../types/user';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, take } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'afs-signal',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, Control],
  templateUrl: './signal.component.html',
  styleUrl: './signal.component.scss'
})
export class SignalComponent {
  private emailCheck = inject(EmailCheckService);

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
    required(data.name, { message: 'Name is required' }),
    minLength(data.name, 2, { message: 'Name must be at least 2 characters' }),
    required(data.email, { message: 'Email is required' }),
    email(data.email, { message: 'Please enter a valid email' }),
    required(data.password, { message: 'Password is required' }),
    minLength(data.password, 8, { message: 'Password must be at least 8 characters' }),
    validate(data.password, ({ valueOf }) => {
      const password = valueOf(data.password);
      if (!password) return null;

      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumeric = /\d/.test(password);
      const hasSpecialChar = /[@$!%*?&]/.test(password);

      if (!hasUpperCase || !hasLowerCase || !hasNumeric || !hasSpecialChar) {
        return customError({ message: 'Password must contain uppercase, lowercase, number, and special character' })
      }
      return null;
    }),
    required(data.confirmPassword, { message: 'Please confirm your password' }),
    required(data.country, { message: 'Country is required' }),
    validate(data.state, ({ valueOf }) => this.isUSA() && !valueOf(data.state) ? requiredError({ message: 'State is required for USA' }) : null)
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
      return { score, label: 'Weak', color: '#ff4444' };
    } else if (score <= 3) {
      return { score, label: 'Fair', color: '#ffaa00' };
    } else if (score <= 4) {
      return { score, label: 'Good', color: '#00aa00' };
    } else {
      return { score, label: 'Strong', color: '#00aa00' };
    }
  });

  // Available options
  countries = [
    { value: '', label: 'Select a country' },
    { value: 'usa', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' }
  ];

  states = [
    { value: '', label: 'Select a state' },
    { value: 'ca', label: 'California' },
    { value: 'ny', label: 'New York' },
    { value: 'tx', label: 'Texas' },
    { value: 'fl', label: 'Florida' },
    { value: 'il', label: 'Illinois' }
  ];

  addressTypes = [
    { value: 'home', label: 'Home' },
    { value: 'work', label: 'Work' },
    { value: 'other', label: 'Other' }
  ];

  newsletterFrequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

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
          console.log(exists);
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
      for (let i = 0; i < 100; i++) {
        this.addAddress();
      }
      const end = performance.now();
      console.log('add 100 address time: ', end - start);
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
      console.log('add 100 address time: ', end - start);
    }
  }
}