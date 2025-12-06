import { Component, inject, computed, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TemplateEmailAsyncValidatorDirective } from './template-email-async.validator';
import { CommonModule } from '@angular/common';
import { Address } from '../../types/address';
import { User } from '../../types/user';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'afs-template',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, TemplateEmailAsyncValidatorDirective],
  templateUrl: './template.component.html',
  styleUrl: './template.component.scss'
})
export class TemplateComponent {
  private translationService = inject(TranslationService);
  protected t = this.translationService.t;

  user: User = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    state: '',
    newsletter: false,
    newsletterFrequency: '',
    addresses: [] as Address[]
  };

  submittedData: User | null = null;
  profileCompletion = 0;
  bulkAddressesAdded = false;

  // Available options - computed to use translations
  countries = computed(() => [
    { value: '', label: this.t()('option.selectCountry') },
    { value: 'usa', label: this.t()('option.unitedStates') },
    { value: 'uk', label: this.t()('option.unitedKingdom') },
    { value: 'ca', label: this.t()('option.canada') },
    { value: 'au', label: this.t()('option.australia') },
    { value: 'de', label: this.t()('option.germany') }
  ]);

  states = computed(() => [
    { value: '', label: this.t()('option.selectState') },
    { value: 'ca', label: this.t()('option.california') },
    { value: 'ny', label: this.t()('option.newYork') },
    { value: 'tx', label: this.t()('option.texas') },
    { value: 'fl', label: this.t()('option.florida') },
    { value: 'il', label: this.t()('option.illinois') }
  ]);

  addressTypes = computed(() => [
    { value: 'home', label: this.t()('option.home') },
    { value: 'work', label: this.t()('option.work') },
    { value: 'other', label: this.t()('option.other') }
  ]);

  newsletterFrequencies = computed(() => [
    { value: 'daily', label: this.t()('option.daily') },
    { value: 'weekly', label: this.t()('option.weekly') },
    { value: 'monthly', label: this.t()('option.monthly') }
  ]);

  constructor() {
    // Add initial address
    this.addAddress();
  }

  // Check if country is USA
  isUSA(): boolean {
    return this.user.country === 'usa';
  }

  // Check if newsletter is subscribed
  isNewsletterSubscribed(): boolean {
    return this.user.newsletter;
  }

  // Add new address
  addAddress() {
    this.user.addresses.push({
      type: 'home',
      street: '',
      city: '',
      state: '',
      zipCode: ''
    });
    this.calculateProfileCompletion();
  }

  // Remove address
  removeAddress(index: number) {
    this.user.addresses.splice(index, 1);
    this.calculateProfileCompletion();
  }

  // Remove all addresses and reset to single empty
  removeAllAddresses() {
    this.user.addresses = [];
    this.addAddress();
    this.bulkAddressesAdded = false;
    this.calculateProfileCompletion();
  }

  // Async email validation is now handled by afsEmailExists directive

  // Custom password confirmation validator
  passwordsMatch(): boolean {
    return this.user.password === this.user.confirmPassword;
  }

  // Calculate password strength
  getPasswordStrength(): { score: number; label: string; color: string } {
    const password = this.user.password;
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
      return { score, label: this.t()('password.weak'), color: '#ff4444' };
    } else if (score <= 3) {
      return { score, label: this.t()('password.fair'), color: '#ffaa00' };
    } else if (score <= 4) {
      return { score, label: this.t()('password.good'), color: '#00aa00' };
    } else {
      return { score, label: this.t()('password.strong'), color: '#00aa00' };
    }
  }

  // Calculate profile completion percentage
  calculateProfileCompletion() {
    const fields = [
      this.user.name,
      this.user.email,
      this.user.password,
      this.user.confirmPassword,
      this.user.country
    ];

    const filledFields = fields.filter(field => field && field.toString().trim() !== '').length;
    
    // Add address completion
    const addressCompletion = this.user.addresses.length > 0 ? 
      this.user.addresses.reduce((acc, addr) => {
        const addrFields = [addr.street, addr.city, addr.zipCode];
        const filledAddrFields = addrFields.filter(field => field && field.trim() !== '').length;
        return acc + (filledAddrFields / addrFields.length);
      }, 0) / this.user.addresses.length : 0;

    this.profileCompletion = Math.round(((filledFields + addressCompletion) / (fields.length + 1)) * 100);
  }

  // Track changes to update completion
  onFieldChange() {
    this.calculateProfileCompletion();
  }

  onSubmit(form: any) {
    if (form.valid && this.passwordsMatch()) {
      this.submittedData = { ...this.user };
      console.log('Form submitted:', this.submittedData);
    }
  }

  // Bulk add or update 100 addresses for performance testing
  addOrUpdateHundredAddresses() {
    if (!this.bulkAddressesAdded) {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        this.addAddress();
      }
      const end = performance.now();
      console.log('add 1k address time: ', end - start);
      this.bulkAddressesAdded = true;
    } else {
      const total = this.user.addresses.length;
      const start = performance.now();
      for (let i = 0; i < total; i++) {
        const index = i + 1;
        const addr = this.user.addresses[i];
        this.user.addresses[i] = {
          ...addr,
          type: 'work',
          street: `Bulk Street ${index}`,
          city: `Bulk City ${index}`,
          state: '',
          zipCode: `${10000 + index}`
        };
      }
      const end = performance.now();
      console.log('add 1k address time: ', end - start);
    }
    this.calculateProfileCompletion();
  }
}
