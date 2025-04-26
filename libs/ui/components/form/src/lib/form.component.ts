import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LibCardDirective } from '@crm-project/ui/components/card';
import { FormFieldComponent } from '@crm-project/ui/components/form-field';

@Component({
  selector: 'lib-form',
  template: `
    <div libCard>
      <lib-form-field />
    </div>
  `,
  imports: [LibCardDirective, FormFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {}
