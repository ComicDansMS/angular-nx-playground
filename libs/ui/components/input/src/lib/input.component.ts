import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  Injector,
  input,
  OnInit,
  signal
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
  Validators
} from '@angular/forms';
import { FormFieldErrorComponent } from '@ngnx-playground/ui/components/form-field-error';
import { filter, Subject, takeUntil } from 'rxjs';

type InputType = 'text' | 'number' | 'email' | 'password';

@Component({
  selector: 'lib-input',
  template: `
    <div
      class="lib-input"
      [class.lib-input--focus]="isFocused()"
      [class.lib-input--value]="!!value()"
      [class.lib-input--error]="!!errors()"
    >
      <div class="field">
        <label [for]="id()" [style.background]="background()">
          {{ label() }}{{ isRequired() ? '*' : '' }}
        </label>

        <input
          [required]="isRequired()"
          [type]="type()"
          [id]="id()"
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
  styleUrl: 'input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  imports: [ReactiveFormsModule, FormFieldErrorComponent]
})
export class InputComponent implements ControlValueAccessor, OnInit {
  private injector = inject(Injector);

  label = input.required<string>();
  id = input.required<string>();
  background = input.required<string>();
  type = input<InputType>('text');
  placeholder = input<string>('');
  customErrorMessages = input<Record<string, string> | null>(null);

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
  _onChange = (value: string) => {
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _onTouched = () => {
  };

  writeValue(value: string): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  handleInput(value: string): void {
    if (this.isDisabled()) return;

    const processedValue = value.trim().replace(/\s\s+/g, ' ');
    this.value.set(value);
    this._onChange(processedValue);
  }

  handleFocus(): void {
    if (this.isDisabled()) return;

    this.isFocused.set(true);
  }

  handleBlur(): void {
    if (this.isDisabled()) return;

    this._onTouched();
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
