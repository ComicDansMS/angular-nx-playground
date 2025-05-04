import { Directive, inject, Injector, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  NgControl,
  Validators,
} from '@angular/forms';
import { distinctUntilChanged, Subject, takeUntil, tap } from 'rxjs';

@Directive()
export class ControlValueAccessorDirective<T>
  implements ControlValueAccessor, OnInit
{
  injector = inject(Injector);
  control!: FormControl;
  isRequired = false;

  private _onTouched!: () => T;
  private _isDisabled = false;
  private _destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.setFormControl();
    this.isRequired = this.control?.hasValidator(Validators.required) ?? false;
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
    this.control?.valueChanges
      .pipe(
        takeUntil(this._destroy$),
        distinctUntilChanged(),
        tap((value) => onChange(value))
      )
      .subscribe();
  }

  registerOnTouched(onTouched: () => T): void {
    this._onTouched = onTouched;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._isDisabled = isDisabled;
  }
}
