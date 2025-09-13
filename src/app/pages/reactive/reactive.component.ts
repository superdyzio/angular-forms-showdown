import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'afs-reactive',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  template: `
    <div class="page-container">
      <div class="header">
        <a routerLink="/" class="back-button">← Back to Main</a>
        <h1>Reactive Forms</h1>
        <p>Forms using FormControl, FormGroup, and reactive patterns</p>
      </div>
      
      <div class="form-container">
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Name</label>
            <input 
              type="text" 
              id="name" 
              formControlName="name"
              class="form-input"
              [class.error]="userForm.get('name')?.invalid && userForm.get('name')?.touched"
            />
            <div class="error-message" *ngIf="userForm.get('name')?.invalid && userForm.get('name')?.touched">
              <span *ngIf="userForm.get('name')?.errors?.['required']">Name is required</span>
              <span *ngIf="userForm.get('name')?.errors?.['minlength']">Name must be at least 2 characters</span>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email"
              class="form-input"
              [class.error]="userForm.get('email')?.invalid && userForm.get('email')?.touched"
            />
            <div class="error-message" *ngIf="userForm.get('email')?.invalid && userForm.get('email')?.touched">
              <span *ngIf="userForm.get('email')?.errors?.['required']">Email is required</span>
              <span *ngIf="userForm.get('email')?.errors?.['email']">Please enter a valid email</span>
            </div>
          </div>

          <div class="form-group">
            <label for="age">Age</label>
            <input 
              type="number" 
              id="age" 
              formControlName="age"
              class="form-input"
              [class.error]="userForm.get('age')?.invalid && userForm.get('age')?.touched"
            />
            <div class="error-message" *ngIf="userForm.get('age')?.invalid && userForm.get('age')?.touched">
              <span *ngIf="userForm.get('age')?.errors?.['required']">Age is required</span>
              <span *ngIf="userForm.get('age')?.errors?.['min']">Age must be at least 18</span>
              <span *ngIf="userForm.get('age')?.errors?.['max']">Age must be at most 100</span>
            </div>
          </div>

          <div class="form-group">
            <label for="country">Country</label>
            <select 
              id="country" 
              formControlName="country"
              class="form-input"
              [class.error]="userForm.get('country')?.invalid && userForm.get('country')?.touched"
            >
              <option value="">Select a country</option>
              <option value="us">United States</option>
              <option value="uk">United Kingdom</option>
              <option value="ca">Canada</option>
              <option value="au">Australia</option>
              <option value="de">Germany</option>
            </select>
            <div class="error-message" *ngIf="userForm.get('country')?.invalid && userForm.get('country')?.touched">
              <span *ngIf="userForm.get('country')?.errors?.['required']">Country is required</span>
            </div>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                formControlName="newsletter"
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

        <div class="form-status">
          <h3>Form Status:</h3>
          <p><strong>Valid:</strong> {{ userForm.valid }}</p>
          <p><strong>Pristine:</strong> {{ userForm.pristine }}</p>
          <p><strong>Touched:</strong> {{ userForm.touched }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
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
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .submit-button:hover:not(:disabled) {
      background: #1d4ed8;
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
export class ReactiveComponent {
  userForm: FormGroup;
  submittedData: any = null;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      age: [null, [Validators.required, Validators.min(18), Validators.max(100)]],
      country: ['', Validators.required],
      newsletter: [false]
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.submittedData = this.userForm.value;
      console.log('Form submitted:', this.submittedData);
    }
  }
}
