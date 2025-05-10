import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlValueAccessorDirective } from '@crm-project/ui/directives/control-value-accessor';
import { FormFieldErrorComponent } from '@crm-project/ui/components/form-field-error';

type InputType = 'text' | 'number' | 'email' | 'password';

@Component({
  selector: 'lib-input-form-field',
  template: `
    <div
      class="lib-input-form-field"
      [class.lib-input-form-field--has-value]="!!value()"
    >
      <label [for]="inputId()">{{ label() }}{{ isRequired ? '*' : '' }}</label>

      <input
        [required]="isRequired"
        [type]="type()"
        [id]="inputId()"
        [value]="value()"
        (input)="handleInputValueChange($any($event.target).value)"
        (blur)="handleInputBlur()"
        [disabled]="isDisabled()"
        class="mt-1 border border-slate-600 rounded h-9 focus:outline-0 focus:border-slate-500 px-2"
      />

      <div class="mb-1">
        <lib-form-field-error
          [errors]="errors()"
          [customErrorMessages]="customErrorMessages()"
        />
      </div>
    </div>
  `,
  styles: `
    .lib-input-form-field {
      position: relative;
    }

    .lib-input-form-field:has(input[disabled]) {
      opacity: 0.25;
      pointer-events: none;
    }

    .lib-input-form-field input {
      padding: 1.375rem 0.75rem 0.5rem 0.75rem;
      height: 2.8125rem;
      width: 100%;
    }

    .lib-input-form-field input::placeholder {
      transition: opacity 100ms;
    }

    .lib-input-form-field:not(:focus-within) {
      input::placeholder {
        opacity: 0;
      }
    }

    .lib-input-form-field label {
      position: absolute;
      z-index: -1;
      top: 1em;
      left: 0.75rem;
      letter-spacing: 0.04rem;
      font-size: 1rem;
      transition: all 200ms;
      opacity: 0.5;
    }

    .lib-input-form-field:focus-within label,
    .lib-input-form-field--has-value label {
      top: 0.85em;
      transform: translateY(0);
      font-size: 0.625rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
  imports: [ReactiveFormsModule, FormFieldErrorComponent],
})
export class InputFormFieldComponent extends ControlValueAccessorDirective {
  inputId = input.required<string>();
  label = input.required<string>();
  type = input<InputType>('text');
  customErrorMessages = input<Record<string, string>>();
}
