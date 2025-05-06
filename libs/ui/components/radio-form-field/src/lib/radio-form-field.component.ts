import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-radio-form-field',
  imports: [CommonModule],
  template: `<p>RadioFormField works!</p>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioFormFieldComponent {}
