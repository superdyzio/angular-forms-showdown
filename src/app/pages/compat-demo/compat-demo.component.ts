import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormField, required, minLength } from '@angular/forms/signals';
import { compatForm, extractValue } from '@angular/forms/signals/compat';

/**
 * Live proof for the "Incremental Migration with compatForm" slide.
 *
 * The model deliberately mixes:
 *   - `name`  — already migrated: a plain value validated by the Signal Forms schema
 *   - `email` — not yet migrated: a bridged Reactive `FormControl` (keeps its own validators)
 *
 * `compatForm` tolerates the Reactive control inside the model, both fields bind the same
 * way (`[formField]`), and `extractValue` unwraps the bridged control on submit.
 *
 * `tags` stays a plain Reactive `FormArray` *outside* the compat model — the "heavy bit you
 * migrate last". (Note: in 22.0.0 a bridged FormArray placed *inside* the model trips
 * `extractValue` — its array walker calls children without an isFieldTreeNode guard — so the
 * realistic staging is to leave the array Reactive and fold it in at submit.)
 * Reachable at /compat-demo — intentionally not part of the slide deck.
 */
interface CompatModel {
  name: string;
  email: FormControl<string>;
}

interface CompatSubmit {
  name: string;
  email: string;
  tags: string[];
}

@Component({
  selector: 'afs-compat-demo',
  standalone: true,
  imports: [CommonModule, RouterLink, FormField, ReactiveFormsModule],
  templateUrl: './compat-demo.component.html',
  styleUrl: './compat-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompatDemoComponent {
  // A Reactive control that has NOT been migrated yet — bridged into the model as-is.
  protected emailControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email]
  });

  // A heavy bit left entirely in Reactive land, alongside the compat form (migrate last).
  protected tags = new FormArray<FormControl<string>>([]);

  // The model signal mixes a migrated (plain) field and a not-yet-migrated Reactive control.
  protected model = signal<CompatModel>({
    name: '',
    email: this.emailControl
  });

  // compatForm bridges the Reactive control; the schema only governs migrated fields.
  protected form = compatForm(this.model, (p) => {
    required(p.name);
    minLength(p.name, 2);
  });

  protected submitted = signal<CompatSubmit | null>(null);

  addTag(): void {
    this.tags.push(new FormControl('', { nonNullable: true }));
  }

  removeTag(index: number): void {
    this.tags.removeAt(index);
  }

  onSubmit(): void {
    if (this.form().invalid() || this.tags.invalid) {
      return;
    }
    // extractValue unwraps the bridged control into raw values; the still-Reactive
    // tags array is read the Reactive way and folded in.
    const { name, email } = extractValue(this.form);
    this.submitted.set({ name, email, tags: this.tags.getRawValue() });
  }
}
