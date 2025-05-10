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
    <div class="h-6">
      @if (errors()) { @for (error of errors() | keyvalue; track $index) {
      <span class="text-red-300 text-[12px]">{{
        errorMessages[error.key]
      }}</span>
      } }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KeyValuePipe],
})
export class FormFieldErrorComponent implements OnInit {
  errors = input.required<ValidationErrors | null>();
  customErrorMessages = input<Record<string, string>>();

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
