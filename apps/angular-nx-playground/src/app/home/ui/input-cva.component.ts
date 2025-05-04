import { Component, forwardRef, input, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import ControlValueAccessorDirective from './control-value-accessor.directive';
import { LibLabelDirective } from '@crm-project/ui/components/label';
import ValidationErrorsComponent from './validation-errors.component';

type InputType = 'text' | 'number' | 'email' | 'password';

@Component({
  selector: 'app-input-cva',
  template: `
    <div class="flex flex-col">
      @if (label !== undefined) {
      <label libLabel [for]="inputId()">{{ label() }}</label>
      }

      <input
        appControlValueAccessor
        [required]="isRequired"
        [type]="type()"
        [id]="inputId()"
        [formControl]="control"
        class="mt-1 border border-slate-600 rounded h-9 focus:outline-0 focus:border-slate-500 px-2"
      />

      <app-validation-errors
        [errors]="control.errors"
        [customErrorMessages]="errorMessages()"
      />
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputCvaComponent),
      multi: true,
    },
  ],
  imports: [
    ControlValueAccessorDirective,
    LibLabelDirective,
    ReactiveFormsModule,
    ValidationErrorsComponent,
  ],
})
export default class InputCvaComponent<
  T
> extends ControlValueAccessorDirective<T> {
  inputId = input.required<string>();
  label = input<string>();
  type = input<InputType>('text');

  errorMessages = signal({
    required: 'A custom error message',
  });

  constructor() {
    super();

    setTimeout(() => {
      this.errorMessages.set({ ...this.errorMessages, required: 'hello' });
    }, 1000);
  }
}
