import { Component, effect } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LibButtonDirective } from '@ngnx-playground/ui/components/button';
import { LibCardDirective } from '@ngnx-playground/ui/components/card';
import { InputFormFieldComponent } from '@ngnx-playground/ui/components/input-form-field';
import { RadioFormFieldComponent } from '@ngnx-playground/ui/components/radio-form-field';

@Component({
  selector: 'app-home',
  template: `
    <div class="flex flex-col gap-8 mt-8 w-96 mx-auto">
      <div libCard>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="flex flex-col">
            <lib-input-form-field
              formControlName="firstName"
              [label]="'First name'"
              [inputId]="'firstName'"
              [customErrorMessages]="{ required: 'You need a first name' }"
              [background]="'var(--theme-color-neutral-50)'"
            />
            <lib-input-form-field
              formControlName="lastName"
              [label]="'Last name'"
              [inputId]="'lastName'"
              [background]="'var(--theme-color-neutral-50)'"
            />
            <lib-input-form-field
              formControlName="email"
              [label]="'Email'"
              [inputId]="'email'"
              [type]="'email'"
              [placeholder]="'you@mail.com'"
              [background]="'var(--theme-color-neutral-50)'"
            />
            <lib-input-form-field
              formControlName="password"
              [label]="'Password'"
              [inputId]="'password'"
              [type]="'password'"
              [background]="'var(--theme-color-neutral-50)'"
            />
            <lib-input-form-field
              formControlName="repeatPassword"
              [label]="'Repeat password'"
              [inputId]="'repeatPassword'"
              [type]="'password'"
              [background]="'var(--theme-color-neutral-50)'"
            />

            <lib-radio-form-field
              formControlName="addNotes"
              [label]="'Add notes'"
              [options]="[
                { label: 'No thanks', value: false },
                { label: 'Yes please', value: true }
              ]"
            />

            <lib-input-form-field
              formControlName="notes"
              [label]="'Notes'"
              [inputId]="'notes'"
              [type]="'text'"
            />

            <button libButton class="mt-8">Submit</button>
          </div>
        </form>
      </div>
    </div>
  `,
  imports: [
    LibButtonDirective,
    LibCardDirective,
    ReactiveFormsModule,
    InputFormFieldComponent,
    RadioFormFieldComponent,
  ],
})
export default class HomeComponent {
  fb = new FormBuilder();
  loginForm = this.fb.nonNullable.group({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    repeatPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    addNotes: new FormControl<boolean | null>(null, Validators.required),
    notes: new FormControl({ value: '', disabled: true }),
  });

  enableNotes = effect(() => {
    this.loginForm.controls.addNotes.valueChanges.subscribe((enableNotes) =>
      enableNotes
        ? this.loginForm.controls.notes.enable()
        : this.loginForm.controls.notes.disable()
    );
  });

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('form valid');
    } else {
      console.log('form not valid');
      this.loginForm.markAllAsTouched();
    }
  }

  constructor() {
    this.loginForm.valueChanges.subscribe((value) => console.log(value));
  }
}
