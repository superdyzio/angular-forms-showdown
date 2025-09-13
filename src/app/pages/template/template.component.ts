import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'afs-template',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  template: `
    <div class="page-container">
      <div class="header">
        <a routerLink="/" class="back-button">← Back to Main</a>
        <h1>Template-Driven Forms</h1>
        <p>Forms using template directives and two-way binding</p>
      </div>
      
      <div class="form-container">
        <form #userForm="ngForm" (ngSubmit)="onSubmit(userForm)">
          <div class="form-group">
            <label for="name">Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              [(ngModel)]="user.name" 
              #name="ngModel"
              required 
              minlength="2"
              class="form-input"
              [class.error]="name.invalid && name.touched"
            />
            <div class="error-message" *ngIf="name.invalid && name.touched">
              <span *ngIf="name.errors?.['required']">Name is required</span>
              <span *ngIf="name.errors?.['minlength']">Name must be at least 2 characters</span>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              [(ngModel)]="user.email" 
              #email="ngModel"
              required 
              email
              class="form-input"
              [class.error]="email.invalid && email.touched"
            />
            <div class="error-message" *ngIf="email.invalid && email.touched">
              <span *ngIf="email.errors?.['required']">Email is required</span>
              <span *ngIf="email.errors?.['email']">Please enter a valid email</span>
            </div>
          </div>

          <div class="form-group">
            <label for="age">Age</label>
            <input 
              type="number" 
              id="age" 
              name="age" 
              [(ngModel)]="user.age" 
              #age="ngModel"
              required 
              min="18"
              max="100"
              class="form-input"
              [class.error]="age.invalid && age.touched"
            />
            <div class="error-message" *ngIf="age.invalid && age.touched">
              <span *ngIf="age.errors?.['required']">Age is required</span>
              <span *ngIf="age.errors?.['min']">Age must be at least 18</span>
              <span *ngIf="age.errors?.['max']">Age must be at most 100</span>
            </div>
          </div>

          <div class="form-group">
            <label for="country">Country</label>
            <select 
              id="country" 
              name="country" 
              [(ngModel)]="user.country" 
              #country="ngModel"
              required
              class="form-input"
              [class.error]="country.invalid && country.touched"
            >
              <option value="">Select a country</option>
              <option value="us">United States</option>
              <option value="uk">United Kingdom</option>
              <option value="ca">Canada</option>
              <option value="au">Australia</option>
              <option value="de">Germany</option>
            </select>
            <div class="error-message" *ngIf="country.invalid && country.touched">
              <span *ngIf="country.errors?.['required']">Country is required</span>
            </div>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                name="newsletter" 
                [(ngModel)]="user.newsletter"
                class="checkbox"
              />
              Subscribe to newsletter
            </label>
          </div>

          <button 
            type="submit" 
            class="submit-button"
            [disabled]="userForm.invalid"
          >
            Submit Form
          </button>
        </form>

        <div class="form-data" *ngIf="submittedData">
          <h3>Submitted Data:</h3>
          <pre>{{ submittedData | json }}</pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
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
      border-color: #22c55e;
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
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
      background: #22c55e;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .submit-button:hover:not(:disabled) {
      background: #16a34a;
    }

    .submit-button:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    .form-data {
      margin-top: 2rem;
      padding: 1rem;
      background: #f3f4f6;
      border-radius: 6px;
    }

    .form-data h3 {
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
export class TemplateComponent {
  user = {
    name: '',
    email: '',
    age: null as number | null,
    country: '',
    newsletter: false
  };

  submittedData: any = null;

  onSubmit(form: any) {
    if (form.valid) {
      this.submittedData = { ...this.user };
      console.log('Form submitted:', this.submittedData);
    }
  }
}
