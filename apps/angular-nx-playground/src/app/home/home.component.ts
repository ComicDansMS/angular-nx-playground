import { Component } from '@angular/core';
import { LibButtonDirective } from '@crm-project/ui/components/button';
import { LibCardDirective } from '@crm-project/ui/components/card';
import { LibFormFieldComponent } from '@crm-project/ui/components/form-field';
import { LibInputDirective } from '@crm-project/ui/components/input';
import { LibLabelDirective } from '@crm-project/ui/components/label';

import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-home',
  template: `
    <div class="flex flex-col gap-8 mt-8 w-96 mx-auto">
      <div libCard>
        <form [formGroup]="loginForm">
          <div class="flex flex-col gap-4">
            <lib-form-field>
              <label libLabel for="last-name">First name</label>
              <input
                libInput
                id="first-name"
                type="text"
                [size]="'full'"
                formControlName="firstName"
              />
            </lib-form-field>
            <lib-form-field class="w-full">
              <label libLabel for="last-name">Last name</label>
              <input
                libInput
                id="last-name"
                type="text"
                [size]="'full'"
                formControlName="lastName"
              />
            </lib-form-field>
            <lib-form-field>
              <label libLabel for="email">Email</label>
              <input
                libInput
                id="email"
                type="email"
                [size]="'full'"
                formControlName="email"
                placeholder="email@mail.com"
              />
            </lib-form-field>

            <button libButton [width]="'full'">Submit</button>
          </div>
        </form>
      </div>
    </div>
  `,
  imports: [
    LibLabelDirective,
    LibFormFieldComponent,
    LibInputDirective,
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
}
