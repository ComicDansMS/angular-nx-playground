import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputFormFieldComponent } from '@ngnx-playground/ui/components/input-form-field';

@Component({
  selector: 'lib-date-picker',
  imports: [CommonModule, InputFormFieldComponent],
  template: `
    <div class="lib-date-picker relative">
      <lib-input-form-field
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
  id = input.required<string>();
  background = input.required<string>();
  displayDate = signal<string>('');
}
