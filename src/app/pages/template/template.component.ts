import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'afs-template',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './template.component.html',
  styleUrl: './template.component.scss'
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
