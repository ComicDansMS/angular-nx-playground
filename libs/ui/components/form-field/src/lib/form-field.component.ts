import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
} from '@angular/core';
import { InputComponent } from '@ngnx-playground/input';
import { FormFieldErrorComponent } from '@ngnx-playground/ui/components/form-field-error';

@Component({
  selector: 'lib-form-field',
  imports: [],
  template: ` <ng-content></ng-content> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent {
  inputComponent = contentChild(InputComponent);
  formFieldErrorComponent = contentChild(FormFieldErrorComponent);
}
