import { Directive, inject, Injector, OnDestroy, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  NgControl,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';

@Directive()
export class ControlValueAccessorDirective<T>
  implements ControlValueAccessor, OnInit, OnDestroy
{
  injector = inject(Injector);
  control!: FormControl;
  isRequired = false;

  private _onChange!: (value: T) => void;
  private _onTouched!: () => T;
  private _destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.setFormControl();
    this.isRequired = this.control?.hasValidator(Validators.required) ?? false;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  setFormControl(): void {
    try {
      const formControl = this.injector.get(NgControl);

      switch (formControl.constructor) {
        case FormControlName:
          this.control = this.injector
            .get(FormGroupDirective)
            .getControl(formControl as FormControlName);
          break;
        default:
          this.control = (formControl as FormControlDirective)
            .form as FormControl;
      }
    } catch (err) {
      this.control = new FormControl();
    }
  }

  writeValue(value: T): void {
    this.control
      ? this.control.setValue(value)
      : (this.control = new FormControl(value));
  }

  registerOnChange(onChange: (value: T | null) => T): void {
    this._onChange = onChange;
  }

  registerOnTouched(onTouched: () => T): void {
    this._onTouched = onTouched;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (this.control.disabled === isDisabled) return;

    if (isDisabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }
}
