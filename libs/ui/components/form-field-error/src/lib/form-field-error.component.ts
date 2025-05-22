import {
  ChangeDetectionStrategy,
  Component, computed, effect,
  input,
  OnInit, signal
} from '@angular/core';
import { JsonPipe, KeyValuePipe } from '@angular/common';
import { FormControl, StatusChangeEvent, ValidationErrors } from '@angular/forms';
import { BehaviorSubject, defer, distinctUntilChanged, filter, map, Observable, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'lib-form-field-error',
  template: `
    <div
      class="lib-form-field-error"
    >
      <div class="error-content-wrapper">
        @if (errors$ | async) {
          <span>Has error!</span>
          {{ errors$ | json }}
        }
      </div>
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
  imports: [AsyncPipe, KeyValuePipe, JsonPipe]
})
export class FormFieldErrorComponent implements OnInit {
  readonly control = input.required<FormControl>();
  readonly customErrorMessages = input<Record<string, string> | null>(null);
  readonly isFocused = input.required<boolean>();

  protected readonly errors$ = defer<Observable<ValidationErrors | null>>(() => this.control().events.pipe(
    filter(event => !this.isFocused() && (event instanceof StatusChangeEvent || this.control().touched)),
    map(() => this.control().errors),
    distinctUntilChanged(),
    tap(console.log)
  ));

  errorMessages: Record<string, string> = {
    required: 'This field is required',
    email: 'Not a valid email address',
    minlength: 'This field has a min length'
  };

  ngOnInit(): void {
    if (this.customErrorMessages()) {
      this.errorMessages = {
        ...this.errorMessages,
        ...this.customErrorMessages()
      };
    }
  }
}
