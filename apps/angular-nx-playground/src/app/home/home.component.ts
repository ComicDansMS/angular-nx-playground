import { Component } from '@angular/core';
import { LibButtonDirective } from '@crm-project/ui/components/button';
import { LibCardDirective } from '@crm-project/ui/components/card';
import InputsComponent from './ui/inputs/inputs.component';

@Component({
  selector: 'app-home',
  template: `
    <div libCard class="flex gap-4 flex-col items-center w-96 mx-auto">
      <button libButton [width]="'full'">Full width Button</button>
      <button libButton [variant]="'secondary'">Secondary</button>

      <app-inputs />
    </div>
  `,
  imports: [LibButtonDirective, LibCardDirective, InputsComponent],
})
export default class HomeComponent {}
