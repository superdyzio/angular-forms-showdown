import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FormArray, FormControl } from '@angular/forms';
import { extractValue } from '@angular/forms/signals/compat';
import { CompatDemoComponent } from './compat-demo.component';

/**
 * Proof that the compatForm pattern shown on slide 22 actually works: a model mixing a
 * migrated signal field, a bridged Reactive FormControl, and a bridged Reactive FormArray.
 */
describe('CompatDemoComponent', () => {
  let component: CompatDemoComponent;
  let fixture: ComponentFixture<CompatDemoComponent>;

  // The form fields are protected — reach them the same way the signal-form spec does.
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const form = () => (component as any).form;
  const emailControl = () => (component as any).emailControl as FormControl<string>;
  const tags = () => (component as any).tags as FormArray<FormControl<string>>;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompatDemoComponent],
      providers: [provideRouter([]), provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompatDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('starts invalid (name + email both required)', () => {
      expect(form()().invalid()).toBe(true);
    });

    it('starts with no submitted data', () => {
      expect(component['submitted']()).toBeNull();
    });

    it('starts with no tags', () => {
      expect(tags().length).toBe(0);
    });
  });

  describe('name — migrated signal field (schema validators)', () => {
    it('is invalid when empty (required)', () => {
      expect(form().name().invalid()).toBe(true);
    });

    it('is invalid with a single character (minLength 2)', () => {
      form().name().value.set('J');
      expect(form().name().invalid()).toBe(true);
    });

    it('is valid with two or more characters', () => {
      form().name().value.set('Jo');
      expect(form().name().valid()).toBe(true);
    });
  });

  describe('email — bridged Reactive FormControl', () => {
    it('reads through the bridge: writing the control shows up on the field', () => {
      emailControl().setValue('read@bridge.com');
      expect(form().email().value()).toBe('read@bridge.com');
    });

    it('writes through the bridge: writing the field updates the control', () => {
      form().email().value.set('write@bridge.com');
      expect(emailControl().value).toBe('write@bridge.com');
    });

    it('propagates the control validators: invalid email keeps the form invalid', () => {
      form().name().value.set('Jane');
      emailControl().setValue('not-an-email');
      fixture.detectChanges();
      expect(form().email().invalid()).toBe(true);
      expect(form()().invalid()).toBe(true);
    });

    it('a valid email clears the email field error', () => {
      emailControl().setValue('jane@example.com');
      fixture.detectChanges();
      expect(form().email().valid()).toBe(true);
    });
  });

  describe('tags — bridged Reactive FormArray', () => {
    it('addTag() appends a control', () => {
      component.addTag();
      expect(tags().length).toBe(1);
    });

    it('removeTag() removes the control at the given index', () => {
      component.addTag();
      component.addTag();
      component.removeTag(0);
      expect(tags().length).toBe(1);
    });
  });

  describe('extractValue() unwraps the bridged control', () => {
    it('returns a plain string for the bridged FormControl', () => {
      form().name().value.set('Jane');
      emailControl().setValue('jane@example.com');
      fixture.detectChanges();

      const raw = extractValue(form());
      expect(raw).toEqual({ name: 'Jane', email: 'jane@example.com' });
    });
  });

  describe('onSubmit()', () => {
    it('does not submit while the form is invalid', () => {
      component.onSubmit();
      expect(component['submitted']()).toBeNull();
    });

    it('submits unwrapped values once every field is valid', () => {
      form().name().value.set('Jane Doe');
      emailControl().setValue('jane@example.com');
      component.addTag();
      tags().at(0).setValue('forms');
      fixture.detectChanges();

      component.onSubmit();

      expect(component['submitted']()).toEqual({
        name: 'Jane Doe',
        email: 'jane@example.com',
        tags: ['forms']
      });
    });
  });
});
