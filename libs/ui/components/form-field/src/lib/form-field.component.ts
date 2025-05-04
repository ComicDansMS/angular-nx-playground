import { Component, effect, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ControlValueAccessorDirective } from '@crm-project/ui/directives/control-value-accessor';
import { KeyValuePipe } from '@angular/common';

type InputType = 'text' | 'number' | 'email' | 'password';

@Component({
  selector: 'lib-form-field',
  template: `
    <div class="lib-form-field" [class.lib-form-field--value]="!!control.value">
      <label [for]="inputId()">{{ label() }}</label>

      <input
        [required]="isRequired"
        [type]="type()"
        [id]="inputId()"
        [formControl]="control"
        class="mt-1 border border-slate-600 rounded h-9 focus:outline-0 focus:border-slate-500 px-2"
      />
    </div>

    <div class="h-6">
      @if (control.errors && control.touched) { @for (error of control.errors |
      keyvalue; track $index) {
      <span class="text-red-400 text-[12px]">{{
        errorMessages[error.key]
      }}</span>
      } }
    </div>
  `,
  styles: `
    .lib-form-field {
      position: relative;
    }

    .lib-form-field:has(input[disabled]) {
      opacity: 0.25;
    }

    .lib-form-field input {
      padding: 1.375rem 0.75rem 0.5rem 0.75rem;
      height: 2.8125rem;
      width: 100%;
    }

    .lib-form-field input::placeholder {
      transition: opacity 100ms;
    }

    .lib-form-field:not(:focus-within) {
      input::placeholder {
        opacity: 0;
      }
    }

    .lib-form-field label {
      position: absolute;
      z-index: -1;
      top: 1em;
      left: 0.75rem;
      letter-spacing: 0.04rem;
      font-size: 1rem;
      transition: all 200ms;
      opacity: 0.5;
    }

    .lib-form-field:focus-within label,
    .lib-form-field--value label {
      top: 0.85em;
      transform: translateY(0);
      font-size: 0.625rem;
    }
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LibFormFieldComponent),
      multi: true,
    },
  ],
  imports: [ReactiveFormsModule, KeyValuePipe],
})
export class LibFormFieldComponent<T> extends ControlValueAccessorDirective<T> {
  inputId = input.required<string>();
  label = input.required<string>();
  type = input<InputType>('text');
  customErrorMessages = input<Record<string, string>>();

  errorMessages: Record<string, string> = {
    required: 'This field is required',
    email: 'Not a valid email address',
    minlength: 'This field has a min length',
  };

  customErrorMessagesEffect = effect(() => {
    if (this.customErrorMessages()) {
      this.errorMessages = {
        ...this.errorMessages,
        ...this.customErrorMessages(),
      };
    }
  });
}
