import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from '@ngnx-playground/input';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'lib-date-picker',
  imports: [CommonModule, InputComponent],
  template: `
    <div class="lib-date-picker relative">
      <lib-input
        [control]="control()"
        label="Date of birth"
        id="id()"
        [placeholder]="'dd/mm/yyyy'"
        [background]="background()"
      />
    </div>
  `,
  styleUrl: './date-picker.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerComponent {
  control = input.required<FormControl>();
  id = input.required<string>();
  background = input.required<string>();
  displayDate = signal<string>('');
}
