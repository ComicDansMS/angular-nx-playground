import {
  Component,
  ChangeDetectionStrategy,
  input,
  forwardRef,
  computed,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LibInputDirective } from '@crm-project/ui/components/input';
import { LibLabelDirective } from '@crm-project/ui/components/label';

@Component({
  selector: 'lib-input-form-field',
  template: `
    <div
      class="lib-input-form-field"
      [class.lib-input-form-field--label-small]="isLabelSmall()"
    >
      <label libLabel [for]="inputId">{{ label() }}</label>
      <input
        libInput
        #inputElement
        [placeholder]="placeholder()"
        [id]="inputId"
        (input)="handleInput(inputElement.value)"
        (focus)="onFocus()"
        (blur)="onBlur()"
      />
    </div>
  `,
  styles: `
    .lib-input-form-field {
      position: relative;
      z-index: 1;
      width: 100%;
    }
    
    label {
      position: absolute;
      z-index: -1;
      top: 50%;
      transform: translateY(-50%);
      left: 0.75rem;
      letter-spacing: 0.04rem;
      font-size: 1rem;
      transition: all 200ms;
    }

    .lib-input-form-field--label-small label {
      position: absolute;
      z-index: -1;
      top: 0.35rem;
      transform: translateY(0);
      font-size: 0.625rem;
    }

    input {
      width: 100%;
      padding: 1.375rem 0.75rem 0.5rem 0.75rem;
      height: 2.8125rem;
    }

    input::placeholder {
      transition: opacity 100ms;
    }

    .lib-input-form-field:not(.lib-input-form-field--label-small) input::placeholder {
      opacity: 0;
    }
  `,
  imports: [LibInputDirective, LibLabelDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LibInputFormFieldComponent),
      multi: true,
    },
  ],
})
export class LibInputFormFieldComponent implements ControlValueAccessor {
  inputId = crypto.randomUUID();
  label = input.required<string>();
  placeholder = input<string>('');
  value = signal<string>('');
  isDisabled = signal<boolean>(false);
  isFocused = signal<boolean>(false);
  isLabelSmall = computed(() => this.value() !== '' || this.isFocused());

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (value: any) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};

  writeValue(value: any): void {
    this.value.set(value);
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  handleInput(value: string) {
    this.value.set(value);
    this.onChange(value);
  }

  onFocus() {
    this.isFocused.set(true);
  }

  onBlur() {
    this.isFocused.set(false);
    this.onTouched();
  }
}
