import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'afs-reactive',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './reactive.component.html',
  styleUrl: './reactive.component.scss'
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
