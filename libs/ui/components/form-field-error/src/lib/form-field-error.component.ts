import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
} from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { ValidationErrors } from '@angular/forms';

@Component({
  selector: 'lib-form-field-error',
  template: `
    <div
      class="lib-form-field-error"
      [class.lib-input-form-field--active]="!!errors()"
    >
      <div class="error-content-wrapper">
        @if (errors()) { @for (error of errors() | keyvalue; track $index) {
        <span>{{ errorMessages[error.key] }}</span>
        } }
      </div>
    </div>
  `,
  styles: `
    .lib-form-field-error {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows var(--theme-transition-duration-medium);
      overflow: hidden;
    }

    .lib-form-field-error.lib-input-form-field--active {
      grid-template-rows: 1fr;
    }

    .lib-form-field-error > .error-content-wrapper {
      min-height: 0;
      visibility: hidden;
      transition: visibility var(--theme-transition-duration-medium);
    }

    .lib-form-field-error.lib-input-form-field--active > .error-content-wrapper {
      visibility: visible;
    }

    .error-content-wrapper span {
      display: block;
      margin-top: 0.2rem;
      font-size: var(--theme-font-size-caption);
      color: var(--theme-color-error);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KeyValuePipe],
})
export class FormFieldErrorComponent implements OnInit {
  errors = input.required<ValidationErrors | null>();
  customErrorMessages = input<Record<string, string> | null>(null);

  errorMessages: Record<string, string> = {
    required: 'This field is required',
    email: 'Not a valid email address',
    minlength: 'This field has a min length',
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
