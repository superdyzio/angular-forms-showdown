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
  template: `
    <div class="page-container">
      <div class="header">
        <a routerLink="/" class="back-button">← Back to Main</a>
        <h1>Signal-Based Forms</h1>
        <p>Forms using Angular signals for state management</p>
      </div>
      
      <div class="form-container">
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Name</label>
            <input 
              type="text" 
              id="name" 
              [value]="name()"
              (input)="onNameChange($event)"
              class="form-input"
              [class.error]="nameError()"
            />
            <div class="error-message" *ngIf="nameError()">
              {{ nameErrorMessage() }}
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              [value]="email()"
              (input)="onEmailChange($event)"
              class="form-input"
              [class.error]="emailError()"
            />
            <div class="error-message" *ngIf="emailError()">
              {{ emailErrorMessage() }}
            </div>
          </div>

          <div class="form-group">
            <label for="age">Age</label>
            <input 
              type="number" 
              id="age" 
              [value]="age()"
              (input)="onAgeChange($event)"
              class="form-input"
              [class.error]="ageError()"
            />
            <div class="error-message" *ngIf="ageError()">
              {{ ageErrorMessage() }}
            </div>
          </div>

          <div class="form-group">
            <label for="country">Country</label>
            <select 
              id="country" 
              [value]="country()"
              (change)="onCountryChange($event)"
              class="form-input"
              [class.error]="countryError()"
            >
              <option value="">Select a country</option>
              <option value="us">United States</option>
              <option value="uk">United Kingdom</option>
              <option value="ca">Canada</option>
              <option value="au">Australia</option>
              <option value="de">Germany</option>
            </select>
            <div class="error-message" *ngIf="countryError()">
              {{ countryErrorMessage() }}
            </div>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                [checked]="newsletter()"
                (change)="onNewsletterChange($event)"
                class="checkbox"
              />
              Subscribe to newsletter
            </label>
          </div>

          <button 
            type="submit" 
            class="submit-button"
            [disabled]="!isFormValid()"
          >
            Submit Form
          </button>
        </form>

        <div class="form-data" *ngIf="submittedData()">
          <h3>Submitted Data:</h3>
          <pre>{{ submittedData() | json }}</pre>
        </div>

        <div class="form-status">
          <h3>Form Status:</h3>
          <p><strong>Valid:</strong> {{ isFormValid() }}</p>
          <p><strong>Name:</strong> {{ name() || 'Empty' }}</p>
          <p><strong>Email:</strong> {{ email() || 'Empty' }}</p>
          <p><strong>Age:</strong> {{ age() || 'Empty' }}</p>
          <p><strong>Country:</strong> {{ country() || 'Empty' }}</p>
          <p><strong>Newsletter:</strong> {{ newsletter() ? 'Yes' : 'No' }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
      padding: 2rem;
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;
      color: white;
    }

    .back-button {
      display: inline-block;
      color: white;
      text-decoration: none;
      margin-bottom: 1rem;
      padding: 0.5rem 1rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 6px;
      transition: all 0.3s ease;
    }

    .back-button:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
    }

    h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      font-weight: 700;
    }

    p {
      font-size: 1.1rem;
      opacity: 0.9;
    }

    .form-container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #374151;
    }

    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    .form-input:focus {
      outline: none;
      border-color: #a855f7;
      box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
    }

    .form-input.error {
      border-color: #ef4444;
    }

    .error-message {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .checkbox {
      width: auto;
      margin: 0;
    }

    .submit-button {
      width: 100%;
      padding: 1rem;
      background: #a855f7;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .submit-button:hover:not(:disabled) {
      background: #7c3aed;
    }

    .submit-button:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    .form-data, .form-status {
      margin-top: 2rem;
      padding: 1rem;
      background: #f3f4f6;
      border-radius: 6px;
    }

    .form-data h3, .form-status h3 {
      margin-bottom: 1rem;
      color: #374151;
    }

    .form-data pre {
      background: white;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 0.875rem;
    }

    .form-status p {
      margin: 0.5rem 0;
      color: #374151;
    }

    @media (max-width: 768px) {
      .page-container {
        padding: 1rem;
      }
      
      h1 {
        font-size: 2rem;
      }
      
      .form-container {
        padding: 1.5rem;
      }
    }
  `]
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
