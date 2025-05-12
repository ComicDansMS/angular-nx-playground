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
import { filter, Subject, takeUntil } from 'rxjs';

type InputType = 'text' | 'number' | 'email' | 'password';

@Component({
  selector: 'lib-input-form-field',
  template: `
    <div
      class="lib-input-form-field"
      [class.lib-input-form-field--has-value]="!!value()"
      [class.lib-input-form-field--focus]="!!isFocused()"
    >
      <div class="field">
        <label [for]="inputId()"
          >{{ label() }}{{ isRequired ? '*' : '' }}</label
        >

        <input
          [required]="isRequired"
          [type]="type()"
          [id]="inputId()"
          [value]="value()"
          (input)="handleInput($any($event.target).value)"
          (blur)="handleBlur()"
          (focus)="handleFocus()"
          [disabled]="isDisabled()"
        />
      </div>

      <lib-form-field-error
        [errors]="errors()"
        [customErrorMessages]="customErrorMessages()"
      />
    </div>
  `,
  styles: `
    .lib-input-form-field {
      --field-padding-x: 0.75rem;
      margin-bottom: 0.5rem;
    }

    .field {
      position: relative;
      border: solid 1px #666a79;
    }

    .lib-input-form-field--focus .field {
      border-color: #b8bfdc;
      color: #b8bfdc;
    }

    label {
      --label-padding: 0.12rem;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: calc(var(--field-padding-x) - var(--label-padding));
      padding: 0 var(--label-padding);
      background: var(--theme-color-background-primary);
      transition: all 200ms;
    }

    .lib-input-form-field:focus-within label,
    .lib-input-form-field.lib-input-form-field--has-value label {
      top: -0.9em;
      transform: translateY(0);
      font-size: 0.75rem;
    }

    input {
      padding: 0.6rem var(--field-padding-x);
      width: 100%;
    }

    input:focus {
      outline: none;
    }

    .lib-input-form-field:has(input[disabled]) {
      opacity: 0.25;
      pointer-events: none;
    }

    input::placeholder {
      transition: opacity 100ms;
    }

    .lib-input-form-field:not(:focus-within) {
      input::placeholder {
        opacity: 0;
      }
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
  isFocused = signal(false);

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

  handleFocus(): void {
    this.isFocused.set(true);
  }

  handleBlur(): void {
    this.onTouched();
    this.isFocused.set(false);
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
