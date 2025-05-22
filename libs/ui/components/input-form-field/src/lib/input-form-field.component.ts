import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputType } from '@ngnx-playground/ui/interfaces';
import { InputComponent } from '@ngnx-playground/input';
import { FormFieldErrorComponent } from '@ngnx-playground/ui/components/form-field-error';

@Component({
  selector: 'lib-input-form-field',
  imports: [
    InputComponent,
    ReactiveFormsModule,
    FormFieldErrorComponent
  ],
  template: `
    <lib-input
      [control]="control()"
      [label]="label()"
      [background]="background()"
      [type]="type()"
      [placeholder]="placeholder()"
      (isFocused)="isFocused.set($event)"
    />

    <lib-form-field-error [control]="control()" [isFocused]="isFocused()" />
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputFormFieldComponent {
  readonly control = input.required<FormControl>();
  readonly label = input.required<string>();
  readonly background = input.required<string>();

  readonly type = input<InputType>('text');
  readonly placeholder = input<string>('');
  protected readonly isFocused = signal(false);
}
