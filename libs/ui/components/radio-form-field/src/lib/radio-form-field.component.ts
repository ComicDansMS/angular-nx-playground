/* eslint-disable @typescript-eslint/no-empty-function */
// radio-form-field.component.ts
import {
  Component,
  forwardRef,
  Injector,
  OnInit,
  signal,
  ChangeDetectionStrategy,
  inject,
  input,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
  Validators,
  FormsModule,
  ValidationErrors,
} from '@angular/forms';
import { FormFieldErrorComponent } from '@crm-project/ui/components/form-field-error';
import { Subject } from 'rxjs';

export interface RadioOption {
  label: string;
  value: any;
  default?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'lib-radio-form-field',
  imports: [FormsModule, FormFieldErrorComponent],
  template: `
    <fieldset
      class="lib-radio-form-field-fieldset"
      [class.disabled]="isDisabled()"
    >
      <legend class="lib-radio-form-field-legend">
        {{ label() }}{{ isRequired() ? '*' : '' }}
      </legend>
      @for (option of options(); track option.value; let i = $index) {
      <div class="lib-radio-option">
        <input
          type="radio"
          [id]="groupId + '-' + i"
          [name]="groupId"
          [value]="option.value"
          [checked]="option.value === selectedValue()"
          [disabled]="isDisabled() || option.disabled"
          (change)="onRadioChange(option.value)"
          (blur)="onBlur()"
        />
        <label [for]="groupId + '-' + i">{{ option.label }}</label>
      </div>
      }
    </fieldset>
    <div class="mb-1">
      <!-- <lib-form-field-error
        [errors]="controlDir?.errors"
        [customErrorMessages]="customErrorMessages()"
      /> -->
    </div>
  `,
  styles: [
    `
      .lib-radio-form-field-fieldset.disabled {
        opacity: 0.5;
        pointer-events: none;
      }
      .lib-radio-form-field-fieldset {
        border: none;
        padding: 0;
        margin: 0;
      }
      .lib-radio-form-field-legend {
        /* Add your legend styles */
        margin-bottom: 0.5rem;
        font-weight: bold;
      }
      .lib-radio-option {
        display: flex;
        align-items: center;
        margin-bottom: 0.25rem;
      }
      .lib-radio-option input[type='radio'] {
        margin-right: 0.5rem;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioFormFieldComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioFormFieldComponent implements ControlValueAccessor, OnInit {
  private _injector = inject(Injector);
  public controlDir: NgControl | null = null;

  label = input.required<string>();
  options = input.required<RadioOption[]>();
  customErrorMessages = input<Record<string, string>>();

  selectedValue = signal<boolean | null>(null);
  isDisabled = signal(false);
  isRequired = signal(false);
  errors = signal<ValidationErrors | null>(null);
  $destroy = new Subject<void>();

  private static nextId = 0;
  groupId = `radio-group-${RadioFormFieldComponent.nextId++}`;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.controlDir = this._injector.get(NgControl, null);

    if (this.controlDir) {
      this.controlDir.valueAccessor = this;

      if (this.controlDir.control?.hasValidator(Validators.required)) {
        this.isRequired.set(true);
      }
    }
  }

  writeValue(value: boolean): void {
    this.selectedValue.set(value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabledInput: boolean): void {
    this.isDisabled.set(isDisabledInput);
  }

  onRadioChange(value: boolean): void {
    this.selectedValue.set(value);
    this.onChange(value);
    this.onTouched();
  }

  onBlur(): void {
    this.onTouched();
  }
}
