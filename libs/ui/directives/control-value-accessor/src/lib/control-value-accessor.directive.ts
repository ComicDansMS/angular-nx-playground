/* eslint-disable @typescript-eslint/no-empty-function */
import { Directive, inject, OnInit, signal } from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Directive()
export class ControlValueAccessorDirective
  implements ControlValueAccessor, OnInit
{
  controlDir = inject(NgControl, { self: true, optional: true });
  value = signal('');
  isRequired = false;
  errors = signal<ValidationErrors | null>(null);

  onChange = (value: string) => {};
  onTouched = () => {};

  constructor() {
    if (this.controlDir) {
      this.controlDir.valueAccessor = this;

      this.controlDir.control?.statusChanges.subscribe(() => {
        this.errors.set(this.controlDir?.control?.errors || null);
      });
    }
  }

  ngOnInit(): void {
    if (this.controlDir) {
      this.isRequired = !!this.controlDir.control?.hasValidator(
        Validators.required
      );
    }
  }

  writeValue(value: any): void {
    this.onChange(value);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = (rawValue: string) => {
      this.value.set(rawValue);
      this.errors.set(null);
      fn(rawValue.trim());
    };
  }

  registerOnTouched(fn: any): void {
    this.onTouched = () => {
      if (this.value().trim() === '') {
        this.value.set('');
      }

      if (this.controlDir?.control) {
        this.errors.set(this.controlDir.control.errors);
      }

      fn();
    };
  }
}
