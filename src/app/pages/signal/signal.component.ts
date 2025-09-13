import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface User {
  name: string;
  email: string;
  age: number | null;
  country: string;
  newsletter: boolean;
}

@Component({
  selector: 'afs-signal',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './signal.component.html',
  styleUrl: './signal.component.scss'
})
export class SignalComponent {
  // Form signals
  name = signal('');
  email = signal('');
  age = signal<number | null>(null);
  country = signal('');
  newsletter = signal(false);
  submittedData = signal<User | null>(null);

  // Computed validation signals
  nameError = computed(() => {
    const value = this.name();
    return value.length > 0 && value.length < 2;
  });

  emailError = computed(() => {
    const value = this.email();
    return value.length > 0 && !this.isValidEmail(value);
  });

  ageError = computed(() => {
    const value = this.age();
    return value !== null && (value < 18 || value > 100);
  });

  countryError = computed(() => {
    return this.country().length === 0;
  });

  // Computed error messages
  nameErrorMessage = computed(() => {
    const value = this.name();
    if (value.length === 0) return 'Name is required';
    if (value.length < 2) return 'Name must be at least 2 characters';
    return '';
  });

  emailErrorMessage = computed(() => {
    const value = this.email();
    if (value.length === 0) return 'Email is required';
    if (!this.isValidEmail(value)) return 'Please enter a valid email';
    return '';
  });

  ageErrorMessage = computed(() => {
    const value = this.age();
    if (value === null) return 'Age is required';
    if (value < 18) return 'Age must be at least 18';
    if (value > 100) return 'Age must be at most 100';
    return '';
  });

  countryErrorMessage = computed(() => {
    return 'Country is required';
  });

  // Computed form validity
  isFormValid = computed(() => {
    return this.name().length >= 2 &&
           this.email().length > 0 && this.isValidEmail(this.email()) &&
           this.age() !== null && this.age()! >= 18 && this.age()! <= 100 &&
           this.country().length > 0;
  });

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onNameChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.name.set(target.value);
  }

  onEmailChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.email.set(target.value);
  }

  onAgeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.age.set(value ? +value : null);
  }

  onCountryChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.country.set(target.value);
  }

  onNewsletterChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.newsletter.set(target.checked);
  }

  onSubmit() {
    if (this.isFormValid()) {
      const userData: User = {
        name: this.name(),
        email: this.email(),
        age: this.age(),
        country: this.country(),
        newsletter: this.newsletter()
      };
      
      this.submittedData.set(userData);
      console.log('Form submitted:', userData);
    }
  }
}
