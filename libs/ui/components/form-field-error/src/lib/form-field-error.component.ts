import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  OnInit,
  Signal,
} from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Component({
  selector: 'lib-form-field-error',
  template: `
    <div class="lib-form-field-error">
      @if (errors()) {
      <div class="error-content-wrapper">
        <span>{{ errors() }}</span>
      </div>
      }
    </div>
  `,
  styles: `
    .error-content-wrapper span {
      display: block;
      margin-top: 0.2rem;
      font-size: var(--theme-font-size-body-sm);
      color: var(--theme-color-error);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldErrorComponent implements OnInit {
  readonly validationErrors = input.required<ValidationErrors | null>();
  readonly customErrorMessages = input<Record<string, string> | null>(null);

  protected readonly errors: Signal<string | null> = computed(() => {
    const errors = this.validationErrors();

    if (errors) {
      const errorKey = Object.keys(errors)[0];
      return this.errorMessages[errorKey];
    } else {
      return null;
    }
  });

  private errorMessages: Record<string, string> = {
    required: 'This field is required',
    email: 'Not a valid email address',
    minlength: 'This field has a min length',
    maxlength: 'This field has a max length',
  };

  ngOnInit(): void {
    if (this.customErrorMessages()) {
      this.errorMessages = {
        ...this.errorMessages,
        ...this.customErrorMessages(),
      };
    }
  }
}
