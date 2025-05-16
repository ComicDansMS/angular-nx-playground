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
import { FormFieldErrorComponent } from '@ngnx-playground/ui/components/form-field-error';
import { filter, Subject, takeUntil } from 'rxjs';

type InputType = 'text' | 'number' | 'email' | 'password';

@Component({
  selector: 'lib-input-form-field',
  template: `
    <div
      class="lib-input-form-field"
      [class.lib-input-form-field--focus]="!isFocused()"
      [class.lib-input-form-field--value]="!!value()"
      [class.lib-input-form-field--error]="!!errors()"
    >
      <div class="field">
        <label [for]="inputId()">
          {{ label() }}{{ isRequired() ? '*' : '' }}
        </label>

        <input
          [required]="isRequired()"
          [type]="type()"
          [id]="inputId()"
          [value]="value()"
          (input)="handleInput($any($event.target).value)"
          (blur)="handleBlur()"
          (focus)="handleFocus()"
          [disabled]="isDisabled()"
          [placeholder]="placeholder()"
        />
      </div>

      <lib-form-field-error
        [errors]="errors()"
        [customErrorMessages]="customErrorMessages()"
      />
    </div>
  `,
  styleUrl: 'input-form-field.style.css',
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

  type = input<InputType>('text');
  label = input.required<string>();
  placeholder = input<string>('');
  inputId = input.required<string>();
  customErrorMessages = input<Record<string, string>>();

  control: FormControl | null = null;
  value = signal<string>('');
  errors = signal<ValidationErrors | null>(null);
  isRequired = signal(false);
  isDisabled = signal(false);
  isFocused = signal(false);

  private $destroy = new Subject<void>();

  ngOnInit(): void {
    this.setFormControl();
    this.isRequired.set(!!this.control?.hasValidator(Validators.required));

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

  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
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
