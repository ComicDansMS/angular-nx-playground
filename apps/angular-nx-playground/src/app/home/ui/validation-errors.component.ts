import { Component, effect, input } from '@angular/core';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-validation-errors',
  template: `
    @if (errors()) { @for (error of errors() | keyvalue; track $index) {
    <span class="text-red-400">{{ errorMessages[error.key] }}</span>
    } }
  `,
  imports: [KeyValuePipe],
})
export default class ValidationErrorsComponent {
  errors = input<Record<string, string> | null>();
  customErrorMessages = input<Record<string, string>>();

  errorMessages: Record<string, string> = {
    required: 'This field is required',
  };

  customErrorMessagesEffect = effect(() => {
    if (this.customErrorMessages()) {
      this.errorMessages = {
        ...this.errorMessages,
        ...this.customErrorMessages(),
      };
    }
  });
}
