import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
} from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';
import { InputType } from '@ngnx-playground/ui/interfaces';
import { InputComponent } from '@ngnx-playground/input';
import { FormFieldErrorComponent } from '@ngnx-playground/ui/components/form-field-error';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  map,
  Observable,
} from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'lib-input-form-field',
  imports: [InputComponent, FormFieldErrorComponent, AsyncPipe],
  template: `
    <lib-input
      [control]="control()"
      [label]="label()"
      [background]="background()"
      [type]="type()"
      [placeholder]="placeholder()"
      (isFocused)="isFocused$.next($event)"
    />

    <lib-form-field-error [validationErrors]="validationErrors$ | async" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFormFieldComponent implements OnInit {
  readonly control = input.required<FormControl>();
  readonly label = input.required<string>();
  readonly background = input.required<string>();
  readonly type = input<InputType>('text');
  readonly placeholder = input<string>('');

  protected readonly isFocused$ = new BehaviorSubject<boolean>(false);
  protected validationErrors$ = new Observable<ValidationErrors | null>();

  ngOnInit() {
    this.validationErrors$ = this.isFocused$.pipe(
      filter((isFocused) => isFocused === false),
      filter(() => this.control().touched && this.control().dirty),
      map(() => this.control().errors),
      distinctUntilChanged()
    );
  }
}
