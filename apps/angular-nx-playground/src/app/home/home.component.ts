import { Component } from '@angular/core';
import { LibButtonDirective } from '@crm-project/ui/components/button';
import { LibCardDirective } from '@crm-project/ui/components/card';
import { LibInputFormFieldComponent } from '@crm-project/ui/components/input-form-field';

import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { tap } from 'rxjs';

@Component({
  selector: 'app-home',
  template: `
    <div class="flex flex-col gap-8 mt-8 w-96 mx-auto">
      <div libCard>
        <form [formGroup]="loginForm">
          <div class="flex flex-col gap-4">
            <lib-input-form-field
              formControlName="firstName"
              [label]="'First name'"
            />
            <lib-input-form-field
              formControlName="lastName"
              [label]="'Last name'"
            />
            <lib-input-form-field
              formControlName="email"
              placeholder="email@mail.com"
              [label]="'Email'"
            />

            <button libButton [width]="'full'">Submit</button>
          </div>
        </form>
      </div>
    </div>
  `,
  imports: [
    LibInputFormFieldComponent,
    LibButtonDirective,
    LibCardDirective,
    ReactiveFormsModule,
  ],
})
export default class HomeComponent {
  fb = new FormBuilder();
  loginForm = this.fb.nonNullable.group({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
  });

  constructor() {
    this.loginForm.valueChanges
      .pipe(tap((value) => console.log(value)))
      .subscribe();
  }
}
