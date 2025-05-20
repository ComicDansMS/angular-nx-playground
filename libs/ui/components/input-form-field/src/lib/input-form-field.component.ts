import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputType } from '@ngnx-playground/ui/interfaces';
import { InputComponent } from '@ngnx-playground/input';

@Component({
  selector: 'lib-input-form-field',
  imports: [
    InputComponent,
    ReactiveFormsModule
  ],
  template: `
    <lib-input
      [control]="control()"
      [label]="label()"
      [background]="background()"
      [type]="type()"
      [placeholder]="placeholder()"
    />
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
}
