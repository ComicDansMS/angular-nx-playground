import { Directive } from '@angular/core';

@Directive({
  selector: 'div[libBuildableLib]',
})
export class BuildableLibDirective {
  constructor() {
    console.log('hello world');
  }
}
