import { Component, effect } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { LibButtonDirective } from '@ngnx-playground/ui/components/button';
import { InputComponent } from '@ngnx-playground/input';
import { RadioFormFieldComponent } from '@ngnx-playground/ui/components/radio-form-field';
import { CardComponent } from '@ngnx-playground/ui/components/card';
import { DatePickerComponent } from '@ngnx-playground/ui/components/date-picker';

@Component({
  selector: 'app-home',
  template: `
    <div class="flex flex-col gap-8 mt-8 w-96 mx-auto">
      <lib-card>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="flex flex-col">
            <lib-input
              formControlName="firstName"
              [label]="'First name'"
              [id]="'firstName'"
              [customErrorMessages]="{
                required:
                  'You need a first name and a really long error message that will have to wrap because we wanted as much context as possible because that what makes the world a better place.'
              }"
              [background]="'var(--theme-color-background-surface)'"
            />
            <lib-input
              formControlName="lastName"
              [label]="'Last name'"
              [id]="'lastName'"
              [background]="'var(--theme-color-background-surface)'"
            />

            <lib-input
              formControlName="email"
              [label]="'Email'"
              [id]="'email'"
              [type]="'email'"
              [placeholder]="'you@mail.com'"
              [background]="'var(--theme-color-background-surface)'"
            />
            <lib-date-picker
              [id]="'dateOfBirth'"
              [background]="'var(--theme-color-background-surface)'"
            />
            <lib-input
              formControlName="password"
              [label]="'Password'"
              [id]="'password'"
              [type]="'password'"
              [background]="'var(--theme-color-background-surface)'"
            />
            <lib-input
              formControlName="repeatPassword"
              [label]="'Repeat password'"
              [id]="'repeatPassword'"
              [type]="'password'"
              [background]="'var(--theme-color-background-surface)'"
            />
            <lib-radio-form-field
              formControlName="addNotes"
              [label]="'Add notes'"
              [options]="[
                { label: 'No thanks', value: false },
                { label: 'Yes please', value: true }
              ]"
            />
            <div class="mt-3">
              <lib-input
                formControlName="notes"
                [label]="'Notes'"
                [id]="'notes'"
                [type]="'text'"
                [background]="'var(--theme-color-background-surface)'"
              />
            </div>

            <button libButton class="mt-2">Submit</button>
          </div>
        </form>
      </lib-card>
    </div>
  `,
  imports: [
    LibButtonDirective,
    ReactiveFormsModule,
    InputComponent,
    RadioFormFieldComponent,
    CardComponent,
    DatePickerComponent
  ]
})
export default class HomeComponent {
  fb = new FormBuilder();
  loginForm = this.fb.nonNullable.group({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]),
    repeatPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]),
    addNotes: new FormControl<boolean | null>(null, Validators.required),
    notes: new FormControl({ value: '', disabled: true })
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
