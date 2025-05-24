import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  startWith,
  map,
} from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { InputType } from '@ngnx-playground/ui/interfaces';

@Component({
  selector: 'lib-input',
  template: `
    <fieldset class="lib-input" [style.--input-background]="background()">
      <div class="field">
        <legend [class.legend-small]="smallLegend$ | async">
          {{ label() }}
        </legend>

        <input
          [type]="type()"
          [formControl]="control()"
          [placeholder]="placeholder()"
          (focus)="this.isFocused$.next(true); this.isFocused.emit(true)"
          (blur)="this.isFocused$.next(false); this.isFocused.emit(false)"
          data-1p-ignore
        />
      </div>
    </fieldset>
  `,
  styleUrl: 'input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, AsyncPipe],
})
export class InputComponent implements OnInit {
  readonly control = input.required<FormControl>();
  readonly label = input.required<string>();
  readonly background = input.required<string>();
  readonly type = input<InputType>('text');
  readonly placeholder = input<string>('');
  readonly isFocused = output<boolean>();

  readonly isFocused$ = new BehaviorSubject<boolean>(false);
  protected smallLegend$!: Observable<boolean>;

  ngOnInit(): void {
    if (this.control()) {
      this.smallLegend$ = combineLatest([
        this.control().valueChanges.pipe(startWith(this.control().value)),
        this.isFocused$,
      ]).pipe(
        map(([controlValue, isFocused]) => {
          return !!(controlValue !== '' || isFocused);
        })
      );
    }
  }
}
