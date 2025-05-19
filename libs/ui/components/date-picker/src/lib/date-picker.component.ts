import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-date-picker',
  imports: [CommonModule],
  template: `<p>DatePicker works!</p>`,
  styleUrl: './date-picker.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerComponent {}
