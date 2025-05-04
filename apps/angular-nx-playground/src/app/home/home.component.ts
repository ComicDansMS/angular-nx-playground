import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LibButtonDirective } from '@crm-project/ui/components/button';
import { LibCardDirective } from '@crm-project/ui/components/card';
import { LibFormFieldComponent } from '@crm-project/ui/components/form-field';

@Component({
  selector: 'app-home',
  template: `
    <div class="flex flex-col gap-8 mt-8 w-96 mx-auto">
      <div libCard>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="flex flex-col">
            <lib-form-field
              formControlName="firstName"
              [label]="'First name'"
              [inputId]="'firstName'"
            />
            <lib-form-field
              formControlName="lastName"
              [label]="'Last name'"
              [inputId]="'lastName'"
            />
            <lib-form-field
              formControlName="email"
              [label]="'Email'"
              [inputId]="'email'"
              [type]="'email'"
            />
            <lib-form-field
              formControlName="password"
              [label]="'Password'"
              [inputId]="'password'"
              [type]="'password'"
            />
            <lib-form-field
              formControlName="repeatPassword"
              [label]="'Repeat password'"
              [inputId]="'repeatPassword'"
              [type]="'password'"
            />

            <button libButton [width]="'full'">Submit</button>
          </div>
        </form>
      </div>
    </div>
  `,
  imports: [
    LibButtonDirective,
    LibCardDirective,
    ReactiveFormsModule,
    LibFormFieldComponent,
  ],
})
export default class HomeComponent {
  fb = new FormBuilder();
  loginForm = this.fb.nonNullable.group({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    repeatPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      console.log('login form invalid');
      this.loginForm.markAllAsTouched();
      return;
    }

    console.log('login form valid');
    console.log(this.loginForm.value);
  }
}
