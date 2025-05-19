import {
  Component,
  forwardRef,
  Injector,
  OnInit,
  signal,
  ChangeDetectionStrategy,
  inject,
  input,
  computed
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
  Validators,
  FormsModule,
  ValidationErrors,
  FormControl,
  FormControlName,
  FormGroupDirective,
  FormControlDirective
} from '@angular/forms';
import { FormFieldErrorComponent } from '@ngnx-playground/ui/components/form-field-error';
import { filter, Subject, takeUntil } from 'rxjs';

export interface RadioOption {
  label: string;
  value: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'lib-radio-form-field',
  imports: [FormsModule, FormFieldErrorComponent],
  template: `
    <fieldset
      class="lib-radio-form-field"
      [class.disabled]="isDisabled()"
      [class.lib-radio-form-field--error]="!!errors()"
    >
      <legend class="lib-radio-form-field-legend">
        {{ label() }}{{ isRequired() ? '*' : '' }}
      </legend>
      @for (option of options(); track option.value) {
        <div class="lib-radio-option">
          <input
            type="radio"
            [id]="inputId(option.label)"
            [name]="option.label"
            [value]="option.value"
            [checked]="option.value === selectedValue()"
            [disabled]="isDisabled() || option.disabled"
            (change)="handleChange(option.value)"
            (blur)="handleBlur()"
          />
          <label [for]="inputId(option.label)">{{ option.label }}</label>
        </div>
      }

      <lib-form-field-error
        [errors]="errors()"
        [customErrorMessages]="customErrorMessages()"
      />
    </fieldset>
  `,
  styleUrl: 'radio-form-field.style.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioFormFieldComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioFormFieldComponent implements ControlValueAccessor, OnInit {
  private injector = inject(Injector);

  label = input.required<string>();
  options = input.required<RadioOption[]>();
  customErrorMessages = input<Record<string, string> | null>(null);

  control: FormControl | null = null;
  selectedValue = signal<boolean | null>(null);
  errors = signal<ValidationErrors | null>(null);
  isRequired = signal<boolean>(false);
  isDisabled = signal<boolean>(false);
  isFocused = signal(false);
  groupId = computed(() => this.camelCase(this.label()));

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
  onChange = (value: boolean) => {
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {
  };

  writeValue(value: boolean): void {
    this.selectedValue.set(value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  handleChange(value: boolean): void {
    this.selectedValue.set(value);
    this.onChange(value);
    this.onTouched();
    this.updateErrors();
  }

  handleFocus(): void {
    this.isFocused.set(true);
  }

  handleBlur(): void {
    this.onTouched();
  }

  updateErrors(): void {
    if (this.control?.invalid) {
      this.errors.set(this.control.errors || null);
    } else {
      this.errors.set(null);
    }
  }

  camelCase(input: string) {
    const words = input.trim().toLowerCase().split(/\s+/);

    if (words.length === 0) {
      return '';
    }

    const firstWord = words[0];
    const transformedTail = words
      .slice(1)
      .map((currentWord) => {
        const firstCharacter = currentWord.charAt(0).toUpperCase();
        const remainingCharacters = currentWord.slice(1);
        return firstCharacter + remainingCharacters;
      })
      .join('');

    return firstWord + transformedTail;
  }

  inputId(optionLabel: string) {
    return this.groupId() + '-' + this.camelCase(optionLabel);
  }
}
