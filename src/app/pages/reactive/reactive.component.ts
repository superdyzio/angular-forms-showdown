import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { EmailCheckService } from '../../services/email-check.service';
import { Address } from '../../types/address';
import { User } from '../../types/user';

@Component({
  selector: 'afs-reactive',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './reactive.component.html',
  styleUrl: './reactive.component.scss'
})
export class ReactiveComponent implements OnInit {
  userForm: FormGroup;
  submittedData: User | null = null;
  emailExists = false;
  emailCheckInProgress = false;
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

  constructor(private fb: FormBuilder, private emailCheck: EmailCheckService) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email], [this.emailExistsValidator.bind(this)]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordComplexityValidator]],
      confirmPassword: ['', Validators.required],
      country: ['', Validators.required],
      state: [''],
      newsletter: [false],
      newsletterFrequency: [''],
      addresses: this.fb.array([])
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    // Add initial address
    this.addAddress();
    
    // Subscribe to form changes to update completion
    this.userForm.valueChanges.subscribe(() => {
      this.calculateProfileCompletion();
    });
  }

  // Custom password complexity validator
  passwordComplexityValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /\d/.test(value);
    const hasSpecialChar = /[@$!%*?&]/.test(value);

    if (!hasUpperCase || !hasLowerCase || !hasNumeric || !hasSpecialChar) {
      return { passwordComplexity: true };
    }
    return null;
  }

  // Calculate password strength
  getPasswordStrength(): { score: number; label: string; color: string } {
    const password = this.userForm.get('password')?.value;
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

  // Cross-field password match validator
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else if (confirmPassword && confirmPassword.errors?.['passwordMismatch']) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    return null;
  }

  // Async email existence validator
  emailExistsValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    const email = control.value;
    if (!email || !email.includes('@')) {
      this.emailExists = false;
      return of(null);
    }
    this.emailCheckInProgress = true;
    return this.emailCheck.checkEmailExists(email).pipe(
      map(exists => {
        this.emailCheckInProgress = false;
        this.emailExists = exists;
        return exists ? { emailExists: true } : null;
      }),
      catchError(() => {
        this.emailCheckInProgress = false;
        return of(null);
      })
    );
  }

  // Get addresses FormArray
  get addresses(): FormArray {
    return this.userForm.get('addresses') as FormArray;
  }

  // Create address FormGroup
  createAddressFormGroup(): FormGroup {
    return this.fb.group({
      type: ['home'],
      street: [''],
      city: [''],
      state: [''],
      zipCode: ['']
    });
  }

  // Add new address
  addAddress() {
    this.addresses.push(this.createAddressFormGroup());
  }

  // Remove address
  removeAddress(index: number) {
    this.addresses.removeAt(index);
  }

  // Remove all addresses and reset to single empty
  removeAllAddresses() {
    while (this.addresses.length > 0) {
      this.addresses.removeAt(0);
    }
    this.addAddress();
    this.bulkAddressesAdded = false;
  }

  // Check if country is USA
  isUSA(): boolean {
    return this.userForm.get('country')?.value === 'usa';
  }

  // Check if newsletter is subscribed
  isNewsletterSubscribed(): boolean {
    return this.userForm.get('newsletter')?.value;
  }

  // Calculate profile completion percentage
  calculateProfileCompletion() {
    const formValue = this.userForm.value;
    const fields = [
      formValue.name,
      formValue.email,
      formValue.password,
      formValue.confirmPassword,
      formValue.country
    ];

    const filledFields = fields.filter(field => field && field.toString().trim() !== '').length;
    
    // Add address completion
    const addressCompletion = formValue.addresses && formValue.addresses.length > 0 ? 
      formValue.addresses.reduce((acc: number, addr: Address) => {
        const addrFields = [addr.street, addr.city, addr.zipCode];
        const filledAddrFields = addrFields.filter(field => field && field.trim() !== '').length;
        return acc + (filledAddrFields / addrFields.length);
      }, 0) / formValue.addresses.length : 0;

    this.profileCompletion = Math.round(((filledFields + addressCompletion) / (fields.length + 1)) * 100);
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.submittedData = this.userForm.value;
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
      const total = this.addresses.length;
      const start = performance.now();
      for (let i = 0; i < total; i++) {
        const index = i + 1;
        const group = this.addresses.at(i) as FormGroup;
        group.patchValue({
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
    this.calculateProfileCompletion();
  }
}
