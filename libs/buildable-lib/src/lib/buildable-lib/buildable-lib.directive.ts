import { Directive } from '@angular/core';
import { HELLO_TEXT } from './hello-text';

@Directive({
  selector: 'div[libBuildableLib]',
})
export class BuildableLibDirective {
  constructor() {
    console.log(HELLO_TEXT);
  }
}
