import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TemplateEmailAsyncValidatorDirective } from './template-email-async.validator';
import { CommonModule } from '@angular/common';
import { Address } from '../../types/address';
import { User } from '../../types/user';

@Component({
  selector: 'afs-template',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, TemplateEmailAsyncValidatorDirective],
  templateUrl: './template.component.html',
  styleUrl: './template.component.scss'
})
export class TemplateComponent {
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
      return { score, label: 'Weak', color: '#ff4444' };
    } else if (score <= 3) {
      return { score, label: 'Fair', color: '#ffaa00' };
    } else if (score <= 4) {
      return { score, label: 'Good', color: '#00aa00' };
    } else {
      return { score, label: 'Strong', color: '#00aa00' };
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
      for (let i = 0; i < 100; i++) {
        this.addAddress();
      }
      this.bulkAddressesAdded = true;
    } else {
      const total = this.user.addresses.length;
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
    }
    this.calculateProfileCompletion();
  }
}
