/* eslint-disable @typescript-eslint/no-empty-function */
import { Directive, inject, OnDestroy, OnInit, signal } from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { filter, Subject, takeUntil, tap } from 'rxjs';

@Directive()
export class ControlValueAccessorDirective
  implements ControlValueAccessor, OnInit, OnDestroy
{
  protected controlDir = inject(NgControl, { self: true, optional: true });
  protected readonly value = signal('');
  protected readonly isDisabled = signal(false);
  protected isRequired = false;
  protected readonly errors = signal<ValidationErrors | null>(null);
  private $destroy = new Subject<void>();

  private onChange = (value: string) => {};
  private onTouched = () => {};

  constructor() {
    if (this.controlDir) {
      this.controlDir.valueAccessor = this;
    }
  }

  public ngOnInit(): void {
    if (this.controlDir) {
      const control = this.controlDir.control;
      if (!control) return;

      this.isRequired = !!control.hasValidator(Validators.required);

      control.events
        .pipe(
          takeUntil(this.$destroy),
          tap(() => console.log('control.events before')),
          filter((value) => value.source.pristine && value.source.touched),
          tap(() => console.log('control.events before'))
        )
        .subscribe(() => this.updateErrorState());

      // control.statusChanges
      //   .pipe(
      //     takeUntil(this.$destroy),
      //     tap((value) => console.log('statusChanges', value))
      //   )
      //   .subscribe(() => {
      //     this.updateErrorState();
      //   });
    }
  }

  public ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

  public writeValue(value: string): void {
    this.value.set(value === null || value === undefined ? '' : String(value));
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  public handleInputValueChange(value: string): void {
    const processedValue = value.trim().replace(/\s\s+/g, ' ');
    this.value.set(value);
    this.onChange(processedValue);
  }

  public handleInputBlur(): void {
    this.onTouched();
    this.updateErrorState();
  }

  updateErrorState(): void {
    if (this.controlDir?.control) {
      const control = this.controlDir.control;
      if (control.invalid && control.touched) {
        this.errors.set(control.errors || null);
      } else {
        this.errors.set(null);
      }
    } else {
      this.errors.set(null);
    }
  }
}
