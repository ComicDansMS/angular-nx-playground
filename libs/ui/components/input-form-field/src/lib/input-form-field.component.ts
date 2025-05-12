import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  Injector,
  input,
  OnInit,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  NgControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { FormFieldErrorComponent } from '@crm-project/ui/components/form-field-error';
import { filter, Subject, takeUntil, tap } from 'rxjs';

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
        (input)="handleInput($any($event.target).value)"
        (blur)="handleBlur()"
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
    .lib-input-form-field.lib-input-form-field--has-value label {
      top: 0.85em;
      transform: translateY(0);
      font-size: 0.625rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFormFieldComponent),
      multi: true,
    },
  ],
  imports: [ReactiveFormsModule, FormFieldErrorComponent],
})
export class InputFormFieldComponent implements ControlValueAccessor, OnInit {
  private injector = inject(Injector);

  control: FormControl | null = null;
  inputId = input.required<string>();
  label = input.required<string>();
  type = input<InputType>('text');
  customErrorMessages = input<Record<string, string>>();
  value = signal<string>('');
  errors = signal<ValidationErrors | null>(null);
  isRequired = false;
  isDisabled = signal(false);

  private $destroy = new Subject<void>();

  ngOnInit(): void {
    this.setFormControl();
    this.isRequired = !!this.control?.hasValidator(Validators.required);

    // Catch control updates made by submit calling
    // markAllAsTouched() when form not valid
    if (this.control) {
      this.control.events
        .pipe(
          takeUntil(this.$destroy),
          filter((value) => value.source.pristine && value.source.touched)
        )
        .subscribe(() => this.updateErrors());
    }
  }

  setFormControl() {
    try {
      const formControl = this.injector.get(NgControl);

      switch (formControl.constructor) {
        case FormControlName:
          this.control = this.injector
            .get(FormGroupDirective)
            .getControl(formControl as FormControlName);
          break;
        default:
          this.control = (formControl as FormControlDirective)
            .form as FormControl;
      }
    } catch (err) {
      this.control = new FormControl();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (value: string) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};

  writeValue(value: string): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  handleInput(value: string): void {
    const processedValue = value.trim().replace(/\s\s+/g, ' ');
    this.value.set(value);
    this.onChange(processedValue);
  }

  handleBlur(): void {
    this.onTouched();
    this.updateErrors();
  }

  updateErrors(): void {
    if (this.control?.invalid) {
      this.errors.set(this.control.errors || null);
    } else {
      this.errors.set(null);
    }
  }
}
