import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnDestroy,
} from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';
import { InputType } from '@ngnx-playground/ui/interfaces';
import { InputComponent } from '@ngnx-playground/input';
import { FormFieldErrorComponent } from '@ngnx-playground/ui/components/form-field-error';
import {
  BehaviorSubject,
  combineLatestWith,
  defer,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  Subject,
  takeUntil,
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

    <lib-form-field-error
      [validationErrors]="validationErrors$ | async"
      [customErrorMessages]="customErrorMessages()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFormFieldComponent implements OnDestroy {
  readonly control = input.required<FormControl>();
  readonly label = input.required<string>();
  readonly background = input.required<string>();
  readonly type = input<InputType>('text');
  readonly placeholder = input<string>('');
  readonly customErrorMessages = input<Record<string, string> | null>(null);

  private readonly destroy$ = new Subject<void>();
  protected readonly isFocused$ = new BehaviorSubject<boolean>(false);

  // An error will not appear while typing/focused.
  // An error will disappear while typing/focused if control becomes valid.

  // Currently, if a validator becomes valid but a second validator is still invalid,
  // the initial error will not clear itself as status will not resolve to 'VALID'.
  // Ideally, the initial error would disappear and validation would run again
  // when isFocused changes to false.
  protected validationErrors$: Observable<ValidationErrors | null> = defer(() =>
    this.isFocused$.pipe(
      takeUntil(this.destroy$),
      combineLatestWith(this.control().statusChanges),
      filter(
        ([isFocused, status]) => isFocused === false || status === 'VALID'
      ),
      filter(() => this.control().touched && this.control().dirty),
      map(() => this.control().errors),
      distinctUntilChanged()
    )
  );

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
