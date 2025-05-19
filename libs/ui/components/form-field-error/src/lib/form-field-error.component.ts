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
      @if (errors()) { @for (error of errors() | keyvalue; track $index) {
      <span>{{ errorMessages[error.key] }}</span>
      } }
    </div>
  `,
  styles: `
    .lib-form-field-error {
      height: 0;
      transition: height var(--theme-transition-duration-slow);
      overflow: hidden;
    }

    .lib-form-field-error:has(span) {
      height: 1.5rem;
    }

    .lib-form-field-error span {
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
