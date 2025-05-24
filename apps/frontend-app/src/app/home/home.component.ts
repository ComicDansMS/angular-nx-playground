import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LibButtonDirective } from '@ngnx-playground/ui/components/button';
import { CardComponent } from '@ngnx-playground/ui/components/card';
import { InputFormFieldComponent } from '@ngnx-playground/ui/components/input-form-field';

@Component({
  selector: 'app-home',
  imports: [
    LibButtonDirective,
    ReactiveFormsModule,
    CardComponent,
    InputFormFieldComponent,
  ],
  template: `
    <div class="flex flex-col gap-8 mt-8 w-96 mx-auto">
      <lib-card>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="flex flex-col gap-[var(--theme-space-md)]">
            <lib-input-form-field
              [control]="loginForm.controls.firstName"
              [label]="'First name'"
              [background]="'var(--theme-color-background-surface)'"
              [type]="'text'"
            />

            <lib-input-form-field
              [control]="loginForm.controls.lastName"
              [label]="'Last name'"
              [background]="'var(--theme-color-background-surface)'"
              [type]="'text'"
            />

            <lib-input-form-field
              [control]="loginForm.controls.email"
              [label]="'Email'"
              [background]="'var(--theme-color-background-surface)'"
              [type]="'text'"
            />

            <button libButton class="mt-2">Submit</button>
          </div>
        </form>
      </lib-card>
    </div>
  `,
})
export default class HomeComponent {
  fb = new FormBuilder();
  loginForm = this.fb.nonNullable.group({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('form valid');
    } else {
      console.log('form not valid');
      this.loginForm.markAllAsTouched();
    }
  }
}
