import { Component, signal } from '@angular/core';
import { LibButtonDirective } from '@crm-project/ui/button';
import { LibInputDirective } from '@crm-project/ui/input';

@Component({
  selector: 'app-inputs',
  template: `
    <div class="flex gap-2 mb-4">
      <button libButton (click)="addInput()">Add input</button>
      <button libButton (click)="removeInput()">Remove input</button>
    </div>

    <div class="flex flex-col gap-2 items-center">
      @for (input of inputs(); track input.id) {
      <input libInput type="text" libTemporary placeholder="input.." />
      }
    </div>
  `,
  imports: [LibButtonDirective, LibInputDirective],
})
export default class InputsComponent {
  inputs = signal<{ id: number }[]>([{ id: 0 }]);
  private inputCounter = 0;

  addInput() {
    this.inputCounter++;
    this.inputs.update((currentInputs) => [
      ...currentInputs,
      { id: this.inputCounter },
    ]);
  }

  removeInput() {
    this.inputs.update((currentInputs) => {
      return currentInputs.slice(0, -1);
    });
  }
}
