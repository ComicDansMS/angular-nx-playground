import { Component, effect } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { LibButtonDirective } from '@ngnx-playground/ui/components/button';
import { InputComponent } from '@ngnx-playground/input';
import { CardComponent } from '@ngnx-playground/ui/components/card';
import { RadioGroupComponent } from '@ngnx-playground/radio-group';
import { InputFormFieldComponent } from '@ngnx-playground/ui/components/input-form-field';

@Component({
  selector: 'app-home',
  template: `
    <div class="flex flex-col gap-8 mt-8 w-96 mx-auto">
      <lib-card>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="flex flex-col gap-[var(--theme-space-md)]">
            <lib-input-form-field
              [control]="loginForm.controls.firstName"
              [label]="'First name'"
              [background]="'var(--theme-color-background-surface)'"
            />
            <lib-input-form-field
              [control]="loginForm.controls.lastName"
              [label]="'Last name'"
              [background]="'var(--theme-color-background-surface)'"
            />
            <lib-input-form-field
              [control]="loginForm.controls.email"
              [label]="'Email'"
              [placeholder]="'you@mail.com'"
              [background]="'var(--theme-color-background-surface)'"
            />
            <lib-input-form-field
              [control]="loginForm.controls.password"
              [type]="'password'"
              [label]="'Password'"
              [background]="'var(--theme-color-background-surface)'"
            />
            <lib-input-form-field
              [control]="loginForm.controls.repeatPassword"
              [type]="'password'"
              [label]="'Repeat password'"
              [background]="'var(--theme-color-background-surface)'"
            />
            <div class="mt-1">
              <lib-radio-form-field
                formControlName="addNotes"
                [label]="'Add notes'"
                [options]="[
                { label: 'No thanks', value: false },
                { label: 'Yes please', value: true }
              ]"
                [background]="'var(--theme-color-background-surface)'"
              />
            </div>
            <lib-input-form-field
              [control]="loginForm.controls.notes"
              [label]="'Notes'"
              [background]="'var(--theme-color-background-surface)'"
            />

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
    CardComponent,
    RadioGroupComponent,
    InputFormFieldComponent
  ]
})
export default class HomeComponent {
  fb = new FormBuilder();
  loginForm = this.fb.nonNullable.group({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl(''),
    email: new FormControl('anExisting@value.com', [Validators.required, Validators.email]),
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

  // constructor() {
  //   this.loginForm.valueChanges.subscribe((value) => console.log(value));
  // }
}
